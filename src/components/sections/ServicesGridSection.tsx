import Link from 'next/link';
import type { ServicesGridSectionProps } from '@/lib/schema';
import type { Locale } from '@/lib/site-config';
import { getServices } from '@/data/services';
import { getUiStrings, type UiStrings } from '@/data/ui';
import { localeHref } from '@/lib/locale-href';
import { SectionHeading } from '@/components/sections/SectionHeading';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

export function ServicesGridSection({
  order,
  ctaLabel,
  ctaHref,
  locale,
  ui,
}: ServicesGridSectionProps & { locale: Locale; ui?: UiStrings }) {
  const href = localeHref(ctaHref, locale);
  const t = ui ?? getUiStrings(locale);
  const services = getServices(locale);

  return (
    <section data-section="servicesGrid" className="px-6 py-24 md:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          kicker={t.sections.servicesKicker}
          title={t.sections.servicesTitle}
          accent={t.sections.servicesAccent}
          subhead={t.sections.servicesSubhead}
        />

        <ScrollReveal
          as="div"
          selector="[data-pillar]"
          className="mt-14 grid gap-6 md:grid-cols-3"
        >
          {order.map((key, i) => {
            const svc = services[key];
            return (
              <div
                key={key}
                data-pillar
                className="group flex flex-col rounded-2xl border border-hairline bg-surface p-7 md:p-8
                  transition-[transform,border-color,box-shadow] duration-base ease-out
                  hover:-translate-y-1 hover:border-accent hover:shadow-[0_0_50px_-12px_var(--accent-glow)]"
              >
                <span className="font-mono text-sm tracking-[0.2em] text-accent">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3
                  className="mt-5 font-display uppercase leading-[0.95] tracking-[-0.01em] text-text"
                  style={{ fontSize: 'clamp(1.6rem, 2.4vw, 2.25rem)' }}
                >
                  {svc.title}
                </h3>
                <p className="mt-4 flex-1 text-text-dim">{svc.lead}</p>
                <Link
                  href={href}
                  className="ol-link mt-7 inline-flex items-center gap-1.5 font-mono text-sm uppercase tracking-[0.12em] text-accent"
                >
                  {ctaLabel} <span aria-hidden>→</span>
                </Link>
              </div>
            );
          })}
        </ScrollReveal>
      </div>
    </section>
  );
}
