import logging
import json
import sys
import os

# Ensure we can import modules from the parent directory
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from ingestor.orchestrator import fetch_with_backoff
from ingestor.filters import is_ocean_event, enrich_location
from ingestor.transform import flatten_record

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(message)s')
logger = logging.getLogger("testzone")

def run_test():
    logger.info("=== MAGNITUDEMESH PIPELINE TEST ===")
    
    # 1. Fetch 5 most recent earthquakes
    logger.info("\n[STEP 1] FETCHING LIVE DATA (Limit: 5)")
    params = {
        "format": "geojson",
        "limit": 5,
        "orderby": "time"
    }
    
    try:
        # Use the Orchestrator's robust fetcher
        data = fetch_with_backoff(params)
        features = data.get('features', [])
        logger.info(f"Successfully fetched {len(features)} records.")
        
        if not features:
            logger.warning("No records found.")
            return

        # 2. Show Raw Data Sample
        logger.info("\n[STEP 2] RAW API RESPONSE (First Record Only)")
        first_record = features[0]
        print(json.dumps(first_record, indent=2))
        
        # 3. Process Records
        logger.info("\n[STEP 3] PROCESSING PIPELINE")
        
        for i, record in enumerate(features):
            place = record.get('properties', {}).get('place', 'Unknown')
            logger.info(f"\n--- Processing Record {i+1}: {place} ---")
            
            # A. Filter Logic
            is_ocean = is_ocean_event(record)
            logger.info(f"Filter Check (is_ocean): {is_ocean}")
            
            if is_ocean:
                logger.info("Result: PURGED (Oceanic Event)")
                continue
                
            # B. Enrichment Logic (Geocoding)
            logger.info("Enrichment: Geocoding coordinates...")
            enrichment = enrich_location(record)
            logger.info(f"Geocoding Result: {enrichment}")
            
            # C. Transformation Logic
            logger.info("Transformation: Calculating radius & normalizing time...")
            flat_record = flatten_record(record, enrichment)
            
            # 4. Output Final Data
            logger.info("Result: READY TO PUSH")
            print(json.dumps(flat_record, indent=2, default=str))

    except Exception as e:
        logger.error(f"Test failed: {e}")

if __name__ == "__main__":
    run_test()