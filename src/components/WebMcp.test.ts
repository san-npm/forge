import { describe, it, expect } from 'vitest';
import { estimateSmeFundingText } from './WebMcp';

describe('estimateSmeFundingText (WebMCP tool math)', () => {
  it('computes the 70% grant for an in-band budget', () => {
    const t = estimateSmeFundingText(20000);
    expect(t).toMatch(/14,000/); // grant
    expect(t).toMatch(/6,000/); // net
    expect(t).toMatch(/70%/);
    expect(t).toMatch(/indicative/i);
  });

  it('clamps and flags an above-band budget', () => {
    const t = estimateSmeFundingText(40000);
    expect(t).toMatch(/17,500/); // 70% of 25,000
    expect(t).toMatch(/outside the eligible band/);
  });

  it('clamps and flags a below-band budget', () => {
    const t = estimateSmeFundingText(1000);
    expect(t).toMatch(/2,100/); // 70% of 3,000
    expect(t).toMatch(/outside the eligible band/);
  });

  it('rejects non-positive or non-numeric input', () => {
    expect(estimateSmeFundingText(0)).toMatch(/positive project budget/);
    expect(estimateSmeFundingText(-5)).toMatch(/positive project budget/);
    expect(estimateSmeFundingText('abc')).toMatch(/positive project budget/);
    expect(estimateSmeFundingText(undefined)).toMatch(/positive project budget/);
  });
});
