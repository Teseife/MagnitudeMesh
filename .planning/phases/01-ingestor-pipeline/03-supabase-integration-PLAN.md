---
wave: 3
depends_on: [02-transform-filter-PLAN.md]
files_modified:
  - ingestor/db.py
  - ingestor/main.py
autonomous: true
gap_closure: false
---

# Plan: Supabase Integration & Execution

## Goal
Connect the pipeline to Supabase for idempotent data persistence and run the full backfill.

## Tasks

<task>
<name>Setup Supabase Client</name>
<description>
Create `ingestor/db.py`.
Initialize Supabase client using env vars.
Implement `upsert_records(records)` function using `upsert` method with `id` as key.
Handle batching (e.g., upsert 1000 records at a time) to avoid payload limits.
</description>
<file>ingestor/db.py</file>
</task>

<task>
<name>Finalize Main Execution</name>
<description>
Update `ingestor/main.py` to call `upsert_records`.
Add command-line arguments (using `argparse`) to support `backfill` mode (historical) vs `cron` mode (recent).
Implement the full backfill loop strategy (e.g., iterating by year/month) for the `backfill` mode.
</description>
<file>ingestor/main.py</file>
</task>

## Verification
- [ ] Data is successfully written to Supabase.
- [ ] Upserts update existing records without creating duplicates.
- [ ] Backfill mode successfully iterates through historical ranges.
- [ ] Cron mode fetches only recent data.

## Must Haves
- functional Supabase integration.
- Idempotent data storage.
- CLI support for backfill and cron operations.
