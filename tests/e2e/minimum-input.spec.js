// tests/e2e/minimum-input.spec.js
const { test, expect } = require('@playwright/test');

test('minimum-input: all 9 resources have Minimum Input section', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('h3[data-resource-id]', { timeout: 8000 });
  const count = await page.evaluate(() => {
    const headings = document.querySelectorAll('#catalog-content h3[data-resource-id]');
    let found = 0;
    headings.forEach(h3 => {
      let el = h3.nextElementSibling;
      while (el && el.tagName !== 'H3' && el.tagName !== 'H2') {
        if (el.textContent.includes('Minimum Input')) { found++; break; }
        el = el.nextElementSibling;
      }
    });
    return found;
  });
  expect(count).toBe(9);
});

test('minimum-input: .minimum-input-list class applied to ≥ 9 lists', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('h3[data-resource-id]', { timeout: 8000 });
  const count = await page.locator('#catalog-content .minimum-input-list').count();
  expect(count).toBeGreaterThanOrEqual(9);
});

test('minimum-input: meeting-notes minimum input list has ≥ 3 items', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('h3[data-resource-id="meeting-notes"]', { timeout: 8000 });
  const count = await page.evaluate(() => {
    const h3 = document.querySelector('h3[data-resource-id="meeting-notes"]');
    if (!h3) return 0;
    let el = h3.nextElementSibling;
    while (el && el.tagName !== 'H3' && el.tagName !== 'H2') {
      if (el.classList && el.classList.contains('minimum-input-list')) {
        return el.querySelectorAll('li').length;
      }
      el = el.nextElementSibling;
    }
    return 0;
  });
  expect(count).toBeGreaterThanOrEqual(3);
});

test('minimum-input: every .minimum-input-list has ≥ 2 items', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('h3[data-resource-id]', { timeout: 8000 });
  const allPass = await page.evaluate(() => {
    const lists = document.querySelectorAll('#catalog-content .minimum-input-list');
    if (lists.length === 0) return false;
    return Array.from(lists).every(ul => ul.querySelectorAll('li').length >= 2);
  });
  expect(allPass).toBe(true);
});
