import type { MetadataRoute } from 'next';
import { localeUrl } from '@/lib/site-config';
import { LOCALES, DEFAULT_LOCALE } from '@/lib/site-config';

// Phase-0 minimal sitemap. The grants/agents-driven entries were deleted with
// programs.ts/agents.ts. Phase 2 rebuilds this from the new IA (/work, /about,
// /contact, /services, /pricing, /insights, legal) and the WORK/ posts data.
function buildAlternates(path: string) {
  const languages: Record<string, string> = {};
  for (const locale of LOCALES) {
    languages[locale] = localeUrl(locale, path);
  }
  languages['x-default'] = localeUrl(DEFAULT_LOCALE, path);
  return { languages };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date().toISOString();
  const staticPaths = [
    { path: '', priority: 1.0, freq: 'weekly' as const },
    { path: '/about', priority: 0.6, freq: 'monthly' as const },
    { path: '/contact', priority: 0.7, freq: 'monthly' as const },
    { path: '/legal/privacy', priority: 0.3, freq: 'yearly' as const },
    { path: '/legal/terms', priority: 0.3, freq: 'yearly' as const },
  ];

  const pages: MetadataRoute.Sitemap = [];
  for (const { path, priority, freq } of staticPaths) {
    for (const locale of LOCALES) {
      pages.push({
        url: localeUrl(locale, path),
        lastModified,
        changeFrequency: freq,
        priority,
        alternates: buildAlternates(path),
      });
    }
  }
  return pages;
}
