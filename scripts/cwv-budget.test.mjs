import { describe, it, expect } from 'vitest';
import { evaluateBudget, FIRST_LOAD_JS_BUDGET_KB } from './cwv-budget.mjs';

describe('cwv-budget evaluateBudget', () => {
  it('passes when first-load JS is under budget', () => {
    const result = evaluateBudget([
      { route: '/[locale]', firstLoadKb: 120 },
      { route: '/[locale]/work', firstLoadKb: 130 },
    ]);
    expect(result.ok).toBe(true);
    expect(result.violations).toHaveLength(0);
  });

  it('fails when any route exceeds the budget', () => {
    const result = evaluateBudget([
      { route: '/[locale]', firstLoadKb: FIRST_LOAD_JS_BUDGET_KB + 1 },
    ]);
    expect(result.ok).toBe(false);
    expect(result.violations).toHaveLength(1);
    expect(result.violations[0].route).toBe('/[locale]');
  });

  it('exposes a defensible budget (<= 180 KB first-load JS)', () => {
    expect(FIRST_LOAD_JS_BUDGET_KB).toBeLessThanOrEqual(180);
    expect(FIRST_LOAD_JS_BUDGET_KB).toBeGreaterThan(0);
  });
});
