# Summary: Supabase Integration & Execution

## Completed Tasks
- [x] **Setup Supabase Client:** Created `ingestor/db.py` with `upsert_records` function handling batching.
- [x] **Finalize Main Execution:** Updated `ingestor/main.py` with `argparse` to support:
    - `cron` mode (default, last 1h 10m).
    - `backfill` mode (requires --start and --end dates).
    - Integrated `upsert_records` into the pipeline loop.

## Verification
- `upsert_records` iterates in chunks of 1000.
- `main.py` parses arguments correctly (verified via code structure).
- Pipeline flow `Fetch -> Filter -> Transform -> Upsert` is complete.

## Notes
- Requires valid `SUPABASE_URL` and `SUPABASE_KEY` in `.env` to run successfully.
- The `earthquakes` table must exist in Supabase with matching schema (id, magnitude, etc.).
