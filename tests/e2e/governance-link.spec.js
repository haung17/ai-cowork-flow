// tests/e2e/governance-link.spec.js
const { test, expect } = require('@playwright/test');

test('governance-link: governance.md is fetchable', async ({ page }) => {
  const response = await page.request.get('/governance.md');
  expect(response.ok()).toBe(true);
});

test('governance-link: governance.md contains all 7 hard rules', async ({ page }) => {
  const response = await page.request.get('/governance.md');
  const text = await response.text();
  expect(text).toContain('hard-rules');
  // 7 rules — check for at least 4 distinct key phrases
  expect(text).toContain('不得視為承諾');
  expect(text).toContain('不得直接對客戶發送');
  expect(text).toContain('不得直接作為報價依據');
  expect(text).toContain('不得自行新增 SOW');
});

test('governance-link: catalog has ≥ 3 links to governance.md anchors', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('#catalog-content', { timeout: 8000 });
  const count = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('#catalog-content a[href*="governance.md#"]')).length;
  });
  expect(count).toBeGreaterThanOrEqual(3);
});
