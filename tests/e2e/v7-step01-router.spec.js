// tests/e2e/v7-step01-router.spec.js
const { test, expect } = require('@playwright/test');

const NODE_H = 110;
const NODE_W = 200;

test('v7-step01: default edge start y = from.ty + NODE_H - 10 (regression guard)', async ({ page }) => {
  await page.goto('/dashboard.html');
  await page.waitForSelector('#fc-midDev svg', { timeout: 8000 });

  const result = await page.evaluate(() => {
    const nodes = window.AppData.flowcharts.midDev.nodes;
    const n1 = nodes.find(n => n.id === '1');
    if (!n1) return { error: 'node 1 not found' };

    const UNIT = 14;
    const canvasW = document.getElementById('fc-midDev').offsetWidth || 900;
    const cx1 = (n1.x / 100) * canvasW;
    const ty1 = n1.y * UNIT + 20;
    const expectedStartX = cx1;
    const expectedStartY = ty1 + 110 - 10; // bottom exit (NODE_H - 10)

    // Find path that starts near (cx1, ty1+100)
    const paths = document.querySelectorAll('#fc-midDev svg path[fill="none"]');
    let actualStartX = null, actualStartY = null;
    for (const p of paths) {
      const d = p.getAttribute('d');
      if (!d) continue;
      const m = d.match(/^M([\d.]+),([\d.]+)/);
      if (!m) continue;
      const px = parseFloat(m[1]);
      const py = parseFloat(m[2]);
      if (Math.abs(px - expectedStartX) < 2 && Math.abs(py - expectedStartY) < 2) {
        actualStartX = px; actualStartY = py; break;
      }
    }
    return { expectedStartX, expectedStartY, actualStartX, actualStartY };
  });

  expect(result.error).toBeUndefined();
  expect(result.actualStartX).not.toBeNull();
  expect(Math.abs(result.actualStartX - result.expectedStartX)).toBeLessThan(2);
  expect(Math.abs(result.actualStartY - result.expectedStartY)).toBeLessThan(2);
});

test('v7-step01: fromSide:right edge start x = from.cx + NODE_W/2', async ({ page }) => {
  await page.goto('/dashboard.html');
  await page.waitForSelector('#fc-midDev svg', { timeout: 8000 });

  const startX = await page.evaluate(() => {
    const UNIT = 14;
    const NODE_W = 200;
    const canvasW = 900;

    const n9 = window.AppData.flowcharts.midDev.nodes.find(n => n.id === '9');
    const cx9 = (n9.x / 100) * canvasW;
    const expectedStartX = cx9 + NODE_W / 2;

    const testContainer = document.createElement('div');
    testContainer.id = 'fc-test-side';
    testContainer.style.cssText = 'position:relative;width:900px;height:2000px;';
    document.body.appendChild(testContainer);

    // Single edge with fromSide:'right'
    window.AppData.flowcharts['_testA'] = {
      nodes: window.AppData.flowcharts.midDev.nodes,
      edges: [{ from: '9', to: 'middev-pm-clarify', fromSide: 'right', toSide: 'left' }]
    };
    window.FlowCharts.render('_testA', testContainer);
    delete window.AppData.flowcharts['_testA'];

    const paths = testContainer.querySelectorAll('svg path[fill="none"]');
    let actualStartX = null;
    for (const p of paths) {
      const d = p.getAttribute('d');
      if (!d) continue;
      const m = d.match(/^M([\d.]+),([\d.]+)/);
      if (m) { actualStartX = parseFloat(m[1]); break; }
    }
    document.body.removeChild(testContainer);
    return { expectedStartX, actualStartX };
  });

  expect(startX.actualStartX).not.toBeNull();
  expect(Math.abs(startX.actualStartX - startX.expectedStartX)).toBeLessThan(2);
});

