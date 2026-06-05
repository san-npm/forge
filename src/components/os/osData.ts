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
}

export type WindowId =
  | 'welcome' | 'ai' | 'web3' | 'marketing'
  | 'work' | 'about' | 'contact'
  | 'pricing' | 'tools' | 'insights'
  | 'sketch' | 'snake';

export const STUDIO = {
  name: 'Openletz',
  tagline: 'Websites that think, move & transact.',
  sub: 'A Luxembourg AI agency.',
  welcomeLead:
    'We build AI that ships — custom agents, chatbots and workflow automation that save real time — plus the websites and growth to put them to work. EU-AI-Act- and GDPR-ready by design. (And when a product genuinely needs it, we build it on-chain too.) One accountable Luxembourg team, real shipped work, no slideware.',
  narrative:
    'We’re an AI agency first: we build AI agents, automation and AI-powered products for Luxembourg businesses, every tool vetted for GDPR and the EU AI Act. Web3 is a capability we reach for only when ownership, payments or token-gating make a product genuinely better — built and hosted in Europe. AI leads; on-chain follows when it earns its place.',
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
    kicker: 'What we do · 01 — our core',
    title: 'AI agents & automation',
    lead:
      'Custom AI agents, chatbots and automation for Luxembourg businesses — from a one-page audit to a working system in weeks. Useful, measured, and EU-AI-Act-ready. This is what we do best.',
    what: [
      { t: 'Custom AI agents & chatbots', d: 'RAG assistants, support/ops agents and copilots — multilingual (FR/EN/DE/LB), deployed not demoed.' },
      { t: 'Workflow automation', d: 'Document processing, lead scoring, CRM & ops pipelines — with time saved you can measure.' },
      { t: 'AI strategy & readiness audit', d: 'A scoped diagnostic that maps your highest-ROI automation first.' },
    ],
    how: ['Audit — one page, one week', 'Prototype — a working slice you can click', 'Ship & measure — in production with KPIs'],
    proof: 'Every tool we deploy is vetted for GDPR & the EU AI Act before it touches your data. We ship private AI assistants and agents — see LibertAI in the Work folder.',
    footer: 'Building with AI in Luxembourg? Your project may be co-funded up to 50% via Fit 4 AI — we handle the paperwork.',
  },
  web3: {
    kicker: 'What we do · 03 — when it helps',
    title: 'Web3 & On-Chain',
    lead:
      'A capability, not the headline. When a product is genuinely better with payments, ownership or token-gating built in, we also build it on-chain — and host it in Europe. dApps, smart contracts and token-gated experiences that actually ship.',
    what: [
      { t: 'dApp & smart-contract builds', d: 'Token-gating, mint mechanics, full on-chain apps and integrations — built and audit-minded.' },
      { t: 'Token-gated experiences', d: 'Memberships, paywalls and communities wired to wallets and on-chain rules.' },
      { t: 'European hosting & uptime', d: 'Run in Europe with managed operation and SLAs — no vendor lock-in.' },
    ],
    how: ['Scope & architecture', 'Build & audit-minded testing', 'Launch + managed run'],
    proof: 'We ship real on-chain products, not pitch decks — Greg, aleph-fileshare and Gategram are all in the Work folder. Hosting runs on Aleph Cloud.',
  },
  marketing: {
    kicker: 'What we do · 02',
    title: 'Digital & Growth',
    lead:
      'The layer that ties it together: high-performance websites, e-commerce and the growth engine that makes them pay off.',
    what: [
      { t: 'Websites & e-commerce', d: 'Fast, modern Next.js builds — like Vins Fins and La Grocerie.' },
      { t: 'SEO + answer-engine optimization', d: 'Found by Google and cited by AI assistants. Every signal is live on this site.' },
      { t: 'Content, paid & analytics', d: 'A growth loop with GA4 / Search Console and conversion tracking baked in.' },
    ],
    how: ['Position & design', 'Build & instrument', 'Grow & report'],
    proof: 'Want to audit our own answer-engine setup? It is all live, in public — and we run growth for live AI and Web3 products, including Aleph Cloud.',
  },
};

export interface WorkItem {
  name: string;
  kind: string;
  year: string;
  blurb: string;
  tags: string[];
}

