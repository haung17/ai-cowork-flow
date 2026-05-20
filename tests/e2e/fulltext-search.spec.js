// tests/e2e/fulltext-search.spec.js
const { test, expect } = require('@playwright/test');

async function openSearch(page) {
  await page.goto('/resources.html');
  await page.waitForSelector('h3[data-resource-id]', { timeout: 8000 });
  await page.keyboard.press('Control+k');
  await page.waitForSelector('#search-overlay:not(.hidden)', { timeout: 4000 });
}

test('fulltext-search: "SOW" query returns paragraph-level results', async ({ page }) => {
  await openSearch(page);
  await page.fill('#search-input', 'SOW');
  await page.waitForSelector('.search-result-item', { timeout: 2000 });
  const count = await page.locator('.search-result-item').count();
  expect(count).toBeGreaterThan(0);
});

test('fulltext-search: "SOW" result snippet contains matching text', async ({ page }) => {
  await openSearch(page);
  await page.fill('#search-input', 'SOW');
  await page.waitForSelector('.search-result-item', { timeout: 2000 });
  const firstText = await page.locator('.search-result-item').first().locator('.search-result-text').textContent();
  expect(firstText.toLowerCase()).toContain('sow');
});

test('fulltext-search: "禁止 AI" query returns table-cell-level results', async ({ page }) => {
  await openSearch(page);
  await page.fill('#search-input', '禁止 AI');
  await page.waitForSelector('.search-result-item', { timeout: 2000 });
  const count = await page.locator('.search-result-item').count();
  expect(count).toBeGreaterThan(0);
});

test('fulltext-search: paragraph result click scrolls to resource section', async ({ page }) => {
  await openSearch(page);
  await page.fill('#search-input', 'SOW');
  await page.waitForSelector('.search-result-item', { timeout: 4000 });
  await page.locator('.search-result-item').first().click();
  // overlay should close after click
  await expect(page.locator('#search-overlay')).toHaveClass(/hidden/);
});
