/**
 * WCAG 2.2 AA scan of the redesigned website: axe-core over the key routes at
 * 1440 and 375, excluding the third-party UX4G panel. Usage:
 *   node tools/website-redesign/axe-scan.mjs <out.json>
 * The dev server must be running on :3007.
 */
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import fs from "fs";

const BASE = "http://localhost:3007";
const ROUTES = [
  "/website",
  "/website/about-us",
  "/website/schemes-services",
  "/website/schemes-services?who=student",
  "/website/schemes-services/pms-sc",
  "/website/annual-reports",
  "/website/tenders",
  "/website/documents/annual-report-2025-26-english",
  "/website/whos-who",
  "/website/mosje-directory",
  "/website/contact-us",
  "/website/feedback",
  "/website/organisation/nasha-mukt-bharat-abhiyaan",
  "/website/organisation/national-commission-for-scheduled-castes",
  "/website/for-student",
  "/website/events",
  "/website/gallery",
  "/website/search?q=scholarship",
  "/website/search?q=zzzz",
  "/website/accessibility-statement",
  "/website/screen-reader-access",
  "/website/website-policies",
  "/website/sitemap",
  "/website/archives",
  "/website/dashboard",
  "/website/does-not-exist",
];

const VIEWPORTS = [
  { name: "1440", width: 1440, height: 900 },
  { name: "375", width: 375, height: 800 },
];

const out = [];

const browser = await chromium.launch();
for (const vp of VIEWPORTS) {
  const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
  for (const route of ROUTES) {
    const page = await context.newPage();
    const record = { route, viewport: vp.name };
    try {
      const resp = await page.goto(BASE + route, { waitUntil: "domcontentloaded", timeout: 20000 });
      record.status = resp ? resp.status() : null;
      await page.waitForLoadState("networkidle", { timeout: 8000 }).catch(() => {});
      const title = await page.title();
      const lang = await page.evaluate(() => document.documentElement.lang);
      const h1s = await page.evaluate(() => Array.from(document.querySelectorAll("h1")).map(h => h.textContent.trim()));
      record.title = title;
      record.lang = lang;
      record.h1Count = h1s.length;
      record.h1Text = h1s[0] || null;

      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
        .exclude("#uw-main")
        .exclude("#uw-widget-custom-trigger")
        .analyze();

      record.violations = results.violations.map(v => ({
        id: v.id,
        impact: v.impact,
        help: v.help,
        nodes: v.nodes.slice(0, 5).map(n => ({ target: n.target, summary: n.failureSummary })),
        nodeCount: v.nodes.length,
      }));
    } catch (e) {
      record.error = String(e);
    }
    out.push(record);
    await page.close();
  }
  await context.close();
}
await browser.close();

const dest = process.argv[2] ?? "axe-results.json";
fs.writeFileSync(dest, JSON.stringify(out, null, 2));
const bad = out.filter((r) => r.error || (r.violations ?? []).some((v) => ["serious", "critical"].includes(v.impact)));
console.log(`axe: ${out.length} route×viewport scans, ${bad.length} with serious/critical findings or errors`);
for (const r of bad) console.log(" ", r.viewport, r.route, r.error ?? r.violations.filter((v) => ["serious", "critical"].includes(v.impact)).map((v) => `${v.id}(${v.nodeCount})`).join(", "));
