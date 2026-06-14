import { WorkSchema, type WorkItem } from '@/lib/schema';

export type { WorkItem };

// Ported verbatim from src/components/os/osData.ts (WORK), plus the Aleph Cloud
// marketing credential. Order is significant. `tag` is ADDED for the /work
// filter and mapped from `kind`:
//   E-commerce -> 'web'
//   Our product (Gategram = Telegram paywall) -> 'web'
//   AI assistant -> 'ai'
//   Web3 / DeFi -> 'web3'
//   Our product (Skills.ws = AI tooling marketplace) -> 'ai'
//   Growth & marketing (Aleph Cloud = a client we market, NOT a product) -> 'marketing'
export const WORK: WorkItem[] = WorkSchema.parse([
  {
    slug: 'vinsfins',
    name: 'Vins Fins',
    kind: 'E-commerce',
    link: 'https://www.vinsfins.lu',
    blurb: 'A multilingual wine shop & restaurant in the Grund.',
    about:
      "Vins Fins is a wine bar and restaurant in Luxembourg's Grund. We built their online shop and booking site: hundreds of wines, four languages, and a checkout that handles Luxembourg VAT and shipping.",
    did: [
      'Designed and built the site on Next.js',
      'Stripe checkout with Luxembourg VAT',
      'POST Luxembourg shipping + Zenchef bookings',
      'FR / EN / DE / LB, with a light admin',
    ],
    stack: ['Next.js', 'Stripe', 'Vercel'],
    tag: 'web',
  },
  {
    slug: 'lagrocerie',
    name: 'La Grocerie',
    kind: 'E-commerce',
    link: 'https://www.lagrocerie.lu',
    blurb: 'Farm-to-table grocery & natural-wine cellar.',
    about:
      'A sister shop to Vins Fins: a grocery and natural-wine cellar in the Grund, sourcing from short-supply-chain producers. We built the shop, the stock system, and a simple admin the team actually uses.',
    did: [
      'E-commerce on the same stack as Vins Fins',
      'Real-time stock management',
      'Stripe checkout',
      'A lightweight admin',
    ],
    stack: ['Next.js', 'Stripe', 'Vercel KV'],
    tag: 'web',
  },
  {
    slug: 'gategram',
    name: 'Gategram',
    kind: 'Our product',
    link: 'https://gategram.app',
    blurb: 'Sell digital content on Telegram, paid in Stars.',
    about:
      'Our own product: a way for creators to sell digital content inside Telegram and get paid in Stars, with instant delivery, and the creator keeps 95%. Open source.',
    did: [
      'Designed and built the product end to end',
      'Telegram bot + Stars payments',
      'Instant delivery, 95% to the creator',
      'Open-sourced it',
    ],
    stack: ['Telegram', 'Payments', 'Next.js'],
    tag: 'web',
  },
  {
    slug: 'liberclaw',
    name: 'LiberClaw',
    kind: 'AI assistant',
    link: 'https://liberclaw.ai',
    blurb: 'A personal AI assistant you actually control.',
    about:
      'LiberClaw is a personal AI assistant for email, calendar, notes and more, wired into your own accounts. We work on its skills and on how it gets real things done for you.',
    did: [
      'Built assistant skills for email, calendar and notes',
      'Wired them into real accounts',
      'Kept privacy and control front and centre',
    ],
    stack: ['AI agents', 'Skills', 'TypeScript'],
    tag: 'ai',
  },
  {
    slug: 'ophis',
    name: 'Ophis',
    kind: 'Web3 / DeFi',
    link: 'https://ophis.fi',
    blurb: 'An intent-based DEX aggregator for better swaps.',
    about:
      'Ophis is a DEX aggregator: you say what you want, it finds the best way to swap on-chain and protects you from MEV. We handle the product, the brand and the front-end.',
    did: [
      'Product, brand and front-end',
      'Intent-based swap flow',
      'MEV-protected execution + receipts',
    ],
    stack: ['Web3', 'DeFi', 'React'],
    tag: 'web3',
  },
  {
    slug: 'skillsws',
    name: 'Skills.ws',
    kind: 'Our product',
    link: 'https://www.skills.ws',
    blurb: 'A marketplace of skills for AI coding assistants.',
    about:
      'Our own product: a marketplace of ready-made skills for AI coding assistants like Claude Code, Cursor and Codex. Browse, install, and make your assistant better at real work.',
    did: [
      'Designed and built the marketplace',
      '85+ agent skills, browsable and installable',
      'Also shipped as an npm CLI',
    ],
    stack: ['Next.js', 'Vercel', 'npm'],
    tag: 'ai',
  },
  {
    slug: 'alephcloud',
    name: 'Aleph Cloud',
    // A marketing engagement, NOT a product we built. The kind makes that explicit.
    kind: 'Growth & marketing',
    link: 'https://aleph.cloud',
    blurb: 'Brand, content and growth marketing for the decentralized AI and Web3 cloud.',
    about:
      'A multi-year marketing engagement, not a product we built. We run brand, content and growth marketing for Aleph Cloud, the decentralized cloud for AI and Web3: positioning, written and visual content, and the campaigns that bring developers and projects on board.',
    did: [
      'Brand, content and growth marketing as the engaged partner',
      'Positioning and messaging for a technical, developer audience',
      'Written and visual content across channels',
    ],
    stack: ['Brand', 'Content', 'Growth'],
    tag: 'marketing',
  },
]);
