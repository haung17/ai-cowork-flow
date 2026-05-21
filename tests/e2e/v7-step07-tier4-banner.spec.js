// tests/e2e/v7-step07-tier4-banner.spec.js
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

test('v7-step07: resources.html has .tier4-banner element', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('.tier4-banner', { timeout: 8000 });
  const found = await page.evaluate(() => !!document.querySelector('.tier4-banner'));
  expect(found).toBe(true);
});

test('v7-step07: tier4-banner contains all 7 prohibited items', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('.tier4-banner', { timeout: 8000 });
  const text = await page.evaluate(() =>
    document.querySelector('.tier4-banner').innerText
  );
  expect(text).toContain('報價');
  expect(text).toContain('合約');
  expect(text).toContain('UAT');
  expect(text).toContain('Production');
  expect(text).toContain('Hotfix');
  expect(text).toContain('CR');
  expect(text).toContain('SOW');
});

test('v7-step07: tier4-banner has sticky CSS position', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('.tier4-banner', { timeout: 8000 });
  const position = await page.evaluate(() =>
    getComputedStyle(document.querySelector('.tier4-banner')).position
  );
  expect(position).toBe('sticky');
});

test('v7-step07: resources-catalog.md WBS section contains Tier 2', async () => {
  const md = fs.readFileSync(
    path.join(__dirname, '../../resources-catalog.md'), 'utf8'
  );
  const wbsIdx = md.indexOf('### 4. WBS');
  expect(wbsIdx).toBeGreaterThan(-1);
  const wbsSection = md.substring(wbsIdx, wbsIdx + 500);
  expect(wbsSection).toContain('Tier 2');
});

test('v7-step07: resources-catalog.md WBS section contains 不得作為報價依據', async () => {
  const md = fs.readFileSync(
    path.join(__dirname, '../../resources-catalog.md'), 'utf8'
  );
  const wbsIdx = md.indexOf('### 4. WBS');
  const wbsSection = md.substring(wbsIdx, wbsIdx + 600);
  expect(wbsSection).toContain('不得作為報價依據');
});
