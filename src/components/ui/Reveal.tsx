'use client';

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import type { ReactNode } from 'react';

/** Tags Reveal can render as. NEVER include the LCP H1 here by usage. */
export type RevealTag = 'p' | 'li' | 'span' | 'div' | 'h2' | 'ul';

export interface RevealProps {
  children: ReactNode;
  /** Stagger step for sequenced reveals (multiplied by --stagger ≈ 40ms). */
  stagger?: number;
  /** Element tag to render. Default 'div'. NEVER wrap the LCP node. */
  as?: RevealTag;
  className?: string;
  'data-testid'?: string;
}

/** Read prefers-reduced-motion fresh (not from motion's singleton). */
function readReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Below-fold entrance reveal. Progressive enhancement: children are always in
 * the DOM and fully visible by default; motion only adds a transform/opacity
 * entrance when motion is allowed. reduced-motion => rendered statically.
 * Do NOT use this on the LCP H1 (it must paint at opacity:1 on first paint).
 */
export function Reveal({ children, stagger = 0, as = 'div', className, ...rest }: RevealProps) {
  const [mounted, setMounted] = useState(false);
  const [reduced, setReduced] = useState(true); // default to static until confirmed

  useEffect(() => {
    setReduced(readReducedMotion());
    setMounted(true);
  }, []);

  // SSR + reduced-motion: static, fully visible.
  if (reduced || !mounted) {
    const Tag = as;
    return (
      <Tag className={className} data-reveal {...rest}>
        {children}
      </Tag>
    );
  }

  const MotionTag = motion[as];
  return (
    <MotionTag
      className={className}
      data-reveal
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1], delay: stagger * 0.04 }}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}
