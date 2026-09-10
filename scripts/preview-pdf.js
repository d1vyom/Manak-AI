const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const tsCode = fs.readFileSync('scripts/generate-judges-pdf.ts', 'utf8');
  const startMarker = 'const htmlContent = `';
  const endMarker = '`;\n\n  // Output paths';
  const startIndex = tsCode.indexOf(startMarker) + startMarker.length;
  const endIndex = tsCode.indexOf(endMarker);
  const html = tsCode.substring(startIndex, endIndex);

  await page.setContent(html);
  await page.setViewportSize({ width: 900, height: 1200 });
  await page.screenshot({ path: 'public/page1_preview.png' });
  console.log('Page preview screenshot generated at public/page1_preview.png');
  await browser.close();
})();
