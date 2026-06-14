import type { Section } from '@/lib/schema';
import { STUDIO } from '@/data/studio';
import { SERVICES } from '@/data/services';
import { WORK } from '@/data/work';
import { ABOUT } from '@/data/about';
import { CONTACT } from '@/data/contact';
import { PROOF_LOGOS, PROOF_METRICS } from '@/data/proof';
import { TESTIMONIALS } from '@/data/testimonials';

// The locked studio spine (spec §7). Order is significant; do not reorder.
// Built from the Phase-1 typed data modules; carries ONLY the per-variant props
// declared by the Section union in src/lib/schema.ts.
export const HOME_SECTIONS: Section[] = [
  {
    type: 'hero',
    h1: STUDIO.tagline,              // 'Websites that think, move & transact.'
    sub: STUDIO.sub,                 // 'A Luxembourg AI agency.'
    lead: STUDIO.welcomeLead,
    primaryCta: { label: 'Start a project', href: '#enquiry' },
    secondaryCta: { label: 'See our work', href: '/work' },
  },
  {
    type: 'proofStrip',
    label: 'Shipped & live',
    logos: PROOF_LOGOS,
    metrics: PROOF_METRICS,
  },
  {
    type: 'servicesGrid',
    // order significant: 01 ai (lead), 02 marketing (growth), 03 web3
    order: ['ai', 'marketing', 'web3'],
    ctaLabel: 'Start a project',
    ctaHref: '#enquiry',
  },
  {
    type: 'howWeWork',
    steps: SERVICES.ai.how,          // audit -> clickable prototype -> live with numbers
    smePackageNote: SERVICES.ai.footer ?? '',
    stickyScroll: false,             // GSAP set-piece deferred; stepped reveal at launch
  },
  {
    type: 'selectedWork',
    items: WORK,                     // 6, order significant
    viewAllHref: '/work',
  },
  {
    type: 'deeperProof',
    shippedCount: WORK.length,       // 6, defensible
    metrics: PROOF_METRICS,          // live signals; never fabricated
    testimonials: TESTIMONIALS,      // data-driven; empty until owner provides; empty-safe
  },
  {
    type: 'trustBlock',
    facts: ABOUT.facts,
    headline: 'European by default.',
  },
  {
    type: 'enquiryForm',
    id: 'enquiry',
    headline: CONTACT.lead,
    pillars: CONTACT.types,
    callLine: CONTACT.callLine,
    bookCallHref: '/contact',
  },
  // NOTE: no `footer` section; the footer is layout-level (<Footer/> in the
  // locale layout). The in-page spine ends at the closing enquiry form.
];
