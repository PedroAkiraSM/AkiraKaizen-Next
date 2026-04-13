'use client';

import { useRef, useCallback, useEffect } from 'react';

/**
 * Manages a requestAnimationFrame loop with delta time.
 * Returns start/stop controls and passes (dt, now) to the callback each frame.
 */
export function useGameLoop(
  callback: (dt: number, now: number) => void,
) {
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef(0);
  const runningRef = useRef(false);
  const callbackRef = useRef(callback);

  // Keep callback ref up to date without restarting the loop
  callbackRef.current = callback;

  const loop = useCallback(() => {
    if (!runningRef.current) return;
    const now = performance.now();
    const dt = Math.min((now - lastTimeRef.current) / 1000, 0.05);
    lastTimeRef.current = now;
    callbackRef.current(dt, now);
    rafRef.current = requestAnimationFrame(loop);
  }, []);

  const start = useCallback(() => {
    if (runningRef.current) return;
    runningRef.current = true;
    lastTimeRef.current = performance.now();
    rafRef.current = requestAnimationFrame(loop);
  }, [loop]);

  const stop = useCallback(() => {
    runningRef.current = false;
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      runningRef.current = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return { start, stop };
}
