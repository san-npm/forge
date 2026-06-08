import type { HowWeWorkSectionProps } from '@/lib/schema';
import { Reveal } from '@/components/ui/Reveal';

export function HowWeWorkSection({ steps, smePackageNote }: HowWeWorkSectionProps) {
  return (
    <section data-section="howWeWork" className="px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-3xl font-semibold text-text">How we work</h2>
        <ol className="mt-8 grid gap-6 md:grid-cols-3">
          {steps.map((step, i) => (
            <li key={step} className="rounded-lg bg-surface p-6">
              <Reveal>
                <span className="font-mono text-text-dim">{String(i + 1).padStart(2, '0')}</span>
                <p className="mt-2 text-text">{step}</p>
              </Reveal>
            </li>
          ))}
        </ol>
        {smePackageNote && <p className="mt-8 text-sm text-text-dim">{smePackageNote}</p>}
      </div>
    </section>
  );
}
