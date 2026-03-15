import type { ClockTime, HandAngles, ClockDimensions } from '../types';

/**
 * Convert the current Date into hours/minutes/seconds components.
 */
export function getClockTime(date: Date = new Date()): ClockTime {
  return {
    hours: date.getHours(),
    minutes: date.getMinutes(),
    seconds: date.getSeconds(),
  };
}

/**
 * Compute the rotation angle (in degrees, clockwise from 12 o'clock) for
 * each hand. Angles are smooth/continuous — the hour hand moves gradually
 * between hour marks as minutes elapse, and the minute hand moves as
 * seconds elapse.
 */
export function getHandAngles({ hours, minutes, seconds }: ClockTime): HandAngles {
  const hour = (hours % 12) * 30 + minutes * 0.5 + seconds * (0.5 / 60);
  const minute = minutes * 6 + seconds * 0.1;
  const second = seconds * 6;
  return { hour, minute, second };
}

/**
 * Derive all clock component sizes from the clock diameter.
 * Ratios chosen to look balanced across phone and tablet screens.
 */
export function getClockDimensions(clockSize: number): ClockDimensions {
  const r = clockSize / 2;
  return {
    clockSize,
    hourHandLength: r * 0.5,
    minuteHandLength: r * 0.7,
    secondHandLength: r * 0.75,
    hourHandWidth: normalize(clockSize, 5),
    minuteHandWidth: normalize(clockSize, 3.5),
    secondHandWidth: normalize(clockSize, 1.5),
    centerDotSize: normalize(clockSize, 8),
    tickLength: {
      hour: r * 0.1,
      minute: r * 0.05,
    },
  };
}

/** Scale a measurement as a fraction of the clock radius. */
function normalize(clockSize: number, basePt: number): number {
  return Math.max(1, (clockSize / 375) * basePt);
}
