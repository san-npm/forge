import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { LOCALES, type Locale, localeUrl } from '@/lib/site-config';
import { localeHref } from '@/lib/locale-href';
import { getAllPosts, getPostBySlug, getPostBody } from '@/lib/blog';
import { getUiStrings } from '@/data/ui';
import { getStartProject } from '@/data/nav';
import { renderMarkdown } from '@/lib/markdown';
import { breadcrumbJsonLd, blogPostingJsonLd, homeBreadcrumbLabel } from '@/lib/jsonld';
import { safeJsonLd } from '@/lib/safeJsonLd';

export function generateStaticParams() {
  const posts = getAllPosts();
  return LOCALES.flatMap((locale) => posts.map((post) => ({ locale, slug: post.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  const title = post.title[locale] ?? post.title.en ?? slug;
  const description = post.metaDescription?.[locale] ?? post.excerpt[locale] ?? post.excerpt.en ?? '';
  return {
    title: `${title} · Openletz`,
    description,
    alternates: { canonical: localeUrl(locale, `/insights/${slug}`) },
  };
}

export default async function InsightPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const post = getPostBySlug(slug);
  if (!post) notFound();

  const t = getUiStrings(locale);
  const title = post.title[locale] ?? post.title.en ?? slug;
  const html = renderMarkdown(getPostBody(post, locale));
  const postUrl = localeUrl(locale, `/insights/${slug}`);
  const crumbs = breadcrumbJsonLd(locale, [
    { name: homeBreadcrumbLabel(locale), url: localeUrl(locale) },
    { name: 'Insights', url: localeUrl(locale, '/insights') },
    { name: title, url: postUrl },
  ]);
  const blogPosting = blogPostingJsonLd({ post, locale, url: postUrl });

  return (
    <main className="overflow-hidden">
      {/* BlogPosting + BreadcrumbList JSON-LD in static SSR HTML. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(blogPosting) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(crumbs) }}
      />

      <article className="px-6 pb-28 pt-24 md:pt-28">
        {/* ---- Header: kicker, date, GIANT title, author. Title in static HTML. ---- */}
        <header className="mx-auto max-w-3xl">
          <p className="mb-6 font-mono text-xs uppercase tracking-[0.28em] text-text-dim">
            <span className="text-accent">/</span> {t.insights.readerKicker}
            <span className="mx-3 text-hairline">·</span>
            <span>{post.date}</span>
          </p>
          <h1
            className="font-display uppercase leading-[0.95] tracking-[-0.01em] text-text text-balance"
            style={{ fontSize: 'clamp(2.25rem, 6vw, 4.5rem)' }}
          >
            {title}
          </h1>
          {post.author ? (
            <p className="mt-6 font-mono text-sm uppercase tracking-[0.14em] text-text-dim">
              {t.insights.by} <span className="text-text">{post.author}</span>
            </p>
          ) : null}
        </header>

        {/* ---- Body: rendered markdown in a ~65ch measure, dark-theme typography.
             Plain server div so the full article text is in static HTML for
             crawlers and reduced-motion users (no client gate, no fade on read). ---- */}
        <div
          className="mx-auto mt-12 max-w-[65ch] text-text
            [&_h2]:mt-12 [&_h2]:font-display [&_h2]:uppercase [&_h2]:leading-[1] [&_h2]:tracking-[-0.01em] [&_h2]:text-text [&_h2]:text-[clamp(1.6rem,3vw,2.25rem)]
            [&_h3]:mt-10 [&_h3]:font-display [&_h3]:uppercase [&_h3]:leading-[1.05] [&_h3]:tracking-[-0.01em] [&_h3]:text-text [&_h3]:text-[clamp(1.25rem,2.2vw,1.65rem)]
            [&_p]:mt-5 [&_p]:text-base [&_p]:leading-relaxed [&_p]:text-text-dim md:[&_p]:text-lg
            [&_ul]:mt-5 [&_ul]:flex [&_ul]:list-none [&_ul]:flex-col [&_ul]:gap-3 [&_ul]:pl-0
            [&_li]:relative [&_li]:pl-6 [&_li]:text-base [&_li]:leading-relaxed [&_li]:text-text-dim md:[&_li]:text-lg
            [&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:top-0 [&_li]:before:font-mono [&_li]:before:text-accent [&_li]:before:content-['/']
            [&_strong]:font-semibold [&_strong]:text-text
            [&_em]:italic [&_em]:text-text
            [&_code]:rounded [&_code]:bg-surface-2 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.9em] [&_code]:text-accent"
          dangerouslySetInnerHTML={{ __html: html }}
        />

        {/* ---- End CTA: back to insights + start a project (locale-aware). ---- */}
        <div className="mx-auto mt-16 flex max-w-[65ch] flex-col gap-6 border-t border-hairline pt-10 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href={localeHref('/insights', locale)}
            className="ol-link inline-flex items-center gap-1.5 font-mono text-sm uppercase tracking-[0.14em] text-text-dim"
          >
            <span aria-hidden>{'<-'}</span> {t.insights.backToInsights}
          </Link>
          <Link href={localeHref('/contact', locale)} className="ol-btn">
            {getStartProject(locale)}
          </Link>
        </div>
      </article>
    </main>
  );
}
