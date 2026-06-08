import { describe, it, expect } from 'vitest';
import { HOST_REDIRECTS, LEGACY_REDIRECTS, allRedirects } from './redirects';
import { SITE_URL } from './site-config';

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
      expect(r.destination).not.toBe('/'); // never blanket-redirect a deep URL to home
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
