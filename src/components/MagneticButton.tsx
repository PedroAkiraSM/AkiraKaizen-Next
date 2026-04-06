'use client';

import { useRef, useState } from 'react';
import { motion } from 'motion/react';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  strength?: number;
  style?: React.CSSProperties;
}

export default function MagneticButton({
  children,
  className = '',
  href,
  onClick,
  strength = 0.3,
  style,
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
  const linkProps = href
    ? {
        href,
        target: href.startsWith('http') ? ('_blank' as const) : undefined,
        rel: href.startsWith('http') ? 'noopener noreferrer' : undefined,
      }
    : {};

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 200, damping: 15, mass: 0.5 }}
      className="inline-block"
    >
      <Tag className={className} onClick={onClick} style={style} {...linkProps}>
        {children}
      </Tag>
    </motion.div>
  );
}
