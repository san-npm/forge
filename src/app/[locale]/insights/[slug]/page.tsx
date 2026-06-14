import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { LOCALES, type Locale, localeUrl } from '@/lib/site-config';
import { getAllPosts, getPostBySlug } from '@/lib/blog';
import { renderMarkdown } from '@/lib/markdown';
import { breadcrumbJsonLd } from '@/lib/jsonld';
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
    alternates: { canonical: localeUrl('en', `/insights/${slug}`) },
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

  const title = post.title[locale] ?? post.title.en ?? slug;
  const html = renderMarkdown(post.content);
  const crumbs = breadcrumbJsonLd(locale, [
    { name: 'Home', url: localeUrl(locale) },
    { name: 'Insights', url: localeUrl(locale, '/insights') },
    { name: title, url: localeUrl(locale, `/insights/${slug}`) },
  ]);

  return (
    <main className="mx-auto max-w-2xl px-6 py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(crumbs) }}
      />
      <article>
        <header>
          <p className="font-mono text-sm text-text-dim">{post.date}</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-text">{title}</h1>
          {post.author ? <p className="mt-3 text-text-dim">By {post.author}</p> : null}
        </header>
        <div
          className="mt-10 max-w-none text-text [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-medium [&_h2]:text-text [&_h3]:mt-8 [&_h3]:text-xl [&_h3]:font-medium [&_h3]:text-text [&_strong]:font-medium [&_strong]:text-text [&_em]:italic [&_code]:rounded [&_code]:bg-surface [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-sm [&_li]:text-text-dim [&_p]:mt-4 [&_p]:text-text-dim [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-6"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </article>
    </main>
  );
}
