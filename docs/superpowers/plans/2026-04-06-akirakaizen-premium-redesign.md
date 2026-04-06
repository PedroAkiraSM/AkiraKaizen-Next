# AkiraKaizen Premium Redesign - Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform AkiraKaizen from a functional portfolio into an award-worthy Japanese Modern showcase with premium animations, 3D elements, redesigned content sections, and cohesive visual storytelling.

**Architecture:** Each section is an independent React client component with its own CSS module. Animations use GSAP (scroll-driven timelines) + Motion (micro-interactions, hover states) + SplitType (text reveals). Three.js loads lazily via dynamic import. The design language is Japanese Modern: red (#fc193b) + black (#0a0a0a) + white (#ffffff) + cream (#f0ebe3), with PP Nikkei Pacific for display and DM Sans for body.

**Tech Stack:** Next.js 16, React 19, GSAP + ScrollTrigger, Motion (motion/react), SplitType, React Three Fiber + drei, Tailwind CSS v4, PP Nikkei Pacific font, DM Sans font.

**Design References:** Unifiers of Japan (unifiersofjapan.framer.website), Dennis Snellenberg, Lusion v3, Aristide Benoist.

---

## File Structure

### New Files
- `src/components/SplitTextReveal.tsx` — Reusable text split animation component
- `src/components/MagneticButton.tsx` — Magnetic hover effect button
- `src/components/Scene3D.tsx` — Three.js background scene (lazy loaded)
- `src/components/ProjectCard.tsx` — Redesigned individual project card
- `src/components/TechMarquee.tsx` — Scrolling tech stack marquee
- `src/components/ScrollReveal.tsx` — Reusable scroll-triggered reveal wrapper

### Modified Files
- `src/components/Hero.tsx` — Add SplitType text animation to AKIRA/KAIZEN
- `src/components/Hero.module.css` — Adjust text positioning for split animation
- `src/components/Projects.tsx` — Complete redesign: horizontal scroll showcase
- `src/components/Projects.module.css` — New styles for project showcase
- `src/components/Method.tsx` — Redesign with split-text reveals and better visuals
- `src/components/Method.module.css` — Updated method styles
- `src/components/Founder.tsx` — Philosophy-first redesign, remove photo
- `src/components/Founder.module.css` — New founder/about styles
- `src/components/Contact.tsx` — Premium contact with magnetic buttons
- `src/components/Footer.tsx` — Expanded footer with links and Japanese elements
- `src/components/Nav.tsx` — Minor refinements
- `src/components/Nav.module.css` — Style tweaks
- `src/components/CursorGlow.tsx` — Enhanced cursor with magnetic interaction
- `src/app/globals.css` — Updated design tokens, new utility classes
- `src/app/layout.tsx` — Add Scene3D (lazy), update structure
- `src/app/page.tsx` — Updated section order and dividers

---

## Phase 1: Foundation — Reusable Components

### Task 1: SplitTextReveal Component

**Files:**
- Create: `src/components/SplitTextReveal.tsx`

This component wraps any text and animates it word-by-word or char-by-char on scroll using SplitType + GSAP.

- [ ] **Step 1: Create the SplitTextReveal component**

```tsx
'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';

gsap.registerPlugin(ScrollTrigger);

interface SplitTextRevealProps {
  children: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  className?: string;
  splitBy?: 'chars' | 'words' | 'lines';
  stagger?: number;
  duration?: number;
  delay?: number;
  triggerStart?: string;
  once?: boolean;
}

export default function SplitTextReveal({
  children,
  as: Tag = 'p',
  className = '',
  splitBy = 'words',
  stagger = 0.04,
  duration = 0.8,
  delay = 0,
  triggerStart = 'top 85%',
  once = true,
}: SplitTextRevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const split = new SplitType(el, { types: splitBy });
    const targets = split[splitBy] || [];

    gsap.set(targets, { opacity: 0, y: 30 });

    const tween = gsap.to(targets, {
      opacity: 1,
      y: 0,
      duration,
      stagger,
      delay,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: triggerStart,
        toggleActions: once ? 'play none none none' : 'play none none reverse',
      },
    });

    return () => {
      tween.kill();
      split.revert();
    };
  }, [children, splitBy, stagger, duration, delay, triggerStart, once]);

  return (
    <Tag ref={ref as React.RefObject<never>} className={className}>
      {children}
    </Tag>
  );
}
```

- [ ] **Step 2: Verify build passes**

Run: `npx next build 2>&1 | tail -5`
Expected: `✓ Compiled successfully`

- [ ] **Step 3: Commit**

```bash
git add src/components/SplitTextReveal.tsx
git commit -m "feat: add SplitTextReveal component with SplitType + GSAP"
```

---

### Task 2: ScrollReveal Wrapper Component

**Files:**
- Create: `src/components/ScrollReveal.tsx`

A reusable wrapper that reveals its children with a configurable animation when scrolled into view. Uses Motion for simpler reveal animations.

- [ ] **Step 1: Create the ScrollReveal component**

```tsx
'use client';

import { useRef } from 'react';
import { motion, useInView } from 'motion/react';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: number;
  duration?: number;
  delay?: number;
  once?: boolean;
  threshold?: number;
}

export default function ScrollReveal({
  children,
  className = '',
  direction = 'up',
  distance = 60,
  duration = 0.8,
  delay = 0,
  once = true,
  threshold = 0.2,
}: ScrollRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount: threshold });

  const directionMap = {
    up: { y: distance, x: 0 },
    down: { y: -distance, x: 0 },
    left: { x: distance, y: 0 },
    right: { x: -distance, y: 0 },
    none: { x: 0, y: 0 },
  };

  const offset = directionMap[direction];

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, ...offset }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, ...offset }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 2: Verify build passes**

Run: `npx next build 2>&1 | tail -5`
Expected: `✓ Compiled successfully`

- [ ] **Step 3: Commit**

```bash
git add src/components/ScrollReveal.tsx
git commit -m "feat: add ScrollReveal wrapper component with Motion"
```

---

### Task 3: MagneticButton Component

**Files:**
- Create: `src/components/MagneticButton.tsx`

A button that magnetically attracts toward the cursor on hover, with spring physics. Used for CTAs across the site.

- [ ] **Step 1: Create the MagneticButton component**

```tsx
'use client';

import { useRef, useState } from 'react';
import { motion } from 'motion/react';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  strength?: number;
}

