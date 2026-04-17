import type { MetadataRoute } from 'next';
import { AGENTS } from '@/lib/agents';
import { getAllPosts } from '@/lib/blog';

const SITE_URL = 'https://www.openletz.com';
// Core locales for sitemap — keep crawl budget focused on languages
// relevant to Luxembourg (FR, EN, DE, LB, PT). Other locales still
// work as routes but aren't submitted to search engines and return
// noindex from the layout metadata.
const locales = ['fr', 'en', 'de', 'lb', 'pt'] as const;

function buildAlternates(path: string) {
  const languages: Record<string, string> = {};
  // hreflang alternates must match sitemap loc-list and noindex policy.
  // Advertising it/es/ru/ar/tr/uk would point Google at thin, untranslated
  // content and dilute authority — declare only the 5 shipped locales.
  for (const locale of locales) {
    languages[locale] = `${SITE_URL}/${locale}${path}`;
  }
  languages['x-default'] = `${SITE_URL}/fr${path}`;
  return { languages };
}

export default function sitemap(): MetadataRoute.Sitemap {
  // Use distinct dates by page type to help crawlers prioritize
  const contentDate = '2026-03-25T18:00:00.000Z'; // last content update
  const staticDate = '2026-03-20T12:00:00.000Z';  // legal/about rarely change

  const staticPaths = [
    { path: '', priority: 1.0, freq: 'weekly' as const, date: contentDate },
    { path: '/agents', priority: 0.9, freq: 'weekly' as const, date: contentDate },
    { path: '/pricing', priority: 0.8, freq: 'monthly' as const, date: contentDate },
    { path: '/blog', priority: 0.8, freq: 'weekly' as const, date: contentDate },
    { path: '/about', priority: 0.6, freq: 'monthly' as const, date: staticDate },
    { path: '/contact', priority: 0.7, freq: 'monthly' as const, date: staticDate },
    { path: '/privacy', priority: 0.3, freq: 'yearly' as const, date: staticDate },
    { path: '/terms', priority: 0.3, freq: 'yearly' as const, date: staticDate },
  ];

  const staticPages: MetadataRoute.Sitemap = [];
  for (const { path, priority, freq, date } of staticPaths) {
    for (const locale of locales) {
      staticPages.push({
        url: `${SITE_URL}/${locale}${path}`,
        lastModified: date,
        changeFrequency: freq,
        priority,
        alternates: buildAlternates(path),
      });
    }
  }

  const agentPages: MetadataRoute.Sitemap = [];
  for (const agent of AGENTS) {
    const path = `/agents/${agent.slug}`;
    for (const locale of locales) {
      agentPages.push({
        url: `${SITE_URL}/${locale}${path}`,
        lastModified: contentDate,
        changeFrequency: 'monthly',
        priority: 0.7,
        alternates: buildAlternates(path),
      });
    }
  }

  const blogPages: MetadataRoute.Sitemap = [];
  for (const post of getAllPosts()) {
    const path = `/blog/${post.slug}`;
    for (const locale of locales) {
      blogPages.push({
        url: `${SITE_URL}/${locale}${path}`,
        lastModified: post.date,
        changeFrequency: 'monthly',
        priority: 0.7,
        alternates: buildAlternates(path),
      });
    }
  }

  return [...staticPages, ...agentPages, ...blogPages];
}
