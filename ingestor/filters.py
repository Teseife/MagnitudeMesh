import logging

logger = logging.getLogger(__name__)

# Keywords that strongly suggest an event is oceanic/offshore and likely not of human interest
OCEAN_KEYWORDS = [
    "ocean", "ridge", "sea", "rise", "trench", "basin", 
    "off the coast", "south of", "north of", "east of", "west of"
]

def is_ocean_event(record: dict) -> bool:
    """
    Determines if a seismic event is likely an ocean/offshore event to be purged.
    
    Current Implementation:
    - Keyword matching on the 'place' property.
    
    Future Enhancement:
    - strict geospatial point-in-polygon check using shapely and a landmass shapefile.
    
    :param record: A single USGS GeoJSON feature dict.
    :return: True if it should be purged (is ocean), False if it should be kept (is land/relevant).
    """
    props = record.get('properties', {})
    place = props.get('place', '').lower()
    
    if not place:
        # If no place description, keep it to be safe (or drop? decision: keep for now)
        return False

    # Check for keywords
    for keyword in OCEAN_KEYWORDS:
        if keyword in place:
            # logger.debug(f"Purging Ocean Event: {place}")
            return True
            
    return False
