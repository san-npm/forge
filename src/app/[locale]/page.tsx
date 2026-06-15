import { setRequestLocale } from 'next-intl/server';
import { SectionRenderer } from '@/components/SectionRenderer';
import { getHomeSections } from '@/data/pages/home';
import { LOCALES, type Locale } from '@/lib/site-config';
import { faqJsonLd, AGENCY_FAQS } from '@/lib/jsonld';
import { safeJsonLd } from '@/lib/safeJsonLd';

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <main>
      {/* Agency FAQPage JSON-LD, home only (services/pricing/sme-package/audit
          each emit their own page-level FAQ). */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(faqJsonLd(AGENCY_FAQS)) }}
      />
      <SectionRenderer sections={getHomeSections(locale)} locale={locale} />
    </main>
  );
}
