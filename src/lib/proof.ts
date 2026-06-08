import type { ProofMetric } from '@/lib/schema';
import { PROOF_METRICS } from '@/data/proof';

// Aleph corechannel network-metrics endpoint (defensible live signal).
const ALEPH_METRICS_URL =
  'https://api2.aleph.im/api/v0/aggregates/0xa1B3bb7d2332383D96b7796B908fB7f7F3c2Be10.json?keys=corechannel';
const REVALIDATE_SECONDS = 600; // 10-min ISR window (spec: 5-15 min)
const FETCH_TIMEOUT_MS = 4000;

export interface ProofSnapshot {
  metrics: ProofMetric[];
  verifiedAt: number; // epoch ms of the data we are showing
  degraded: boolean; // true => upstream failed, showing last-known-good
}

/** "verified N min ago" relative-time string. `now` is injectable for tests. */
export function verifiedAgo(verifiedAt: number, now: number = Date.now()): string {
  const mins = Math.floor((now - verifiedAt) / 60_000);
  if (mins <= 0) return 'verified just now';
  if (mins === 1) return 'verified 1 min ago';
  return `verified ${mins} min ago`;
}

async function fetchAlephNodes(): Promise<number | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(ALEPH_METRICS_URL, {
      signal: controller.signal,
      next: { revalidate: REVALIDATE_SECONDS },
    } as RequestInit & { next?: { revalidate?: number } });
    if (!res.ok) return null;
    const json: unknown = await res.json();
    // Be defensive about the shape — any structural surprise => null (degrade).
    if (json && typeof json === 'object' && 'nodes' in json) {
      const n = (json as { nodes: unknown }).nodes;
      return typeof n === 'number' ? n : null;
    }
    return null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Returns the proof snapshot. NEVER throws: a fetch failure, timeout, non-OK
 * status, or malformed payload degrades to the static last-known-good metrics
 * with `degraded: true`. The ProofStripLive island renders "verified N min ago"
 * off `verifiedAt`.
 */
export async function getProofSnapshot(): Promise<ProofSnapshot> {
  const nodes = await fetchAlephNodes();
  if (nodes === null) {
    return {
      metrics: PROOF_METRICS, // static, defensible last-known-good
      verifiedAt: Date.now(),
      degraded: true,
    };
  }
  // Merge the one live value into the static metric definitions.
  const metrics: ProofMetric[] = PROOF_METRICS.map((m) =>
    m.id === 'alephNodes' ? { ...m, value: nodes, live: true } : m,
  );
  return { metrics, verifiedAt: Date.now(), degraded: false };
}
