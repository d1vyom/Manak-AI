// scripts/capture-screenshots.ts
import { chromium } from "playwright";
import fs from "fs";
import path from "path";

async function captureScreenshots() {
  const outputDir = path.join(process.cwd(), "docs", "assets", "screenshots");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2, // Retina 2x crisp rendering
  });
  const page = await context.newPage();

  console.log("📸 Capturing screenshot 1: Landing Page...");
  await page.goto("http://localhost:3000/");
  await page.waitForSelector("h1");
  await page.waitForTimeout(1000);
  await page.screenshot({
    path: path.join(outputDir, "01_landing_hero.png"),
    fullPage: false,
  });

  console.log("📸 Capturing screenshot 2: Standards Explorer...");
  await page.goto("http://localhost:3000/explore");
  await page.waitForSelector("table");
  await page.waitForTimeout(1000);
  await page.screenshot({
    path: path.join(outputDir, "02_standards_explorer.png"),
    fullPage: false,
  });

  console.log("📸 Capturing screenshot 3: Standard Detail Modal...");
  await page.click("button:has-text('Details') >> nth=0");
  await page.waitForSelector("div[role='dialog'], .fixed");
  await page.waitForTimeout(1000);
  await page.screenshot({
    path: path.join(outputDir, "03_standard_details_modal.png"),
    fullPage: false,
  });

  console.log("📸 Capturing screenshot 4: Compliance Gap Analysis...");
  await page.goto("http://localhost:3000/compliance");
  await page.waitForSelector("button:has-text('Stainless Steel Water Bottles')");
  await page.click("button:has-text('Stainless Steel Water Bottles')");
  await page.waitForTimeout(400);
  await page.click("button:has-text('Run Compliance Gap Analysis')");
  await page.waitForSelector("table");
  await page.waitForTimeout(1200);
  await page.screenshot({
    path: path.join(outputDir, "04_compliance_audit_engine.png"),
    fullPage: false,
  });

  console.log("📸 Capturing screenshot 5: AI Compliance Chat with Split Drawer...");
  await page.goto("http://localhost:3000/chat");
  await page.waitForSelector("button:has-text('Which BIS standards apply to stainless steel water bottles?')");
  await page.click("button:has-text('Which BIS standards apply to stainless steel water bottles?')");
  // Wait for stream and citation drawer to load
  await page.waitForSelector("button:has-text('View Sources')", { timeout: 30000 });
  await page.waitForTimeout(2000);
  await page.screenshot({
    path: path.join(outputDir, "05_ai_chat_citations.png"),
    fullPage: false,
  });

  console.log("📸 Capturing screenshot 6: Bilingual Hindi Interface...");
  await page.goto("http://localhost:3000/");
  await page.waitForSelector("button:has-text('हिन्दी')");
  await page.click("button:has-text('हिन्दी')");
  await page.waitForTimeout(800);
  await page.screenshot({
    path: path.join(outputDir, "06_bilingual_hindi.png"),
    fullPage: false,
  });

  await browser.close();
  console.log("✅ All screenshots captured successfully in docs/assets/screenshots/");
}

captureScreenshots().catch((err) => {
  console.error("Error capturing screenshots:", err);
  process.exit(1);
});
