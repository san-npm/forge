import { AboutSchema, type About } from '@/lib/schema';

export type { About };

// Ported verbatim from src/components/os/osData.ts (ABOUT).
export const ABOUT: About = AboutSchema.parse({
  bioLead:
    'Openletz is the studio name of Commit Media — a small Luxembourg shop. I design, build and market AI and web products, usually end to end, with a trusted crew when a project needs more hands.',
  founderName: 'Clément Fermaud',
  founderRole:
    'Founder. I run marketing for Aleph Cloud, and I build my own products — LiberClaw, Gategram, Ophis and Skills.ws — alongside client work like Vins Fins and La Grocerie.',
  facts: [
    'Based in Luxembourg, in the EU',
    'You work with me directly — no account managers, no offshore handoff',
    'AI tools chosen with GDPR and the EU AI Act in mind; hosting in Europe',
  ],
  entity: 'Commit Media S.à r.l. · RCS B276192 · Luxembourg',
});
