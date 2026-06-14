import type { HowWeWorkSectionProps } from '@/lib/schema';
import { SectionHeading } from '@/components/sections/SectionHeading';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

export function HowWeWorkSection({ steps, smePackageNote }: HowWeWorkSectionProps) {
  return (
    <section data-section="howWeWork" className="px-6 py-24 md:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          kicker="The process"
          title="How We Work"
          accent="Work"
          subhead="A short, honest path from idea to something live you can measure."
        />

        <ScrollReveal
          as="ol"
          selector="[data-step]"
          className="mt-14 grid gap-6 md:grid-cols-3"
        >
          {steps.map((step, i) => (
            <li
              key={step}
              data-step
              className="group relative flex flex-col rounded-2xl border border-hairline bg-surface p-7 md:p-8
                transition-[transform,border-color,box-shadow] duration-base ease-out
                hover:-translate-y-1 hover:border-accent hover:shadow-[0_0_50px_-12px_var(--accent-glow)]"
            >
              <span
                className="font-display leading-none tracking-tight text-accent"
                style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)' }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <p className="mt-5 text-lg text-text">{step}</p>
            </li>
          ))}
        </ScrollReveal>

        {smePackageNote && (
          <p className="mt-10 max-w-2xl text-sm text-text-dim">{smePackageNote}</p>
        )}
      </div>
    </section>
  );
}
