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
