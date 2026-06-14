'use client';

import { useState, type ReactNode } from 'react';
import type { WorkItem } from '@/lib/schema';
import { getUiStrings, type UiStrings } from '@/data/ui';

type Tag = 'ai' | 'web' | 'web3' | 'marketing';

export function WorkFilter({
  items,
  children,
  ui,
}: {
  items: WorkItem[];
  children: (visible: WorkItem[]) => ReactNode;
  ui?: UiStrings;
}) {
  const t = ui ?? getUiStrings('en');
  const f = t.work.filters;
  const tags: { key: Tag | 'all'; label: string }[] = [
    { key: 'all', label: f.all },
    { key: 'ai', label: f.ai },
    { key: 'web', label: f.web },
    { key: 'web3', label: f.web3 },
    { key: 'marketing', label: f.growth },
  ];
  const [active, setActive] = useState<Tag | 'all'>('all');
  const visible = active === 'all' ? items : items.filter((w) => w.tag === active);

  return (
    <div data-work-filter>
      <div
        role="tablist"
        aria-label={t.work.filterLabel}
        className="flex flex-wrap gap-2.5"
      >
        {tags.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={active === key}
            onClick={() => setActive(key)}
            className="ol-chip font-mono text-xs uppercase tracking-[0.16em]"
            data-active={active === key}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="mt-10">{children(visible)}</div>
    </div>
  );
}
