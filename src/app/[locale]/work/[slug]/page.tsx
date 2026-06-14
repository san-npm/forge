import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { CASE_STUDIES, getCaseStudy } from '@/data/case-studies';
import { WORK } from '@/data/work';
import { LOCALES, type Locale, localeUrl } from '@/lib/site-config';
import { localeHref } from '@/lib/locale-href';
import { breadcrumbJsonLd } from '@/lib/jsonld';
import { safeJsonLd } from '@/lib/safeJsonLd';
import { Reveal } from '@/components/ui/Reveal';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { KineticHeadline } from '@/components/ui/KineticHeadline';
import { WORK_SCREENSHOTS } from '@/components/ui/WorkCard';

export function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    Object.keys(CASE_STUDIES).map((slug) => ({ locale, slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const cs = getCaseStudy(slug);
  if (!cs) return {};
  return {
    title: `${cs.title} · Case study · Openletz`,
    description: cs.kicker,
    alternates: { canonical: localeUrl(locale, `/work/${slug}`) },
  };
}

/** A titled essay block: a mono section label and its paragraphs. */
function EssaySection({ label, paras }: { label: string; paras: string[] }) {
  return (
    <section className="border-t border-hairline pt-10">
      <h2
        className="font-display uppercase leading-[0.95] tracking-[-0.01em] text-text"
        style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)' }}
      >
        {label}
      </h2>
      <div className="mt-5 grid gap-4">
        {paras.map((p, i) => (
          <Reveal as="p" key={i} className="max-w-2xl text-base text-text-dim md:text-lg">
            {p}
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const cs = getCaseStudy(slug);
  if (!cs) notFound();
  const work = WORK.find((w) => w.slug === slug);
  const shot = WORK_SCREENSHOTS[slug];

  const crumbs = breadcrumbJsonLd(locale, [
    { name: 'Home', url: localeUrl(locale) },
    { name: 'Work', url: localeUrl(locale, '/work') },
    { name: cs.title, url: localeUrl(locale, `/work/${slug}`) },
  ]);

  return (
    <main className="overflow-hidden">
      {/* BreadcrumbList JSON-LD in static SSR HTML. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(crumbs) }}
      />

      {/* ---- Hero ---- */}
      <section className="px-6 pb-12 pt-24 md:pt-28">
        <div className="mx-auto max-w-5xl">
          <Reveal
            as="p"
            className="mb-6 font-mono text-xs uppercase tracking-[0.28em] text-text-dim"
          >
            <span className="text-accent">/</span> {cs.kicker}
          </Reveal>

          {/* LCP-style poster title: real text at full opacity in SSR. */}
          <KineticHeadline
            as="h1"
            className="font-display uppercase leading-[0.92] tracking-[-0.01em] text-text text-balance"
          >
            <span className="block" style={{ fontSize: 'clamp(2.75rem, 9vw, 7rem)' }}>
              {cs.title}
              <span className="text-accent">.</span>
            </span>
          </KineticHeadline>

          {work && (
            <div className="mt-8 flex flex-wrap items-center gap-5">
              <a
                href={work.link}
                target="_blank"
                rel="noopener noreferrer"
                className="ol-btn"
                data-cta
              >
                Visit the live site <span aria-hidden>↗</span>
              </a>
              <Link href={localeHref('/work', locale)} className="ol-link text-text-dim">
                Back to work
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ---- Hero screenshot ---- */}
      {shot && (
        <section className="px-6 pb-16 md:pb-20">
          <Reveal className="mx-auto max-w-5xl">
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-hairline bg-ink2">
              <Image
                src={shot}
                alt={`${cs.title} screenshot`}
                fill
                priority
                sizes="(min-width: 1024px) 1024px, 100vw"
                className="object-cover object-top"
              />
            </div>
          </Reveal>
        </section>
      )}

      {/* ---- Metrics: big lime numbers (placeholders labelled honestly) ---- */}
      <section className="px-6 pb-16 md:pb-20">
        <ScrollReveal
          as="dl"
          selector="[data-metric]"
          className="mx-auto grid max-w-5xl gap-px overflow-hidden rounded-2xl border border-hairline bg-hairline sm:grid-cols-2 lg:grid-cols-4"
        >
          {cs.metrics.map((m) => (
            <div key={m.label} data-metric className="flex flex-col bg-surface p-7">
              <dt className="font-mono text-xs uppercase tracking-[0.16em] text-text-dim">
                {m.label}
              </dt>
              <dd
                className="mt-3 font-display uppercase leading-none text-accent"
                style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
              >
                {m.value}
                {m.placeholder && (
                  <span className="ml-2 align-super font-mono text-[0.5em] uppercase tracking-[0.12em] text-text-dim">
                    pending
                  </span>
                )}
              </dd>
            </div>
          ))}
        </ScrollReveal>
      </section>

      {/* ---- Essay ---- */}
      <section className="px-6 pb-20 md:pb-24">
        <div className="mx-auto flex max-w-5xl flex-col gap-14">
          <EssaySection label="Problem" paras={cs.problem} />
          <EssaySection label="Process" paras={cs.process} />
          <EssaySection label="Result" paras={cs.result} />
        </div>
      </section>

      {/* ---- Closing CTA ---- */}
      <section className="px-6 pb-28 pt-2 md:pb-32">
        <div className="mx-auto max-w-4xl rounded-2xl border border-hairline bg-surface p-10 text-center md:p-14">
          <h2
            className="font-display uppercase leading-[0.95] tracking-[-0.01em] text-text text-balance"
            style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}
          >
            Want one like <span className="text-accent">this</span>?
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-text-dim">
            Tell us what you want to build. We scope it, build it, and ship it.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-5">
            <Link href={localeHref('/contact', locale)} className="ol-btn" data-cta>
              Start a project
            </Link>
            <Link href={localeHref('/work', locale)} className="ol-link text-text-dim">
              Back to work
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
