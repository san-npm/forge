'use client';

import Link from 'next/link';
import type { WorkItem } from '@/lib/schema';
import { WorkFilter } from '@/components/ui/WorkFilter';
import { HoverCard } from '@/components/ui/HoverCard';

export function WorkGrid({ items }: { items: WorkItem[] }) {
  return (
    <WorkFilter items={items}>
      {(visible) => (
        <ul role="list" className="grid gap-6 md:grid-cols-2">
          {visible.map((w) => (
            <li key={w.slug}>
              <HoverCard className="rounded-lg bg-surface p-6">
                <Link href={w.link} target="_blank" rel="noopener noreferrer" className="block">
                  <span className="font-mono text-xs uppercase tracking-widest text-text-dim">
                    {w.kind}
                  </span>
                  <h2 className="mt-2 text-xl font-semibold text-text">{w.name}</h2>
                  <p className="mt-2 text-text-dim">{w.blurb}</p>
                </Link>
              </HoverCard>
            </li>
          ))}
        </ul>
      )}
    </WorkFilter>
  );
}
