import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";

async function captureScreenshots() {
  const outputDir = path.resolve(process.cwd(), "docs/screenshots");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log("Launching browser for screenshot capture...");
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1.5 });

  const routes = [
    { url: "http://localhost:3000/", filename: "dashboard.png" },
    { url: "http://localhost:3000/publications", filename: "publications-list.png" },
    { url: "http://localhost:3000/publications/new", filename: "new-publication-wizard.png" },
    { url: "http://localhost:3000/faculty", filename: "faculty-directory.png" },
    { url: "http://localhost:3000/faculty/1", filename: "faculty-profile.png" },
    { url: "http://localhost:3000/reports", filename: "reports-analytics.png" },
  ];

  for (const route of routes) {
    try {
      console.log(`Navigating to ${route.url}...`);
      await page.goto(route.url, { waitUntil: "networkidle2", timeout: 15000 });
      await page.evaluate(() => new Promise((resolve) => setTimeout(resolve, 1000)));
      const filePath = path.join(outputDir, route.filename);
      await page.screenshot({ path: filePath, fullPage: false });
      console.log(`✓ Saved ${route.filename}`);
    } catch (err) {
      console.error(`Failed to capture ${route.url}:`, err);
    }
  }

  // Also capture publication details page if available
  try {
    console.log("Navigating to publication details page...");
    await page.goto("http://localhost:3000/publications", { waitUntil: "networkidle2" });
    const pubLink = await page.$('a[href^="/publications/"]');
    if (pubLink) {
      await pubLink.click();
      await page.evaluate(() => new Promise((resolve) => setTimeout(resolve, 1000)));
      const filePath = path.join(outputDir, "publication-details.png");
      await page.screenshot({ path: filePath, fullPage: false });
      console.log("✓ Saved publication-details.png");
    }
  } catch (err) {
    console.error("Failed to capture publication details screenshot:", err);
  }

  await browser.close();
  console.log("All screenshots captured successfully!");
}

captureScreenshots().catch((err) => {
  console.error("Screenshot capture failed:", err);
  process.exit(1);
});
