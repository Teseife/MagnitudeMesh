# Summary: Implement Data Transformation & Filtering

## Completed Tasks
- [x] **Implement Ocean Purge:** Created `ingestor/filters.py` with keyword-based filtering for offshore events.
- [x] **Implement Transformations:** Created `ingestor/transform.py` with:
    - `calculate_felt_radius`: Implements $R = 10^{(0.45 	imes M - 1.88)} 	imes \sqrt{D}$.
    - `convert_to_est`: Converts UTC ms to America/New_York ISO strings.
    - `flatten_record`: Prepares data for Supabase schema.
- [x] **Integrate Logic into Main Loop:** Updated `ingestor/main.py` to run the Fetch -> Filter -> Transform pipeline.

## Verification
- `is_ocean_event` correctly filters based on "Ocean", "Ridge", etc.
- `calculate_felt_radius` handles edge cases (zero depth).
- `convert_to_est` correctly handles timezone offset.
- Main loop logs confirm "Fetched" vs "Kept" counts, validating the filter's effect.

## Notes
- "Geospatial" check currently relies on `place` text string fallback. Full point-in-polygon implementation deferred to future enhancement but architecture supports it.
