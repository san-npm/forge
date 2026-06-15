'use client';

import { useRef, cloneElement, isValidElement } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'motion/react';
import type { ReactNode, ReactElement, MouseEvent } from 'react';

export interface MagneticButtonProps {
  children: ReactNode;
  /** When set, render an <a> (or motion.a) instead of a <button>. */
  href?: string;
  /** When true, wrap a passed child (e.g. a Next <Link>) instead of emitting
   *  our own element — the child becomes the magnetic, interactive node. */
  asChild?: boolean;
  /** Button type when rendering a <button>. */
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
  /** How far the button drifts toward the cursor, in px. */
  strength?: number;
}

/**
 * Primary CTA that drifts toward the cursor (transform only). The magnet is
 * gated behind prefers-reduced-motion: no-preference — reduced-motion renders
 * a plain, fully-interactive element. Three modes:
 *   - `asChild`: clone the passed child (Link/anchor) and make IT magnetic.
 *   - `href`:    render an anchor (role="link").
 *   - default:   render a real <button> (forwards `type`, so it can submit).
 */
export function MagneticButton({
  children,
  href,
  asChild = false,
  type = 'button',
  disabled,
  className,
  onClick,
  strength = 12,
}: MagneticButtonProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 18 });
  const sy = useSpring(y, { stiffness: 200, damping: 18 });

  function onMove(e: MouseEvent<HTMLElement>) {
    if (reduce) return;
    const node = ref.current;
    if (!node) return;
    const r = node.getBoundingClientRect();
    const relX = e.clientX - (r.left + r.width / 2);
    const relY = e.clientY - (r.top + r.height / 2);
    x.set((relX / (r.width / 2)) * strength);
    y.set((relY / (r.height / 2)) * strength);
  }

  function onLeave() {
    x.set(0);
    y.set(0);
  }

  // --- asChild: clone the single child, attaching handlers + className. ---
  if (asChild && isValidElement(children)) {
    const child = children as ReactElement<Record<string, unknown>>;
    const childProps = child.props;
    const merged: Record<string, unknown> = {
      className: [className, childProps.className].filter(Boolean).join(' ') || undefined,
      onClick,
    };
    if (!reduce) {
      merged.onMouseMove = onMove;
      merged.onMouseLeave = onLeave;
      merged.ref = ref;
    }
    return cloneElement(child, merged);
  }

  // --- reduced-motion: plain element, no magnet. ---
  if (reduce) {
    return href ? (
      <a ref={ref as React.Ref<HTMLAnchorElement>} href={href} className={className} onClick={onClick}>
        {children}
      </a>
    ) : (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type={type}
        disabled={disabled}
        className={className}
        onClick={onClick}
      >
        {children}
      </button>
    );
  }

  // --- no-preference: magnetic element. ---
  if (href) {
    return (
      <motion.a
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        className={className}
        onClick={onClick}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={{ x: sx, y: sy }}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button
      ref={ref as React.Ref<HTMLButtonElement>}
      type={type}
      disabled={disabled}
      className={className}
      onClick={onClick}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ x: sx, y: sy }}
    >
      {children}
    </motion.button>
  );
}
