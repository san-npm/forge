// src/app/[locale]/audit/page.tsx
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { LOCALES, type Locale, localeUrl } from '@/lib/site-config';
import { AuditForm } from '@/components/AuditForm';
import { getUiStrings } from '@/data/ui';
import { breadcrumbJsonLd, faqJsonLd, homeBreadcrumbLabel } from '@/lib/jsonld';
import { safeJsonLd } from '@/lib/safeJsonLd';
import { Reveal } from '@/components/ui/Reveal';
import { KineticHeadline } from '@/components/ui/KineticHeadline';

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const a = getUiStrings(locale).audit;
  return {
    title: a.metaTitle,
    description: a.metaDescription,
    alternates: { canonical: localeUrl(locale, '/audit') },
  };
}

/** Body extracted so it can be unit-tested without async params / setRequestLocale. */
export function AuditBody({ locale = 'en' as Locale }: { locale?: Locale }) {
  const t = getUiStrings(locale);
  const a = t.audit;
  const crumbs = breadcrumbJsonLd(locale, [
    { name: homeBreadcrumbLabel(locale), url: localeUrl(locale) },
    { name: 'Audit', url: localeUrl(locale, '/audit') },
  ]);

  return (
    <main className="overflow-hidden px-6 pb-28 pt-24 md:pt-28">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(faqJsonLd(a.faqs)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(crumbs) }}
      />

      <div className="mx-auto max-w-3xl">
        <Reveal
          as="p"
          className="mb-6 font-mono text-xs uppercase tracking-[0.28em] text-text-dim"
        >
          <span className="text-accent">/</span> {a.kicker}
        </Reveal>

        <KineticHeadline
          as="h1"
          className="font-display uppercase leading-[0.92] tracking-[-0.01em] text-text text-balance"
        >
          <span className="block" style={{ fontSize: 'clamp(2.5rem, 8vw, 6rem)' }}>
            {a.titleA}
            <span className="text-accent">{a.titleAccent}</span>
            {a.titleB}
          </span>
        </KineticHeadline>

        <Reveal as="p" className="mt-7 text-lg text-text-dim md:text-xl">
          {a.lead}
        </Reveal>

        <div className="mt-12 rounded-2xl border border-hairline bg-surface p-7 md:p-9">
          <AuditForm enquiryHref={localeUrl(locale, '/contact')} locale={locale} />
        </div>

        {/* ---- FAQ (also feeds the FAQPage JSON-LD above) ---- */}
        <div className="mt-20">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.28em] text-text-dim">
            <span className="text-accent">/</span> {t.common.faqKicker}
          </p>
          <h2
            className="font-display uppercase leading-[0.95] tracking-[-0.01em] text-text text-balance"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
          >
            {t.common.questionsAnsweredPre}
            <span className="text-accent">{t.common.questionsAnsweredAccent}</span>
          </h2>
          <dl className="mt-10 divide-y divide-hairline border-t border-hairline">
            {a.faqs.map((f) => (
              <div key={f.q} className="py-7">
                <dt className="text-lg font-semibold text-text md:text-xl">{f.q}</dt>
                <dd className="mt-3 text-text-dim">{f.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </main>
  );
}

export default async function AuditPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <AuditBody locale={locale} />;
}
