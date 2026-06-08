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
 * Counts up to `to` when scrolled into view. The final value (with suffix)
 * is always the rendered text, so SSR/crawlers and reduced-motion users see
 * the real number immediately.
 */
export function CountUp({ to, suffix = '', durationMs = 900, className }: CountUpProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement | null>(null);
  const [display, setDisplay] = useState(reduce ? to : 0);
  const [started, setStarted] = useState(reduce);

  useEffect(() => {
    if (reduce) {
      setDisplay(to);
      return;
    }
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setStarted(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [reduce, to]);

  useEffect(() => {
    if (!started || reduce) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
      setDisplay(Math.round(eased * to));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [started, reduce, to, durationMs]);

  return (
    <span ref={ref} className={className}>
      {display}
      {suffix}
    </span>
  );
}
