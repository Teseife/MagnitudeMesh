import { createClient } from '@supabase/supabase-js';
import type { Earthquake, EarthquakeFilters, MagnitudeRange } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables:', {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseAnonKey,
  });
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder'
);

// Magnitude range mappings
const MAGNITUDE_RANGES: Record<MagnitudeRange, [number, number]> = {
  all: [0, 10],
  low: [2.5, 4.0],
  medium: [4.0, 5.5],
  high: [5.5, 10],
};

export async function fetchEarthquakes(
  filters: EarthquakeFilters,
  limit: number = 5000
): Promise<Earthquake[]> {
  let query = supabase
    .from('earthquakes')
    .select('*')
    .order('incident_time_est', { ascending: false })
    .limit(limit);

  // Apply year filter
  if (filters.year) {
    const startDate = `${filters.year}-01-01`;
    const endDate = `${filters.year}-12-31`;
    query = query
      .gte('incident_time_est', startDate)
      .lte('incident_time_est', endDate);
  }

  // Apply magnitude filter
  if (filters.magnitudeRange !== 'all') {
    const [min, max] = MAGNITUDE_RANGES[filters.magnitudeRange];
    query = query.gte('magnitude', min).lt('magnitude', max);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching earthquakes:', error);
    throw error;
  }

  return data || [];
}

export async function fetchEarthquakeStats(year?: number): Promise<{
  totalCount: number;
  avgMagnitude: number;
  maxMagnitude: number;
  totalFelt: number;
}> {
  let query = supabase.from('earthquakes').select('magnitude, felt_count');

  if (year) {
    const startDate = `${year}-01-01`;
    const endDate = `${year}-12-31`;
    query = query
      .gte('incident_time_est', startDate)
      .lte('incident_time_est', endDate);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching stats:', error);
    throw error;
  }

  if (!data || data.length === 0) {
    return { totalCount: 0, avgMagnitude: 0, maxMagnitude: 0, totalFelt: 0 };
  }

  // Calculate stats
  const totalCount = data.length;
  const avgMagnitude =
    data.reduce((sum, eq) => sum + (eq.magnitude || 0), 0) / totalCount;
  const maxMagnitude = Math.max(...data.map(eq => eq.magnitude || 0));
  const totalFelt = data.reduce((sum, eq) => sum + (eq.felt_count || 0), 0);

  return { totalCount, avgMagnitude, maxMagnitude, totalFelt };
}

export async function fetchRecentEarthquakes(limit: number = 50): Promise<Earthquake[]> {
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  
  const { data, error } = await supabase
    .from('earthquakes')
    .select('*')
    .gte('incident_time_est', twentyFourHoursAgo)
    .order('incident_time_est', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching recent earthquakes:', error);
    throw error;
  }

  return data || [];
}

export async function getAvailableYears(): Promise<number[]> {
  // Return years from 2016 to current year
  const currentYear = new Date().getFullYear();
  const years: number[] = [];
  for (let year = currentYear; year >= 2016; year--) {
    years.push(year);
  }
  return years;
}
