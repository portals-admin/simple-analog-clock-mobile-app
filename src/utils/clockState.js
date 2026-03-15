/**
 * clockState.js
 *
 * Framework-agnostic clock state manager.
 *
 * Drives a real-time analog clock by calling a subscriber callback on every
 * animation frame (smooth mode) or on every whole-second tick (discrete mode).
 *
 * Usage
 * -----
 *   import { createClock } from './clockState.js';
 *
 *   const clock = createClock({ smooth: true });
 *
 *   clock.subscribe(({ hour, minute, second }) => {
 *     // update your UI with the new angles
 *   });
 *
 *   clock.start();
 *
 *   // Later, to clean up:
 *   clock.stop();
 */

import { getHandAngles } from './clockHandAngles.js';

/**
 * Creates a clock state manager.
 *
 * @param {object}  [options]
 * @param {boolean} [options.smooth=true]
 *   When true the manager uses requestAnimationFrame for continuous updates
 *   (ideal for smoothly animated hands).
 *   When false it schedules one update per second via setTimeout, which is
 *   appropriate for a tick-style second hand or when battery efficiency matters.
 * @param {() => Date} [options.now=() => new Date()]
 *   Injectable time source, useful for testing or time-travel scenarios.
 *
 * @returns {{
 *   start:       () => void,
 *   stop:        () => void,
 *   subscribe:   (fn: function) => () => void,
 *   getAngles:   () => { hour: number, minute: number, second: number },
 * }}
 */
export function createClock({ smooth = true, now = () => new Date() } = {}) {
  const subscribers = new Set();
  let running = false;
  let rafId = null;
  let timeoutId = null;
  let currentAngles = { hour: 0, minute: 0, second: 0 };

  // ---------------------------------------------------------------------------
  // Internal tick helpers
  // ---------------------------------------------------------------------------

  function tick() {
    const date = now();
    currentAngles = getHandAngles(date, smooth);
    subscribers.forEach((fn) => fn(currentAngles, date));
  }

  function rafLoop() {
    if (!running) return;
    tick();
    rafId = requestAnimationFrame(rafLoop);
  }

  function scheduleNextSecond() {
    if (!running) return;
    tick();
    // Align the next tick to the start of the next whole second.
    const ms = now().getMilliseconds();
    const delay = 1000 - ms;
    timeoutId = setTimeout(scheduleNextSecond, delay);
  }

  // ---------------------------------------------------------------------------
  // Public API
  // ---------------------------------------------------------------------------

  /**
   * Starts the clock. Safe to call multiple times – subsequent calls are no-ops.
   */
  function start() {
    if (running) return;
    running = true;
    tick(); // fire immediately so the UI is correct before first frame/timeout
    if (smooth) {
      rafId = requestAnimationFrame(rafLoop);
    } else {
      const ms = now().getMilliseconds();
      const delay = 1000 - ms;
      timeoutId = setTimeout(scheduleNextSecond, delay);
    }
  }

  /**
   * Stops the clock and cancels all pending callbacks.
   */
  function stop() {
    running = false;
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  }

  /**
   * Subscribes to clock updates.
   *
   * @param {(angles: { hour: number, minute: number, second: number }, date: Date) => void} fn
   * @returns {() => void} Unsubscribe function.
   */
  function subscribe(fn) {
    subscribers.add(fn);
    return () => subscribers.delete(fn);
  }

  /**
   * Returns the most recently computed set of hand angles without subscribing.
   *
   * @returns {{ hour: number, minute: number, second: number }}
   */
  function getAngles() {
    return { ...currentAngles };
  }

  return { start, stop, subscribe, getAngles };
}
