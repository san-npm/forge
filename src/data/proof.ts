import { z } from 'zod';
import { ProofLogoSchema, ProofMetricSchema, type ProofLogo, type ProofMetric } from '@/lib/schema';
import { WORK } from '@/data/work';
import type { Locale } from '@/lib/site-config';

export type { ProofLogo, ProofMetric };

// Portfolio wordmarks for the "Shipped & live" strip: the products we built and
// shipped (our own products + client builds), derived from WORK (order
// significant). Projects the founder only CONTRIBUTED to (LiberClaw, LibertAI,
// Aleph Cloud, tag 'contributed') are NOT ours and are excluded here so the
// strip never implies we built or own them. The salvaged logo PNGs live at
// public/clients/<slug>.png. Parsed at load so bad content fails build.
export const PROOF_LOGOS: ProofLogo[] = z.array(ProofLogoSchema).parse(
  WORK.filter((w) => w.tag !== 'contributed' && w.tag !== 'marketing').map((w) => ({
    slug: w.slug,
    name: w.name,
    src: `/clients/${w.slug}.png`,
    href: w.link,
  })),
);

/**
 * Founder-operator proof, framed as breadth and credentials rather than a bare
 * small count next to a multi-year span (which invited unfair subtraction). All
 * three items are honest and owner-confirmable, with NO fabricated precise
 * figures:
 *  - `years`: 5+ years now covers BOTH building products and the Aleph Cloud
 *    marketing work, hence "building and marketing".
 *  - `disciplines`: AI, web and on-chain are three disciplines actually shipped
 *    (the Work grid is the receipt), so this is a defensible "3".
 *  - `alephPartner`: a qualitative credential rendered as Anton text (not a
 *    number) and framed as a CONTRIBUTION, not ownership — the founder
 *    contributed to Aleph Cloud (marketing and growth) for years.
 * The Work grid already lists the products, so we no longer advertise a raw
 * product count here.
 */
const PROOF_METRICS_I18N: Record<Locale, ProofMetric[]> = {
  en: [
    { id: 'years', label: 'Years building and marketing', value: 5, suffix: '+' },
    { id: 'disciplines', label: 'Disciplines shipped: AI, web and on-chain', value: 3, suffix: '' },
    { id: 'alephPartner', label: 'Years contributing to Aleph Cloud, marketing the decentralized cloud', value: null, text: 'Aleph Cloud' },
  ],
  fr: [
    { id: 'years', label: 'Ans à construire et à marketer', value: 5, suffix: '+' },
    { id: 'disciplines', label: 'Disciplines livrées : IA, web et on-chain', value: 3, suffix: '' },
    { id: 'alephPartner', label: 'Des années de contribution à Aleph Cloud, marketing du cloud décentralisé', value: null, text: 'Aleph Cloud' },
  ],
  de: [
    { id: 'years', label: 'Jahre Aufbau und Marketing', value: 5, suffix: '+' },
    { id: 'disciplines', label: 'Gelieferte Disziplinen: KI, Web und On-Chain', value: 3, suffix: '' },
    { id: 'alephPartner', label: 'Jahre der Mitwirkung an Aleph Cloud, Marketing der dezentralen Cloud', value: null, text: 'Aleph Cloud' },
  ],
};

const PARSED_PROOF_METRICS: Record<Locale, ProofMetric[]> = {
  en: z.array(ProofMetricSchema).parse(PROOF_METRICS_I18N.en),
  fr: z.array(ProofMetricSchema).parse(PROOF_METRICS_I18N.fr),
  de: z.array(ProofMetricSchema).parse(PROOF_METRICS_I18N.de),
};

/** Active-locale proof metrics. */
export function getProofMetrics(locale: Locale): ProofMetric[] {
  return PARSED_PROOF_METRICS[locale];
}

// EN constant kept for the proof tests and the EN homepage spine.
export const PROOF_METRICS: ProofMetric[] = PARSED_PROOF_METRICS.en;
