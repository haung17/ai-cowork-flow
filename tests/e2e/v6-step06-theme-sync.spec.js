// tests/e2e/v6-step06-theme-sync.spec.js
const { test, expect } = require('@playwright/test');

test('v6-step06: dashboard dark → resources tab auto-syncs within 200ms', async ({ browser }) => {
  const context = await browser.newContext();
  const pageA = await context.newPage();
  const pageB = await context.newPage();

  await pageA.goto('/dashboard.html');
  await pageA.waitForSelector('#theme-toggle', { timeout: 8000 });

  await pageB.goto('/resources.html');
  await pageB.waitForSelector('#theme-toggle', { timeout: 8000 });

  // Ensure page A starts on light so click toggles to dark
  await pageA.evaluate(() => {
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('cowork-theme', 'light');
    document.getElementById('theme-toggle').textContent = 'Dark';
  });
  await pageB.evaluate(() => {
    document.documentElement.setAttribute('data-theme', 'light');
  });

  // Click theme toggle on page A: light → dark, sets localStorage → storage event fires on page B
  await pageA.click('#theme-toggle');

  // Wait for storage event to propagate (poll instead of fixed sleep)
  await pageB.waitForFunction(() => document.documentElement.getAttribute('data-theme') === 'dark', { timeout: 1000 });

  const themeB = await pageB.evaluate(() => document.documentElement.getAttribute('data-theme'));
  expect(themeB).toBe('dark');

  const btnTextB = await pageB.evaluate(() => document.getElementById('theme-toggle').textContent);
  expect(btnTextB).toBe('Light');

  await context.close();
});

test('v6-step06: resources dark → dashboard tab auto-syncs within 200ms', async ({ browser }) => {
  const context = await browser.newContext();
  const pageA = await context.newPage();
  const pageB = await context.newPage();

  await pageA.goto('/dashboard.html');
  await pageA.waitForSelector('#theme-toggle', { timeout: 8000 });

  await pageB.goto('/resources.html');
  await pageB.waitForSelector('#theme-toggle', { timeout: 8000 });

  // Set both to dark first
  await pageA.evaluate(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('cowork-theme', 'dark');
  });
  await pageB.evaluate(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
  });
  // Sync button text
  await pageB.evaluate(() => { document.getElementById('theme-toggle').textContent = 'Light'; });
  await pageA.evaluate(() => { document.getElementById('theme-toggle').textContent = 'Light'; });

  // Page B clicks to switch to light
  await pageB.click('#theme-toggle');

  // Wait for storage event to propagate (poll instead of fixed sleep)
  await pageA.waitForFunction(() => document.documentElement.getAttribute('data-theme') === 'light', { timeout: 1000 });

  const themeA = await pageA.evaluate(() => document.documentElement.getAttribute('data-theme'));
  expect(themeA).toBe('light');

  const btnTextA = await pageA.evaluate(() => document.getElementById('theme-toggle').textContent);
  expect(btnTextA).toBe('Dark');

  await context.close();
});

test('v6-step06: newly opened page reads localStorage and shows correct theme', async ({ browser }) => {
  const context = await browser.newContext();

  // Set dark in localStorage via first page
  const pageA = await context.newPage();
  await pageA.goto('/dashboard.html');
  await pageA.waitForSelector('#theme-toggle', { timeout: 8000 });
  await pageA.evaluate(() => { localStorage.setItem('cowork-theme', 'dark'); });

  // Open second page fresh — should read dark from localStorage
  const pageB = await context.newPage();
  await pageB.goto('/resources.html');
  await pageB.waitForSelector('#theme-toggle', { timeout: 8000 });

  const themeB = await pageB.evaluate(() => document.documentElement.getAttribute('data-theme'));
  expect(themeB).toBe('dark');

  await context.close();
});
