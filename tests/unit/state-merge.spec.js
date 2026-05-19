// tests/unit/state-merge.spec.js
const { test, expect } = require('@playwright/test');

// Wait until _state is fully populated (all 9 keys) to avoid race condition
// where h3 appears before Promise.all([md, state]) resolves
async function waitForState(page) {
  await page.waitForFunction(
    () => window.ResourcesLoader._state && Object.keys(window.ResourcesLoader._state).length >= 9,
    { timeout: 8000 }
  );
}

test('state-merge: state.json loads and _state is populated', async ({ page }) => {
  await page.goto('/resources.html');
  await waitForState(page);
  const state = await page.evaluate(() => window.ResourcesLoader._state);
  expect(state).toBeTruthy();
  expect(Object.keys(state).length).toBe(9);
});

test('state-merge: meeting-notes has status Verified', async ({ page }) => {
  await page.goto('/resources.html');
  await waitForState(page);
  const status = await page.evaluate(() => window.ResourcesLoader._state['meeting-notes']?.status);
  expect(status).toBe('Verified');
});

test('state-merge: meeting-notes verification has 3 items', async ({ page }) => {
  await page.goto('/resources.html');
  await waitForState(page);
  const v = await page.evaluate(() => window.ResourcesLoader._state['meeting-notes']?.verification);
  expect(Array.isArray(v)).toBe(true);
  expect(v.length).toBe(3);
});

test('state-merge: page DOM has no HUMAN+COWORK substring', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('#catalog-content h3', { timeout: 8000 });
  const body = await page.locator('body').textContent();
  expect(body).not.toContain('HUMAN+COWORK');
  expect(body).not.toContain('COWORK+CLAUDECODE');
});

test('state-merge: state.json fetch failure shows placeholder not crash', async ({ page }) => {
  await page.route('**/resources-state.json', route => route.abort());
  await page.goto('/resources.html');
  await page.waitForSelector('#catalog-content h3', { timeout: 8000 });
  const h3Count = await page.locator('#catalog-content h3').count();
  expect(h3Count).toBeGreaterThanOrEqual(9);
});
