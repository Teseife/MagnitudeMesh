---
wave: 1
depends_on: []
files_modified:
  - ingestor/requirements.txt
  - ingestor/db.py
  - ingestor/filters.py
  - ingestor/transform.py
autonomous: true
gap_closure: false
---

# Plan: Refactor Modules for Resilience

## Goal
Optimize existing modules to support the new orchestrator, including batch database operations, online geocoding, and timezones.

## Tasks

<task>
<name>Update Dependencies</name>
<description>
Add `geopy` to `ingestor/requirements.txt`.
</description>
<file>ingestor/requirements.txt</file>
</task>

<task>
<name>Optimize Database Module</name>
<description>
Refactor `ingestor/db.py`:
- Ensure `upsert_records` handles batches of 1000 efficiently.
- Add error handling to prevent one bad batch from crashing the whole run (log and continue).
</description>
<file>ingestor/db.py</file>
</task>

<task>
<name>Enhance Filters with Geocoding</name>
<description>
Refactor `ingestor/filters.py`:
- Implement `enrich_location(record)` using `geopy` (Nominatim or similar).
- Add rate limiting for Geopy (1 request per second max, or per provider limits).
- Extract "Country" and "Continent" (if possible) and add to properties.
- Ensure `is_ocean_event` uses the Ocean Purge logic.
</description>
<file>ingestor/filters.py</file>
</task>

<task>
<name>Verify Transformations</name>
<description>
Refactor `ingestor/transform.py`:
- Verify `convert_to_est` handles timezone awareness correctly.
- Ensure `flatten_record` includes the new enriched fields (Country/Continent) if available.
</description>
<file>ingestor/transform.py</file>
</task>

## Verification
- [ ] `pip install geopy` works.
- [ ] `upsert_records` processes 1000+ records in chunks.
- [ ] Geocoding adds location data to records.