export default function MagneticButton({
  children,
  className = '',
  href,
  onClick,
  strength = 0.3,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * strength;
    const y = (e.clientY - rect.top - rect.height / 2) * strength;
    setPosition({ x, y });
  };

  const handleLeave = () => setPosition({ x: 0, y: 0 });

  const Tag = href ? 'a' : 'button';
  const linkProps = href ? { href, target: href.startsWith('http') ? '_blank' : undefined, rel: href.startsWith('http') ? 'noopener noreferrer' : undefined } : {};

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 200, damping: 15, mass: 0.5 }}
      className="inline-block"
    >
      <Tag className={className} onClick={onClick} {...linkProps}>
        {children}
      </Tag>
    </motion.div>
  );
}
```

- [ ] **Step 2: Verify build passes**

Run: `npx next build 2>&1 | tail -5`
Expected: `✓ Compiled successfully`

- [ ] **Step 3: Commit**

```bash
git add src/components/MagneticButton.tsx
git commit -m "feat: add MagneticButton component with spring physics"
```

---

### Task 4: TechMarquee Component

**Files:**
- Create: `src/components/TechMarquee.tsx`

An infinite horizontal scrolling marquee of tech stack items. Replaces static tech badges.

- [ ] **Step 1: Create the TechMarquee component**

```tsx
'use client';

import styles from './TechMarquee.module.css';

const TECH_ITEMS = [
  'Laravel', 'PHP', 'MySQL', 'JavaScript', 'TypeScript', 'React',
  'Next.js', 'Tailwind', 'Alpine.js', 'Vite', 'Figma', 'GSAP',
  'Three.js', 'Node.js', 'Git', 'Docker',
];

