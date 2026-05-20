// tests/e2e/governance-page.spec.js
const { test, expect } = require('@playwright/test');

test('governance-page: governance.html loads', async ({ page }) => {
  await page.goto('/governance.html');
  await page.waitForSelector('#catalog-content', { timeout: 8000 });
  const title = await page.title();
  expect(title).toBeTruthy();
});

test('governance-page: 7 hard rules are visible', async ({ page }) => {
  await page.goto('/governance.html');
  await page.waitForSelector('#catalog-content h2', { timeout: 8000 });
  const text = await page.locator('#catalog-content').textContent();
  expect(text).toContain('不得視為承諾');
  expect(text).toContain('不得直接對客戶發送');
  expect(text).toContain('不得直接作為報價依據');
  expect(text).toContain('不得自行新增 SOW');
});

test('governance-page: sidebar has 返回資源庫 link', async ({ page }) => {
  await page.goto('/governance.html');
  await page.waitForSelector('.sidebar', { timeout: 8000 });
  const linkText = await page.locator('.sidebar a[href="resources.html"]').first().textContent();
  expect(linkText).toContain('資源庫');
});

test('governance-page: resources.html sidebar first link is governance', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('.governance-link', { timeout: 8000 });
  const href = await page.locator('.governance-link').first().getAttribute('href');
  expect(href).toBe('governance.html');
});
