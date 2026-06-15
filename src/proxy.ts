import createIntlMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { routing } from './i18n/routing';
import { isProductionHost } from '@/lib/indexing';

// next-intl@4.x still ships its handler under `middleware` even though Next 16
// renamed the root file convention to `proxy`. The factory works unchanged —
// we just invoke it from our exported `proxy` function below.
const intlProxy = createIntlMiddleware(routing);

function prefersMarkdown(accept: string | null): boolean {
  if (!accept) return false;
  // Honor explicit text/markdown. Skip broad */* so browsers still get HTML.
  return /(^|,)\s*text\/markdown\b/i.test(accept);
}

// Preview/dev deployments must never be indexed. Belt-and-suspenders on top of
// the per-page `robots` metadata: this sets an `X-Robots-Tag` HTTP header on
// non-production hosts. The matcher below excludes dotted paths, so this header
// only ever covers HTML pages (sitemap.xml / robots.txt are NOT matched here —
// those carry their own indexing posture). We reuse `isProductionHost()` — the
// same guard the layout's robots metadata uses — so the HTTP header and the
// page-level metadata agree on every host (Vercel or off-Vercel), instead of
// the old Vercel-only `VERCEL_ENV === 'production'` check that would noindex a
// real production deploy anywhere VERCEL_ENV is unset.

// Locales advertised via hreflang. Must match sitemap + layout metadata.
// next-intl otherwise auto-emits a Link header listing all 3 `routing.locales`,
// which contradicts our sitemap/metadata and dilutes topical authority.
const INDEXABLE_LOCALES = new Set(['en', 'fr', 'de']);

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

export default function proxy(req: NextRequest) {
  if (req.method === 'GET' && prefersMarkdown(req.headers.get('accept'))) {
    // Rewrite to the catch-all markdown route. Encoding the original path as
    // segments (rather than a query param) dodges Next.js proxy rewrites
    // dropping the search string.
    const target = new URL(`/api/md${req.nextUrl.pathname}`, req.nextUrl.origin);
    return NextResponse.rewrite(target);
  }

  const response = intlProxy(req);
  if (response) {
    if (!isProductionHost()) {
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
