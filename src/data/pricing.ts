import type { IconKey } from '@/lib/schema';
import { PricingSchema } from '@/lib/schema';
import type { Locale } from '@/lib/site-config';

export type { IconKey };
export interface PriceTier {
  name: string;
  icon: IconKey;
  price: string;     // real starting anchor (e.g. 'from €3,000') or 'Let's talk'
  desc: string;
  feats: string[];   // length 3
  highlight?: boolean;
}
export interface Pricing {
  lead: string;
  tiers: PriceTier[];
  note: string;
}

// Honest pricing anchor: projects start at the SME Package minimum eligible cost
// of €3,000, scoped per project. Eligible Luxembourg SMEs can co-fund at 70%
// through the SME Package (about €900 net), subject to eligibility and Ministry
// of the Economy approval. Per-locale, parsed at module load.
const PRICING_I18N: Record<Locale, Pricing> = {
  en: {
    lead: 'Projects start from €3,000, scoped to your project. Eligible Luxembourg SMEs can co-fund it at 70% through the SME Package, subject to eligibility and Ministry of the Economy approval, so €3,000 can be about €900 net.',
    tiers: [
      {
        name: 'AI agents & automation',
        icon: 'ai',
        price: 'from €3,000',
        desc: 'Agents, chatbots and automations, audited first.',
        feats: ['Scoped audit first', 'Built and deployed', 'You own it'],
        highlight: true,
      },
      {
        name: 'Website & e-commerce',
        icon: 'growth',
        price: 'from €3,000',
        desc: 'Modern sites and shops on Next.js.',
        feats: ['Design + build', 'Multilingual & SEO', 'Stripe / bookings'],
      },
      {
        name: 'Web3 build',
        icon: 'web3',
        price: 'from €3,000',
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
    note: 'The €3,000 start is the SME Package minimum eligible cost; eligible projects run from €3,000 to €25,000, and the programme reimburses 70%, subject to eligibility and Ministry of the Economy approval. Based in Luxembourg, your project may be co-funded; we help with the paperwork.',
  },
  fr: {
    lead: 'Les projets démarrent à partir de 3 000 €, calibrés sur votre projet. Les PME luxembourgeoises éligibles peuvent le cofinancer à 70 % via le SME Package, sous réserve d’éligibilité et d’approbation du Ministère de l’Économie, soit environ 900 € nets pour 3 000 €.',
    tiers: [
      {
        name: 'Agents IA & automatisation',
        icon: 'ai',
        price: 'à partir de 3 000 €',
        desc: 'Agents, chatbots et automatisations, audités d’abord.',
        feats: ['Audit cadré d’abord', 'Développé et déployé', 'Vous en êtes propriétaire'],
        highlight: true,
      },
      {
        name: 'Site web & e-commerce',
        icon: 'growth',
        price: 'à partir de 3 000 €',
        desc: 'Sites et boutiques modernes sur Next.js.',
        feats: ['Design + développement', 'Multilingue & SEO', 'Stripe / réservations'],
      },
      {
        name: 'Développement Web3',
        icon: 'web3',
        price: 'à partir de 3 000 €',
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
    note: 'Le démarrage à 3 000 € correspond au coût éligible minimum du SME Package ; les projets éligibles vont de 3 000 € à 25 000 €, et le programme rembourse 70 %, sous réserve d’éligibilité et d’approbation du Ministère de l’Économie. Basé au Luxembourg, votre projet peut être cofinancé ; nous vous aidons avec les démarches.',
  },
  de: {
    lead: 'Projekte starten ab 3.000 €, zugeschnitten auf Ihr Projekt. Förderfähige Luxemburger KMU können es über das SME Package zu 70 % kofinanzieren, vorbehaltlich Förderfähigkeit und Genehmigung des Wirtschaftsministeriums, somit sind 3.000 € rund 900 € netto.',
    tiers: [
      {
        name: 'KI-Agenten & Automatisierung',
        icon: 'ai',
        price: 'ab 3.000 €',
        desc: 'Agenten, Chatbots und Automatisierungen, zuerst auditiert.',
        feats: ['Zuerst klares Audit', 'Gebaut und deployt', 'Es gehört Ihnen'],
        highlight: true,
      },
      {
        name: 'Website & E-Commerce',
        icon: 'growth',
        price: 'ab 3.000 €',
        desc: 'Moderne Websites und Shops mit Next.js.',
        feats: ['Design + Aufbau', 'Mehrsprachig & SEO', 'Stripe / Buchungen'],
      },
      {
        name: 'Web3-Entwicklung',
        icon: 'web3',
        price: 'ab 3.000 €',
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
    note: 'Der Start bei 3.000 € entspricht den förderfähigen Mindestkosten des SME Package; förderfähige Projekte reichen von 3.000 € bis 25.000 €, und das Programm erstattet 70 %, vorbehaltlich Förderfähigkeit und Genehmigung des Wirtschaftsministeriums. In Luxemburg ansässig? Ihr Projekt kann kofinanziert werden; wir helfen bei den Formalitäten.',
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
