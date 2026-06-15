import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { WorkGrid } from './WorkGrid';
import { getWork } from '@/data/work';
import { getUiStrings } from '@/data/ui';
import { LOCALES, type Locale, localeUrl } from '@/lib/site-config';
import { Reveal } from '@/components/ui/Reveal';
import { KineticHeadline } from '@/components/ui/KineticHeadline';

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

const META: Record<Locale, { title: string; description: string }> = {
  en: {
    title: 'Work · Openletz',
    description: 'Selected work: AI agents, websites, e-commerce and on-chain products we have shipped.',
  },
  fr: {
    title: 'Réalisations · Openletz',
    description: 'Réalisations choisies : agents IA, sites, e-commerce et produits on-chain que nous avons livrés.',
  },
  de: {
    title: 'Arbeiten · Openletz',
    description: 'Ausgewählte Arbeiten: KI-Agenten, Websites, E-Commerce und On-Chain-Produkte, die wir geliefert haben.',
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: META[locale].title,
    description: META[locale].description,
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
  const work = getWork(locale);
  const t = getUiStrings(locale).work;

  return (
    <main className="overflow-hidden px-6 pb-24 pt-24 md:pb-28 md:pt-28">
      <div className="mx-auto max-w-6xl">
        <Reveal
          as="p"
          className="mb-6 font-mono text-xs uppercase tracking-[0.28em] text-text-dim"
        >
          <span className="text-accent">/</span> {t.kicker}
        </Reveal>

        {/* LCP-style poster headline: real text at full opacity in SSR. */}
        <KineticHeadline
          as="h1"
          className="font-display uppercase leading-[0.92] tracking-[-0.01em] text-text text-balance"
        >
          <span className="block" style={{ fontSize: 'clamp(2.75rem, 9vw, 7rem)' }}>
            {t.titleA}
            <span className="text-accent">{t.titleAccent}</span>
          </span>
        </KineticHeadline>

        <Reveal as="p" className="mt-7 max-w-2xl text-lg text-text-dim md:text-xl">
          {t.lead}
        </Reveal>

        <div className="mt-14">
          <WorkGrid items={work} locale={locale} />
        </div>
      </div>
    </main>
  );
}
