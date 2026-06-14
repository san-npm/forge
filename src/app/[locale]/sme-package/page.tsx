import type { Metadata } from 'next';
import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { LOCALES, type Locale, localeUrl } from '@/lib/site-config';
import { localeHref } from '@/lib/locale-href';
import { breadcrumbJsonLd, faqJsonLd } from '@/lib/jsonld';
import { safeJsonLd } from '@/lib/safeJsonLd';
import { SME_PACKAGE } from '@/data/sme-package';
import { Reveal } from '@/components/ui/Reveal';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { KineticHeadline } from '@/components/ui/KineticHeadline';
import { SmePackageSimulator } from '@/components/ui/SmePackageSimulator';

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

/** Shared poster size for the page's section h2s (mirrors SectionHeading). */
const SECTION_HEADLINE_FONT_SIZE = 'clamp(2.25rem, 6vw, 5rem)';

export const metadata: Metadata = {
  title: 'SME Package: 70% funding for your Luxembourg project | Openletz',
  description:
    'The Luxembourg SME Package reimburses 70% of an eligible digital or AI project, from EUR 3,000 to EUR 25,000. Estimate your grant, then we scope, build and help you claim it.',
  alternates: { canonical: localeUrl('en', '/sme-package') },
};

/** Body extracted so it can be rendered without async params / setRequestLocale. */
export function SmePackageBody({ locale = 'en' as Locale }: { locale?: Locale }) {
  const data = SME_PACKAGE;
  const crumbs = breadcrumbJsonLd(locale, [
    { name: 'Home', url: localeUrl(locale) },
    { name: 'SME Package', url: localeUrl(locale, '/sme-package') },
  ]);

  return (
    <main className="overflow-hidden">
      {/* FAQPage + BreadcrumbList JSON-LD in static SSR HTML. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(faqJsonLd(data.faqs)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(crumbs) }}
      />

      {/* ---- Hero + simulator ---- */}
      <section
        data-section="sme-hero"
        className="relative px-6 pb-20 pt-24 md:pb-24 md:pt-28"
      >
        <div className="mx-auto grid w-full max-w-6xl gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-center">
          <div>
            <Reveal
              as="p"
              className="mb-6 font-mono text-xs uppercase tracking-[0.28em] text-text-dim"
            >
              <span className="text-accent">/</span> {data.hero.kicker}
            </Reveal>

            {/* LCP-style poster headline: real text at full opacity in SSR. */}
            <KineticHeadline
              as="h1"
              className="font-display uppercase leading-[0.92] tracking-[-0.01em] text-text text-balance"
            >
              <span
                className="block"
                style={{ fontSize: 'clamp(2.5rem, 7vw, 5.5rem)' }}
              >
                Get <span className="text-accent">70%</span> of your project funded.
              </span>
            </KineticHeadline>

            <Reveal as="p" className="mt-7 max-w-xl text-lg text-text-dim md:text-xl">
              {data.hero.lead}
            </Reveal>
          </div>

          {/* The interactive estimator, prominent next to the headline. */}
          <Reveal className="w-full">
            <SmePackageSimulator officialUrl={data.officialUrl} locale={locale} />
          </Reveal>
        </div>
      </section>

      {/* ---- What it is ---- */}
      <section data-section="sme-what" className="px-6 py-20 md:py-24">
        <div className="mx-auto max-w-4xl">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.28em] text-text-dim">
            <span className="text-accent">/</span> {data.what.kicker}
          </p>
          <h2
            className="font-display uppercase leading-[0.95] tracking-[-0.01em] text-text text-balance"
            style={{ fontSize: SECTION_HEADLINE_FONT_SIZE }}
          >
            State <span className="text-accent">aid</span> for Luxembourg SMEs
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {data.what.body.map((para) => (
              <Reveal as="p" key={para.slice(0, 24)} className="text-base text-text-dim md:text-lg">
                {para}
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---- What you get: covered categories ---- */}
      <section data-section="sme-categories" className="px-6 py-20 md:py-24">
        <div className="mx-auto max-w-6xl">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.28em] text-text-dim">
            <span className="text-accent">/</span> What it can fund
          </p>
          <h2
            className="font-display uppercase leading-[0.95] tracking-[-0.01em] text-text text-balance"
            style={{ fontSize: SECTION_HEADLINE_FONT_SIZE }}
          >
            Where the <span className="text-accent">70%</span> applies
          </h2>

          <ScrollReveal
            as="ul"
            role="list"
            selector="[data-cat]"
            className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {data.categories.map((cat) => (
              <li
                key={cat.title}
                data-cat
                className="group flex flex-col rounded-2xl border border-hairline bg-surface p-7
                  transition-[transform,border-color,box-shadow] duration-base ease-out
                  hover:-translate-y-1 hover:border-accent hover:shadow-[0_0_50px_-12px_var(--accent-glow)]"
              >
                <h3
                  className="font-display uppercase leading-[0.95] tracking-[-0.01em] text-text"
                  style={{ fontSize: 'clamp(1.4rem, 2.2vw, 1.9rem)' }}
                >
                  {cat.title}
                </h3>
                <p className="mt-4 text-text-dim">{cat.desc}</p>
              </li>
            ))}
          </ScrollReveal>
        </div>
      </section>

      {/* ---- How it works: 5 steps ---- */}
      <section data-section="sme-steps" className="px-6 py-20 md:py-24">
        <div className="mx-auto max-w-5xl">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.28em] text-text-dim">
            <span className="text-accent">/</span> How it works
          </p>
          <h2
            className="font-display uppercase leading-[0.95] tracking-[-0.01em] text-text text-balance"
            style={{ fontSize: SECTION_HEADLINE_FONT_SIZE }}
          >
            From idea to <span className="text-accent">reimbursement</span>
          </h2>

          <ScrollReveal
            as="ol"
            role="list"
            selector="[data-step]"
            className="mt-12 flex flex-col gap-6"
          >
            {data.steps.map((step) => (
              <li
                key={step.n}
                data-step
                className="flex flex-col gap-3 border-t border-hairline pt-6 md:flex-row md:items-baseline md:gap-8"
              >
                <span
                  aria-hidden
                  className="font-display leading-none text-accent"
                  style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
                >
                  {step.n}
                </span>
                <div className="md:flex-1">
                  <h3
                    className="font-display uppercase leading-[0.95] tracking-[-0.01em] text-text"
                    style={{ fontSize: 'clamp(1.35rem, 2.2vw, 1.9rem)' }}
                  >
                    {step.title}
                  </h3>
                  <p className="mt-2 max-w-2xl text-text-dim">{step.desc}</p>
                </div>
              </li>
            ))}
          </ScrollReveal>
        </div>
      </section>

      {/* ---- Bonus: what Openletz adds ---- */}
      <section data-section="sme-bonus" className="px-6 py-20 md:py-24">
        <div className="mx-auto max-w-6xl">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.28em] text-text-dim">
            <span className="text-accent">/</span> What Openletz adds
          </p>
          <h2
            className="font-display uppercase leading-[0.95] tracking-[-0.01em] text-text text-balance"
            style={{ fontSize: SECTION_HEADLINE_FONT_SIZE }}
          >
            Not just the <span className="text-accent">build</span>
          </h2>

          <ScrollReveal
            as="ul"
            role="list"
            selector="[data-bonus]"
            className="mt-12 grid gap-6 md:grid-cols-3"
          >
            {data.bonus.map((b) => (
              <li
                key={b.title}
                data-bonus
                className="flex flex-col rounded-2xl border border-hairline bg-surface p-7"
              >
                <h3
                  className="font-display uppercase leading-[0.95] tracking-[-0.01em] text-text"
                  style={{ fontSize: 'clamp(1.3rem, 2vw, 1.75rem)' }}
                >
                  {b.title}
                </h3>
                <p className="mt-4 text-text-dim">{b.desc}</p>
              </li>
            ))}
          </ScrollReveal>
        </div>
      </section>

      {/* ---- Eligibility + honest caveats ---- */}
      <section data-section="sme-eligibility" className="px-6 py-20 md:py-24">
        <div className="mx-auto grid max-w-5xl gap-12 md:grid-cols-2">
          <div>
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.28em] text-text-dim">
              <span className="text-accent">/</span> Who qualifies
            </p>
            <h2
              className="font-display uppercase leading-[0.95] tracking-[-0.01em] text-text text-balance"
              style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)' }}
            >
              Eligibility
            </h2>
            <ul role="list" className="mt-8 grid gap-4">
              {data.eligibility.points.map((p) => (
                <li key={p} className="flex gap-3 text-text-dim">
                  <span aria-hidden className="mt-1 text-accent">
                    /
                  </span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col rounded-2xl border border-hairline bg-surface p-7 md:p-8">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-text-dim">
              The honest part
            </p>
            <p className="mt-4 text-text-dim">{data.eligibility.caveat}</p>
            <a
              href={data.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ol-link mt-6 inline-flex items-center gap-1.5 font-mono text-sm uppercase tracking-[0.12em] text-accent"
            >
              Read the official programme <span aria-hidden>↗</span>
            </a>
          </div>
        </div>
      </section>

      {/* ---- FAQ ---- */}
      <section data-section="sme-faq" className="px-6 py-20 md:py-24">
        <div className="mx-auto max-w-4xl">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.28em] text-text-dim">
            <span className="text-accent">/</span> FAQ
          </p>
          <h2
            className="font-display uppercase leading-[0.95] tracking-[-0.01em] text-text text-balance"
            style={{ fontSize: SECTION_HEADLINE_FONT_SIZE }}
          >
            Questions, <span className="text-accent">answered</span>
          </h2>

          <dl className="mt-12 divide-y divide-hairline border-t border-hairline">
            {data.faqs.map((f) => (
              <div key={f.q} className="py-7">
                <dt className="text-lg font-semibold text-text md:text-xl">{f.q}</dt>
                <dd className="mt-3 max-w-2xl text-text-dim">{f.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ---- Closing CTA ---- */}
      <section data-section="sme-cta" className="px-6 pb-28 pt-10 md:pb-32">
        <div className="mx-auto max-w-4xl rounded-2xl border border-hairline bg-surface p-10 text-center md:p-14">
          <h2
            className="font-display uppercase leading-[0.95] tracking-[-0.01em] text-text text-balance"
            style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}
          >
            Let us scope a project that <span className="text-accent">qualifies</span>.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-text-dim">
            Tell us what you want to build. We will scope it to fit the programme,
            help with the application, and build it.
          </p>
          <div className="mt-8 flex justify-center">
            <Link href={localeHref('/contact', locale)} className="ol-btn" data-cta>
              Start a project
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default async function SmePackagePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <SmePackageBody locale={locale} />;
}
