// src/app/[locale]/audit/page.tsx
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { LOCALES, type Locale, localeUrl } from '@/lib/site-config';
import { AuditForm } from '@/components/AuditForm';
import { breadcrumbJsonLd, faqJsonLd } from '@/lib/jsonld';
import { safeJsonLd } from '@/lib/safeJsonLd';
import { Reveal } from '@/components/ui/Reveal';
import { KineticHeadline } from '@/components/ui/KineticHeadline';

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: 'Free AI & web readiness audit · Openletz',
  description:
    'Check your site against the signals AI assistants and search engines look for. Concrete results in seconds, free.',
  alternates: { canonical: localeUrl('en', '/audit') },
};

const AUDIT_FAQS = [
  {
    q: 'What does the audit check?',
    a: 'HTTPS, title and meta tags, headings, structured data, llms.txt, sitemap, and whether your content is in the static HTML AI crawlers read.',
  },
  {
    q: 'Is it really free?',
    a: 'Yes. It runs server-side in a few seconds. If you want help fixing what it finds, that is where we come in.',
  },
];

/** Body extracted so it can be unit-tested without async params / setRequestLocale. */
export function AuditBody({ locale = 'en' as Locale }: { locale?: Locale }) {
  const crumbs = breadcrumbJsonLd(locale, [
    { name: 'Home', url: localeUrl(locale) },
    { name: 'Audit', url: localeUrl(locale, '/audit') },
  ]);

  return (
    <main className="overflow-hidden px-6 pb-28 pt-24 md:pt-28">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(faqJsonLd(AUDIT_FAQS)) }}
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
          <span className="text-accent">/</span> Free readiness check
        </Reveal>

        <KineticHeadline
          as="h1"
          className="font-display uppercase leading-[0.92] tracking-[-0.01em] text-text text-balance"
        >
          <span className="block" style={{ fontSize: 'clamp(2.5rem, 8vw, 6rem)' }}>
            Is your site ready for <span className="text-accent">AI</span>?
          </span>
        </KineticHeadline>

        <Reveal as="p" className="mt-7 text-lg text-text-dim md:text-xl">
          AI assistants and search engines read your site differently than people
          do. Run a free check against the signals they look for: HTTPS, metadata,
          structured data, llms.txt, and whether your content is in the static HTML
          at all. You get concrete results in seconds.
        </Reveal>

        <div className="mt-12 rounded-2xl border border-hairline bg-surface p-7 md:p-9">
          <AuditForm enquiryHref={localeUrl(locale, '/contact')} />
        </div>

        {/* ---- FAQ (also feeds the FAQPage JSON-LD above) ---- */}
        <div className="mt-20">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.28em] text-text-dim">
            <span className="text-accent">/</span> FAQ
          </p>
          <h2
            className="font-display uppercase leading-[0.95] tracking-[-0.01em] text-text text-balance"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
          >
            Questions, <span className="text-accent">answered</span>
          </h2>
          <dl className="mt-10 divide-y divide-hairline border-t border-hairline">
            {AUDIT_FAQS.map((f) => (
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
