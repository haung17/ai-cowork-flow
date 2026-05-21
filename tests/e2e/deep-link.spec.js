// tests/e2e/deep-link.spec.js
const { test, expect } = require('@playwright/test');

test('deep-link: flowchart nodes have id attributes', async ({ page }) => {
  await page.goto('/dashboard.html');
  await page.waitForSelector('.fc-node', { timeout: 8000 });
  const preDev = await page.locator('[id^="preDev-"]').count();
  expect(preDev).toBe(14);
  const midDev = await page.locator('[id^="midDev-"]').count();
  expect(midDev).toBe(14);
  const postDev = await page.locator('[id^="postDev-"]').count();
  expect(postDev).toBe(14);
});

test('deep-link: hash navigation scrolls to node and adds flash', async ({ page }) => {
  await page.goto('/dashboard.html#preDev-2');
  await page.waitForSelector('#preDev-2', { timeout: 10000 });
  await page.waitForTimeout(800);
  const hasFlash = await page.locator('#preDev-2').evaluate(el => el.classList.contains('flash'));
  expect(hasFlash).toBe(true);
});

test('deep-link: flash class removed after 3 seconds', async ({ page }) => {
  await page.goto('/dashboard.html#preDev-2');
  await page.waitForSelector('#preDev-2', { timeout: 10000 });
  await page.waitForTimeout(3500);
  const hasFlash = await page.locator('#preDev-2').evaluate(el => el.classList.contains('flash'));
  expect(hasFlash).toBe(false);
});

test('deep-link: resources page has clickable preDev links', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('#catalog-content h3', { timeout: 8000 });
  const links = await page.locator('a[href*="dashboard.html#preDev-"]').count();
  expect(links).toBeGreaterThan(0);
});

test('deep-link: clicking node link opens dashboard in new tab', async ({ page, context }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('#catalog-content h3', { timeout: 8000 });
  const firstLink = page.locator('a[href*="dashboard.html#preDev-"]').first();
  const [newPage] = await Promise.all([
    context.waitForEvent('page', { timeout: 10000 }),
    firstLink.click()
  ]);
  await newPage.waitForLoadState('domcontentloaded');
  expect(newPage.url()).toContain('dashboard.html#preDev-');
  await newPage.close();
});

test('deep-link: no preDev:N raw text nodes remain in catalog-content', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('#catalog-content h3', { timeout: 8000 });
  const result = await page.evaluate(() => {
    const content = document.getElementById('catalog-content');
    if (!content) return { hasLinks: false, hasBareText: true };
    const links = content.querySelectorAll('a[href*="dashboard.html#preDev-"]');
    const pattern = /\b(preDev|midDev|postDev):\d+\b/;
    let hasBareText = false;
    function checkNode(node) {
      if (node.nodeType === 3) { // TEXT_NODE
        if (pattern.test(node.textContent)) hasBareText = true;
      } else if (node.nodeType === 1 && node.tagName !== 'A') { // ELEMENT_NODE, not anchor
        Array.from(node.childNodes).forEach(checkNode);
      }
    }
    checkNode(content);
    return { hasLinks: links.length > 0, hasBareText };
  });
  expect(result.hasLinks).toBe(true);
  expect(result.hasBareText).toBe(false);
});
