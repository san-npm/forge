'use client';

import { useEffect, useState } from 'react';
import { CountUp } from '@/components/ui/CountUp';
import { verifiedAgo, type ProofSnapshot } from '@/lib/proof';

export function ProofStripLive({ snapshot }: { snapshot: ProofSnapshot }) {
  // Freshness label re-renders client-side so it stays truthful after hydration,
  // but the server already rendered an initial value so there is no layout shift.
  const [label, setLabel] = useState(() => verifiedAgo(snapshot.verifiedAt));

  useEffect(() => {
    const tick = () => setLabel(verifiedAgo(snapshot.verifiedAt));
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, [snapshot.verifiedAt]);

  return (
    <div data-proof-live>
      <ul className="flex flex-wrap gap-8" role="list">
        {snapshot.metrics.map((m) => (
          <li key={m.id} className="flex flex-col">
            <span className="font-mono text-3xl text-text">
              {m.value === null ? (
                <span aria-hidden>—</span>
              ) : (
                <>
                  <CountUp to={m.value} />
                  {m.suffix ?? ''}
                </>
              )}
            </span>
            <span className="text-text-dim text-sm">{m.label}</span>
          </li>
        ))}
      </ul>
      <p className="text-text-dim mt-3 font-mono text-xs" aria-live="polite">
        {label}
      </p>
    </div>
  );
}
