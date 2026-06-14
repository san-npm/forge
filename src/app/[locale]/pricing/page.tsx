import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { LOCALES, type Locale, localeUrl } from '@/lib/site-config';
import { PRICING } from '@/data/pricing';
import { START_PROJECT } from '@/data/nav';
import { offerCatalogJsonLd, breadcrumbJsonLd, faqJsonLd } from '@/lib/jsonld';
import { safeJsonLd } from '@/lib/safeJsonLd';

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: 'Pricing · Openletz',
  description:
    'Productized starting prices for AI automation, websites and Web3 builds. Fixed quote up front.',
  alternates: { canonical: localeUrl('en', '/pricing') },
};

const PRICING_FAQS = [
  {
    q: 'Why do you publish "from" prices?',
    a: 'So you can self-qualify before we talk. Every project still gets a fixed quote up front.',
  },
  {
    q: 'Can my project be co-funded?',
    a: 'If you are based in Luxembourg, it may be co-funded through the SME Package, and we help with the paperwork.',
  },
];

export default async function PricingPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const crumbs = breadcrumbJsonLd(locale, [
    { name: 'Home', url: localeUrl(locale) },
    { name: 'Pricing', url: localeUrl(locale, '/pricing') },
  ]);

  return (
    <main className="mx-auto max-w-6xl px-6 py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(offerCatalogJsonLd(PRICING.tiers)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(faqJsonLd(PRICING_FAQS)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(crumbs) }}
      />

      <header className="max-w-2xl">
        <h1 className="text-4xl font-semibold tracking-tight text-text md:text-5xl">Pricing</h1>
        <p className="mt-4 text-lg text-text-dim">{PRICING.lead}</p>
      </header>

      <ul className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {PRICING.tiers.map((tier) => (
          <li
            key={tier.name}
            className={`flex flex-col rounded-lg border p-6 ${
              tier.highlight ? 'border-hot bg-surface' : 'border-hairline bg-surface'
            }`}
          >
            <h2 className="text-lg font-medium text-text">{tier.name}</h2>
            <p className="mt-3 text-2xl font-semibold text-text">{tier.price}</p>
            <p className="mt-2 text-sm text-text-dim">{tier.desc}</p>
            <ul className="mt-6 space-y-2 text-sm text-text-dim">
              {tier.feats.map((f) => (
                <li key={f} className="flex gap-2">
                  <span aria-hidden className="text-hot">
                    ·
                  </span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>

      <p className="mt-10 text-sm text-text-dim">{PRICING.note}</p>

      <div className="mt-12">
        <a
          href={localeUrl(locale, '/contact')}
          className="inline-flex items-center rounded-md bg-hot px-6 py-3 font-medium text-bg"
        >
          {START_PROJECT}
        </a>
      </div>
    </main>
  );
}
