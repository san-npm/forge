import type { MetadataRoute } from 'next';
import { LOCALES, localeUrl } from '@/lib/site-config';
import { CASE_STUDIES } from '@/data/case-studies';
import { getAllPosts } from '@/lib/blog';

// Phase-2 IA + Phase-3 routes (/services, /pricing, /audit, /insights).
const STATIC_PATHS: { path: string; priority: number; freq: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
  { path: '', priority: 1.0, freq: 'weekly' },
  { path: '/services', priority: 0.7, freq: 'monthly' },
  { path: '/pricing', priority: 0.7, freq: 'monthly' },
  { path: '/audit', priority: 0.7, freq: 'monthly' },
  { path: '/work', priority: 0.8, freq: 'monthly' },
  { path: '/about', priority: 0.6, freq: 'monthly' },
  { path: '/insights', priority: 0.7, freq: 'weekly' },
  { path: '/contact', priority: 0.7, freq: 'monthly' },
  { path: '/legal/privacy', priority: 0.3, freq: 'yearly' },
  { path: '/legal/terms', priority: 0.3, freq: 'yearly' },
];

function alternates(path: string) {
  const languages: Record<string, string> = {};
  for (const locale of LOCALES) languages[locale] = localeUrl(locale, path);
  languages['x-default'] = localeUrl('en', path);
  return { languages };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const out: MetadataRoute.Sitemap = [];

  for (const { path, priority, freq } of STATIC_PATHS) {
    for (const locale of LOCALES) {
      out.push({
        url: localeUrl(locale, path),
        lastModified,
        changeFrequency: freq,
        priority,
        alternates: alternates(path),
      });
    }
  }

  for (const slug of Object.keys(CASE_STUDIES)) {
    const path = `/work/${slug}`;
    for (const locale of LOCALES) {
      out.push({
        url: localeUrl(locale, path),
        lastModified,
        changeFrequency: 'monthly',
        priority: 0.7,
        alternates: alternates(path),
      });
    }
  }

  for (const post of getAllPosts()) {
    const path = `/insights/${post.slug}`;
    const postModified = post.date ? new Date(post.date) : lastModified;
    for (const locale of LOCALES) {
      out.push({
        url: localeUrl(locale, path),
        lastModified: postModified,
        changeFrequency: 'monthly',
        priority: 0.6,
        alternates: alternates(path),
      });
    }
  }

  return out;
}
