import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { ABOUT } from '@/data/about';
import { Testimonials } from '@/components/Testimonials';
import { TESTIMONIALS } from '@/data/testimonials';
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
    title: 'About — Openletz',
    description: ABOUT.bioLead,
    alternates: { canonical: localeUrl(locale, '/about') },
  };
}

/** Body extracted so it can be unit-tested without async params. */
export function AboutBody() {
  return (
    <main className="px-6 py-20">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-semibold text-text">{ABOUT.founderName}</h1>
        <p className="mt-2 text-text-dim">{ABOUT.founderRole}</p>
        <p className="mt-8 text-lg text-text-dim">{ABOUT.bioLead}</p>

        <section className="mt-12 rounded-lg border border-hairline p-6">
          <h2 className="font-mono text-xs uppercase tracking-widest text-text-dim">
            European by default
          </h2>
          <ul role="list" className="mt-4 grid gap-3">
            {ABOUT.facts.map((fact) => (
              <li key={fact} className="text-text-dim">{fact}</li>
            ))}
          </ul>
        </section>

        {/* Empty-safe: renders null while TESTIMONIALS is []. */}
        <Testimonials items={TESTIMONIALS} />

        <p className="mt-12 text-sm text-text-dim">{ABOUT.entity}</p>
      </div>
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
  return <AboutBody />;
}
