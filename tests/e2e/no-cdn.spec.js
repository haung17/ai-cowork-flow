// tests/e2e/no-cdn.spec.js
const { test, expect } = require('@playwright/test');

test('no-cdn: resources.html renders with CDN blocked', async ({ page }) => {
  await page.route('**/cdn.jsdelivr.net/**', route => route.abort());
  await page.route('**/fonts.googleapis.com/**', route => route.abort());
  await page.route('**/fonts.gstatic.com/**', route => route.abort());
  await page.goto('/resources.html');
  await page.waitForSelector('#catalog-content h3', { timeout: 8000 });
  const count = await page.locator('#catalog-content h3').count();
  expect(count).toBeGreaterThanOrEqual(9);
});

test('no-cdn: dashboard.html renders with CDN blocked', async ({ page }) => {
  await page.route('**/fonts.googleapis.com/**', route => route.abort());
  await page.route('**/fonts.gstatic.com/**', route => route.abort());
  await page.goto('/dashboard.html');
  await page.waitForSelector('#nav-list', { timeout: 8000 });
  const nav = await page.locator('#nav-list').isVisible();
  expect(nav).toBe(true);
});

test('no-cdn: no external font or CDN requests made', async ({ page }) => {
  const externalRequests = [];
  page.on('request', req => {
    const url = req.url();
    if (url.includes('googleapis') || url.includes('gstatic') || url.includes('jsdelivr')) {
      externalRequests.push(url);
    }
  });
  await page.goto('/resources.html');
  await page.waitForSelector('#catalog-content h3', { timeout: 8000 });
  expect(externalRequests.length).toBe(0);
});
