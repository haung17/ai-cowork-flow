// tests/e2e/v7-step02-middev-layout.spec.js
const { test, expect } = require('@playwright/test');

test('v7-step02: middev-pm-clarify.y === 83 (shifted +9 by step05 ai-test-gate)', async ({ page }) => {
  await page.goto('/dashboard.html');
  const y = await page.evaluate(() => {
    const n = window.AppData.flowcharts.midDev.nodes.find(n => n.id === 'middev-pm-clarify');
    return n ? n.y : null;
  });
  expect(y).toBe(83);
});

test('v7-step02: node 10 and node 11 y === 92 (shifted +9 by step05)', async ({ page }) => {
  await page.goto('/dashboard.html');
  const coords = await page.evaluate(() => {
    const nodes = window.AppData.flowcharts.midDev.nodes;
    const n10 = nodes.find(n => n.id === '10');
    const n11 = nodes.find(n => n.id === '11');
    return { y10: n10 ? n10.y : null, y11: n11 ? n11.y : null };
  });
  expect(coords.y10).toBe(92);
  expect(coords.y11).toBe(92);
});

test('v7-step02: edge 9→middev-pm-clarify has fromSide:right', async ({ page }) => {
  await page.goto('/dashboard.html');
  const edge = await page.evaluate(() => {
    const e = window.AppData.flowcharts.midDev.edges.find(
      e => e.from === '9' && e.to === 'middev-pm-clarify'
    );
    return e ? { fromSide: e.fromSide, toSide: e.toSide } : null;
  });
  expect(edge).not.toBeNull();
  expect(edge.fromSide).toBe('right');
});

test('v7-step02: midDev rendered paths have ≤ 3 geometric crossings', async ({ page }) => {
  await page.goto('/dashboard.html');
  await page.waitForSelector('#fc-midDev svg', { timeout: 8000 });

  const crossings = await page.evaluate(() => {
    // Sample Bézier cubic M x1,y1 C cx1,cy1 cx2,cy2 x2,y2 into polyline
    function sampleCubic(d, steps) {
      const m = d.match(/M([\d.]+),([\d.]+)\s+C([\d.]+),([\d.]+)\s+([\d.]+),([\d.]+)\s+([\d.-]+),([\d.-]+)/);
      if (!m) return [];
      const [,x0,y0,cx1,cy1,cx2,cy2,x3,y3] = m.map(Number);
      const pts = [];
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const u = 1 - t;
        const x = u*u*u*x0 + 3*u*u*t*cx1 + 3*u*t*t*cx2 + t*t*t*x3;
        const y = u*u*u*y0 + 3*u*u*t*cy1 + 3*u*t*t*cy2 + t*t*t*y3;
        pts.push([x, y]);
      }
      return pts;
    }

    function segIntersects(a1, a2, b1, b2) {
      const d1x = a2[0]-a1[0], d1y = a2[1]-a1[1];
      const d2x = b2[0]-b1[0], d2y = b2[1]-b1[1];
      const cross = d1x*d2y - d1y*d2x;
      if (Math.abs(cross) < 0.001) return false;
      const dx = b1[0]-a1[0], dy = b1[1]-a1[1];
      const t = (dx*d2y - dy*d2x) / cross;
      const u = (dx*d1y - dy*d1x) / cross;
      return t > 0.05 && t < 0.95 && u > 0.05 && u < 0.95;
    }

    const paths = Array.from(document.querySelectorAll('#fc-midDev svg path[fill="none"]'));
    const polylines = paths.map(p => sampleCubic(p.getAttribute('d') || '', 8)).filter(pl => pl.length > 0);

    let count = 0;
    for (let i = 0; i < polylines.length; i++) {
      for (let j = i + 1; j < polylines.length; j++) {
        const A = polylines[i], B = polylines[j];
        outer: for (let a = 0; a < A.length - 1; a++) {
          for (let b = 0; b < B.length - 1; b++) {
            if (segIntersects(A[a], A[a+1], B[b], B[b+1])) {
              count++;
              break outer;
            }
          }
        }
      }
    }
    return count;
  });

  // 3 back-edges (9→1, clarify→1, 10→1) each cross at least one forward path — unavoidable.
  // Threshold raised from 2 → 3 based on actual graph topology.
  expect(crossings).toBeLessThanOrEqual(3);
});

test('v7-step02: clarify→7 has fromSide:left and clarify→1 has toSide:right', async ({ page }) => {
  await page.goto('/dashboard.html');
  const edges = await page.evaluate(() => {
    const midEdges = window.AppData.flowcharts.midDev.edges;
    const c7 = midEdges.find(e => e.from === 'middev-pm-clarify' && e.to === '7');
    const c1 = midEdges.find(e => e.from === 'middev-pm-clarify' && e.to === '1');
    return {
      c7fromSide: c7 ? c7.fromSide : null,
      c1toSide: c1 ? c1.toSide : null
    };
  });
  expect(edges.c7fromSide).toBe('left');
  expect(edges.c1toSide).toBe('right');
});

test('v7-step02: all midDev nodes have valid x/y coordinates (no NaN)', async ({ page }) => {
  await page.goto('/dashboard.html');
  const allValid = await page.evaluate(() => {
    return window.AppData.flowcharts.midDev.nodes.every(n =>
      typeof n.x === 'number' && !isNaN(n.x) &&
      typeof n.y === 'number' && !isNaN(n.y)
    );
  });
  expect(allValid).toBe(true);
});
