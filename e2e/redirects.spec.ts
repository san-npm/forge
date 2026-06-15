import { test, expect, request } from '@playwright/test';
import { LEGACY_REDIRECTS } from '@/lib/redirects';
import { SITE_URL } from '@/lib/site-config';

// Only the per-URL legacy redirects whose source is a concrete path (no
// wildcard/regex) can be hit literally. Host-canonicalization (HOST_REDIRECTS)
// needs a host header the dev server can't set, so it stays in the unit test.
const CONCRETE = LEGACY_REDIRECTS.filter(
  (r) => !r.source.includes(':') && !r.source.includes('*') && !r.has,
);

test.describe('legacy 301 redirects resolve live', () => {
  test('there are concrete legacy redirects to verify', () => {
    expect(CONCRETE.length).toBeGreaterThan(0);
  });

  for (const r of CONCRETE) {
    test(`${r.source} -> 301 -> ${r.destination}`, async ({ baseURL }) => {
      const ctx = await request.newContext({ baseURL });
      // Do NOT follow redirects — inspect the 301 itself.
      const res = await ctx.get(r.source, { maxRedirects: 0 });
      expect([301, 308], `${r.source} must be a permanent redirect`).toContain(res.status());

      const loc = res.headers()['location'] || '';
      const expected = r.destination.startsWith('http') ? r.destination : `${SITE_URL}${r.destination}`;
      // Compare path-normalized (host may be added by the platform).
      const norm = (u: string) => u.replace(/\/$/, '');
      expect(
        norm(loc) === norm(expected) || norm(loc) === norm(new URL(expected).pathname),
        `${r.source} should redirect to ${expected}, got ${loc}`,
      ).toBe(true);
      await ctx.dispose();
    });
  }

  test('no legacy source soft-404s to a blank page (destination is non-home OR intentional)', async ({ baseURL }) => {
    const ctx = await request.newContext({ baseURL });
    for (const r of CONCRETE) {
      const res = await ctx.get(r.source, { maxRedirects: 0 });
      expect(res.status(), `${r.source} returned ${res.status()} (expected a 30x)`).toBeGreaterThanOrEqual(301);
      expect(res.status()).toBeLessThan(400);
    }
    await ctx.dispose();
  });
});
