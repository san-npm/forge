import { describe, it, expect, vi, afterEach } from 'vitest';
import { promises as dnsPromises } from 'node:dns';
import {
  normalizeAuditUrl,
  isBlockedHost,
  assertHostAllowed,
  safeAuditFetch,
  extractSignals,
} from '@/lib/audit-fetch';

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

  it('blocks IPv4-mapped IPv6 loopback (::ffff:127.0.0.1)', () => {
    expect(isBlockedHost('::ffff:127.0.0.1')).toBe(true);
    expect(isBlockedHost('[::ffff:127.0.0.1]')).toBe(true);
  });

  it('blocks IPv6 loopback, unique-local and link-local literals', () => {
    expect(isBlockedHost('::1')).toBe(true);
    expect(isBlockedHost('[::1]')).toBe(true);
    expect(isBlockedHost('fc00::1')).toBe(true); // uniqueLocal (fc00::/7)
    expect(isBlockedHost('fe80::1')).toBe(true); // linkLocal (fe80::/10)
  });

  it('blocks carrier-grade NAT range (100.64.0.1)', () => {
    expect(isBlockedHost('100.64.0.1')).toBe(true); // 100.64/10
  });

  it('blocks non-canonical IPv4 forms (octal / hex / integer)', () => {
    expect(isBlockedHost('0177.0.0.1')).toBe(true); // octal loopback
    expect(isBlockedHost('0x7f.0.0.1')).toBe(true); // hex loopback
    expect(isBlockedHost('2130706433')).toBe(true); // integer 127.0.0.1
  });

  it('blocks empty / whitespace-only hosts', () => {
    expect(isBlockedHost('')).toBe(true);
    expect(isBlockedHost('   ')).toBe(true);
  });

  it('blocks *.localhost and *.local names', () => {
    expect(isBlockedHost('foo.localhost')).toBe(true);
    expect(isBlockedHost('printer.local')).toBe(true);
  });
});

describe('assertHostAllowed (DNS-aware SSRF guard)', () => {
  afterEach(() => vi.restoreAllMocks());

  it('rejects a hostname that resolves to a private/loopback address', async () => {
    vi.spyOn(dnsPromises, 'lookup').mockResolvedValue(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [{ address: '127.0.0.1', family: 4 }] as any,
    );
    await expect(assertHostAllowed('rebind.evil.example')).rejects.toThrow();
  });

  it('rejects when ANY resolved address is blocked (mixed records)', async () => {
    vi.spyOn(dnsPromises, 'lookup').mockResolvedValue(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [
        { address: '93.184.216.34', family: 4 },
        { address: '10.0.0.5', family: 4 },
      ] as any,
    );
    await expect(assertHostAllowed('mixed.example')).rejects.toThrow();
  });

  it('rejects on DNS resolution failure', async () => {
    vi.spyOn(dnsPromises, 'lookup').mockRejectedValue(new Error('ENOTFOUND'));
    await expect(assertHostAllowed('does-not-exist.example')).rejects.toThrow();
  });

  it('allows a hostname that resolves only to public addresses', async () => {
    vi.spyOn(dnsPromises, 'lookup').mockResolvedValue(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [{ address: '93.184.216.34', family: 4 }] as any,
    );
    await expect(assertHostAllowed('example.com')).resolves.toBeUndefined();
  });
});

describe('safeAuditFetch (per-hop redirect validation)', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('blocks a redirect whose Location points at an internal host', async () => {
    // Public hostname resolves fine...
    vi.spyOn(dnsPromises, 'lookup').mockImplementation(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (async (host: string) => {
        if (host === 'evil.example') return [{ address: '93.184.216.34', family: 4 }];
        throw new Error('ENOTFOUND');
      }) as any,
    );
    // ...but it 302-redirects to the cloud metadata endpoint.
    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        new Response(null, {
          status: 302,
          headers: { location: 'http://169.254.169.254/latest/meta-data' },
        }),
      ),
    );
    await expect(
      safeAuditFetch('https://evil.example', { signal: AbortSignal.timeout(2000) }),
    ).rejects.toThrow();
  });

  it('follows a redirect to another public host and returns the final response', async () => {
    vi.spyOn(dnsPromises, 'lookup').mockResolvedValue(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [{ address: '93.184.216.34', family: 4 }] as any,
    );
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url === 'https://start.example/') {
        return new Response(null, {
          status: 301,
          headers: { location: 'https://final.example/page' },
        });
      }
      return new Response('<html><title>ok</title></html>', { status: 200 });
    });
    vi.stubGlobal('fetch', fetchMock);
    const { response, finalUrl } = await safeAuditFetch('https://start.example', {
      signal: AbortSignal.timeout(2000),
    });
    expect(finalUrl).toBe('https://final.example/page');
    expect(response.status).toBe(200);
  });

  it('throws after exceeding the redirect cap', async () => {
    vi.spyOn(dnsPromises, 'lookup').mockResolvedValue(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [{ address: '93.184.216.34', family: 4 }] as any,
    );
    let n = 0;
    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        new Response(null, {
          status: 302,
          headers: { location: `https://hop${n++}.example/` },
        }),
      ),
    );
    await expect(
      safeAuditFetch('https://loop.example', { signal: AbortSignal.timeout(2000) }),
    ).rejects.toThrow(/too many redirects/i);
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

  it('detects meta tags with attributes in reversed order (content before name)', () => {
    const reversed = `<!doctype html><html><head>
      <meta content="width=device-width, initial-scale=1" name="viewport">
      <meta content="${'y'.repeat(120)}" name="description">
      <meta content="Reversed OG" property="og:title">
      </head><body><h1>x</h1></body></html>`;
    const s = extractSignals('https://example.com/', reversed, {
      robotsTxt: false, sitemap: false, llmsTxt: false,
    });
    expect(s.hasViewport).toBe(true);
    expect(s.hasMetaDescription).toBe(true);
    expect(s.metaDescriptionLength).toBe(120);
    expect(s.hasOpenGraph).toBe(true);
  });
});
