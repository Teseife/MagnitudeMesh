import logging
import os
from datetime import datetime, timedelta
from dotenv import load_dotenv
from ingestor.utils import fetch_usgs_data

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def main():
    """
    Main ingestion loop.
    Currently set up to fetch the last 30 days of data as a test/default.
    """
    logger.info("Starting MagnitudeMesh Ingestor...")

    # Default: Fetch last 24 hours if no args (placeholder for future CLI args)
    end_time = datetime.utcnow()
    start_time = end_time - timedelta(days=1)

    logger.info(f"Execution Mode: Fetching from {start_time} to {end_time}")

    try:
        total_records = 0
        for batch in fetch_usgs_data(start_time, end_time):
            # Transformation and Database logic will go here in future phases
            batch_count = len(batch)
            total_records += batch_count
            logger.info(f"Processed batch of {batch_count} records.")
        
        logger.info(f"Ingestion complete. Total records fetched: {total_records}")

    except Exception as e:
        logger.error(f"Ingestion failed: {e}")
        exit(1)

if __name__ == "__main__":
    main()
