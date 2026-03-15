/**
 * clockHandAngles.js
 *
 * Algorithms for mapping time values to clock-hand rotation angles.
 *
 * Conventions:
 *   - All returned angles are in degrees.
 *   - 0° = 12 o'clock (straight up).
 *   - Angles increase clockwise (matching CSS `rotate()` and SVG `transform`).
 *   - "Smooth" variants account for sub-unit time so hands move continuously
 *     rather than jumping once per tick.
 */

import {
  fractionalHours,
  fractionalMinutes,
  fractionalSeconds,
} from './timeCalculations.js';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Degrees per second on the second hand (360 / 60). */
const DEGREES_PER_SECOND = 6;

/** Degrees per minute on the minute hand (360 / 60). */
const DEGREES_PER_MINUTE = 6;

/** Degrees per hour on the hour hand (360 / 12). */
const DEGREES_PER_HOUR = 30;

// ---------------------------------------------------------------------------
// Low-level angle calculations
// ---------------------------------------------------------------------------

/**
 * Calculates the second-hand angle with smooth sub-second interpolation.
 *
 * @param {number} seconds      - Whole seconds (0–59).
 * @param {number} milliseconds - Milliseconds (0–999).
 * @param {boolean} [smooth=true] - When false, snaps to whole-second positions.
 * @returns {number} Rotation angle in degrees [0, 360).
 */
export function secondHandAngle(seconds, milliseconds, smooth = true) {
  const s = smooth ? fractionalSeconds(seconds, milliseconds) : seconds;
  return (s * DEGREES_PER_SECOND) % 360;
}

/**
 * Calculates the minute-hand angle with smooth sub-minute interpolation.
 *
 * @param {number} minutes      - Whole minutes (0–59).
 * @param {number} seconds      - Whole seconds (0–59).
 * @param {number} milliseconds - Milliseconds (0–999).
 * @param {boolean} [smooth=true] - When false, snaps to whole-minute positions.
 * @returns {number} Rotation angle in degrees [0, 360).
 */
export function minuteHandAngle(minutes, seconds, milliseconds, smooth = true) {
  const m = smooth ? fractionalMinutes(minutes, seconds, milliseconds) : minutes;
  return (m * DEGREES_PER_MINUTE) % 360;
}

/**
 * Calculates the hour-hand angle with smooth sub-hour interpolation.
 *
 * @param {number} hours        - Hours in 0–23 range.
 * @param {number} minutes      - Whole minutes (0–59).
 * @param {number} seconds      - Whole seconds (0–59).
 * @param {number} milliseconds - Milliseconds (0–999).
 * @param {boolean} [smooth=true] - When false, snaps to whole-hour positions.
 * @returns {number} Rotation angle in degrees [0, 360).
 */
export function hourHandAngle(hours, minutes, seconds, milliseconds, smooth = true) {
  const h = smooth
    ? fractionalHours(hours, minutes, seconds, milliseconds)
    : hours % 12;
  return (h * DEGREES_PER_HOUR) % 360;
}

// ---------------------------------------------------------------------------
// High-level combined calculation
// ---------------------------------------------------------------------------

/**
 * Returns all three hand angles from a single Date object.
 *
 * @param {Date}    [date=new Date()] - The time to render.
 * @param {boolean} [smooth=true]     - Enable sub-unit smooth interpolation.
 * @returns {{ hour: number, minute: number, second: number }}
 *   Object whose values are rotation angles in degrees [0, 360).
 */
export function getHandAngles(date = new Date(), smooth = true) {
  const h = date.getHours();
  const m = date.getMinutes();
  const s = date.getSeconds();
  const ms = date.getMilliseconds();

  return {
    hour:   hourHandAngle(h, m, s, ms, smooth),
    minute: minuteHandAngle(m, s, ms, smooth),
    second: secondHandAngle(s, ms, smooth),
  };
}

// ---------------------------------------------------------------------------
// Coordinate helpers (for canvas / SVG rendering)
// ---------------------------------------------------------------------------

/**
 * Converts a rotation angle and hand length to (x, y) tip coordinates,
 * with the clock centre as the origin.
 *
 * Useful when the renderer needs endpoint coordinates rather than a CSS
 * `rotate()` transform (e.g. SVG `<line>` or Canvas `lineTo`).
 *
 * @param {number} angleDeg  - Clockwise angle from 12 o'clock, in degrees.
 * @param {number} length    - Length of the hand (in whatever unit the
 *                             caller uses – pixels, viewBox units, etc.).
 * @returns {{ x: number, y: number }}
 *   Tip coordinates relative to the clock centre (positive y is downward).
 */
export function handTipCoordinates(angleDeg, length) {
  // Convert from "clockwise from top" to standard math angle
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: length * Math.cos(rad),
    y: length * Math.sin(rad),
  };
}
