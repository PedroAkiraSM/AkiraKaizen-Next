'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Testimonials.module.css';

gsap.registerPlugin(ScrollTrigger);

const TESTIMONIALS = [
  {
    quote: 'A AkiraKaizen entregou muito além do que esperávamos. O sistema transformou completamente nossa operação.',
    name: 'Rafael Mendes',
    role: 'CEO',
    company: 'ShalomDesk',
  },
  {
    quote: 'Profissionalismo e atenção aos detalhes em cada etapa. O suporte pós-entrega é excepcional.',
    name: 'Carla Yamamoto',
    role: 'Coordenadora de TI',
    company: 'Biblioteca CCSA',
  },
  {
    quote: 'Nunca vi um desenvolvedor que se preocupa tanto em entender o problema antes de propor a solução.',
    name: 'Thiago Alves',
    role: 'Fundador',
    company: 'Portal SEG',
  },
];

const STATS = [
  { value: '7', label: 'Projetos em produção' },
  { value: '99.9%', label: 'Uptime garantido' },
  { value: '<24h', label: 'Tempo de resposta' },
  { value: '∞', label: 'Suporte contínuo' },
];

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const statRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      cardRefs.current.filter(Boolean).forEach((card, i) => {
        gsap.fromTo(
          card!,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            delay: i * 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card!,
              start: 'top 88%',
              toggleActions: 'play none none none',
            },
          },
        );
      });

      statRefs.current.filter(Boolean).forEach((stat, i) => {
        gsap.fromTo(
          stat!,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            delay: i * 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: stat!,
              start: 'top 90%',
              toggleActions: 'play none none none',
            },
          },
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.container}>
        <p className={styles.label}>DEPOIMENTOS</p>
        <h2 className={styles.heading}>
          O que dizem sobre<br />nosso trabalho<span className={styles.dot}>.</span>
        </h2>

        <div className={styles.grid}>
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              ref={(el) => { cardRefs.current[i] = el; }}
              className={styles.card}
            >
              <span className={styles.quoteSymbol}>&#x300C;</span>
              <p className={styles.quote}>{t.quote}</p>
              <div className={styles.author}>
                <span className={styles.authorName}>{t.name}</span>
                <span className={styles.authorRole}>{t.role}, {t.company}</span>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.statsRow}>
          {STATS.map((s, i) => (
            <div
              key={i}
              ref={(el) => { statRefs.current[i] = el; }}
              className={styles.statItem}
            >
              <span className={styles.statValue}>{s.value}</span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
