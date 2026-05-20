// tests/e2e/tier-rename.spec.js
const { test, expect } = require('@playwright/test');

test('tier: legend table has exactly 4 rows', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('#catalog-content table', { timeout: 8000 });
  const count = await page.evaluate(() => {
    const tables = Array.from(document.querySelectorAll('#catalog-content table'));
    const tierTable = tables.find(t => {
      const ths = Array.from(t.querySelectorAll('th'));
      return ths.some(th => th.textContent.trim() === 'Tier') &&
             ths.some(th => th.textContent.trim() === '定義');
    });
    return tierTable ? tierTable.querySelectorAll('tbody tr').length : 0;
  });
  expect(count).toBe(4);
});

test('tier: legend contains "Draft-safe"', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('#catalog-content table', { timeout: 8000 });
  const found = await page.evaluate(() =>
    document.getElementById('catalog-content').innerText.includes('Draft-safe')
  );
  expect(found).toBe(true);
});

test('tier: legend contains "Decision-assisted"', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('#catalog-content table', { timeout: 8000 });
  const found = await page.evaluate(() =>
    document.getElementById('catalog-content').innerText.includes('Decision-assisted')
  );
  expect(found).toBe(true);
});

test('tier: legend contains "System-output"', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('#catalog-content table', { timeout: 8000 });
  const found = await page.evaluate(() =>
    document.getElementById('catalog-content').innerText.includes('System-output')
  );
  expect(found).toBe(true);
});

test('tier: legend contains "Human-only"', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('#catalog-content table', { timeout: 8000 });
  const found = await page.evaluate(() =>
    document.getElementById('catalog-content').innerText.includes('Human-only')
  );
  expect(found).toBe(true);
});

test('tier: no "AI 自動化程度" string remains', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('#catalog-content', { timeout: 8000 });
  const found = await page.evaluate(() =>
    document.getElementById('catalog-content').innerText.includes('AI 自動化程度')
  );
  expect(found).toBe(false);
});

test('tier: Tier 4 H2 exists in catalog', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('#catalog-content h2', { timeout: 8000 });
  const found = await page.evaluate(() => {
    const h2s = Array.from(document.querySelectorAll('#catalog-content h2'));
    return h2s.some(h => h.textContent.trim().startsWith('Tier 4'));
  });
  expect(found).toBe(true);
});

test('tier: speed-ref table first row Tier cell is "1"', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('#catalog-content table', { timeout: 8000 });
  const tierCell = await page.evaluate(() => {
    const tables = Array.from(document.querySelectorAll('#catalog-content table'));
    const speedRef = tables.find(t =>
      Array.from(t.querySelectorAll('th')).some(th => th.textContent.trim() === 'Primary type')
    );
    if (!speedRef) return null;
    const firstRow = speedRef.querySelector('tbody tr');
    const headers = Array.from(speedRef.querySelectorAll('th')).map(th => th.textContent.trim());
    const idx = headers.indexOf('Tier');
    const cells = firstRow.querySelectorAll('td');
    return cells[idx] ? cells[idx].textContent.trim() : null;
  });
  expect(tierCell).toBe('1');
});
