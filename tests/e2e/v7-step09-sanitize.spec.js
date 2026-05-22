// tests/e2e/v7-step09-sanitize.spec.js
const { test, expect } = require('@playwright/test');

test('v7-step09: DOMPurify loaded on resources.html', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('#catalog-content h2', { timeout: 8000 });
  const exists = await page.evaluate(() => typeof window.DOMPurify !== 'undefined');
  expect(exists).toBe(true);
});

test('v7-step09: DOMPurify strips script tags from rendered content', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('#catalog-content h2', { timeout: 8000 });
  const scriptCount = await page.evaluate(() => {
    const fixture = '<h2>Test</h2><script>alert(1)<\/script>';
    const raw = marked.parse(fixture);
    const clean = DOMPurify.sanitize(raw);
    const tmp = document.createElement('div');
    tmp.innerHTML = clean;
    return tmp.querySelectorAll('script').length;
  });
  expect(scriptCount).toBe(0);
});

test('v7-step09: missing Tier4 section shows Schema mismatch error', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('#catalog-content h2', { timeout: 8000 });
  await page.evaluate(() => {
    // Stub renderCatalog to simulate missing section
    ResourcesLoader.renderCatalog('## AI 使用決策矩陣\n\n## 9 個資源詳述\n\nno tier4 here');
  });
  const visible = await page.locator('#catalog-error').isVisible();
  const text = await page.evaluate(() =>
    document.getElementById('catalog-error').textContent
  );
  expect(visible).toBe(true);
  expect(text).toContain('Schema mismatch');
});

test('v7-step09: DOMPurify missing shows sanitizer load fail error', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('#catalog-content h2', { timeout: 8000 });
  await page.evaluate(() => {
    var orig = window.DOMPurify;
    window.DOMPurify = undefined;
    ResourcesLoader.renderCatalog('## AI 使用決策矩陣\n\n## 9 個資源詳述\n\n## Tier 4\n\ncontent');
    window.DOMPurify = orig;
  });
  const visible = await page.locator('#catalog-error').isVisible();
  const text = await page.evaluate(() =>
    document.getElementById('catalog-error').textContent
  );
  expect(visible).toBe(true);
  expect(text).toContain('sanitizer load fail');
});

test('v7-step09: normal render produces at least 3 h2 headings', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('#catalog-content h2', { timeout: 8000 });
  const count = await page.locator('#catalog-content h2').count();
  expect(count).toBeGreaterThanOrEqual(3);
});
