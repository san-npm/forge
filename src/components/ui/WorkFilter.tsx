'use client';

import { useState, type ReactNode } from 'react';
import type { WorkItem } from '@/lib/schema';

type Tag = 'ai' | 'web' | 'web3';
const TAGS: { key: Tag | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'ai', label: 'AI' },
  { key: 'web', label: 'Web' },
  { key: 'web3', label: 'Web3' },
];

export function WorkFilter({
  items,
  children,
}: {
  items: WorkItem[];
  children: (visible: WorkItem[]) => ReactNode;
}) {
  const [active, setActive] = useState<Tag | 'all'>('all');
  const visible = active === 'all' ? items : items.filter((w) => w.tag === active);

  return (
    <div data-work-filter>
      <div role="tablist" aria-label="Filter work by type" className="flex gap-2">
        {TAGS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={active === key}
            onClick={() => setActive(key)}
            className="ol-chip"
            data-active={active === key}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="mt-6">{children(visible)}</div>
    </div>
  );
}
