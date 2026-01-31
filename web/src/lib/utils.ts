import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Tailwind class merger
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Maps earthquake magnitude to visual pixel size
 * Linear scale: 2.5 mag = 5px, 7.0 mag = 20px
 */
export function getMagnitudeSize(magnitude: number): number {
  const minMag = 2.5;
  const maxMag = 7.0;
  const minSize = 5;
  const maxSize = 20;

  // Clamp magnitude to range
  const clampedMag = Math.max(minMag, Math.min(maxMag, magnitude));

  // Linear interpolation
  const ratio = (clampedMag - minMag) / (maxMag - minMag);
  return minSize + ratio * (maxSize - minSize);
}

/**
 * Maps earthquake depth to color
 * Shallow (<70km): Red/Orange
 * Intermediate (70-300km): Yellow/Green
 * Deep (>300km): Blue/Purple
 */
export function getDepthColor(depth: number): { r: number; g: number; b: number; a: number } {
  const shallow = 70;
  const deep = 300;

  if (depth < shallow) {
    // Shallow: Red to Orange gradient
    const ratio = depth / shallow;
    return {
      r: 255,
      g: Math.round(60 + ratio * 47), // 60-107
      b: Math.round(53 + ratio * 2),  // 53-55
      a: 230,
    };
  } else if (depth < deep) {
    // Intermediate: Orange to Green/Yellow
    const ratio = (depth - shallow) / (deep - shallow);
    return {
      r: Math.round(255 - ratio * 130), // 255-125
      g: Math.round(107 + ratio * 113), // 107-220
      b: Math.round(55 + ratio * 80),   // 55-135
      a: 230,
    };
  } else {
    // Deep: Blue to Purple
    const ratio = Math.min((depth - deep) / 400, 1);
    return {
      r: Math.round(61 + ratio * 40),   // 61-101
      g: Math.round(90 - ratio * 25),   // 90-65
      b: Math.round(254 - ratio * 9),   // 254-245
      a: 230,
    };
  }
}

/**
 * Get CSS color string from depth
 */
export function getDepthColorCSS(depth: number): string {
  const { r, g, b, a } = getDepthColor(depth);
  return `rgba(${r}, ${g}, ${b}, ${a / 255})`;
}

/**
 * Maps magnitude to pulse animation duration (ms)
 * Higher magnitude = faster/more urgent pulse
 */
export function getPulseDuration(magnitude: number): number {
  const minMag = 2.5;
  const maxMag = 7.0;
  const maxDuration = 3000; // Slow pulse for small quakes
  const minDuration = 800;  // Fast pulse for large quakes

  const clampedMag = Math.max(minMag, Math.min(maxMag, magnitude));
  const ratio = (clampedMag - minMag) / (maxMag - minMag);

  return maxDuration - ratio * (maxDuration - minDuration);
}

/**
 * Format magnitude for display
 */
export function formatMagnitude(magnitude: number): string {
  return magnitude.toFixed(1);
}

/**
 * Format depth for display
 */
export function formatDepth(depth: number): string {
  return `${Math.round(depth)} km`;
}

/**
 * Format date for display
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  });
}

/**
 * Format large numbers with commas
 */
export function formatNumber(num: number): string {
  return num.toLocaleString('en-US');
}

/**
 * Get magnitude severity label
 */
export function getMagnitudeLabel(magnitude: number): string {
  if (magnitude < 4.0) return 'Minor';
  if (magnitude < 5.0) return 'Light';
  if (magnitude < 6.0) return 'Moderate';
  if (magnitude < 7.0) return 'Strong';
  if (magnitude < 8.0) return 'Major';
  return 'Great';
}

/**
 * Get depth category label
 */
export function getDepthLabel(depth: number): string {
  if (depth < 70) return 'Shallow';
  if (depth < 300) return 'Intermediate';
  return 'Deep';
}
