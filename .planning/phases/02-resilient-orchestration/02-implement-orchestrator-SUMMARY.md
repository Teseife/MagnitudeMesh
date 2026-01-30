# Summary: Implement Orchestrator Logic

## Completed Tasks
- [x] **Implement Checkpointing:** Created `ingestor/orchestrator.py` with `load_checkpoint` and `save_checkpoint` handling `checkpoint.json`.
- [x] **Implement Adaptive Time-Splitting:** Implemented `fetch_and_process_chunk` which recurses if USGS returns 20k records. Max recursion depth added.
- [x] **Implement Exponential Backoff:** Created `fetch_with_backoff` handling 429/5xx errors with exponential sleep.
- [x] **Implement Main Loop:** `run_orchestrator` iterates in monthly chunks from the checkpoint date to present, integrating filtering, enrichment, and upserting.

## Verification
- `checkpoint.json` logic verified via code structure.
- Backoff logic correctly multiplies delay.
- Recursion splits time range in half on limit hit.
- Integration calls `is_ocean_event`, `enrich_location`, `flatten_record`, and `upsert_records`.

## Notes
- The default start date is 2010-01-01 if no checkpoint exists.
- The iteration step is ~30 days, which is a safe default given the adaptive splitting.
