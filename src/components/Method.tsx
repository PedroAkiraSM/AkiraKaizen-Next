'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Method.module.css';

gsap.registerPlugin(ScrollTrigger);

const PILLARS = [
  {
    title: 'An\u00e1lise Sist\u00eamica',
    desc: 'Entendemos o sistema inteiro, n\u00e3o a demanda isolada.',
    icon: (
      <svg
        className={styles.pillarIcon}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="1.5" />
        <ellipse cx="24" cy="24" rx="10" ry="18" stroke="currentColor" strokeWidth="1.5" />
        <line x1="6" y1="24" x2="42" y2="24" stroke="currentColor" strokeWidth="1.5" />
        <line x1="24" y1="6" x2="24" y2="42" stroke="currentColor" strokeWidth="1.5" />
        <ellipse cx="24" cy="24" rx="18" ry="7" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
      </svg>
    ),
  },
  {
    title: 'Profundidade T\u00e9cnica',
    desc: 'Dom\u00ednio real em m\u00faltiplas stacks e tecnologias.',
    icon: (
      <svg
        className={styles.pillarIcon}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <rect x="8" y="12" width="32" height="24" rx="3" stroke="currentColor" strokeWidth="1.5" />
        <rect x="14" y="18" width="8" height="6" rx="1" stroke="currentColor" strokeWidth="1.2" />
        <rect x="26" y="18" width="8" height="6" rx="1" stroke="currentColor" strokeWidth="1.2" />
        <rect x="14" y="28" width="20" height="3" rx="1" stroke="currentColor" strokeWidth="1.2" />
        <circle cx="12" cy="8" r="2" stroke="currentColor" strokeWidth="1" />
        <circle cx="24" cy="8" r="2" stroke="currentColor" strokeWidth="1" />
        <circle cx="36" cy="8" r="2" stroke="currentColor" strokeWidth="1" />
        <line x1="12" y1="10" x2="12" y2="12" stroke="currentColor" strokeWidth="1" />
        <line x1="24" y1="10" x2="24" y2="12" stroke="currentColor" strokeWidth="1" />
        <line x1="36" y1="10" x2="36" y2="12" stroke="currentColor" strokeWidth="1" />
      </svg>
    ),
  },
  {
    title: 'Educa\u00e7\u00e3o Integrada',
    desc: 'Cada cliente compreende completamente sua solu\u00e7\u00e3o.',
    icon: (
      <svg
        className={styles.pillarIcon}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M8 34V16L24 8L40 16V34"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M12 18V32H20V26H28V32H36V18"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <line x1="16" y1="22" x2="20" y2="22" stroke="currentColor" strokeWidth="1.2" />
        <line x1="28" y1="22" x2="32" y2="22" stroke="currentColor" strokeWidth="1.2" />
        <path d="M20 38H28" stroke="currentColor" strokeWidth="1.5" />
        <path d="M24 34V38" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
];

const STEPS = [
  { num: '01', title: 'Discovery', desc: 'Imers\u00e3o no problema e contexto do cliente.' },
  { num: '02', title: 'Design', desc: 'Arquitetura de solu\u00e7\u00e3o e prototipagem visual.' },
  { num: '03', title: 'Develop', desc: 'Desenvolvimento iterativo com feedback constante.' },
  { num: '04', title: 'Deploy', desc: 'Lan\u00e7amento otimizado e monitoramento ativo.' },
  { num: '05', title: 'Support', desc: 'Evolu\u00e7\u00e3o cont\u00ednua e melhoria ap\u00f3s entrega.' },
];

export default function Method() {
  const sectionRef = useRef<HTMLElement>(null);
  const pillarsRef = useRef<(HTMLDivElement | null)[]>([]);
  const timelineFillRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<(HTMLDivElement | null)[]>([]);
  const labelRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Label and title fade in
      gsap.from([labelRef.current, titleRef.current], {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      });

      // Pillars stagger from left
      gsap.from(
        pillarsRef.current.filter(Boolean),
        {
          x: -60,
          opacity: 0,
          duration: 0.7,
          stagger: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: pillarsRef.current[0],
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        },
      );

      // Timeline fill driven by scroll
      if (timelineFillRef.current) {
        ScrollTrigger.create({
          trigger: timelineFillRef.current.parentElement,
          start: 'top 70%',
          end: 'bottom 40%',
          scrub: 0.5,
          onUpdate: (self) => {
            const progress = self.progress;
            if (timelineFillRef.current) {
              timelineFillRef.current.style.width = `${progress * 100}%`;
            }
            // Activate steps based on progress
            stepsRef.current.forEach((step, i) => {
              if (!step) return;
              const threshold = (i + 0.5) / STEPS.length;
              if (progress >= threshold) {
                step.classList.add(styles.active);
              } else {
                step.classList.remove(styles.active);
              }
            });
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="metodo"
      className="py-24 md:py-32 px-6"
      style={{ background: 'var(--bg)' }}
    >
      <div className="max-w-[1200px] mx-auto">
        {/* Section Header */}
        <div className="mb-16 md:mb-20">
          <span
            ref={labelRef}
            className="font-accent text-xs tracking-[0.3em] uppercase block mb-4"
            style={{ color: 'var(--accent)' }}
          >
            M&#201;TODO
          </span>
          <h2
            ref={titleRef}
            className="font-display text-[clamp(1.8rem,4vw,3rem)] font-bold leading-tight"
            style={{ color: 'var(--text)' }}
          >
            N&#227;o entregamos c&#243;digo.
            <br />
            <span style={{ color: 'var(--text-muted)' }}>Entregamos compreens&#227;o.</span>
          </h2>
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24 md:mb-32">
          {PILLARS.map((pillar, i) => (
            <div
              key={pillar.title}
              ref={(el) => { pillarsRef.current[i] = el; }}
              className={styles.pillar}
            >
              {pillar.icon}
              <h3
                className="font-display text-lg font-bold mb-2 relative z-10"
                style={{ color: 'var(--text)' }}
              >
                {pillar.title}
              </h3>
              <span className="block w-8 h-[2px] mb-3 relative z-10" style={{ background: 'var(--accent)' }} />
              <p
                className="font-body text-sm leading-relaxed relative z-10"
                style={{ color: 'var(--text-muted)' }}
              >
                {pillar.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Timeline */}
        <div>
          {/* Desktop Timeline (horizontal) */}
          <div className="hidden md:block">
            <div className={styles.timelineTrack}>
              <div ref={timelineFillRef} className={styles.timelineFill} />
            </div>
            <div className="flex mt-8">
              {STEPS.map((step, i) => (
                <div
                  key={step.num}
                  ref={(el) => { stepsRef.current[i] = el; }}
                  className={styles.timelineStep}
                >
                  <div className={styles.stepDot} />
                  <span className={styles.stepNumber}>{step.num}</span>
                  <h4 className={styles.stepTitle}>{step.title}</h4>
                  <p className={styles.stepDesc}>{step.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Timeline (vertical) */}
          <div className="md:hidden space-y-8">
            {STEPS.map((step, i) => (
              <div
                key={step.num}
                ref={(el) => {
                  // Only assign to stepsRef on mobile if not already set by desktop
                  if (!stepsRef.current[i]) {
                    stepsRef.current[i] = el;
                  }
                }}
                className={`${styles.timelineStep} flex items-start gap-4`}
                style={{ opacity: 1 }}
              >
                <div className="flex flex-col items-center shrink-0">
                  <div
                    className="w-3 h-3 rounded-full border-2"
                    style={{
                      borderColor: 'var(--accent)',
                      background: i === 0 ? 'var(--accent)' : 'var(--bg)',
                    }}
                  />
                  {i < STEPS.length - 1 && (
                    <div
                      className="w-[2px] h-16 mt-1"
                      style={{ background: 'var(--border)' }}
                    />
                  )}
                </div>
                <div className="pt-0">
                  <span className={styles.stepNumber}>{step.num}</span>
                  <h4 className={styles.stepTitle}>{step.title}</h4>
                  <p className={styles.stepDesc}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
