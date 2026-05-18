// tests/unit/catalog-parse.spec.js
const { test, expect } = require('@playwright/test');

test('catalog: renders 一頁速查表 heading after load', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('#catalog-content h2', { timeout: 8000 });
  const h2texts = await page.locator('#catalog-content h2').allTextContents();
  expect(h2texts.some(t => t.includes('一頁速查表'))).toBe(true);
});

test('catalog: renders at least 9 h3 section headings', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('#catalog-content h3', { timeout: 8000 });
  const count = await page.locator('#catalog-content h3').count();
  expect(count).toBeGreaterThanOrEqual(9);
});

test('catalog: renders at least 1 table', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('#catalog-content table', { timeout: 8000 });
  const count = await page.locator('#catalog-content table').count();
  expect(count).toBeGreaterThanOrEqual(1);
});

test('catalog: renders at least 9 code blocks', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('#catalog-content pre code', { timeout: 8000 });
  const count = await page.locator('#catalog-content pre code').count();
  expect(count).toBeGreaterThanOrEqual(9);
});

test('catalog: tables are wrapped in .table-wrapper', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('.table-wrapper', { timeout: 8000 });
  const wrappers = await page.locator('.table-wrapper').count();
  expect(wrappers).toBeGreaterThanOrEqual(1);
});

test('catalog: shows error element when fetch fails', async ({ page }) => {
  await page.route('**/resources-catalog.md', route => route.abort());
  await page.goto('/resources.html');
  await page.waitForSelector('#catalog-error:not(.hidden)', { timeout: 8000 });
  await expect(page.locator('#catalog-error')).not.toHaveClass(/hidden/);
  await expect(page.locator('#catalog-error')).toContainText('無法載入');
});
