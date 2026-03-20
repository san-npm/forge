import type { MetadataRoute } from 'next';
import { AGENTS } from '@/lib/agents';
import { getAllPosts } from '@/lib/blog';

const SITE_URL = 'https://www.openletz.com';
const locales = ['fr', 'en', 'de', 'lb', 'it', 'pt', 'es', 'ru', 'ar', 'tr', 'uk'] as const;

function buildAlternates(path: string) {
  const languages: Record<string, string> = {};
  for (const locale of locales) {
    languages[locale] = `${SITE_URL}/${locale}${path}`;
  }
  languages['x-default'] = `${SITE_URL}/fr${path}`;
  return { languages };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  const staticPaths = [
    { path: '', priority: 1.0, freq: 'weekly' as const },
    { path: '/agents', priority: 0.9, freq: 'weekly' as const },
    { path: '/pricing', priority: 0.8, freq: 'monthly' as const },
    { path: '/blog', priority: 0.8, freq: 'weekly' as const },
    { path: '/about', priority: 0.6, freq: 'monthly' as const },
    { path: '/contact', priority: 0.7, freq: 'monthly' as const },
    { path: '/privacy', priority: 0.3, freq: 'yearly' as const },
    { path: '/terms', priority: 0.3, freq: 'yearly' as const },
  ];

  const staticPages: MetadataRoute.Sitemap = [];
  for (const { path, priority, freq } of staticPaths) {
    for (const locale of locales) {
      staticPages.push({
        url: `${SITE_URL}/${locale}${path}`,
        lastModified: now,
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
        lastModified: now,
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