export const WORK: WorkItem[] = [
  { name: 'Vins Fins', kind: 'E-commerce', year: '2026', blurb: 'Multilingual wine boutique & restaurant in the Grund — Stripe, VAT, shipping & bookings.', tags: ['Next.js', 'Stripe', 'i18n'] },
  { name: 'La Grocerie', kind: 'E-commerce', year: '2026', blurb: 'Farm-to-table grocery & natural-wine cellar with real-time stock and a light admin.', tags: ['Next.js', 'Stripe', 'KV'] },
  { name: 'Gategram', kind: 'Product', year: '2026', blurb: 'Sell digital content on Telegram with Stars — instant delivery, 95% creator earnings.', tags: ['Payments', 'Bots', 'Web3'] },
  { name: 'LibertAI', kind: 'AI product', year: '2026', blurb: 'Private AI assistants and agents you actually control.', tags: ['AI', 'Agents'] },
  { name: 'Greg', kind: 'Web3', year: '2026', blurb: 'Intent-based DEX aggregator for better on-chain swaps.', tags: ['Web3', 'DeFi'] },
  { name: 'aleph-fileshare', kind: 'App', year: '2026', blurb: 'Encrypted peer-to-peer file sharing — no account needed.', tags: ['Web3', 'Privacy'] },
];

export const ABOUT = {
  bioLead:
    'Openletz is the studio brand of Commit Media — a Luxembourg shop that designs, builds and grows AI and Web3 products. Strategy, design, engineering and marketing under one roof, with a bias for shipping. We treat AI and Web3 as complementary: build smart, go on-chain when it counts, host in Europe.',
  founderName: 'Clément Fermaud', // photo still TODO
  founderRole:
    'Founder & lead. Runs growth & marketing for live AI and Web3 products, including Aleph Cloud, and has shipped LibertAI, aleph-fileshare, Gategram and Greg.',
  facts: [
    'Based in Luxembourg, in the heart of the EU',
    'One accountable team — not an anonymous collective or an offshore template shop',
    'AI tooling vetted for GDPR + the EU AI Act, hosting kept in Europe',
  ],
  entity: 'Commit Media S.à r.l. · RCS B276192 · Luxembourg',
};

export const CONTACT = {
  lead: 'Tell us what you want to build. We reply within one business day.',
  types: ['AI automation', 'Web3 / on-chain', 'Website & growth', 'Not sure yet'],
  callLine: 'Prefer to talk? Book a 15-minute intro call.',
};

// window + desktop registry (apps launch from the Dock)
export const APPS: AppDef[] = [
  { id: 'welcome',   label: 'Read Me',     icon: 'mac',      desktop: { x: 40, y: 28 },  win: { w: 564, h: 516, x: 70,  y: 40 } },
  { id: 'ai',        label: 'AI',          icon: 'ai',       desktop: { x: 40, y: 28 },  win: { w: 490, h: 472, x: 116, y: 52 } },
  { id: 'marketing', label: 'Growth',      icon: 'growth',   desktop: { x: 40, y: 28 },  win: { w: 490, h: 472, x: 150, y: 68 } },
  { id: 'pricing',   label: 'Pricing',     icon: 'price',    desktop: { x: 40, y: 28 },  win: { w: 588, h: 492, x: 150, y: 56 } },
  { id: 'work',      label: 'Work',        icon: 'folder',   desktop: { x: 40, y: 28 },  win: { w: 588, h: 420, x: 150, y: 70 } },
  { id: 'tools',     label: 'AI Tools',    icon: 'tools',    desktop: { x: 40, y: 28 },  win: { w: 612, h: 452, x: 132, y: 60 } },
  { id: 'insights',  label: 'Insights',    icon: 'insights', desktop: { x: 40, y: 28 },  win: { w: 540, h: 452, x: 198, y: 78 } },
  { id: 'web3',      label: 'Web3',        icon: 'web3',     desktop: { x: 40, y: 28 },  win: { w: 490, h: 472, x: 184, y: 84 } },
  { id: 'about',     label: 'About',       icon: 'about',    desktop: { x: 40, y: 28 },  win: { w: 468, h: 424, x: 224, y: 62 } },
  { id: 'contact',   label: 'New Project', icon: 'mail',     desktop: { x: 40, y: 28 },  win: { w: 448, h: 480, x: 262, y: 46 } },
  // playful extras — live on the desktop, not the Dock
  { id: 'sketch',    label: 'Sketch',      icon: 'sketch',   desktopOnly: true, win: { w: 600, h: 470, x: 130, y: 48 } },
  { id: 'snake',     label: 'Snake',       icon: 'snake',    desktopOnly: true, win: { w: 412, h: 470, x: 320, y: 36 } },
];

