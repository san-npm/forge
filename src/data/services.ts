import { ServicesSchema, type ServiceData, type ServiceKey } from '@/lib/schema';

export type { ServiceData, ServiceKey };

// Ported verbatim from src/components/os/osData.ts (SERVICES). Keys keep the
// 'ai' | 'web3' | 'marketing' shape; the marketing kicker reads "Growth".
export const SERVICES = ServicesSchema.parse({
  ai: {
    kicker: 'What we do · AI',
    title: 'AI agents & automation',
    lead:
      'This is the core of what we do. We build AI agents, chatbots and automations for businesses in Luxembourg — from a quick audit to something running in production, usually in a few weeks.',
    what: [
      {
        t: 'Agents & chatbots',
        d: 'Assistants that answer questions, handle support and do back-office work — in French, English, German or Luxembourgish.',
      },
      {
        t: 'Automations',
        d: 'The repetitive stuff — documents, leads, CRM, ops — handled, with the time saved you can actually measure.',
      },
      {
        t: 'Where to start',
        d: 'A short audit that finds the one or two things worth automating first.',
      },
    ],
    how: ['A quick audit', 'A working prototype you can click', 'Live, with numbers to show it works'],
    proof:
      "We pick tools with GDPR and the EU AI Act in mind. LiberClaw, a personal AI assistant, is one of our own — it's in the Work folder.",
    footer:
      "In Luxembourg? Your project may be co-funded through the SME Package — we'll help with the paperwork.",
  },
  web3: {
    kicker: 'What we do · Web3',
    title: 'Web3 & On-Chain',
    lead:
      "Not the headline — a tool we reach for when it helps. If a product is better with payments, ownership or token-gating built in, we'll build it on-chain and host it in Europe.",
    what: [
      {
        t: 'Apps & smart contracts',
        d: 'Token-gating, mints and full on-chain apps — built carefully, with audits in mind.',
      },
      { t: 'Token-gated access', d: 'Memberships, paywalls and communities tied to a wallet.' },
      { t: 'European hosting', d: 'Run in Europe, no lock-in.' },
    ],
    how: ['Scope & architecture', 'Build & careful testing', 'Launch + support'],
    proof:
      'We ship real on-chain products, not decks — Ophis (a DEX aggregator) and Gategram are both in the Work folder.',
  },
  marketing: {
    kicker: 'What we do · Growth',
    title: 'Digital & Growth',
    lead: 'The websites and shops that carry it all — and the marketing to get them seen.',
    what: [
      {
        t: 'Websites & shops',
        d: 'Fast, modern builds on Next.js — like Vins Fins and La Grocerie.',
      },
      {
        t: 'Getting found',
        d: "SEO, plus the newer game of being cited by AI assistants. It's all live on this very site.",
      },
      {
        t: 'Content & analytics',
        d: 'A simple loop — publish, measure, improve — with GA4 and Search Console wired in.',
      },
    ],
    how: ['Position & design', 'Build & instrument', 'Grow & report'],
    proof: 'We also run marketing for live products, including Aleph Cloud.',
  },
}) as Record<ServiceKey, ServiceData>;
