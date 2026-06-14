import type { DeeperProofSectionProps } from '@/lib/schema';
import { CountUp } from '@/components/ui/CountUp';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

/**
 * Deeper proof: the static metrics as big Anton numbers and, when the owner
 * provides them, testimonial cards. Empty-safe (no testimonials => no
 * blockquotes). No live values, so no degraded placeholder ever renders.
 */
export function DeeperProofSection({ metrics, testimonials }: DeeperProofSectionProps) {
  const shown = metrics.filter((m) => m.value !== null);

  return (
    <section data-section="deeperProof" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        {shown.length > 0 && (
          <ScrollReveal as="ul" role="list" selector="[data-metric]" className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
            {shown.map((m) => (
              <li key={m.id} data-metric className="flex flex-col border-l border-hairline pl-5">
                <span
                  className="font-display leading-none tracking-tight text-text"
                  style={{ fontSize: 'clamp(3rem, 7vw, 5.5rem)' }}
                >
                  <span className="text-accent">
                    <CountUp to={m.value as number} />
                    {m.suffix ?? ''}
                  </span>
                </span>
                <span className="mt-3 font-mono text-xs uppercase tracking-[0.14em] text-text-dim">
                  {m.label}
                </span>
              </li>
            ))}
          </ScrollReveal>
        )}

        {testimonials.length > 0 && (
          <ScrollReveal
            as="ul"
            role="list"
            selector="[data-quote]"
            className="mt-16 grid gap-6 md:grid-cols-2"
          >
            {testimonials.map((t, i) => (
              <li
                key={i}
                data-quote
                className="rounded-2xl border border-hairline bg-surface p-7 transition-colors duration-base ease-out hover:border-accent"
              >
                <blockquote className="text-lg text-text">
                  <span aria-hidden className="mr-1 font-display text-accent">&ldquo;</span>
                  {t.quote}
                </blockquote>
                <p className="mt-4 font-mono text-xs uppercase tracking-[0.14em] text-text-dim">
                  {t.name} · {t.role} · {t.company}
                </p>
              </li>
            ))}
          </ScrollReveal>
        )}
      </div>
    </section>
  );
}
