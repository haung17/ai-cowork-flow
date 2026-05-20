// tests/e2e/v6-step05-debounce.spec.js
const { test, expect } = require('@playwright/test');

async function openSearch(page) {
  await page.goto('/resources.html');
  await page.waitForSelector('#catalog-content h3', { timeout: 8000 });
  const btn = page.locator('#search-btn');
  await btn.click();
  await page.waitForSelector('#search-input', { timeout: 5000 });
}

test('v6-step05: typing 10 chars quickly triggers search handler at most 2 times', async ({ page }) => {
  await openSearch(page);

  // Patch ResourcesLoader._handleSearchInput — current listener calls it via property lookup,
  // so patching the property intercepts calls both with and without debounce
  await page.evaluate(() => {
    window.__handlerCallCount = 0;
    var orig = ResourcesLoader._handleSearchInput;
    ResourcesLoader._handleSearchInput = function() {
      window.__handlerCallCount++;
      return orig.apply(ResourcesLoader, arguments);
    };
  });

  // Type '工' 10 times at 20ms intervals (total ~200ms burst)
  const input = page.locator('#search-input');
  for (let i = 0; i < 10; i++) {
    await input.pressSequentially('工', { delay: 0 });
    await page.waitForTimeout(20);
  }

  // Wait 400ms for debounce to settle
  await page.waitForTimeout(400);

  const count = await page.evaluate(() => window.__handlerCallCount);
  expect(count).toBeLessThanOrEqual(2);
});

test('v6-step05: result appears within 300ms after last keystroke (trailing edge fires)', async ({ page }) => {
  await openSearch(page);

  const input = page.locator('#search-input');
  await input.fill('工程師');

  // Wait for debounce (250ms) + render buffer (100ms) = 350ms total
  await page.waitForTimeout(350);

  const resultCount = await page.locator('#search-results .search-result-item').count();
  expect(resultCount).toBeGreaterThan(0);
});

test('v6-step05: search for 工程師 returns relevant results (no regression)', async ({ page }) => {
  await openSearch(page);

  const input = page.locator('#search-input');
  await input.fill('工程師');

  await page.waitForTimeout(400);

  const items = await page.locator('#search-results .search-result-item').all();
  expect(items.length).toBeGreaterThan(0);

  const firstText = await items[0].textContent();
  expect(firstText.toLowerCase()).toMatch(/工程師|engineer/i);
});
