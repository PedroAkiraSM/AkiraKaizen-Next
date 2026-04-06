'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import MagneticButton from './MagneticButton';

gsap.registerPlugin(ScrollTrigger);

export default function CtaBanner() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    gsap.fromTo(
      ref.current,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      },
    );
  }, []);

  return (
    <div
      ref={ref}
      style={{
        background: 'var(--accent, #fc193b)',
        padding: 'clamp(3rem, 6vw, 5rem) 1.5rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <p
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.6rem, 3.5vw, 2.8rem)',
          fontWeight: 800,
          color: '#ffffff',
          lineHeight: 1.2,
          marginBottom: '2rem',
          maxWidth: '800px',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      >
        Pronto para transformar sua ideia em realidade?
      </p>
      <MagneticButton
        href="#contato"
        className=""
        strength={0.2}
      >
        <span
          style={{
            display: 'inline-block',
            padding: '14px 40px',
            background: '#ffffff',
            color: 'var(--accent, #fc193b)',
            fontFamily: 'var(--font-display)',
            fontSize: '0.85rem',
            fontWeight: 700,
            letterSpacing: '0.2em',
            textTransform: 'uppercase' as const,
            textDecoration: 'none',
            transition: 'transform 0.2s ease',
          }}
        >
          COMEÇAR MEU PROJETO
        </span>
      </MagneticButton>
    </div>
  );
}
