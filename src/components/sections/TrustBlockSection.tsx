import type { TrustBlockSectionProps } from '@/lib/schema';
import { getUiStrings, type UiStrings } from '@/data/ui';
import { SectionHeading } from '@/components/sections/SectionHeading';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

export function TrustBlockSection({
  facts,
  headline,
  ui,
}: TrustBlockSectionProps & { ui?: UiStrings }) {
  const t = ui ?? getUiStrings('en');
  // Accent the first word of the headline (e.g. "European" in "European by
  // default.") in lime, falling back to no accent when there is no headline.
  const accent = headline?.split(/\s+/)[0];

  return (
    <section data-section="trustBlock" className="px-6 py-24 md:py-28">
      <div className="mx-auto max-w-6xl">
        {headline && <SectionHeading kicker={t.sections.trustKicker} title={headline} accent={accent} />}

        <ScrollReveal as="ul" role="list" selector="[data-fact]" className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-hairline bg-hairline md:grid-cols-3">
          {facts.map((fact) => (
            <li
              key={fact}
              data-fact
              className="bg-surface p-7 text-text-dim transition-colors duration-base ease-out hover:text-text"
            >
              <span aria-hidden className="mb-4 block font-display text-2xl text-accent">/</span>
              {fact}
            </li>
          ))}
        </ScrollReveal>
      </div>
    </section>
  );
}
