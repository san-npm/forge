import { SITE_URL, siteConfig, localeUrl, type Locale } from '@/lib/site-config';

/**
 * Agency FAQ — sourced from public/llms-full.txt "Frequently asked questions".
 * Replaces the old grant-simulator FAQ. Consumed by faqJsonLd in the layout.
 */
export const AGENCY_FAQS: { q: string; a: string }[] = [
  {
    q: 'What is Openletz?',
    a: 'Openletz is a Luxembourg AI agency — the studio name of Commit Media S.à r.l. (RCS Luxembourg B276192), run by Clément Fermaud. We build AI agents, chatbots and automations, plus websites and growth, and Web3 when a product needs it.',
  },
  {
    q: 'What does Openletz do?',
    a: 'AI agents and automation (our core), digital and web marketing, and Web3 / on-chain builds when they help. AI tools are chosen with GDPR and the EU AI Act in mind; hosting is in Europe.',
  },
  {
    q: 'How much does it cost?',
    a: 'Every project is quoted per scope, with a fixed quote up front. Productized tiers start from a published "from" price; custom work is scoped per project.',
  },
  {
    q: 'Can Luxembourg companies get funding?',
    a: 'Yes. Projects in Luxembourg may be co-funded through the SME Package. Openletz can advise on scoping a project to fit the programme.',
  },
  {
    q: 'Is the AI work EU AI Act compliant?',
    a: 'AI builds are designed to be EU AI Act-compliant, with GDPR-aware data handling.',
  },
  {
    q: 'Who runs Openletz and where is it based?',
    a: 'Founder Clément Fermaud, in Luxembourg, through Commit Media S.à r.l. (RCS Luxembourg B276192). He also runs marketing for Aleph Cloud.',
  },
  {
    q: 'What languages do you work in?',
    a: 'English (primary), French and German.',
  },
  {
    q: 'What has Openletz shipped?',
    a: 'Vins Fins and La Grocerie (e-commerce), Gategram (Telegram-Stars content product), LiberClaw (personal AI assistant), Ophis (intent-based DEX aggregator), and Skills.ws (marketplace of skills for AI coding assistants).',
  },
];

const KNOWS_ABOUT = [
  'Artificial intelligence',
  'AI automation',
  'AI agents',
  'Web3 development',
  'Smart contracts',
  'Web development',
  'E-commerce',
  'Digital marketing',
  'SEO',
];

/** Organization node — KEEP. @id `${SITE_URL}/#organization`. */
export function organizationJsonLd(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: siteConfig.brand.name,
    legalName: siteConfig.brand.legalEntity,
    url: SITE_URL,
    logo: siteConfig.brand.logoPng,
    description:
      'Luxembourg AI agency. We build AI agents, chatbots and automation, the websites and shops around them, and Web3 when a product needs it — hosted in Europe.',
    email: siteConfig.brand.email,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Luxembourg',
      addressCountry: 'LU',
    },
    areaServed: [
      { '@type': 'Country', name: 'Luxembourg' },
      { '@type': 'AdministrativeArea', name: 'Grande Région' },
    ],
    sameAs: [siteConfig.brand.linkedin],
    knowsAbout: KNOWS_ABOUT,
  };
}

/** ProfessionalService (local business) node — KEEP. @id `${SITE_URL}/#localbusiness`. */
export function professionalServiceJsonLd(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${SITE_URL}/#localbusiness`,
    name: `${siteConfig.brand.name} — Commit Media S.à r.l.`,
    url: SITE_URL,
    logo: siteConfig.brand.logoPng,
    description:
      'Luxembourg AI agency — AI agents and automation, websites, e-commerce and growth, plus Web3 / on-chain builds when they help.',
    email: siteConfig.brand.email,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Luxembourg',
      addressRegion: 'Luxembourg',
      addressCountry: 'LU',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 49.6117,
      longitude: 6.13,
    },
    areaServed: [
      { '@type': 'Country', name: 'Luxembourg' },
      { '@type': 'AdministrativeArea', name: 'Grande Région' },
    ],
    priceRange: '€€',
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '18:00',
    },
    sameAs: [siteConfig.brand.linkedin],
  };
}

/** WebSite node — REPLACES the dropped WebApplication "Simulateur". @id `${SITE_URL}/#website`. */
export function webSiteJsonLd(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: siteConfig.brand.name,
    url: SITE_URL,
    inLanguage: ['en', 'fr', 'de'],
    publisher: { '@id': `${SITE_URL}/#organization` },
  };
}

/** BreadcrumbList node — KEEP. */
export function breadcrumbJsonLd(_locale: Locale, items: { name: string; url: string }[]): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/** FAQPage node — KEEP. Content = agency FAQs (AGENCY_FAQS), NOT grants. */
export function faqJsonLd(faqs: { q: string; a: string }[]): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

/** Home breadcrumb label per locale (helper for the layout). */
export function homeBreadcrumbLabel(locale: Locale): string {
  if (locale === 'fr') return 'Accueil';
  if (locale === 'de') return 'Startseite';
  return 'Home';
}

// re-export so the layout can build the home crumb URL in one import
export { localeUrl };

// ---------------------------------------------------------------------------
// Phase-3 additions: per-page Service / Offer builders
// ---------------------------------------------------------------------------
import type { ServiceKey, ServiceData, PriceTier } from '@/lib/schema';

/** Parse a 'from €1,500' / 'from €X' price string into a numeric minimum, or null. */
function parseFromPrice(price: string): number | null {
  const m = price.replace(/[\s,]/g, '').match(/(\d+(?:\.\d+)?)/);
  return m ? Number(m[1]) : null;
}

/** Service node — one per pillar. @id anchored under /services. */
export function serviceJsonLd(key: ServiceKey, data: ServiceData): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${SITE_URL}/services#${key}`,
    name: data.title,
    serviceType: data.kicker,
    description: data.lead,
    provider: { '@id': `${SITE_URL}/#organization` },
    areaServed: { '@type': 'Country', name: 'Luxembourg' },
    url: `${SITE_URL}/services`,
  };
}

/** OfferCatalog node — all pricing tiers. @id anchored under /pricing. */
export function offerCatalogJsonLd(tiers: PriceTier[]): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'OfferCatalog',
    '@id': `${SITE_URL}/pricing#catalog`,
    name: 'Openletz packages',
    url: `${SITE_URL}/pricing`,
    provider: { '@id': `${SITE_URL}/#organization` },
    itemListElement: tiers.map((t) => {
      const min = parseFromPrice(t.price);
      return {
        '@type': 'Offer',
        name: t.name,
        description: t.desc,
        priceSpecification: {
          '@type': 'PriceSpecification',
          priceCurrency: 'EUR',
          ...(min !== null ? { minPrice: min, price: min } : {}),
        },
      };
    }),
  };
}
