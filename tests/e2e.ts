// tests/e2e.ts
import { chromium } from "playwright";
import http from "http";

function checkServer(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    http.get(url, (res) => {
      resolve(res.statusCode === 200 || res.statusCode === 304);
    }).on("error", () => resolve(false));
  });
}

async function runE2ETests() {
  console.log("===============================================================");
  console.log("             MANAK AI — PLAYWRIGHT E2E VERIFICATION            ");
  console.log("===============================================================\n");

  const baseUrl = process.env.BASE_URL || "http://localhost:3000";
  const isUp = await checkServer(baseUrl);
  if (!isUp) {
    console.error(`[FAIL] Local dev server is not responding at ${baseUrl}. Please start server before running E2E tests.`);
    process.exit(1);
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  let passed = 0;
  let total = 0;

  async function testStep(name: string, fn: () => Promise<void>) {
    total++;
    process.stdout.write(`[Test ${total}] ${name}... `);
    try {
      await fn();
      passed++;
      console.log("✅ PASS");
    } catch (err: any) {
      console.log(`❌ FAIL: ${err.message}`);
    }
  }

  // 1. Landing Page & Multilingual Toggle
  await testStep("Landing page loads with SIH problem statement and title", async () => {
    await page.goto(`${baseUrl}/`);
    await page.waitForSelector("h1");
    const heading = await page.textContent("h1");
    if (!heading?.includes("BIS Compliance Intelligence")) {
      throw new Error(`Expected title containing "BIS Compliance Intelligence", got: ${heading}`);
    }
  });

  await testStep("Hindi language toggle updates navigation and hero texts", async () => {
    await page.click("button:has-text('हिन्दी')");
    await page.waitForTimeout(400);
    const headingHi = await page.textContent("h1");
    if (!headingHi?.includes("एआई-संचालित BIS अनुपालन इंटेलिजेंस")) {
      throw new Error(`Expected Hindi title, got: ${headingHi}`);
    }
    // Switch back to English
    await page.click("button:has-text('English')");
    await page.waitForTimeout(400);
    const headingEn = await page.textContent("h1");
    if (!headingEn?.includes("BIS Compliance Intelligence")) {
      throw new Error(`Expected English title restored, got: ${headingEn}`);
    }
  });

  // 2. Standards Explorer
  await testStep("Standards Explorer loads standard catalogue and filters by QCO", async () => {
    await page.goto(`${baseUrl}/explore`);
    await page.waitForSelector("table");
    const pageText = await page.textContent("table");
    if (!pageText?.includes("IS 14543") || !pageText?.includes("IS 2347")) {
      throw new Error("Standards table does not contain expected seed standards IS 14543 / IS 2347");
    }

    // Filter by Mandatory QCO
    await page.click("button:has-text('Mandatory QCO')");
    await page.waitForTimeout(300);
    const filteredText = await page.textContent("table");
    if (filteredText?.includes("IS 10500")) {
      throw new Error("Voluntary standard IS 10500 should be hidden under Mandatory QCO filter");
    }
  });

  await testStep("Standards Explorer opens details modal with normative clauses", async () => {
    await page.click("button:has-text('Details') >> nth=0");
    await page.waitForSelector("div[role='dialog'], .fixed");
    const modalContent = await page.content();
    if (!modalContent.includes("Chemical Composition Limits") && !modalContent.includes("Material Requirements")) {
      throw new Error("Details modal did not display clause requirements");
    }
  });

  // 3. Compliance Gap Analysis
  await testStep("Compliance Gap Analysis loads demo presets and runs gap audit", async () => {
    await page.goto(`${baseUrl}/compliance`);
    await page.waitForSelector("button:has-text('Stainless Steel Water Bottles')");
    await page.click("button:has-text('Stainless Steel Water Bottles')");
    await page.waitForTimeout(300);

    // Run audit
    await page.click("button:has-text('Run Compliance Gap Analysis')");
    await page.waitForSelector("table");
    const auditTable = await page.textContent("table");
    if (!auditTable?.includes("SATISFIED") || !auditTable?.includes("CRITICAL GAP")) {
      throw new Error("Audit checklist table missing SATISFIED or CRITICAL GAP status rows");
    }
  });

  // 4. AI Compliance Chat
  await testStep("AI Chat queries BIS engine, streams tokens, and populates evidence drawer", async () => {
    await page.goto(`${baseUrl}/chat`);
    await page.waitForSelector("button:has-text('Which BIS standards apply to stainless steel water bottles?')");
    await page.click("button:has-text('Which BIS standards apply to stainless steel water bottles?')");

    // Wait for response to stream and finalize with citation sources
    await page.waitForSelector("button:has-text('View Sources')", { timeout: 25000 });
    const chatText = await page.textContent("main");
    if (!chatText?.includes("IS 14543") || !chatText?.includes("MANDATORY")) {
      throw new Error("Assistant response did not identify IS 14543 or MANDATORY status");
    }

    // Check evidence drawer has citations
    const drawerText = await page.textContent("aside, [role='complementary'], .lg\\:w-96");
    if (!drawerText?.includes("IS 14543") || !drawerText?.includes("REF_1")) {
      throw new Error("Evidence drawer did not populate with verified citation cards");
    }
  });

  await browser.close();

  console.log("\n===============================================================");
  console.log(`E2E TEST RESULT: ${passed}/${total} Passed (${passed === total ? "100% SUCCESS" : "FAILURES DETECTED"})`);
  console.log("===============================================================\n");

  if (passed !== total) {
    process.exit(1);
  }
}

runE2ETests().catch((err) => {
  console.error("E2E test suite error:", err);
  process.exit(1);
});
