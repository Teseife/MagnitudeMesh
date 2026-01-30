import os
import logging
from typing import List, Dict, Any
from supabase import create_client, Client

logger = logging.getLogger(__name__)

# Batch size for upserts to avoid payload limits
# Lowered to 100 to provide faster feedback during slow geocoding runs
BATCH_SIZE = 100

def get_supabase_client() -> Client:
    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_KEY")
    if not url or not key:
        raise ValueError("Missing SUPABASE_URL or SUPABASE_KEY environment variables.")
    return create_client(url, key)

def upsert_records(records: List[Dict[str, Any]], table_name: str = "earthquakes"):
    """
    Upserts a list of records into the specified Supabase table.
    Handles batching to prevent API errors.
    Catches errors per batch to ensure pipeline resilience.
    
    :param records: List of flattened record dictionaries.
    :param table_name: Name of the table in Supabase.
    """
    if not records:
        return

    client = get_supabase_client()
    total_records = len(records)
    
    logger.info(f"Starting batch upsert for {total_records} records...")
    
    for i in range(0, total_records, BATCH_SIZE):
        batch = records[i : i + BATCH_SIZE]
        try:
            # upsert based on 'id' (primary key)
            response = client.table(table_name).upsert(batch).execute()
            logger.info(f"Upserted batch {i // BATCH_SIZE + 1}: {len(batch)} records.")
        except Exception as e:
            logger.error(f"Failed to upsert batch starting at index {i}: {e}")
            # Continue to next batch - don't crash the pipeline
            continue