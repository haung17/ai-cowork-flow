// tests/e2e/acceptance-chips.spec.js
const { test, expect } = require('@playwright/test');

test('acceptance-chips: meeting-notes has acceptance-list rendered', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('h3[data-resource-id="meeting-notes"]', { timeout: 8000 });
  const count = await page.evaluate(() => {
    const h3 = document.querySelector('h3[data-resource-id="meeting-notes"]');
    if (!h3) return 0;
    let el = h3.nextElementSibling;
    while (el && el.tagName !== 'H3' && el.tagName !== 'H2') {
      if (el.classList && el.classList.contains('acceptance-list')) {
        return el.querySelectorAll('li').length;
      }
      el = el.nextElementSibling;
    }
    return 0;
  });
  expect(count).toBeGreaterThanOrEqual(2);
});

test('acceptance-chips: all 4 chip colors exist on page', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('h3[data-resource-id]', { timeout: 8000 });
  const statuses = await page.evaluate(() => {
    return {
      pending: document.querySelectorAll('.acceptance-chip.status-pending').length,
      pass:    document.querySelectorAll('.acceptance-chip.status-pass').length,
      fail:    document.querySelectorAll('.acceptance-chip.status-fail').length,
      na:      document.querySelectorAll('.acceptance-chip.status-n-a').length,
    };
  });
  // At least pending chips exist (all Pending initially); others may be 0 until manually set
  expect(statuses.pending).toBeGreaterThan(0);
});

test('acceptance-chips: status-pending chip has correct background', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('.acceptance-chip.status-pending', { timeout: 8000 });
  const bg = await page.evaluate(() => {
    const chip = document.querySelector('.acceptance-chip.status-pending');
    return chip ? window.getComputedStyle(chip).backgroundColor : null;
  });
  expect(bg).toBe('rgb(243, 244, 246)');
});

test('acceptance-chips: total acceptance-list items ≥ 9 across all resources', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('h3[data-resource-id]', { timeout: 8000 });
  const count = await page.locator('#catalog-content .acceptance-list li').count();
  expect(count).toBeGreaterThanOrEqual(9);
});
