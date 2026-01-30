# MagnitudeMesh

## What This Is
A robust, BaaS-driven seismic visualization platform that automates the ingestion of USGS earthquake data, enriches it with contextual scientific calculations, and displays it on a professional-grade 3D globe using CesiumJS.

## Core Value
**Automated Insight:** Turns raw, noisy seismic data into a clean, scientifically enriched, and visually intuitive global impact map, filtering out irrelevant ocean noise to focus on human-impact zones.

## Success Criteria
- **Automated Pipeline:** Python ingestor running via GitHub Actions reliably backfills and updates USGS data to Supabase.
- **Smart Filtering:** "Ocean Purge" successfully uses geospatial checks (not just keywords) to filter non-impactful offshore events.
- **Scientific Enrichment:** `felt_radius_km` and timezone conversions calculated correctly pre-storage.
- **Performant 3D Globe:** Next.js + Resium app renders thousands of points smoothly using simple entities, with depth-based coloring and impact radius ellipses.

## Tech Stack
- **Ingestor:** Python 3.x (`requests`, `supabase`, `pytz`, `shapely` for geospatial checks)
- **Database:** Supabase (PostgreSQL + PostGIS extension likely needed for robust geospatial filtering)
- **Frontend:** Next.js (App Router), TypeScript, Resium (CesiumJS)
- **Deployment:** Vercel (Web), GitHub Actions (Cron Jobs)

## Key Decisions
| Decision | Rationale | Outcome |
|----------|-----------|---------|
| **Supabase (BaaS)** | Simplifies backend, provides instant API & Auth, native Postgres/PostGIS support. | — Pending |
| **Resium (CesiumJS)** | Professional-grade globe library required for accurate scientific visualization vs. artistic globes. | — Pending |
| **Geospatial Ocean Purge** | Keyword matching is brittle; coordinate-based checks provide ground truth for "offshore". | — Pending |
| **Pre-calculated Fields** | Calculating radius/timezone at ingestion saves frontend cycles and allows DB-level filtering. | — Pending |
| **Custom Attenuation Formula** | User-provided specific formula `R = 10^(0.45*M - 1.88) * sqrt(D)` fits project goals. | — Pending |

## Requirements

### Validated
- ✓ [Existing capability 1] — (None, Greenfiled)

### Active
- [ ] **Ingestor:** Backfill historical USGS data (pagination handling).
- [ ] **Ingestor:** Idempotent upsert to Supabase (prevent duplicates).
- [ ] **Ingestor:** Geospatial "Ocean Purge" implementation.
- [ ] **Ingestor:** Calculate `felt_radius_km` and normalize time to EST.
- [ ] **Web:** 3D Globe visualization with depth-color mapping.
- [ ] **Web:** Impact radius visualization (ellipses).
- [ ] **Web:** Detail panel for selected seismic events.

### Out of Scope
- **Volumetric Rendering:** Keeping to simple entities for performance.
- **Real-time Streaming:** Cron-based ingestion is sufficient (near real-time).
- **Mobile Native App:** Web-only focus.

---
*Last updated: 2026-01-29 after initialization*
