'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';

/**
 * Custom cursor: a small lime ring that trails the pointer with slight lag, and
 * grows + inverts (fills lime) over interactive targets (a, button,
 * [data-cursor]). Renders NOTHING on touch devices or under reduced motion, and
 * never hides the native cursor there — pure post-hydration enhancement.
 */
export function MagneticCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  // Decide on the client only: fine pointer + motion allowed.
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const fine = window.matchMedia('(pointer: fine)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setEnabled(fine && !reduce);
  }, []);

  useGSAP(
    () => {
      if (!enabled) return;
      const ring = ringRef.current;
      if (!ring) return;

      gsap.set(ring, { xPercent: -50, yPercent: -50, opacity: 0 });
      const xTo = gsap.quickTo(ring, 'x', { duration: 0.35, ease: 'power3' });
      const yTo = gsap.quickTo(ring, 'y', { duration: 0.35, ease: 'power3' });

      let shown = false;
      const onMove = (e: PointerEvent) => {
        xTo(e.clientX);
        yTo(e.clientY);
        if (!shown) {
          shown = true;
          gsap.to(ring, { opacity: 1, duration: 0.2 });
        }
      };

      const isInteractive = (t: EventTarget | null) =>
        t instanceof Element && !!t.closest('a, button, [data-cursor], [role="button"], input, textarea, select');

      const onOver = (e: PointerEvent) => {
        if (isInteractive(e.target)) {
          gsap.to(ring, { scale: 2.2, backgroundColor: 'var(--accent)', borderColor: 'transparent', duration: 0.25 });
        }
      };
      const onOut = (e: PointerEvent) => {
        if (isInteractive(e.target)) {
          gsap.to(ring, { scale: 1, backgroundColor: 'transparent', borderColor: 'var(--accent)', duration: 0.25 });
        }
      };
      const onLeaveWindow = () => gsap.to(ring, { opacity: 0, duration: 0.2 });

      window.addEventListener('pointermove', onMove, { passive: true });
      window.addEventListener('pointerover', onOver, { passive: true });
      window.addEventListener('pointerout', onOut, { passive: true });
      document.documentElement.addEventListener('pointerleave', onLeaveWindow);

      return () => {
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerover', onOver);
        window.removeEventListener('pointerout', onOut);
        document.documentElement.removeEventListener('pointerleave', onLeaveWindow);
      };
    },
    { dependencies: [enabled] },
  );

  if (!enabled) return null;

  return (
    <div
      ref={ringRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: 22,
        height: 22,
        borderRadius: '9999px',
        border: '1.5px solid var(--accent)',
        backgroundColor: 'transparent',
        pointerEvents: 'none',
        zIndex: 9999,
        mixBlendMode: 'difference',
      }}
    />
  );
}
