// tests/e2e/v7-full-journey.spec.js
// Step 13: full v3.8 journey — 13 steps
const { test, expect } = require('@playwright/test');

test('v7-full-journey: complete v3.8 governance flow', async ({ browser }) => {
  const context = await browser.newContext();
  const pageA = await context.newPage();

  // Step 1: dashboard loads
  await pageA.goto('/dashboard.html');
  await pageA.waitForSelector('#sidebar', { timeout: 8000 });

  // Step 2: v3.8 gate nodes visible in data
  const gateNodesOk = await pageA.evaluate(() => {
    var mid = window.AppData && window.AppData.flowcharts.midDev;
    var pre = window.AppData && window.AppData.flowcharts.preDev;
    if (!mid || !pre) return false;
    var hasNda       = pre.nodes.some(function(n) { return n.id === 'predev-pm-nda-gate'; });
    var hasAiTest    = mid.nodes.some(function(n) { return n.id === 'middev-engineer-ai-test-gate'; });
    var hasCrSwitch  = mid.nodes.some(function(n) { return n.id === 'middev-engineer-cr-switch'; });
    var hasClarify   = mid.nodes.some(function(n) { return n.id === 'middev-pm-clarify'; });
    return hasNda && hasAiTest && hasCrSwitch && hasClarify;
  });
  expect(gateNodesOk).toBe(true);

  // Step 3: midDev rendered — Bézier cross count ≤ 3 (scoped to #fc-midDev)
  await pageA.waitForSelector('#fc-midDev svg', { timeout: 8000 });
  const crossCount = await pageA.evaluate(() => {
    function sampleCubic(d, steps) {
      var m = d.match(/M([\d.]+),([\d.]+)\s+C([\d.]+),([\d.]+)\s+([\d.]+),([\d.]+)\s+([\d.-]+),([\d.-]+)/);
      if (!m) return [];
      var nums = m.slice(1).map(Number);
      var x0=nums[0],y0=nums[1],cx1=nums[2],cy1=nums[3],cx2=nums[4],cy2=nums[5],x3=nums[6],y3=nums[7];
      var pts = [];
      for (var i = 0; i <= steps; i++) {
        var t = i / steps, u = 1 - t;
        pts.push([u*u*u*x0+3*u*u*t*cx1+3*u*t*t*cx2+t*t*t*x3, u*u*u*y0+3*u*u*t*cy1+3*u*t*t*cy2+t*t*t*y3]);
      }
      return pts;
    }
    function segIntersects(a1, a2, b1, b2) {
      var d1x=a2[0]-a1[0],d1y=a2[1]-a1[1],d2x=b2[0]-b1[0],d2y=b2[1]-b1[1];
      var cross=d1x*d2y-d1y*d2x;
      if (Math.abs(cross)<0.001) return false;
      var dx=b1[0]-a1[0],dy=b1[1]-a1[1];
      var t=(dx*d2y-dy*d2x)/cross, u=(dx*d1y-dy*d1x)/cross;
      return t>0.05&&t<0.95&&u>0.05&&u<0.95;
    }
    var paths = Array.from(document.querySelectorAll('#fc-midDev svg path[fill="none"]'));
    var polylines = paths.map(function(p){ return sampleCubic(p.getAttribute('d')||'',8); }).filter(function(pl){ return pl.length>0; });
    var count = 0;
    for (var i = 0; i < polylines.length; i++) {
      for (var j = i+1; j < polylines.length; j++) {
        var A=polylines[i], B=polylines[j], found=false;
        for (var a=0; a<A.length-1 && !found; a++) {
          for (var b=0; b<B.length-1 && !found; b++) {
            if (segIntersects(A[a],A[a+1],B[b],B[b+1])) { count++; found=true; }
          }
        }
      }
    }
    return count;
  });
  expect(crossCount).toBeLessThanOrEqual(3);

  // Step 4: sidebar has 資源對照 and 治理規則 nav entries
  await pageA.waitForSelector('#nav-list .nav-item');
  const navText = await pageA.locator('#nav-list').textContent();
  expect(navText).toContain('資源對照');
  expect(navText).toContain('治理規則');
  expect(navText).not.toContain('⊟');

  // Step 5: click 資源對照 → new tab resources.html
  const [pageB] = await Promise.all([
    context.waitForEvent('page', { timeout: 10000 }),
    pageA.click('#nav-list a[href="resources.html"]'),
  ]);
  await pageB.waitForSelector('#catalog-content h2', { timeout: 10000 });
  expect(pageB.url()).toContain('resources.html');

  // Step 6: Tier 4 banner sticky visible with 7 items
  const bannerText = await pageB.locator('.tier4-banner').textContent();
  for (const term of ['報價', '合約', 'SOW', 'CR', 'UAT', 'Production', 'Hotfix']) {
    expect(bannerText).toContain(term);
  }
  const bannerPos = await pageB.evaluate(() => {
    var el = document.querySelector('.tier4-banner');
    return el ? window.getComputedStyle(el).position : null;
  });
  expect(bannerPos).toBe('sticky');

  // Step 7: catalog WBS section contains Tier 2
  const catalogText = await pageB.locator('#catalog-content').textContent();
  expect(catalogText).toContain('Tier 2');

  // Step 8: search panel has 5 decision chips
  await pageB.keyboard.press('Control+k');
  await pageB.waitForSelector('.quick-decision-chip', { timeout: 4000 });
  const chipCount = await pageB.locator('.quick-decision-chip').count();
  expect(chipCount).toBe(5);

  // Step 9: click 對外承諾 chip → overlay closes + scrolls
  await pageB.locator('.quick-decision-chip').first().click();
  await pageB.waitForTimeout(400);
  const overlayHidden = await pageB.evaluate(() =>
    document.getElementById('search-overlay').classList.contains('hidden')
  );
  expect(overlayHidden).toBe(true);

  // Step 10: checkbox persistence — check first checkbox, reload, verify restored
  const firstCheck = pageB.locator('.acceptance-list input[type="checkbox"]').first();
  await firstCheck.waitFor({ state: 'visible', timeout: 5000 });
  const wasChecked = await firstCheck.isChecked();
  if (!wasChecked) await firstCheck.click();
  await pageB.reload();
  await pageB.waitForSelector('#catalog-content h2', { timeout: 10000 });
  const afterReload = await pageB.locator('.acceptance-list input[type="checkbox"]').first().isChecked();
  expect(afterReload).toBe(true);
  // Cleanup: uncheck
  const checkAfter = pageB.locator('.acceptance-list input[type="checkbox"]').first();
  if (await checkAfter.isChecked()) await checkAfter.click();

  // Step 11: DOMPurify filters injected script
  const scriptFiltered = await pageB.evaluate(() => {
    if (!window.DOMPurify) return false;
    var dirty = '<p>safe</p><script>alert(1)<\/script>';
    var clean = DOMPurify.sanitize(dirty);
    return !clean.includes('<script>');
  });
  expect(scriptFiltered).toBe(true);

  // Step 12: governance.html has 10 rules
  const [pageC] = await Promise.all([
    context.waitForEvent('page', { timeout: 10000 }),
    pageA.click('#nav-list a[href="governance.html"]'),
  ]);
  await pageC.waitForSelector('.governance-rule', { timeout: 10000 });
  const ruleCount = await pageC.locator('.governance-rule').count();
  expect(ruleCount).toBe(10);

  // Step 13: status badge click opens governance.html
  const badge = pageB.locator('.status-badge').first();
  await badge.waitFor({ state: 'visible', timeout: 5000 });
  const [govPage] = await Promise.all([
    context.waitForEvent('page', { timeout: 10000 }),
    badge.click(),
  ]);
  expect(govPage.url()).toContain('governance.html');

  await context.close();
});
