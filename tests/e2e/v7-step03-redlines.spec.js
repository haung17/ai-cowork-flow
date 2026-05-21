// tests/e2e/v7-step03-redlines.spec.js
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

test('v7-step03: governance.md contains 規則 8, 9, 10', async () => {
  const md = fs.readFileSync(
    path.join(__dirname, '../../governance.md'), 'utf8'
  );
  expect(md).toContain('規則 8');
  expect(md).toContain('規則 9');
  expect(md).toContain('規則 10');
});

test('v7-step03: governance.html has 10 .governance-rule elements', async ({ page }) => {
  await page.goto('/governance.html');
  await page.waitForSelector('#catalog-content table', { timeout: 8000 });

  const count = await page.evaluate(() =>
    document.querySelectorAll('.governance-rule').length
  );
  expect(count).toBe(10);
});

test('v7-step03: 3 .rule-new chips visible', async ({ page }) => {
  await page.goto('/governance.html');
  await page.waitForSelector('.rule-new', { timeout: 8000 });

  const count = await page.evaluate(() =>
    document.querySelectorAll('.rule-new').length
  );
  expect(count).toBe(3);
});

test('v7-step03: rule keywords — NDA in rule 8, 80% in rule 9, AI重生 in rule 10', async ({ page }) => {
  await page.goto('/governance.html');
  await page.waitForSelector('#catalog-content table', { timeout: 8000 });

  const text = await page.evaluate(() =>
    document.getElementById('catalog-content').innerText
  );
  expect(text).toContain('NDA');
  expect(text).toContain('80%');
  expect(text).toContain('AI 重生');
});
