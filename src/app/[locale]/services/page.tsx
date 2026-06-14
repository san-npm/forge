import type { Metadata } from 'next';
import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { LOCALES, type Locale, localeUrl } from '@/lib/site-config';
import { localeHref } from '@/lib/locale-href';
import { getServices, type ServiceKey } from '@/data/services';
import { getStartProject } from '@/data/nav';
import { getUiStrings } from '@/data/ui';
import { serviceJsonLd, breadcrumbJsonLd, faqJsonLd, homeBreadcrumbLabel } from '@/lib/jsonld';
import { safeJsonLd } from '@/lib/safeJsonLd';
import { Reveal } from '@/components/ui/Reveal';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { KineticHeadline } from '@/components/ui/KineticHeadline';

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

const META: Record<Locale, { title: string; description: string }> = {
  en: {
    title: 'Services · Openletz',
    description: 'One Luxembourg studio: AI agents & automation, digital & growth, and Web3 when it helps.',
  },
  fr: {
    title: 'Services · Openletz',
    description: 'Un seul studio luxembourgeois : agents IA & automatisation, digital & croissance, et du Web3 quand il aide.',
  },
  de: {
    title: 'Leistungen · Openletz',
    description: 'Ein Luxemburger Studio: KI-Agenten & Automatisierung, Digital & Wachstum und Web3, wo es hilft.',
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
    alternates: { canonical: localeUrl(locale, '/services') },
  };
}

// order significant: AI (front door) -> Growth -> Web3
const ORDER: ServiceKey[] = ['ai', 'marketing', 'web3'];

/** Body extracted so it can be unit-tested without async params / setRequestLocale. */
export function ServicesBody({ locale = 'en' as Locale }: { locale?: Locale }) {
  const SERVICES = getServices(locale);
  const t = getUiStrings(locale);
  const startProject = getStartProject(locale);
  const servicesFaqs = t.services.faqs;
  const crumbs = breadcrumbJsonLd(locale, [
    { name: homeBreadcrumbLabel(locale), url: localeUrl(locale) },
    { name: 'Services', url: localeUrl(locale, '/services') },
  ]);

  return (
    <main className="overflow-hidden">
      {ORDER.map((key) => (
        <script
          key={`ld-${key}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(serviceJsonLd(key, SERVICES[key])) }}
        />
      ))}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(faqJsonLd(servicesFaqs)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(crumbs) }}
      />

      {/* ---- Hero ---- */}
      <section className="px-6 pb-12 pt-24 md:pt-28">
        <div className="mx-auto max-w-6xl">
          <Reveal
            as="p"
            className="mb-6 font-mono text-xs uppercase tracking-[0.28em] text-text-dim"
          >
            <span className="text-accent">/</span> {t.services.heroKicker}
          </Reveal>

          {/* LCP-style poster headline: real text at full opacity in SSR. */}
          <KineticHeadline
            as="h1"
            className="font-display uppercase leading-[0.92] tracking-[-0.01em] text-text text-balance"
          >
            <span className="block" style={{ fontSize: 'clamp(2.5rem, 8vw, 6.5rem)' }}>
              {t.services.heroTitleA}
              <span className="text-accent">{t.services.heroTitleAccent}</span>
              {t.services.heroTitleB}
            </span>
          </KineticHeadline>

          <Reveal as="p" className="mt-7 max-w-2xl text-lg text-text-dim md:text-xl">
            {t.services.heroLead}
          </Reveal>

          {/* Soft, honest SME Package funding line. */}
          <Reveal as="p" className="mt-6 max-w-2xl text-base text-text-dim">
            {t.services.fundingLead}{' '}
            <Link href={localeHref('/sme-package', locale)} className="ol-link text-accent">
              {t.services.seeSmePackage}
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ---- Pillars ---- */}
      <div className="px-6 pb-20 md:pb-24">
        <div className="mx-auto flex max-w-6xl flex-col gap-20 md:gap-28">
          {ORDER.map((key, i) => {
            const s = SERVICES[key];
            return (
              <section
                key={key}
                id={key}
                aria-labelledby={`${key}-title`}
                className="border-t border-hairline pt-12"
              >
                <p className="font-mono text-sm uppercase tracking-[0.2em] text-text-dim">
                  <span className="text-accent">{String(i + 1).padStart(2, '0')}</span> ·{' '}
                  {s.kicker}
                </p>
                <h2
                  id={`${key}-title`}
                  className="mt-4 font-display uppercase leading-[0.95] tracking-[-0.01em] text-text"
                  style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}
                >
                  {s.title}
                </h2>
                <p className="mt-5 max-w-2xl text-base text-text-dim md:text-lg">{s.lead}</p>

                <ScrollReveal
                  as="div"
                  selector="[data-svc-what]"
                  className="mt-10 grid gap-6 md:grid-cols-3"
                >
                  {s.what.map((w) => (
                    <div
                      key={w.t}
                      data-svc-what
                      className="group flex flex-col rounded-2xl border border-hairline bg-surface p-7
                        transition-[transform,border-color,box-shadow] duration-base ease-out
                        hover:-translate-y-1 hover:border-accent hover:shadow-[0_0_50px_-12px_var(--accent-glow)]"
                    >
                      <h3
                        className="font-display uppercase leading-[0.95] tracking-[-0.01em] text-text"
                        style={{ fontSize: 'clamp(1.3rem, 2vw, 1.7rem)' }}
                      >
                        {w.t}
                      </h3>
                      <p className="mt-4 text-text-dim">{w.d}</p>
                    </div>
                  ))}
                </ScrollReveal>

                <ol className="mt-10 flex flex-col gap-4 md:flex-row md:gap-10">
                  {s.how.map((step, n) => (
                    <li key={step} className="flex flex-1 items-baseline gap-3">
                      <span
                        aria-hidden
                        className="font-display leading-none text-accent"
                        style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)' }}
                      >
                        {n + 1}
                      </span>
                      <span className="text-text-dim">{step}</span>
                    </li>
                  ))}
                </ol>

                <p className="mt-8 max-w-2xl text-text-dim">{s.proof}</p>
                {s.footer ? (
                  <p className="mt-3 max-w-2xl text-sm text-text-dim">{s.footer}</p>
                ) : null}

                <div className="mt-8">
                  <Link href={localeHref('/contact', locale)} className="ol-btn" data-cta>
                    {startProject}
                  </Link>
                </div>
              </section>
            );
          })}
        </div>
      </div>

      {/* ---- FAQ ---- */}
      <section className="px-6 pb-20 md:pb-24">
        <div className="mx-auto max-w-4xl">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.28em] text-text-dim">
            <span className="text-accent">/</span> {t.common.faqKicker}
          </p>
          <h2
            className="font-display uppercase leading-[0.95] tracking-[-0.01em] text-text text-balance"
            style={{ fontSize: 'clamp(2.25rem, 6vw, 5rem)' }}
          >
            {t.common.questionsAnsweredPre}
            <span className="text-accent">{t.common.questionsAnsweredAccent}</span>
          </h2>
          <dl className="mt-12 divide-y divide-hairline border-t border-hairline">
            {servicesFaqs.map((f) => (
              <div key={f.q} className="py-7">
                <dt className="text-lg font-semibold text-text md:text-xl">{f.q}</dt>
                <dd className="mt-3 max-w-2xl text-text-dim">{f.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
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
