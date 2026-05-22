// tests/e2e/v6-full-journey.spec.js
const { test, expect } = require('@playwright/test');

test('v6-full-journey: complete governance flow from dashboard through resources with cross-tab sync', async ({ browser }) => {
  const context = await browser.newContext();
  const pageA = await context.newPage();

  // Step 1: load dashboard
  await pageA.goto('/dashboard.html');
  await pageA.waitForSelector('#sidebar', { timeout: 8000 });

  // Step 2: preDev contains 投標前技術探勘
  const preSurveyVisible = await pageA.evaluate(() => {
    var fc = window.AppData && window.AppData.flowcharts && window.AppData.flowcharts.preDev;
    return fc && fc.nodes.some(function(n) { return n.id === 'predev-engineer-presurvey'; });
  });
  expect(preSurveyVisible).toBe(true);

  // Step 3: midDev dead loop removed (no back-edge 9→8); has middev-pm-clarify
  const midDevOk = await pageA.evaluate(() => {
    var fc = window.AppData.flowcharts.midDev;
    var has98 = fc.edges.some(function(e) { return e.from === '9' && e.to === '8'; });
    var hasClarify = fc.nodes.some(function(n) { return n.id === 'middev-pm-clarify'; });
    return !has98 && hasClarify;
  });
  expect(midDevOk).toBe(true);

  // Step 4: postDev engineer impact node exists in path 5→impact→6
  const postDevOk = await pageA.evaluate(() => {
    var fc = window.AppData.flowcharts.postDev;
    var hasImpact = fc.nodes.some(function(n) { return n.id === 'postdev-engineer-impact'; });
    var edge5toImpact = fc.edges.some(function(e) { return e.from === '5' && e.to === 'postdev-engineer-impact'; });
    var edgeImpactTo6 = fc.edges.some(function(e) { return e.from === 'postdev-engineer-impact' && e.to === '6'; });
    var noDirectEdge56 = !fc.edges.some(function(e) { return e.from === '5' && e.to === '6'; });
    return hasImpact && edge5toImpact && edgeImpactTo6 && noDirectEdge56;
  });
  expect(postDevOk).toBe(true);

  // Step 5: click resources link in nav → opens new tab
  await pageA.waitForSelector('#nav-list a[href="resources.html"]');
  const [pageB] = await Promise.all([
    context.waitForEvent('page'),
    pageA.click('#nav-list a[href="resources.html"]')
  ]);
  await pageB.waitForSelector('#catalog-content h3[data-resource-id]', { timeout: 10000 });
  expect(pageB.url()).toContain('resources.html');

  // Step 6: catalog loaded with ≥ 9 h3
  const h3count = await pageB.locator('#catalog-content h3[data-resource-id]').count();
  expect(h3count).toBeGreaterThanOrEqual(9);

  // Step 7: search for 會議 → results appear
  await pageB.click('#search-btn');
  await pageB.waitForSelector('#search-input', { timeout: 5000 });
  await pageB.fill('#search-input', '會議');
  await pageB.waitForSelector('.search-result-item', { timeout: 2000 });
  const searchCount = await pageB.locator('.search-result-item').count();
  expect(searchCount).toBeGreaterThan(0);

  // Step 8: click first result → overlay closes
  await pageB.locator('.search-result-item').first().click();
  await expect(pageB.locator('#search-overlay')).toHaveClass(/hidden/);

  // Step 9: nav click → scrolls to section (just verify click doesn't error)
  const navLink = pageB.locator('#nav-list a').first();
  await expect(navLink).toBeVisible();
  await navLink.click();

  // Step 10: pageA (dashboard) switches to dark
  await pageA.evaluate(() => {
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('cowork-theme', 'light');
    document.getElementById('theme-toggle').textContent = 'Dark';
  });
  await pageA.click('#theme-toggle');
  const dashTheme = await pageA.evaluate(() => document.documentElement.getAttribute('data-theme'));
  expect(dashTheme).toBe('dark');

  // Step 11: pageB (resources) auto-syncs dark via storage event
  await pageB.waitForFunction(() => document.documentElement.getAttribute('data-theme') === 'dark', { timeout: 1000 });
  const resTheme = await pageB.evaluate(() => document.documentElement.getAttribute('data-theme'));
  expect(resTheme).toBe('dark');

  // Step 12: no Image-v3.6 in interactions.js
  const interResp = await pageA.request.get('/assets/interactions.js');
  const interSrc = await interResp.text();
  expect(interSrc).not.toContain('Image-v3.6');

  // Step 13: pre-dev table rows match sectionTables
  await pageA.evaluate(() => window.scrollTo(0, 0));
  const rowsMatch = await pageA.evaluate(() => {
    var expected = window.AppData.sectionTables['pre-dev'].rows.length;
    var actual = document.querySelectorAll('#pre-dev table:first-of-type tbody tr').length;
    return expected === actual;
  });
  expect(rowsMatch).toBe(true);

  await context.close();
});
