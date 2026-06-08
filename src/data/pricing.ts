import type { IconKey } from '@/lib/schema';
import { PricingSchema } from '@/lib/schema';

export type { IconKey };
export interface PriceTier {
  name: string;
  icon: IconKey;
  price: string;     // 'from €X' placeholder — OWNER fills the real number
  desc: string;
  feats: string[];   // length 3
  highlight?: boolean;
}
export interface Pricing {
  lead: string;
  tiers: PriceTier[];
  note: string;
}

// OWNER-PROVIDED: replace the 'X' in each `price` with the real "from" figure,
// e.g. 'from €2,500'. Keep the 'from €' prefix and the EUR currency. Do NOT use
// 'On request' — published anchors convert better (spec §8).
const raw: Pricing = {
  lead: 'Every project gets a fixed quote up front. Here is the shape of what we do, with a starting point for each.',
  tiers: [
    {
      name: 'AI agents & automation',
      icon: 'ai',
      price: 'from €X', // OWNER-PROVIDED (e.g. 'from €2,500')
      desc: 'Agents, chatbots and automations, audited first.',
      feats: ['Scoped audit first', 'Built and deployed', 'You own it'],
      highlight: true,
    },
    {
      name: 'Website & e-commerce',
      icon: 'growth',
      price: 'from €X', // OWNER-PROVIDED (e.g. 'from €4,500')
      desc: 'Modern sites and shops on Next.js.',
      feats: ['Design + build', 'Multilingual & SEO', 'Stripe / bookings'],
    },
    {
      name: 'Web3 build',
      icon: 'web3',
      price: 'from €X', // OWNER-PROVIDED (e.g. 'from €6,000')
      desc: 'Smart contracts and on-chain apps.',
      feats: ['Scope & architecture', 'Build & testing', 'Launch + support'],
    },
    {
      name: "Custom & care",
      icon: 'tools',
      price: "let's talk",
      desc: 'Larger builds, retainers, hosting and support.',
      feats: ['Tailored scope', 'Monitoring & backups', 'Direct support'],
    },
  ],
  note: 'Based in Luxembourg, your project may be co-funded through the SME Package — we help with the paperwork.',
};

export const PRICING: Pricing = PricingSchema.parse(raw);

/** @deprecated Use PRICING.tiers[n].price directly. Kept for backward compat. */
export const PRICE_PLACEHOLDER = 'from €X' as const;
