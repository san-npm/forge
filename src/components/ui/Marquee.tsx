'use client';

import { Fragment } from 'react';

export interface MarqueeProps {
  items: string[];
  /** Seconds for one full loop. Larger = slower. */
  durationSec?: number;
  className?: string;
  'aria-label'?: string;
}

/**
 * Infinite horizontal marquee. The track is duplicated and translated -50% so
 * the loop is seamless. Reduced-motion users get a static, still-legible row
 * (the kill-switch in tokens.css freezes the animation; overflow stays hidden,
 * and the content is the real text so it remains readable from the start).
 *
 * Mono / uppercase with lime separators — a tasteful capability ticker.
 */
export function Marquee({
  items,
  durationSec = 28,
  className,
  'aria-label': ariaLabel = 'Capabilities',
}: MarqueeProps) {
  // Two copies of the track make the -50% translate seamless.
  const track = (
    <ul className="ol-marquee-track" aria-hidden="true">
      {items.map((item, i) => (
        <Fragment key={i}>
          <li className="ol-marquee-item">{item}</li>
          <li className="ol-marquee-sep" aria-hidden="true">
            ·
          </li>
        </Fragment>
      ))}
    </ul>
  );

  return (
    <div
      className={['ol-marquee', className].filter(Boolean).join(' ')}
      role="marquee"
      aria-label={ariaLabel}
      style={{ ['--ol-marquee-dur' as string]: `${durationSec}s` }}
    >
      {track}
      {track}
      <style>{`
        .ol-marquee {
          position: relative;
          display: flex;
          width: 100%;
          overflow: hidden;
          user-select: none;
          -webkit-mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
          mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
        }
        .ol-marquee-track {
          display: flex;
          flex: 0 0 auto;
          align-items: center;
          gap: 1.25rem;
          padding-right: 1.25rem;
          margin: 0;
          list-style: none;
          white-space: nowrap;
          will-change: transform;
          animation: ol-marquee-scroll var(--ol-marquee-dur, 28s) linear infinite;
        }
        .ol-marquee:hover .ol-marquee-track {
          animation-play-state: paused;
        }
        .ol-marquee-item {
          font-family: var(--font-mono), ui-monospace, monospace;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          font-size: 0.8125rem;
          color: var(--text-dim);
        }
        .ol-marquee-sep {
          color: var(--accent);
          font-size: 0.8125rem;
        }
        @keyframes ol-marquee-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .ol-marquee-track { animation: none; }
        }
      `}</style>
    </div>
  );
}
