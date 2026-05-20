// tests/e2e/tier4-block.spec.js
const { test, expect } = require('@playwright/test');

test('tier4: .tier4-block element exists', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('#catalog-content h2', { timeout: 8000 });
  const count = await page.locator('.tier4-block').count();
  expect(count).toBe(1);
});

test('tier4: .tier4-block contains exactly 4 H3s', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('#catalog-content h2', { timeout: 8000 });
  const count = await page.locator('.tier4-block h3').count();
  expect(count).toBe(4);
});

test('tier4: each H3 under tier4-block has 禁止 AI text', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('#catalog-content h2', { timeout: 8000 });
  const allForbidden = await page.evaluate(() => {
    const h3s = Array.from(document.querySelectorAll('.tier4-block h3'));
    return h3s.every(h3 => {
      let el = h3.nextElementSibling;
      while (el && el.tagName !== 'H3') {
        if (el.innerText && el.innerText.includes('禁止 AI')) return true;
        el = el.nextElementSibling;
      }
      return false;
    });
  });
  expect(allForbidden).toBe(true);
});

test('tier4: .tier4-block has red left border (rgb(220, 38, 38))', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('#catalog-content h2', { timeout: 8000 });
  const borderColor = await page.evaluate(() => {
    const el = document.querySelector('.tier4-block');
    return el ? window.getComputedStyle(el).borderLeftColor : null;
  });
  expect(borderColor).toBe('rgb(220, 38, 38)');
});

test('tier4: Tier 3 block (.tier3-block) not affected — still exists', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('#catalog-content', { timeout: 8000 });
  const t3 = await page.locator('.tier3-block').count();
  const t4 = await page.locator('.tier4-block').count();
  expect(t3).toBe(1);
  expect(t4).toBe(1);
});

test('tier4: 階段流向總覽 section NOT inside tier4-block', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('#catalog-content h2', { timeout: 8000 });
  const inside = await page.evaluate(() => {
    const tier4 = document.querySelector('.tier4-block');
    if (!tier4) return false;
    const flowH2 = Array.from(document.querySelectorAll('h2')).find(h => h.textContent.includes('階段流向'));
    if (!flowH2) return false;
    return tier4.contains(flowH2);
  });
  expect(inside).toBe(false);
});
