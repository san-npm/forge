import type { IconKey } from '@/lib/schema';
import { PricingSchema } from '@/lib/schema';
import type { Locale } from '@/lib/site-config';

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
// publishing numeric price anchors. Per-locale, parsed at module load.
const PRICING_I18N: Record<Locale, Pricing> = {
  en: {
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
        name: 'Custom & care',
        icon: 'tools',
        price: "Let's talk",
        desc: 'Larger builds, retainers, hosting and support.',
        feats: ['Tailored scope', 'Monitoring & backups', 'Direct support'],
      },
    ],
    note: 'Based in Luxembourg, your project may be co-funded through the SME Package. We help with the paperwork.',
  },
  fr: {
    lead: 'Chaque projet reçoit un devis fixe en amont, calibré sur vos besoins réels.',
    tiers: [
      {
        name: 'Agents IA & automatisation',
        icon: 'ai',
        price: 'Devis fixe',
        desc: 'Agents, chatbots et automatisations, audités d’abord.',
        feats: ['Audit cadré d’abord', 'Développé et déployé', 'Vous en êtes propriétaire'],
        highlight: true,
      },
      {
        name: 'Site web & e-commerce',
        icon: 'growth',
        price: 'Devis fixe',
        desc: 'Sites et boutiques modernes sur Next.js.',
        feats: ['Design + développement', 'Multilingue & SEO', 'Stripe / réservations'],
      },
      {
        name: 'Développement Web3',
        icon: 'web3',
        price: 'Devis fixe',
        desc: 'Smart contracts et applis on-chain.',
        feats: ['Cadrage & architecture', 'Développement & tests', 'Lancement + support'],
      },
      {
        name: 'Sur mesure & suivi',
        icon: 'tools',
        price: 'Parlons-en',
        desc: 'Projets plus ambitieux, forfaits, hébergement et support.',
        feats: ['Périmètre sur mesure', 'Supervision & sauvegardes', 'Support direct'],
      },
    ],
    note: 'Basé au Luxembourg, votre projet peut être cofinancé via le SME Package (aides aux PME). Nous vous aidons avec les démarches.',
  },
  de: {
    lead: 'Jedes Projekt erhält vorab ein festes Angebot, zugeschnitten auf das, was Sie wirklich brauchen.',
    tiers: [
      {
        name: 'KI-Agenten & Automatisierung',
        icon: 'ai',
        price: 'Festes Angebot',
        desc: 'Agenten, Chatbots und Automatisierungen, zuerst auditiert.',
        feats: ['Zuerst klares Audit', 'Gebaut und deployt', 'Es gehört Ihnen'],
        highlight: true,
      },
      {
        name: 'Website & E-Commerce',
        icon: 'growth',
        price: 'Festes Angebot',
        desc: 'Moderne Websites und Shops mit Next.js.',
        feats: ['Design + Aufbau', 'Mehrsprachig & SEO', 'Stripe / Buchungen'],
      },
      {
        name: 'Web3-Entwicklung',
        icon: 'web3',
        price: 'Festes Angebot',
        desc: 'Smart Contracts und On-Chain-Apps.',
        feats: ['Konzept & Architektur', 'Entwicklung & Tests', 'Launch + Support'],
      },
      {
        name: 'Individuell & Betreuung',
        icon: 'tools',
        price: 'Sprechen wir',
        desc: 'Größere Projekte, Retainer, Hosting und Support.',
        feats: ['Maßgeschneiderter Umfang', 'Monitoring & Backups', 'Direkter Support'],
      },
    ],
    note: 'In Luxemburg ansässig? Ihr Projekt kann über das SME Package (Förderung für KMU) kofinanziert werden. Wir helfen bei den Formalitäten.',
  },
};

const PARSED_PRICING: Record<Locale, Pricing> = {
  en: PricingSchema.parse(PRICING_I18N.en),
  fr: PricingSchema.parse(PRICING_I18N.fr),
  de: PricingSchema.parse(PRICING_I18N.de),
};

/** Active-locale pricing content. */
export function getPricing(locale: Locale): Pricing {
  return PARSED_PRICING[locale];
}

// EN constant kept for the data tests.
export const PRICING: Pricing = PARSED_PRICING.en;
