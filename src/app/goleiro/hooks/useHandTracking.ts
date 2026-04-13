'use client';

import { useRef, useCallback, useEffect } from 'react';
import type { HandData } from '../lib/constants';

/* eslint-disable @typescript-eslint/no-explicit-any */
interface MediaPipeLandmarker {
  detectForVideo(video: HTMLVideoElement, timestamp: number): {
    landmarks?: Array<Array<{ x: number; y: number; z: number }>>;
    handednesses?: Array<Array<{ categoryName: string }>>;
  };
}

type MediaPipeModule = {
  FilesetResolver: { forVisionTasks(wasmPath: string): Promise<any> };
  HandLandmarker: { createFromOptions(vision: any, opts: any): Promise<MediaPipeLandmarker> };
};

async function loadMediaPipe(): Promise<MediaPipeModule> {
  const importFn = new Function('url', 'return import(url)') as (url: string) => Promise<any>;
  return importFn('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/vision_bundle.mjs');
}
/* eslint-enable @typescript-eslint/no-explicit-any */

const SMOOTH_FACTOR = 0.35;
const WARMUP_FRAMES = 30;

interface SmoothedHand {
  cx: number; cy: number;
  xMin: number; yMin: number; xMax: number; yMax: number;
  angle: number;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function useHandTracking(videoRef: React.RefObject<HTMLVideoElement | null>) {
  const landmarkerRef = useRef<MediaPipeLandmarker | null>(null);
  const readyRef = useRef(false);
  const warmedUpRef = useRef(false);
  const handsRef = useRef<HandData[]>([]);
  const lastTimestampRef = useRef(-1);
  const smoothRef = useRef<Map<string, SmoothedHand>>(new Map());

  const init = useCallback(async () => {
    if (landmarkerRef.current) return;
    try {
      const { FilesetResolver, HandLandmarker } = await loadMediaPipe();
      const fs = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
      );
      const landmarker = await HandLandmarker.createFromOptions(fs, {
        baseOptions: {
          modelAssetPath:
            'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/latest/hand_landmarker.task',
          delegate: 'GPU',
        },
        runningMode: 'VIDEO',
        numHands: 2,
        minHandDetectionConfidence: 0.55,
        minHandPresenceConfidence: 0.55,
        minTrackingConfidence: 0.45,
      });
      landmarkerRef.current = landmarker;

      // Warmup
      const video = videoRef.current;
      const doWarmup = (frames: number) => {
        if (frames >= WARMUP_FRAMES || !video) {
          readyRef.current = true;
          warmedUpRef.current = true;
          console.log('MediaPipe ready!');
          return;
        }
        if (video.readyState < 2) {
          setTimeout(() => doWarmup(frames), 100);
          return;
        }
        try {
          const now = performance.now();
          if (now > lastTimestampRef.current) {
            landmarker.detectForVideo(video, now);
            lastTimestampRef.current = now;
          }
        } catch { /* ignore */ }
        requestAnimationFrame(() => doWarmup(frames + 1));
      };
      doWarmup(0);
    } catch (e) {
      console.error('Hand tracking init failed:', e);
    }
  }, [videoRef]);

  // Called from game loop — runs detection and returns smoothed hands
  const update = useCallback((): HandData[] => {
    if (!readyRef.current || !landmarkerRef.current || !videoRef.current) return handsRef.current;
    const video = videoRef.current;
    if (video.readyState < 2) return handsRef.current;

    const now = performance.now();
    if (now <= lastTimestampRef.current) return handsRef.current;
    lastTimestampRef.current = now;

    let result;
    try {
      result = landmarkerRef.current.detectForVideo(video, now);
    } catch {
      return handsRef.current;
    }

    const hands: HandData[] = [];
    if (result.landmarks) {
      for (let i = 0; i < result.landmarks.length; i++) {
        const lms = result.landmarks[i];
        let rawXMin = 1, rawXMax = 0, yMinVal = 1, yMaxVal = 0;
        for (let j = 0; j < lms.length; j++) {
          const lx = lms[j].x, ly = lms[j].y;
          if (lx < rawXMin) rawXMin = lx;
          if (lx > rawXMax) rawXMax = lx;
          if (ly < yMinVal) yMinVal = ly;
          if (ly > yMaxVal) yMaxVal = ly;
        }

        const margin = 0.03;
        const xMin = Math.max(0, 1 - rawXMax - margin);
        const yMin = Math.max(0, yMinVal - margin);
        const xMax = Math.min(1, 1 - rawXMin + margin);
        const yMax = Math.min(1, yMaxVal + margin);
        const cx = (xMin + xMax) / 2;
        const cy = (yMin + yMax) / 2;

        const wrist = lms[0];
        const midBase = lms[9];
        const dx = -(midBase.x - wrist.x);
        const dy = midBase.y - wrist.y;
        const rawAngle = Math.atan2(dx, -dy) * (180 / Math.PI);

        // Smoothing
        const slotKey = `hand_${i}`;
        const prev = smoothRef.current.get(slotKey);
        const t = 1 - SMOOTH_FACTOR;
        const smoothed: SmoothedHand = prev ? {
          cx: lerp(prev.cx, cx, t), cy: lerp(prev.cy, cy, t),
          xMin: lerp(prev.xMin, xMin, t), yMin: lerp(prev.yMin, yMin, t),
          xMax: lerp(prev.xMax, xMax, t), yMax: lerp(prev.yMax, yMax, t),
          angle: lerp(prev.angle, rawAngle, t),
        } : { cx, cy, xMin, yMin, xMax, yMax, angle: rawAngle };
        smoothRef.current.set(slotKey, smoothed);

        hands.push({
          center: [smoothed.cx, smoothed.cy],
          bbox: [smoothed.xMin, smoothed.yMin, smoothed.xMax, smoothed.yMax],
          angle: smoothed.angle,
          side: '?',
        });
      }

      // Assign side by position
      if (hands.length === 2) {
        if (hands[0].center[0] < hands[1].center[0]) {
          hands[0].side = 'ESQUERDA'; hands[1].side = 'DIREITA';
        } else {
          hands[0].side = 'DIREITA'; hands[1].side = 'ESQUERDA';
        }
      } else if (hands.length === 1) {
        hands[0].side = hands[0].center[0] < 0.5 ? 'ESQUERDA' : 'DIREITA';
      }

      // Clean unused slots
      const activeSlots = new Set(result.landmarks.map((_: unknown, i: number) => `hand_${i}`));
      for (const key of smoothRef.current.keys()) {
        if (!activeSlots.has(key)) smoothRef.current.delete(key);
      }
    }

    handsRef.current = hands;
    return hands;
  }, [videoRef]);

  useEffect(() => {
    return () => {
      readyRef.current = false;
      landmarkerRef.current = null;
      smoothRef.current.clear();
    };
  }, []);

  return { init, update, readyRef, warmedUpRef };
}
