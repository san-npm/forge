import Link from 'next/link';
import type { SelectedWorkSectionProps } from '@/lib/schema';
import type { Locale } from '@/lib/site-config';
import { HoverCard } from '@/components/ui/HoverCard';

export function SelectedWorkSection({
  items,
  viewAllHref,
}: SelectedWorkSectionProps & { locale: Locale }) {
  return (
    <section data-section="selectedWork" className="px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-baseline justify-between">
          <h2 className="text-3xl font-semibold text-text">Selected work</h2>
          <Link href={viewAllHref} className="ol-link text-text-dim hover:text-hot">
            View all work
          </Link>
        </div>
        <ul role="list" className="mt-8 grid gap-6 md:grid-cols-2">
          {items.map((w) => (
            <li key={w.slug}>
              <HoverCard className="rounded-lg bg-surface p-6">
                {/* Phase 3 adds the view-transition morph; here it is a simple link. */}
                <Link href={w.link} target="_blank" rel="noopener noreferrer" className="block">
                  <span className="font-mono text-xs uppercase tracking-widest text-text-dim">
                    {w.kind}
                  </span>
                  <h3 className="mt-2 text-xl font-semibold text-text">{w.name}</h3>
                  <p className="mt-2 text-text-dim">{w.blurb}</p>
                </Link>
              </HoverCard>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
