import Link from 'next/link';
import type { ProofStripSectionProps } from '@/lib/schema';
import { CountUp } from '@/components/ui/CountUp';
import { Hairline } from '@/components/ui/Hairline';

/**
 * Proof strip: the portfolio wordmarks + a couple of honest, STATIC metrics.
 * No live fetch, no Suspense, no degraded placeholder; both metric values
 * are real and render in SSR HTML (CountUp shows the true number on first
 * paint and only animates up post-hydration when motion is allowed).
 *
 * Kept as a plain export (no `ProofStripShell` wrapper) now that there is
 * nothing async to isolate.
 */
export function ProofStripSection({ label, logos, metrics }: ProofStripSectionProps) {
  return (
    <section data-section="proofStrip" aria-label={label} className="px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-xs uppercase tracking-[0.28em] text-text-dim">
          <span className="text-accent">/</span> {label}
        </p>

        {/* Portfolio wordmarks, each linking to the live product. */}
        <ul role="list" className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-3">
          {logos.map((logo) => (
            <li key={logo.slug}>
              <Link
                href={logo.href}
                target="_blank"
                rel="noopener noreferrer"
                className="ol-link font-display text-xl uppercase tracking-tight text-text-dim"
              >
                {logo.name}
              </Link>
            </li>
          ))}
        </ul>

        <Hairline className="my-10" />

        {/* Static, defensible metrics: big Anton numbers (or a qualitative
            credential rendered as Anton text), lime accent. */}
        <ul role="list" className="flex flex-wrap gap-x-16 gap-y-8">
          {metrics.map((m) => (
            <li key={m.id} className="flex flex-col">
              <span
                className="font-display leading-none tracking-tight text-accent"
                style={{ fontSize: 'clamp(2.75rem, 6vw, 4.5rem)' }}
              >
                {m.value === null ? (
                  m.text
                ) : (
                  <>
                    <CountUp to={m.value} />
                    {m.suffix ?? ''}
                  </>
                )}
              </span>
              <span className="mt-2 max-w-[14ch] font-mono text-xs uppercase tracking-[0.14em] text-text-dim">
                {m.label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
