# Roadmap

## Proposed Roadmap

**5 phases** | **12 requirements mapped** | All v1 requirements covered ✓

| # | Phase | Goal | Requirements | Status |
|---|-------|------|--------------|------------------|
| 1 | Ingestor Pipeline | Functional Python ingestor pipeline with Supabase sync | ING-01, ING-02, ING-03, ING-04 | Completed |
| 2 | Resilient Orchestration | State-aware harvesting engine with backfill capability | REF-01, REF-02, REF-03, ORC-01, ORC-02, ORC-03, ORC-04, AUTO-01 | Completed |
| 3 | Visual Foundation | Basic Resium globe with data mapping | VIS-01, VIS-02 | Pending |
| 4 | Impact Visualization | Visualizing felt radius and impact zones | VIS-03 | Pending |
| 5 | UI & Polish | Metadata panel and final polish | UI-01 | Pending |

### Phase Details

**Phase 1: Ingestor Pipeline** (Completed)
Goal: Functional Python ingestor pipeline with Supabase sync

**Phase 2: Resilient Orchestration**
Goal: Transition to a state-aware, checkpointed harvesting engine.
Requirements: REF-01..03, ORC-01..04, AUTO-01
Success criteria:
1. `orchestrator.py` runs and creates `checkpoint.json`.
2. Backfill resumes from checkpoint after interruption.
3. Adaptive splitting handles 20k limits without error.
4. Geocoding enriches data with Country/Continent.

**Phase 3: Visual Foundation**
Goal: Basic Resium globe with data mapping

**Phase 4: Impact Visualization**
Goal: Visualizing felt radius and impact zones

**Phase 5: UI & Polish**
Goal: Metadata panel and final polish