// Case-study essays. Structure is complete; metrics/testimonial flagged
// `placeholder: true` stay until the owner supplies real numbers (spec §12.3).

export interface CaseStudyMetric {
  label: string;
  value: string; // 'TBD' while placeholder
  placeholder: boolean;
}

export interface CaseStudy {
  slug: 'vinsfins' | 'lagrocerie';
  title: string;
  kicker: string;
  problem: string[];
  process: string[];
  result: string[];
  metrics: CaseStudyMetric[];
  testimonial?: { quote: string; name: string; role: string; company: string; placeholder: boolean };
}

export const CASE_STUDIES: Record<'vinsfins' | 'lagrocerie', CaseStudy> = {
  vinsfins: {
    slug: 'vinsfins',
    title: 'Vins Fins',
    kicker: 'E-commerce · multilingual wine shop',
    problem: [
      "Vins Fins, a wine bar and restaurant in Luxembourg's Grund, had no way to sell its hundreds of wines online and needed bookings handled in four languages.",
      'The catalogue had to handle Luxembourg VAT and POST Luxembourg shipping without a heavy back-office.',
    ],
    process: [
      'Designed and built the storefront on Next.js, with a light admin the team can actually run.',
      'Wired Stripe checkout with Luxembourg VAT, POST Luxembourg shipping rates, and Zenchef bookings.',
      'Shipped in FR / EN / DE / LB from a single content model.',
    ],
    result: [
      'A fast, multilingual shop and booking site live at vinsfins.lu.',
      'The team manages wines and orders themselves through the light admin.',
    ],
    metrics: [
      { label: 'Languages', value: '4', placeholder: false },
      { label: 'Lighthouse performance', value: 'TBD', placeholder: true },
      { label: 'Time to launch', value: 'TBD', placeholder: true },
      { label: 'Catalogue size', value: 'TBD', placeholder: true },
    ],
    testimonial: {
      quote: 'TBD — owner to provide.',
      name: 'TBD',
      role: 'TBD',
      company: 'Vins Fins',
      placeholder: true,
    },
  },
  lagrocerie: {
    slug: 'lagrocerie',
    title: 'La Grocerie',
    kicker: 'E-commerce · farm-to-table grocery & natural wine',
    problem: [
      'La Grocerie, a sister shop to Vins Fins, needed a grocery and natural-wine store sourcing from short-supply-chain producers.',
      'It had to share infrastructure with Vins Fins (Stripe, stock) while staying its own brand.',
    ],
    process: [
      'Built the shop on the same Next.js stack as Vins Fins, sharing the Stripe account and stock KV.',
      'Added real-time stock management and a lightweight admin the team uses daily.',
    ],
    result: [
      'A grocery and natural-wine cellar live at lagrocerie.lu.',
      'Shared infrastructure with Vins Fins keeps operations simple for one small team.',
    ],
    metrics: [
      { label: 'Shared stack', value: 'Vins Fins', placeholder: false },
      { label: 'Lighthouse performance', value: 'TBD', placeholder: true },
      { label: 'Time to launch', value: 'TBD', placeholder: true },
      { label: 'Catalogue size', value: 'TBD', placeholder: true },
    ],
    testimonial: {
      quote: 'TBD — owner to provide.',
      name: 'TBD',
      role: 'TBD',
      company: 'La Grocerie',
      placeholder: true,
    },
  },
};

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return (CASE_STUDIES as Record<string, CaseStudy>)[slug];
}
