# Project State

## Current Phase
**Phase 3: Visual Foundation** (Next)

## Progress Log
- **Phase 2: Resilient Orchestration** (Completed)
  - Implemented `orchestrator.py` with checkpointing and adaptive splitting.
  - Refactored modules for batch efficiency and geocoding.
  - Added Windows automation script.
- **Phase 1: Ingestor Pipeline** (Completed)
  - Implemented Python ingestor with robust USGS fetching.
  - Added Ocean Purge filter and scientific calculations.
  - Integrated Supabase for data persistence.
  - Setup GitHub Action for hourly cron jobs.

## Decisions Made
| Decision | Rationale | Outcome |
|----------|-----------|---------|
| **Supabase** | BaaS for Postgres + Auth + Realtime. | Active |
| **Resium** | React wrapper for CesiumJS, enabling declarative globe components. | Active |
| **Python Ingestor** | Strong ecosystem for data processing (pandas, shapely, requests). | Active |
