'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const glow = glowRef.current;
    if (!glow) return;

    // Hide on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) {
      glow.style.display = 'none';
      return;
    }

    const onMove = (e: MouseEvent) => {
      gsap.to(glow, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.6,
        ease: 'power3.out',
      });
    };

    const onEnter = () => glow.classList.add('hover');
    const onLeave = () => glow.classList.remove('hover');

    document.addEventListener('mousemove', onMove);

    const addHover = () => {
      document.querySelectorAll('a, button, [role="button"], input, textarea').forEach((el) => {
        el.addEventListener('mouseenter', onEnter);
        el.addEventListener('mouseleave', onLeave);
      });
    };

    // Initial + observe new elements
    addHover();
    const observer = new MutationObserver(addHover);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener('mousemove', onMove);
      observer.disconnect();
    };
  }, []);

  return <div ref={glowRef} className="cursor-glow" aria-hidden="true" />;
}
