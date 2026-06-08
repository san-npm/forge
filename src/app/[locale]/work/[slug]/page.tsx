import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { CASE_STUDIES, getCaseStudy } from '@/data/case-studies';
import { WORK } from '@/data/work';
import { LOCALES, type Locale, localeUrl } from '@/lib/site-config';

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
    title: `${cs.title} — Case study — Openletz`,
    description: cs.kicker,
    alternates: { canonical: localeUrl(locale, `/work/${slug}`) },
  };
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

  return (
    <main className="px-6 py-20">
      <div className="mx-auto grid max-w-5xl gap-12 md:grid-cols-[2fr_1fr]">
        <article className="max-w-none">
          <p className="font-mono text-xs uppercase tracking-widest text-text-dim">{cs.kicker}</p>
          <h1 className="mt-2 text-4xl font-semibold text-text">{cs.title}</h1>

          <h2 className="mt-10 text-2xl font-semibold text-text">Problem</h2>
          {cs.problem.map((p, i) => (
            <p key={i} className="mt-3 text-text-dim">{p}</p>
          ))}

          <h2 className="mt-10 text-2xl font-semibold text-text">Process</h2>
          {cs.process.map((p, i) => (
            <p key={i} className="mt-3 text-text-dim">{p}</p>
          ))}

          <h2 className="mt-10 text-2xl font-semibold text-text">Result</h2>
          {cs.result.map((p, i) => (
            <p key={i} className="mt-3 text-text-dim">{p}</p>
          ))}

          {work && (
            <p className="mt-10">
              <a href={work.link} target="_blank" rel="noopener noreferrer" className="ol-link text-hot">
                Visit {cs.title} ↗
              </a>
            </p>
          )}
        </article>

        {/* Fixed metric sidebar */}
        <aside className="md:sticky md:top-24 md:self-start">
          <h2 className="font-mono text-xs uppercase tracking-widest text-text-dim">By the numbers</h2>
          <dl className="mt-4 grid gap-4">
            {cs.metrics.map((m) => (
              <div key={m.label}>
                <dt className="text-text-dim text-sm">{m.label}</dt>
                <dd className="font-mono text-2xl text-text">
                  {m.value}
                  {m.placeholder && (
                    <span className="ml-1 align-super text-[10px] text-text-dim">(pending)</span>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>
    </main>
  );
}
