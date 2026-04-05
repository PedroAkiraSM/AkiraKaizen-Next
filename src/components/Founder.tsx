'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import styles from './Founder.module.css';

gsap.registerPlugin(ScrollTrigger);

const TECH_STACK = [
  'Laravel',
  'PHP',
  'MySQL',
  'JavaScript',
  'React',
  'Tailwind',
  'Alpine.js',
  'Vite',
  'Figma',
  'GSAP',
  'Leaflet.js',
];

export default function Founder() {
  const sectionRef = useRef<HTMLElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const quoteRef = useRef<HTMLQuoteElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const bioRef = useRef<HTMLParagraphElement>(null);
  const badgesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Photo from left
      gsap.from(photoRef.current, {
        x: -80,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      });

      // Info staggered from right
      const infoElements = [
        labelRef.current,
        titleRef.current,
        quoteRef.current,
        infoRef.current,
        bioRef.current,
        badgesRef.current,
      ].filter(Boolean);

      gsap.from(infoElements, {
        x: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="sobre"
      className="py-24 md:py-32 px-6"
      style={{ background: 'var(--bg)' }}
    >
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Photo Column */}
          <div ref={photoRef} className={styles.photoWrapper}>
            <Image
              src="/assets/pedro-real.png"
              alt="Pedro Akira Santos Matoba"
              width={600}
              height={750}
              className={styles.photo}
              priority={false}
            />
          </div>

          {/* Info Column */}
          <div>
            <span
              ref={labelRef}
              className="font-kanji text-[clamp(2rem,4vw,3rem)] block mb-2"
              style={{ color: 'var(--accent)' }}
            >
              改善
            </span>
            <h2
              ref={titleRef}
              className="font-display text-[clamp(1.8rem,4vw,3rem)] font-bold leading-tight mb-8"
              style={{ color: 'var(--text)' }}
            >
              A arte da melhoria
              <br />
              <span style={{ color: 'var(--text-muted)' }}>continua.</span>
            </h2>

            <blockquote ref={quoteRef} className={`${styles.quote} mb-8`}>
              &ldquo;N&#227;o sou um desenvolvedor que cria c&#243;digo. Sou um inventor que transforma
              problemas em solu&#231;&#245;es.&rdquo;
            </blockquote>

            <div ref={infoRef} className="mb-6">
              <h3
                className="font-display text-xl font-bold"
                style={{ color: 'var(--text)' }}
              >
                Pedro Akira Santos Matoba
              </h3>
              <span className={styles.nameAccent} />
              <p
                className="font-body text-sm mt-2 tracking-wide"
                style={{ color: 'var(--accent)' }}
              >
                Fundador & Desenvolvedor Full-Stack
              </p>
            </div>

            <p
              ref={bioRef}
              className="font-body text-sm leading-relaxed mb-8"
              style={{ color: 'var(--text-muted)' }}
            >
              Apaixonado por entender como as coisas funcionam desde crian&#231;a, Pedro
              construiu a AkiraKaizen com uma vis&#227;o clara: ser um inventor de solu&#231;&#245;es,
              n&#227;o apenas um desenvolvedor. Com forma&#231;&#227;o em Sistemas da Informa&#231;&#227;o e um
              background multidisciplinar — 13 anos de jud&#244;, design gr&#225;fico, m&#250;sica e
              educa&#231;&#227;o — traz profundidade t&#233;cnica e pensamento sist&#234;mico para cada
              projeto.
            </p>

            <div ref={badgesRef} className="flex flex-wrap gap-2">
              {TECH_STACK.map((tech) => (
                <span key={tech} className={styles.badge}>
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
