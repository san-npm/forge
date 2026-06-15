import { test, expect } from '@playwright/test';

test.use({ contextOptions: { reducedMotion: 'reduce' } });

test.describe('prefers-reduced-motion: reduce', () => {
  test('content is fully visible with no spectacle', async ({ page }) => {
    await page.goto('/');
    const h1 = page.getByRole('heading', { level: 1 });
    await expect(h1).toBeVisible();
    // LCP node must be fully opaque even with motion reduced
    await expect(h1).toHaveCSS('opacity', '1');
  });

  test('the sub-line reveal still ends visible (reduced != stripped)', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('A Luxembourg AI agency.')).toBeVisible();
  });

  test('the enquiry form is reachable and usable', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /start a project/i }).first().click();
    await expect(page.getByLabel(/name/i)).toBeVisible();
  });
});
