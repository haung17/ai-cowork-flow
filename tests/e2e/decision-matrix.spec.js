// tests/e2e/decision-matrix.spec.js
const { test, expect } = require('@playwright/test');

test('decision-matrix: table exists in catalog-content', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('#catalog-content table', { timeout: 8000 });
  // decision matrix should have a "禁止 AI" column header
  const hasCol = await page.evaluate(() => {
    const tables = document.querySelectorAll('#catalog-content table');
    return Array.from(tables).some(t =>
      Array.from(t.querySelectorAll('th')).some(th => th.textContent.includes('禁止 AI'))
    );
  });
  expect(hasCol).toBe(true);
});

test('decision-matrix: table has 9 resource rows', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('#catalog-content table', { timeout: 8000 });
  const rowCount = await page.evaluate(() => {
    const tables = document.querySelectorAll('#catalog-content table');
    const dm = Array.from(tables).find(t =>
      Array.from(t.querySelectorAll('th')).some(th => th.textContent.includes('禁止 AI'))
    );
    return dm ? dm.querySelectorAll('tbody tr').length : 0;
  });
  expect(rowCount).toBe(9);
});

test('decision-matrix: appears before Tier 圖例 section', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('#catalog-content table', { timeout: 8000 });
  const order = await page.evaluate(() => {
    const all = Array.from(document.querySelectorAll('#catalog-content table, #catalog-content h2'));
    const dmIdx = all.findIndex(el =>
      el.tagName === 'TABLE' &&
      Array.from(el.querySelectorAll('th')).some(th => th.textContent.includes('禁止 AI'))
    );
    const tierH2Idx = all.findIndex(el =>
      el.tagName === 'H2' && el.textContent.includes('圖例')
    );
    return { dmIdx, tierH2Idx };
  });
  expect(order.dmIdx).toBeGreaterThanOrEqual(0);
  expect(order.dmIdx).toBeLessThan(order.tierH2Idx);
});
