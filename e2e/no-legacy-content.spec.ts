import { test, expect, request } from '@playwright/test';

// Regression net for the grants→AI-agency redesign. The old identity was a
// Luxembourg SME grants-eligibility simulator (OS-shell + quiz). This spec
// fetches the RAW SSR HTML for every public route and proves ZERO residual
// grants/quiz copy ships — in markup, inlined i18n, or client JS.
//
// Word-boundary matters: the consent flag `openletz-consent=granted` is legit
// and MUST NOT trip the net. `grants?` is anchored with \b so it matches
// "grant"/"grants" as whole words but not "granted"/"migrant"/"fragrant".
// `eligibilit\w*` / `simulat...\w*` are prefix matchers so "eligibility" and
// "simulator"/"simulateur" are caught despite a trailing word char.
const GRANTS_RE =
  /\b(?:grants?|subvention\w*|simulat(?:eur|or)\w*|fit ?4 ?(?:digital|ai)|aides?|eligibilit\w*|quiz)\b/i;

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
