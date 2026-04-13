'use client';

import type { DifficultyConfig } from '../lib/constants';

interface GameOverScreenProps {
  visible: boolean;
  config: DifficultyConfig;
  defesas: number;
  gols: number;
  rating: string;
  onReplay: () => void;
}

export default function GameOverScreen({
  visible,
  config,
  defesas,
  gols,
  rating,
  onReplay,
}: GameOverScreenProps) {
  return (
    <div
      className={`fixed inset-0 flex flex-col items-center justify-center z-10 transition-opacity duration-400
        ${visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      style={{
        background: 'rgba(0, 0, 0, 0.88)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <h2
        className="text-white"
        style={{
          fontFamily: 'var(--font-russo)',
          fontSize: 'clamp(2.2rem, 6vw, 4rem)',
        }}
      >
        FIM DE JOGO!
      </h2>

      <p
        className="mt-2 text-[1.1rem] font-bold"
        style={{ color: config.color }}
      >
        Nivel: {config.label}
      </p>

      <div className="mt-6 flex gap-6 max-sm:gap-3">
        <div className="text-center px-8 py-4 rounded-2xl min-w-[120px] max-sm:px-5 max-sm:py-3 max-sm:min-w-[100px]"
          style={{ background: 'rgba(255,255,255,0.08)' }}>
          <span
            className="block max-sm:text-[2.2rem]"
            style={{
              fontFamily: 'var(--font-russo)',
              fontSize: '3rem',
              color: '#00ff88',
            }}
          >
            {defesas}
          </span>
          <span className="text-[0.85rem]" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Defesas
          </span>
        </div>

        <div className="text-center px-8 py-4 rounded-2xl min-w-[120px] max-sm:px-5 max-sm:py-3 max-sm:min-w-[100px]"
          style={{ background: 'rgba(255,255,255,0.08)' }}>
          <span
            className="block max-sm:text-[2.2rem]"
            style={{
              fontFamily: 'var(--font-russo)',
              fontSize: '3rem',
              color: '#ff4444',
            }}
          >
            {gols}
          </span>
          <span className="text-[0.85rem]" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Gols sofridos
          </span>
        </div>
      </div>

      <p
        className="mt-6 animate-title-pulse"
        style={{
          fontFamily: 'var(--font-russo)',
          fontSize: 'clamp(1.3rem, 4vw, 2.2rem)',
          color: '#ffd700',
        }}
      >
        {rating}
      </p>

      <button
        onClick={onReplay}
        className="mt-8 px-12 py-4 border-none rounded-full cursor-pointer animate-btn-float
          hover:scale-105 active:scale-105 transition-transform"
        style={{
          fontFamily: 'var(--font-russo)',
          fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)',
          color: '#000',
          background: 'linear-gradient(135deg, #ffd700, #ffaa00)',
          boxShadow: '0 4px 20px rgba(255,215,0,0.4)',
        }}
      >
        JOGAR NOVAMENTE
      </button>
    </div>
  );
}
