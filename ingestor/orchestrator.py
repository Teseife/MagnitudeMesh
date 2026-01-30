import json
import logging
import time
import math
from datetime import datetime, timedelta
import requests
from requests.exceptions import RequestException
import os

from ingestor.filters import is_ocean_event, enrich_location
from ingestor.transform import flatten_record
from ingestor.db import upsert_records

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

CHECKPOINT_FILE = "ingestor/checkpoint.json"
USGS_API_URL = "https://earthquake.usgs.gov/fdsnws/event/1/query"
MAX_RECURSION_DEPTH = 5 # Safety limit to prevent infinite splitting

def load_checkpoint() -> datetime:
    """Loads the last successfully processed timestamp from checkpoint.json."""
    if os.path.exists(CHECKPOINT_FILE):
        try:
            with open(CHECKPOINT_FILE, 'r') as f:
                data = json.load(f)
                timestamp_str = data.get('last_processed_timestamp')
                if timestamp_str:
                    return datetime.fromisoformat(timestamp_str)
        except Exception as e:
            logger.warning(f"Failed to load checkpoint: {e}")
    
    # Default start date: Jan 1, 2010
    return datetime(2010, 1, 1)

def save_checkpoint(timestamp: datetime):
    """Saves the current timestamp to checkpoint.json."""
    try:
        with open(CHECKPOINT_FILE, 'w') as f:
            json.dump({'last_processed_timestamp': timestamp.isoformat()}, f)
        logger.info(f"Checkpoint saved: {timestamp.isoformat()}")
    except Exception as e:
        logger.error(f"Failed to save checkpoint: {e}")

def fetch_with_backoff(params: dict, retries: int = 5, base_delay: int = 2) -> dict:
    """
    Fetches data with exponential backoff for 429/5xx errors.
    """
    attempt = 0
    while attempt <= retries:
        try:
            # Explicitly request GeoJSON
            response = requests.get(
                USGS_API_URL, 
                params=params, 
                headers={"Accept": "application/json"},
                timeout=30
            )
            
            if response.status_code == 200:
                return response.json()
            
            if response.status_code in [429, 500, 502, 503, 504]:
                sleep_time = base_delay * (2 ** attempt)
                logger.warning(f"API {response.status_code}. Retrying in {sleep_time}s...")
                time.sleep(sleep_time)
                attempt += 1
            else:
                response.raise_for_status()
                
        except RequestException as e:
            logger.warning(f"Request failed: {e}. Retrying...")
            time.sleep(base_delay * (2 ** attempt))
            attempt += 1

    raise Exception(f"Max retries exceeded for params: {params}")

def fetch_and_process_chunk(start: datetime, end: datetime, depth: int = 0):
    """
    Recursively fetches data for a time range. Splits if 20k limit is hit.
    """
    if depth > MAX_RECURSION_DEPTH:
        logger.error(f"Max recursion depth reached at {start} to {end}. Skipping range.")
        return

    params = {
        "format": "geojson",
        "starttime": start.isoformat(),
        "endtime": end.isoformat(),
        "limit": 20000,
        "orderby": "time-asc"
    }

    try:
        data = fetch_with_backoff(params)
        count = data.get('metadata', {}).get('count', 0)
        
        if count >= 20000:
            logger.warning(f"Limit reached ({count}) for {start} to {end}. Splitting...")
            mid = start + (end - start) / 2
            fetch_and_process_chunk(start, mid, depth + 1)
            fetch_and_process_chunk(mid, end, depth + 1)
            return

        features = data.get('features', [])
        if not features:
            logger.info(f"No records found for {start} to {end}")
            return

        processed_batch = []
        for record in features:
            if is_ocean_event(record):
                continue
            
            try:
                # Enrichment (Geocoding) - Note: Rate limited, might be slow
                enrichment = enrich_location(record)
                
                flat_record = flatten_record(record, enrichment)
                processed_batch.append(flat_record)
            except Exception as e:
                logger.warning(f"Skipping record {record.get('id')}: {e}")

        # Upsert batch
        if processed_batch:
            upsert_records(processed_batch)
            logger.info(f"Processed chunk {start.date()} to {end.date()}: {len(processed_batch)} records.")

    except Exception as e:
        logger.error(f"Failed to process chunk {start} to {end}: {e}")
        # In a real scenario, we might want to raise here to stop the orchestrator
        # so we don't save a bad checkpoint.
        raise

def run_orchestrator(mode: str = 'backfill'):
    logger.info(f"Starting Orchestrator in {mode} mode.")
    
    current_time = load_checkpoint()
    now = datetime.utcnow()
    
    # Iterate month by month to be safe and allow frequent checkpointing
    while current_time < now:
        # Define next chunk (e.g., 1 month)
        # Using 30 days approximation for simplicity
        next_time = min(current_time + timedelta(days=30), now)
        
        logger.info(f"Processing range: {current_time} to {next_time}")
        
        try:
            fetch_and_process_chunk(current_time, next_time)
            
            # Save checkpoint after successful processing of the range
            # We save 'next_time' as the new start point
            save_checkpoint(next_time)
            current_time = next_time
            
        except Exception as e:
            logger.critical(f"Orchestrator crashed at {current_time}: {e}")
            break

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--mode", default="backfill", choices=["backfill", "cron"])
    args = parser.parse_args()
    
    run_orchestrator(args.mode)