export default function TechMarquee() {
  const doubled = [...TECH_ITEMS, ...TECH_ITEMS];

  return (
    <div className={styles.marqueeWrapper}>
      <div className={styles.marqueeTrack}>
        {doubled.map((tech, i) => (
          <span key={i} className={styles.marqueeItem}>
            {tech}
            <span className={styles.marqueeDot}>&#x2022;</span>
          </span>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create the TechMarquee CSS module**

Create file `src/components/TechMarquee.module.css`:

```css
.marqueeWrapper {
  overflow: hidden;
  width: 100%;
  padding: 2rem 0;
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}

.marqueeTrack {
  display: flex;
  gap: 0;
  white-space: nowrap;
  animation: marqueeScroll 30s linear infinite;
  width: max-content;
}

.marqueeItem {
  font-family: var(--font-display);
  font-size: clamp(0.8rem, 1.2vw, 1rem);
  font-weight: 300;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--text-muted);
  padding: 0 1.5rem;
  flex-shrink: 0;
}

.marqueeDot {
  color: var(--accent);
  margin-left: 1.5rem;
  font-size: 0.5em;
  vertical-align: middle;
}

@keyframes marqueeScroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
```

- [ ] **Step 3: Verify build passes and commit**

```bash
git add src/components/TechMarquee.tsx src/components/TechMarquee.module.css
git commit -m "feat: add TechMarquee infinite scroll component"
```

---

## Phase 2: Hero Section Enhancements

### Task 5: Add SplitType Animation to Hero Background Text

**Files:**
- Modify: `src/components/Hero.tsx`

The background text AKIRA/KAIZEN should animate with a character-by-character reveal as the hero loads, then scale+fade on scroll as it already does.

- [ ] **Step 1: Add SplitType import and character animation to Hero.tsx**

Add to imports at top:
```tsx
import SplitType from 'split-type';
```

Inside the `useEffect`, after `const scrollInd = scrollIndicatorRef.current;`, add the initial text reveal animation BEFORE the timeline:

```tsx
    /* ── Initial text reveal animation ─────────────────────────── */
    if (bgText) {
      const split = new SplitType(bgText, { types: 'chars' });
      if (split.chars) {
        gsap.fromTo(
          split.chars,
          { opacity: 0, y: 60, rotationX: -90 },
          {
            opacity: 1,
            y: 0,
            rotationX: 0,
            duration: 1,
            stagger: 0.03,
            ease: 'power3.out',
            delay: 1.5,
          },
        );
      }
    }
```

The `delay: 1.5` ensures it plays after the loader dismisses (1.2s).

- [ ] **Step 2: Verify build passes and commit**

```bash
git add src/components/Hero.tsx
git commit -m "feat: add character-by-character text reveal to hero background"
```

---

### Task 6: Three.js Ambient Background (Optional Enhancement)

**Files:**
- Create: `src/components/Scene3D.tsx`
- Modify: `src/app/layout.tsx`

A subtle, ambient 3D background with floating geometric shapes (not particles). Lazy loaded to avoid blocking initial render. This is an optional premium enhancement.

- [ ] **Step 1: Create Scene3D component**

```tsx
'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

function FloatingShape({ position, scale, speed }: { position: [number, number, number]; scale: number; speed: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * speed * 0.3;
      meshRef.current.rotation.y = state.clock.elapsedTime * speed * 0.2;
    }
  });

  return (
    <Float speed={speed} rotationIntensity={0.4} floatIntensity={0.6}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <icosahedronGeometry args={[1, 1]} />
        <MeshDistortMaterial
          color="#fc193b"
          roughness={0.8}
          metalness={0.2}
          distort={0.3}
          speed={1.5}
          opacity={0.08}
          transparent
        />
      </mesh>
    </Float>
  );
}

export default function Scene3D() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        opacity: 0.5,
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        gl={{ alpha: true, antialias: false, powerPreference: 'low-power' }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={0.5} />
        <FloatingShape position={[-3, 2, -2]} scale={1.2} speed={1} />
        <FloatingShape position={[3, -1, -3]} scale={0.8} speed={1.5} />
        <FloatingShape position={[0, -3, -4]} scale={1.5} speed={0.7} />
      </Canvas>
    </div>
  );
}
```

- [ ] **Step 2: Add lazy-loaded Scene3D to layout.tsx**

Add to layout.tsx imports:
```tsx
import dynamic from 'next/dynamic';

const Scene3D = dynamic(() => import('@/components/Scene3D'), { ssr: false });
```

Add inside body, after the noise overlay:
```tsx
<Scene3D />
```

- [ ] **Step 3: Verify build passes and commit**

```bash
git add src/components/Scene3D.tsx src/app/layout.tsx
git commit -m "feat: add ambient 3D background with React Three Fiber"
```

---

## Phase 3: Projects Section Redesign

### Task 7: Redesign Projects Section — Horizontal Showcase

**Files:**
- Rewrite: `src/components/Projects.tsx`
- Rewrite: `src/components/Projects.module.css`

Replace the simple card grid with a premium project showcase:
- Featured project: full-width split-screen (image left 60%, info right 40%)
- Other projects: horizontal scroll carousel with large images
- Each project has a number (01, 02, 03...), name, description, tech tags
- Hover reveals a red overlay with "VER PROJETO" CTA
- Stats row stays but with SplitTextReveal animation
- Uses ScrollReveal for entrance animations

The layout follows the Japanese magazine style: large typography, generous whitespace, asymmetric proportions.

- [ ] **Step 1: Rewrite Projects.tsx with new layout**

Complete rewrite of the component with:
- `SplitTextReveal` for the section heading
- Featured project as full-width horizontal split (image + info)
- Remaining projects as a row of large cards with number indicators
- `ScrollReveal` wrappers for staggered entrance
- Hover state with red accent overlay
- Stats row with animated counters (keep existing GSAP counter logic)
- Project data stays the same (7 projects)

Key layout structure:
```
[Section Label: PROJETOS]
[Heading: "7 projetos. Todos em produção." — SplitTextReveal]

[Featured: ShalomDesk — 60% image | 40% info with large "01" number]

[Horizontal scroll row:]
  [02 Judo360] [03 GeoplasticoBR] [04 FinanC] [05 Sousa Design] [06 Biblioteca] [07 Portal SEG]

[Stats: 7 projetos em produção | 99.9% uptime | < 24h resposta | Suporte contínuo]
```

- [ ] **Step 2: Rewrite Projects.module.css with premium styles**

Key styles:
- Featured card: `display: grid; grid-template-columns: 1.5fr 1fr;` with min-height 500px
- Project number: font-size clamp(4rem, 8vw, 8rem), color rgba(255,255,255,0.08), PP Nikkei Pacific
- Horizontal scroll: `overflow-x: auto; scroll-snap-type: x mandatory;` with custom scrollbar
- Card hover: red overlay (var(--accent)) slides up from bottom with opacity 0.9
- Image: grayscale(20%) default, grayscale(0%) on hover
- Tags: minimal, uppercase, spaced out

- [ ] **Step 3: Verify build passes and commit**

```bash
git add src/components/Projects.tsx src/components/Projects.module.css
git commit -m "feat: redesign projects section with horizontal showcase"
```

---

## Phase 4: Method Section Redesign

### Task 8: Redesign Method Section

**Files:**
- Rewrite: `src/components/Method.tsx`
- Rewrite: `src/components/Method.module.css`

Transform the method section from a basic grid+timeline into a premium scroll-driven experience:

- Large Japanese concept word for each pillar (分析, 技術, 教育)
- Pillars presented as full-width horizontal sections, not small cards
- Timeline becomes a vertical line on the left with numbered steps
- Each step reveals with SplitTextReveal as user scrolls
- Clean black background with white text and red accents

Layout structure:
```
[Label: MÉTODO — SplitTextReveal]
[Heading: "Não entregamos código. Entregamos compreensão."]

[Pillar 1: 分析 Análise Sistêmica — full width, kanji large left, text right]
[Pillar 2: 技術 Profundidade Técnica — same layout]
[Pillar 3: 教育 Educação Integrada — same layout]

[Vertical Timeline]
  |— 01 Discovery
  |— 02 Design
  |— 03 Develop
  |— 04 Deploy
  |— 05 Support
```

- [ ] **Step 1: Rewrite Method.tsx**
- [ ] **Step 2: Rewrite Method.module.css**
- [ ] **Step 3: Verify build and commit**

```bash
git add src/components/Method.tsx src/components/Method.module.css
git commit -m "feat: redesign method section with kanji pillars and vertical timeline"
```

---

## Phase 5: Founder/About Section Redesign

### Task 9: Philosophy-First About Section

**Files:**
- Rewrite: `src/components/Founder.tsx`
- Rewrite: `src/components/Founder.module.css`

Complete redesign following the "philosophy-first, no photo" approach:

- Remove the personal photo entirely
- Lead with a large philosophical statement
- 3 Japanese concepts as design principles (改善 Kaizen, 間 Ma, 静寂 Seijaku)
- Bio as a narrative, not a résumé
- TechMarquee replaces static tech badges
- Large kanji as decorative background elements

Layout structure:
```
[Label: SOBRE — SplitTextReveal]

[Large statement: "Não sou um desenvolvedor que cria código.
Sou um inventor que transforma problemas em soluções."]

[3 Philosophy pillars — horizontal row:]
  改善 Kaizen          間 Ma              静寂 Seijaku
  Melhoria contínua    Espaço intencional  Calma energizada
  [description]        [description]       [description]

[Narrative bio — full width, generous typography]
  "Com 13 anos de judô, design gráfico e música..."

[TechMarquee — infinite scroll of technologies]
```

- [ ] **Step 1: Rewrite Founder.tsx**
- [ ] **Step 2: Rewrite Founder.module.css**
- [ ] **Step 3: Add TechMarquee to the section**
- [ ] **Step 4: Verify build and commit**

```bash
git add src/components/Founder.tsx src/components/Founder.module.css
git commit -m "feat: redesign about section with philosophy-first approach"
```

---

## Phase 6: New Conversion Sections

### Task 10: Testimonials / Social Proof Section

**Files:**
- Create: `src/components/Testimonials.tsx`
- Create: `src/components/Testimonials.module.css`

Section positioned AFTER Projects to provide social proof right after the visitor sees the work. Uses a clean, minimal design with large quotes.

Layout structure:
```
[Label: DEPOIMENTOS]
[Heading: "O que dizem sobre nosso trabalho."]

[3 testimonial cards — horizontal row:]
  "Quote text..."        "Quote text..."        "Quote text..."
  — Nome, Cargo          — Nome, Cargo          — Nome, Cargo
    Empresa                Empresa                Empresa

[Optional: Client logos marquee below]
```

Design:
- Large opening quote mark (「) in PP Nikkei Pacific, red accent
- Quote text in DM Sans italic
- Client name/title below in smaller uppercase
- Cards have subtle border (1px var(--border)) with hover glow
- ScrollReveal entrance animation

Stats within this section (honest, value-focused):
- "7 projetos em produção" (prova que funciona)
- "99.9% uptime" (confiabilidade)
- "< 24h tempo de resposta" (agilidade)
- "Suporte contínuo" (não abandona)

- [ ] **Step 1: Create Testimonials.tsx**
- [ ] **Step 2: Create Testimonials.module.css**
- [ ] **Step 3: Verify build and commit**

```bash
git add src/components/Testimonials.tsx src/components/Testimonials.module.css
git commit -m "feat: add testimonials section with social proof and honest metrics"
```

---

### Task 11: Trust & Guarantees Section

**Files:**
- Create: `src/components/Trust.tsx`
- Create: `src/components/Trust.module.css`

Positioned BEFORE Contact to remove objections right before the final CTA. Shows what the client can expect in terms of security, process, and guarantees.

Layout structure:
```
[Label: COMPROMISSO]
[Heading: "Transparência em cada etapa."]

[4 guarantee items — 2x2 grid:]
  盾 Código Protegido              契 Contrato Claro
  NDA + LGPD compliant.            Escopo, prazos e valores
  Seu código é seu.                definidos antes de começar.

  守 Suporte Pós-Entrega           改 Revisões Incluídas
  Não abandonamos projetos.        Ajustes até sua aprovação
  Manutenção e evolução.           final. Sem surpresas.

[CTA: "Agendar uma conversa" — MagneticButton]
```

Design:
- Kanji as decorative element for each guarantee (large, muted)
- Clean white text on dark background
- Subtle border cards matching the Japanese modern aesthetic
- ScrollReveal stagger animation

- [ ] **Step 1: Create Trust.tsx**
- [ ] **Step 2: Create Trust.module.css**
- [ ] **Step 3: Verify build and commit**

```bash
git add src/components/Trust.tsx src/components/Trust.module.css
git commit -m "feat: add trust/guarantees section with kanji decorations"
```

---

### Task 12: Intermediate CTA Component

**Files:**
- Create: `src/components/CtaBanner.tsx`

A reusable CTA banner placed after Method section to capture visitors who are already convinced. Full-width, bold statement + MagneticButton.

```
[Full-width red background]
  "Pronto para transformar sua ideia em realidade?"
  [COMEÇAR MEU PROJETO] — MagneticButton
```

- [ ] **Step 1: Create CtaBanner.tsx**
- [ ] **Step 2: Verify build and commit**

```bash
git add src/components/CtaBanner.tsx
git commit -m "feat: add intermediate CTA banner component"
```

---

## Phase 7: Contact & Footer

### Task 10: Premium Contact Section

**Files:**
- Modify: `src/components/Contact.tsx`

Enhancements:
- Replace standard submit button with MagneticButton
- Add SplitTextReveal to heading
- Keep WhatsApp CTA but with MagneticButton wrapper
- Form inputs get subtle focus animations (bottom border slides in)
- Background: subtle gradient with noise texture

- [ ] **Step 1: Update Contact.tsx with premium components**
- [ ] **Step 2: Verify build and commit**

```bash
git add src/components/Contact.tsx
git commit -m "feat: enhance contact section with magnetic buttons and text reveals"
```

---

### Task 11: Expanded Japanese Footer

**Files:**
- Rewrite: `src/components/Footer.tsx`

Redesign footer with:
- Large "AKIRAKAIZEN" text across the top (PP Nikkei Pacific)
- 3-column layout: Navigation links | Contact info | Social links
- Bottom bar: copyright + "Built with 改善 Philosophy" + kanji decoration
- Subtle top border with gradient

- [ ] **Step 1: Rewrite Footer.tsx**
- [ ] **Step 2: Verify build and commit**

```bash
git add src/components/Footer.tsx
git commit -m "feat: redesign footer with Japanese typography and expanded content"
```

---

## Phase 7: Cursor & Micro-Interactions

### Task 12: Enhanced Cursor with Magnetic Interaction

**Files:**
- Modify: `src/components/CursorGlow.tsx`
- Modify: `src/app/globals.css`

Enhance the cursor to:
- Grow and change shape when hovering over project cards
- Show "VER" text when hovering over links
- Subtle color shift (red glow → white glow on dark sections)

- [ ] **Step 1: Update CursorGlow.tsx**
- [ ] **Step 2: Update globals.css cursor styles**
- [ ] **Step 3: Verify build and commit**

```bash
git add src/components/CursorGlow.tsx src/app/globals.css
git commit -m "feat: enhance cursor with contextual interactions"
```

---

## Phase 8: Page Structure & Polish

### Task 13: Update Page Structure

**Files:**
- Modify: `src/app/page.tsx`

Update the page composition:
- Add TechMarquee between Founder and Contact
- Update section dividers with new kanji choices
- Ensure smooth flow between redesigned sections

```tsx
export default function Home() {
  return (
    <>
      <Nav />
      <Hero />
      <SectionDivider kanji="改" />
      <Projects />
      <Testimonials />
      <SectionDivider kanji="善" />
      <Method />
      <CtaBanner />
      <SectionDivider kanji="道" />
      <Founder />
      <TechMarquee />
      <Trust />
      <Contact />
      <Footer />
    </>
  );
}
```

New flow rationale:
- Projects → Testimonials (social proof right after seeing the work)
- Method → CtaBanner (capture convinced visitors mid-page)
- Founder → TechMarquee → Trust → Contact (build confidence → remove objections → CTA)

- [ ] **Step 1: Update page.tsx**
- [ ] **Step 2: Final build verification**
- [ ] **Step 3: Commit and push**

```bash
git add src/app/page.tsx
git commit -m "feat: update page structure with redesigned sections"
git push origin master
```

---

## Summary of Changes

| Section | Before | After |
|---------|--------|-------|
| **Hero text** | Static AKIRA/KAIZEN | Character-by-character SplitType reveal |
| **Projects** | Simple card grid | Split-screen featured + horizontal scroll carousel |
| **Method** | Small pillar cards + timeline | Full-width kanji pillars + vertical scroll timeline |
| **Founder** | Photo + bio + tech badges | Philosophy-first, no photo, 3 Japanese concepts, TechMarquee |
| **Contact** | Standard form | Magnetic buttons, text reveals, animated inputs |
| **Footer** | Minimal 3 items | Full footer with nav, contacts, social, kanji decoration |
| **Cursor** | Simple glow dot | Contextual: grows on cards, shows text on links |
| **Background** | None | Ambient Three.js floating shapes (optional) |
| **Buttons** | Standard hover | Magnetic spring physics attraction |
| **Text reveals** | Basic fade-in | SplitType word/char animation on scroll |

## Execution Order

Tasks 1-4 (foundation components) must come first. After that, Tasks 5-13 can be executed in any order since each section is independent. Recommended order: 5 → 7 → 8 → 9 → 10 → 11 → 6 → 12 → 13.
