'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Projects.module.css';

gsap.registerPlugin(ScrollTrigger);

/* ── Data ─────────────────────────────────────────────────────────── */

interface Project {
  name: string;
  url: string;
  description: string;
  tags: string[];
  impact: string;
  image: string;
  featured?: boolean;
}

const PROJECTS: Project[] = [
  {
    name: 'ShalomDesk',
    url: 'https://shalomdesk.com.br',
    description: 'Plataforma SaaS para gestão de food service',
    tags: ['Laravel', 'SaaS', 'Multi-tenant'],
    impact: '5 estabelecimentos ativos',
    image: '/assets/preview-shalomdesk.jpg',
    featured: true,
  },
  {
    name: 'Judo360',
    url: 'https://judo360.com.br',
    description: 'Plataforma educacional completa sobre judo',
    tags: ['PHP', 'MySQL', 'Bootstrap'],
    impact: '100+ tecnicas catalogadas',
    image: '/assets/preview-judo360.jpg',
  },
  {
    name: 'GeoplasticoBR',
    url: 'https://geoplasticobr.com',
    description: 'Mapa interativo de microplasticos',
    tags: ['PHP', 'Leaflet.js', 'MySQL'],
    impact: '350+ pontos mapeados',
    image: '/assets/preview-geoplasticobr.jpg',
  },
  {
    name: 'FinanC',
    url: 'https://khaki-newt-183642.hostingersite.com',
    description: 'PWA de gestao financeira pessoal',
    tags: ['PWA', 'JavaScript', 'OFX/CSV'],
    impact: 'Gestao inteligente de financas',
    image: '/assets/preview-financ.jpg',
  },
  {
    name: 'Sousa Design',
    url: 'https://wbdesignn.com.br',
    description: 'Portfolio para agencia criativa',
    tags: ['HTML/CSS', 'JavaScript', 'Branding'],
    impact: 'Identidade visual completa',
    image: '/assets/preview-sousadesign.jpg',
  },
  {
    name: 'Biblioteca CCSA',
    url: 'https://bibliotecaccsa.com.br',
    description: 'Gestao bibliografica juridica',
    tags: ['Alpine.js', 'Tailwind', 'PHP'],
    impact: '2.000+ obras catalogadas',
    image: '/assets/preview-bibliotecaccsa.jpg',
  },
  {
    name: 'Portal SEG',
    url: 'https://springgreen-stingray-259383.hostingersite.com',
    description: 'Site de seguranca eletronica',
    tags: ['HTML/CSS', 'JavaScript', 'AOS'],
    impact: '10+ anos de mercado',
    image: '/assets/preview-portalseg.jpg',
  },
];

interface Stat {
  value: number;
  suffix: string;
  label: string;
  decimals?: number;
}

const STATS: Stat[] = [
  { value: 15, suffix: 'K+', label: 'Linhas de codigo' },
  { value: 12, suffix: '+', label: 'Tecnologias' },
  { value: 99.97, suffix: '%', label: 'Uptime', decimals: 2 },
  { value: 7, suffix: '+', label: 'Projetos em producao' },
];

/* ── Arrow Icon ───────────────────────────────────────────────────── */

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

/* ── Component ────────────────────────────────────────────────────── */

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const statsRef = useRef<HTMLDivElement>(null);
  const statValuesRef = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* ── Card stagger animation ─────────────────────────────────── */
      const cards = cardsRef.current.filter(Boolean) as HTMLAnchorElement[];

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

      /* ── Counter animation ──────────────────────────────────────── */
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
            });
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const featured = PROJECTS.find((p) => p.featured)!;
  const regular = PROJECTS.filter((p) => !p.featured);

  return (
    <section id="projetos" ref={sectionRef} className={styles.section}>
      <div className="max-w-[1200px] mx-auto">
        {/* ── Header ──────────────────────────────────────────────── */}
        <p className={styles.label}>PROJETOS</p>
        <h2 className={styles.title}>
          7 projetos<span className={styles.titleDot}>.</span> Todos em
          produ&ccedil;&atilde;o<span className={styles.titleDot}>.</span>
        </h2>

        {/* ── Featured Card ───────────────────────────────────────── */}
        <a
          href={featured.url}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.featuredCard}
          ref={(el) => {
            cardsRef.current[0] = el;
          }}
          style={{ opacity: 0 }}
        >
          <div className={styles.featuredImageWrap}>
            <Image
              src={featured.image}
              alt={`Preview do projeto ${featured.name}`}
              fill
              sizes="(max-width: 768px) 100vw, 55vw"
              style={{ objectFit: 'cover' }}
              priority
            />
          </div>
          <div className={styles.featuredInfo}>
            <span className={styles.featuredBadge}>
              <span className={styles.featuredBadgeDot} />
              FEATURED
            </span>
            <h3 className={styles.featuredName}>{featured.name}</h3>
            <p className={styles.featuredDesc}>{featured.description}</p>
            <p className={styles.featuredImpact}>{featured.impact}</p>
            <div className={styles.featuredTags}>
              {featured.tags.map((tag) => (
                <span key={tag} className={styles.tag}>
                  {tag}
                </span>
              ))}
            </div>
            <span className={styles.featuredLink}>
              Ver projeto <ArrowIcon />
            </span>
          </div>
        </a>

        {/* ── Regular Cards Grid ──────────────────────────────────── */}
        <div className={styles.grid}>
          {regular.map((project, i) => (
            <a
              key={project.name}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.card}
              ref={(el) => {
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
                <span className={styles.liveBadge}>
                  <span className={styles.liveDot} />
                  LIVE
                </span>
              </div>
              <div className={styles.cardBody}>
                <h3 className={styles.cardName}>{project.name}</h3>
                <p className={styles.cardDesc}>{project.description}</p>
                <p className={styles.cardImpact}>{project.impact}</p>
                <div className={styles.cardTags}>
                  {project.tags.map((tag) => (
                    <span key={tag} className={styles.tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* ── Stats Row ───────────────────────────────────────────── */}
        <div className={styles.statsRow} ref={statsRef}>
          {STATS.map((stat, i) => (
            <div key={stat.label} className={styles.statItem}>
              <span
                className={styles.statValue}
                ref={(el) => {
                  statValuesRef.current[i] = el;
                }}
              >
                0{stat.suffix}
              </span>
              <p className={styles.statLabel}>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
