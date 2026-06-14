'use client';

import type { WorkItem } from '@/lib/schema';
import { WorkFilter } from '@/components/ui/WorkFilter';
import { WorkCard } from '@/components/ui/WorkCard';

/**
 * Filterable work grid. The chips drive the visible set; each card is the bold
 * homepage WorkCard (real screenshot, mono kind tag, Anton name, lime VISIT).
 * The first visible card spans both columns as the featured, wide hero.
 */
export function WorkGrid({ items }: { items: WorkItem[] }) {
  return (
    <WorkFilter items={items}>
      {(visible) => (
        <ul role="list" className="grid gap-6 md:grid-cols-2">
          {visible.map((w, i) => (
            <li key={w.slug} className={i === 0 ? 'md:col-span-2' : ''}>
              <WorkCard item={w} featured={i === 0} />
            </li>
          ))}
        </ul>
      )}
    </WorkFilter>
  );
}
