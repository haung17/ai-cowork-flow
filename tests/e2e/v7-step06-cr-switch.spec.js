// tests/e2e/v7-step06-cr-switch.spec.js
const { test, expect } = require('@playwright/test');

test('v7-step06: midDev.nodes contains middev-engineer-cr-switch', async ({ page }) => {
  await page.goto('/dashboard.html');
  const found = await page.evaluate(() => {
    const nodes = window.AppData.flowcharts.midDev.nodes;
    return !!nodes.find(n => n.id === 'middev-engineer-cr-switch');
  });
  expect(found).toBe(true);
});

test('v7-step06: midDev.edges 10→cr-switch and cr-switch→1 exist', async ({ page }) => {
  await page.goto('/dashboard.html');
  const edges = await page.evaluate(() => {
    const e = window.AppData.flowcharts.midDev.edges;
    return {
      has10ToSwitch: !!e.find(x => x.from === '10' && x.to === 'middev-engineer-cr-switch'),
      hasSwitchTo1: !!e.find(x => x.from === 'middev-engineer-cr-switch' && x.to === '1')
    };
  });
  expect(edges.has10ToSwitch).toBe(true);
  expect(edges.hasSwitchTo1).toBe(true);
});

test('v7-step06: midDev.edges no direct 10→1 edge (review condition i)', async ({ page }) => {
  await page.goto('/dashboard.html');
  const hasDirect = await page.evaluate(() => {
    const e = window.AppData.flowcharts.midDev.edges;
    return !!e.find(x => x.from === '10' && x.to === '1');
  });
  expect(hasDirect).toBe(false);
});

test('v7-step06: cr-switch title/bullets contain 變更管理 and AI重生', async ({ page }) => {
  await page.goto('/dashboard.html');
  const text = await page.evaluate(() => {
    const n = window.AppData.flowcharts.midDev.nodes.find(n => n.id === 'middev-engineer-cr-switch');
    if (!n) return '';
    return [n.title, ...(n.bullets || [])].join(' ');
  });
  expect(text).toContain('變更管理');
  expect(text).toContain('AI 重生');
});
