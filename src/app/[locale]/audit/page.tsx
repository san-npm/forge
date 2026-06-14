// src/app/[locale]/audit/page.tsx
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { LOCALES, type Locale, localeUrl } from '@/lib/site-config';
import { AuditForm } from '@/components/AuditForm';
import { breadcrumbJsonLd, faqJsonLd } from '@/lib/jsonld';
import { safeJsonLd } from '@/lib/safeJsonLd';

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
    <main className="mx-auto max-w-3xl px-6 py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(faqJsonLd(AUDIT_FAQS)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(crumbs) }}
      />

      <header>
        <h1 className="text-4xl font-semibold tracking-tight text-text md:text-5xl">
          Is your site ready for AI?
        </h1>
        <p className="mt-4 text-lg text-text-dim">
          AI assistants and search engines read your site differently than people do. Run a free
          check against the signals they look for: HTTPS, metadata, structured data, llms.txt, and
          whether your content is in the static HTML at all. You get concrete results in seconds.
        </p>
      </header>

      <div className="mt-10">
        <AuditForm enquiryHref={localeUrl(locale, '/contact')} />
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
