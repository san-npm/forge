import { SITE_URL, siteConfig, localeUrl, type Locale } from '@/lib/site-config';

/**
 * Agency FAQ — sourced from public/llms-full.txt "Frequently asked questions".
 * Replaces the old grant-simulator FAQ. Consumed by faqJsonLd in the layout.
 */
export const AGENCY_FAQS: { q: string; a: string }[] = [
  {
    q: 'What is Openletz?',
    a: 'Openletz is a Luxembourg AI agency, the studio name of Commit Media S.à r.l. (RCS Luxembourg B276192), run by Clément Fermaud. We build AI agents, chatbots and automations, plus websites and growth, and Web3 when a product needs it.',
  },
  {
    q: 'What does Openletz do?',
    a: 'AI agents and automation (our core), digital and web marketing, and Web3 / on-chain builds when they help. AI tools are chosen with GDPR and the EU AI Act in mind; hosting is in Europe.',
  },
  {
    q: 'How much does it cost?',
    a: 'Projects start from €3,000, the SME Package minimum eligible cost, scoped and quoted per project. Eligible projects run from €3,000 to €25,000 and the programme reimburses 70%, subject to eligibility and Ministry of the Economy approval, so €3,000 is about €900 net. Larger or custom work is scoped per project.',
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
    a: 'Founder Clément Fermaud, in Luxembourg, through Commit Media S.à r.l. (RCS Luxembourg B276192). For years he has also contributed to the decentralized AI and Web3 ecosystem: LibertAI, LiberClaw and Aleph Cloud.',
  },
  {
    q: 'What languages do you work in?',
    a: 'English (primary), French and German.',
  },
  {
    q: 'What has Openletz built?',
    a: 'Own products: Gategram (Telegram-Stars content product), Ophis (intent-based DEX aggregator) and Skills.ws (marketplace of skills for AI coding assistants). Client builds: Vins Fins and La Grocerie (e-commerce). It has also contributed for years to LiberClaw, LibertAI and Aleph Cloud, which it does not own.',
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
      'Luxembourg AI agency. We build AI agents, chatbots and automation, the websites and shops around them, and Web3 when a product needs it, hosted in Europe.',
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
    name: `${siteConfig.brand.name} · Commit Media S.à r.l.`,
    url: SITE_URL,
    logo: siteConfig.brand.logoPng,
    description:
      'Luxembourg AI agency: AI agents and automation, websites, e-commerce and growth, plus Web3 / on-chain builds when they help.',
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
import type { BlogPost } from '@/lib/blog';
import type { CaseStudy } from '@/data/case-studies';

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

/** SME Package minimum eligible cost — the real "from" anchor in EUR. */
export const STARTING_PRICE_EUR = 3000;

/**
 * OfferCatalog node — all pricing tiers. @id anchored under /pricing.
 *
 * Productized tiers now start at a real anchor (the SME Package minimum eligible
 * cost, €3,000), so each "from €" tier emits a schema-valid lowPrice via a
 * UnitPriceSpecification with `minPrice`. The "Let's talk" / custom tier carries
 * no numeric price (it is genuinely scoped per project), so it stays figure-free.
 */
export function offerCatalogJsonLd(tiers: PriceTier[]): object {
  // A tier carries the numeric "from €3,000" anchor when its price string shows a
  // euro amount; the open-ended custom tier ("Let's talk") does not.
  const hasNumericAnchor = (price: string): boolean => /\d/.test(price) && /€|eur/i.test(price);
  return {
    '@context': 'https://schema.org',
    '@type': 'OfferCatalog',
    '@id': `${SITE_URL}/pricing#catalog`,
    name: 'Openletz packages',
    url: `${SITE_URL}/pricing`,
    provider: { '@id': `${SITE_URL}/#organization` },
    itemListElement: tiers.map((t) => ({
      '@type': 'Offer',
      name: t.name,
      description: t.desc,
      category: 'Service',
      ...(hasNumericAnchor(t.price)
        ? {
            priceCurrency: 'EUR',
            priceSpecification: {
              '@type': 'UnitPriceSpecification',
              priceCurrency: 'EUR',
              minPrice: STARTING_PRICE_EUR,
            },
          }
        : {}),
    })),
  };
}

// ---------------------------------------------------------------------------
// SEO/AEO additions: BlogPosting / Blog / Article (case study) builders
// ---------------------------------------------------------------------------

const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;
const DEFAULT_AUTHOR = 'Clément Fermaud';

/** Resolve a possibly-relative image path to an absolute openletz.ai URL. */
function absoluteImage(image?: string): string {
  if (!image) return DEFAULT_OG_IMAGE;
  if (/^https?:\/\//.test(image)) return image;
  return `${SITE_URL}${image.startsWith('/') ? '' : '/'}${image}`;
}

/** Locale-aware pick with EN fallback for `Partial<Record<Locale, string>>`. */
function localized(map: Partial<Record<Locale, string>>, locale: Locale): string {
  return map[locale] ?? map.en ?? '';
}

/**
 * BlogPosting node for a single insight post. `url` / `mainEntityOfPage` are the
 * locale-aware canonical post URL; `publisher` references the Organization node.
 */
export function blogPostingJsonLd(args: { post: BlogPost; locale: Locale; url: string }): object {
  const { post, locale, url } = args;
  const headline = localized(post.title, locale) || post.slug;
  const description = localized(post.metaDescription ?? {}, locale) || localized(post.excerpt, locale);
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline,
    description,
    datePublished: post.date,
    dateModified: post.date,
    author: { '@type': 'Person', name: post.author ?? DEFAULT_AUTHOR },
    publisher: { '@id': `${SITE_URL}/#organization` },
    image: absoluteImage(post.image),
    inLanguage: locale,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    url,
  };
}

/**
 * Blog node for the /insights listing, with a compact BlogPosting entry per post.
 * Titles are locale-aware; each entry's url is the canonical post URL.
 */
export function blogListingJsonLd(posts: BlogPost[], locale: Locale): object {
  const names: Record<Locale, string> = {
    en: 'Openletz Insights',
    fr: 'Openletz Insights',
    de: 'Openletz Insights',
  };
  return {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': `${localeUrl(locale, '/insights')}#blog`,
    name: names[locale],
    inLanguage: locale,
    publisher: { '@id': `${SITE_URL}/#organization` },
    blogPost: posts.map((post) => ({
      '@type': 'BlogPosting',
      headline: localized(post.title, locale) || post.slug,
      url: localeUrl(locale, `/insights/${post.slug}`),
      datePublished: post.date,
    })),
  };
}

/**
 * Article node for a case study. `headline` is the project name, `about` names
 * the project, author/publisher reference the Organization node, and `url` /
 * `mainEntityOfPage` are the canonical case-study URL. No invented dates.
 */
export function caseStudyJsonLd(args: {
  caseStudy: CaseStudy;
  locale: Locale;
  url: string;
  image?: string;
}): object {
  const { caseStudy, locale, url, image } = args;
  const description = caseStudy.result[0] ?? caseStudy.problem[0] ?? caseStudy.kicker;
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: caseStudy.title,
    description,
    about: caseStudy.title,
    author: { '@id': `${SITE_URL}/#organization` },
    publisher: { '@id': `${SITE_URL}/#organization` },
    image: absoluteImage(image),
    inLanguage: locale,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    url,
  };
}
