import { describe, it, expect } from 'vitest';
import {
  computeSmePackage,
  SME_RATE,
  SME_MIN,
  SME_MAX,
} from '@/lib/sme-package';

describe('SME Package constants', () => {
  it('match the official programme (70%, EUR 3k to 25k)', () => {
    expect(SME_RATE).toBe(0.7);
    expect(SME_MIN).toBe(3000);
    expect(SME_MAX).toBe(25000);
  });
});

describe('computeSmePackage', () => {
  it('a EUR 10,000 project gives a EUR 7,000 grant and EUR 3,000 net', () => {
    expect(computeSmePackage(10000)).toEqual({
      eligible: 10000,
      grant: 7000,
      net: 3000,
      clamped: false,
    });
  });

  it('clamps a below-minimum budget up to EUR 3,000 and flags it', () => {
    const r = computeSmePackage(1500);
    expect(r.eligible).toBe(3000);
    expect(r.grant).toBe(2100);
    expect(r.net).toBe(900);
    expect(r.clamped).toBe(true);
  });

  it('clamps an above-maximum budget down to EUR 25,000 and flags it', () => {
    const r = computeSmePackage(40000);
    expect(r.eligible).toBe(25000);
    expect(r.grant).toBe(17500);
    expect(r.net).toBe(7500);
    expect(r.clamped).toBe(true);
  });

  it('treats the EUR 3,000 lower boundary as eligible (not clamped)', () => {
    expect(computeSmePackage(3000)).toEqual({
      eligible: 3000,
      grant: 2100,
      net: 900,
      clamped: false,
    });
  });

  it('treats the EUR 25,000 upper boundary as eligible (not clamped)', () => {
    expect(computeSmePackage(25000)).toEqual({
      eligible: 25000,
      grant: 17500,
      net: 7500,
      clamped: false,
    });
  });

  it('rounds the grant to the nearest euro', () => {
    // 12,345 * 0.7 = 8,641.5 -> rounds to 8,642; net is the remainder.
    const r = computeSmePackage(12345);
    expect(r.grant).toBe(8642);
    expect(r.net).toBe(12345 - 8642);
    expect(r.eligible).toBe(12345);
    expect(r.clamped).toBe(false);
  });

  it('always keeps grant + net equal to the eligible amount', () => {
    for (const b of [3000, 5000, 9999, 12345, 18750, 25000]) {
      const r = computeSmePackage(b);
      expect(r.grant + r.net).toBe(r.eligible);
    }
  });

  it('handles zero, negative and non-finite input as the minimum eligible (clamped)', () => {
    for (const bad of [0, -5000, NaN, Infinity]) {
      const r = computeSmePackage(bad);
      expect(r.eligible).toBe(3000);
      expect(r.grant).toBe(2100);
      expect(r.clamped).toBe(true);
    }
  });
});
