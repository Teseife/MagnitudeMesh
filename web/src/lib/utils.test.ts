import { describe, it, expect } from 'vitest';
import { getMagnitudeSize, getDepthColor, getMagnitudeLabel } from './utils';

describe('Visualization Utils', () => {
  describe('getMagnitudeSize', () => {
    it('returns minimum size for small earthquakes', () => {
      expect(getMagnitudeSize(1.0)).toBe(5);
      expect(getMagnitudeSize(2.5)).toBe(5);
    });

    it('returns maximum size for large earthquakes', () => {
      expect(getMagnitudeSize(7.0)).toBe(20);
      expect(getMagnitudeSize(9.0)).toBe(20);
    });

    it('interpolates size linearly for medium earthquakes', () => {
      // 4.75 is exactly halfway between 2.5 and 7.0
      // Size should be halfway between 5 and 20 -> 12.5
      expect(getMagnitudeSize(4.75)).toBeCloseTo(12.5);
    });
  });

  describe('getDepthColor', () => {
    it('returns reddish color for shallow earthquakes (<70km)', () => {
      const color = getDepthColor(10);
      expect(color.r).toBe(255);
      // Green component grows as depth increases, but should be low for very shallow
      expect(color.g).toBeGreaterThan(50);
      expect(color.g).toBeLessThan(110);
    });

    it('returns bluish color for deep earthquakes (>300km)', () => {
      const color = getDepthColor(500);
      // Deep format: Blue/Purple
      expect(color.r).toBeGreaterThan(0);
      expect(color.b).toBeGreaterThan(200);
    });
  });

  describe('getMagnitudeLabel', () => {
    it('categorizes magnitudes correctly', () => {
      expect(getMagnitudeLabel(3.5)).toBe('Minor');
      expect(getMagnitudeLabel(4.5)).toBe('Light');
      expect(getMagnitudeLabel(5.5)).toBe('Moderate');
      expect(getMagnitudeLabel(6.5)).toBe('Strong');
      expect(getMagnitudeLabel(7.5)).toBe('Major');
      expect(getMagnitudeLabel(8.5)).toBe('Great');
    });
  });
});
