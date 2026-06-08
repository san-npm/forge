import { SITE_URL } from './site-config.ts';

export interface Redirect {
  source: string;
  destination: string;
  permanent: true; // 301
  has?: { type: 'host'; value: string }[];
}

/**
 * Host canonicalization. Every non-apex host -> https://openletz.ai/:path*.
 * Inverts the legacy rule (which 301'd .ai -> www.openletz.com). The apex
 * `openletz.ai` is intentionally absent as a source to avoid a redirect loop.
 */
export const HOST_REDIRECTS: Redirect[] = [
  'openletz.com',
  'www.openletz.com',
  'www.openletz.ai',
  'openletz.fr',
  'www.openletz.fr',
  'openletz.info',
  'www.openletz.info',
].map((host) => ({
  source: '/:path*',
  has: [{ type: 'host' as const, value: host }],
  destination: `${SITE_URL}/:path*`,
  permanent: true as const,
}));

/**
 * Per-URL legacy 301s. Populated in Phase 2 when the legacy routes
 * (/aides, /aides/[slug], /agents, /agents/[slug], old /blog, old /blog/[slug])
 * and the dropped-locale folds (/{lb,pt,it,es,ru,ar,tr,uk}/* -> /*) are deleted.
 * Each entry maps to a real new equivalent — NEVER a blanket redirect to home.
 */
export const LEGACY_REDIRECTS: Redirect[] = [];

/** next.config.mjs redirects() returns this: host rules first, then per-URL. */
export function allRedirects(): Redirect[] {
  return [...HOST_REDIRECTS, ...LEGACY_REDIRECTS];
}
