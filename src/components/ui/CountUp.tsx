'use client';

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';

export interface CountUpProps {
  to: number;
  suffix?: string;
  /** Animation length in ms (kept short; tokens cap motion near 300ms). */
  durationMs?: number;
  className?: string;
}

/**
 * Counts up to `to` when scrolled into view. CRITICAL: the SSR / first render
 * shows the REAL final value `to` (so crawlers, no-JS and reduced-motion users
 * see the true number immediately — no `0` flash, no broken proof metric).
 *
 * The count-up is a pure post-hydration enhancement: after mount, IF motion is
 * allowed AND the node was initially OUT of view, we reset to 0 and animate up
 * as it scrolls into view. If it is already in view on mount (or motion is
 * reduced), the value stays at `to` — no reset, no flash.
 */
export function CountUp({ to, suffix = '', durationMs = 900, className }: CountUpProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement | null>(null);
  // First render — including SSR — is always the real value.
  const [display, setDisplay] = useState(to);

  useEffect(() => {
    if (reduce) return;
    const node = ref.current;
    if (!node) return;

    let raf = 0;
    const animateUp = () => {
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / durationMs);
        const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
        setDisplay(Math.round(eased * to));
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    // Probe initial visibility once. Already visible => keep `to` (no reset).
    // Off-screen => reset to 0 and re-observe for the scroll-in trigger.
    const probe = new IntersectionObserver(
      (entries, observer) => {
        const entry = entries[0];
        observer.disconnect();
        if (!entry || entry.isIntersecting) return; // visible on mount: stay `to`

        setDisplay(0); // off-screen: arm the count-up from 0
        const trigger = new IntersectionObserver(
          (es, o) => {
            if (es.some((e) => e.isIntersecting)) {
              o.disconnect();
              animateUp();
            }
          },
          { threshold: 0.4 },
        );
        trigger.observe(node);
      },
      { threshold: 0.4 },
    );
    probe.observe(node);

    return () => {
      probe.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduce, to, durationMs]);

  return (
    <span ref={ref} className={className}>
      {display}
      {suffix}
    </span>
  );
}
