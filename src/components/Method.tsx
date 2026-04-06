'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Method.module.css';

gsap.registerPlugin(ScrollTrigger);

const PILLARS = [
  {
    kanji: '\u5206\u6790',
    title: 'Analise Sistemica',
    desc: 'Entendemos o sistema inteiro, nao a demanda isolada.',
  },
  {
    kanji: '\u6280\u8853',
    title: 'Profundidade Tecnica',
    desc: 'Dominio real em multiplos stacks. Nao usamos templates.',
  },
  {
    kanji: '\u6559\u80B2',
    title: 'Educacao Integrada',
    desc: 'Clientes entendem suas solucoes. Transparencia total.',
  },
];

const STEPS = [
  { num: '01', title: 'Discovery', desc: 'Imersao no problema e contexto do cliente.' },
  { num: '02', title: 'Design', desc: 'Arquitetura da solucao e prototipacao visual.' },
  { num: '03', title: 'Develop', desc: 'Desenvolvimento iterativo com feedback constante.' },
  { num: '04', title: 'Deploy', desc: 'Lancamento otimizado e monitoramento ativo.' },
  { num: '05', title: 'Support', desc: 'Evolucao continua apos a entrega.' },
];

export default function Method() {
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const pillarsRef = useRef<(HTMLDivElement | null)[]>([]);
  const timelineRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // -- Header fade in
      gsap.from([labelRef.current, titleRef.current], {
        y: 40,
        opacity: 0,
        duration: 0.9,
        stagger: 0.18,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      });

      // -- Pillars slide in from left
      pillarsRef.current.filter(Boolean).forEach((pillar, i) => {
        gsap.from(pillar, {
          x: -80,
          opacity: 0,
          duration: 0.8,
          delay: i * 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: pillar,
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
        });
      });

      // -- Timeline steps reveal
      stepsRef.current.filter(Boolean).forEach((step, i) => {
        gsap.from(step, {
          y: 40,
          opacity: 0,
          duration: 0.7,
          delay: i * 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: step,
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="metodo"
      className={styles.section}
    >
      <div className={styles.container}>
        {/* -- Section Header */}
        <div className={styles.header}>
          <span ref={labelRef} className={styles.label}>
            METODO
          </span>
          <h2 ref={titleRef} className={styles.title}>
            Nao entregamos codigo.
            <br />
            <span className={styles.titleMuted}>Entregamos compreensao.</span>
          </h2>
        </div>

        {/* -- Philosophy Pillars */}
        <div className={styles.pillars}>
          {PILLARS.map((pillar, i) => (
            <div
              key={pillar.kanji}
              ref={(el) => { pillarsRef.current[i] = el; }}
              className={styles.pillarRow}
            >
              <div className={styles.pillarKanji} aria-hidden="true">
                {pillar.kanji}
              </div>
              <div className={styles.pillarContent}>
                <h3 className={styles.pillarTitle}>{pillar.title}</h3>
                <p className={styles.pillarDesc}>{pillar.desc}</p>
                <div className={styles.pillarAccentLine} />
              </div>
            </div>
          ))}
        </div>

        {/* -- Timeline */}
        <div ref={timelineRef} className={styles.timeline}>
          <div className={styles.timelineLine} aria-hidden="true" />
          {STEPS.map((step, i) => (
            <div
              key={step.num}
              ref={(el) => { stepsRef.current[i] = el; }}
              className={styles.timelineStep}
            >
              <div className={styles.stepIndicator}>
                <span className={styles.stepNum}>{step.num}</span>
                <div className={styles.stepDot} />
              </div>
              <div className={styles.stepBody}>
                <h4 className={styles.stepTitle}>{step.title}</h4>
                <p className={styles.stepDesc}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
