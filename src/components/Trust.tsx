'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Trust.module.css';

gsap.registerPlugin(ScrollTrigger);

const GUARANTEES = [
  {
    kanji: '盾',
    title: 'Código Protegido',
    desc: 'NDA disponível e conformidade LGPD. Seu código-fonte é seu — com documentação completa.',
  },
  {
    kanji: '契',
    title: 'Contrato Claro',
    desc: 'Escopo, prazos e valores definidos antes de começar. Sem surpresas, sem custos ocultos.',
  },
  {
    kanji: '守',
    title: 'Suporte Pós-Entrega',
    desc: 'Não abandonamos projetos. Manutenção, atualizações e evolução contínua após o lançamento.',
  },
  {
    kanji: '改',
    title: 'Revisões Incluídas',
    desc: 'Ajustes até sua aprovação final. Trabalhamos juntos até que esteja perfeito.',
  },
];

export default function Trust() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      cardRefs.current.filter(Boolean).forEach((card, i) => {
        gsap.fromTo(
          card!,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            delay: i * 0.12,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card!,
              start: 'top 88%',
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
        <p className={styles.label}>COMPROMISSO</p>
        <h2 className={styles.heading}>
          Transparência em<br />cada etapa<span className={styles.dot}>.</span>
        </h2>

        <div className={styles.grid}>
          {GUARANTEES.map((g, i) => (
            <div
              key={i}
              ref={(el) => { cardRefs.current[i] = el; }}
              className={styles.card}
            >
              <span className={styles.kanji}>{g.kanji}</span>
              <h3 className={styles.cardTitle}>{g.title}</h3>
              <p className={styles.cardDesc}>{g.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
