'use client';

import { useRef, useCallback, useEffect } from 'react';
import type { HandData } from '../lib/constants';

// MediaPipe types (loaded dynamically from CDN)
interface MediaPipeLandmarker {
  detectForVideo(video: HTMLVideoElement, timestamp: number): {
    landmarks?: Array<Array<{ x: number; y: number; z: number }>>;
    handednesses?: Array<Array<{ categoryName: string }>>;
  };
}

/* eslint-disable @typescript-eslint/no-explicit-any */
type MediaPipeModule = {
  FilesetResolver: {
    forVisionTasks(wasmPath: string): Promise<any>;
  };
  HandLandmarker: {
    createFromOptions(vision: any, opts: any): Promise<MediaPipeLandmarker>;
  };
};

async function loadMediaPipe(): Promise<MediaPipeModule> {
  const importFn = new Function('url', 'return import(url)') as (url: string) => Promise<any>;
  return importFn('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/vision_bundle.mjs');
}
/* eslint-enable @typescript-eslint/no-explicit-any */

// Smoothing factor: 0 = no smoothing, 1 = frozen. 0.4 is a good balance.
const SMOOTH_FACTOR = 0.4;
const WARMUP_FRAMES = 30;

interface SmoothedHand {
  cx: number;
  cy: number;
  xMin: number;
  yMin: number;
  xMax: number;
  yMax: number;
  angle: number;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function useHandTracking(videoRef: React.RefObject<HTMLVideoElement | null>) {
  const landmarkerRef = useRef<MediaPipeLandmarker | null>(null);
  const readyRef = useRef(false);
  const handsRef = useRef<HandData[]>([]);
  const lastTimestampRef = useRef(-1);
  const warmedUpRef = useRef(false);

  // Smoothing state per hand slot (left=0, right=1)
  const smoothRef = useRef<Map<string, SmoothedHand>>(new Map());

  const init = useCallback(async () => {
    if (landmarkerRef.current) return;

    try {
      const { FilesetResolver, HandLandmarker } = await loadMediaPipe();

      const filesetResolver = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
      );

      const landmarker = await HandLandmarker.createFromOptions(filesetResolver, {
        baseOptions: {
          modelAssetPath:
            'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/latest/hand_landmarker.task',
          delegate: 'GPU',
        },
        runningMode: 'VIDEO',
        numHands: 2,
        minHandDetectionConfidence: 0.6,
        minHandPresenceConfidence: 0.6,
        minTrackingConfidence: 0.6,
      });

      landmarkerRef.current = landmarker;

      // Extended warmup — run more frames to let GPU compile shaders
      warmup(landmarker);
    } catch (e) {
      console.error('Failed to initialize hand tracking:', e);
    }
  }, []);

  const warmup = useCallback((landmarker: MediaPipeLandmarker) => {
    const video = videoRef.current;
    if (!video || video.readyState < 2) {
      setTimeout(() => warmup(landmarker), 100);
      return;
    }

    let frames = 0;
    const doFrame = () => {
      if (frames >= WARMUP_FRAMES) {
        warmedUpRef.current = true;
        readyRef.current = true;
        console.log(`MediaPipe aquecido! (${WARMUP_FRAMES} frames)`);
        return;
      }
      try {
        const now = performance.now();
        if (now > lastTimestampRef.current) {
          landmarker.detectForVideo(video, now);
          lastTimestampRef.current = now;
        }
      } catch {
        /* ignore warmup errors */
      }
      frames++;
      requestAnimationFrame(doFrame);
    };
    doFrame();
  }, [videoRef]);

  const update = useCallback((): HandData[] => {
    if (!readyRef.current || !landmarkerRef.current || !videoRef.current) return [];
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

        // Calculate raw bounding box
        let rawXMin = 1, rawXMax = 0, yMinVal = 1, yMaxVal = 0;
        for (let j = 0; j < lms.length; j++) {
          const lx = lms[j].x, ly = lms[j].y;
          if (lx < rawXMin) rawXMin = lx;
          if (lx > rawXMax) rawXMax = lx;
          if (ly < yMinVal) yMinVal = ly;
          if (ly > yMaxVal) yMaxVal = ly;
        }

        // Mirror X (front camera is mirrored)
        const margin = 0.03;
        const xMin = Math.max(0, 1 - rawXMax - margin);
        const yMin = Math.max(0, yMinVal - margin);
        const xMax = Math.min(1, 1 - rawXMin + margin);
        const yMax = Math.min(1, yMaxVal + margin);

        const cx = (xMin + xMax) / 2;
        const cy = (yMin + yMax) / 2;

        // Determine side by POSITION (most reliable with mirrored camera)
        // After mirror: if hand center is on screen left (cx < 0.5) → LEFT hand
        // This is more reliable than MediaPipe's handedness label which gets confused with mirror
        let side: HandData['side'];
        if (result.landmarks.length === 2) {
          // Two hands detected: leftmost is LEFT, rightmost is RIGHT
          // We'll assign after the loop
          side = '?';
        } else {
          // Single hand: use position
          side = cx < 0.5 ? 'ESQUERDA' : 'DIREITA';
        }

        // Calculate angle from wrist (0) to middle finger base (9)
        // Mirror the X component since camera is mirrored
        const wrist = lms[0];
        const midBase = lms[9];
        const dx = -(midBase.x - wrist.x); // negate because mirrored
        const dy = midBase.y - wrist.y;
        const rawAngle = Math.atan2(dx, -dy) * (180 / Math.PI);

        // Apply smoothing
        const slotKey = `hand_${i}`;
        const prev = smoothRef.current.get(slotKey);
        let smoothed: SmoothedHand;

        if (prev) {
          const t = 1 - SMOOTH_FACTOR;
          smoothed = {
            cx: lerp(prev.cx, cx, t),
            cy: lerp(prev.cy, cy, t),
            xMin: lerp(prev.xMin, xMin, t),
            yMin: lerp(prev.yMin, yMin, t),
            xMax: lerp(prev.xMax, xMax, t),
            yMax: lerp(prev.yMax, yMax, t),
            angle: lerp(prev.angle, rawAngle, t),
          };
        } else {
          smoothed = { cx, cy, xMin, yMin, xMax, yMax, angle: rawAngle };
        }
        smoothRef.current.set(slotKey, smoothed);

        hands.push({
          center: [smoothed.cx, smoothed.cy],
          bbox: [smoothed.xMin, smoothed.yMin, smoothed.xMax, smoothed.yMax],
          angle: smoothed.angle,
          side,
        });
      }

      // If two hands detected, assign side by X position (left-to-right)
      if (hands.length === 2) {
        if (hands[0].center[0] < hands[1].center[0]) {
          hands[0].side = 'ESQUERDA';
          hands[1].side = 'DIREITA';
        } else {
          hands[0].side = 'DIREITA';
          hands[1].side = 'ESQUERDA';
        }
      }
    }

    // Clean up smoothing slots for hands that disappeared
    if (result.landmarks) {
      const activeSlots = new Set(result.landmarks.map((_, i) => `hand_${i}`));
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
