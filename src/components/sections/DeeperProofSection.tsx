import type { DeeperProofSectionProps } from '@/lib/schema';
import { CountUp } from '@/components/ui/CountUp';

export function DeeperProofSection({ metrics, testimonials }: DeeperProofSectionProps) {
  return (
    <section data-section="deeperProof" className="px-6 py-20">
      <div className="mx-auto max-w-5xl">
        {metrics.length > 0 && (
          <ul role="list" className="grid gap-8 md:grid-cols-3">
            {metrics.map((m) => (
              <li key={m.id} className="flex flex-col">
                <span className="font-mono text-4xl text-text">
                  {m.value === null ? '—' : <CountUp to={m.value} />}
                  {m.suffix ?? ''}
                </span>
                <span className="mt-1 text-text-dim">{m.label}</span>
              </li>
            ))}
          </ul>
        )}
        {testimonials.length > 0 && (
          <ul role="list" className="mt-12 grid gap-8 md:grid-cols-2">
            {testimonials.map((t, i) => (
              <li key={i}>
                <blockquote className="text-text">&quot;{t.quote}&quot;</blockquote>
                <p className="mt-2 text-sm text-text-dim">
                  {t.name}, {t.role} &middot; {t.company}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
