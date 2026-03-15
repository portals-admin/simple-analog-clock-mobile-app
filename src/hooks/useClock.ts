import { useState, useEffect, useRef } from 'react';
import { getClockTime, getHandAngles } from '../utils/clockUtils';
import type { HandAngles } from '../types';

interface UseClockResult {
  angles: HandAngles;
}

/**
 * Drives the clock by updating hand angles every second.
 * Uses a ref to track the interval so it is cleaned up on unmount
 * and never causes stale-state issues.
 */
export function useClock(): UseClockResult {
  const [angles, setAngles] = useState<HandAngles>(() =>
    getHandAngles(getClockTime())
  );
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const tick = () => setAngles(getHandAngles(getClockTime()));

    // Align the first tick to the start of the next second so updates
    // happen right at the second boundary rather than drifting.
    const msUntilNextSecond = 1000 - (Date.now() % 1000);
    const timeout = setTimeout(() => {
      tick();
      intervalRef.current = setInterval(tick, 1000);
    }, msUntilNextSecond);

    return () => {
      clearTimeout(timeout);
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return { angles };
}
