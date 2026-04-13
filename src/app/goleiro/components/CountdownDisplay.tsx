'use client';

import Image from 'next/image';

interface CountdownDisplayProps {
  number: number;
  /** Total countdown duration in seconds (from difficulty config) */
  countdownDuration: number;
}

// Map countdown progress to kick frames:
// Frame 1 (Comeco): player standing, first part of countdown
// Frame 2 (Meio): preparing kick, middle of countdown
// Frame 3 (Fim): kicking, last part → ball launches after this
const KICK_FRAMES = [
  '/assets/goleiro/Comeco.png',
  '/assets/goleiro/Meio.png',
  '/assets/goleiro/Fim.png',
];

export default function CountdownDisplay({ number, countdownDuration }: CountdownDisplayProps) {
  if (number <= 0) return null;

  // Determine which frame to show based on countdown progress
  // number counts down: e.g. 3, 2, 1 for a 2s countdown
  // Higher number = earlier in sequence
  let frameIndex: number;
  if (countdownDuration <= 1.0) {
    // Short countdown: just show Meio then Fim
    frameIndex = number > 1 ? 1 : 2;
  } else {
    // Normal countdown: map to 3 frames
    const maxNum = Math.ceil(countdownDuration);
    const progress = 1 - (number - 1) / Math.max(maxNum - 1, 1); // 0 → 1
    if (progress < 0.33) frameIndex = 0;
    else if (progress < 0.66) frameIndex = 1;
    else frameIndex = 2;
  }

  return (
    <div className="fixed inset-0 z-[4] pointer-events-none flex items-center justify-center">
      <div
        className="relative transition-all duration-300"
        style={{
          width: 'clamp(180px, 35vw, 350px)',
          height: 'clamp(280px, 50vh, 550px)',
          marginTop: '10vh',
        }}
      >
        {KICK_FRAMES.map((src, i) => (
          <Image
            key={src}
            src={src}
            alt={`Kick frame ${i + 1}`}
            fill
            className={`object-contain transition-opacity duration-200 ${
              i === frameIndex ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              filter: 'drop-shadow(0 0 20px rgba(0,0,0,0.8))',
              transform: i === 2 ? 'scale(1.05)' : 'scale(1)',
            }}
            priority
          />
        ))}
      </div>
    </div>
  );
}
