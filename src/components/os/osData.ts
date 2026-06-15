// Openletz OS — content model. Copy is intentionally AI-front-door, outcome-led,
// and free of "decentralization" rhetoric. Founder identity is a placeholder
// pending confirmation (see [Founder] below).

export type IconKey =
  | 'mac' | 'ai' | 'web3' | 'growth' | 'folder'
  | 'about' | 'mail' | 'doc' | 'drive' | 'disk'
  | 'price' | 'tools' | 'insights'
  | 'sketch' | 'snake';

export interface AppDef {
  id: WindowId;
  label: string;
  icon: IconKey;
  desktop?: { x: number; y: number };
  win: { w: number; h: number; x: number; y: number };
  desktopOnly?: boolean; // shown as a desktop icon, not in the Dock
  hidden?: boolean;      // not in the Dock or on the desktop (opened programmatically)
}

export type WindowId =
  | 'welcome' | 'ai' | 'web3' | 'marketing'
  | 'work' | 'about' | 'contact'
  | 'pricing' | 'project'
  | 'sketch' | 'snake';

export const STUDIO = {
  name: 'Openletz',
  tagline: 'Websites that think, move & transact.',
  sub: 'A Luxembourg AI agency.',
  welcomeLead:
    'We’re a small Luxembourg studio. We build AI agents, chatbots and automations that actually save time — and the websites and shops around them. When a project needs blockchain, we build that too. Everything runs in Europe, and it’s yours to keep.',
  hint: 'Double-click an icon to see what we do — or hit “New Project” to start.',
};

export interface ServiceData {
  kicker: string;
  title: string;
  lead: string;
  what: { t: string; d: string }[];
  how: string[];
  proof: string;
  footer?: string;
}

export const SERVICES: Record<'ai' | 'web3' | 'marketing', ServiceData> = {
  ai: {
    kicker: 'What we do · AI',
    title: 'AI agents & automation',
    lead:
      'This is the core of what we do. We build AI agents, chatbots and automations for businesses in Luxembourg — from a quick audit to something running in production, usually in a few weeks.',
    what: [
      { t: 'Agents & chatbots', d: 'Assistants that answer questions, handle support and do back-office work — in French, English, German or Luxembourgish.' },
      { t: 'Automations', d: 'The repetitive stuff — documents, leads, CRM, ops — handled, with the time saved you can actually measure.' },
      { t: 'Where to start', d: 'A short audit that finds the one or two things worth automating first.' },
    ],
    how: ['A quick audit', 'A working prototype you can click', 'Live, with numbers to show it works'],
    proof: 'We pick tools with GDPR and the EU AI Act in mind. Skills.ws, our marketplace for AI coding assistants, is one of our own, and we have contributed for years to LiberClaw, a personal AI agent platform. Both are in the Work folder.',
    footer: 'In Luxembourg? Your project may be co-funded through the SME Package — we’ll help with the paperwork.',
  },
  web3: {
    kicker: 'What we do · Web3',
    title: 'Web3 & On-Chain',
    lead:
      'Not the headline — a tool we reach for when it helps. If a product is better with payments, ownership or token-gating built in, we’ll build it on-chain and host it in Europe.',
    what: [
      { t: 'Apps & smart contracts', d: 'Token-gating, mints and full on-chain apps — built carefully, with audits in mind.' },
      { t: 'Token-gated access', d: 'Memberships, paywalls and communities tied to a wallet.' },
      { t: 'European hosting', d: 'Run in Europe, no lock-in.' },
    ],
    how: ['Scope & architecture', 'Build & careful testing', 'Launch + support'],
    proof: 'We ship real on-chain products, not decks — Ophis (a DEX aggregator) and Gategram are both in the Work folder.',
  },
  marketing: {
    kicker: 'What we do · Growth',
    title: 'Digital & Growth',
    lead:
      'The websites and shops that carry it all — and the marketing to get them seen.',
    what: [
      { t: 'Websites & shops', d: 'Fast, modern builds on Next.js — like Vins Fins and La Grocerie.' },
      { t: 'Getting found', d: 'SEO, plus the newer game of being cited by AI assistants. It’s all live on this very site.' },
      { t: 'Content & analytics', d: 'A simple loop — publish, measure, improve — with GA4 and Search Console wired in.' },
    ],
    how: ['Position & design', 'Build & instrument', 'Grow & report'],
    proof: 'We also run marketing for live products, including Aleph Cloud.',
  },
};

