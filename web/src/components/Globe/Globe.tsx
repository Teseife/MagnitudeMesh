'use client';

import { useRef, useEffect, useCallback, useState } from 'react';
import {
  Viewer,
  Entity,
  PointGraphics,
  EllipseGraphics,
  ImageryLayer,
} from 'resium';
import type { CesiumMovementEvent, RootEventTarget } from 'resium';
import {
  Viewer as CesiumViewer,
  Ion,
  Cartesian3,
  Color,
  IonImageryProvider,
  Math as CesiumMath,
  Entity as CesiumEntity,
  ImageryProvider,
} from 'cesium';
// CSS is loaded via layout.tsx from /cesium/Widgets/widgets.css

import type { Earthquake } from '@/lib/types';
import { getMagnitudeSize, getDepthColor } from '@/lib/utils';

// Set Cesium Ion token
if (typeof window !== 'undefined') {
  (window as any).CESIUM_BASE_URL = '/cesium';
  if (process.env.NEXT_PUBLIC_CESIUM_TOKEN) {
    Ion.defaultAccessToken = process.env.NEXT_PUBLIC_CESIUM_TOKEN;
  }
}

interface GlobeProps {
  earthquakes: Earthquake[];
  selectedEarthquake: Earthquake | null;
  onSelectEarthquake: (earthquake: Earthquake | null) => void;
  showImpactZones: boolean;
  resetTimestamp: number;
}

export default function Globe({
  earthquakes,
  selectedEarthquake,
  onSelectEarthquake,
  showImpactZones,
  resetTimestamp,
}: GlobeProps) {
  const viewerRef = useRef<CesiumViewer | null>(null);
  const [imageryProvider, setImageryProvider] = useState<ImageryProvider | null>(null);
  const [imageryError, setImageryError] = useState<string | null>(null);

  // Load imagery provider asynchronously
  useEffect(() => {
    let cancelled = false;

    async function loadImageryProvider() {
      try {
        const provider = await IonImageryProvider.fromAssetId(4); // Cesium World Imagery
        if (!cancelled) {
          setImageryProvider(provider);
        }
      } catch (error) {
        console.error('Failed to load Cesium imagery provider:', error);
        if (!cancelled) {
          setImageryError(error instanceof Error ? error.message : 'Failed to load imagery');
        }
      }
    }

    loadImageryProvider();

    return () => {
      cancelled = true;
    };
  }, []);

  // Handle click events on entities
  const handleClick = useCallback(
    (movement: CesiumMovementEvent, target: RootEventTarget) => {
      // Check if we clicked on an entity with earthquake data
      if (target && 'id' in target) {
        const entityId = (target as { id?: CesiumEntity }).id;
        if (entityId instanceof CesiumEntity && entityId.properties) {
          const earthquakeData = entityId.properties.earthquakeData?.getValue(
            new Date()
          ) as Earthquake | undefined;
          if (earthquakeData) {
            onSelectEarthquake(earthquakeData);
            return;
          }
        }
      }
      // Clicked on empty space
      onSelectEarthquake(null);
    },
    [onSelectEarthquake]
  );

  // Reset view when resetTimestamp changes
  useEffect(() => {
    if (resetTimestamp > 0 && viewerRef.current) {
      const viewer = viewerRef.current;
      viewer.camera.flyTo({
        destination: Cartesian3.fromDegrees(0, 20, 20000000), // Default global view
        orientation: {
          heading: CesiumMath.toRadians(0),
          pitch: CesiumMath.toRadians(-90),
          roll: 0,
        },
        duration: 1.5,
      });
    }
  }, [resetTimestamp]);

  // Fly to selected earthquake
  useEffect(() => {
    if (selectedEarthquake && viewerRef.current) {
      const viewer = viewerRef.current;
      viewer.camera.flyTo({
        destination: Cartesian3.fromDegrees(
          selectedEarthquake.longitude,
          selectedEarthquake.latitude,
          100000 // Closer zoom (100km altitude)
        ),
        orientation: {
          heading: CesiumMath.toRadians(0),
          pitch: CesiumMath.toRadians(-90), // Look straight down
          roll: 0,
        },
        duration: 1.5,
      });
    }
  }, [selectedEarthquake]);

  // Convert depth to Cesium Color
  const toCesiumColor = useCallback((depth: number): Color => {
    const { r, g, b, a } = getDepthColor(depth);
    return new Color(r / 255, g / 255, b / 255, a / 255);
  }, []);

  // Show error state if imagery failed to load
  if (imageryError) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-[#0a0b0f]">
        <div className="text-center p-8 max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
            <span className="text-3xl">🌍</span>
          </div>
          <h2 className="text-xl font-mono text-red-400 mb-2">GLOBE ERROR</h2>
          <p className="text-zinc-400 text-sm">{imageryError}</p>
        </div>
      </div>
    );
  }

  return (
    <Viewer
      ref={(ref) => {
        if (ref?.cesiumElement) {
          viewerRef.current = ref.cesiumElement;
        }
      }}
      full
      timeline={false}
      animation={false}
      homeButton={false}
      sceneModePicker={false}
      baseLayerPicker={false}
      navigationHelpButton={false}
      geocoder={false}
      fullscreenButton={false}
      selectionIndicator={false}
      infoBox={false}
      scene3DOnly={true}
      onClick={handleClick}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      {/* Base imagery layer from Cesium Ion - only render when provider is loaded */}
      {imageryProvider && <ImageryLayer imageryProvider={imageryProvider} />}

      {/* Earthquake Points */}
      {earthquakes.map((eq) => {
        const isSelected = selectedEarthquake?.id === eq.id;
        const pixelSize = getMagnitudeSize(eq.magnitude);
        const color = toCesiumColor(eq.depth);

        return (
          <Entity
            key={eq.id}
            position={Cartesian3.fromDegrees(eq.longitude, eq.latitude)}
            name={eq.place}
            properties={{
              earthquakeData: eq,
            }}
          >
            <PointGraphics
              pixelSize={isSelected ? pixelSize * 1.5 : pixelSize}
              color={isSelected ? Color.CYAN : color}
              outlineColor={isSelected ? Color.WHITE : Color.BLACK.withAlpha(0.5)}
              outlineWidth={isSelected ? 2 : 1}
              // Removed disableDepthTestDistance to fix transparency issue
            />

            {/* Impact Zone / Felt Radius */}
            {showImpactZones && eq.felt_radius_km && eq.felt_radius_km > 0 && (
              <EllipseGraphics
                semiMajorAxis={eq.felt_radius_km * 1000}
                semiMinorAxis={eq.felt_radius_km * 1000}
                material={color.withAlpha(isSelected ? 0.3 : 0.15)}
                outline={true}
                outlineColor={color.withAlpha(isSelected ? 0.8 : 0.4)}
                outlineWidth={isSelected ? 2 : 1}
              />
            )}
          </Entity>
        );
      })}
    </Viewer>
  );
}
