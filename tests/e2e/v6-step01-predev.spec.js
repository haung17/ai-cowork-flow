// tests/e2e/v6-step01-predev.spec.js
const { test, expect } = require('@playwright/test');

async function loadDashboard(page) {
  await page.goto('/dashboard.html');
  await page.waitForFunction(() => window.AppData && window.AppData.flowcharts && window.AppData.flowcharts.preDev, { timeout: 8000 });
}

test('v6-step01: preDev.nodes contains predev-engineer-presurvey', async ({ page }) => {
  await loadDashboard(page);
  const hasNode = await page.evaluate(() =>
    window.AppData.flowcharts.preDev.nodes.some(n => n.id === 'predev-engineer-presurvey')
  );
  expect(hasNode).toBe(true);
});

test('v6-step01: preDev.edges no longer has from:11 to:7', async ({ page }) => {
  await loadDashboard(page);
  const hasBadEdge = await page.evaluate(() =>
    window.AppData.flowcharts.preDev.edges.some(e => e.from === '11' && e.to === '7')
  );
  expect(hasBadEdge).toBe(false);
});

test('v6-step01: rendered preDev flowchart shows 投標前技術探勘', async ({ page }) => {
  await loadDashboard(page);
  await page.waitForSelector('#preDev-predev-engineer-presurvey', { timeout: 8000 });
  const text = await page.locator('#preDev-predev-engineer-presurvey .fc-node-title').textContent();
  expect(text).toContain('投標前技術探勘');
});

test('v6-step01: node 11 role is eng and title contains 交付期', async ({ page }) => {
  await loadDashboard(page);
  const node11 = await page.evaluate(() =>
    window.AppData.flowcharts.preDev.nodes.find(n => n.id === '11')
  );
  expect(node11.role).toBe('eng');
  expect(node11.title).toContain('交付期');
});

test('v6-step01: preDev.edges contains new path 8→predev-engineer-presurvey→9', async ({ page }) => {
  await loadDashboard(page);
  const edges = await page.evaluate(() => window.AppData.flowcharts.preDev.edges);
  const has8ToNew = edges.some(e => e.from === '8' && e.to === 'predev-engineer-presurvey');
  const hasNewTo9 = edges.some(e => e.from === 'predev-engineer-presurvey' && e.to === '9');
  expect(has8ToNew).toBe(true);
  expect(hasNewTo9).toBe(true);
});
