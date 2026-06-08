import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { LOCALES, type Locale, localeUrl } from '@/lib/site-config';
import { SERVICES, type ServiceKey } from '@/data/services';
import { START_PROJECT } from '@/data/nav';
import { serviceJsonLd, breadcrumbJsonLd, faqJsonLd } from '@/lib/jsonld';
import { safeJsonLd } from '@/lib/safeJsonLd';

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: 'Services — Openletz',
  description:
    'One Luxembourg studio: AI agents & automation, digital & growth, and Web3 when it helps.',
  alternates: { canonical: localeUrl('en', '/services') },
};

// order significant: AI (front door) -> Growth -> Web3
const ORDER: ServiceKey[] = ['ai', 'marketing', 'web3'];

const SERVICES_FAQS = [
  {
    q: 'Do I have to use all three?',
    a: 'No. AI is the usual front door; we add growth and Web3 only when they help.',
  },
  {
    q: 'Where does my data live?',
    a: 'In Europe. We choose tools with GDPR and the EU AI Act in mind and can deploy on EU or Aleph-hosted infrastructure.',
  },
];

/** Body extracted so it can be unit-tested without async params / setRequestLocale. */
export function ServicesBody({ locale = 'en' as Locale }: { locale?: Locale }) {
  const crumbs = breadcrumbJsonLd(locale, [
    { name: 'Home', url: localeUrl(locale) },
    { name: 'Services', url: localeUrl(locale, '/services') },
  ]);

  return (
    <main className="mx-auto max-w-6xl px-6 py-20">
      {ORDER.map((key) => (
        <script
          key={`ld-${key}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(serviceJsonLd(key, SERVICES[key])) }}
        />
      ))}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(faqJsonLd(SERVICES_FAQS)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(crumbs) }}
      />

      <header className="max-w-2xl">
        <h1 className="text-4xl font-semibold tracking-tight text-text md:text-5xl">
          One studio, three ways in.
        </h1>
        <p className="mt-4 text-lg text-text-dim">
          AI agents and automation are the front door. Websites and growth carry it all. Web3 when
          it helps.
        </p>
      </header>

      <div className="mt-16 space-y-20">
        {ORDER.map((key, i) => {
          const s = SERVICES[key];
          return (
            <section
              key={key}
              id={key}
              aria-labelledby={`${key}-title`}
              className="border-t border-hairline pt-10"
            >
              <p className="font-mono text-sm text-text-dim">
                {String(i + 1).padStart(2, '0')} · {s.kicker}
              </p>
              <h2
                id={`${key}-title`}
                className="mt-2 text-2xl font-semibold text-text md:text-3xl"
              >
                {s.title}
              </h2>
              <p className="mt-3 max-w-2xl text-text-dim">{s.lead}</p>

              <div className="mt-8 grid gap-6 md:grid-cols-3">
                {s.what.map((w) => (
                  <div key={w.t} className="rounded-lg border border-hairline bg-surface p-5">
                    <h3 className="font-medium text-text">{w.t}</h3>
                    <p className="mt-2 text-sm text-text-dim">{w.d}</p>
                  </div>
                ))}
              </div>

              <ol className="mt-8 flex flex-col gap-2 text-sm text-text-dim md:flex-row md:gap-6">
                {s.how.map((step, n) => (
                  <li key={step} className="flex gap-2">
                    <span aria-hidden className="font-mono text-hot">
                      {n + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>

              <p className="mt-6 max-w-2xl text-sm text-text-dim">{s.proof}</p>
              {s.footer ? (
                <p className="mt-3 max-w-2xl text-sm text-text-dim">{s.footer}</p>
              ) : null}

              <div className="mt-8">
                <a
                  href={localeUrl(locale, '/contact')}
                  className="inline-flex items-center rounded-md bg-hot px-6 py-3 font-medium text-bg"
                >
                  {START_PROJECT}
                </a>
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ServicesBody locale={locale} />;
}
