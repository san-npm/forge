import { describe, it, expect } from 'vitest';
import { normalizeAuditUrl, isBlockedHost, extractSignals } from '@/lib/audit-fetch';

describe('normalizeAuditUrl', () => {
  it('prepends https:// when no scheme is given', () => {
    expect(normalizeAuditUrl('example.com')).toBe('https://example.com/');
  });
  it('keeps an explicit https scheme', () => {
    expect(normalizeAuditUrl('https://example.com/path')).toBe('https://example.com/path');
  });
  it('rejects non-http(s) schemes', () => {
    expect(() => normalizeAuditUrl('ftp://example.com')).toThrow();
    expect(() => normalizeAuditUrl('javascript:alert(1)')).toThrow();
  });
  it('rejects garbage', () => {
    expect(() => normalizeAuditUrl('not a url')).toThrow();
  });
});

describe('isBlockedHost (SSRF guard)', () => {
  it('blocks localhost and loopback', () => {
    expect(isBlockedHost('localhost')).toBe(true);
    expect(isBlockedHost('127.0.0.1')).toBe(true);
  });
  it('blocks private ranges and metadata IP', () => {
    expect(isBlockedHost('10.0.0.1')).toBe(true);
    expect(isBlockedHost('192.168.1.1')).toBe(true);
    expect(isBlockedHost('169.254.169.254')).toBe(true);
  });
  it('allows a normal public host', () => {
    expect(isBlockedHost('openletz.ai')).toBe(false);
  });
});

describe('extractSignals', () => {
  const html = `<!doctype html><html><head>
    <title>A good clear title for the page</title>
    <meta name="viewport" content="width=device-width">
    <meta name="description" content="${'x'.repeat(140)}">
    <meta property="og:title" content="Hi">
    <link rel="canonical" href="https://example.com/">
    <script type="application/ld+json">{"@type":"Organization"}</script>
    </head><body><h1>Only heading</h1><p>Some real visible text content here.</p></body></html>`;

  it('reads title, meta, h1, og, canonical and structured data from raw HTML', () => {
    const s = extractSignals('https://example.com/', html, {
      robotsTxt: true, sitemap: true, llmsTxt: false,
    });
    expect(s.https).toBe(true);
    expect(s.hasTitle).toBe(true);
    expect(s.titleLength).toBeGreaterThan(15);
    expect(s.hasMetaDescription).toBe(true);
    expect(s.h1Count).toBe(1);
    expect(s.hasViewport).toBe(true);
    expect(s.hasOpenGraph).toBe(true);
    expect(s.hasCanonical).toBe(true);
    expect(s.hasStructuredData).toBe(true);
    expect(s.hasRobotsTxt).toBe(true);
    expect(s.hasSitemap).toBe(true);
    expect(s.hasLlmsTxt).toBe(false);
    expect(s.textBytes).toBeGreaterThan(0);
  });

  it('counts multiple h1s', () => {
    const s = extractSignals('http://x.test/', '<h1>a</h1><h1>b</h1>', { robotsTxt: false, sitemap: false, llmsTxt: false });
    expect(s.h1Count).toBe(2);
    expect(s.https).toBe(false);
  });
});
