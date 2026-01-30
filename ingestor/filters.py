import logging
import time
from geopy.geocoders import Nominatim
from geopy.extra.rate_limiter import RateLimiter
from geopy.exc import GeocoderTimedOut, GeocoderServiceError

logger = logging.getLogger(__name__)

# Keywords that strongly suggest an event is oceanic/offshore
OCEAN_KEYWORDS = [
    "ocean", "ridge", "sea", "rise", "trench", "basin", 
    "off the coast", "south of", "north of", "east of", "west of"
]

# Initialize Geocoder with a user agent
geolocator = Nominatim(user_agent="magnitude_mesh_ingestor")
# 1 request per second to respect usage policy
geocode = RateLimiter(geolocator.geocode, min_delay_seconds=1.0)

def is_ocean_event(record: dict) -> bool:
    """
    Determines if a seismic event is likely an ocean/offshore event to be purged.
    """
    props = record.get('properties', {})
    place = props.get('place')
    
    if not place:
        return False
        
    place = place.lower()

    for keyword in OCEAN_KEYWORDS:
        if keyword in place:
            return True
            
    return False

def enrich_location(record: dict) -> dict:
    """
    Enriches the record with 'country' and 'continent' using Geopy.
    Note: This is slow due to rate limiting.
    
    :param record: USGS GeoJSON feature.
    :return: Dictionary with 'country' and 'continent' keys.
    """
    coords = record.get('geometry', {}).get('coordinates', [])
    if len(coords) < 2:
        return {"country": None, "continent": None}
        
    lon, lat = coords[0], coords[1]
    
    try:
        # language='en' ensures English names
        location = geocode(f"{lat}, {lon}", language='en')
        if location:
            address = location.raw.get('address', {})
            return {
                "country": address.get('country'),
                # Continent isn't always directly available in Nominatim, 
                # usually requires mapping country codes to continents.
                # For now, we'll store country.
                "continent": None # Placeholder for future expansion
            }
    except (GeocoderTimedOut, GeocoderServiceError) as e:
        logger.warning(f"Geocoding failed for {lat}, {lon}: {e}")
    except Exception as e:
        logger.warning(f"Unexpected geocoding error: {e}")
        
    return {"country": None, "continent": None}