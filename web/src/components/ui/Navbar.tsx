'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronDown,
  Activity,
  Globe2,
  MapPin,
  Waves,
  Eye,
  EyeOff,
  RotateCcw,
  Beaker,
} from 'lucide-react';
import { cn, formatNumber } from '@/lib/utils';
import type { MagnitudeRange, DemoMode } from '@/lib/types';

interface NavbarProps {
  years: number[];
  selectedYear: number | null;
  onYearChange: (year: number | null) => void;
  magnitudeRange: MagnitudeRange;
  onMagnitudeChange: (range: MagnitudeRange) => void;
  stats: {
    totalCount: number;
    avgMagnitude: number;
    maxMagnitude: number;
    totalFelt: number;
  };
  showImpactZones: boolean;
  onToggleImpactZones: () => void;
  isLoading: boolean;
  onResetView: () => void;
  demoMode: DemoMode;
  onDemoModeChange: (mode: DemoMode) => void;
}

export default function Navbar({
  years,
  selectedYear,
  onYearChange,
  magnitudeRange,
  onMagnitudeChange,
  stats,
  showImpactZones,
  onToggleImpactZones,
  isLoading,
  onResetView,
  demoMode,
  onDemoModeChange,
}: NavbarProps) {
  const [yearDropdownOpen, setYearDropdownOpen] = useState(false);
  const [demoDropdownOpen, setDemoDropdownOpen] = useState(false);

  const magnitudeOptions: { value: MagnitudeRange; label: string; color: string }[] = [
    { value: 'all', label: 'ALL', color: 'bg-zinc-600' },
    { value: 'low', label: '2.5-4', color: 'bg-emerald-600' },
    { value: 'medium', label: '4-5.5', color: 'bg-amber-500' },
    { value: 'high', label: '5.5+', color: 'bg-red-500' },
  ];

  const demoOptions: { value: DemoMode; label: string; description: string }[] = [
    { value: 'normal', label: 'Normal Operation', description: 'Standard application state' },
    { value: 'database_error', label: 'Database Error', description: 'Simulate DB connection failure' },
    { value: 'network_error', label: 'Network Error', description: 'Simulate offline/connection loss' },
    { value: 'rendering_error', label: 'Rendering Error', description: 'Simulate WebGL/Globe crash' },
  ];

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 h-16"
    >
      {/* Glassmorphism background */}
      <div className="absolute inset-0 bg-[#0d0e12]/80 backdrop-blur-xl border-b border-cyan-500/10" />

      {/* Content */}
      <div className="relative h-full px-4 md:px-6 flex items-center justify-between">
        {/* Left: Logo + Title */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Globe2 className="w-8 h-8 text-cyan-500" />
            <motion.div
              className="absolute inset-0 rounded-full bg-cyan-500/20"
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
          <div className="hidden sm:block">
            <h1 className="font-mono text-lg font-bold tracking-wider text-white">
              MAGNITUDE<span className="text-cyan-500">MESH</span>
            </h1>
            <p className="text-[10px] font-mono text-zinc-500 tracking-widest">
              SEISMIC COMMAND CENTER
            </p>
          </div>
        </div>

        {/* Center: Filters */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Year Dropdown */}
          <div className="relative">
            <button
              onClick={() => setYearDropdownOpen(!yearDropdownOpen)}
              className={cn(
                'flex items-center gap-2 px-3 py-1.5 rounded-lg',
                'bg-zinc-800/50 border border-zinc-700/50',
                'hover:border-cyan-500/50 transition-colors',
                'font-mono text-sm'
              )}
            >
              <span className="text-zinc-400 text-xs">YEAR</span>
              <span className="text-white">{selectedYear || 'ALL'}</span>
              <ChevronDown
                className={cn(
                  'w-4 h-4 text-zinc-400 transition-transform',
                  yearDropdownOpen && 'rotate-180'
                )}
              />
            </button>

            {yearDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={cn(
                  'absolute top-full mt-2 left-0 w-32',
                  'bg-zinc-900/95 backdrop-blur-xl rounded-lg',
                  'border border-zinc-700/50 shadow-xl shadow-black/50',
                  'max-h-64 overflow-y-auto scrollbar-thin'
                )}
              >
                <button
                  onClick={() => {
                    onYearChange(null);
                    setYearDropdownOpen(false);
                  }}
                  className={cn(
                    'w-full px-3 py-2 text-left font-mono text-sm',
                    'hover:bg-cyan-500/10 transition-colors',
                    selectedYear === null ? 'text-cyan-500' : 'text-zinc-300'
                  )}
                >
                  ALL YEARS
                </button>
                {years.map((year) => (
                  <button
                    key={year}
                    onClick={() => {
                      onYearChange(year);
                      setYearDropdownOpen(false);
                    }}
                    className={cn(
                      'w-full px-3 py-2 text-left font-mono text-sm',
                      'hover:bg-cyan-500/10 transition-colors',
                      selectedYear === year ? 'text-cyan-500' : 'text-zinc-300'
                    )}
                  >
                    {year}
                  </button>
                ))}
              </motion.div>
            )}
          </div>

          {/* Magnitude Filter Chips */}
          <div className="hidden md:flex items-center gap-1">
            <span className="text-zinc-500 text-xs font-mono mr-1">MAG</span>
            {magnitudeOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => onMagnitudeChange(opt.value)}
                className={cn(
                  'px-2 py-1 rounded text-xs font-mono transition-all',
                  magnitudeRange === opt.value
                    ? `${opt.color} text-white shadow-lg`
                    : 'bg-zinc-800/50 text-zinc-400 hover:bg-zinc-700/50'
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Impact Zone Toggle */}
          <button
            onClick={onToggleImpactZones}
            className={cn(
              'flex items-center gap-1.5 px-2 py-1.5 rounded-lg',
              'border transition-all font-mono text-xs',
              showImpactZones
                ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400'
                : 'bg-zinc-800/50 border-zinc-700/50 text-zinc-400 hover:border-zinc-600'
            )}
            title="Toggle Impact Zones"
          >
            {showImpactZones ? (
              <Eye className="w-3.5 h-3.5" />
            ) : (
              <EyeOff className="w-3.5 h-3.5" />
            )}
            <span className="hidden lg:inline">ZONES</span>
          </button>

          {/* Reset View Button */}
          <button
            onClick={onResetView}
            className={cn(
              'flex items-center gap-1.5 px-2 py-1.5 rounded-lg',
              'bg-zinc-800/50 border border-zinc-700/50',
              'text-zinc-400 hover:border-cyan-500/50 hover:text-cyan-400',
              'transition-all font-mono text-xs'
            )}
            title="Reset Global View"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">RESET</span>
          </button>

          {/* Demo Mode Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDemoDropdownOpen(!demoDropdownOpen)}
              className={cn(
                'flex items-center gap-2 px-3 py-1.5 rounded-lg ml-2',
                'bg-indigo-500/10 border border-indigo-500/30',
                'hover:bg-indigo-500/20 hover:border-indigo-500/50 transition-colors',
                'font-mono text-sm group'
              )}
            >
              <Beaker className="w-3.5 h-3.5 text-indigo-400 group-hover:text-indigo-300" />
              <span className="text-indigo-400 group-hover:text-indigo-300 hidden xl:inline">
                {demoMode === 'normal' ? 'DEMO' : 'DEMO: ACTIVE'}
              </span>
              <ChevronDown
                className={cn(
                  'w-3.5 h-3.5 text-indigo-400 transition-transform',
                  demoDropdownOpen && 'rotate-180'
                )}
              />
            </button>

            {demoDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={cn(
                  'absolute top-full mt-2 right-0 w-56',
                  'bg-zinc-900/95 backdrop-blur-xl rounded-lg',
                  'border border-zinc-700/50 shadow-xl shadow-black/50',
                  'overflow-hidden py-1'
                )}
              >
                <div className="px-3 py-2 border-b border-zinc-800/50 mb-1">
                  <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                    Select Simulation Mode
                  </p>
                </div>
                {demoOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      onDemoModeChange(opt.value);
                      setDemoDropdownOpen(false);
                    }}
                    className={cn(
                      'w-full px-3 py-2 text-left transition-colors',
                      'hover:bg-indigo-500/10',
                      demoMode === opt.value ? 'bg-indigo-500/5' : ''
                    )}
                  >
                    <p
                      className={cn(
                        'font-mono text-xs font-bold mb-0.5',
                        demoMode === opt.value ? 'text-indigo-400' : 'text-zinc-300'
                      )}
                    >
                      {opt.label}
                    </p>
                    <p className="text-[10px] text-zinc-500 font-mono">
                      {opt.description}
                    </p>
                  </button>
                ))}
              </motion.div>
            )}
          </div>
        </div>

        {/* Right: Stats */}
        <div className="hidden lg:flex items-center gap-6">
          {/* Total Quakes */}
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-red-400" />
            <div>
              <p className="text-[10px] font-mono text-zinc-500">TOTAL QUAKES</p>
              <p className="font-mono text-sm text-white">
                {isLoading ? '---' : formatNumber(stats.totalCount)}
              </p>
            </div>
          </div>

          {/* Avg Magnitude */}
          <div className="flex items-center gap-2">
            <Waves className="w-4 h-4 text-amber-400" />
            <div>
              <p className="text-[10px] font-mono text-zinc-500">AVG MAG</p>
              <p className="font-mono text-sm text-white">
                {isLoading ? '---' : stats.avgMagnitude.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Max Magnitude */}
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-400" />
            <div>
              <p className="text-[10px] font-mono text-zinc-500">MAX MAG</p>
              <p className="font-mono text-sm text-white">
                {isLoading ? '---' : stats.maxMagnitude.toFixed(1)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
