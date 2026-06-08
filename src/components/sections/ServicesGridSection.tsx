import Link from 'next/link';
import type { ServicesGridSectionProps } from '@/lib/schema';
import type { Locale } from '@/lib/site-config';
import { SERVICES } from '@/data/services';
import { HoverCard } from '@/components/ui/HoverCard';

export function ServicesGridSection({
  order,
  ctaLabel,
  ctaHref,
}: ServicesGridSectionProps & { locale: Locale }) {
  return (
    <section data-section="servicesGrid" className="px-6 py-20">
      <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
        {order.map((key, i) => {
          const svc = SERVICES[key];
          return (
            <HoverCard key={key} className="flex flex-col rounded-lg bg-surface p-6">
              <span className="font-mono text-text-dim">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-2 text-xl font-semibold text-text">{svc.title}</h3>
              <p className="mt-3 flex-1 text-text-dim">{svc.lead}</p>
              <Link href={ctaHref} className="ol-link mt-6 text-hot">
                {ctaLabel}
              </Link>
            </HoverCard>
          );
        })}
      </div>
    </section>
  );
}
