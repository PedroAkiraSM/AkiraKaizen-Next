'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Hero.module.css';

/* ── Part Definitions ──────────────────────────────────────────── */

interface PartDef {
  src: string;
  left: number;
  top: number;
  width: number;
  zIndex: number;
  id: string;
  /** hidden parts start at opacity 0 */
  hidden?: boolean;
}

const PARTS: PartDef[] = [
  // Base body
  { id: 'camisaPreta', src: '/assets/hero/parts/CamisaPreta.svg', left: 22.71, top: 78.8, width: 55.42, zIndex: 10 },
  { id: 'pescoco', src: '/assets/hero/parts/Pescoco.svg', left: 41.39, top: 67, width: 18.06, zIndex: 11 },
  { id: 'cabeca', src: '/assets/hero/parts/Cabeça.svg', left: 37.92, top: 37, width: 24.58, zIndex: 13 },
  { id: 'sobrancelhas', src: '/assets/hero/parts/Sobrancelhas.svg', left: 41.88, top: 47.3, width: 16.04, zIndex: 16 },
  { id: 'oculos', src: '/assets/hero/parts/Oculos.svg', left: 40.97, top: 49.8, width: 18.47, zIndex: 17 },
  { id: 'cabelo', src: '/assets/hero/parts/Cabelo.svg', left: 38.4, top: 28, width: 22.99, zIndex: 18 },

  // Normal eyes – blinking set
  { id: 'olhosAbertos', src: '/assets/hero/parts/OlhosAbertos.svg', left: 43.4, top: 52, width: 13.68, zIndex: 15 },
  { id: 'olhosSerrados', src: '/assets/hero/parts/OlhosSerrados.svg', left: 43.4, top: 52.5, width: 13.68, zIndex: 15, hidden: true },
  { id: 'olhosFechados', src: '/assets/hero/parts/OlhosFechados.svg', left: 43.4, top: 52.8, width: 13.68, zIndex: 15, hidden: true },

  // Touca (exits on scroll)
  { id: 'touca', src: '/assets/hero/parts/Touca.svg', left: 33.82, top: 69, width: 33.06, zIndex: 9 },

  // Armor (hidden initially, enters on scroll)
  { id: 'camisaFundo', src: '/assets/hero/parts/camisaPretaFundoNova.svg', left: 22.29, top: 69.4, width: 55.42, zIndex: 30, hidden: true },
  { id: 'ombreiraE', src: '/assets/hero/parts/OmbreiraE.svg', left: 17.5, top: 72.4, width: 18.47, zIndex: 31, hidden: true },
  { id: 'ombreiraD', src: '/assets/hero/parts/OmbreiraD.svg', left: 64.03, top: 72.4, width: 18.47, zIndex: 32, hidden: true },
  { id: 'grupo', src: '/assets/hero/parts/Grupo.svg', left: 34.44, top: 69.6, width: 31.74, zIndex: 33, hidden: true },

  // Mask (hidden)
  { id: 'mascara', src: '/assets/hero/parts/Mascara.svg', left: 40.97, top: 55.78, width: 18.68, zIndex: 25, hidden: true },

  // Helmet (hidden)
  { id: 'capacete', src: '/assets/hero/parts/Capacete.svg', left: 30.14, top: 27, width: 40.21, zIndex: 29, hidden: true },

  // Samurai eyes (hidden)
  { id: 'samuraiAberto', src: '/assets/hero/parts/SamuraiAberto.svg', left: 44.4, top: 54.9, width: 11.68, zIndex: 41, hidden: true },
  { id: 'samuraiSerrado', src: '/assets/hero/parts/SamuraiSerrado.svg', left: 44.4, top: 55.8, width: 11.68, zIndex: 41, hidden: true },
  { id: 'samuraiFechado', src: '/assets/hero/parts/SamuraiFechado.svg', left: 44.4, top: 56.3, width: 11.68, zIndex: 41, hidden: true },
];

const STAGE_LABELS = ['I', 'II', 'III', 'IV'] as const;

/* ── Component ─────────────────────────────────────────────────── */

