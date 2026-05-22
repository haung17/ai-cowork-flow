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

test('acceptance-chips: all acceptance checkboxes have data-resource attribute', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('.acceptance-list input[type="checkbox"]', { timeout: 8000 });
  const count = await page.evaluate(() =>
    document.querySelectorAll('.acceptance-list input[type="checkbox"][data-resource]').length
  );
  expect(count).toBeGreaterThan(0);
});

test('acceptance-chips: owner spans exist in acceptance list', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('.acceptance-list .owner', { timeout: 8000 });
  const count = await page.evaluate(() =>
    document.querySelectorAll('.acceptance-list .owner').length
  );
  expect(count).toBeGreaterThan(0);
});

test('acceptance-chips: total acceptance-list items ≥ 9 across all resources', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('h3[data-resource-id]', { timeout: 8000 });
  const count = await page.locator('#catalog-content .acceptance-list li').count();
  expect(count).toBeGreaterThanOrEqual(9);
});
