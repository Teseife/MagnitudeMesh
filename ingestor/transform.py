import math
import logging
from datetime import datetime
import pytz

logger = logging.getLogger(__name__)

EST_ZONE = pytz.timezone('America/New_York')

def calculate_felt_radius(magnitude: float, depth_km: float) -> float:
    """
    Calculates the estimated 'felt radius' in kilometers.
    Formula: R = 10^(0.45*M - 1.88) * sqrt(D)
    """
    if magnitude is None or depth_km is None:
        return 0.0
    
    safe_depth = max(depth_km, 1.0)
    
    try:
        base_factor = 10 ** (0.45 * magnitude - 1.88)
        radius = base_factor * math.sqrt(safe_depth)
        return round(radius, 2)
    except Exception as e:
        logger.warning(f"Error calculating radius: {e}")
        return 0.0

def convert_to_est(timestamp_ms: int) -> str:
    """
    Converts USGS UTC timestamp (ms) to ISO8601 string in EST.
    """
    if timestamp_ms is None:
        return None
        
    timestamp_s = timestamp_ms / 1000.0
    utc_dt = datetime.utcfromtimestamp(timestamp_s).replace(tzinfo=pytz.utc)
    est_dt = utc_dt.astimezone(EST_ZONE)
    return est_dt.isoformat()

def flatten_record(record: dict, enrichment_data: dict = None) -> dict:
    """
    Flattens a USGS GeoJSON feature into a dictionary matching the Supabase schema.
    Includes optional enrichment data (country, continent).
    
    :param record: USGS GeoJSON feature.
    :param enrichment_data: Dict containing 'country', 'continent', etc.
    :return: Flattened dictionary.
    """
    if enrichment_data is None:
        enrichment_data = {}

    props = record.get('properties', {})
    geom = record.get('geometry', {})
    coords = geom.get('coordinates', [None, None, None]) # lon, lat, depth
    
    usgs_id = record.get('id')
    magnitude = props.get('mag')
    place = props.get('place')
    time_ms = props.get('time')
    depth = coords[2] if len(coords) > 2 else 0
    
    felt_radius = calculate_felt_radius(magnitude, depth)
    incident_time_est = convert_to_est(time_ms)
    
    return {
        "id": usgs_id,
        "magnitude": magnitude,
        "place": place,
        # "time_utc": time_ms, # Removed to match SQL schema
        "incident_time_est": incident_time_est,
        "longitude": coords[0],
        "latitude": coords[1],
        "depth": depth,
        "felt_radius_km": felt_radius,
        # "url": props.get('url'), # Removed to match SQL schema
        "felt_count": props.get('felt', 0) or 0,
        # "country": enrichment_data.get('country'), # Removed to match SQL schema
        # "continent": enrichment_data.get('continent') # Removed to match SQL schema
    }