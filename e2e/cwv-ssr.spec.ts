import { test, expect, request } from '@playwright/test';
import { STUDIO } from '@/data/studio';
import { CONTACT } from '@/data/contact';
import { START_PROJECT } from '@/data/nav';
import { HOME_SECTIONS } from '@/data/pages/home';
import type { HeroSectionProps } from '@/lib/schema';

// Pull the canonical hero H1 from the homepage Section[] (single source of truth).
const HERO = HOME_SECTIONS.find((s) => s.type === 'hero') as HeroSectionProps;

// CWV budgets (spec §1 success criteria).
const LCP_BUDGET_MS = 2000;
const CLS_BUDGET = 0.1;

// The H1 is a real, full-opacity SSR node, but the kinetic headline wraps accent
// words in <span> and React injects <!-- --> text-split markers, so the copy is
// present yet not a contiguous substring of the raw markup. Crawlers extract text
// content, so we do the same: strip comments + tags, decode entities, collapse
// whitespace, THEN substring-match. This keeps the assertion exact (the copy must
// really be in the served HTML text) without failing on intra-text markup.
function ssrText(html: string): string {
  return html
    .replace(/<!--.*?-->/gs, '')
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

type CwvPage = { path: string; ssrMustContain: string[] };

const PAGES: CwvPage[] = [
  { path: '/', ssrMustContain: [HERO.h1, STUDIO.welcomeLead, START_PROJECT] },
  { path: '/work', ssrMustContain: [START_PROJECT] },
  { path: '/contact', ssrMustContain: [CONTACT.lead, START_PROJECT] },
];

test.describe('Core Web Vitals budget', () => {
  for (const { path } of PAGES) {
    test(`LCP < ${LCP_BUDGET_MS}ms and CLS < ${CLS_BUDGET} on ${path}`, async ({ page }) => {
      await page.goto(path, { waitUntil: 'load' });

      // Largest Contentful Paint — last reported entry before load settles.
      const lcp = await page.evaluate(
        () =>
          new Promise<number>((resolve) => {
            let last = 0;
            new PerformanceObserver((list) => {
              for (const e of list.getEntries()) last = (e as PerformanceEntry & { startTime: number }).startTime;
            }).observe({ type: 'largest-contentful-paint', buffered: true });
            // give late LCP candidates a beat, then resolve.
            setTimeout(() => resolve(last), 600);
          }),
      );
      expect(lcp, `LCP on ${path}`).toBeLessThan(LCP_BUDGET_MS);

      // Cumulative Layout Shift — sum of non-input shifts.
      const cls = await page.evaluate(
        () =>
          new Promise<number>((resolve) => {
            let total = 0;
            new PerformanceObserver((list) => {
              for (const e of list.getEntries()) {
                const ls = e as PerformanceEntry & { value: number; hadRecentInput: boolean };
                if (!ls.hadRecentInput) total += ls.value;
              }
            }).observe({ type: 'layout-shift', buffered: true });
            setTimeout(() => resolve(total), 600);
          }),
      );
      expect(cls, `CLS on ${path}`).toBeLessThan(CLS_BUDGET);
    });
  }
});

test.describe('SSR / AI-crawler content (JavaScript disabled)', () => {
  for (const { path, ssrMustContain } of PAGES) {
    test(`raw SSR HTML for ${path} carries H1 + primary copy`, async ({ baseURL }) => {
      // Fetch the server-rendered HTML directly — no browser, no JS execution.
      const ctx = await request.newContext({ baseURL });
      const res = await ctx.get(path);
      expect(res.status(), `status for ${path}`).toBe(200);
      const html = await res.text();
      const text = ssrText(html);
      for (const needle of ssrMustContain) {
        expect(text, `SSR HTML for ${path} must contain "${needle}"`).toContain(needle);
      }
      // The LCP H1 must NOT be hidden at opacity:0 in the static markup.
      expect(html, `SSR HTML for ${path} must not pre-hide content`).not.toMatch(/opacity:\s*0[^.\d]/);
      await ctx.dispose();
    });
  }
});
