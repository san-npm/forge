/**
 * SME Package funding math (Luxembourg state aid).
 *
 * The SME Package (Ministry of the Economy + Luxinnovation, since 2019)
 * reimburses 70% of eligible project costs for qualifying Luxembourg SMEs.
 * Eligible project cost runs from EUR 3,000 to EUR 25,000 (excl. VAT). Above
 * EUR 25,000 only EUR 25,000 counts toward the grant; below EUR 3,000 a project
 * is too small to be eligible.
 *
 * This module is pure (no I/O, no DOM) so the simulator island and tests share
 * one source of truth. Numbers here are INDICATIVE only: actual aid depends on
 * eligibility and Ministry of the Economy approval, and is reimbursed AFTER the
 * project is delivered.
 */

/** Share of eligible costs the SME Package reimburses. */
export const SME_RATE = 0.7;
/** Minimum eligible project cost, EUR excl. VAT. */
export const SME_MIN = 3000;
/** Maximum eligible project cost, EUR excl. VAT. */
export const SME_MAX = 25000;

export interface SmePackageResult {
  /** Project budget clamped into the eligible band [SME_MIN, SME_MAX]. */
  eligible: number;
  /** Reimbursed amount: round(eligible * SME_RATE). */
  grant: number;
  /** Net cost to the client after the grant: eligible - grant. */
  net: number;
  /** True when the raw budget fell outside [SME_MIN, SME_MAX]. */
  clamped: boolean;
}

/** Clamp `n` into the inclusive range [min, max]. */
function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

/**
 * Compute the indicative SME Package grant for a project budget.
 *
 * The budget is first clamped into the eligible band; the grant is 70% of the
 * eligible amount (rounded to the nearest euro), and the net is the remainder.
 *
 * @example computeSmePackage(10000) // { eligible: 10000, grant: 7000, net: 3000, clamped: false }
 */
export function computeSmePackage(budget: number): SmePackageResult {
  // Treat non-finite / negative input as the smallest eligible project so the
  // UI never shows NaN; such input is by definition outside the band.
  const safe = Number.isFinite(budget) && budget > 0 ? budget : 0;
  const eligible = clamp(safe, SME_MIN, SME_MAX);
  const clamped = safe < SME_MIN || safe > SME_MAX;
  const grant = Math.round(eligible * SME_RATE);
  const net = eligible - grant;
  return { eligible, grant, net, clamped };
}
