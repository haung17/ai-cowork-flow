// tests/e2e/full-journey.spec.js
const { test, expect } = require('@playwright/test');

test('full-journey: complete user flow through dashboard to resources', async ({ page, context }) => {
  // 1. Open dashboard
  await page.goto('/dashboard.html');
  await expect(page).toHaveTitle(/接案軟體開發交付治理流程/);

  // 2. Click resources link in nav → new tab opens
  await page.waitForSelector('#nav-list a[href="resources.html"]');
  const [resourcesPage] = await Promise.all([
    context.waitForEvent('page', { timeout: 10000 }),
    page.click('#nav-list a[href="resources.html"]')
  ]);
  await resourcesPage.waitForLoadState('domcontentloaded');
  expect(resourcesPage.url()).toContain('resources.html');

  // 3. Catalog renders — all 9 resource sections visible
  await resourcesPage.waitForSelector('#catalog-content h3', { timeout: 10000 });
  const h3s = await resourcesPage.locator('#catalog-content h3').allTextContents();
  const resourceNames = ['會議記錄', '工作計劃書', '簡報', 'WBS', '組織架構', 'Prototype', 'Sprint', 'ASANA', '里程碑'];
  for (const name of resourceNames) {
    expect(h3s.some(t => t.includes(name))).toBe(true);
  }

  // 4. Switch to dark mode
  await resourcesPage.click('#theme-toggle');
  const theme = await resourcesPage.evaluate(() =>
    document.documentElement.getAttribute('data-theme')
  );
  expect(theme).toBe('dark');

  // 5. Search for 會議 → find result → Enter → overlay closes
  await resourcesPage.keyboard.press('Control+k');
  await resourcesPage.fill('#search-input', '會議');
  await resourcesPage.waitForSelector('.search-result-item', { timeout: 3000 });
  const firstResult = await resourcesPage.locator('.search-result-item').first().textContent();
  expect(firstResult).toContain('會議記錄');
  await resourcesPage.keyboard.press('ArrowDown');
  await resourcesPage.keyboard.press('Enter');
  await expect(resourcesPage.locator('#search-overlay')).toHaveClass(/hidden/);

  // 6. Click nav item for Tier 3 section
  const tier3Nav = resourcesPage.locator('#nav-list .nav-item a', { hasText: 'Tier 3' });
  const tier3NavCount = await tier3Nav.count();
  if (tier3NavCount > 0) {
    await tier3Nav.first().click();
    await resourcesPage.waitForTimeout(700);
    const tier3H2 = resourcesPage.locator('#catalog-content h2', { hasText: 'Tier 3' });
    await expect(tier3H2.first()).toBeInViewport({ ratio: 0.1 });
  }

  // 7. Dark mode persists on reload
  await resourcesPage.reload();
  await resourcesPage.waitForSelector('#catalog-content h2', { timeout: 10000 });
  const themeAfterReload = await resourcesPage.evaluate(() =>
    document.documentElement.getAttribute('data-theme')
  );
  expect(themeAfterReload).toBe('dark');

  // Cleanup
  await resourcesPage.evaluate(() => localStorage.removeItem('cowork-theme'));
});

test('full-journey: resources chapter in dashboard nav also opens resources.html', async ({ page, context }) => {
  await page.goto('/dashboard.html');
  await page.waitForSelector('#nav-list .nav-item a', { timeout: 5000 });

  const resourcesNavLink = page.locator('#nav-list a', { hasText: '資源對照' });
  await expect(resourcesNavLink).toBeVisible();

  const [newPage] = await Promise.all([
    context.waitForEvent('page', { timeout: 10000 }),
    resourcesNavLink.click()
  ]);
  await newPage.waitForLoadState('domcontentloaded');
  expect(newPage.url()).toContain('resources.html');
  await newPage.close();
});
