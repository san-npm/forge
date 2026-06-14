import { test, expect } from '@playwright/test';
import { STUDIO } from '@/data/studio';
import { START_PROJECT } from '@/data/nav';
import { HOME_SECTIONS } from '@/data/pages/home';
import type { HeroSectionProps } from '@/lib/schema';

const HERO = HOME_SECTIONS.find((s) => s.type === 'hero') as HeroSectionProps;

// Emulate reduced-motion for every test in this file. Use the contextOptions
// form (not the top-level `reducedMotion` fixture): in this Playwright setup
// only contextOptions actually flips the `prefers-reduced-motion` media feature
// — matching the working e2e/reduced-motion.spec.ts. With the top-level form the
// media query stays unmatched and the kill-switch assertion below is moot.
test.use({ contextOptions: { reducedMotion: 'reduce' } });

const ROUTES = ['/', '/work', '/about', '/contact'];

test.describe('prefers-reduced-motion: reduce — content visible, no spectacle', () => {
  test('home hero H1 + lead + CTA are visible and fully opaque', async ({ page }) => {
    await page.goto('/', { waitUntil: 'load' });

    const h1 = page.getByRole('heading', { level: 1, name: HERO.h1 });
    await expect(h1).toBeVisible();
    // LCP node must be at full opacity even with motion reduced.
    const h1Opacity = await h1.evaluate((el) => getComputedStyle(el).opacity);
    expect(Number(h1Opacity)).toBe(1);

    await expect(page.getByText(STUDIO.welcomeLead, { exact: false })).toBeVisible();
    await expect(page.getByRole('link', { name: START_PROJECT }).first()).toBeVisible();
  });

  test('reduce maps motion durations to ~0 (global kill-switch active)', async ({ page }) => {
    await page.goto('/', { waitUntil: 'load' });
    // tokens.css global rule sets transition-duration: 0.01ms !important under reduce.
    const dur = await page.evaluate(() => {
      const probe = document.createElement('div');
      probe.style.transition = 'opacity var(--dur-base) var(--ease-out)';
      document.body.appendChild(probe);
      const d = getComputedStyle(probe).transitionDuration;
      probe.remove();
      return d;
    });
    // Either the kill-switch flattened it (~0s) or it never animated. Accept both.
    expect(['0s', '0.01ms', '1e-05s']).toContain(dur);
  });

  for (const route of ROUTES) {
    test(`every section on ${route} is reachable (no element stuck at opacity:0)`, async ({ page }) => {
      await page.goto(route, { waitUntil: 'load' });
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      // No reveal element should remain invisible after scroll under reduced-motion.
      const stuck = await page.evaluate(() => {
        const els = Array.from(document.querySelectorAll('[data-reveal]'));
        return els.filter((el) => Number(getComputedStyle(el as HTMLElement).opacity) < 0.99).length;
      });
      expect(stuck, `${route} has reveal elements stuck below full opacity under reduced-motion`).toBe(0);
    });
  }
});
