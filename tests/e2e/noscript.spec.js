// tests/e2e/noscript.spec.js
const { test, expect } = require('@playwright/test');

test('noscript: banner visible when JS disabled', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/resources.html');
  const banner = page.locator('.noscript-banner');
  await expect(banner).toBeVisible();
  const text = await banner.textContent();
  expect(text).toContain('resources-catalog.md');
  await context.close();
});
