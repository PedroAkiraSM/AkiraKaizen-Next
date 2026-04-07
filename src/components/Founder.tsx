'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Founder.module.css';

gsap.registerPlugin(ScrollTrigger);

const PHILOSOPHIES = [
  {
    kanji: '\u3053\u3060\u308F\u308A',
    romaji: 'Kodawari',
    meaning: 'Obsess\u00e3o pelo detalhe',
    desc: 'Cada pixel, cada linha de c\u00f3digo, cada intera\u00e7\u00e3o \u00e9 pensada com precis\u00e3o. N\u00e3o entregamos "bom o suficiente" \u2014 entregamos excel\u00eancia.',
  },
  {
    kanji: '\u751F\u304D\u7532\u6590',
    romaji: 'Ikigai',
    meaning: 'Prop\u00f3sito',
    desc: 'Tecnologia sem prop\u00f3sito \u00e9 desperd\u00edcio. Cada projeto nasce da intersec\u00e7\u00e3o entre o que voc\u00ea precisa e o que podemos criar de melhor.',
  },
  {
    kanji: '\u4F98\u5BC2',
    romaji: 'Wabi-Sabi',
    meaning: 'Beleza na autenticidade',
    desc: 'Valorizamos solu\u00e7\u00f5es aut\u00eanticas sobre templates perfeitos. Cada projeto \u00e9 \u00fanico porque cada neg\u00f3cio \u00e9 \u00fanico.',
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
        {'\u3053\u3060\u308F\u308A'}
      </span>

      <div className={styles.container}>
        {/* Section label */}
        <span ref={labelRef} className={styles.label}>
          SOBRE
        </span>

        {/* Hero quote */}
        <h2 ref={quoteRef} className={styles.quote}>
          N&atilde;o sou um desenvolvedor que cria c&oacute;digo.
          <br />
          Sou um inventor que transforma problemas em
          solu&ccedil;&otilde;es.
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