test('v7-step01: toSide:left edge end x = to.cx - NODE_W/2', async ({ page }) => {
  await page.goto('/dashboard.html');
  await page.waitForSelector('#fc-midDev svg', { timeout: 8000 });

  const endX = await page.evaluate(() => {
    const UNIT = 14;
    const NODE_W = 200;
    const canvasW = 900;

    const clarify = window.AppData.flowcharts.midDev.nodes.find(n => n.id === 'middev-pm-clarify');
    const expectedEndX = (clarify.x / 100) * canvasW - NODE_W / 2;

    const testContainer = document.createElement('div');
    testContainer.id = 'fc-test-to';
    testContainer.style.cssText = 'position:relative;width:900px;height:2000px;';
    document.body.appendChild(testContainer);

    window.AppData.flowcharts['_testB'] = {
      nodes: window.AppData.flowcharts.midDev.nodes,
      edges: [{ from: '9', to: 'middev-pm-clarify', fromSide: 'right', toSide: 'left' }]
    };
    window.FlowCharts.render('_testB', testContainer);
    delete window.AppData.flowcharts['_testB'];

    const paths = testContainer.querySelectorAll('svg path[fill="none"]');
    let actualEndX = null;
    for (const p of paths) {
      const d = p.getAttribute('d');
      if (!d) continue;
      // Last token in path d = `x2,y2`
      const tokens = d.trim().split(/\s+/);
      const last = tokens[tokens.length - 1];
      const m = last.match(/^(-?[\d.]+),(-?[\d.]+)$/);
      if (m) { actualEndX = parseFloat(m[1]); break; }
    }
    document.body.removeChild(testContainer);
    return { expectedEndX, actualEndX };
  });

  expect(endX.actualEndX).not.toBeNull();
  expect(Math.abs(endX.actualEndX - endX.expectedEndX)).toBeLessThan(2);
});

test('v7-step01: horizontal edge label has SVG rect background', async ({ page }) => {
  await page.goto('/dashboard.html');
  await page.waitForSelector('#fc-midDev svg', { timeout: 8000 });

  const hasRect = await page.evaluate(() => {
    const testContainer = document.createElement('div');
    testContainer.id = 'fc-test-rect';
    testContainer.style.cssText = 'position:relative;width:900px;height:1500px;';
    document.body.appendChild(testContainer);

    // Force a near-horizontal edge: node '8' (70,56) → node 'middev-pm-clarify' injected
    // Actually use fromSide:'right' to create horizontal from '9' to 'clarify' (same y row)
    const testChart = {
      nodes: window.AppData.flowcharts.midDev.nodes.slice(),
      edges: [{ from:'9', to:'middev-pm-clarify', label:'規格疑義', fromSide:'right', toSide:'left' }]
    };
    window.AppData.flowcharts['midDevRect'] = testChart;
    window.FlowCharts.render('midDevRect', testContainer);
    window.AppData.flowcharts['midDevRect'] = undefined;

    // Check if there is a <rect> element sibling near a <text>
    const rects = testContainer.querySelectorAll('svg rect');
    document.body.removeChild(testContainer);
    return rects.length > 0;
  });

  expect(hasRect).toBe(true);
});

test('v7-step01: midDev all edges have valid path d (starts with M)', async ({ page }) => {
  await page.goto('/dashboard.html');
  await page.waitForSelector('#fc-midDev svg', { timeout: 8000 });

  const allValid = await page.evaluate(() => {
    const paths = document.querySelectorAll('#fc-midDev svg path[fill="none"]');
    if (paths.length === 0) return false;
    for (const p of paths) {
      const d = p.getAttribute('d');
      if (!d || !d.startsWith('M')) return false;
    }
    return paths.length;
  });

  expect(allValid).toBeGreaterThan(0);
});

test('v7-step01: midDev SVG marker exists and paths use marker-end', async ({ page }) => {
  await page.goto('/dashboard.html');
  await page.waitForSelector('#fc-midDev svg', { timeout: 8000 });

  const markerOk = await page.evaluate(() => {
    const marker = document.querySelector('#fc-midDev svg marker');
    const paths = document.querySelectorAll('#fc-midDev svg path[fill="none"]');
    const hasMarkerEnd = Array.from(paths).every(p => p.getAttribute('marker-end'));
    return { hasMarker: !!marker, hasMarkerEnd, count: paths.length };
  });

  expect(markerOk.hasMarker).toBe(true);
  expect(markerOk.hasMarkerEnd).toBe(true);
  expect(markerOk.count).toBeGreaterThan(0);
});
