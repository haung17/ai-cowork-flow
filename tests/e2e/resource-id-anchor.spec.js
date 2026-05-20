// tests/e2e/resource-id-anchor.spec.js
const { test, expect } = require('@playwright/test');

test('resource-id: all 9 resources have correct data-resource-id assigned', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('h3[data-resource-id]', { timeout: 8000 });
  const ids = await page.evaluate(() =>
    Array.from(document.querySelectorAll('h3[data-resource-id]')).map(h => h.dataset.resourceId)
  );
  const expected = [
    'meeting-notes', 'work-plan', 'presentation', 'wbs', 'org-chart',
    'prototype', 'sprint-plan', 'asana', 'milestone-reminder'
  ];
  expected.forEach(id => expect(ids).toContain(id));
  expect(ids.length).toBe(9);
});

test('resource-id: _RESOURCE_IDS positional array no longer exists', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('h3[data-resource-id]', { timeout: 8000 });
  const hasOldArray = await page.evaluate(() => Array.isArray(window.ResourcesLoader._RESOURCE_IDS));
  expect(hasOldArray).toBe(false);
});

test('resource-id: _RESOURCE_MAP object exists with 9 entries', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('h3[data-resource-id]', { timeout: 8000 });
  const count = await page.evaluate(() => {
    const m = window.ResourcesLoader._RESOURCE_MAP;
    return m && typeof m === 'object' ? Object.keys(m).length : 0;
  });
  expect(count).toBe(9);
});
