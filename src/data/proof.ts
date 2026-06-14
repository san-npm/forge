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
 * DEFENSIBLE proof metrics ONLY; never fabricate numbers, never show a live
 * placeholder. Both values are static, real, and owner-confirmable, so they
 * render in SSR HTML (via CountUp) with no degraded placeholder fallback.
 *  - `shipped`: the real shipped-product count (WORK.length === 6).
 *  - `years`: years building (defensible, owner-confirmable).
 */
export const PROOF_METRICS: ProofMetric[] = z.array(ProofMetricSchema).parse([
  { id: 'shipped', label: 'Products shipped & live', value: WORK.length, suffix: '' },
  { id: 'years', label: 'Years building', value: 5, suffix: '+' },
]);
