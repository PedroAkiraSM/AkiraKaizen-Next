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

/** Load MediaPipe ESM bundle from CDN at runtime (not bundled by Next.js). */
async function loadMediaPipe(): Promise<MediaPipeModule> {
  // Using Function constructor to avoid Next.js/webpack trying to resolve the URL
  const importFn = new Function('url', 'return import(url)') as (url: string) => Promise<any>;
  return importFn('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/vision_bundle.mjs');
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export function useHandTracking(videoRef: React.RefObject<HTMLVideoElement | null>) {
  const landmarkerRef = useRef<MediaPipeLandmarker | null>(null);
  const readyRef = useRef(false);
  const handsRef = useRef<HandData[]>([]);
  const lastTimestampRef = useRef(-1);
  const warmedUpRef = useRef(false);

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
        minHandDetectionConfidence: 0.5,
        minHandPresenceConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      landmarkerRef.current = landmarker;
      readyRef.current = true;

      // Warmup
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
      if (frames >= 10) {
        warmedUpRef.current = true;
        console.log('MediaPipe aquecido!');
        return;
      }
      try {
        const now = performance.now();
        landmarker.detectForVideo(video, now);
        lastTimestampRef.current = now;
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

        let rawXMin = 1, rawXMax = 0, yMinVal = 1, yMaxVal = 0;
        for (let j = 0; j < lms.length; j++) {
          const lx = lms[j].x, ly = lms[j].y;
          if (lx < rawXMin) rawXMin = lx;
          if (lx > rawXMax) rawXMax = lx;
          if (ly < yMinVal) yMinVal = ly;
          if (ly > yMaxVal) yMaxVal = ly;
        }

        // Mirror X
        const xMin = Math.max(0, 1 - rawXMax - 0.03);
        const yMin = Math.max(0, yMinVal - 0.03);
        const xMax = Math.min(1, 1 - rawXMin + 0.03);
        const yMax = Math.min(1, yMaxVal + 0.03);

        const cx = (xMin + xMax) / 2;
        const cy = (yMin + yMax) / 2;

        // Angle
        const wrist = lms[0];
        const midBase = lms[9];
        const dx = midBase.x - wrist.x;
        const dy = midBase.y - wrist.y;
        const angle = Math.atan2(dx, -dy) * (180 / Math.PI);

        let side: HandData['side'] = '?';
        if (result.handednesses && result.handednesses[i]) {
          const raw = result.handednesses[i][0].categoryName;
          side = raw === 'Right' ? 'DIREITA' : 'ESQUERDA';
        }

        hands.push({ center: [cx, cy], bbox: [xMin, yMin, xMax, yMax], angle, side });
      }
    }

    handsRef.current = hands;
    return hands;
  }, [videoRef]);

  // Cleanup is not needed since MediaPipe doesn't expose a destroy method,
  // but we reset refs on unmount
  useEffect(() => {
    return () => {
      readyRef.current = false;
      landmarkerRef.current = null;
    };
  }, []);

  return { init, update, readyRef };
}
