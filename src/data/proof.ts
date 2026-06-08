import { z } from 'zod';
import { ProofLogoSchema, ProofMetricSchema, type ProofLogo, type ProofMetric } from '@/lib/schema';
import { WORK } from '@/data/work';

export type { ProofLogo, ProofMetric };

// Portfolio wordmarks derived from WORK (order significant). The salvaged logo
// PNGs live at public/clients/<slug>.png. Parsed at load so bad content fails build.
export const PROOF_LOGOS: ProofLogo[] = z.array(ProofLogoSchema).parse(
  WORK.map((w) => ({
    slug: w.slug,
    name: w.name,
    src: `/clients/${w.slug}.png`,
    href: w.link,
  })),
);

/**
 * DEFENSIBLE proof metrics ONLY — never fabricate numbers.
 *  - `shipped`: the real shipped-product count (WORK.length === 6).
 *  - `years`: years building (defensible, owner-confirmable).
 *  - `alephNodes`: a live Aleph corechannel signal — carried as `value: null,
 *    live: true` and filled at runtime by src/lib/proof.ts (Phase 2), which
 *    merges the fetched value into the metric whose id === 'alephNodes'.
 */
export const PROOF_METRICS: ProofMetric[] = z.array(ProofMetricSchema).parse([
  { id: 'shipped', label: 'Products shipped & live', value: WORK.length, suffix: '+' },
  { id: 'years', label: 'Years building', value: 5, suffix: '+' },
  { id: 'alephNodes', label: 'Aleph network nodes', value: null, live: true },
]);
