'use client';

import { useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP, Draggable);

interface MacWindowProps {
  title: string;
  z: number;
  active: boolean;
  x: number;
  y: number;
  w: number;
  h: number;
  onClose: () => void;
  onFocus: () => void;
  children: React.ReactNode;
}

export default function MacWindow({
  title, z, active, x, y, w, h, onClose, onFocus, children,
}: MacWindowProps) {
  const ref = useRef<HTMLDivElement>(null);
  const closing = useRef(false);
  const zoomed = useRef(false);
  const orig = useRef<{ w: number; h: number } | null>(null);

  useGSAP(
    () => {
      const el = ref.current!;
      gsap.set(el, { width: w, height: h });
      gsap.fromTo(
        el,
        { scale: 0.96, autoAlpha: 0, transformOrigin: '50% 0%' },
        { scale: 1, autoAlpha: 1, duration: 0.26, ease: 'power3.out' },
      );
      const bounds = el.closest('.os-desktop') as HTMLElement | null;
      const drag = Draggable.create(el, {
        trigger: el.querySelector('.os-titlebar') as HTMLElement,
        bounds: bounds ?? undefined,
        edgeResistance: 0.65,
        onPress: onFocus,
      });
      return () => drag.forEach((d) => d.kill());
    },
    { scope: ref },
  );

  const close = useCallback(() => {
    if (closing.current) return;
    closing.current = true;
    gsap.to(ref.current, { scale: 0.9, autoAlpha: 0, duration: 0.16, ease: 'power2.in', onComplete: onClose });
  }, [onClose]);

  const minimize = useCallback(() => {
    if (closing.current) return;
    closing.current = true;
    const el = ref.current!;
    const rect = el.getBoundingClientRect();
    gsap.to(el, {
      y: `+=${window.innerHeight - rect.top + 40}`,
      scaleX: 0.12, scaleY: 0.03, autoAlpha: 0,
      transformOrigin: '50% 100%',
      duration: 0.42, ease: 'power2.in',
      onComplete: onClose,
    });
  }, [onClose]);

  const zoom = useCallback(() => {
    const el = ref.current!;
    onFocus();
    const desk = el.closest('.os-desktop') as HTMLElement | null;
    if (!zoomed.current) {
      orig.current = { w: el.offsetWidth, h: el.offsetHeight };
      gsap.to(el, {
        width: Math.min(900, (desk?.clientWidth ?? 1200) - 48),
        height: Math.min(620, (desk?.clientHeight ?? 700) - 48),
        duration: 0.3, ease: 'power2.out',
      });
      zoomed.current = true;
    } else if (orig.current) {
      gsap.to(el, { width: orig.current.w, height: orig.current.h, duration: 0.3, ease: 'power2.out' });
      zoomed.current = false;
    }
  }, [onFocus]);

  return (
    <div
      ref={ref}
      className="os-window"
      data-active={active}
      style={{ left: x, top: y, zIndex: z }}
      onPointerDown={onFocus}
    >
      <div className="os-titlebar">
        <div className="os-lights" onPointerDown={(e) => e.stopPropagation()}>
          <button type="button" className="os-light red" aria-label="Close" onClick={close}><span>×</span></button>
          <button type="button" className="os-light yellow" aria-label="Minimize" onClick={minimize}><span>–</span></button>
          <button type="button" className="os-light green" aria-label="Zoom" onClick={zoom}><span>+</span></button>
        </div>
        <span className="os-title">{title}</span>
      </div>
      <div className="os-window-body">{children}</div>
    </div>
  );
}
