'use client';

import { motion, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';

export interface HoverCardProps {
  children: ReactNode;
  className?: string;
}

/**
 * Card that grows slightly from its own origin on hover (transform + opacity
 * only — never width/height/margin). reduced-motion => no scale.
 */
export function HoverCard({ children, className }: HoverCardProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      style={{ transformOrigin: 'center' }}
    >
      {children}
    </motion.div>
  );
}
