'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Founder.module.css';

gsap.registerPlugin(ScrollTrigger);

const PHILOSOPHIES = [
  {
    kanji: '\u6539',
    romaji: 'Kai',
    meaning: 'Mudan\u00e7a',
    desc: 'Transformamos problemas em oportunidades. Cada projeto \u00e9 uma mudan\u00e7a positiva no seu neg\u00f3cio \u2014 n\u00e3o entregamos apenas c\u00f3digo, entregamos evolu\u00e7\u00e3o.',
  },
  {
    kanji: '\u5584',
    romaji: 'Zen',
    meaning: 'Melhoria',
    desc: 'N\u00e3o existe "pronto". Evolu\u00edmos continuamente seu produto, seu c\u00f3digo e sua presen\u00e7a digital. Cada itera\u00e7\u00e3o \u00e9 melhor que a anterior.',
  },
  {
    kanji: '\u9053',
    romaji: 'Do',
    meaning: 'Caminho',
    desc: 'O caminho importa tanto quanto o destino. Processo transparente, entregas constantes e parceria real do in\u00edcio ao fim.',
  },
];

export default function Founder() {
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const quoteRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const bioRef = useRef<HTMLParagraphElement>(null);
  const watermarkRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Section label fade in
      gsap.from(labelRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      });

      // Hero quote fade in
      gsap.from(quoteRef.current, {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: quoteRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      });

      // Philosophy cards stagger from bottom
      const cards = cardsRef.current?.querySelectorAll(
        `.${styles.card}`
      );
      if (cards?.length) {
        gsap.from(cards, {
          opacity: 0,
          y: 60,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: cardsRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        });
      }

      // Bio paragraph fade in
      gsap.from(bioRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: bioRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });

      // Background kanji parallax
      if (watermarkRef.current) {
        gsap.to(watermarkRef.current, {
          yPercent: -20,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="sobre"
      className={styles.section}
      style={{ background: 'var(--bg)' }}
    >
      {/* Background watermark kanji */}
      <span
        ref={watermarkRef}
        className={styles.watermark}
        aria-hidden="true"
      >
        {'\u6539\u5584'}
      </span>

      <div className={styles.container}>
        {/* Section label */}
        <span ref={labelRef} className={styles.label}>
          MISS&Atilde;O, VIS&Atilde;O E VALORES
        </span>

        {/* Hero quote */}
        <h2 ref={quoteRef} className={styles.quote}>
          Nosso nome carrega nossa filosofia.
        </h2>

        {/* Philosophy cards */}
        <div ref={cardsRef} className={styles.cardGrid}>
          {PHILOSOPHIES.map((p) => (
            <div key={p.romaji} className={styles.card}>
              <span className={styles.cardKanji}>{p.kanji}</span>
              <h3 className={styles.cardTitle}>{p.romaji}</h3>
              <p className={styles.cardMeaning}>{p.meaning}</p>
              <p className={styles.cardDescription}>
                &ldquo;{p.desc}&rdquo;
              </p>
            </div>
          ))}
        </div>

        {/* Narrative bio */}
        <p ref={bioRef} className={styles.bio}>
          Com 13 anos de jud&ocirc;, design gr&aacute;fico e
          m&uacute;sica, aprendi que disciplina e criatividade
          caminham juntas. Formado em Sistemas de
          Informa&ccedil;&atilde;o, trago uma vis&atilde;o
          multidisciplinar para cada projeto. A AkiraKaizen nasceu
          da filosofia japonesa de melhoria cont&iacute;nua
          &mdash; cada detalhe importa, cada entrega &eacute; uma
          evolu&ccedil;&atilde;o.
        </p>
      </div>
    </section>
  );
}