export interface WorkItem {
  slug: string;
  name: string;
  kind: string;
  link: string;
  blurb: string;     // one line, for the Finder list
  about: string;     // longer, for the detail window
  did: string[];     // what we did
  stack: string[];
}

export const WORK: WorkItem[] = [
  {
    slug: 'vinsfins', name: 'Vins Fins', kind: 'E-commerce', link: 'https://www.vinsfins.lu',
    blurb: 'A multilingual wine shop & restaurant in the Grund.',
    about: 'Vins Fins is a wine bar and restaurant in Luxembourg’s Grund. We built their online shop and booking site — hundreds of wines, four languages, and a checkout that handles Luxembourg VAT and shipping.',
    did: ['Designed and built the site on Next.js', 'Stripe checkout with Luxembourg VAT', 'POST Luxembourg shipping + Zenchef bookings', 'FR / EN / DE / LB, with a light admin'],
    stack: ['Next.js', 'Stripe', 'Vercel'],
  },
  {
    slug: 'lagrocerie', name: 'La Grocerie', kind: 'E-commerce', link: 'https://www.lagrocerie.lu',
    blurb: 'Farm-to-table grocery & natural-wine cellar.',
    about: 'A sister shop to Vins Fins: a grocery and natural-wine cellar in the Grund, sourcing from short-supply-chain producers. We built the shop, the stock system, and a simple admin the team actually uses.',
    did: ['E-commerce on the same stack as Vins Fins', 'Real-time stock management', 'Stripe checkout', 'A lightweight admin'],
    stack: ['Next.js', 'Stripe', 'Vercel KV'],
  },
  {
    slug: 'gategram', name: 'Gategram', kind: 'Our product', link: 'https://gategram.app',
    blurb: 'Sell digital content on Telegram, paid in Stars.',
    about: 'Our own product: a way for creators to sell digital content inside Telegram and get paid in Stars — instant delivery, and the creator keeps 95%. Open source.',
    did: ['Designed and built the product end to end', 'Telegram bot + Stars payments', 'Instant delivery, 95% to the creator', 'Open-sourced it'],
    stack: ['Telegram', 'Payments', 'Next.js'],
  },
  {
    slug: 'liberclaw', name: 'LiberClaw', kind: 'AI assistant', link: 'https://liberclaw.ai',
    blurb: 'A personal AI assistant you actually control.',
    about: 'LiberClaw is a personal AI assistant — email, calendar, notes and more, wired into your own accounts. We work on its skills and on how it gets real things done for you.',
    did: ['Built assistant skills for email, calendar and notes', 'Wired them into real accounts', 'Kept privacy and control front and centre'],
    stack: ['AI agents', 'Skills', 'TypeScript'],
  },
  {
    slug: 'ophis', name: 'Ophis', kind: 'Web3 / DeFi', link: 'https://ophis.fi',
    blurb: 'An intent-based DEX aggregator for better swaps.',
    about: 'Ophis is a DEX aggregator — you say what you want, it finds the best way to swap on-chain and protects you from MEV. We handle the product, the brand and the front-end.',
    did: ['Product, brand and front-end', 'Intent-based swap flow', 'MEV-protected execution + receipts'],
    stack: ['Web3', 'DeFi', 'React'],
  },
  {
    slug: 'skillsws', name: 'Skills.ws', kind: 'Our product', link: 'https://www.skills.ws',
    blurb: 'A marketplace of skills for AI coding assistants.',
    about: 'Our own product: a marketplace of ready-made skills for AI coding assistants like Claude Code, Cursor and Codex. Browse, install, and make your assistant better at real work.',
    did: ['Designed and built the marketplace', '85+ agent skills, browsable and installable', 'Also shipped as an npm CLI'],
    stack: ['Next.js', 'Vercel', 'npm'],
  },
];

