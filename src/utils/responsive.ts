import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

/**
 * The smaller screen dimension — used as the base for clock sizing
 * so the clock always fits on screen regardless of orientation.
 */
export const BASE_DIMENSION = Math.min(SCREEN_WIDTH, SCREEN_HEIGHT);

/**
 * Scale a size relative to a 375pt reference screen (iPhone SE/13 mini).
 * Useful for text and spacing that should scale proportionally.
 */
export function scale(size: number): number {
  return (BASE_DIMENSION / 375) * size;
}

/**
 * Normalize a size using PixelRatio for crisp rendering on all densities.
 */
export function normalize(size: number): number {
  return Math.round(PixelRatio.roundToNearestPixel(scale(size)));
}

/**
 * Calculate clock dimensions proportional to the available screen size.
 * The clock occupies 80% of the smaller screen dimension so it always fits
 * with comfortable margins on both phones and tablets.
 */
export function getClockSize(fraction = 0.8): number {
  return BASE_DIMENSION * fraction;
}

export { SCREEN_WIDTH, SCREEN_HEIGHT };
