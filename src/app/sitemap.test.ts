import { describe, it, expect } from 'vitest';
import sitemap from '@/app/sitemap';
import { localeUrl } from '@/lib/site-config';

describe('sitemap', () => {
  const entries = sitemap();
  const urls = entries.map((e) => e.url);

  it('includes the Phase-2 IA paths for the default locale', () => {
    for (const path of ['', '/work', '/work/vinsfins', '/work/lagrocerie', '/about', '/contact', '/legal/privacy', '/legal/terms']) {
      expect(urls).toContain(localeUrl('en', path));
    }
  });

  it('emits all three locales', () => {
    expect(urls).toContain(localeUrl('fr', '/work'));
    expect(urls).toContain(localeUrl('de', '/about'));
  });

  it('contains NO grants/agents/blog/clients legacy URLs', () => {
    const joined = urls.join('\n');
    for (const dead of ['/aides', '/agents', '/blog', '/clients']) {
      expect(joined).not.toContain(dead);
    }
  });

  it('does NOT yet include Phase-3 routes', () => {
    const joined = urls.join('\n');
    for (const later of ['/services', '/pricing', '/audit', '/insights']) {
      expect(joined).not.toContain(later);
    }
  });

  it('uses the openletz.ai apex on every URL', () => {
    for (const url of urls) expect(url.startsWith('https://openletz.ai')).toBe(true);
  });
});
