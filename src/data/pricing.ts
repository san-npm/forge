import { PricingSchema, type Pricing } from '@/lib/schema';

export type { Pricing };

/**
 * OWNER-PROVIDED PLACEHOLDER.
 * osData used 'On request'; the spec requires an explicit "from €X" anchor
 * (research ties published "from" anchors to higher qualified-lead conversion).
 * Replace this single constant when the owner provides the real per-tier
 * numbers — the tier structure stays the same.
 */
export const PRICE_PLACEHOLDER = 'from €X' as const;

// Ported from src/components/os/osData.ts (PRICING); 'On request' prices
// replaced by the explicit PRICE_PLACEHOLDER per the spec.
export const PRICING: Pricing = PricingSchema.parse({
  lead: "Every project gets a fixed quote up front. Here's the shape of what we do.",
  tiers: [
    {
      name: 'AI agents & automation',
      icon: 'ai',
      price: PRICE_PLACEHOLDER,
      desc: 'Agents, chatbots and automations.',
      feats: ['Scoped audit first', 'Built and deployed', 'You own it'],
      highlight: true,
    },
    {
      name: 'Website & e-commerce',
      icon: 'growth',
      price: PRICE_PLACEHOLDER,
      desc: 'Modern sites and shops on Next.js.',
      feats: ['Design + build', 'Multilingual & SEO', 'Stripe / bookings'],
      highlight: true,
    },
    {
      name: 'Web3 build',
      icon: 'web3',
      price: PRICE_PLACEHOLDER,
      desc: 'Smart contracts and on-chain apps.',
      feats: ['Scope & architecture', 'Build & testing', 'Launch + support'],
    },
    {
      name: 'Care & hosting',
      icon: 'tools',
      price: PRICE_PLACEHOLDER,
      desc: 'Updates, monitoring and EU hosting.',
      feats: ['Maintenance', 'Monitoring & backups', 'Direct support'],
    },
  ],
  note: 'Based in Luxembourg, your project may be co-funded through the SME Package — we help with the paperwork.',
});
