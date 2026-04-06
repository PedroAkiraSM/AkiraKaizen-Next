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
