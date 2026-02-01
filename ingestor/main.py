import logging
import argparse
from datetime import datetime, timedelta
from dotenv import load_dotenv
from ingestor.utils import fetch_usgs_data
from ingestor.filters import is_ocean_event
from ingestor.transform import flatten_record
from ingestor.db import upsert_records, get_latest_timestamp

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def parse_args():
    parser = argparse.ArgumentParser(description="MagnitudeMesh Ingestor")
    subparsers = parser.add_subparsers(dest="mode", help="Execution mode")

    # Cron Mode (Default)
    cron_parser = subparsers.add_parser("cron", help="Fetch recent data (last 1 hour)")
    
    # Backfill Mode
    backfill_parser = subparsers.add_parser("backfill", help="Backfill historical data")
    backfill_parser.add_argument("--start", type=str, required=True, help="Start date (YYYY-MM-DD)")
    backfill_parser.add_argument("--end", type=str, required=True, help="End date (YYYY-MM-DD)")

    return parser.parse_args()

def run_pipeline(start_time: datetime, end_time: datetime):
    """
    Runs the ingestion pipeline for a specific time range.
    """
    logger.info(f"Pipeline running from {start_time} to {end_time}")
    
    total_fetched = 0
    total_kept = 0
    processed_batch = []

    try:
        # USGS fetcher yields batches of raw GeoJSON features
        for raw_batch in fetch_usgs_data(start_time, end_time):
            batch_count = len(raw_batch)
            total_fetched += batch_count
            
            for record in raw_batch:
                # 1. Filter: Ocean Purge
                if is_ocean_event(record):
                    continue
                
                # 2. Transform: Flatten & Enrich
                try:
                    flat_record = flatten_record(record)
                    processed_batch.append(flat_record)
                    total_kept += 1
                except Exception as e:
                    logger.warning(f"Failed to transform record {record.get('id')}: {e}")

            # 3. Load: Upsert to Supabase
            if processed_batch:
                upsert_records(processed_batch)
                processed_batch.clear() # Clear memory after upsert
            
            logger.info(f"Batch processed. Fetched so far: {total_fetched}. Kept so far: {total_kept}")

    except Exception as e:
        logger.error(f"Pipeline failed: {e}")
        exit(1)
        
    logger.info(f"Ingestion complete. Fetched: {total_fetched}, Kept: {total_kept}, Purged: {total_fetched - total_kept}")

def main():
    args = parse_args()
    
    if args.mode == "backfill":
        try:
            start_date = datetime.strptime(args.start, "%Y-%m-%d")
            end_date = datetime.strptime(args.end, "%Y-%m-%d")
            # For massive backfills, we could split by month here, but fetch_usgs_data handles
            # pagination/splitting recursively. A month-by-month loop here would be safer for memory
            # if we weren't yielding generators, but since we are, direct call is okay.
            run_pipeline(start_date, end_date)
        except ValueError:
            logger.error("Invalid date format. Use YYYY-MM-DD.")
            exit(1)
            
    else: # Default to 'cron' logic
        # Data-Driven Checkpoint:
        # Fetch everything since the last known earthquake in our DB.
        # This handles gaps automatically (e.g., system down for 3 days -> fetch 3 days).
        start_time = get_latest_timestamp()
        
        # Add a tiny buffer (1 min) to avoid fetching the exact same last record
        # though UPSERT handles duplicates safely anyway.
        # Ensure we don't go into the future if DB has "future" timestamps (rare bug)
        end_time = datetime.utcnow()
        
        if start_time > end_time:
             logger.warning(f"DB timestamp {start_time} is in the future? Resetting to 1 hour ago.")
             start_time = end_time - timedelta(hours=1)
             
        run_pipeline(start_time, end_time)

if __name__ == "__main__":
    main()
