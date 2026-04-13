'use client';

import { STATE, type GameState } from '../lib/constants';

interface ResultDisplayProps {
  state: GameState;
  lastResult: string;
  resultStart: number;
  resultDuration: number;
}

export default function ResultDisplay({
  state,
  lastResult,
  resultStart,
  resultDuration,
}: ResultDisplayProps) {
  const isResult = state === STATE.RESULT;
  let opacity = 0;
  let scale = 1;

  if (isResult) {
    const elapsed = performance.now() / 1000 - resultStart;
    if (elapsed < resultDuration) {
      opacity = 1;
      scale = 1 + Math.max(0, 0.5 - elapsed) * 1.5;
    }
  }

  const isDefend = lastResult.includes('DEFENDEU');

  return (
    <div
      className="fixed top-1/2 left-1/2 z-[8] pointer-events-none transition-opacity duration-200"
      style={{
        fontFamily: 'var(--font-russo)',
        fontSize: 'clamp(3rem, 8vw, 6rem)',
        textShadow: '0 4px 30px rgba(0,0,0,0.8)',
        color: isDefend ? '#00ff88' : '#ff4444',
        opacity,
        transform: `translate(-50%, -50%) scale(${scale})`,
      }}
    >
      {lastResult}
    </div>
  );
}
