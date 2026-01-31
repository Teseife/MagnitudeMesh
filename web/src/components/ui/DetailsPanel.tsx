'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  MapPin,
  Clock,
  Activity,
  Layers,
  Radio,
  AlertTriangle,
  ChevronRight,
} from 'lucide-react';
import type { Earthquake } from '@/lib/types';
import {
  formatDate,
  formatMagnitude,
  formatDepth,
  getMagnitudeLabel,
  getDepthLabel,
  getDepthColorCSS,
  cn,
} from '@/lib/utils';

interface DetailsPanelProps {
  earthquake: Earthquake | null;
  onClose: () => void;
}

export default function DetailsPanel({ earthquake, onClose }: DetailsPanelProps) {
  const getMagnitudeColorClass = (mag: number): string => {
    if (mag < 4.0) return 'text-emerald-400';
    if (mag < 5.0) return 'text-yellow-400';
    if (mag < 6.0) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <AnimatePresence>
      {earthquake && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{
              type: 'spring',
              damping: 30,
              stiffness: 300,
            }}
            className={cn(
              'fixed right-0 top-16 bottom-0 z-50 w-full sm:w-96',
              'bg-[#0d0e12]/95 backdrop-blur-2xl',
              'border-l border-cyan-500/10',
              'flex flex-col',
              'shadow-2xl shadow-black/50'
            )}
          >
            {/* Header */}
            <div className="relative px-6 py-4 border-b border-zinc-800/50">
              {/* Glow accent line */}
              <motion.div
                className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              />

              <div className="flex items-start justify-between">
                <div className="flex-1 pr-4">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex items-center gap-2 mb-1"
                  >
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    <span className="text-xs font-mono text-amber-500 tracking-wider">
                      SEISMIC EVENT
                    </span>
                  </motion.div>
                  <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="font-mono text-lg text-white leading-tight"
                  >
                    {earthquake.place}
                  </motion.h2>
                </div>

                <button
                  onClick={onClose}
                  className={cn(
                    'p-2 rounded-lg transition-colors',
                    'bg-zinc-800/50 hover:bg-zinc-700/50',
                    'text-zinc-400 hover:text-white'
                  )}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Magnitude Hero */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className={cn(
                  'relative p-6 rounded-xl',
                  'bg-gradient-to-br from-zinc-800/50 to-zinc-900/50',
                  'border border-zinc-700/30'
                )}
              >
                {/* Pulse effect for high magnitude */}
                {earthquake.magnitude >= 5.5 && (
                  <motion.div
                    className="absolute inset-0 rounded-xl bg-red-500/10"
                    animate={{ opacity: [0.3, 0.1, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}

                <div className="relative flex items-center justify-between">
                  <div>
                    <p className="text-xs font-mono text-zinc-500 mb-1">
                      MAGNITUDE
                    </p>
                    <p
                      className={cn(
                        'font-mono text-5xl font-bold',
                        getMagnitudeColorClass(earthquake.magnitude)
                      )}
                    >
                      {formatMagnitude(earthquake.magnitude)}
                    </p>
                    <p className="text-sm font-mono text-zinc-400 mt-1">
                      {getMagnitudeLabel(earthquake.magnitude)}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs font-mono text-zinc-500 mb-1">DEPTH</p>
                    <p
                      className="font-mono text-3xl font-bold"
                      style={{ color: getDepthColorCSS(earthquake.depth) }}
                    >
                      {Math.round(earthquake.depth)}
                    </p>
                    <p className="text-sm font-mono text-zinc-400 mt-1">
                      km ({getDepthLabel(earthquake.depth)})
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Data Grid */}
              <div className="space-y-3">
                <DataRow
                  icon={<Clock className="w-4 h-4" />}
                  label="Time (EST)"
                  value={formatDate(earthquake.incident_time_est)}
                  delay={0.25}
                />

                <DataRow
                  icon={<MapPin className="w-4 h-4" />}
                  label="Coordinates"
                  value={`${earthquake.latitude.toFixed(4)}°, ${earthquake.longitude.toFixed(4)}°`}
                  delay={0.3}
                />

                <DataRow
                  icon={<Layers className="w-4 h-4" />}
                  label="Depth"
                  value={formatDepth(earthquake.depth)}
                  delay={0.35}
                />

                {earthquake.felt_radius_km && earthquake.felt_radius_km > 0 && (
                  <DataRow
                    icon={<Radio className="w-4 h-4" />}
                    label="Felt Radius"
                    value={`${Math.round(earthquake.felt_radius_km)} km`}
                    delay={0.4}
                    highlight
                  />
                )}

                {earthquake.felt_count > 0 && (
                  <DataRow
                    icon={<ChevronRight className="w-4 h-4" />}
                    label="Reports Felt"
                    value={`${earthquake.felt_count.toLocaleString()} reports`}
                    delay={0.45}
                  />
                )}
              </div>

              {/* Impact Zone Indicator */}
              {earthquake.felt_radius_km && earthquake.felt_radius_km > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className={cn(
                    'p-4 rounded-xl',
                    'bg-gradient-to-r from-cyan-500/10 to-blue-500/10',
                    'border border-cyan-500/20'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Radio className="w-6 h-6 text-cyan-500" />
                      <motion.div
                        className="absolute inset-0 rounded-full bg-cyan-500/30"
                        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                    </div>
                    <div>
                      <p className="text-sm font-mono text-cyan-400">
                        Impact Zone Active
                      </p>
                      <p className="text-xs text-zinc-500">
                        Estimated felt radius: {Math.round(earthquake.felt_radius_km)} km
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-zinc-800/50">
              <p className="text-xs font-mono text-zinc-600 text-center">
                ID: {earthquake.id}
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Data row component
function DataRow({
  icon,
  label,
  value,
  delay = 0,
  highlight = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  delay?: number;
  highlight?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className={cn(
        'flex items-center gap-3 p-3 rounded-lg',
        'bg-zinc-800/30 border border-zinc-700/30',
        highlight && 'border-cyan-500/30 bg-cyan-500/5'
      )}
    >
      <div className={cn('text-zinc-500', highlight && 'text-cyan-500')}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-mono text-zinc-500">{label}</p>
        <p
          className={cn(
            'font-mono text-sm truncate',
            highlight ? 'text-cyan-400' : 'text-white'
          )}
        >
          {value}
        </p>
      </div>
    </motion.div>
  );
}
