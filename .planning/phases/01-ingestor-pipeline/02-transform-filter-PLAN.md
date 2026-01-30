---
wave: 2
depends_on: [01-setup-ingestor-PLAN.md]
files_modified:
  - ingestor/main.py
  - ingestor/transform.py
  - ingestor/filters.py
autonomous: true
gap_closure: false
---

# Plan: Implement Data Transformation & Filtering

## Goal
Implement the business logic for data cleanup, "Ocean Purge", and scientific enrichment (felt radius, timezone conversion).

## Tasks

<task>
<name>Implement Ocean Purge</name>
<description>
Create `ingestor/filters.py`.
Implement `is_ocean_event(record)` using geospatial checks (Lat/Lon) with `shapely` or `reverse_geocoder`.
Implement fallback keyword check for `place` property ("Ocean", "Ridge", etc.).
</description>
<file>ingestor/filters.py</file>
</task>

<task>
<name>Implement Transformations</name>
<description>
Create `ingestor/transform.py`.
Implement `calculate_felt_radius(magnitude, depth)` using the formula: R = 10^(0.45*M - 1.88) * sqrt(D).
Implement `convert_to_est(timestamp_ms)` to convert UTC to America/New_York.
Implement `flatten_record(record)` to restructure GeoJSON into a flat dictionary for DB insertion.
</description>
<file>ingestor/transform.py</file>
</task>

<task>
<name>Integrate Logic into Main Loop</name>
<description>
Update `ingestor/main.py` to use filters and transformations.
Process fetched records through the pipeline: Fetch -> Filter -> Transform.
Collect processed records for batch insertion.
</description>
<file>ingestor/main.py</file>
</task>

## Verification
- [ ] Ocean purge correctly identifies offshore points.
- [ ] Felt radius calculation matches expected values for sample inputs.
- [ ] Timezone conversion is accurate.
- [ ] Transformed data structure matches Supabase schema requirements.

## Must Haves
- robust "Ocean Purge" filter.
- Accurate scientific calculations.
- Clean data transformation pipeline.
