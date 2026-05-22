// tests/e2e/dashboard-link.spec.js
const { test, expect } = require('@playwright/test');

test('dashboard-link: resources-link in sidebar nav', async ({ page }) => {
  await page.goto('/dashboard.html');
  await page.waitForSelector('#nav-list .nav-item');
  await expect(page.locator('#nav-list a[href="resources.html"]')).toBeVisible();
});

test('dashboard-link: resources-link opens new tab to resources.html', async ({ page, context }) => {
  await page.goto('/dashboard.html');
  await page.waitForSelector('#nav-list .nav-item');
  const [newPage] = await Promise.all([
    context.waitForEvent('page', { timeout: 10000 }),
    page.click('#nav-list a[href="resources.html"]')
  ]);
  await newPage.waitForLoadState();
  expect(newPage.url()).toContain('resources.html');
  await newPage.close();
});

test('dashboard-link: 資源對照 chapter appears in sidebar nav', async ({ page }) => {
  await page.goto('/dashboard.html');
  const navText = await page.locator('#nav-list').textContent();
  expect(navText).toContain('資源對照');
});

test('dashboard-link: 資源對照 chapter link opens new tab', async ({ page, context }) => {
  await page.goto('/dashboard.html');
  await page.waitForSelector('#nav-list .nav-item');
  const resourcesLink = page.locator('#nav-list a', { hasText: '資源對照' });
  const [newPage] = await Promise.all([
    context.waitForEvent('page', { timeout: 10000 }),
    resourcesLink.click()
  ]);
  await newPage.waitForLoadState();
  expect(newPage.url()).toContain('resources.html');
  await newPage.close();
});

test('dashboard-link: existing chapter summary uses anchor href not new tab', async ({ page }) => {
  await page.goto('/dashboard.html');
  await page.waitForSelector('#nav-list .nav-item a[data-id="summary"]');
  const summaryLink = page.locator('#nav-list a[data-id="summary"]');
  const href = await summaryLink.getAttribute('href');
  expect(href).toBe('#summary');
  const target = await summaryLink.getAttribute('target');
  expect(target).toBeNull();
});

test('dashboard-link: dashboard search shows 資源對照 result', async ({ page }) => {
  await page.goto('/dashboard.html');
  await page.keyboard.press('Control+k');
  await page.fill('#search-input', '資源');
  await page.waitForSelector('.search-result-item');
  const results = await page.locator('.search-result-item').allTextContents();
  expect(results.some(t => t.includes('資源對照'))).toBe(true);
});
