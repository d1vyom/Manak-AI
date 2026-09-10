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
  // View each page by selecting .page
  const pages = await page.$$('.page');
  console.log('Found .page elements:', pages.length);

  for (let i = 0; i < pages.length; i++) {
    await pages[i].screenshot({ path: `public/page_${i + 1}.png` });
    console.log(`Saved public/page_${i + 1}.png`);
  }

  await browser.close();
})();
