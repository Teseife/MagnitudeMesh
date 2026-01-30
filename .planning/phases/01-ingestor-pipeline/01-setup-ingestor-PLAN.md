---
wave: 1
depends_on: []
files_modified:
  - ingestor/requirements.txt
  - ingestor/main.py
  - ingestor/utils.py
  - .github/workflows/ingest_cron.yaml
autonomous: true
gap_closure: false
---

# Plan: Setup Ingestor Pipeline

## Goal
Establish the core Python ingestion pipeline, including environment setup, dependency management, and the main script skeleton for fetching USGS data.

## Tasks

<task>
<name>Setup Python Environment</name>
<description>
Create `ingestor/requirements.txt` with necessary dependencies:
- requests
- supabase
- pytz
- shapely
- python-dotenv

Create `ingestor/.env.example` template.
</description>
<file>ingestor/requirements.txt</file>
</task>

<task>
<name>Create Ingestor Skeleton</name>
<description>
Create `ingestor/main.py` with the main execution loop structure.
Implement basic logging configuration.
Create `ingestor/utils.py` for shared helper functions.
</description>
<file>ingestor/main.py</file>
</task>

<task>
<name>Implement USGS Fetcher</name>
<description>
In `ingestor/utils.py`, implement `fetch_usgs_data(start_time, end_time)` function.
Handle pagination logic (USGS limit is 20k records).
Implement retry logic for 429/5xx errors using `requests.adapters.HTTPAdapter`.
</description>
<file>ingestor/utils.py</file>
</task>

<task>
<name>Setup GitHub Action</name>
<description>
Create `.github/workflows/ingest_cron.yaml` to run the ingestor on a schedule (e.g., every hour).
Configure secrets for Supabase URL and Key.
</description>
<file>.github/workflows/ingest_cron.yaml</file>
</task>

## Verification
- [ ] `pip install -r ingestor/requirements.txt` succeeds.
- [ ] `ingestor/main.py` runs without errors (mocking API calls if needed).
- [ ] `fetch_usgs_data` correctly handles pagination and retries.
- [ ] GitHub Action workflow file is valid.

## Must Haves
- Python environment configured.
- Main script skeleton created.
- Reliable data fetching logic with pagination and retries.
