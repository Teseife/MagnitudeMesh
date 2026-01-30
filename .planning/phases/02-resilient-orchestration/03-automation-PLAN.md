---
wave: 3
depends_on: [02-implement-orchestrator-PLAN.md]
files_modified:
  - ingestor/run_ingest.bat
autonomous: true
gap_closure: false
---

# Plan: Automation Scripts

## Goal
Create a Windows batch script for easy execution of the backfill process.

## Tasks

<task>
<name>Create Windows Launcher</name>
<description>
Create `ingestor/run_ingest.bat`.
- Activate `.venv`.
- Run `python ingestor/orchestrator.py --mode backfill`.
- Add `pause` at the end to see output on completion/error.
</description>
<file>ingestor/run_ingest.bat</file>
</task>

## Verification
- [ ] Double-clicking `run_ingest.bat` launches the orchestrator in the correct env.
