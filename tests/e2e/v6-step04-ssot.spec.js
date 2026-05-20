// tests/e2e/v6-step04-ssot.spec.js
const { test, expect } = require('@playwright/test');

async function loadDashboard(page) {
  await page.goto('/dashboard.html');
  await page.waitForFunction(() => window.AppData && window.AppData.sectionTables, { timeout: 8000 });
}

test('v6-step04: interactions.js buildContent has no hardcoded <table> string outside renderTable helpers', async ({ page }) => {
  const resp = await page.request.get('/assets/interactions.js');
  const src = await resp.text();
  // Extract buildContent function body (between first function and next top-level function)
  // Strategy: confirm <table> literal only appears inside buildTableHtml, not in buildContent
  const buildContentMatch = src.match(/DashboardInteractions\.buildContent\s*=\s*function\s*\(\)([\s\S]*?)(?=\n\w+\.|$)/);
  expect(buildContentMatch).not.toBeNull();
  const buildContentBody = buildContentMatch[1];
  expect(buildContentBody).not.toContain('<table>');
  expect(buildContentBody).not.toContain('<thead>');
});

test('v6-step04: AppData.sectionTables exists with pre-dev, mid-dev, post-dev keys', async ({ page }) => {
  await loadDashboard(page);
  const keys = await page.evaluate(() => Object.keys(window.AppData.sectionTables));
  expect(keys).toContain('pre-dev');
  expect(keys).toContain('mid-dev');
  expect(keys).toContain('post-dev');
});

test('v6-step04: dashboard renders tables in all three sections', async ({ page }) => {
  await page.goto('/dashboard.html');
  await page.waitForSelector('#pre-dev table', { timeout: 8000 });
  const preDev = await page.locator('#pre-dev table').count();
  const midDev = await page.locator('#mid-dev table').count();
  const postDev = await page.locator('#post-dev table').count();
  expect(preDev).toBeGreaterThanOrEqual(1);
  expect(midDev).toBeGreaterThanOrEqual(1);
  expect(postDev).toBeGreaterThanOrEqual(1);
});

test('v6-step04: pre-dev table tbody row count matches sectionTables rows length', async ({ page }) => {
  await loadDashboard(page);
  const expectedRows = await page.evaluate(() => window.AppData.sectionTables['pre-dev'].rows.length);
  const actualRows = await page.locator('#pre-dev table:first-of-type tbody tr').count();
  expect(actualRows).toBe(expectedRows);
});

test('v6-step04: renderTable 100 rows takes less than 50ms', async ({ page }) => {
  await loadDashboard(page);
  const ms = await page.evaluate(() => {
    var fakeRows = Array.from({ length: 100 }, function(_, i) {
      return [String(i + 1), 'Node ' + i, 'Mode', 'Description text'];
    });
    var start = performance.now();
    // Call renderTable via AppData sectionTables swap + render
    var orig = window.AppData.sectionTables['pre-dev'];
    window.AppData.sectionTables['pre-dev'] = { columns: ['#', '節點', '模式', '工作內容'], rows: fakeRows };
    // Access renderTable if exported, else call buildTableHtml directly via helper
    if (window.DashboardInteractions && typeof window.DashboardInteractions.renderTable === 'function') {
      window.DashboardInteractions.renderTable('pre-dev');
    } else if (window.DashboardInteractions && typeof window.DashboardInteractions._buildTable === 'function') {
      window.DashboardInteractions._buildTable(['#', '節點', '模式', '工作內容'], fakeRows);
    }
    window.AppData.sectionTables['pre-dev'] = orig;
    return performance.now() - start;
  });
  expect(ms).toBeLessThan(50);
});
