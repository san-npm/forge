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

const AIDES_SLUGS = [
  'fit-4-ai',
  'fit-4-digital',
  'fit-4-innovation',
  'sme-package-ai',
  'sme-package-cybersecurite',
  'sme-package-digital',
];

const AGENT_SLUGS = [
  'liberclaw', 'chatgpt', 'claude', 'perplexity', 'jasper', 'copy-ai', 'elevenlabs',
  'zapier-ai', 'notion-ai', 'otter-ai', 'julius-ai', 'rows-ai', 'monkeylearn', 'midjourney',
  'canva-ai', 'runway', 'github-copilot', 'cursor', 'v0-by-vercel', 'google-gemini', 'mistral',
  'deepl', 'grammarly', 'synthesia', 'hubspot-ai', 'fireflies-ai', 'durable', 'writesonic',
  'tome', 'surfer-seo', 'make', 'heygen', 'beautiful-ai',
];

const BLOG_SLUGS = [
  'aide-cybersecurite-pme-luxembourg',
  'aides-luxembourg-2026-annuaire-complet',
  'fit-4-ai-guide-complet',
  'fit-4-digital-vs-fit-4-ai-comparaison',
  'quelle-aide-digitalisation-choisir',
  'sme-package-digital-guide-complet',
  'top-outils-ia-pme-luxembourg',
];

const DROPPED_LOCALES = ['lb', 'pt', 'it', 'es', 'ru', 'ar', 'tr', 'uk'];

function legacy(source: string, destination: string): Redirect {
  return { source, destination, permanent: true };
}

/**
 * Per-URL legacy 301s. Populated in Phase 2.
 * Each entry maps to a real new equivalent — NEVER a blanket redirect to home for deep slugs.
 * Ordering: grants era, agents directory, blog, misc, locale folds.
 */
export const LEGACY_REDIRECTS: Redirect[] = [
  // --- Grants era (/aides) — the studio no longer does grant consulting.
  //     Index -> home; the 6 program guides -> /about (SME Package mentioned softly there).
  legacy('/aides', '/'),
  ...AIDES_SLUGS.map((slug) => legacy(`/aides/${slug}`, '/about')),

  // --- AI-tools directory (/agents) — killed.
  //     RGPD/DSGVO/DPA ranking cluster preserved: ALL /agents/* land on the
  //     EU/GDPR/AI-Act trust block (/about); the index goes to /work (real products).
  legacy('/agents', '/work'),
  ...AGENT_SLUGS.map((slug) => legacy(`/agents/${slug}`, '/about')),

  // --- Old grants-era blog — all 7 posts removed; posts -> /work, index -> home
  //     (new agency posts arrive in Phase 3 at /insights).
  legacy('/blog', '/'),
  ...BLOG_SLUGS.map((slug) => legacy(`/blog/${slug}`, '/work')),

  // --- Legacy clients page folded into /work.
  legacy('/clients', '/work'),

  // --- Dropped-locale folds: collapse the 8 removed locale prefixes onto the EN default.
  ...DROPPED_LOCALES.map((loc) => legacy(`/${loc}/:path*`, '/:path*')),
];

/** next.config.mjs redirects() returns this: host rules first, then per-URL. */
export function allRedirects(): Redirect[] {
  return [...HOST_REDIRECTS, ...LEGACY_REDIRECTS];
}
