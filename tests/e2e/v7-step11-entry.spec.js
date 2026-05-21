// tests/e2e/v7-step11-entry.spec.js
const { test, expect } = require('@playwright/test');

test('v7-step11: dashboard sidebar contains 資源對照 text', async ({ page }) => {
  await page.goto('/dashboard.html');
  await page.waitForSelector('#nav-list', { timeout: 8000 });
  const text = await page.locator('#nav-list').textContent();
  expect(text).toContain('資源對照');
  // ⊟ must not appear as link text in nav
  expect(text).not.toContain('⊟');
});

test('v7-step11: dashboard sidebar contains 治理規則 link', async ({ page }) => {
  await page.goto('/dashboard.html');
  await page.waitForSelector('#nav-list', { timeout: 8000 });
  const link = await page.locator('#nav-list a[href*="governance.html"]').count();
  expect(link).toBeGreaterThan(0);
});

test('v7-step11: no ⊟ symbol visible in dashboard DOM', async ({ page }) => {
  await page.goto('/dashboard.html');
  await page.waitForSelector('#nav-list', { timeout: 8000 });
  const hasSymbol = await page.evaluate(() =>
    document.body.textContent.includes('⊟')
  );
  expect(hasSymbol).toBe(false);
});

test('v7-step11: resources search panel has 5 quick-decision-chips', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('#catalog-content h2', { timeout: 8000 });
  // Open search overlay
  await page.keyboard.press('Control+k');
  await page.waitForSelector('.quick-decision-chip', { timeout: 4000 });
  const count = await page.locator('.quick-decision-chip').count();
  expect(count).toBe(5);
});

test('v7-step11: clicking chip closes overlay and scrolls to section', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('#catalog-content h2', { timeout: 8000 });
  await page.keyboard.press('Control+k');
  await page.waitForSelector('.quick-decision-chip', { timeout: 4000 });
  await page.locator('.quick-decision-chip').first().click();
  // Overlay should be hidden
  const overlayHidden = await page.evaluate(() =>
    document.getElementById('search-overlay').classList.contains('hidden')
  );
  expect(overlayHidden).toBe(true);
});

test('v7-step11: governance link opens in new tab (target=_blank)', async ({ page }) => {
  await page.goto('/dashboard.html');
  await page.waitForSelector('#nav-list a[href*="governance.html"]', { timeout: 8000 });
  const target = await page.evaluate(() => {
    const a = document.querySelector('#nav-list a[href*="governance.html"]');
    return a ? a.target : null;
  });
  expect(target).toBe('_blank');
});
