import { Fragment } from 'react';
import type { ReactNode } from 'react';

export interface SectionHeadingProps {
  /** Mono kicker above the headline, e.g. "Our work". */
  kicker?: string;
  /** The headline text. One word matching `accent` is set in lime. */
  title: string;
  /** Word(s) in `title` to render in the lime accent (case-insensitive). */
  accent?: string;
  /** Optional one-line subhead under the headline. */
  subhead?: string;
  /** Optional trailing slot (e.g. an "All work →" link), right-aligned on desktop. */
  action?: ReactNode;
  className?: string;
}

/**
 * Bold Kinetic section heading: a mono kicker, a GIANT Anton poster title with
 * one lime accent word, and an optional subhead + action. Server component: the
 * full text is static HTML (crawlable, reduced-motion-legible); any motion is
 * added by the surrounding ScrollReveal island, never here.
 */
export function SectionHeading({
  kicker,
  title,
  accent,
  subhead,
  action,
  className,
}: SectionHeadingProps) {
  const accentSet = new Set(
    (accent ?? '').split(/\s+/).filter(Boolean).map((w) => w.toLowerCase()),
  );

  // Render token-by-token so the FULL title stays in the DOM; accent words get
  // the lime span. Spaces are preserved so the line reads identically.
  const tokens = title.split(/(\s+)/);

  return (
    <div className={['flex flex-col gap-6 md:flex-row md:items-end md:justify-between', className].filter(Boolean).join(' ')}>
      <div className="max-w-3xl">
        {kicker && (
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.28em] text-text-dim">
            <span className="text-accent">/</span> {kicker}
          </p>
        )}
        <h2
          className="font-display uppercase leading-[0.92] tracking-[-0.01em] text-text text-balance"
          style={{ fontSize: 'clamp(2.25rem, 6vw, 5rem)' }}
        >
          {tokens.map((token, i) => {
            const bare = token.replace(/[.,&]/g, '').toLowerCase();
            if (token.trim() && accentSet.has(bare)) {
              return (
                <span key={i} className="text-accent">
                  {token}
                </span>
              );
            }
            return <Fragment key={i}>{token}</Fragment>;
          })}
        </h2>
        {subhead && (
          <p className="mt-5 max-w-2xl text-base text-text-dim md:text-lg">{subhead}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
