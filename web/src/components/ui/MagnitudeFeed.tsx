'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, Calendar, Clock, Activity } from 'lucide-react';
import type { Earthquake } from '@/lib/types';
import {
  formatDate,
  formatMagnitude,
  getMagnitudeLabel,
  getDepthColorCSS,
  cn,
} from '@/lib/utils';

interface MagnitudeFeedProps {
  isOpen: boolean;
  onClose: () => void;
  earthquakes: Earthquake[];
  onSelectEarthquake: (earthquake: Earthquake) => void;
  isLoading: boolean;
}

export default function MagnitudeFeed({
  isOpen,
  onClose,
  earthquakes,
  onSelectEarthquake,
  isLoading,
}: MagnitudeFeedProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '-100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '-100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className={cn(
              'fixed left-0 top-16 bottom-0 z-50 w-full sm:w-[450px]',
              'bg-[#0d0e12]/95 backdrop-blur-2xl',
              'border-r border-cyan-500/10',
              'flex flex-col',
              'shadow-2xl shadow-black/50'
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20">
                  <Activity className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <h2 className="font-mono text-lg font-bold text-white tracking-wide">
                    MAGNITUDE FEED
                  </h2>
                  <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                    Past 24 Hours Activity
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg bg-zinc-800/50 text-zinc-400 hover:text-white hover:bg-zinc-700/50 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-64 space-y-4">
                  <div className="w-8 h-8 rounded-full border-2 border-cyan-500/30 border-t-cyan-500 animate-spin" />
                  <p className="font-mono text-xs text-cyan-400 animate-pulse">
                    SCANNING SEISMIC DATA...
                  </p>
                </div>
              ) : earthquakes.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center px-8">
                  <div className="w-16 h-16 rounded-full bg-zinc-800/50 flex items-center justify-center mb-4 border border-zinc-700/50">
                    <Activity className="w-8 h-8 text-zinc-600" />
                  </div>
                  <h3 className="font-mono text-zinc-300 mb-2">NO RECENT ACTIVITY</h3>
                  <p className="text-sm text-zinc-500 max-w-xs">
                    No seismic events have been recorded in the last 24 hours, or the data feed is currently silent.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {earthquakes.map((eq, index) => (
                    <motion.button
                      key={eq.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => {
                        onSelectEarthquake(eq);
                        // Optional: close feed on select? user might want to browse. 
                        // Let's keep it open.
                      }}
                      className={cn(
                        'w-full flex items-start gap-4 p-3 rounded-xl',
                        'bg-zinc-900/50 border border-zinc-800/50',
                        'hover:bg-zinc-800/50 hover:border-cyan-500/30',
                        'transition-all group text-left'
                      )}
                    >
                      {/* Magnitude Box */}
                      <div
                        className={cn(
                          'flex flex-col items-center justify-center w-12 h-12 rounded-lg',
                          'bg-zinc-900 border border-zinc-700',
                          'group-hover:scale-105 transition-transform'
                        )}
                      >
                        <span
                          className={cn(
                            'font-mono text-lg font-bold',
                            eq.magnitude >= 6 ? 'text-red-500' :
                            eq.magnitude >= 5 ? 'text-amber-500' :
                            eq.magnitude >= 4 ? 'text-yellow-500' :
                            'text-emerald-500'
                          )}
                        >
                          {eq.magnitude.toFixed(1)}
                        </span>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-mono text-sm text-zinc-200 truncate group-hover:text-cyan-400 transition-colors">
                          {eq.place}
                        </h4>
                        <div className="flex items-center gap-3 mt-1.5">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3 h-3 text-zinc-500" />
                            <span className="text-[10px] font-mono text-zinc-500">
                              {new Date(eq.incident_time_est).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div 
                              className="w-1.5 h-1.5 rounded-full"
                              style={{ backgroundColor: getDepthColorCSS(eq.depth) }}
                            />
                            <span className="text-[10px] font-mono text-zinc-500">
                              {Math.round(eq.depth)}km
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Footer */}
            <div className="p-4 border-t border-zinc-800/50 bg-zinc-900/50">
               <p className="text-[10px] font-mono text-zinc-600 text-center uppercase">
                  Real-time Seismic Feed • {earthquakes.length} Events Listed
               </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
