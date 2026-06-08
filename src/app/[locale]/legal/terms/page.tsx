import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { TERMS } from '@/data/legal';
import { LOCALES, type Locale, localeUrl } from '@/lib/site-config';

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
    title: `${TERMS.title} — Openletz`,
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
  return (
    <main className="px-6 py-20">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-semibold text-text">{TERMS.title}</h1>
        <p className="mt-2 text-sm text-text-dim">Last updated {TERMS.lastUpdated}</p>
        {TERMS.sections.map((s) => (
          <section key={s.title} className="mt-10">
            <h2 className="text-xl font-semibold text-text">{s.title}</h2>
            <p className="mt-3 text-text-dim">{s.body}</p>
          </section>
        ))}
      </div>
    </main>
  );
}
