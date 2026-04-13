'use client';

import { DIFF_CARDS, DIFFICULTIES, type DifficultyKey } from '../lib/constants';

interface SelectScreenProps {
  visible: boolean;
  onSelect: (key: DifficultyKey) => void;
  onBack: () => void;
}

export default function SelectScreen({ visible, onSelect, onBack }: SelectScreenProps) {
  return (
    <div
      className={`fixed inset-0 flex flex-col items-center justify-center z-10 p-4 transition-opacity duration-400
        ${visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      style={{
        background: `
          linear-gradient(180deg, rgba(0,0,0,0.85) 0%, rgba(0,20,0,0.7) 100%),
          url('/assets/goleiro/FundoGoleirPOV.png') center/cover`,
      }}
    >
      <h2
        className="text-white mb-6"
        style={{
          fontFamily: 'var(--font-russo)',
          fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
        }}
      >
        ESCOLHA A DIFICULDADE
      </h2>

      <div className="grid grid-cols-2 gap-4 max-w-[700px] w-full px-2 max-sm:gap-3">
        {DIFF_CARDS.map(({ key, emoji, bg, tags }) => {
          const cfg = DIFFICULTIES[key];
          return (
            <button
              key={key}
              onClick={() => onSelect(key)}
              className="relative rounded-[20px] text-left cursor-pointer
                transition-all duration-350 border-3 border-white/10 overflow-hidden
                active:scale-[0.97] hover:border-white/30
                p-[1.8rem_1.2rem_1.4rem] max-sm:p-[1.2rem_0.8rem_1rem]"
              style={{ background: bg }}
            >
              {/* Glass highlight */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 60%)',
                }}
              />

              <span className="text-[2.5rem] block mb-1 max-sm:text-[2rem]">
                {emoji}
              </span>

              <div
                className="text-white mb-1"
                style={{
                  fontFamily: 'var(--font-russo)',
                  fontSize: 'clamp(1.2rem, 2.5vw, 1.6rem)',
                }}
              >
                {cfg.label}
              </div>

              <div
                className="mb-3 leading-[1.4]"
                style={{
                  color: 'rgba(255,255,255,0.8)',
                  fontSize: 'clamp(0.75rem, 1.3vw, 0.9rem)',
                }}
              >
                {cfg.description}
              </div>

              <div className="flex flex-wrap gap-1.5">
                {tags.map(t => (
                  <span
                    key={t}
                    className="inline-block px-2.5 py-0.5 rounded-full text-[0.7rem] font-semibold"
                    style={{
                      background: 'rgba(0,0,0,0.3)',
                      color: 'rgba(255,255,255,0.85)',
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div
                className="block mt-4 py-2.5 rounded-xl text-center text-white"
                style={{
                  fontFamily: 'var(--font-russo)',
                  fontSize: '1rem',
                  background: 'rgba(255,255,255,0.15)',
                }}
              >
                JOGAR
              </div>
            </button>
          );
        })}
      </div>

      <button
        onClick={onBack}
        className="mt-5 px-8 py-2.5 font-semibold text-[0.9rem] rounded-full cursor-pointer
          transition-all duration-200 border-2 hover:text-white hover:border-white/40"
        style={{
          fontFamily: 'var(--font-poppins)',
          color: 'rgba(255,255,255,0.5)',
          background: 'transparent',
          borderColor: 'rgba(255,255,255,0.15)',
        }}
      >
        VOLTAR
      </button>
    </div>
  );
}
