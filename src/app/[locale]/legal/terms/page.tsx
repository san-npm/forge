import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { getTerms } from '@/data/legal';
import { LOCALES, type Locale, localeUrl } from '@/lib/site-config';

const LAST_UPDATED_LABEL: Record<Locale, string> = {
  en: 'Last updated',
  fr: 'Dernière mise à jour',
  de: 'Zuletzt aktualisiert',
};

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: `${getTerms(locale).title} · Openletz`,
    alternates: { canonical: localeUrl(locale, '/legal/terms') },
  };
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const doc = getTerms(locale);
  return (
    <main className="px-6 py-20">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-semibold text-text">{doc.title}</h1>
        <p className="mt-2 text-sm text-text-dim">
          {LAST_UPDATED_LABEL[locale]} {doc.lastUpdated}
        </p>
        {doc.sections.map((s) => (
          <section key={s.title} className="mt-10">
            <h2 className="text-xl font-semibold text-text">{s.title}</h2>
            <p className="mt-3 text-text-dim">{s.body}</p>
          </section>
        ))}
      </div>
    </main>
  );
}
