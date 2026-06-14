import type { IconKey } from '@/lib/schema';
import { PricingSchema } from '@/lib/schema';

export type { IconKey };
export interface PriceTier {
  name: string;
  icon: IconKey;
  price: string;     // honest, non-numeric framing (e.g. 'Fixed quote')
  desc: string;
  feats: string[];   // length 3
  highlight?: boolean;
}
export interface Pricing {
  lead: string;
  tiers: PriceTier[];
  note: string;
}

// Honest framing: the studio scopes and quotes each project up front rather than
// publishing numeric price anchors.
const raw: Pricing = {
  lead: 'Every project gets a fixed quote up front, scoped to what you actually need.',
  tiers: [
    {
      name: 'AI agents & automation',
      icon: 'ai',
      price: 'Fixed quote',
      desc: 'Agents, chatbots and automations, audited first.',
      feats: ['Scoped audit first', 'Built and deployed', 'You own it'],
      highlight: true,
    },
    {
      name: 'Website & e-commerce',
      icon: 'growth',
      price: 'Fixed quote',
      desc: 'Modern sites and shops on Next.js.',
      feats: ['Design + build', 'Multilingual & SEO', 'Stripe / bookings'],
    },
    {
      name: 'Web3 build',
      icon: 'web3',
      price: 'Fixed quote',
      desc: 'Smart contracts and on-chain apps.',
      feats: ['Scope & architecture', 'Build & testing', 'Launch + support'],
    },
    {
      name: "Custom & care",
      icon: 'tools',
      price: "Let's talk",
      desc: 'Larger builds, retainers, hosting and support.',
      feats: ['Tailored scope', 'Monitoring & backups', 'Direct support'],
    },
  ],
  note: 'Based in Luxembourg, your project may be co-funded through the SME Package. We help with the paperwork.',
};

export const PRICING: Pricing = PricingSchema.parse(raw);
