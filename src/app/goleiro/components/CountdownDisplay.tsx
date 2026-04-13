'use client';

interface CountdownDisplayProps {
  number: number;
}

export default function CountdownDisplay({ number }: CountdownDisplayProps) {
  return (
    <div
      className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[8] pointer-events-none transition-opacity duration-150"
      style={{
        fontFamily: 'var(--font-russo)',
        fontSize: '12rem',
        color: '#ffd700',
        textShadow: '0 0 60px rgba(255,215,0,0.5)',
        opacity: number > 0 ? 1 : 0,
      }}
    >
      {number > 0 ? number : ''}
    </div>
  );
}
