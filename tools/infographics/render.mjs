/**
 * Renders the home page infographics from their HTML sources.
 *
 *   node tools/infographics/render.mjs
 *
 * Each source is a 1080×1080 page drawn from the token contract; it is shot at
 * 2× so the published PNG stays sharp on a high-density screen. Output lands in
 * apps/hub/public/website/images/infographics/. Needs Google Chrome and a network
 * connection (Noto Sans and Material Symbols load from Google Fonts).
 */
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../..");
const puppeteer = createRequire(path.join(root, "package.json"))("puppeteer-core");
const CHROME = process.env.CHROME_PATH ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const SOURCES = ["setu-scholarships"];
const OUT = path.join(root, "apps/hub/public/website/images/infographics");

const browser = await puppeteer.launch({ executablePath: CHROME, args: ["--allow-file-access-from-files"] });
try {
  for (const name of SOURCES) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1080, height: 1080, deviceScaleFactor: 2 });
    await page.goto(`file://${path.join(here, `${name}.html`)}`, { waitUntil: "networkidle0" });
    await page.evaluate(() => document.fonts.ready);
    // A clipped card or a missing font is a broken infographic, not a warning.
    const check = await page.evaluate(() => ({
      overflow: [...document.querySelectorAll(".tile, .card")].filter(
        (e) => e.scrollWidth > e.clientWidth || e.scrollHeight > e.clientHeight,
      ).length,
      fonts: [...new Set([...document.fonts].filter((f) => f.status === "loaded").map((f) => f.family))],
    }));
    if (check.overflow || check.fonts.length < 3) throw new Error(`${name}: ${JSON.stringify(check)}`);
    await page.screenshot({ path: path.join(OUT, `${name}.png`), clip: { x: 0, y: 0, width: 1080, height: 1080 } });
    console.log(`${name}.png`);
    await page.close();
  }
} finally {
  await browser.close();
}
