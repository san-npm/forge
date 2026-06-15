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

// Kept locales (en is unprefixed at `/`, fr/de live under `/fr` `/de`).
const KEPT_LOCALES = ['en', 'fr', 'de'] as const;

/**
 * Concrete (non-wildcard-locale) legacy rules. Sources are UNPREFIXED — these are
 * the canonical EN paths. {@link withLocaleVariants} derives the `/fr`, `/de` and
 * `/en` variants from this base so the old localized sitemap (which emitted e.g.
 * `/fr/blog/...`, `/de/agents/...`, `/en/privacy`) doesn't 404.
 */
const BASE_LEGACY_REDIRECTS: Redirect[] = [
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
  // Wildcard catch-all for any blog slug not in the curated list above.
  legacy('/blog/:slug', '/work'),
  // Wildcard catch-all for any agent slug not in the curated list above.
  legacy('/agents/:slug', '/about'),

  // --- Legacy clients page folded into /work.
  legacy('/clients', '/work'),

  // --- Legal pages moved under /legal.
  legacy('/privacy', '/legal/privacy'),
  legacy('/terms', '/legal/terms'),
];

/**
 * Expand a base rule into itself plus its locale-prefixed variants.
 *
 * With `localePrefix: 'as-needed'` the EN canonical is unprefixed, but the old
 * localized sitemap published `/fr<source>`, `/de<source>` and (sometimes) an
 * explicit `/en<source>`. Each of those must 301 to the locale-appropriate
 * destination: `/fr<dest>` / `/de<dest>` for fr/de, and the bare `<dest>` for the
 * explicit-en form (since en is now unprefixed). Wildcard params (`:slug`,
 * `:path*`) are carried through unchanged in both source and destination.
 */
function withLocaleVariants(rule: Redirect): Redirect[] {
  const out: Redirect[] = [rule];
  for (const loc of KEPT_LOCALES) {
    const source = `/${loc}${rule.source}`;
    // The explicit /en prefix is no longer canonical, so it folds to the
    // unprefixed destination; fr/de keep their prefix on the destination too.
    const dest =
      loc === 'en'
        ? rule.destination
        : rule.destination === '/'
          ? `/${loc}`
          : `/${loc}${rule.destination}`;
    out.push(legacy(source, dest));
  }
  return out;
}

/**
 * Per-URL legacy 301s. Each entry maps to a real new equivalent — NEVER a blanket
 * redirect to home for deep slugs. The base list is expanded with locale variants
 * so locale-prefixed legacy URLs (`/fr/blog/...`, `/de/agents/...`) don't 404.
 * Ordering: concrete rules (+ their locale variants), then the dropped-locale folds.
 */
export const LEGACY_REDIRECTS: Redirect[] = [
  ...BASE_LEGACY_REDIRECTS.flatMap(withLocaleVariants),

  // --- Dropped-locale folds: collapse the 8 removed locale prefixes onto the EN
  //     default. These already match any path on a dropped locale, so they are NOT
  //     locale-expanded (a `/fr/lb/:path*` would be meaningless).
  ...DROPPED_LOCALES.map((loc) => legacy(`/${loc}/:path*`, '/:path*')),
];

/** next.config.mjs redirects() returns this: host rules first, then per-URL. */
export function allRedirects(): Redirect[] {
  return [...HOST_REDIRECTS, ...LEGACY_REDIRECTS];
}
