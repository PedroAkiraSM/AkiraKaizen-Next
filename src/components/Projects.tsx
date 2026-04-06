'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitTextReveal from './SplitTextReveal';
import styles from './Projects.module.css';

gsap.registerPlugin(ScrollTrigger);

/* -- Data ----------------------------------------------------------- */

interface Project {
  name: string;
  url?: string;
  description: string;
  tags: string[];
  image: string;
  featured?: boolean;
}

const PROJECTS: Project[] = [
  {
    name: 'ShalomDesk',
    url: 'https://shalomdesk.com.br',
    description: 'Plataforma SaaS para gestao de food service',
    tags: ['Laravel', 'SaaS', 'Multi-tenant'],
    image: '/assets/preview-shalomdesk.jpg',
    featured: true,
  },
  {
    name: 'Judo360',
    url: 'https://judo360.com.br',
    description: 'Plataforma educacional completa sobre judo',
    tags: ['PHP', 'MySQL', 'Bootstrap'],
    image: '/assets/preview-judo360.jpg',
  },
  {
    name: 'GeoplasticoBR',
    url: 'https://geoplasticobr.com',
    description: 'Mapa interativo de microplasticos',
    tags: ['PHP', 'Leaflet.js', 'MySQL'],
    image: '/assets/preview-geoplasticobr.jpg',
  },
  {
    name: 'FinanC',
    description: 'PWA de gestao financeira pessoal',
    tags: ['PWA', 'JavaScript', 'OFX/CSV'],
    image: '/assets/preview-financ.jpg',
  },
  {
    name: 'Sousa Design',
    url: 'https://wbdesignn.com.br',
    description: 'Portfolio para agencia criativa',
    tags: ['HTML/CSS', 'JavaScript', 'Branding'],
    image: '/assets/preview-sousadesign.jpg',
  },
  {
    name: 'Biblioteca CCSA',
    url: 'https://bibliotecaccsa.com.br',
    description: 'Gestao bibliografica juridica',
    tags: ['Alpine.js', 'Tailwind', 'PHP'],
    image: '/assets/preview-bibliotecaccsa.jpg',
  },
  {
    name: 'Portal SEG',
    description: 'Site de seguranca eletronica',
    tags: ['HTML/CSS', 'JavaScript', 'AOS'],
    image: '/assets/preview-portalseg.jpg',
  },
];

interface AnimatedStat {
  kind: 'animated';
  value: number;
  suffix: string;
  label: string;
  decimals?: number;
}

interface StaticStat {
  kind: 'static';
  display: string;
  label: string;
}

type Stat = AnimatedStat | StaticStat;

const STATS: Stat[] = [
  { kind: 'animated', value: 7, suffix: '', label: 'Projetos em producao' },
  { kind: 'animated', value: 99.9, suffix: '%', label: 'Uptime garantido', decimals: 1 },
  { kind: 'static', display: '< 24h', label: 'Tempo de resposta' },
  { kind: 'static', display: '\u221E', label: 'Suporte continuo' },
];

/* -- Arrow Icon ----------------------------------------------------- */

function ArrowIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 8H13M13 8L9 4M13 8L9 12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* -- Component ------------------------------------------------------ */

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLAnchorElement | HTMLDivElement | null)[]>([]);
  const statsRef = useRef<HTMLDivElement>(null);
  const statValuesRef = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* -- Card stagger animation ----------------------------------- */
      const cards = cardsRef.current.filter(Boolean) as HTMLElement[];

      cards.forEach((card, i) => {
        gsap.fromTo(
          card,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power3.out',
            delay: i * 0.1,
            scrollTrigger: {
              trigger: card,
              start: 'top 90%',
              toggleActions: 'play none none none',
            },
          },
        );
      });

      /* -- Counter animation ---------------------------------------- */
      if (statsRef.current) {
        const statEls = statValuesRef.current.filter(
          Boolean,
        ) as HTMLSpanElement[];

        ScrollTrigger.create({
          trigger: statsRef.current,
          start: 'top 85%',
          once: true,
          onEnter: () => {
            STATS.forEach((stat, i) => {
              const el = statEls[i];
              if (!el) return;

              if (stat.kind === 'animated') {
                const obj = { val: 0 };
                gsap.to(obj, {
                  val: stat.value,
                  duration: 2,
                  ease: 'power2.out',
                  onUpdate: () => {
                    const decimals = stat.decimals ?? 0;
                    el.textContent = obj.val.toFixed(decimals) + stat.suffix;
                  },
                });
              }
              /* static stats are already rendered with their display value */
            });
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const featured = PROJECTS.find((p) => p.featured)!;
  const regular = PROJECTS.filter((p) => !p.featured);

  /* -- Helper to format number with leading zero -------------------- */
  const padNumber = (n: number) => String(n).padStart(2, '0');

  /* -- Wrap card in link or div depending on url --------------------- */
  const CardWrapper = ({
    project,
    children,
    className,
    refCallback,
    style,
  }: {
    project: Project;
    children: React.ReactNode;
    className: string;
    refCallback: (el: HTMLAnchorElement | HTMLDivElement | null) => void;
    style?: React.CSSProperties;
  }) => {
    if (project.url) {
      return (
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className={className}
          ref={refCallback as (el: HTMLAnchorElement | null) => void}
          style={style}
        >
          {children}
        </a>
      );
    }
    return (
      <div
        className={className}
        ref={refCallback as (el: HTMLDivElement | null) => void}
        style={style}
      >
        {children}
      </div>
    );
  };

  return (
    <section id="projetos" ref={sectionRef} className={styles.section}>
      <div className="max-w-[1200px] mx-auto">
        {/* -- Header ------------------------------------------------ */}
        <p className={styles.label}>PROJETOS</p>
        <SplitTextReveal
          as="h2"
          className={styles.title}
          splitBy="words"
          stagger={0.06}
          duration={0.9}
        >
          Todos em producao.
        </SplitTextReveal>

        {/* -- Featured Card ----------------------------------------- */}
        <CardWrapper
          project={featured}
          className={styles.featuredCard}
          refCallback={(el) => {
            cardsRef.current[0] = el;
          }}
          style={{ opacity: 0 }}
        >
          <div className={styles.featuredImageWrap}>
            <Image
              src={featured.image}
              alt={`Preview do projeto ${featured.name}`}
              fill
              sizes="(max-width: 768px) 100vw, 60vw"
              style={{ objectFit: 'cover' }}
              priority
            />
          </div>
          <div className={styles.featuredInfo}>
            <span className={styles.featuredNumber}>01</span>
            <span className={styles.liveBadge}>
              <span className={styles.liveDot} />
              LIVE
            </span>
            <h3 className={styles.featuredName}>{featured.name}</h3>
            <p className={styles.featuredDesc}>{featured.description}</p>
            <div className={styles.featuredTags}>
              {featured.tags.map((tag) => (
                <span key={tag} className={styles.tag}>
                  {tag}
                </span>
              ))}
            </div>
            {featured.url && (
              <span className={styles.featuredLink}>
                Ver projeto <ArrowIcon />
              </span>
            )}
          </div>
        </CardWrapper>

        {/* -- Regular Cards Grid ------------------------------------ */}
        <div className={styles.grid}>
          {regular.map((project, i) => (
            <CardWrapper
              key={project.name}
              project={project}
              className={styles.card}
              refCallback={(el) => {
                cardsRef.current[i + 1] = el;
              }}
              style={{ opacity: 0 }}
            >
              <div className={styles.cardImageWrap}>
                <Image
                  src={project.image}
                  alt={`Preview do projeto ${project.name}`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  style={{ objectFit: 'cover' }}
                />
                <span className={styles.cardNumber}>{padNumber(i + 2)}</span>
                {project.url && (
                  <span className={styles.liveBadge}>
                    <span className={styles.liveDot} />
                    LIVE
                  </span>
                )}
              </div>
              <div className={styles.cardBody}>
                <h3 className={styles.cardName}>{project.name}</h3>
                <p className={styles.cardDesc}>{project.description}</p>
                <div className={styles.cardTags}>
                  {project.tags.map((tag) => (
                    <span key={tag} className={styles.tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </CardWrapper>
          ))}
        </div>

        {/* -- Stats Row --------------------------------------------- */}
        <div className={styles.statsRow} ref={statsRef}>
          {STATS.map((stat, i) => (
            <div key={stat.label} className={styles.statItem}>
              <span
                className={styles.statValue}
                ref={(el) => {
                  statValuesRef.current[i] = el;
                }}
              >
                {stat.kind === 'static' ? stat.display : `0${stat.suffix}`}
              </span>
              <p className={styles.statLabel}>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
