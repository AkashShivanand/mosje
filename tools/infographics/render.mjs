/**
 * Renders the home page infographics from their HTML sources.
 *
 *   node tools/infographics/render.mjs
 *
 * Each source is a page of its own size (below) drawn from the token contract; it is
 * shot at 2× so the published PNG stays sharp on a high-density screen. Output lands in
 * apps/hub/public/website/images/infographics/. Needs Google Chrome and a network
 * connection (Noto Sans and Noto Sans Display load from Google Fonts).
 */
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../..");
const puppeteer = createRequire(path.join(root, "package.json"))("puppeteer-core");
const CHROME = process.env.CHROME_PATH ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
/** Each picture at the size its home-page slot needs (see the source's SHAPE note). */
const SOURCES = [{ name: "beneficiary-dashboard", width: 1280, height: 990 }];
const OUT = path.join(root, "apps/hub/public/website/images/infographics");

const browser = await puppeteer.launch({ executablePath: CHROME, args: ["--allow-file-access-from-files"] });
try {
  for (const { name, width, height } of SOURCES) {
    const page = await browser.newPage();
    await page.setViewport({ width, height, deviceScaleFactor: 2 });
    await page.goto(`file://${path.join(here, `${name}.html`)}`, { waitUntil: "networkidle0" });
    await page.evaluate(() => document.fonts.ready);
    // A clipped block, a canvas that grew past its frame, or a missing font is a
    // broken infographic, not a warning. Blocks that must fit carry `data-fit`.
    const check = await page.evaluate(() => ({
      overflow: [...document.querySelectorAll("[data-fit]")].filter(
        (e) => e.scrollWidth > e.clientWidth + 1 || e.scrollHeight > e.clientHeight + 1,
      ).length,
      canvas: document.querySelector(".canvas").scrollHeight,
      fonts: [...new Set([...document.fonts].filter((f) => f.status === "loaded").map((f) => f.family))],
    }));
    const fontsOk = ["Noto Sans", "Noto Sans Display"].every((f) => check.fonts.includes(f));
    if (check.overflow || check.canvas > height || !fontsOk) throw new Error(`${name}: ${JSON.stringify(check)}`);
    await page.screenshot({ path: path.join(OUT, `${name}.png`), clip: { x: 0, y: 0, width, height } });
    console.log(`${name}.png`);
    await page.close();
  }
} finally {
  await browser.close();
}
