// tests/e2e/v7-step04-nda.spec.js
const { test, expect } = require('@playwright/test');

test('v7-step04: preDev.nodes contains predev-pm-nda-gate', async ({ page }) => {
  await page.goto('/dashboard.html');
  const found = await page.evaluate(() => {
    const nodes = window.AppData.flowcharts.preDev.nodes;
    return !!nodes.find(n => n.id === 'predev-pm-nda-gate');
  });
  expect(found).toBe(true);
});

test('v7-step04: preDev.edges 1→predev-pm-nda-gate and predev-pm-nda-gate→2 exist', async ({ page }) => {
  await page.goto('/dashboard.html');
  const edges = await page.evaluate(() => {
    const e = window.AppData.flowcharts.preDev.edges;
    return {
      has1ToGate: !!e.find(x => x.from === '1' && x.to === 'predev-pm-nda-gate'),
      hasGateTo2: !!e.find(x => x.from === 'predev-pm-nda-gate' && x.to === '2')
    };
  });
  expect(edges.has1ToGate).toBe(true);
  expect(edges.hasGateTo2).toBe(true);
});

test('v7-step04: preDev.edges no direct 1→2 edge', async ({ page }) => {
  await page.goto('/dashboard.html');
  const hasDirect = await page.evaluate(() => {
    const e = window.AppData.flowcharts.preDev.edges;
    return !!e.find(x => x.from === '1' && x.to === '2');
  });
  expect(hasDirect).toBe(false);
});

test('v7-step04: predev-pm-nda-gate title/bullets contain NDA and 資安', async ({ page }) => {
  await page.goto('/dashboard.html');
  const text = await page.evaluate(() => {
    const n = window.AppData.flowcharts.preDev.nodes.find(n => n.id === 'predev-pm-nda-gate');
    if (!n) return '';
    return [n.title, ...(n.bullets || [])].join(' ');
  });
  expect(text).toContain('NDA');
  expect(text).toContain('資安');
});