/* ---------- Pricing ---------- */
export interface PriceTier { name: string; price: string; desc: string; feats: string[]; highlight?: boolean }
export const PRICING: { lead: string; tiers: PriceTier[]; note: string } = {
  lead: 'Clear starting points — every project gets a fixed quote. No sales-call gate, no surprises.',
  tiers: [
    { name: 'Website & e-commerce', price: 'from €900', desc: 'Fast, modern Next.js sites & shops.', feats: ['Design + build', 'Multilingual & SEO-ready', 'Stripe / bookings'], highlight: true },
    { name: 'AI automation', price: 'from €900', desc: 'Agents, chatbots & workflow automation.', feats: ['Scoped audit first', 'Built & deployed', 'EU-AI-Act compliant'], highlight: true },
    { name: 'Web3 build', price: 'scoped per project', desc: 'dApps, smart contracts & token-gating.', feats: ['Architecture & scope', 'Build & testing', 'Launch + managed run'] },
    { name: 'Care & hosting', price: 'from €90/mo', desc: 'Managed updates, monitoring & EU hosting.', feats: ['Proactive maintenance', 'Monitoring & backups', 'Priority support'] },
  ],
  note: 'AI projects in Luxembourg may be co-funded up to 50% via Fit 4 AI — we handle the paperwork.',
};

/* ---------- AI tools directory ---------- */
export interface Tool { name: string; cat: string; status: 'eu' | 'ok' | 'care'; note: string }
export const TOOLS: { lead: string; items: Tool[] } = {
  lead: 'The AI tools we actually deploy — rated for GDPR and the EU AI Act, and kept current as the rules change.',
  items: [
    { name: 'Mistral', cat: 'LLM', status: 'eu', note: 'EU-built & EU-hosted. Strongest data-residency story.' },
    { name: 'Claude', cat: 'LLM', status: 'ok', note: 'GDPR-ready with EU data options and an enterprise DPA.' },
    { name: 'ChatGPT / OpenAI', cat: 'LLM', status: 'ok', note: 'GDPR-ready with a DPA; configure data controls.' },
    { name: 'DeepL', cat: 'Translation', status: 'eu', note: 'German company, EU servers — excellent for Luxembourg.' },
    { name: 'n8n', cat: 'Automation', status: 'eu', note: 'Open-source and self-hostable inside the EU.' },
    { name: 'Perplexity', cat: 'Search', status: 'care', note: 'Useful, but review data handling per use-case.' },
    { name: 'Canva', cat: 'Design', status: 'care', note: 'Convenient; check EU data & AI-training settings.' },
    { name: 'Cursor', cat: 'Dev', status: 'ok', note: 'Great build speed; mind code and data privacy.' },
  ],
};

/* ---------- Insights ---------- */
export interface Article { title: string; tag: string; excerpt: string }
export const INSIGHTS: { lead: string; items: Article[] } = {
  lead: 'Notes from the studio — AI, Web3, and the EU rules that shape them.',
  items: [
    { title: 'Is Mistral GDPR-compliant? A 2026 guide', tag: 'AI · Compliance', excerpt: 'EU-built, EU-hosted — what that actually means for your data.' },
    { title: 'AI agents for Luxembourg SMEs, without the hype', tag: 'AI', excerpt: 'Where automation pays off first — and where it really doesn’t.' },
    { title: 'What the EU AI Act means for your chatbot', tag: 'Compliance', excerpt: 'A plain-language checklist to run before you ship.' },
    { title: 'Token-gating 101: memberships that actually work', tag: 'Web3', excerpt: 'Wallets, rules and a UX people don’t hate.' },
    { title: 'We shipped a dApp in 6 weeks. Here’s how.', tag: 'Web3 · Build', excerpt: 'Scope, architecture, and the parts that bit us.' },
  ],
};
