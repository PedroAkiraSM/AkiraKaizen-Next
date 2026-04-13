"use client";

import { useRef, useCallback, useEffect } from "react";

const FACE_TARGET = {
  xMin: 0.2, xMax: 0.8,
  yMin: 0.08, yMax: 0.5,
  minSize: 0.1, maxSize: 0.6,
};
const FRAMES_TO_CONFIRM = 12;
const DETECT_INTERVAL_MS = 300;

interface FaceDetector {
  detectForVideo: (video: HTMLVideoElement, timestamp: number) => { detections: Array<{ boundingBox: { originX: number; originY: number; width: number; height: number } }> };
}

export function useFaceDetection(
  videoRef: React.RefObject<HTMLVideoElement | null>,
  onPositioned: () => void,
  onLost: () => void,
  enabled: boolean
) {
  const detectorRef = useRef<FaceDetector | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const framesRef = useRef(0);

  const initDetector = useCallback(async () => {
    // @ts-expect-error MediaPipe loaded from CDN
    const FaceDetection = window.FaceDetection;
    if (!FaceDetection) return;

    const detector = new FaceDetection({
      locateFile: (file: string) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`,
    });
    detector.setOptions({ model: "short", minDetectionConfidence: 0.5 });
    await new Promise<void>((resolve) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    detector.onResults((results: any) => {
        const video = videoRef.current;
        if (!video || !results.detections?.length) {
          framesRef.current = Math.max(0, framesRef.current - 2);
          if (framesRef.current === 0) onLost();
          return;
        }
        const d = results.detections[0];
        const box = d.boundingBox;
        const cx = (box.xCenter ?? box.originX + box.width / 2) as number;
        const cy = (box.yCenter ?? box.originY + box.height / 2) as number;
        const size = Math.max(box.width, box.height) as number;

        const inZone =
          cx >= FACE_TARGET.xMin && cx <= FACE_TARGET.xMax &&
          cy >= FACE_TARGET.yMin && cy <= FACE_TARGET.yMax &&
          size >= FACE_TARGET.minSize && size <= FACE_TARGET.maxSize;

        if (inZone) {
          framesRef.current++;
          if (framesRef.current >= FRAMES_TO_CONFIRM) {
            onPositioned();
          }
        } else {
          framesRef.current = Math.max(0, framesRef.current - 2);
          if (framesRef.current < FRAMES_TO_CONFIRM) onLost();
        }
      });
      detector.initialize().then(resolve);
    });
    detectorRef.current = detector;
  }, [videoRef, onPositioned, onLost]);

  useEffect(() => {
    if (!enabled) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
      return;
    }

    const loadScript = () => {
      return new Promise<void>((resolve) => {
        // @ts-expect-error MediaPipe CDN
        if (window.FaceDetection) { resolve(); return; }
        const s = document.createElement("script");
        s.src = "https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/face_detection.js";
        s.crossOrigin = "anonymous";
        s.onload = () => resolve();
        document.head.appendChild(s);
      });
    };

    loadScript().then(() => initDetector()).then(() => {
      intervalRef.current = setInterval(() => {
        const video = videoRef.current;
        const detector = detectorRef.current;
        if (!video || !detector || video.readyState < 2) return;
        // @ts-expect-error MediaPipe send method
        detector.send({ image: video });
      }, DETECT_INTERVAL_MS);
    });

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [enabled, initDetector, videoRef]);

  const reset = useCallback(() => {
    framesRef.current = 0;
  }, []);

  return { reset };
}
