import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { POST } from '@/app/api/audit/route';

function req(body: unknown, ip = '1.2.3.4'): Request {
  return new Request('https://openletz.ai/api/audit', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-forwarded-for': ip },
    body: JSON.stringify(body),
  });
}

const PAGE_HTML =
  '<!doctype html><html><head><title>Example Domain title here</title>' +
  '<meta name="description" content="' + 'd'.repeat(120) + '">' +
  '<meta name="viewport" content="width=device-width">' +
  '</head><body><h1>Example</h1><p>Real visible text content body here.</p></body></html>';

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn(async (input: RequestInfo | URL) => {
    const url = String(input);
    if (url.endsWith('/robots.txt')) return new Response('User-agent: *', { status: 200 });
    if (url.endsWith('/sitemap.xml')) return new Response('<urlset/>', { status: 200 });
    if (url.endsWith('/llms.txt')) return new Response('not found', { status: 404 });
    return new Response(PAGE_HTML, { status: 200, headers: { 'content-type': 'text/html' } });
  }));
});
afterEach(() => vi.unstubAllGlobals());

describe('POST /api/audit', () => {
  it('returns 200 with score, grade and checks for a valid URL', async () => {
    const res = await POST(req({ url: 'https://example.com' }, '10.0.0.99'));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toHaveProperty('grade');
    expect(typeof json.score).toBe('number');
    expect(Array.isArray(json.checks)).toBe(true);
  });

  it('returns 400 for a missing URL', async () => {
    const res = await POST(req({}, '10.0.0.98'));
    expect(res.status).toBe(400);
  });

  it('returns 400 for a blocked SSRF host', async () => {
    const res = await POST(req({ url: 'http://169.254.169.254/latest/meta-data' }, '10.0.0.97'));
    expect(res.status).toBe(400);
  });

  it('rate-limits after 5 requests from one IP', async () => {
    const ip = '10.0.0.42';
    for (let i = 0; i < 5; i++) {
      const ok = await POST(req({ url: 'https://example.com' }, ip));
      expect(ok.status).toBe(200);
    }
    const blocked = await POST(req({ url: 'https://example.com' }, ip));
    expect(blocked.status).toBe(429);
  });
});
