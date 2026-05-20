// tests/e2e/v6-step03-middev.spec.js
const { test, expect } = require('@playwright/test');

async function loadDashboard(page) {
  await page.goto('/dashboard.html');
  await page.waitForFunction(() => window.AppData && window.AppData.flowcharts && window.AppData.flowcharts.midDev, { timeout: 8000 });
}

test('v6-step03: midDev.edges no longer has from:9 to:8 (規格疑義 dead-loop removed)', async ({ page }) => {
  await loadDashboard(page);
  const hasDeadLoop = await page.evaluate(() =>
    window.AppData.flowcharts.midDev.edges.some(e => e.from === '9' && e.to === '8')
  );
  expect(hasDeadLoop).toBe(false);
});

test('v6-step03: middev-pm-clarify node exists in midDev', async ({ page }) => {
  await loadDashboard(page);
  const hasNode = await page.evaluate(() =>
    window.AppData.flowcharts.midDev.nodes.some(n => n.id === 'middev-pm-clarify')
  );
  expect(hasNode).toBe(true);
});

test('v6-step03: node 9 規格疑義 edge points to middev-pm-clarify not node 8', async ({ page }) => {
  await loadDashboard(page);
  const edges = await page.evaluate(() => window.AppData.flowcharts.midDev.edges);
  const clarifyEdge = edges.find(e => e.from === '9' && e.label && e.label.includes('規格疑義'));
  expect(clarifyEdge).not.toBeUndefined();
  expect(clarifyEdge.to).toBe('middev-pm-clarify');
});

test('v6-step03: middev-pm-clarify has at least 2 outgoing edges all with labels', async ({ page }) => {
  await loadDashboard(page);
  const edges = await page.evaluate(() => window.AppData.flowcharts.midDev.edges);
  const outEdges = edges.filter(e => e.from === 'middev-pm-clarify');
  expect(outEdges.length).toBeGreaterThanOrEqual(2);
  outEdges.forEach(e => expect(e.label).toBeTruthy());
});

test('v6-step03: no 客戶接抵 string in titles, bullets, or edge labels', async ({ page }) => {
  await loadDashboard(page);
  const allText = await page.evaluate(() => {
    const fc = window.AppData.flowcharts;
    const titles = Object.values(fc).flatMap(chart => chart.nodes.map(n => n.title));
    const bullets = Object.values(fc).flatMap(chart => chart.nodes.flatMap(n => n.bullets || []));
    const edgeLabels = Object.values(fc).flatMap(chart => chart.edges.map(e => e.label || ''));
    return [...titles, ...bullets, ...edgeLabels].join(' ');
  });
  expect(allText).not.toContain('客戶接抵');
});
