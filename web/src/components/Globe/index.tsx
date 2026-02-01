'use client';

import dynamic from 'next/dynamic';
import type { Earthquake, DemoMode } from '@/lib/types';

// Dynamic import to avoid SSR issues with Cesium
const Globe = dynamic(() => import('./Globe'), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center bg-[#0a0b0f]">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-2 border-cyan-500/20" />
          <div className="absolute inset-0 h-16 w-16 animate-spin rounded-full border-2 border-transparent border-t-cyan-500" />
        </div>
        <p className="font-mono text-sm text-cyan-500/80">
          INITIALIZING GLOBE...
        </p>
      </div>
    </div>
  ),
});

interface GlobeWrapperProps {
  earthquakes: Earthquake[];
  selectedEarthquake: Earthquake | null;
  onSelectEarthquake: (earthquake: Earthquake | null) => void;
  showImpactZones: boolean;
  resetTimestamp: number;
  demoMode: DemoMode;
}

export default function GlobeWrapper(props: GlobeWrapperProps) {
  return <Globe {...props} />;
}
