'use client';

import { useRouter } from 'next/navigation';
import type { WorkItem } from '@/lib/schema';

type ViewTransitionDoc = Document & {
  startViewTransition?: (cb: () => void) => { finished: Promise<void> };
};

export function WorkGallery({ items, basePath }: { items: WorkItem[]; basePath: string }) {
  const router = useRouter();

  function go(e: React.MouseEvent, slug: string) {
    e.preventDefault();
    const href = `${basePath}/${slug}`;
    const doc = document as ViewTransitionDoc;
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (doc.startViewTransition && !reduce) {
      doc.startViewTransition(() => router.push(href));
    } else {
      router.push(href);
    }
  }

  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" data-testid="work-gallery">
      {items.map((item) => (
        <li key={item.slug}>
          <a
            href={`${basePath}/${item.slug}`}
            onClick={(e) => go(e, item.slug)}
            style={{ viewTransitionName: `work-${item.slug}` }}
            className="block h-full rounded-lg border border-hairline bg-surface p-6 transition-colors hover:border-hot"
          >
            <p className="font-mono text-sm text-text-dim">{item.kind}</p>
            <h3 className="mt-2 text-xl font-medium text-text">{item.name}</h3>
            <p className="mt-2 text-sm text-text-dim">{item.blurb}</p>
          </a>
        </li>
      ))}
    </ul>
  );
}
