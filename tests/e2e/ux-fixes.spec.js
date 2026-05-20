// tests/e2e/ux-fixes.spec.js
const { test, expect } = require('@playwright/test');

test('ux-fixes: ASANA section has no "email" in Input field (role-based)', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('h3[data-resource-id="asana"]', { timeout: 8000 });
  const inputText = await page.evaluate(() => {
    const h3 = document.querySelector('h3[data-resource-id="asana"]');
    if (!h3) return '';
    let el = h3.nextElementSibling;
    while (el && el.tagName !== 'H3' && el.tagName !== 'H2') {
      if (el.tagName === 'P' && el.textContent.includes('Input：')) {
        return el.textContent;
      }
      el = el.nextElementSibling;
    }
    return '';
  });
  // Input line should say "角色名稱" not "email"
  expect(inputText).toContain('角色名稱');
  expect(inputText).not.toContain('email（ASANA account）');
});

test('ux-fixes: error message in resources.html mentions GitHub Pages', async ({ page }) => {
  // Intercept catalog fetch to trigger error
  await page.route('**/resources-catalog.md', route => route.abort());
  await page.goto('/resources.html');
  await page.waitForSelector('#catalog-error:not(.hidden)', { timeout: 8000 });
  const errorText = await page.locator('#catalog-error').textContent();
  expect(errorText).toContain('GitHub Pages');
});

test('ux-fixes: error message in governance.html mentions GitHub Pages', async ({ page }) => {
  await page.route('**/governance.md', route => route.abort());
  await page.goto('/governance.html');
  await page.waitForSelector('#catalog-error:not(.hidden)', { timeout: 8000 });
  const errorText = await page.locator('#catalog-error').textContent();
  expect(errorText).toContain('GitHub Pages');
});
