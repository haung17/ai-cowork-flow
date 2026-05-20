// tests/e2e/v6-step02-uat.spec.js
const { test, expect } = require('@playwright/test');

async function loadDashboard(page) {
  await page.goto('/dashboard.html');
  await page.waitForFunction(() => window.AppData && window.AppData.flowcharts && window.AppData.flowcharts.postDev, { timeout: 8000 });
}

test('v6-step02: postDev.edges no longer has direct from:5 to:6', async ({ page }) => {
  await loadDashboard(page);
  const hasDirect = await page.evaluate(() =>
    window.AppData.flowcharts.postDev.edges.some(e => e.from === '5' && e.to === '6')
  );
  expect(hasDirect).toBe(false);
});

test('v6-step02: postDev.edges contains path through postdev-engineer-impact', async ({ page }) => {
  await loadDashboard(page);
  const edges = await page.evaluate(() => window.AppData.flowcharts.postDev.edges);
  const has5ToImpact = edges.some(e => e.from === '5' && e.to === 'postdev-engineer-impact');
  const hasImpactTo6 = edges.some(e => e.from === 'postdev-engineer-impact' && e.to === '6');
  expect(has5ToImpact).toBe(true);
  expect(hasImpactTo6).toBe(true);
});

test('v6-step02: postdev-engineer-impact node is HUMAN role ENGINEER', async ({ page }) => {
  await loadDashboard(page);
  const node = await page.evaluate(() =>
    window.AppData.flowcharts.postDev.nodes.find(n => n.id === 'postdev-engineer-impact')
  );
  expect(node).not.toBeNull();
  expect(node.type).toBe('human');
  expect(node.role).toBe('eng');
});

test('v6-step02: postDev node 10 supports roles[] array with pm and eng', async ({ page }) => {
  await loadDashboard(page);
  const node10 = await page.evaluate(() =>
    window.AppData.flowcharts.postDev.nodes.find(n => n.id === '10')
  );
  expect(Array.isArray(node10.roles)).toBe(true);
  expect(node10.roles).toContain('pm');
  expect(node10.roles).toContain('eng');
});

test('v6-step02: postDev.edges no longer has direct from:7 to:8', async ({ page }) => {
  await loadDashboard(page);
  const hasDirect = await page.evaluate(() =>
    window.AppData.flowcharts.postDev.edges.some(e => e.from === '7' && e.to === '8')
  );
  expect(hasDirect).toBe(false);
});

test('v6-step02: postDev.edges contains Code Review path 7→postdev-engineer-codereview→8', async ({ page }) => {
  await loadDashboard(page);
  const edges = await page.evaluate(() => window.AppData.flowcharts.postDev.edges);
  const has7ToCR = edges.some(e => e.from === '7' && e.to === 'postdev-engineer-codereview');
  const hasCRTo8 = edges.some(e => e.from === 'postdev-engineer-codereview' && e.to === '8');
  const crNode = await page.evaluate(() =>
    window.AppData.flowcharts.postDev.nodes.find(n => n.id === 'postdev-engineer-codereview')
  );
  expect(has7ToCR).toBe(true);
  expect(hasCRTo8).toBe(true);
  expect(crNode.type).toBe('human');
  expect(crNode.role).toBe('eng');
});
