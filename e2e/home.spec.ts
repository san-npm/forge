import { test, expect } from '@playwright/test';

test.describe('homepage', () => {
  test('loads at / with the LCP H1 visible', async ({ page }) => {
    await page.goto('/');
    const h1 = page.getByRole('heading', { level: 1 });
    await expect(h1).toBeVisible();
    await expect(h1).toHaveText(/think, move & transact/i);
  });

  test('renders all 8 in-page homepage sections (footer is layout-level)', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('[data-section]')).toHaveCount(8);
  });

  test('"Start a project" reaches the enquiry form', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /start a project/i }).first().click();
    await expect(page.locator('#enquiry')).toBeInViewport();
    await expect(page.locator('#enquiry [data-enquiry-form]')).toBeVisible();
  });

  test('the H1 paints regardless of the live proof strip', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('the layout-level Nav and Footer wrap the page', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('[data-nav]')).toBeVisible();
    await expect(page.locator('[data-footer]')).toBeVisible();
    // the footer's newsletter form is present (layout-level, not a section)
    await expect(page.locator('[data-footer] [data-newsletter-form]')).toBeAttached();
  });
});
