import type { Metadata } from 'next';
import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { LOCALES, type Locale, localeUrl } from '@/lib/site-config';
import { localeHref } from '@/lib/locale-href';
import { getAllPosts, type BlogPost } from '@/lib/blog';
import { getUiStrings } from '@/data/ui';
import { breadcrumbJsonLd, blogListingJsonLd, homeBreadcrumbLabel } from '@/lib/jsonld';
import { safeJsonLd } from '@/lib/safeJsonLd';
import { Reveal } from '@/components/ui/Reveal';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
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
  const i = getUiStrings(locale).insights;
  return {
    title: i.metaTitle,
    description: i.metaDescription,
    alternates: { canonical: localeUrl(locale, '/insights') },
  };
}

/** Two-digit lime index, e.g. 01, 02 (purely typographic, decorative). */
function indexLabel(i: number): string {
  return String(i + 1).padStart(2, '0');
}

export default async function InsightsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = getUiStrings(locale);
  const ins = t.insights;
  const posts = getAllPosts();
  const crumbs = breadcrumbJsonLd(locale, [
    { name: homeBreadcrumbLabel(locale), url: localeUrl(locale) },
    { name: 'Insights', url: localeUrl(locale, '/insights') },
  ]);
  const blogListing = blogListingJsonLd(posts, locale);

  const [featured, ...rest] = posts;

  const titleOf = (post: BlogPost) => post.title[locale] ?? post.title.en ?? post.slug;
  const excerptOf = (post: BlogPost) => post.excerpt[locale] ?? post.excerpt.en ?? '';

  return (
    <main className="overflow-hidden">
      {/* Blog + BreadcrumbList JSON-LD in static SSR HTML. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(blogListing) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(crumbs) }}
      />

      {/* ---- Header ---- */}
      <section data-section="insights-header" className="px-6 pb-12 pt-24 md:pb-16 md:pt-28">
        <div className="mx-auto max-w-6xl">
          <Reveal
            as="p"
            className="mb-6 font-mono text-xs uppercase tracking-[0.28em] text-text-dim"
          >
            <span className="text-accent">/</span> {ins.kicker}
          </Reveal>

          <KineticHeadline
            as="h1"
            className="font-display uppercase leading-[0.92] tracking-[-0.01em] text-text text-balance"
          >
            <span className="block" style={{ fontSize: 'clamp(2.5rem, 8vw, 6rem)' }}>
              {ins.titleA}
              <span className="text-accent">{ins.titleAccent}</span>
            </span>
          </KineticHeadline>

          <Reveal as="p" className="mt-7 max-w-2xl text-lg text-text-dim md:text-xl">
            {ins.lead}
          </Reveal>
        </div>
      </section>

      {posts.length === 0 ? (
        <section className="px-6 pb-28">
          <p className="mx-auto max-w-6xl text-text-dim">{ins.noPosts}</p>
        </section>
      ) : (
        <>
          {/* ---- Featured (newest) ---- */}
          <section data-section="insights-featured" className="px-6 pb-10 md:pb-12">
            <div className="mx-auto max-w-6xl">
              <Reveal>
                <Link
                  href={localeHref(`/insights/${featured.slug}`, locale)}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-hairline bg-surface p-8 md:p-12
                    transition-[transform,border-color,box-shadow] duration-base ease-out
                    hover:-translate-y-1 hover:border-accent hover:shadow-[0_0_50px_-12px_var(--accent-glow)]
                    focus-visible:outline-none focus-visible:border-accent focus-visible:shadow-[0_0_50px_-12px_var(--accent-glow)]"
                >
                  <div className="flex items-center gap-4 font-mono text-xs uppercase tracking-[0.2em] text-text-dim">
                    <span className="rounded-full border border-accent px-3 py-1 text-accent">
                      {ins.latest}
                    </span>
                    <span>{featured.date}</span>
                  </div>
                  <h2
                    className="mt-6 max-w-4xl font-display uppercase leading-[0.95] tracking-[-0.01em] text-text transition-colors duration-base ease-out group-hover:text-accent"
                    style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}
                  >
                    {titleOf(featured)}
                  </h2>
                  <p className="mt-5 max-w-2xl text-base text-text-dim md:text-lg">
                    {excerptOf(featured)}
                  </p>
                  <span className="mt-8 inline-flex items-center gap-1.5 font-mono text-sm uppercase tracking-[0.12em] text-accent transition-transform duration-base ease-out group-hover:translate-x-0.5">
                    {t.common.read} <span aria-hidden>{'->'}</span>
                  </span>
                </Link>
              </Reveal>
            </div>
          </section>

          {/* ---- The rest, in a bold grid ---- */}
          {rest.length > 0 && (
            <section data-section="insights-grid" className="px-6 pb-28 pt-2 md:pb-32">
              <div className="mx-auto max-w-6xl">
                <ScrollReveal
                  as="ul"
                  role="list"
                  selector="[data-post-card]"
                  className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                >
                  {rest.map((post, i) => (
                    <li key={post.slug} data-post-card className="h-full">
                      <Link
                        href={localeHref(`/insights/${post.slug}`, locale)}
                        className="group relative flex h-full flex-col rounded-2xl border border-hairline bg-surface p-7
                          transition-[transform,border-color,box-shadow] duration-base ease-out
                          hover:-translate-y-1 hover:border-accent hover:shadow-[0_0_50px_-12px_var(--accent-glow)]
                          focus-visible:outline-none focus-visible:border-accent focus-visible:shadow-[0_0_50px_-12px_var(--accent-glow)]"
                      >
                        <div className="flex items-baseline justify-between">
                          <span
                            aria-hidden
                            className="font-display leading-none text-accent"
                            style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)' }}
                          >
                            {indexLabel(i + 1)}
                          </span>
                          <span className="font-mono text-xs uppercase tracking-[0.16em] text-text-dim">
                            {post.date}
                          </span>
                        </div>
                        <h3
                          className="mt-6 font-display uppercase leading-[0.98] tracking-[-0.01em] text-text transition-colors duration-base ease-out group-hover:text-accent"
                          style={{ fontSize: 'clamp(1.4rem, 2.4vw, 2rem)' }}
                        >
                          {titleOf(post)}
                        </h3>
                        <p className="mt-4 flex-1 text-text-dim">{excerptOf(post)}</p>
                        <span className="mt-6 inline-flex items-center gap-1.5 font-mono text-sm uppercase tracking-[0.12em] text-accent transition-transform duration-base ease-out group-hover:translate-x-0.5">
                          {t.common.read} <span aria-hidden>{'->'}</span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ScrollReveal>
              </div>
            </section>
          )}
        </>
      )}
    </main>
  );
}
