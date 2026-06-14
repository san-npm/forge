import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { getAbout } from '@/data/about';
import { getStartProject } from '@/data/nav';
import { getUiStrings } from '@/data/ui';
import { Testimonials } from '@/components/Testimonials';
import { TESTIMONIALS } from '@/data/testimonials';
import { LOCALES, type Locale, localeUrl } from '@/lib/site-config';
import { localeHref } from '@/lib/locale-href';
import { breadcrumbJsonLd, homeBreadcrumbLabel } from '@/lib/jsonld';
import { safeJsonLd } from '@/lib/safeJsonLd';
import { Reveal } from '@/components/ui/Reveal';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { KineticHeadline } from '@/components/ui/KineticHeadline';
import Link from 'next/link';

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const about = getAbout(locale);
  const aboutTitles: Record<Locale, string> = {
    en: 'About · Openletz',
    fr: 'À propos · Openletz',
    de: 'Über uns · Openletz',
  };
  return {
    title: aboutTitles[locale],
    description: about.bioLead,
    alternates: { canonical: localeUrl(locale, '/about') },
  };
}

/** Initials for the lime-framed founder placeholder block (no broken image). */
function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}

/** Splits a sentence around an accent substring into [before, after] parts. */
function splitAccent(text: string, accent: string): [string, string] {
  const i = text.indexOf(accent);
  if (i === -1) return [text, ''];
  return [text.slice(0, i), text.slice(i + accent.length)];
}

/** Body extracted so it can be unit-tested without async params. */
export function AboutBody({ locale = 'en' as Locale }: { locale?: Locale }) {
  const ABOUT = getAbout(locale);
  const t = getUiStrings(locale);
  const a = t.about;
  const [closingBefore, closingAfter] = splitAccent(a.closingTitle, a.closingTitleAccent);

  return (
    <main className="overflow-hidden">
      {/* ---- Hero ---- */}
      <section className="px-6 pb-12 pt-24 md:pt-28">
        <div className="mx-auto max-w-5xl">
          <Reveal
            as="p"
            className="mb-6 font-mono text-xs uppercase tracking-[0.28em] text-text-dim"
          >
            <span className="text-accent">/</span> {a.heroKicker}
          </Reveal>

          <KineticHeadline
            as="h1"
            className="font-display uppercase leading-[0.92] tracking-[-0.01em] text-text text-balance"
          >
            <span className="block" style={{ fontSize: 'clamp(2.5rem, 8vw, 6.5rem)' }}>
              {a.heroTitleA}
              <span className="text-accent">{a.heroTitleAccent}</span>
              {a.heroTitleB}
            </span>
          </KineticHeadline>
        </div>
      </section>

      {/* ---- Founder block ---- */}
      <section className="px-6 pb-16 md:pb-20">
        <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-[minmax(0,0.6fr)_minmax(0,1fr)] md:items-start">
          {/* Lime-framed typographic placeholder (no broken img). */}
          <Reveal className="w-full">
            <div
              aria-hidden
              className="relative flex aspect-[4/5] w-full items-center justify-center overflow-hidden rounded-2xl border border-accent bg-surface"
            >
              <span
                className="font-display uppercase leading-none text-accent"
                style={{ fontSize: 'clamp(4rem, 12vw, 8rem)' }}
              >
                {initialsOf(ABOUT.founderName)}
              </span>
              <span className="absolute bottom-5 left-5 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-text-dim">
                {a.placeholderCaption}
              </span>
            </div>
          </Reveal>

          <div>
            <h2
              className="font-display uppercase leading-[0.95] tracking-[-0.01em] text-text"
              style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
            >
              {ABOUT.founderName}
            </h2>
            <p className="mt-3 max-w-xl text-text-dim">{ABOUT.founderRole}</p>
            <Reveal as="p" className="mt-7 max-w-xl text-lg text-text-dim md:text-xl">
              {ABOUT.bioLead}
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---- EU-trust block ---- */}
      <section className="px-6 pb-16 md:pb-20">
        <div className="mx-auto max-w-5xl">
          <p className="mb-6 font-mono text-xs uppercase tracking-[0.28em] text-text-dim">
            <span className="text-accent">/</span> {a.euKicker}
          </p>
          <ScrollReveal
            as="ul"
            role="list"
            selector="[data-fact]"
            className="grid gap-px overflow-hidden rounded-2xl border border-hairline bg-hairline md:grid-cols-3"
          >
            {ABOUT.facts.map((fact, i) => (
              <li key={fact} data-fact className="flex flex-col gap-4 bg-surface p-7">
                <span
                  aria-hidden
                  className="font-display leading-none text-accent"
                  style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)' }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-text-dim">{fact}</span>
              </li>
            ))}
          </ScrollReveal>
        </div>
      </section>

      {/* ---- Testimonials (empty-safe: renders null until real quotes) ---- */}
      <section className="px-6">
        <div className="mx-auto max-w-5xl">
          <Testimonials items={TESTIMONIALS} />
        </div>
      </section>

      {/* ---- Closing CTA + entity ---- */}
      <section className="px-6 pb-28 pt-10 md:pb-32">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-2xl border border-hairline bg-surface p-10 text-center md:p-14">
            <h2
              className="font-display uppercase leading-[0.95] tracking-[-0.01em] text-text text-balance"
              style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}
            >
              {closingBefore}
              <span className="text-accent">{a.closingTitleAccent}</span>
              {closingAfter}
            </h2>
            <div className="mt-8 flex justify-center">
              <Link href={localeHref('/contact', locale)} className="ol-btn" data-cta>
                {getStartProject(locale)}
              </Link>
            </div>
          </div>
          <p className="mt-8 text-sm text-text-dim">{ABOUT.entity}</p>
        </div>
      </section>
    </main>
  );
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const crumbs = breadcrumbJsonLd(locale, [
    { name: homeBreadcrumbLabel(locale), url: localeUrl(locale) },
    { name: 'About', url: localeUrl(locale, '/about') },
  ]);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(crumbs) }}
      />
      <AboutBody locale={locale} />
    </>
  );
}
