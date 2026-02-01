'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Globe from '@/components/Globe';
import Navbar from '@/components/ui/Navbar';
import DetailsPanel from '@/components/ui/DetailsPanel';
import MagnitudeFeed from '@/components/ui/MagnitudeFeed';
import { fetchEarthquakes, fetchEarthquakeStats, fetchRecentEarthquakes, getAvailableYears } from '@/lib/supabase';
import type { Earthquake, MagnitudeRange, DemoMode } from '@/lib/types';

export default function Home() {
  // Data state
  const [earthquakes, setEarthquakes] = useState<Earthquake[]>([]);
  const [recentEarthquakes, setRecentEarthquakes] = useState<Earthquake[]>([]);
  const [stats, setStats] = useState({
    totalCount: 0,
    avgMagnitude: 0,
    maxMagnitude: 0,
    totalFelt: 0,
  });
  const [years, setYears] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFeedLoading, setIsFeedLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [magnitudeRange, setMagnitudeRange] = useState<MagnitudeRange>('all');
  const [demoMode, setDemoMode] = useState<DemoMode>('normal');

  // UI state
  const [selectedEarthquake, setSelectedEarthquake] = useState<Earthquake | null>(null);
  const [showImpactZones, setShowImpactZones] = useState(true);
  const [resetTimestamp, setResetTimestamp] = useState<number>(0);
  const [isFeedOpen, setIsFeedOpen] = useState(false);

  // Load available years on mount
  useEffect(() => {
    async function loadYears() {
      const availableYears = await getAvailableYears();
      setYears(availableYears);
      // Default to current year
      if (availableYears.length > 0) {
        setSelectedYear(availableYears[0]);
      }
    }
    loadYears();
  }, []);

  // Fetch recent earthquakes for the feed
  useEffect(() => {
    async function loadRecent() {
      if (demoMode === 'feed_empty') {
        setRecentEarthquakes([]);
        return;
      }

      setIsFeedLoading(true);
      try {
        const recent = await fetchRecentEarthquakes();
        setRecentEarthquakes(recent);
      } catch (err) {
        console.error('Failed to load recent earthquakes:', err);
      } finally {
        setIsFeedLoading(false);
      }
    }

    if (isFeedOpen) {
      loadRecent();
    }
  }, [isFeedOpen, demoMode]);

  // Fetch earthquakes when filters or demo mode changes
  useEffect(() => {
    async function loadData() {
      // Handle Demo Modes
      if (demoMode === 'database_error') {
        setIsLoading(true);
        // Simulate delay then error
        setTimeout(() => {
          setIsLoading(false);
          setError('Failed to connect to database: Connection timeout (500)');
          setEarthquakes([]);
        }, 1000);
        return;
      }

      if (demoMode === 'network_error') {
        setIsLoading(true);
        // Simulate delay then error
        setTimeout(() => {
          setIsLoading(false);
          setError('Network request failed: User is offline');
          setEarthquakes([]);
        }, 800);
        return;
      }

      // Normal Mode (or rendering_error which is handled by Globe component)
      setIsLoading(true);
      setError(null);

      try {
        const [quakeData, statsData] = await Promise.all([
          fetchEarthquakes({
            year: selectedYear,
            magnitudeRange,
          }),
          fetchEarthquakeStats(selectedYear || undefined),
        ]);

        setEarthquakes(quakeData);
        setStats(statsData);
      } catch (err) {
        console.error('Error loading earthquake data:', err);
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(`Failed to load earthquake data: ${errorMessage}`);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [selectedYear, magnitudeRange, demoMode]);

  // Handler for selecting an earthquake
  const handleSelectEarthquake = useCallback((earthquake: Earthquake | null) => {
    setSelectedEarthquake(earthquake);
  }, []);

  // Handler for closing details panel
  const handleCloseDetails = useCallback(() => {
    setSelectedEarthquake(null);
  }, []);

  // Handler for resetting view
  const handleResetView = useCallback(() => {
    setSelectedEarthquake(null);
    setResetTimestamp(Date.now());
  }, []);

  return (
    <main className="relative w-full h-screen overflow-hidden">
      {/* Navbar */}
      <Navbar
        years={years}
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
        magnitudeRange={magnitudeRange}
        onMagnitudeChange={setMagnitudeRange}
        stats={stats}
        showImpactZones={showImpactZones}
        onToggleImpactZones={() => setShowImpactZones(!showImpactZones)}
        isLoading={isLoading}
        onResetView={handleResetView}
        demoMode={demoMode}
        onDemoModeChange={setDemoMode}
        isFeedOpen={isFeedOpen}
        onToggleFeed={() => setIsFeedOpen(!isFeedOpen)}
      />

      {/* Globe Container */}
      <div className="absolute inset-0 pt-16">
        {error ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center p-8 max-w-md">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
                <span className="text-3xl">⚠️</span>
              </div>
              <h2 className="text-xl font-mono text-red-400 mb-2">
                CONNECTION ERROR
              </h2>
              <p className="text-zinc-400 mb-4">{error}</p>
              <button
                onClick={() => demoMode === 'normal' ? window.location.reload() : setDemoMode('normal')}
                className="px-4 py-2 bg-cyan-500/20 border border-cyan-500/50 rounded-lg text-cyan-400 font-mono text-sm hover:bg-cyan-500/30 transition-colors"
              >
                {demoMode !== 'normal' ? 'EXIT DEMO MODE' : 'RETRY CONNECTION'}
              </button>
            </div>
          </div>
        ) : (
          <Globe
            earthquakes={earthquakes}
            selectedEarthquake={selectedEarthquake}
            onSelectEarthquake={handleSelectEarthquake}
            showImpactZones={showImpactZones}
            resetTimestamp={resetTimestamp}
            demoMode={demoMode}
          />
        )}
      </div>

      {/* Magnitude Feed Panel */}
      <MagnitudeFeed
        isOpen={isFeedOpen}
        onClose={() => setIsFeedOpen(false)}
        earthquakes={recentEarthquakes}
        onSelectEarthquake={(eq) => {
            handleSelectEarthquake(eq);
            setIsFeedOpen(false); // Close feed on selection to show map
        }}
        isLoading={isFeedLoading}
      />

      {/* Details Panel */}
      <DetailsPanel
        earthquake={selectedEarthquake}
        onClose={handleCloseDetails}
      />

      {/* Loading Overlay */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed bottom-4 left-4 z-50"
        >
          <div className="flex items-center gap-3 px-4 py-2 bg-zinc-900/90 backdrop-blur-lg rounded-lg border border-cyan-500/20">
            <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
            <span className="font-mono text-xs text-cyan-400">
              LOADING SEISMIC DATA...
            </span>
          </div>
        </motion.div>
      )}

      {/* Data Count Badge */}
      {!isLoading && !error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-4 left-4 z-50"
        >
          <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900/80 backdrop-blur-lg rounded-lg border border-zinc-700/50">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="font-mono text-xs text-zinc-400">
              {earthquakes.length.toLocaleString()} events loaded
            </span>
          </div>
        </motion.div>
      )}

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        className="fixed bottom-4 right-4 z-40 hidden md:block"
      >
        <div className="p-3 bg-zinc-900/80 backdrop-blur-lg rounded-lg border border-zinc-700/50">
          <p className="font-mono text-[10px] text-zinc-500 mb-2">DEPTH LEGEND</p>
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <span className="text-zinc-400">&lt;70km</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
              <span className="text-zinc-400">70-300km</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span className="text-zinc-400">&gt;300km</span>
            </div>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
