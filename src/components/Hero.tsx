'use client';

import { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';
import styles from './Hero.module.css';

/* -- Part Definitions -------------------------------------------- */

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
  { id: 'samuraiAberto', src: '/assets/hero/parts/SamuraiAberto.svg', left: 44.4, top: 56.3, width: 11.68, zIndex: 41, hidden: true },
  { id: 'samuraiSerrado', src: '/assets/hero/parts/SamuraiSerrado.svg', left: 44.4, top: 57.8, width: 11.68, zIndex: 41, hidden: true },
  { id: 'samuraiFechado', src: '/assets/hero/parts/SamuraiFechado.svg', left: 44.4, top: 58.3, width: 11.68, zIndex: 41, hidden: true },
];

const STAGE_LABELS = ['I', 'II', 'III', 'IV'] as const;

/* -- Component --------------------------------------------------- */

export default function Hero() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const bgTextRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  // Refs for each character part (keyed by id)
  const partRefs = useRef<Record<string, HTMLImageElement | null>>({});

  // Stage indicator refs (imperative DOM updates avoid re-renders that reset GSAP opacity)
  const stageLabelRef = useRef<HTMLSpanElement>(null);
  const stageDotsRef = useRef<(HTMLDivElement | null)[]>([]);

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

    /* -- Initial text reveal animation --------------------------- */
    if (bgText) {
      const split = new SplitType(bgText as HTMLElement, { types: 'chars' });
      if (split.chars) {
        gsap.fromTo(
          split.chars,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: 0.03,
            ease: 'power3.out',
            delay: 1.5,
          },
        );
      }
    }

    /* ---------------------------------------------------------------
     * Master scrub timeline  (progress 0 → 1 maps to 300vh scroll)
     * -------------------------------------------------------------*/
    const isMobile = window.innerWidth <= 768;

    let mTl: gsap.core.Timeline | null = null;
    let tl: gsap.core.Timeline | null = null;

    if (isMobile) {
      // MOBILE: scroll-driven armor assembly (no sticky pin, just progress-based)
      mTl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapper,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.6,
        },
      });

      // Chromatic aberration text intro (plays once on load, separate from scroll)
      if (bgText) {
        gsap.set(bgText, {
          textShadow: '-6px 0 rgba(0,200,255,0.7), 6px 0 rgba(255,50,80,0.7)',
          opacity: 0,
          scale: 1.05,
        });
        gsap.to(bgText, { opacity: 1, duration: 0.4, ease: 'power2.out', delay: 1.8 });
        gsap.to(bgText, {
          textShadow: '0px 0 rgba(0,200,255,0), 0px 0 rgba(255,50,80,0)',
          scale: 1,
          duration: 1,
          ease: 'sine.inOut',
          delay: 2.1,
        });
      }

      // Touca out (0-15%)
      if (p.touca) mTl.to(p.touca, { opacity: 0, duration: 0.15, ease: 'power1.in' }, 0.05);

      // Armor enters (10-40%)
      if (p.camisaFundo) mTl.fromTo(p.camisaFundo, { yPercent: 30, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.30, ease: 'power2.out' }, 0.10);
      if (p.ombreiraE) mTl.fromTo(p.ombreiraE, { xPercent: -60, opacity: 0 }, { xPercent: 0, opacity: 1, duration: 0.25, ease: 'power2.out' }, 0.15);
      if (p.ombreiraD) mTl.fromTo(p.ombreiraD, { xPercent: 60, opacity: 0 }, { xPercent: 0, opacity: 1, duration: 0.25, ease: 'power2.out' }, 0.15);
      if (p.grupo) mTl.to(p.grupo, { opacity: 1, duration: 0.20, ease: 'power1.inOut' }, 0.25);

      // Mask (35-50%)
      if (p.mascara) mTl.fromTo(p.mascara, { yPercent: 20, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.15, ease: 'power2.out' }, 0.35);

      // Helmet + hide face parts (50-75%)
      if (p.cabelo) mTl.to(p.cabelo, { opacity: 0, duration: 0.12, ease: 'power1.in' }, 0.50);
      if (p.capacete) mTl.fromTo(p.capacete, { yPercent: -40, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.20, ease: 'power2.out' }, 0.50);
      if (p.sobrancelhas) mTl.to(p.sobrancelhas, { opacity: 0, duration: 0.10, ease: 'power1.in' }, 0.55);
      if (p.olhosAbertos) mTl.to(p.olhosAbertos, { opacity: 0, duration: 0.10, ease: 'power1.in' }, 0.56);
      if (p.oculos) mTl.to(p.oculos, { opacity: 0, duration: 0.10, ease: 'power1.in' }, 0.56);

      // Samurai eyes (70-80%)
      if (p.samuraiAberto) mTl.to(p.samuraiAberto, { opacity: 1, duration: 0.08, ease: 'power1.inOut' }, 0.70);

    } else {
      // DESKTOP: keep existing scroll-driven timeline exactly as-is
      tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapper,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.8,
          onUpdate: (self) => {
            const progress = self.progress;
            let stage: number;
            if (progress < 0.25) stage = 0;
            else if (progress < 0.50) stage = 1;
            else if (progress < 0.75) stage = 2;
            else stage = 3;

            // Update DOM directly — no React re-render, no GSAP opacity reset
            if (stageLabelRef.current) {
              stageLabelRef.current.textContent = STAGE_LABELS[stage];
            }
            stageDotsRef.current.forEach((dot, i) => {
              if (dot) dot.classList.toggle(styles.stageDotActive, i === stage);
            });
            if (ctaRef.current) {
              ctaRef.current.classList.toggle(styles.ctaContainerVisible, stage === 3);
            }
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
        if (el) tl!.fromTo(el, from, to, position);
      };

      const tw = (
        el: HTMLElement | null | undefined,
        vars: gsap.TweenVars,
        position: number,
      ) => {
        if (el) tl!.to(el, vars, position);
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

      /* 6. Helmet descends, hair fades out, eyes/sobrancelhas/oculos hide WITH helmet (60-82%) */
      tw(p.cabelo, { opacity: 0, duration: 0.15, ease: 'power1.in' }, 0.60);
      ft(p.capacete, { yPercent: -40, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.22, ease: 'power2.out' }, 0.60);
      tw(p.sobrancelhas, { opacity: 0, duration: 0.10, ease: 'power1.in' }, 0.62);
      tw(p.olhosAbertos, { opacity: 0, duration: 0.10, ease: 'power1.in' }, 0.63);
      tw(p.oculos, { opacity: 0, duration: 0.10, ease: 'power1.in' }, 0.63);

      /* 7. Samurai eyes appear (70-78%) */
      tw(p.samuraiAberto, { opacity: 1, duration: 0.08, ease: 'power1.inOut' }, 0.70);

      /* 8. CTAs appear (85-95%) */
      tw(cta, { opacity: 1, duration: 0.10, ease: 'power1.inOut' }, 0.85);
    }

    /* ---------------------------------------------------------------
     * Eye blink system
     * -------------------------------------------------------------*/

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

    /* -- Cleanup --------------------------------------------------- */
    return () => {
      if (tl) tl.kill();
      if (mTl) mTl.kill();
      ScrollTrigger.getAll().forEach((st) => st.kill());
      if (normalBlinkTimer.current) clearTimeout(normalBlinkTimer.current);
      if (samuraiBlinkTimer.current) clearTimeout(samuraiBlinkTimer.current);
    };
  }, []);

  return (
    <div ref={wrapperRef} className={styles.heroWrapper} id="hero">
      <section className={styles.hero} aria-label="Hero">
        {/* -- Animated grain noise --------------------------------- */}
        <div className={styles.heroGrain} aria-hidden="true" />

        {/* -- Decorative frame (single border via CSS ::after) ---- */}

        {/* -- Side text left ---------------------------------------- */}
        <div className={styles.sideTextLeft} aria-hidden="true">
          <span className={styles.verticalText}>DIGITAL CRAFTSMAN</span>
          <span className={styles.verticalText}>EST. 2024</span>
        </div>

        {/* -- Side text right --------------------------------------- */}
        <div className={styles.sideTextRight} aria-hidden="true">
          <span className={styles.verticalTextKanji}>改善</span>
          <span className={styles.verticalTextPage}>01/04</span>
        </div>

        {/* -- Background text --------------------------------------- */}
        <div className={styles.bgText} aria-hidden="true">
          <div ref={bgTextRef} className={styles.bgTextInner}>
            <span>AKIRA</span>
            <span>KAIZEN</span>
          </div>
        </div>

        {/* -- Character assembly ------------------------------------ */}
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

        {/* -- Stage indicator (I-IV) -------------------------------- */}
        <div className={styles.stageIndicator} aria-hidden="true">
          <span ref={stageLabelRef} className={styles.stageLabel}>{STAGE_LABELS[0]}</span>
          <div className={styles.stageDots}>
            {STAGE_LABELS.map((_, i) => (
              <div
                key={i}
                ref={(el) => { stageDotsRef.current[i] = el; }}
                className={`${styles.stageDot}${i === 0 ? ` ${styles.stageDotActive}` : ''}`}
              />
            ))}
          </div>
        </div>

        {/* -- Scroll indicator -------------------------------------- */}
        <div ref={scrollIndicatorRef} className={styles.scrollIndicator} aria-hidden="true">
          <span className={styles.scrollText}>SCROLL</span>
          <div className={styles.scrollLine}>
            <div className={styles.scrollLineFill} />
          </div>
        </div>

        {/* -- CTAs -------------------------------------------------- */}
        <div
          ref={ctaRef}
          className={styles.ctaContainer}
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
