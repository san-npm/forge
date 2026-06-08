import { describe, it, expect } from 'vitest';
import { HOST_REDIRECTS, LEGACY_REDIRECTS, allRedirects } from './redirects';
import { SITE_URL } from './site-config';

// The real killed legacy slugs (verified against the repo before deletion).
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

describe('HOST_REDIRECTS', () => {
  it('canonicalizes every non-apex host to the openletz.ai apex', () => {
    for (const r of HOST_REDIRECTS) {
      expect(r.destination.startsWith(SITE_URL)).toBe(true);
      expect(r.permanent).toBe(true);
      expect(r.has?.[0]?.type).toBe('host');
    }
  });

  it('inverts the old .com rule: .com is a SOURCE host, never a destination', () => {
    const sources = HOST_REDIRECTS.map((r) => r.has?.[0]?.value);
    expect(sources).toContain('openletz.com');
    expect(sources).toContain('www.openletz.com');
    for (const r of HOST_REDIRECTS) {
      expect(r.destination).not.toMatch(/openletz\.com/);
      expect(r.destination).not.toMatch(/www\.openletz\.ai/);
    }
  });

  it('redirects www.openletz.ai to the apex', () => {
    const sources = HOST_REDIRECTS.map((r) => r.has?.[0]?.value);
    expect(sources).toContain('www.openletz.ai');
  });

  it('never lists the apex openletz.ai as a source host (no self-redirect loop)', () => {
    const sources = HOST_REDIRECTS.map((r) => r.has?.[0]?.value);
    expect(sources).not.toContain('openletz.ai');
  });

  it('has no duplicate source hosts', () => {
    const sources = HOST_REDIRECTS.map((r) => r.has?.[0]?.value);
    expect(new Set(sources).size).toBe(sources.length);
  });
});

describe('LEGACY_REDIRECTS', () => {
  it('is a typed array (per-URL 301s populated in Phase 2)', () => {
    expect(Array.isArray(LEGACY_REDIRECTS)).toBe(true);
    for (const r of LEGACY_REDIRECTS) {
      expect(r.permanent).toBe(true);
      // deep content slugs (agents/*, aides/*, blog/*) must never blanket-redirect to home;
      // index pages (/aides, /blog) and locale folds (/:path*) may redirect to /
      const isContentSlug = (
        r.source.startsWith('/agents/') ||
        r.source.startsWith('/aides/') ||
        r.source.startsWith('/blog/')
      );
      if (isContentSlug) {
        expect(r.destination).not.toBe('/');
      }
    }
  });

  it('has no source that is also a host destination', () => {
    const legacySources = LEGACY_REDIRECTS.map((r) => r.source);
    for (const src of legacySources) {
      expect(src).not.toMatch(/openletz\.(com|ai)/);
    }
  });
});

describe('allRedirects', () => {
  it('concatenates host rules then legacy rules', () => {
    expect(allRedirects()).toEqual([...HOST_REDIRECTS, ...LEGACY_REDIRECTS]);
  });
});

const sources = () => LEGACY_REDIRECTS.map((r) => r.source);

describe('LEGACY_REDIRECTS coverage', () => {
  it('every redirect is a permanent 301', () => {
    for (const r of LEGACY_REDIRECTS) expect(r.permanent).toBe(true);
  });

  it('redirects the /aides index and all 6 program slugs', () => {
    const s = sources();
    expect(s).toContain('/aides');
    for (const slug of AIDES_SLUGS) expect(s).toContain(`/aides/${slug}`);
  });

  it('redirects the /agents index and all 33 agent slugs', () => {
    const s = sources();
    expect(s).toContain('/agents');
    for (const slug of AGENT_SLUGS) expect(s).toContain(`/agents/${slug}`);
  });

  it('redirects the old /blog index and all 7 posts', () => {
    const s = sources();
    expect(s).toContain('/blog');
    for (const slug of BLOG_SLUGS) expect(s).toContain(`/blog/${slug}`);
  });

  it('redirects /clients', () => {
    expect(sources()).toContain('/clients');
  });

  it('folds every dropped locale prefix to its unprefixed equivalent', () => {
    const s = sources();
    for (const loc of DROPPED_LOCALES) expect(s).toContain(`/${loc}/:path*`);
  });

  it('preserves the RGPD/DSGVO/DPA cluster by sending agents to the trust block', () => {
    const agentRules = LEGACY_REDIRECTS.filter((r) => r.source.startsWith('/agents/'));
    expect(agentRules.length).toBeGreaterThan(0);
    for (const r of agentRules) expect(r.destination).toBe('/about');
  });

  it('has no duplicate sources', () => {
    const s = sources();
    expect(new Set(s).size).toBe(s.length);
  });

  it('never maps a real content slug straight to home', () => {
    const contentRules = LEGACY_REDIRECTS.filter(
      (r) =>
        r.source.startsWith('/agents/') ||
        r.source.startsWith('/aides/') ||
        r.source.startsWith('/blog/'),
    );
    for (const r of contentRules) expect(r.destination).not.toBe('/');
  });
});
