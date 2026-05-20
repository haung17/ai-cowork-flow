// tests/e2e/v6-step07-image-swap.spec.js
const { test, expect } = require('@playwright/test');

test('v6-step07: no Image-v3.6 references remain in *.html and *.js source', async ({ page }) => {
  // Fetch the two files that had v3.6 references
  const presResp = await page.request.get('/presentation.html');
  const presSrc = await presResp.text();
  expect(presSrc).not.toContain('Image-v3.6');

  const interResp = await page.request.get('/assets/interactions.js');
  const interSrc = await interResp.text();
  expect(interSrc).not.toContain('Image-v3.6');
});

test('v6-step07: presentation.html has 4 img tags with v3.7 filenames', async ({ page }) => {
  const resp = await page.request.get('/presentation.html');
  const src = await resp.text();

  expect(src).toContain('ChatGPT Image-v3.7-全架構.png');
  expect(src).toContain('ChatGPT Image-v3.7-開發前.png');
  expect(src).toContain('ChatGPT Image-v3.7-開發中.png');
  expect(src).toContain('ChatGPT Image-v3.7-開發後.png');
});

test('v6-step07: presentation.html loads and all 4 images have naturalWidth > 0', async ({ page }) => {
  await page.goto('/presentation.html');
  await page.waitForLoadState('networkidle');

  const widths = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.flow-slide-img')).map(function(img) {
      return img.naturalWidth;
    });
  });

  expect(widths.length).toBe(4);
  widths.forEach(function(w) {
    expect(w).toBeGreaterThan(0);
  });
});
