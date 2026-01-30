import os
import sys
import logging
from dotenv import load_dotenv

# Ensure we can import modules from the parent directory
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from ingestor.db import get_supabase_client

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(message)s')
logger = logging.getLogger("dbtest")

def test_connection():
    logger.info("=== SUPABASE CONNECTION TEST ===")
    
    # 1. Load Environment Variables explicitly from ingestor/.env
    env_path = os.path.join(os.path.dirname(__file__), '.env')
    loaded = load_dotenv(env_path)
    
    if not loaded:
        logger.error(f"FAILED: Could not find or load .env file at {env_path}")
        return

    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_KEY")

    if not url or not key:
        logger.error("FAILED: SUPABASE_URL or SUPABASE_KEY missing from .env")
        return

    logger.info(f"Loaded credentials for: {url}")

    try:
        # 2. Initialize Client
        client = get_supabase_client()
        logger.info("Client initialized successfully.")

        # 3. Test Query (Count rows in 'earthquakes')
        logger.info("Attempting to query 'earthquakes' table...")
        
        # 'count' method is efficient for checking table access
        response = client.table("earthquakes").select("*", count="exact").limit(1).execute()
        
        count = response.count
        data = response.data
        
        logger.info(f"SUCCESS! Connected to table 'earthquakes'.")
        logger.info(f"Current row count: {count}")
        
        if count > 0:
            logger.info("Sample record ID: " + data[0].get('id'))

    except Exception as e:
        logger.error(f"CONNECTION FAILED: {e}")
        logger.error("Check your URL, KEY, and ensure table 'earthquakes' exists.")

if __name__ == "__main__":
    test_connection()
