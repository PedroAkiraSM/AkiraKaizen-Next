'use client';

import { useRef, useCallback, useEffect } from 'react';
import type { HandData } from '../lib/constants';

/**
 * Hand tracking via Web Worker with MediaPipe WASM (CPU) backend.
 *
 * Architecture:
 * - Main thread: captures video frames as ImageBitmap, sends to worker
 * - Worker: runs MediaPipe detect() on CPU/WASM (no GPU needed)
 * - Main thread: receives hand positions, applies smoothing
 *
 * The main thread NEVER runs MediaPipe, so the game loop is never blocked.
 */

const SMOOTH_FACTOR = 0.35;
const SEND_INTERVAL_MS = 80; // Send frames every 80ms (~12fps detection)

interface RawHand {
  cx: number; cy: number;
  xMin: number; yMin: number; xMax: number; yMax: number;
  angle: number;
  side?: string;
}

interface SmoothedHand {
  cx: number; cy: number;
  xMin: number; yMin: number; xMax: number; yMax: number;
  angle: number;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function useHandTracking(videoRef: React.RefObject<HTMLVideoElement | null>) {
  const workerRef = useRef<Worker | null>(null);
  const readyRef = useRef(false);
  const warmedUpRef = useRef(false);
  const handsRef = useRef<HandData[]>([]);
  const rawHandsRef = useRef<RawHand[]>([]);
  const smoothRef = useRef<Map<string, SmoothedHand>>(new Map());
  const sendIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // Small canvas to capture video frames for the worker
  const captureCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const init = useCallback(async () => {
    if (workerRef.current) return;

    // Create capture canvas (small resolution for fast processing)
    const canvas = document.createElement('canvas');
    canvas.width = 320;
    canvas.height = 240;
    captureCanvasRef.current = canvas;

    // Create worker
    const worker = new Worker('/workers/handDetect.js', { type: 'module' });
    workerRef.current = worker;

    worker.onmessage = (e) => {
      if (e.data.type === 'ready') {
        readyRef.current = true;
        warmedUpRef.current = true;
        console.log('Hand Worker ready (WASM/CPU)');
        startSendingFrames();
      } else if (e.data.type === 'hands') {
        rawHandsRef.current = e.data.hands;
      } else if (e.data.type === 'error') {
        console.error('Hand Worker error:', e.data.msg);
      }
    };

    worker.postMessage({ type: 'init' });
  }, []);

  const startSendingFrames = useCallback(() => {
    if (sendIntervalRef.current) return;

    sendIntervalRef.current = setInterval(() => {
      const video = videoRef.current;
      const worker = workerRef.current;
      const canvas = captureCanvasRef.current;
      if (!video || !worker || !canvas || video.readyState < 2) return;

      // Draw video frame to small canvas
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(video, 0, 0, 320, 240);

      // Create ImageBitmap and transfer to worker (zero-copy)
      createImageBitmap(canvas).then((bitmap) => {
        worker.postMessage(
          { type: 'frame', bitmap },
          [bitmap] // Transfer ownership — no copy
        );
      }).catch(() => {});
    }, SEND_INTERVAL_MS);
  }, [videoRef]);

  // Called every frame from game loop — instant, just smooths latest data
  const update = useCallback((): HandData[] => {
    const rawHands = rawHandsRef.current;
    const hands: HandData[] = [];
    const t = 1 - SMOOTH_FACTOR;

    for (let i = 0; i < rawHands.length; i++) {
      const raw = rawHands[i];
      const slotKey = `h${i}`;
      const prev = smoothRef.current.get(slotKey);

      const smoothed: SmoothedHand = prev ? {
        cx: lerp(prev.cx, raw.cx, t), cy: lerp(prev.cy, raw.cy, t),
        xMin: lerp(prev.xMin, raw.xMin, t), yMin: lerp(prev.yMin, raw.yMin, t),
        xMax: lerp(prev.xMax, raw.xMax, t), yMax: lerp(prev.yMax, raw.yMax, t),
        angle: lerp(prev.angle, raw.angle, t),
      } : {
        cx: raw.cx, cy: raw.cy,
        xMin: raw.xMin, yMin: raw.yMin, xMax: raw.xMax, yMax: raw.yMax,
        angle: raw.angle,
      };
      smoothRef.current.set(slotKey, smoothed);

      hands.push({
        center: [smoothed.cx, smoothed.cy],
        bbox: [smoothed.xMin, smoothed.yMin, smoothed.xMax, smoothed.yMax],
        angle: smoothed.angle,
        side: (raw.side as HandData['side']) || (smoothed.cx < 0.5 ? 'ESQUERDA' : 'DIREITA'),
      });
    }

    // Cleanup disappeared hands
    if (rawHands.length < smoothRef.current.size) {
      const active = new Set(rawHands.map((_, i) => `h${i}`));
      for (const key of smoothRef.current.keys()) {
        if (!active.has(key)) smoothRef.current.delete(key);
      }
    }

    handsRef.current = hands;
    return hands;
  }, []);

  useEffect(() => {
    return () => {
      if (sendIntervalRef.current) clearInterval(sendIntervalRef.current);
      workerRef.current?.terminate();
      workerRef.current = null;
      readyRef.current = false;
      smoothRef.current.clear();
    };
  }, []);

  return { init, update, readyRef, warmedUpRef };
}
