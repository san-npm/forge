import type { Section } from '@/lib/schema';
import type { Locale } from '@/lib/site-config';
import { getStudio } from '@/data/studio';
import { getServices } from '@/data/services';
import { getWork } from '@/data/work';
import { getAbout } from '@/data/about';
import { getContact } from '@/data/contact';
import { PROOF_LOGOS, getProofMetrics } from '@/data/proof';
import { TESTIMONIALS } from '@/data/testimonials';
import { getUiStrings } from '@/data/ui';
import { getStartProject } from '@/data/nav';

// The locked studio spine (spec §7). Order is significant; do not reorder.
// Built per-locale from the typed data modules; carries ONLY the per-variant
// props declared by the Section union in src/lib/schema.ts.
export function getHomeSections(locale: Locale): Section[] {
  const studio = getStudio(locale);
  const services = getServices(locale);
  const work = getWork(locale);
  const about = getAbout(locale);
  const contact = getContact(locale);
  const ui = getUiStrings(locale);
  const metrics = getProofMetrics(locale);
  const startProject = getStartProject(locale);

  return [
    {
      type: 'hero',
      h1: studio.tagline,
      sub: studio.sub,
      lead: studio.welcomeLead,
      primaryCta: { label: startProject, href: '#enquiry' },
      secondaryCta: { label: ui.common.seeOurWork, href: '/work' },
    },
    {
      type: 'proofStrip',
      label: ui.sections.proofStripLabel,
      logos: PROOF_LOGOS,
      metrics,
    },
    {
      type: 'servicesGrid',
      // order significant: 01 ai (lead), 02 marketing (growth), 03 web3
      order: ['ai', 'marketing', 'web3'],
      ctaLabel: startProject,
      ctaHref: '#enquiry',
    },
    {
      type: 'howWeWork',
      steps: services.ai.how, // audit -> clickable prototype -> live with numbers
      smePackageNote: services.ai.footer ?? '',
      stickyScroll: false,
    },
    {
      type: 'selectedWork',
      items: work, // 6 products + the Aleph Cloud marketing card; order significant
      viewAllHref: '/work',
    },
    {
      type: 'deeperProof',
      // Honest shipped-PRODUCT count: marketing engagements (Aleph Cloud) are a
      // credential, not a product, so they are excluded from this number.
      shippedCount: work.filter((w) => w.tag !== 'marketing').length,
      metrics, // founder-operator proof; never fabricated
      testimonials: TESTIMONIALS, // data-driven; empty until owner provides; empty-safe
    },
    {
      type: 'trustBlock',
      facts: about.facts,
      headline: ui.sections.trustHeadline,
    },
    {
      type: 'enquiryForm',
      id: 'enquiry',
      headline: contact.lead,
      pillars: contact.types,
      callLine: contact.callLine,
      bookCallHref: '/contact',
    },
    // NOTE: no `footer` section; the footer is layout-level (<Footer/> in the
    // locale layout). The in-page spine ends at the closing enquiry form.
  ];
}

// EN constant kept for the home-sections + CWV tests (single source of truth for
// the EN homepage). EN sections equal getHomeSections('en') by construction.
export const HOME_SECTIONS: Section[] = getHomeSections('en');
