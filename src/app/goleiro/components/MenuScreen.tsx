'use client';

interface MenuScreenProps {
  visible: boolean;
  onStart: () => void;
}

export default function MenuScreen({ visible, onStart }: MenuScreenProps) {
  return (
    <div
      className={`fixed inset-0 flex flex-col items-center justify-center z-10 transition-opacity duration-400
        ${visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      style={{
        background: `
          linear-gradient(180deg, rgba(0,0,0,0.65) 0%, rgba(0,40,0,0.5) 100%),
          url('/assets/goleiro/FundoGoleirPOV.png') center/cover`,
      }}
    >
      <h1
        className="text-white tracking-[4px] animate-title-pulse"
        style={{
          fontFamily: 'var(--font-russo)',
          fontSize: 'clamp(2.8rem, 8vw, 5.5rem)',
          textShadow: '0 4px 30px rgba(0,255,0,0.3)',
        }}
      >
        GOLEIRO VIRTUAL
      </h1>

      <p
        className="font-bold mt-2"
        style={{
          color: '#ffd700',
          fontSize: 'clamp(1.1rem, 3vw, 1.8rem)',
        }}
      >
        Copa - Defenda o Gol!
      </p>

      <div
        className="mt-6 text-center leading-[1.8]"
        style={{
          color: 'rgba(255,255,255,0.7)',
          fontSize: 'clamp(0.85rem, 1.6vw, 1.05rem)',
        }}
      >
        Use suas <strong className="text-white">MAOS</strong> para defender as bolas!
        <br />
        Defenda o maximo que conseguir!
      </div>

      <button
        onClick={onStart}
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
        JOGAR
      </button>
    </div>
  );
}
