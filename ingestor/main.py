import logging
import os
from datetime import datetime, timedelta
from dotenv import load_dotenv
from ingestor.utils import fetch_usgs_data
from ingestor.filters import is_ocean_event
from ingestor.transform import flatten_record

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def main():
    """
    Main ingestion loop.
    Fetches, filters, transforms, and prepares data.
    """
    logger.info("Starting MagnitudeMesh Ingestor...")

    # Default: Fetch last 24 hours if no args (placeholder for future CLI args)
    end_time = datetime.utcnow()
    start_time = end_time - timedelta(days=1)

    logger.info(f"Execution Mode: Fetching from {start_time} to {end_time}")

    try:
        total_fetched = 0
        total_kept = 0
        processed_records = []

        for batch in fetch_usgs_data(start_time, end_time):
            batch_count = len(batch)
            total_fetched += batch_count
            
            for record in batch:
                # 1. Filter: Ocean Purge
                if is_ocean_event(record):
                    continue
                
                # 2. Transform: Flatten & Enrich
                try:
                    flat_record = flatten_record(record)
                    processed_records.append(flat_record)
                    total_kept += 1
                except Exception as e:
                    logger.warning(f"Failed to transform record {record.get('id')}: {e}")

            logger.info(f"Batch processed. Fetched: {batch_count}. Total Kept so far: {total_kept}")

            # TODO: In next phase, we will upsert `processed_records` to Supabase here
            # For now, clear the list to avoid memory issues in a real large run
            # processed_records.clear() 
        
        logger.info(f"Ingestion complete. Fetched: {total_fetched}, Kept: {total_kept}, Purged: {total_fetched - total_kept}")

    except Exception as e:
        logger.error(f"Ingestion failed: {e}")
        exit(1)

if __name__ == "__main__":
    main()