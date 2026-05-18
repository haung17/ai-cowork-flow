// tests/e2e/resources-page.spec.js
const { test, expect } = require('@playwright/test');

// ── Task 1: Skeleton ──────────────────────────────────────────────
test('skeleton: title contains 資源對照', async ({ page }) => {
  await page.goto('/resources.html');
  await expect(page).toHaveTitle(/資源對照/);
});

test('skeleton: has sidebar element', async ({ page }) => {
  await page.goto('/resources.html');
  await expect(page.locator('#sidebar')).toBeVisible();
});

test('skeleton: has main content area', async ({ page }) => {
  await page.goto('/resources.html');
  await expect(page.locator('#main-content')).toBeVisible();
});

test('skeleton: has catalog-content div', async ({ page }) => {
  await page.goto('/resources.html');
  await expect(page.locator('#catalog-content')).toBeVisible();
});

// ── Task 2: Theme Toggle ──────────────────────────────────────────
test('theme: default is light', async ({ page }) => {
  await page.goto('/resources.html');
  await page.evaluate(() => localStorage.removeItem('cowork-theme'));
  await page.reload();
  const theme = await page.evaluate(() =>
    document.documentElement.getAttribute('data-theme')
  );
  expect(theme).toBe('light');
});

test('theme: clicking toggle switches to dark', async ({ page }) => {
  await page.goto('/resources.html');
  await page.evaluate(() => localStorage.removeItem('cowork-theme'));
  await page.reload();
  await page.click('#theme-toggle');
  const theme = await page.evaluate(() =>
    document.documentElement.getAttribute('data-theme')
  );
  expect(theme).toBe('dark');
});

test('theme: localStorage key is cowork-theme', async ({ page }) => {
  await page.goto('/resources.html');
  await page.evaluate(() => localStorage.removeItem('cowork-theme'));
  await page.reload();
  await page.click('#theme-toggle');
  const stored = await page.evaluate(() => localStorage.getItem('cowork-theme'));
  expect(stored).toBe('dark');
});

test('theme: page respects stored dark theme on reload', async ({ page }) => {
  await page.goto('/resources.html');
  await page.evaluate(() => localStorage.setItem('cowork-theme', 'dark'));
  await page.reload();
  const theme = await page.evaluate(() =>
    document.documentElement.getAttribute('data-theme')
  );
  expect(theme).toBe('dark');
  await page.evaluate(() => localStorage.removeItem('cowork-theme'));
});

test('theme: sidebar is visible on desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/resources.html');
  await expect(page.locator('#sidebar')).toBeVisible();
});

// ── Task 4: Nav ───────────────────────────────────────────────────
test('nav: sidebar nav has items after catalog loads', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('#nav-list .nav-item', { timeout: 8000 });
  const count = await page.locator('#nav-list .nav-item').count();
  expect(count).toBeGreaterThanOrEqual(4);
});

test('nav: each nav item corresponds to a h2 in catalog-content', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('#nav-list .nav-item a', { timeout: 8000 });
  const navIds = await page.locator('#nav-list .nav-item a').evaluateAll(
    links => links.map(a => a.dataset.id).filter(Boolean)
  );
  for (const id of navIds) {
    const el = page.locator(`#catalog-content [id="${id}"]`);
    await expect(el).toHaveCount(1);
  }
});

test('nav: clicking first nav item scrolls and sets active', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('#nav-list .nav-item a', { timeout: 8000 });
  const firstLink = page.locator('#nav-list .nav-item a').first();
  await firstLink.click();
  await page.waitForTimeout(700);
  await expect(firstLink).toHaveClass(/active/);
});

// ── Task 5: Search ────────────────────────────────────────────────
test('search: opens with Ctrl+K', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('#catalog-content h3', { timeout: 8000 });
  await page.keyboard.press('Control+k');
  await expect(page.locator('#search-overlay')).not.toHaveClass(/hidden/);
});

test('search: closes with Escape', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('#catalog-content h3', { timeout: 8000 });
  await page.keyboard.press('Control+k');
  await expect(page.locator('#search-overlay')).not.toHaveClass(/hidden/);
  await page.keyboard.press('Escape');
  await expect(page.locator('#search-overlay')).toHaveClass(/hidden/);
});

test('search: typing 會議 shows 會議記錄 result', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('#catalog-content h3', { timeout: 8000 });
  await page.keyboard.press('Control+k');
  await page.fill('#search-input', '會議');
  await page.waitForSelector('.search-result-item', { timeout: 3000 });
  const firstResult = await page.locator('.search-result-item').first().textContent();
  expect(firstResult).toContain('會議記錄');
});

test('search: ArrowDown + Enter closes overlay', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('#catalog-content h3', { timeout: 8000 });
  await page.keyboard.press('Control+k');
  await page.fill('#search-input', '會議');
  await page.waitForSelector('.search-result-item');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await expect(page.locator('#search-overlay')).toHaveClass(/hidden/);
});

test('search: clicking search-btn opens panel', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('#catalog-content h3', { timeout: 8000 });
  await page.click('#search-btn');
  await expect(page.locator('#search-overlay')).not.toHaveClass(/hidden/);
});

// ── Task 7: Polish & A11y ─────────────────────────────────────────
test('polish: theme-toggle has aria-label', async ({ page }) => {
  await page.goto('/resources.html');
  const label = await page.locator('#theme-toggle').getAttribute('aria-label');
  expect(label).toBeTruthy();
  expect(label.length).toBeGreaterThan(3);
});

test('polish: search-btn has aria-label', async ({ page }) => {
  await page.goto('/resources.html');
  const label = await page.locator('#search-btn').getAttribute('aria-label');
  expect(label).toBeTruthy();
});

test('polish: back-link has aria-label', async ({ page }) => {
  await page.goto('/resources.html');
  const label = await page.locator('a.back-link').getAttribute('aria-label');
  expect(label).toBeTruthy();
});

test('polish: tables wrapped in .table-wrapper on narrow screen', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/resources.html');
  await page.waitForSelector('.table-wrapper', { timeout: 8000 });
  const overflow = await page.locator('.table-wrapper').first().evaluate(el =>
    window.getComputedStyle(el).overflowX
  );
  expect(overflow).toBe('auto');
});

test('polish: no horizontal scrollbar on 375px', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/resources.html');
  await page.waitForSelector('#catalog-content h2', { timeout: 8000 });
  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
  expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
});
