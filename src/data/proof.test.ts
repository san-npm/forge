import { describe, it, expect } from 'vitest';
import { PROOF_LOGOS, PROOF_METRICS } from '@/data/proof';
import { WORK } from '@/data/work';

describe('PROOF_LOGOS', () => {
  const products = WORK.filter((w) => w.tag !== 'marketing');
  it('has one wordmark per BUILT product (marketing clients excluded)', () => {
    expect(PROOF_LOGOS).toHaveLength(products.length);
    expect(PROOF_LOGOS.map((l) => l.slug)).toEqual(products.map((w) => w.slug));
  });
  it('excludes the Aleph Cloud marketing engagement from the product wordmarks', () => {
    expect(PROOF_LOGOS.some((l) => l.slug === 'alephcloud')).toBe(false);
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
  it('does NOT advertise a bare small product count next to the year span', () => {
    // The Work grid is the receipt for the products; the strip must not invite
    // "only N in M years" subtraction, so there is no raw shipped-count metric.
    expect(PROOF_METRICS.some((m) => m.id === 'shipped')).toBe(false);
    expect(PROOF_METRICS.some((m) => /products?\s+(shipped|live|built)/i.test(m.label))).toBe(false);
  });
  it('frames years as covering both building and marketing', () => {
    const years = PROOF_METRICS.find((m) => m.id === 'years');
    expect(years?.value).toBe(5);
    expect(years?.suffix).toBe('+');
    expect(years?.label.toLowerCase()).toContain('marketing');
  });
  it('carries an honest disciplines-shipped breadth metric (3)', () => {
    const disciplines = PROOF_METRICS.find((m) => m.id === 'disciplines');
    expect(disciplines?.value).toBe(3);
    expect(disciplines?.label.toLowerCase()).toContain('ai');
  });
  it('carries the Aleph Cloud marketing credential as Anton text (no fake number)', () => {
    const partner = PROOF_METRICS.find((m) => m.id === 'alephPartner');
    expect(partner).toBeTruthy();
    expect(partner?.value).toBeNull();
    expect(partner?.text).toBe('Aleph Cloud');
    expect(partner?.label.toLowerCase()).toContain('marketing');
  });
  it('never says "Aleph.im" anywhere', () => {
    for (const m of PROOF_METRICS) {
      expect(m.label).not.toMatch(/aleph\.im/i);
      expect(m.text ?? '').not.toMatch(/aleph\.im/i);
    }
  });
  it('uses no em-dash or en-dash in any metric label or text', () => {
    for (const m of PROOF_METRICS) {
      expect(m.label).not.toMatch(/[—–]/);
      expect(m.text ?? '').not.toMatch(/[—–]/);
    }
  });
  it('every metric is static (no live placeholders) with either a number or Anton text', () => {
    for (const m of PROOF_METRICS) {
      expect(m.live).toBeUndefined();
      if (m.value === null) {
        expect(typeof m.text).toBe('string');
      } else {
        expect(typeof m.value).toBe('number');
      }
    }
  });
});
