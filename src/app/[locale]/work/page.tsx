import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { WorkGrid } from './WorkGrid';
import { WORK } from '@/data/work';
import { LOCALES, type Locale, localeUrl } from '@/lib/site-config';
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
    <main className="overflow-hidden px-6 pb-24 pt-24 md:pb-28 md:pt-28">
      <div className="mx-auto max-w-6xl">
        <Reveal
          as="p"
          className="mb-6 font-mono text-xs uppercase tracking-[0.28em] text-text-dim"
        >
          <span className="text-accent">/</span> Selected work
        </Reveal>

        {/* LCP-style poster headline: real text at full opacity in SSR. */}
        <KineticHeadline
          as="h1"
          className="font-display uppercase leading-[0.92] tracking-[-0.01em] text-text text-balance"
        >
          <span className="block" style={{ fontSize: 'clamp(2.75rem, 9vw, 7rem)' }}>
            Selected <span className="text-accent">work</span>
          </span>
        </KineticHeadline>

        <Reveal as="p" className="mt-7 max-w-2xl text-lg text-text-dim md:text-xl">
          Real products we designed, built and shipped, plus the brands we help
          grow. Filter by what you are building.
        </Reveal>

        <div className="mt-14">
          <WorkGrid items={WORK} />
        </div>
      </div>
    </main>
  );
}
