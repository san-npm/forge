import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { WorkGrid } from './WorkGrid';
import { WORK } from '@/data/work';
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
    title: 'Work · Openletz',
    description: 'Selected work: AI agents, websites, e-commerce and on-chain products we have shipped.',
    alternates: { canonical: localeUrl(locale, '/work') },
  };
}

export default async function WorkPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <main className="px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-4xl font-semibold text-text">Selected work</h1>
        <p className="mt-4 max-w-2xl text-text-dim">
          Real products, shipped and live. Filter by what you're building.
        </p>
        <div className="mt-10">
          <WorkGrid items={WORK} />
        </div>
      </div>
    </main>
  );
}