export const ABOUT = {
  bioLead:
    'Openletz is the studio name of Commit Media — a small Luxembourg shop. I design, build and market AI and web products, usually end to end, with a trusted crew when a project needs more hands.',
  founderName: 'Clément Fermaud', // photo still TODO
  founderRole:
    'Founder. I build my own products (Gategram, Ophis and Skills.ws) and do client work like Vins Fins and La Grocerie. For years I have also contributed to the decentralized AI and Web3 ecosystem: LibertAI, LiberClaw and Aleph Cloud.',
  facts: [
    'Based in Luxembourg, in the EU',
    'You work with me directly — no account managers, no offshore handoff',
    'AI tools chosen with GDPR and the EU AI Act in mind; hosting in Europe',
  ],
  entity: 'Commit Media S.à r.l. · RCS B276192 · Luxembourg',
};

export const CONTACT = {
  lead: 'Tell us what you want to build. We reply within one business day.',
  types: ['AI automation', 'Web3 / on-chain', 'Website & growth', 'Not sure yet'],
  callLine: 'Prefer to talk? Book a 15-minute intro call.',
};

// window registry — apps launch from the Dock unless marked otherwise
export const APPS: AppDef[] = [
  { id: 'welcome',   label: 'Read Me',     icon: 'mac',    win: { w: 564, h: 516, x: 70,  y: 40 } },
  { id: 'ai',        label: 'AI',          icon: 'ai',     win: { w: 492, h: 480, x: 116, y: 52 } },
  { id: 'marketing', label: 'Growth',      icon: 'growth', win: { w: 492, h: 472, x: 150, y: 68 } },
  { id: 'pricing',   label: 'Pricing',     icon: 'price',  win: { w: 600, h: 500, x: 150, y: 56 } },
  { id: 'work',      label: 'Work',        icon: 'folder', win: { w: 600, h: 458, x: 150, y: 70 } },
  { id: 'web3',      label: 'Web3',        icon: 'web3',   win: { w: 492, h: 460, x: 184, y: 84 } },
  { id: 'about',     label: 'About',       icon: 'about',  win: { w: 484, h: 446, x: 224, y: 62 } },
  { id: 'contact',   label: 'New Project', icon: 'mail',   win: { w: 448, h: 480, x: 262, y: 46 } },
  // project detail — opened from Work, hidden from the Dock
  { id: 'project',   label: 'Project',     icon: 'doc',    hidden: true, win: { w: 560, h: 520, x: 0, y: 0 } },
  // playful extras — on the desktop, not the Dock
  { id: 'sketch',    label: 'Sketch',      icon: 'sketch', desktopOnly: true, win: { w: 600, h: 470, x: 130, y: 48 } },
  { id: 'snake',     label: 'Snake',       icon: 'snake',  desktopOnly: true, win: { w: 412, h: 470, x: 320, y: 36 } },
];

/* ---------- Pricing ---------- */
export interface PriceTier { name: string; icon: IconKey; price: string; desc: string; feats: string[]; highlight?: boolean }
export const PRICING: { lead: string; tiers: PriceTier[]; note: string } = {
  lead: 'Every project gets a fixed quote up front. Here’s the shape of what we do.',
  tiers: [
    { name: 'AI agents & automation', icon: 'ai', price: 'On request', desc: 'Agents, chatbots and automations.', feats: ['Scoped audit first', 'Built and deployed', 'You own it'], highlight: true },
    { name: 'Website & e-commerce', icon: 'growth', price: 'On request', desc: 'Modern sites and shops on Next.js.', feats: ['Design + build', 'Multilingual & SEO', 'Stripe / bookings'], highlight: true },
    { name: 'Web3 build', icon: 'web3', price: 'On request', desc: 'Smart contracts and on-chain apps.', feats: ['Scope & architecture', 'Build & testing', 'Launch + support'] },
    { name: 'Care & hosting', icon: 'tools', price: 'On request', desc: 'Updates, monitoring and EU hosting.', feats: ['Maintenance', 'Monitoring & backups', 'Direct support'] },
  ],
  note: 'Based in Luxembourg, your project may be co-funded through the SME Package — we help with the paperwork.',
};
