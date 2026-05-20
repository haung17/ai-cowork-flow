// tests/e2e/status-migration.spec.js
const { test, expect } = require('@playwright/test');

test('status-migration: all 9 resource badges show DraftReady', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('h3[data-resource-id]', { timeout: 8000 });
  const badges = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.status-badge'))
      .filter(b => {
        const h3 = b.previousElementSibling;
        return h3 && h3.dataset.resourceId;
      })
      .map(b => b.textContent.trim());
  });
  expect(badges.length).toBe(9);
  expect(badges.every(t => t === 'DraftReady')).toBe(true);
});

test('status-migration: no "Verified" text in any status badge', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('.status-badge', { timeout: 8000 });
  const hasVerified = await page.evaluate(() =>
    Array.from(document.querySelectorAll('.status-badge'))
      .some(b => b.textContent.trim() === 'Verified')
  );
  expect(hasVerified).toBe(false);
});

test('status-migration: no "Needs Human Gate" text in any status badge', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('.status-badge', { timeout: 8000 });
  const has = await page.evaluate(() =>
    Array.from(document.querySelectorAll('.status-badge'))
      .some(b => b.textContent.trim() === 'Needs Human Gate')
  );
  expect(has).toBe(false);
});

test('status-migration: .status-draftready CSS class exists and has background', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('.status-draftready', { timeout: 8000 });
  const bg = await page.evaluate(() => {
    const el = document.querySelector('.status-draftready');
    return el ? window.getComputedStyle(el).backgroundColor : null;
  });
  expect(bg).not.toBeNull();
  expect(bg).not.toBe('rgba(0, 0, 0, 0)');
});

test('status-migration: meeting-notes badge class is status-draftready', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('h3[data-resource-id="meeting-notes"]', { timeout: 8000 });
  const cls = await page.evaluate(() => {
    const h3 = document.querySelector('h3[data-resource-id="meeting-notes"]');
    const badge = h3 && h3.nextElementSibling;
    return badge ? badge.className : null;
  });
  expect(cls).toContain('status-draftready');
});
