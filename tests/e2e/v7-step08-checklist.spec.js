// tests/e2e/v7-step08-checklist.spec.js
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

test('v7-step08: state schema has owner + required on all acceptanceChecks', () => {
  const state = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../../resources-state.json'), 'utf8')
  );
  Object.entries(state).forEach(function([id, entry]) {
    if (!entry.acceptanceChecks || !entry.acceptanceChecks.length) return;
    entry.acceptanceChecks.forEach(function(c, idx) {
      expect(c, `${id}[${idx}] missing owner`).toHaveProperty('owner');
      expect(c, `${id}[${idx}] missing required`).toHaveProperty('required');
      expect(typeof c.owner, `${id}[${idx}] owner not string`).toBe('string');
      expect(c.owner.length, `${id}[${idx}] owner empty`).toBeGreaterThan(0);
      expect(typeof c.required, `${id}[${idx}] required not boolean`).toBe('boolean');
    });
  });
});

test('v7-step08: checkboxes rendered and not disabled', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('.acceptance-list input[type="checkbox"]', { timeout: 8000 });
  const count = await page.evaluate(() =>
    document.querySelectorAll('.acceptance-list input[type="checkbox"]:not([disabled])').length
  );
  expect(count).toBeGreaterThan(0);
});

test('v7-step08: checkbox click saves to localStorage', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('.acceptance-list input[type="checkbox"]', { timeout: 8000 });
  const lsVal = await page.evaluate(() => {
    const cb = document.querySelector('.acceptance-list input[type="checkbox"]');
    if (!cb.checked) cb.click();
    const k = 'cowork-check-' + cb.dataset.resource + '-' + cb.dataset.idx;
    return localStorage.getItem(k);
  });
  expect(lsVal).toBe('1');
});

test('v7-step08: checked state restored after reload', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('.acceptance-list input[type="checkbox"]', { timeout: 8000 });
  const resourceInfo = await page.evaluate(() => {
    const cb = document.querySelector('.acceptance-list input[type="checkbox"]');
    if (!cb.checked) cb.click();
    return { resource: cb.dataset.resource, idx: cb.dataset.idx };
  });
  await page.reload();
  await page.waitForSelector('.acceptance-list input[type="checkbox"]', { timeout: 8000 });
  const checked = await page.evaluate((info) => {
    const cb = document.querySelector(
      `.acceptance-list input[type="checkbox"][data-resource="${info.resource}"][data-idx="${info.idx}"]`
    );
    return cb ? cb.checked : false;
  }, resourceInfo);
  expect(checked).toBe(true);
});

test('v7-step08: progress bar displays N / M required format', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('.acceptance-progress', { timeout: 8000 });
  const text = await page.evaluate(() =>
    document.querySelector('.acceptance-progress').textContent
  );
  expect(text).toMatch(/\d+\s*\/\s*\d+/);
});

test('v7-step08: 100 checkbox clicks complete < 200ms', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('.acceptance-list input[type="checkbox"]', { timeout: 8000 });
  const ms = await page.evaluate(() => {
    const checks = Array.from(
      document.querySelectorAll('.acceptance-list input[type="checkbox"]')
    );
    const list = [];
    while (list.length < 100) list.push(...checks);
    const t0 = performance.now();
    list.slice(0, 100).forEach(function(c) { c.click(); });
    return performance.now() - t0;
  });
  expect(ms).toBeLessThan(200);
});
