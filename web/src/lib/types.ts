// Earthquake data types from Supabase
// Schema matches ingestor/transform.py flatten_record output

export interface Earthquake {
  id: string;
  magnitude: number;
  place: string;
  incident_time_est: string;
  latitude: number;
  longitude: number;
  depth: number;
  felt_radius_km: number | null;
  felt_count: number;
}

export interface EarthquakeFilters {
  year: number | null;
  magnitudeRange: MagnitudeRange;
}

export type MagnitudeRange = 'all' | 'low' | 'medium' | 'high';

export interface EarthquakeStats {
  totalCount: number;
  avgMagnitude: number;
  topCountry: { name: string; count: number } | null;
  maxMagnitude: number;
}

export interface SelectedEarthquake extends Earthquake {
  isSelected: boolean;
}
