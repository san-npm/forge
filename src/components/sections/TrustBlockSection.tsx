import type { TrustBlockSectionProps } from '@/lib/schema';

export function TrustBlockSection({ facts, headline }: TrustBlockSectionProps) {
  return (
    <section data-section="trustBlock" className="px-6 py-20">
      <div className="mx-auto max-w-5xl">
        {headline && <h2 className="text-3xl font-semibold text-text">{headline}</h2>}
        <ul role="list" className="mt-8 grid gap-4">
          {facts.map((fact) => (
            <li key={fact} className="text-text-dim">{fact}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
