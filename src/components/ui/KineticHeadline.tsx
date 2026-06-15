'use client';

import { useRef } from 'react';
import type { ReactNode } from 'react';
import { gsap, SplitText, useGSAP } from '@/lib/gsap';

type HeadingTag = 'h1' | 'h2' | 'h3' | 'p';

export interface KineticHeadlineProps {
  children: ReactNode;
  /** Heading tag. Default h1 (the hero LCP node). */
  as?: HeadingTag;
  className?: string;
  /** Per-char stagger seconds. */
  stagger?: number;
}

/**
 * Poster-style headline that rises in char-by-char on mount.
 *
 * SSR-safe by construction: the real text is rendered into the element at full
 * opacity. SplitText/GSAP only run AFTER hydration and only when motion is
 * allowed, so crawlers, no-JS, and reduced-motion users always see the final,
 * legible headline. `gsap.context` (via useGSAP scope) reverts the split and
 * tween on unmount, and onSplit re-runs on resize without leaving chars hidden.
 *
 * Accent words: include <span className="text-accent"> inside children — nested
 * SplitText chars inherit the parent span's color, so accent words stay lime.
 */
export function KineticHeadline({
  children,
  as: Tag = 'h1',
  className,
  stagger = 0.012,
}: KineticHeadlineProps) {
  const ref = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      // Honor reduced motion: leave the text exactly as rendered (full opacity).
      const reduce =
        typeof window !== 'undefined' &&
        window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
      if (reduce) return;

      const split = SplitText.create(el, {
        type: 'lines,words,chars',
        // mask:'lines' clips each line so the yPercent rise is hidden until
        // chars settle into place (poster reveal). autoSplit re-runs on resize.
        mask: 'lines',
        autoSplit: true,
        onSplit: (self) => {
          return gsap.from(self.chars, {
            yPercent: 120,
            autoAlpha: 0,
            stagger,
            duration: 0.7,
            ease: 'power4.out',
          });
        },
      });

      return () => split.revert();
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
