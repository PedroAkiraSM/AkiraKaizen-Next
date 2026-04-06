'use client';

import styles from './TechMarquee.module.css';

const TECH_ITEMS = [
  'Laravel', 'PHP', 'MySQL', 'JavaScript', 'TypeScript', 'React',
  'Next.js', 'Tailwind', 'Alpine.js', 'Vite', 'Figma', 'GSAP',
  'Three.js', 'Node.js', 'Git', 'Docker',
];

export default function TechMarquee() {
  const doubled = [...TECH_ITEMS, ...TECH_ITEMS];

  return (
    <div className={styles.marqueeWrapper}>
      <div className={styles.marqueeTrack}>
        {doubled.map((tech, i) => (
          <span key={i} className={styles.marqueeItem}>
            {tech}
            <span className={styles.marqueeDot}>&#x2022;</span>
          </span>
        ))}
      </div>
    </div>
  );
}
