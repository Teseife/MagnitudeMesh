# Requirements

## v1 Requirements

### Ingestor
- [x] **ING-01**: Fetch and backfill all historical USGS data (pagination included)
- [x] **ING-02**: Filter out 'Ocean'/'Ridge' records (Ocean Purge)
- [x] **ING-03**: Use geopy/reverse-geocode to tag Continent/Country
- [x] **ING-04**: Calculate felt_radius_km and normalize time (Enrichment)

### Visuals
- [ ] **VIS-01**: Resium Globe with Magnitude (size) and Depth (color) mapping
- [ ] **VIS-02**: Smooth camera transition to epicenter on click
- [ ] **VIS-03**: Render pulsing felt_radius_km circles (Impact Zones)

### UI Elements
- [ ] **UI-01**: Aceternity UI side-panel for quake details (Metadata Panel)

## v2 Requirements (Deferred)
- **UI-02**: Shadcn UI HUD for filtering (Mag, Continent, Country)
- **VIS-04**: Time-dynamic animations for all entities

## Out of Scope
- Mobile Native App
- Real-time Streaming (Cron is sufficient)

## Traceability
| Req ID | Phase | Plan | Status |
|--------|-------|------|--------|
| (Populated by roadmap) | | | |
