'use client';

import { useEffect, useRef } from 'react';
import type { ElementType, ReactNode } from 'react';
import { gsap } from '@/lib/gsap';

export interface ScrollRevealProps {
  children: ReactNode;
  /** Wrapper tag. Default 'div'. */
  as?: ElementType;
  className?: string;
  /**
   * CSS selector (within scope) for the items to stagger in. When omitted the
   * wrapper itself rises in as one block.
   */
  selector?: string;
  /** Per-item stagger, seconds. */
  stagger?: number;
  /** Rise distance, px. */
  y?: number;
  'aria-label'?: string;
  role?: string;
}

/**
 * Scroll-triggered entrance for a block or a set of staggered children.
 *
 * SSR-safe AND fail-open by construction: children render into the DOM at full
 * opacity and STAY visible unless, after hydration and only when motion is
 * allowed, an IntersectionObserver reports the block scrolling into view, at
 * which point a GSAP from→natural tween plays. No-JS, reduced-motion, crawlers,
 * and any environment without a live IntersectionObserver (e.g. jsdom) all see
 * the final, legible content with no hidden state. Mirrors the CountUp island's
 * "default to the real state, only animate on a confirmed scroll-in" approach.
 */
export function ScrollReveal({
  children,
  as,
  className,
  selector,
  stagger = 0.08,
  y = 28,
  ...rest
}: ScrollRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const Tag = (as ?? 'div') as ElementType;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    const targets = selector
      ? Array.from(el.querySelectorAll<HTMLElement>(selector))
      : [el];
    if (!targets.length) return;

    let played = false;
    const observer = new IntersectionObserver(
      (entries, obs) => {
        if (played) return;
        if (!entries.some((e) => e.isIntersecting)) return;
        played = true;
        obs.disconnect();
        gsap.from(targets, {
          y,
          autoAlpha: 0,
          duration: 0.6,
          ease: 'power3.out',
          stagger: selector ? stagger : 0,
        });
      },
      { threshold: 0.15 },
    );
    observer.observe(el);

    return () => observer.disconnect();
  }, [selector, stagger, y]);

  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  );
}
