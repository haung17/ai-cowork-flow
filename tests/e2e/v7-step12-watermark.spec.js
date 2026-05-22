// tests/e2e/v7-step12-watermark.spec.js
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

test('v7-step12: catalog prototype section contains Demo watermark rule', async () => {
  const md = fs.readFileSync(
    path.join(__dirname, '../../resources-catalog.md'),
    'utf8'
  );
  expect(md).toContain('Demo 水印強制規則');
  expect(md).toContain('DEMO');
  expect(md).toContain('Not Production');
  expect(md).toContain('僅供需求確認');
});

test('v7-step12: catalog presentation section contains External Use Gate', async () => {
  const md = fs.readFileSync(
    path.join(__dirname, '../../resources-catalog.md'),
    'utf8'
  );
  expect(md).toContain('External Use Gate');
  expect(md).toContain('範疇對齊 SOW');
  expect(md).toContain('脫敏');
  expect(md).toContain('PM 必須完成');
});

test('v7-step12: governance.html has anchor links referencing Demo watermark and External Use Gate', async ({ page }) => {
  await page.goto('/governance.html');
  await page.waitForSelector('.governance-rule', { timeout: 8000 });
  // Must have explicit links referencing both delivery rules (added in step 12)
  const watermarkLink = await page.locator('a[href*="resources"]', { hasText: /Demo 水印/ }).count();
  const gateLink = await page.locator('a[href*="resources"]', { hasText: /External Use Gate/ }).count();
  expect(watermarkLink).toBeGreaterThan(0);
  expect(gateLink).toBeGreaterThan(0);
});

test('v7-step12: resources.html renders Demo watermark rule text', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('#catalog-content h2', { timeout: 8000 });
  const bodyText = await page.locator('#catalog-content').textContent();
  expect(bodyText).toContain('Demo 水印強制規則');
  expect(bodyText).toContain('External Use Gate');
});
