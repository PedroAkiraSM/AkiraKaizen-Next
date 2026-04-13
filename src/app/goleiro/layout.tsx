import type { Metadata } from 'next';
import { Russo_One, Poppins } from 'next/font/google';

const russoOne = Russo_One({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-russo',
  display: 'swap',
});

const poppins = Poppins({
  weight: ['400', '600', '700', '900'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Goleiro Virtual - Copa',
  description: 'Defenda o gol usando suas maos! Jogo interativo com deteccao de maos.',
};

export default function GoleiroLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${russoOne.variable} ${poppins.variable} goleiro-root`}>
      <style>{`
        /* Isolate goleiro from main site styles */
        .goleiro-root {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: #0a1a0a;
          overflow: hidden;
          font-family: var(--font-poppins), 'Poppins', sans-serif;
          user-select: none;
          -webkit-tap-highlight-color: transparent;
        }
        /* Override parent smooth scroll */
        .goleiro-root * {
          scroll-behavior: auto !important;
        }

        @keyframes titlePulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
        @keyframes btnFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-title-pulse { animation: titlePulse 3s ease-in-out infinite; }
        .animate-btn-float { animation: btnFloat 2s ease-in-out infinite; }
      `}</style>
      {children}
    </div>
  );
}
