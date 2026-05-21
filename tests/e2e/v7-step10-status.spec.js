// tests/e2e/v7-step10-status.spec.js
const { test, expect } = require('@playwright/test');

test('v7-step10: all 9 resources have status-badge', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('.status-badge', { timeout: 8000 });
  const count = await page.locator('#catalog-content .status-badge').count();
  expect(count).toBe(9);
});

test('v7-step10: badge CSS class matches status slug', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('.status-badge', { timeout: 8000 });
  const hasSlugClass = await page.evaluate(() => {
    const badge = document.querySelector('#catalog-content .status-badge');
    return badge && (
      badge.classList.contains('status-draftready') ||
      badge.classList.contains('status-internallytested') ||
      badge.classList.contains('status-clienttested') ||
      badge.classList.contains('status-needshumangate') ||
      badge.classList.contains('status-notrecommended')
    );
  });
  expect(hasSlugClass).toBe(true);
});

test('v7-step10: status-meta row shows usability and nextStep', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('.status-meta', { timeout: 8000 });
  const text = await page.evaluate(() =>
    document.querySelector('#catalog-content .status-meta').textContent
  );
  expect(text).toContain('可用程度');
  expect(text).toContain('下一步');
});

test('v7-step10: clicking badge opens governance.html in new tab', async ({ page, context }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('.status-badge', { timeout: 8000 });
  const [newPage] = await Promise.all([
    context.waitForEvent('page', { timeout: 8000 }),
    page.locator('#catalog-content .status-badge').first().click()
  ]);
  await newPage.waitForLoadState('domcontentloaded');
  expect(newPage.url()).toContain('governance.html');
  await newPage.close();
});

test('v7-step10: _STATUS_MAP covers 5 status keys', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('.status-badge', { timeout: 8000 });
  const keys = await page.evaluate(() => Object.keys(ResourcesLoader._STATUS_MAP));
  expect(keys).toContain('DraftReady');
  expect(keys).toContain('InternallyTested');
  expect(keys).toContain('ClientTested');
  expect(keys).toContain('NeedsHumanGate');
  expect(keys).toContain('NotRecommended');
  expect(keys.length).toBe(5);
});
