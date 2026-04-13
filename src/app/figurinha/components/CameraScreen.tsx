"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useCamera } from "../hooks/useCamera";
import { useFaceDetection } from "../hooks/useFaceDetection";

const COUNTDOWN_SECONDS = 3;

interface Props {
  onCapture: (frame: HTMLCanvasElement) => void;
}

export default function CameraScreen({ onCapture }: Props) {
  const { videoRef, start, stop, capture } = useCamera();
  const [countdown, setCountdown] = useState<number | null>(null);
  const [guideText, setGuideText] = useState("Posicione seu rosto na moldura");
  const [positioned, setPositioned] = useState(false);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownActive = useRef(false);

  const startCountdown = useCallback(() => {
    if (countdownActive.current) return;
    countdownActive.current = true;
    let count = COUNTDOWN_SECONDS;
    setCountdown(count);

    countdownRef.current = setInterval(() => {
      count--;
      if (count > 0) {
        setCountdown(count);
      } else {
        if (countdownRef.current) clearInterval(countdownRef.current);
        countdownRef.current = null;
        setCountdown(null);

        // Play shutter sound
        const audio = new Audio("/assets/figurinha/shutter.wav");
        audio.play().catch(() => {});

        // Capture
        const frame = capture();
        if (frame) {
          stop();
          onCapture(frame);
        }
      }
    }, 1000);
  }, [capture, stop, onCapture]);

  const cancelCountdown = useCallback(() => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
    countdownActive.current = false;
    setCountdown(null);
  }, []);

  const onPositioned = useCallback(() => {
    setGuideText("Fique parado...");
    setPositioned(true);
    startCountdown();
  }, [startCountdown]);

  const onLost = useCallback(() => {
    setGuideText("Posicione seu rosto na moldura");
    setPositioned(false);
    cancelCountdown();
  }, [cancelCountdown]);

  const { reset: resetDetection } = useFaceDetection(videoRef, onPositioned, onLost, true);

  useEffect(() => {
    start();
    return () => {
      stop();
      cancelCountdown();
    };
  }, [start, stop, cancelCountdown]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#0A0F1A]">
      <div className="relative w-full max-w-md aspect-[3/4] overflow-hidden rounded-xl border-2 border-white/10">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
        />

        {/* Silhouette guide */}
        <div className="absolute inset-0 pointer-events-none z-10">
          <svg
            viewBox="0 0 400 566"
            preserveAspectRatio="xMidYMid slice"
            className="w-full h-full"
          >
            <path
              d="M 200 40 C 145 40, 110 85, 110 140 C 110 195, 140 235, 175 250 C 155 260, 140 275, 100 295 C 40 320, 0 370, 0 440 L 0 566 400 566 400 440 C 400 370, 360 320, 300 295 C 260 275, 245 260, 225 250 C 260 235, 290 195, 290 140 C 290 85, 255 40, 200 40 Z"
              fill="none"
              stroke={positioned ? "rgba(240,182,6,0.8)" : "rgba(255,255,255,0.5)"}
              strokeWidth="3"
              strokeDasharray="12,8"
              className="transition-all duration-300"
            />
          </svg>
        </div>

        {/* Countdown */}
        {countdown !== null && (
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <span
              className="text-[10rem] font-black text-[#f0b606] animate-ping"
              style={{ textShadow: "0 0 60px rgba(240,182,6,0.5)" }}
            >
              {countdown}
            </span>
          </div>
        )}

        {/* Flash */}
      </div>

      {/* Guide text */}
      <p
        className={`mt-4 px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
          positioned
            ? "bg-[#f0b606] text-[#0A0F1A]"
            : "bg-white/10 text-white/70"
        }`}
      >
        {guideText}
      </p>
    </div>
  );
}
