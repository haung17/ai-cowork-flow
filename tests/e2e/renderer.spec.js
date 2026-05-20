// tests/e2e/renderer.spec.js
const { test, expect } = require('@playwright/test');

test('renderer: 9 resource H3s have data-resource-id attribute', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('h3[data-resource-id]', { timeout: 8000 });
  const count = await page.locator('h3[data-resource-id]').count();
  expect(count).toBe(9);
});

test('renderer: status badge rendered after meeting-notes H3', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('h3[data-resource-id]', { timeout: 8000 });
  const text = await page.evaluate(() => {
    const h3 = document.querySelector('h3[data-resource-id="meeting-notes"]');
    const badge = h3 && h3.nextElementSibling;
    return badge && badge.classList.contains('status-badge') ? badge.textContent.trim() : null;
  });
  expect(text).toBe('Verified');
});

test('renderer: verification list rendered for meeting-notes (3 items)', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('h3[data-resource-id]', { timeout: 8000 });
  const count = await page.evaluate(() => {
    const h3 = document.querySelector('h3[data-resource-id="meeting-notes"]');
    if (!h3) return 0;
    let el = h3.nextElementSibling;
    while (el && !el.classList.contains('verification-list')) el = el.nextElementSibling;
    return el ? el.querySelectorAll('li').length : 0;
  });
  expect(count).toBe(3);
});

test('renderer: org-chart has Needs Human Gate badge', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('h3[data-resource-id]', { timeout: 8000 });
  const text = await page.evaluate(() => {
    const h3 = document.querySelector('h3[data-resource-id="org-chart"]');
    const badge = h3 && h3.nextElementSibling;
    return badge && badge.classList.contains('status-badge') ? badge.textContent.trim() : null;
  });
  expect(text).toBe('Needs Human Gate');
});

test('renderer: type chips rendered in speed-ref table', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('#catalog-content table', { timeout: 8000 });
  const count = await page.locator('#catalog-content table .chip').count();
  expect(count).toBeGreaterThan(0);
});

test('renderer: speed-ref table row 1 Primary type chip is COWORK', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('#catalog-content table', { timeout: 8000 });
  const chipText = await page.evaluate(() => {
    const tables = Array.from(document.querySelectorAll('#catalog-content table'));
    const speedRef = tables.find(t =>
      Array.from(t.querySelectorAll('th')).some(th => th.textContent.trim() === 'Primary type')
    );
    if (!speedRef) return null;
    const firstRow = speedRef.querySelector('tbody tr');
    if (!firstRow) return null;
    const cells = firstRow.querySelectorAll('td');
    const headers = Array.from(speedRef.querySelectorAll('th')).map(th => th.textContent.trim());
    const idx = headers.indexOf('Primary type');
    const typeCell = cells[idx];
    const chip = typeCell && typeCell.querySelector('.chip');
    return chip ? chip.textContent.trim() : null;
  });
  expect(chipText).toBe('COWORK');
});

test('renderer: parseTime tracked and positive after render', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('h3[data-resource-id]', { timeout: 8000 });
  const time = await page.evaluate(() => window.ResourcesLoader._parseTime);
  expect(typeof time).toBe('number');
  expect(time).toBeGreaterThan(0);
});
