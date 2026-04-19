import createMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

function prefersMarkdown(accept: string | null): boolean {
  if (!accept) return false;
  // Honor explicit text/markdown. Skip broad */* so browsers still get HTML.
  return /(^|,)\s*text\/markdown\b/i.test(accept);
}

// Preview/dev deployments must never be indexed. Belt-and-suspenders on top of
// the per-page `robots` metadata: this sets an HTTP header so Google treats
// sitemap.xml and any non-HTML response as noindex too.
const IS_PRODUCTION_HOST = process.env.VERCEL_ENV === 'production';

// Locales advertised via hreflang. Must match sitemap + layout metadata.
// next-intl otherwise auto-emits a Link header listing all 11 `routing.locales`,
// which contradicts our sitemap/metadata and dilutes topical authority.
const INDEXABLE_LOCALES = new Set(['fr', 'en', 'de', 'lb', 'pt']);

function filterLinkAlternates(headerValue: string): string {
  return headerValue
    .split(',')
    .map((s) => s.trim())
    .filter((entry) => {
      const match = entry.match(/hreflang="([^"]+)"/);
      if (!match) return true;
      const hl = match[1];
      if (hl === 'x-default') return true;
      return INDEXABLE_LOCALES.has(hl);
    })
    .join(', ');
}

export default function middleware(req: NextRequest) {
  if (req.method === 'GET' && prefersMarkdown(req.headers.get('accept'))) {
    // Rewrite to the catch-all markdown route. Encoding the original path as
    // segments (rather than a query param) dodges Next.js middleware rewrites
    // dropping the search string.
    const target = new URL(`/api/md${req.nextUrl.pathname}`, req.nextUrl.origin);
    return NextResponse.rewrite(target);
  }

  const response = intlMiddleware(req);
  if (response) {
    if (!IS_PRODUCTION_HOST) {
      response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    }
    const link = response.headers.get('link');
    if (link) {
      response.headers.set('link', filterLinkAlternates(link));
    }
  }
  return response;
}

export const config = {
  // Match all pathnames except for
  // - /api, /admin, /_next, /_vercel, /favicon.ico, static assets
  matcher: [
    '/((?!api|admin|_next|_vercel|.*\\..*).*)',
  ],
};
