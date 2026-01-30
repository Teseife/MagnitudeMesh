import requests
import logging
import time
from datetime import datetime, timedelta
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

USGS_API_URL = "https://earthquake.usgs.gov/fdsnws/event/1/query"

def get_session():
    """
    Creates a requests session with retry logic for resilience.
    """
    session = requests.Session()
    retries = Retry(
        total=5,
        backoff_factor=1,
        status_forcelist=[429, 500, 502, 503, 504],
        allowed_methods=["GET"]
    )
    adapter = HTTPAdapter(max_retries=retries)
    session.mount("https://", adapter)
    session.mount("http://", adapter)
    return session

def fetch_usgs_data(start_time: datetime, end_time: datetime):
    """
    Fetches earthquake data from USGS API for a given time range.
    Handles pagination by splitting requests if the limit (20k) is reached.
    
    :param start_time: Start datetime (UTC)
    :param end_time: End datetime (UTC)
    :yield: List of earthquake features (GeoJSON)
    """
    session = get_session()
    
    # Convert datetimes to ISO8601 strings
    params = {
        "format": "geojson",
        "starttime": start_time.isoformat(),
        "endtime": end_time.isoformat(),
        "limit": 20000,  # USGS limit
        "orderby": "time-asc" # Ensure strict ordering for pagination if needed (though time splitting is preferred)
    }

    try:
        logger.info(f"Fetching data from {params['starttime']} to {params['endtime']}")
        # Explicitly request GeoJSON via headers and query params
        response = session.get(
            USGS_API_URL, 
            params=params, 
            headers={"Accept": "application/json"},
            timeout=30
        )
        response.raise_for_status()
        
        data = response.json()
        count = data.get('metadata', {}).get('count', 0)
        logger.info(f"Fetched {count} records.")

        if count >= 20000:
            logger.warning("Record limit reached. Splitting time range...")
            mid_time = start_time + (end_time - start_time) / 2
            yield from fetch_usgs_data(start_time, mid_time)
            yield from fetch_usgs_data(mid_time, end_time)
        else:
            yield data.get('features', [])

    except requests.exceptions.RequestException as e:
        logger.error(f"API Request failed: {e}")
        raise
