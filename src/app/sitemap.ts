import type { MetadataRoute } from 'next';
import { LOCALES, localeUrl } from '@/lib/site-config';
import { CASE_STUDIES } from '@/data/case-studies';

// Phase-2 IA only. Phase 3 EXTENDS this with /services, /pricing, /audit, /insights.
const STATIC_PATHS: { path: string; priority: number; freq: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
  { path: '', priority: 1.0, freq: 'weekly' },
  { path: '/work', priority: 0.8, freq: 'monthly' },
  { path: '/about', priority: 0.6, freq: 'monthly' },
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

  return out;
}
