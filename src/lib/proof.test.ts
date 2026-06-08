import { describe, it, expect, vi, afterEach } from 'vitest';
import { getProofSnapshot, verifiedAgo, type ProofSnapshot } from '@/lib/proof';

afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe('verifiedAgo', () => {
  it('formats sub-minute as "just now"', () => {
    const now = Date.now();
    expect(verifiedAgo(now - 10_000, now)).toBe('verified just now');
  });
  it('formats minutes', () => {
    const now = Date.now();
    expect(verifiedAgo(now - 5 * 60_000, now)).toBe('verified 5 min ago');
  });
  it('formats a lone minute without an "s"', () => {
    const now = Date.now();
    expect(verifiedAgo(now - 60_000, now)).toBe('verified 1 min ago');
  });
});

describe('getProofSnapshot', () => {
  it('returns a fresh snapshot on a successful fetch', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ nodes: 1234 }), { status: 200 }),
    );
    const snap = await getProofSnapshot();
    expect(snap.degraded).toBe(false);
    expect(snap.metrics.find((m) => m.id === 'alephNodes')?.value).toBe(1234);
    expect(typeof snap.verifiedAt).toBe('number');
  });

  it('never throws and degrades to last-known-good on fetch failure', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('network down'));
    let snap: ProofSnapshot | undefined;
    await expect(
      (async () => {
        snap = await getProofSnapshot();
      })(),
    ).resolves.toBeUndefined();
    expect(snap!.degraded).toBe(true);
    // degraded snapshot still carries the static last-known-good metrics
    expect(snap!.metrics.length).toBeGreaterThan(0);
  });

  it('never throws on a non-OK HTTP status', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('nope', { status: 503 }));
    const snap = await getProofSnapshot();
    expect(snap.degraded).toBe(true);
  });
});