export default function Hero() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const bgTextRef = useRef<HTMLSpanElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  // Refs for each character part (keyed by id)
  const partRefs = useRef<Record<string, HTMLImageElement | null>>({});

  // Stage indicator state
  const [activeStage, setActiveStage] = useState(0);

  // Blink timer handles for cleanup
  const normalBlinkTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const samuraiBlinkTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setPartRef = useCallback(
    (id: string) => (el: HTMLImageElement | null) => {
      partRefs.current[id] = el;
    },
    [],
  );

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const p = partRefs.current;
    const bgText = bgTextRef.current;
    const cta = ctaRef.current;
    const scrollInd = scrollIndicatorRef.current;

    /* ───────────────────────────────────────────────────────────────
     * Master scrub timeline  (progress 0 → 1 maps to 300vh scroll)
     * ─────────────────────────────────────────────────────────────*/
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: wrapper,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.8,
        onUpdate: (self) => {
          const progress = self.progress;
          if (progress < 0.25) setActiveStage(0);
          else if (progress < 0.50) setActiveStage(1);
          else if (progress < 0.75) setActiveStage(2);
          else setActiveStage(3);
        },
      },
    });

    // Helper: safe fromTo that skips if the element is missing
    const ft = (
      el: HTMLElement | null | undefined,
      from: gsap.TweenVars,
      to: gsap.TweenVars,
      position: number,
    ) => {
      if (el) tl.fromTo(el, from, to, position);
    };

    const tw = (
      el: HTMLElement | null | undefined,
      vars: gsap.TweenVars,
      position: number,
    ) => {
      if (el) tl.to(el, vars, position);
    };

    /* 1. Scroll indicator fades out (0-5%) */
    tw(scrollInd, { opacity: 0, duration: 0.05, ease: 'none' }, 0);

    /* 2. Background text: scale 1 → 1.15, opacity 1 → 0 over 0-50% */
    tw(bgText, { scale: 1.15, opacity: 0, duration: 0.50, ease: 'none' }, 0);

    /* 3. Touca fades out (5-20%) */
    tw(p.touca, { opacity: 0, duration: 0.15, ease: 'power1.in' }, 0.05);

    /* 4. Armor enters (10-42%) */
    // camisaPretaFundoNova rises from below
    ft(p.camisaFundo, { yPercent: 30, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.32, ease: 'power2.out' }, 0.10);
    // OmbreiraE enters from left
    ft(p.ombreiraE, { xPercent: -60, opacity: 0 }, { xPercent: 0, opacity: 1, duration: 0.28, ease: 'power2.out' }, 0.14);
    // OmbreiraD enters from right
    ft(p.ombreiraD, { xPercent: 60, opacity: 0 }, { xPercent: 0, opacity: 1, duration: 0.28, ease: 'power2.out' }, 0.14);
    // Grupo fades in
    tw(p.grupo, { opacity: 1, duration: 0.20, ease: 'power1.inOut' }, 0.22);

    /* 5. Mask appears from below (40-58%) */
    ft(p.mascara, { yPercent: 20, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.18, ease: 'power2.out' }, 0.40);

    // Hide sobrancelhas behind mask (oculos stay visible, covered by helmet via z-index)
    tw(p.sobrancelhas, { opacity: 0, duration: 0.12, ease: 'power1.in' }, 0.42);
    // Normal eyes fade out
    tw(p.olhosAbertos, { opacity: 0, duration: 0.12, ease: 'power1.in' }, 0.43);

    /* 6. Helmet descends, hair fades out (60-82%) */
    tw(p.cabelo, { opacity: 0, duration: 0.15, ease: 'power1.in' }, 0.60);
    ft(p.capacete, { yPercent: -40, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.22, ease: 'power2.out' }, 0.60);

    /* 7. Samurai eyes appear (70-78%) */
    tw(p.samuraiAberto, { opacity: 1, duration: 0.08, ease: 'power1.inOut' }, 0.70);

    /* 8. CTAs appear (85-95%) */
    tw(cta, { opacity: 1, duration: 0.10, ease: 'power1.inOut' }, 0.85);

    /* ───────────────────────────────────────────────────────────────
     * Eye blink system
     * ─────────────────────────────────────────────────────────────*/

    function runNormalBlink() {
      const open = p.olhosAbertos;
      const squint = p.olhosSerrados;
      const closed = p.olhosFechados;
      if (!open || !squint || !closed) { scheduleNormalBlink(); return; }

      // Only blink when normal eyes are visible
      if (Number(gsap.getProperty(open, 'opacity')) < 0.5) {
        scheduleNormalBlink();
        return;
      }

      const bt = gsap.timeline({ onComplete: scheduleNormalBlink });
      // open -> squint
      bt.to(open, { opacity: 0, duration: 0.075, ease: 'none' }, 0);
      bt.to(squint, { opacity: 1, duration: 0.075, ease: 'none' }, 0);
      // squint -> closed
      bt.to(squint, { opacity: 0, duration: 0.075, ease: 'none' }, 0.075);
      bt.to(closed, { opacity: 1, duration: 0.075, ease: 'none' }, 0.075);
      // closed -> squint
      bt.to(closed, { opacity: 0, duration: 0.075, ease: 'none' }, 0.15);
      bt.to(squint, { opacity: 1, duration: 0.075, ease: 'none' }, 0.15);
      // squint -> open
      bt.to(squint, { opacity: 0, duration: 0.075, ease: 'none' }, 0.225);
      bt.to(open, { opacity: 1, duration: 0.075, ease: 'none' }, 0.225);
    }

    function scheduleNormalBlink() {
      normalBlinkTimer.current = setTimeout(runNormalBlink, 2500 + Math.random() * 2500);
    }

    function runSamuraiBlink() {
      const open = p.samuraiAberto;
      const squint = p.samuraiSerrado;
      const closed = p.samuraiFechado;
      if (!open || !squint || !closed) { scheduleSamuraiBlink(); return; }

      if (Number(gsap.getProperty(open, 'opacity')) < 0.5) {
        scheduleSamuraiBlink();
        return;
      }

      const bt = gsap.timeline({ onComplete: scheduleSamuraiBlink });
      bt.to(open, { opacity: 0, duration: 0.075, ease: 'none' }, 0);
      bt.to(squint, { opacity: 1, duration: 0.075, ease: 'none' }, 0);
      bt.to(squint, { opacity: 0, duration: 0.075, ease: 'none' }, 0.075);
      bt.to(closed, { opacity: 1, duration: 0.075, ease: 'none' }, 0.075);
      bt.to(closed, { opacity: 0, duration: 0.075, ease: 'none' }, 0.15);
      bt.to(squint, { opacity: 1, duration: 0.075, ease: 'none' }, 0.15);
      bt.to(squint, { opacity: 0, duration: 0.075, ease: 'none' }, 0.225);
      bt.to(open, { opacity: 1, duration: 0.075, ease: 'none' }, 0.225);
    }

    function scheduleSamuraiBlink() {
      samuraiBlinkTimer.current = setTimeout(runSamuraiBlink, 2500 + Math.random() * 2500);
    }

    // Kick off blink loops
    scheduleNormalBlink();
    scheduleSamuraiBlink();

    /* ── Cleanup ─────────────────────────────────────────────────── */
    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((st) => st.kill());
      if (normalBlinkTimer.current) clearTimeout(normalBlinkTimer.current);
      if (samuraiBlinkTimer.current) clearTimeout(samuraiBlinkTimer.current);
    };
  }, []);

  return (
    <div ref={wrapperRef} className={styles.heroWrapper} id="hero">
      <section className={styles.hero} aria-label="Hero">
        {/* ── Decorative lines ────────────────────────────────────── */}
        <div className={styles.lineHorizontalTop} aria-hidden="true" />
        <div className={styles.lineHorizontalBottom} aria-hidden="true" />
        <div className={styles.lineVerticalLeft} aria-hidden="true" />
        <div className={styles.lineVerticalRight} aria-hidden="true" />

        {/* ── Corner marks ────────────────────────────────────────── */}
        <div className={`${styles.cornerMark} ${styles.cornerTL}`} aria-hidden="true" />
        <div className={`${styles.cornerMark} ${styles.cornerTR}`} aria-hidden="true" />
        <div className={`${styles.cornerMark} ${styles.cornerBL}`} aria-hidden="true" />
        <div className={`${styles.cornerMark} ${styles.cornerBR}`} aria-hidden="true" />

        {/* ── Side text left ──────────────────────────────────────── */}
        <div className={styles.sideTextLeft} aria-hidden="true">
          <span className={styles.verticalText}>DIGITAL CRAFTSMAN</span>
          <span className={styles.verticalText}>EST. 2024</span>
        </div>

        {/* ── Side text right ─────────────────────────────────────── */}
        <div className={styles.sideTextRight} aria-hidden="true">
          <span className={styles.verticalTextKanji}>改善</span>
          <span className={styles.verticalTextPage}>01/04</span>
        </div>

        {/* ── Background text ─────────────────────────────────────── */}
        <div className={styles.bgText} aria-hidden="true">
          <span ref={bgTextRef} className={styles.bgTextInner}>
            AKIRA KAIZEN
          </span>
        </div>

        {/* ── Character assembly ──────────────────────────────────── */}
        <div className={styles.characterContainer}>
          {PARTS.map((part) => (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              key={part.id}
              ref={setPartRef(part.id)}
              src={part.src}
              alt=""
              aria-hidden="true"
              draggable={false}
              className={styles.part}
              style={{
                left: `${part.left}%`,
                top: `${part.top}%`,
                width: `${part.width}%`,
                zIndex: part.zIndex,
                opacity: part.hidden ? 0 : 1,
              }}
            />
          ))}
        </div>

        {/* ── Stage indicator (I-IV) ──────────────────────────────── */}
        <div className={styles.stageIndicator} aria-hidden="true">
          <span className={styles.stageLabel}>{STAGE_LABELS[activeStage]}</span>
          <div className={styles.stageDots}>
            {STAGE_LABELS.map((_, i) => (
              <div
                key={i}
                className={`${styles.stageDot}${i === activeStage ? ` ${styles.stageDotActive}` : ''}`}
              />
            ))}
          </div>
        </div>

        {/* ── Scroll indicator ────────────────────────────────────── */}
        <div ref={scrollIndicatorRef} className={styles.scrollIndicator} aria-hidden="true">
          <span className={styles.scrollText}>SCROLL</span>
          <div className={styles.scrollLine}>
            <div className={styles.scrollLineFill} />
          </div>
        </div>

        {/* ── CTAs ────────────────────────────────────────────────── */}
        <div
          ref={ctaRef}
          className={`${styles.ctaContainer}${activeStage === 3 ? ` ${styles.ctaContainerVisible}` : ''}`}
        >
          <a href="#projetos" className={styles.ctaPrimary}>
            VER PROJETOS
          </a>
          <a href="#contato" className={styles.ctaSecondary}>
            CONTATO
          </a>
        </div>
      </section>
    </div>
  );
}
