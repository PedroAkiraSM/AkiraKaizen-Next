'use client';

import type { DifficultyConfig } from '../lib/constants';

interface HUDProps {
  visible: boolean;
  config: DifficultyConfig;
  defesas: number;
  gols: number;
  shotsTaken: number;
  totalShots: number;
}

export default function HUD({
  visible,
  config,
  defesas,
  gols,
  shotsTaken,
  totalShots,
}: HUDProps) {
  if (!visible) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 h-14 flex items-center justify-between px-6 z-5 pointer-events-none"
      style={{
        background: 'linear-gradient(180deg, rgba(0,0,0,0.75) 0%, transparent 100%)',
      }}
    >
      <div className="flex items-center gap-4">
        <span
          className="text-white text-[0.8rem] px-3 py-0.5 rounded-[20px]"
          style={{
            fontFamily: 'var(--font-russo)',
            background: config.color,
          }}
        >
          {config.label}
        </span>
        <span
          className="text-white text-[1.2rem]"
          style={{ fontFamily: 'var(--font-russo)' }}
        >
          Defesas: {defesas} | Gols: {gols}
        </span>
      </div>
      <span className="text-[0.9rem]" style={{ color: 'rgba(255,255,255,0.7)' }}>
        Chute {Math.min(shotsTaken + 1, totalShots)} de {totalShots}
      </span>
    </div>
  );
}
