import Link from 'next/link';
import type { SelectedWorkSectionProps } from '@/lib/schema';
import type { Locale } from '@/lib/site-config';
import { getUiStrings, type UiStrings } from '@/data/ui';
import { localeHref } from '@/lib/locale-href';
import { SectionHeading } from '@/components/sections/SectionHeading';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { WorkCard } from '@/components/ui/WorkCard';

export function SelectedWorkSection({
  items,
  viewAllHref,
  locale,
  ui,
}: SelectedWorkSectionProps & { locale: Locale; ui?: UiStrings }) {
  const t = ui ?? getUiStrings(locale);
  return (
    <section data-section="selectedWork" className="px-6 py-24 md:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          kicker={t.sections.selectedWorkKicker}
          title={t.sections.selectedWorkTitle}
          accent={t.sections.selectedWorkAccent}
          subhead={t.sections.selectedWorkSubhead}
          action={
            <Link
              href={localeHref(viewAllHref, locale)}
              className="ol-link inline-flex items-center gap-1 font-mono text-sm uppercase tracking-[0.14em] text-text-dim"
            >
              {t.sections.allWork} <span aria-hidden>→</span>
            </Link>
          }
        />

        <ScrollReveal
          as="ul"
          role="list"
          selector="[data-work-card]"
          className="mt-14 grid gap-6 md:grid-cols-2"
        >
          {items.map((w, i) => (
            <li
              key={w.slug}
              data-work-card
              // First card spans both columns as the featured, wide hero card.
              className={i === 0 ? 'md:col-span-2' : ''}
            >
              <WorkCard item={w} featured={i === 0} ui={t} />
            </li>
          ))}
        </ScrollReveal>
      </div>
    </section>
  );
}
