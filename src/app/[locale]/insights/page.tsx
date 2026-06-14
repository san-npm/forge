import type { Metadata } from 'next';
import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { LOCALES, type Locale, localeUrl } from '@/lib/site-config';
import { getAllPosts } from '@/lib/blog';
import { breadcrumbJsonLd } from '@/lib/jsonld';
import { safeJsonLd } from '@/lib/safeJsonLd';

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: 'Insights · Openletz',
  description: 'Notes from a Luxembourg AI studio: AI automation, AEO/GEO, the EU AI Act, and shipping real products.',
  alternates: { canonical: localeUrl('en', '/insights') },
};

export default async function InsightsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const posts = getAllPosts();
  const crumbs = breadcrumbJsonLd(locale, [
    { name: 'Home', url: localeUrl(locale) },
    { name: 'Insights', url: localeUrl(locale, '/insights') },
  ]);

  return (
    <main className="mx-auto max-w-3xl px-6 py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(crumbs) }}
      />
      <header>
        <h1 className="text-4xl font-semibold tracking-tight text-text md:text-5xl">Insights</h1>
        <p className="mt-4 text-lg text-text-dim">
          Notes from a Luxembourg AI studio: what we are building, and what we are learning.
        </p>
      </header>

      {posts.length === 0 ? (
        <p className="mt-12 text-text-dim">New posts are on the way.</p>
      ) : (
        <ul className="mt-12 divide-y divide-hairline border-t border-hairline">
          {posts.map((post) => {
            const title = post.title[locale] ?? post.title.en ?? post.slug;
            const excerpt = post.excerpt[locale] ?? post.excerpt.en ?? '';
            return (
              <li key={post.slug} className="py-8">
                <Link href={localeUrl(locale, `/insights/${post.slug}`)} className="group block">
                  <p className="font-mono text-sm text-text-dim">{post.date}</p>
                  <h2 className="mt-2 text-2xl font-medium text-text group-hover:text-hot">{title}</h2>
                  <p className="mt-2 text-text-dim">{excerpt}</p>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
