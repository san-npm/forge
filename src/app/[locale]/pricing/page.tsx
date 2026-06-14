import type { Metadata } from 'next';
import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { LOCALES, type Locale, localeUrl } from '@/lib/site-config';
import { localeHref } from '@/lib/locale-href';
import { PRICING } from '@/data/pricing';
import { START_PROJECT } from '@/data/nav';
import { offerCatalogJsonLd, breadcrumbJsonLd, faqJsonLd } from '@/lib/jsonld';
import { safeJsonLd } from '@/lib/safeJsonLd';
import { Reveal } from '@/components/ui/Reveal';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { KineticHeadline } from '@/components/ui/KineticHeadline';

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: 'Pricing · Openletz',
  description:
    'No price anchors: every project gets a fixed quote up front, scoped to what you actually need.',
  alternates: { canonical: localeUrl('en', '/pricing') },
};

const PRICING_FAQS = [
  {
    q: 'Why no public prices?',
    a: 'Because honest scoping beats a number that fits nobody. You tell us what you want to build, we scope it, and every project gets a fixed quote up front.',
  },
  {
    q: 'Can my project be co-funded?',
    a: 'If you are based in Luxembourg, most projects qualify for 70% state co-funding through the SME Package, and we help with the paperwork.',
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
    <main className="overflow-hidden">
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

      {/* ---- Hero ---- */}
      <section className="px-6 pb-12 pt-24 md:pt-28">
        <div className="mx-auto max-w-6xl">
          <Reveal
            as="p"
            className="mb-6 font-mono text-xs uppercase tracking-[0.28em] text-text-dim"
          >
            <span className="text-accent">/</span> Pricing
          </Reveal>

          <KineticHeadline
            as="h1"
            className="font-display uppercase leading-[0.92] tracking-[-0.01em] text-text text-balance"
          >
            <span className="block" style={{ fontSize: 'clamp(2.5rem, 8vw, 6.5rem)' }}>
              A fixed <span className="text-accent">quote</span>, up front.
            </span>
          </KineticHeadline>

          <Reveal as="p" className="mt-7 max-w-2xl text-lg text-text-dim md:text-xl">
            {PRICING.lead}
          </Reveal>

          {/* Honest SME funding line with the real value. */}
          <Reveal as="p" className="mt-6 max-w-2xl text-base text-text-dim">
            Most projects qualify for 70% state co-funding.{' '}
            <Link href={localeHref('/sme-package', locale)} className="ol-link text-accent">
              See the SME Package.
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ---- Tiers ---- */}
      <section className="px-6 pb-20 md:pb-24">
        <ScrollReveal
          as="ul"
          role="list"
          selector="[data-tier]"
          className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-4"
        >
          {PRICING.tiers.map((tier) => (
            <li
              key={tier.name}
              data-tier
              className={`group flex flex-col rounded-2xl border bg-surface p-7
                transition-[transform,border-color,box-shadow] duration-base ease-out
                hover:-translate-y-1 hover:border-accent hover:shadow-[0_0_50px_-12px_var(--accent-glow)] ${
                  tier.highlight ? 'border-accent' : 'border-hairline'
                }`}
            >
              {tier.highlight && (
                <span className="mb-4 w-fit rounded-full border border-accent px-3 py-1 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-accent">
                  Most popular
                </span>
              )}
              <h2
                className="font-display uppercase leading-[0.95] tracking-[-0.01em] text-text"
                style={{ fontSize: 'clamp(1.4rem, 2.2vw, 1.85rem)' }}
              >
                {tier.name}
              </h2>
              <p className="mt-4 font-mono text-sm uppercase tracking-[0.14em] text-accent">
                {tier.price}
              </p>
              <p className="mt-3 text-sm text-text-dim">{tier.desc}</p>
              <ul className="mt-6 space-y-2.5 text-sm text-text-dim">
                {tier.feats.map((f) => (
                  <li key={f} className="flex gap-2.5">
                    <span aria-hidden className="mt-0.5 text-accent">
                      /
                    </span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ScrollReveal>

        <p className="mx-auto mt-10 max-w-6xl text-sm text-text-dim">{PRICING.note}</p>
      </section>

      {/* ---- FAQ ---- */}
      <section className="px-6 pb-20 md:pb-24">
        <div className="mx-auto max-w-4xl">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.28em] text-text-dim">
            <span className="text-accent">/</span> FAQ
          </p>
          <h2
            className="font-display uppercase leading-[0.95] tracking-[-0.01em] text-text text-balance"
            style={{ fontSize: 'clamp(2.25rem, 6vw, 5rem)' }}
          >
            Questions, <span className="text-accent">answered</span>
          </h2>
          <dl className="mt-12 divide-y divide-hairline border-t border-hairline">
            {PRICING_FAQS.map((f) => (
              <div key={f.q} className="py-7">
                <dt className="text-lg font-semibold text-text md:text-xl">{f.q}</dt>
                <dd className="mt-3 max-w-2xl text-text-dim">{f.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ---- Closing CTA ---- */}
      <section className="px-6 pb-28 pt-2 md:pb-32">
        <div className="mx-auto max-w-4xl rounded-2xl border border-hairline bg-surface p-10 text-center md:p-14">
          <h2
            className="font-display uppercase leading-[0.95] tracking-[-0.01em] text-text text-balance"
            style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}
          >
            Tell us what you want to <span className="text-accent">build</span>.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-text-dim">
            We scope it, quote it up front, and ship it.
          </p>
          <div className="mt-8 flex justify-center">
            <Link href={localeHref('/contact', locale)} className="ol-btn" data-cta>
              {START_PROJECT}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
