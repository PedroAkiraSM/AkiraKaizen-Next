'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Method.module.css';

gsap.registerPlugin(ScrollTrigger);

const PILLARS = [
  {
    kanji: '\u5206\u6790',
    title: 'An\u00e1lise Sist\u00eamica',
    desc: 'Antes de escrever uma linha de c\u00f3digo, mergulhamos no seu neg\u00f3cio. Entendemos o ecossistema completo: seus clientes, processos, dores e objetivos. Isso garante que a solu\u00e7\u00e3o resolva o problema real, n\u00e3o apenas o sintoma.',
  },
  {
    kanji: '\u6280\u8853',
    title: 'Profundidade T\u00e9cnica',
    desc: 'Dom\u00ednio real em m\u00faltiplas tecnologias: Laravel, React, Next.js, bancos de dados, APIs e infraestrutura. Escolhemos a ferramenta certa para cada problema. N\u00e3o usamos templates gen\u00e9ricos \u2014 cada projeto \u00e9 constru\u00eddo sob medida.',
  },
  {
    kanji: '\u6559\u80B2',
    title: 'Educa\u00e7\u00e3o Integrada',
    desc: 'Voc\u00ea n\u00e3o recebe apenas um sistema pronto. Recebe documenta\u00e7\u00e3o completa, treinamento e o conhecimento necess\u00e1rio para operar e evoluir sua solu\u00e7\u00e3o. Transpar\u00eancia total em cada etapa do processo.',
  },
];

const STEPS = [
  {
    num: '01',
    title: 'Discovery',
    desc: 'Reunimos todas as informa\u00e7\u00f5es sobre seu projeto: objetivos de neg\u00f3cio, p\u00fablico-alvo, requisitos t\u00e9cnicos e prazo. Sa\u00edmos dessa fase com um escopo claro e alinhado.',
  },
  {
    num: '02',
    title: 'Design',
    desc: 'Criamos a arquitetura do sistema e prot\u00f3tipos visuais interativos. Voc\u00ea visualiza e aprova cada tela antes do desenvolvimento come\u00e7ar.',
  },
  {
    num: '03',
    title: 'Develop',
    desc: 'Desenvolvimento iterativo com entregas semanais. Voc\u00ea acompanha o progresso em tempo real e d\u00e1 feedback a cada ciclo.',
  },
  {
    num: '04',
    title: 'Deploy',
    desc: 'Lan\u00e7amento otimizado com testes de performance, seguran\u00e7a e monitoramento. Garantimos que tudo funcione perfeitamente desde o primeiro dia.',
  },
  {
    num: '05',
    title: 'Support',
    desc: 'N\u00e3o desaparecemos ap\u00f3s a entrega. Oferecemos suporte cont\u00ednuo, manuten\u00e7\u00e3o preventiva e evolu\u00e7\u00f5es conforme seu neg\u00f3cio cresce.',
  },
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
