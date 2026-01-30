---
wave: 2
depends_on: [01-refactor-modules-PLAN.md]
files_modified:
  - ingestor/orchestrator.py
autonomous: true
gap_closure: false
---

# Plan: Implement Orchestrator Logic

## Goal
Build the `orchestrator.py` engine with checkpointing, adaptive time-splitting, and exponential backoff.

## Tasks

<task>
<name>Implement Checkpointing</name>
<description>
Create `ingestor/orchestrator.py`.
Implement `load_checkpoint()`: Read `checkpoint.json`, return last processed timestamp (or 2010-01-01 default).
Implement `save_checkpoint(timestamp)`: Write timestamp to `checkpoint.json`.
</description>
<file>ingestor/orchestrator.py</file>
</task>

<task>
<name>Implement Adaptive Time-Splitting</name>
<description>
In `ingestor/orchestrator.py`:
- Create `fetch_with_limits(start, end, depth=0)`.
- If API returns 20k count, split time range in half (or months/weeks) and recurse.
- Max recursion depth: Stop at "Day" level to prevent infinite loops (Requirement: Safe Limit).
</description>
<file>ingestor/orchestrator.py</file>
</task>

<task>
<name>Implement Exponential Backoff</name>
<description>
In `ingestor/orchestrator.py`:
- Implement a robust request wrapper.
- On 429/5xx errors, sleep for `base * 2^retries`.
- Reset on success.
</description>
<file>ingestor/orchestrator.py</file>
</task>

<task>
<name>Implement Main Loop</name>
<description>
In `ingestor/orchestrator.py`:
- Loop from Checkpoint Date to Present.
- Fetch data -> Enrich (Geocode) -> Upsert.
- Save checkpoint after each successful chunk (e.g., each Month).
</description>
<file>ingestor/orchestrator.py</file>
</task>

## Verification
- [ ] `checkpoint.json` is created and updated.
- [ ] Stopping and restarting the script resumes from the last date.
- [ ] Large time ranges (years) automatically split into smaller chunks when 20k limit is hit.
