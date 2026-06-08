import { describe, it, expect } from 'vitest';
import { PROOF_LOGOS, PROOF_METRICS } from '@/data/proof';
import { WORK } from '@/data/work';

describe('PROOF_LOGOS', () => {
  it('has one wordmark per WORK item (6), derived from WORK', () => {
    expect(PROOF_LOGOS).toHaveLength(WORK.length);
    expect(PROOF_LOGOS.map((l) => l.slug)).toEqual(WORK.map((w) => w.slug));
  });
  it('each logo uses /clients/<slug>.png and the live WORK link', () => {
    for (const logo of PROOF_LOGOS) {
      const w = WORK.find((x) => x.slug === logo.slug)!;
      expect(logo.name).toBe(w.name);
      expect(logo.src).toBe(`/clients/${logo.slug}.png`);
      expect(logo.href).toBe(w.link);
    }
  });
});

describe('PROOF_METRICS', () => {
  it('reports the defensible shipped-products count (6)', () => {
    const shipped = PROOF_METRICS.find((m) => m.id === 'shipped');
    expect(shipped?.value).toBe(WORK.length);
    expect(shipped?.value).toBe(6);
  });
  it('carries a years-building metric', () => {
    expect(PROOF_METRICS.some((m) => m.id === 'years')).toBe(true);
  });
  it('declares the Aleph live metric with value: null, live: true (filled at runtime)', () => {
    const aleph = PROOF_METRICS.find((m) => m.id === 'alephNodes');
    expect(aleph).toBeDefined();
    expect(aleph?.value).toBeNull();
    expect(aleph?.live).toBe(true);
  });
  it('fabricates no live numbers (every live metric starts null)', () => {
    for (const m of PROOF_METRICS) {
      if (m.live) expect(m.value).toBeNull();
    }
  });
});
