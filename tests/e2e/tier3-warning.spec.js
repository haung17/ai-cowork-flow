// tests/e2e/tier3-warning.spec.js
const { test, expect } = require('@playwright/test');

test('tier3-warning: .tier3-block exists in catalog', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('#catalog-content h3', { timeout: 8000 });
  const count = await page.locator('.tier3-block').count();
  expect(count).toBe(1);
});

test('tier3-warning: blockquote inside .tier3-block contains warning text', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('#catalog-content h3', { timeout: 8000 });
  const text = await page.locator('.tier3-block blockquote').textContent();
  expect(text).toContain('不建議優先實作');
});

test('tier3-warning: ⚠ symbol present in Tier 3 block', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('#catalog-content h3', { timeout: 8000 });
  const text = await page.locator('.tier3-block').textContent();
  expect(text).toContain('⚠');
});

test('tier3-warning: no .tier3-block inside resource detail sections (Tier 1/2)', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('#catalog-content h3', { timeout: 8000 });
  const insideTier12 = await page.evaluate(() => {
    const h3s = document.querySelectorAll('#catalog-content h3');
    let found = false;
    h3s.forEach(h => {
      let el = h.nextElementSibling;
      while (el && el.tagName !== 'H2' && el.tagName !== 'H3') {
        if (el.classList && el.classList.contains('tier3-block')) found = true;
        el = el.nextElementSibling;
      }
    });
    return found;
  });
  expect(insideTier12).toBe(false);
});

test('tier3-warning: Tier 3 h2 is directly followed by .tier3-block', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('#catalog-content h3', { timeout: 8000 });
  const result = await page.evaluate(() => {
    const h2s = Array.from(document.querySelectorAll('#catalog-content h2'));
    const tier3h2 = h2s.find(h => h.textContent.includes('Tier 3'));
    if (!tier3h2) return false;
    const next = tier3h2.nextElementSibling;
    return next && next.classList.contains('tier3-block');
  });
  expect(result).toBe(true);
});

test('tier3-warning: 階段流向總覽 section NOT swallowed into .tier3-block', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('#catalog-content h3', { timeout: 8000 });
  const bleed = await page.evaluate(() => {
    const h2sInBlock = Array.from(document.querySelectorAll('.tier3-block h2'));
    return h2sInBlock.some(h => h.textContent.includes('階段流向'));
  });
  expect(bleed).toBe(false);
});
