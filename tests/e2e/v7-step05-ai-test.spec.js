// tests/e2e/v7-step05-ai-test.spec.js
const { test, expect } = require('@playwright/test');

test('v7-step05: midDev.nodes contains middev-engineer-ai-test-gate', async ({ page }) => {
  await page.goto('/dashboard.html');
  const found = await page.evaluate(() => {
    const nodes = window.AppData.flowcharts.midDev.nodes;
    return !!nodes.find(n => n.id === 'middev-engineer-ai-test-gate');
  });
  expect(found).toBe(true);
});

test('v7-step05: midDev.edges 1→ai-test-gate and ai-test-gate→2 exist', async ({ page }) => {
  await page.goto('/dashboard.html');
  const edges = await page.evaluate(() => {
    const e = window.AppData.flowcharts.midDev.edges;
    return {
      has1ToGate: !!e.find(x => x.from === '1' && x.to === 'middev-engineer-ai-test-gate'),
      hasGateTo2: !!e.find(x => x.from === 'middev-engineer-ai-test-gate' && x.to === '2')
    };
  });
  expect(edges.has1ToGate).toBe(true);
  expect(edges.hasGateTo2).toBe(true);
});

test('v7-step05: midDev.edges no direct 1→2 edge', async ({ page }) => {
  await page.goto('/dashboard.html');
  const hasDirect = await page.evaluate(() => {
    const e = window.AppData.flowcharts.midDev.edges;
    return !!e.find(x => x.from === '1' && x.to === '2');
  });
  expect(hasDirect).toBe(false);
});

test('v7-step05: middev-engineer-ai-test-gate bullets contain 80%', async ({ page }) => {
  await page.goto('/dashboard.html');
  const text = await page.evaluate(() => {
    const n = window.AppData.flowcharts.midDev.nodes.find(n => n.id === 'middev-engineer-ai-test-gate');
    if (!n) return '';
    return [n.title, ...(n.bullets || [])].join(' ');
  });
  expect(text).toContain('80%');
});
