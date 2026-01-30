# Requirements: Resilient Data Orchestration

## v1 Requirements

### Refactoring
- [x] **REF-01**: Optimize `ingestor/db.py` for batch upserts (1000 rows/batch).
- [x] **REF-02**: Update `ingestor/filters.py` with Ocean Purge and Online Geocoding (geopy).
- [x] **REF-03**: Ensure `ingestor/transform.py` handles UTC-to-EST and felt_radius_km.

### Orchestrator
- [x] **ORC-01**: Implement `ingestor/orchestrator.py` with `checkpoint.json` state tracking.
- [x] **ORC-02**: Implement Year-by-Year loop (2010-Present).
- [x] **ORC-03**: Implement Adaptive Time-Splitting (Year -> Month -> Week -> Day max).
- [x] **ORC-04**: Implement Exponential Backoff logic for API rate limiting (maximize throughput).

### Automation
- [x] **AUTO-01**: Create `ingestor/run_ingest.bat` for Windows execution.

## Traceability
| Req ID | Phase | Plan | Status |
|--------|-------|------|--------|
| (Populated by roadmap) | | | |