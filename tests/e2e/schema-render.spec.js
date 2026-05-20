// tests/e2e/schema-render.spec.js
const { test, expect } = require('@playwright/test');

test('schema-render: no HUMAN+COWORK or COWORK+CLAUDECODE strings in DOM', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('#catalog-content h3', { timeout: 8000 });
  const body = await page.locator('body').textContent();
  expect(body).not.toContain('HUMAN+COWORK');
  expect(body).not.toContain('COWORK+CLAUDECODE');
});

test('schema-render: all 9 resource sections have Input field', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('#catalog-content h3', { timeout: 8000 });
  const count = await page.locator('#catalog-content').getByText('Input：', { exact: false }).count();
  expect(count).toBeGreaterThanOrEqual(9);
});

test('schema-render: all 9 resource sections have Human Gate field', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('#catalog-content h3', { timeout: 8000 });
  const count = await page.locator('#catalog-content').getByText('Human Gate：', { exact: false }).count();
  expect(count).toBeGreaterThanOrEqual(9);
});

test('schema-render: all 9 resource sections have Artifact field', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('#catalog-content h3', { timeout: 8000 });
  const count = await page.locator('#catalog-content').getByText('Artifact：', { exact: false }).count();
  expect(count).toBeGreaterThanOrEqual(9);
});

test('schema-render: all 9 resource sections have Risk field', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('#catalog-content h3', { timeout: 8000 });
  const count = await page.locator('#catalog-content').getByText('Risk：', { exact: false }).count();
  expect(count).toBeGreaterThanOrEqual(9);
});

test('schema-render: quick-ref table has Primary type and Support columns', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('#catalog-content table', { timeout: 8000 });
  const headers = await page.locator('#catalog-content table thead th').allTextContents();
  expect(headers.join(' ')).toContain('Primary type');
  expect(headers.join(' ')).toContain('Support');
});
