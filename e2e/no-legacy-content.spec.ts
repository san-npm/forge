import { test, expect, request } from '@playwright/test';

// Regression net for the grants→AI-agency redesign. The KILLED identity was the
// "Fit 4 Digital/AI" grants-CONSULTANT brand: an OS-shell homepage with an
// eligibility QUIZ. This spec fetches the RAW SSR HTML for every public route and
// proves those killed-identity artifacts never ship.
//
// IMPORTANT: generic funding vocabulary (grant / eligibility / 70% / subvention)
// is NOT matched — the SME Package is a LEGITIMATE current service the owner asked
// for, and its UI strings ("State grant", "Eligibility", the simulator) inline
// site-wide. So the net targets only the specific killed-brand markers: the
// "Fit 4 Digital/AI" positioning and the "quiz". The hard openletz_start_quiz tool
// and openletz.com host checks below remain the strongest signals.
const GRANTS_RE = /\b(?:fit ?4 ?(?:digital|ai)|quiz)\b/i;

const ROUTES = ['/', '/about', '/contact', '/pricing', '/services', '/work', '/insights'];

test.describe('no residual grants/quiz content in shipped HTML', () => {
  for (const path of ROUTES) {
    test(`${path} ships zero grants-era content`, async ({ baseURL }) => {
      const ctx = await request.newContext({ baseURL });
      const res = await ctx.get(path);
      expect(res.status(), `${path} responds 200`).toBe(200);
      const html = await res.text();

      // Core assertion: no grants/quiz/simulator/eligibility vocabulary anywhere
      // in the SSR HTML.
      const match = html.match(GRANTS_RE);
      expect(
        match,
        `${path} must not ship grants-era copy (matched: ${match?.[0] ?? 'none'})`,
      ).toBeNull();

      // The legacy quiz MCP tool must be gone from client JS / inline scripts.
      expect(
        html.includes('openletz_start_quiz'),
        `${path} must not ship the legacy openletz_start_quiz quiz tool`,
      ).toBe(false);

      // Canonical domain hygiene: the legacy .com host must never appear.
      expect(
        html.includes('openletz.com'),
        `${path} must not reference the legacy openletz.com host`,
      ).toBe(false);

      await ctx.dispose();
    });
  }
});
