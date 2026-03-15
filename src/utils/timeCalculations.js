/**
 * timeCalculations.js
 *
 * Core time extraction utilities for the analog clock.
 * All functions accept a Date object and return numeric values
 * suitable for direct use by the clock hand positioning algorithms.
 */

/**
 * Returns a snapshot of the current time components from a Date.
 *
 * @param {Date} [date=new Date()] - The date/time to extract from.
 * @returns {{ hours: number, minutes: number, seconds: number, milliseconds: number }}
 */
export function getTimeComponents(date = new Date()) {
  return {
    hours: date.getHours(),         // 0–23
    minutes: date.getMinutes(),     // 0–59
    seconds: date.getSeconds(),     // 0–59
    milliseconds: date.getMilliseconds(), // 0–999
  };
}

/**
 * Converts 24-hour hours to 12-hour format.
 *
 * @param {number} hours - Hours in 0–23 range.
 * @returns {number} Hours in 0–11 range.
 */
export function toTwelveHour(hours) {
  return hours % 12;
}

/**
 * Returns fractional seconds including milliseconds.
 * Useful for smooth (sub-second) animation of the second hand.
 *
 * @param {number} seconds - Whole seconds (0–59).
 * @param {number} milliseconds - Milliseconds (0–999).
 * @returns {number} Fractional seconds in [0, 60).
 */
export function fractionalSeconds(seconds, milliseconds) {
  return seconds + milliseconds / 1000;
}

/**
 * Returns fractional minutes including seconds and milliseconds.
 * Used for smooth minute-hand movement.
 *
 * @param {number} minutes - Whole minutes (0–59).
 * @param {number} seconds - Whole seconds (0–59).
 * @param {number} milliseconds - Milliseconds (0–999).
 * @returns {number} Fractional minutes in [0, 60).
 */
export function fractionalMinutes(minutes, seconds, milliseconds) {
  return minutes + fractionalSeconds(seconds, milliseconds) / 60;
}

/**
 * Returns fractional hours (12-hour) including minutes, seconds, and ms.
 * Used for smooth hour-hand movement.
 *
 * @param {number} hours - Hours in 0–23 range.
 * @param {number} minutes - Whole minutes (0–59).
 * @param {number} seconds - Whole seconds (0–59).
 * @param {number} milliseconds - Milliseconds (0–999).
 * @returns {number} Fractional 12-hour value in [0, 12).
 */
export function fractionalHours(hours, minutes, seconds, milliseconds) {
  return toTwelveHour(hours) + fractionalMinutes(minutes, seconds, milliseconds) / 60;
}
