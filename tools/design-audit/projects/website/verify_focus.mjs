// Pixel-proof keyboard focus check — replaces the computed-style comparison in capture_live.mjs.
//
// The first version compared an element's outline / box-shadow / border / background / colour
// focused vs unfocused and called "nothing changed" a missing indicator. It was wrong on the very
// first Tab stop of every page: "Open the accessibility option" is invisible (opacity 0) until it
// is focused, then appears with a 4px blue ring — the box-shadow was set in BOTH states, so the
// style diff saw no change. What a keyboard user sees is pixels, so this compares pixels.
//
// For each page: press Tab N times; at each stop, screenshot the element's box (+8px) focused, then
// blur it and screenshot the same region again. The two PNGs are compared by verify_focus.py.
//
//   node verify_focus.mjs [--stops 30] [--pages slug,slug]
import fs from "node:fs";
import path from "node:path";
const { chromium } = await import("/Users/akashk/Documents/Projects/MoSJE/node_modules/playwright/index.mjs");

const HERE = path.dirname(new URL(import.meta.url).pathname);
const OUT = path.join(HERE, "captures", "focus");
fs.mkdirSync(OUT, { recursive: true });
const argv = process.argv.slice(2);
const opt = (n, d) => { const i = argv.indexOf(`--${n}`); return i >= 0 ? argv[i + 1] : d; };
const STOPS = +opt("stops", 30);
const pages = JSON.parse(fs.readFileSync(path.join(HERE, "inputs", "pages.json"), "utf8"));
const only = opt("pages", null);
const DEFAULT = ["home", "about-us", "whos-who", "annual-reports", "tenders", "vacancies", "gallery",
  "events", "contact-us", "rti", "schemes-services", "sitemap", "for-student", "circulars-notifications",
  "mosje-directory", "dashboard", "samavesh-citizen-portals", "privacy-policy", "cpio", "updates"];
const want = new Set(only ? only.split(",") : DEFAULT);
const targets = pages.filter((p) => want.has(p.slug));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await chromium.launch();
const results = [];
for (const p of targets) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: "en-IN" });
  // The accessibility widget speaks through the Web Speech API when focused — silence it.
  await ctx.addInitScript(() => { try { if (window.speechSynthesis) { speechSynthesis.speak = () => {}; } window.SpeechSynthesisUtterance = function () {}; } catch {} });
  const page = await ctx.newPage();
  try {
    // The origin rate-limits (HTTP 429). A throttled page is not evidence: back off and retry.
    let resp = null;
    for (let attempt = 0; attempt < 6; attempt++) {
      resp = await page.goto("https://www.dosje.gov.in" + p.path, { waitUntil: "load", timeout: 90000 });
      if (resp && resp.status() === 429) { await sleep(30000 * (attempt + 1)); continue; }
      break;
    }
    if (!resp || resp.status() !== 200) { results.push({ slug: p.slug, error: `HTTP ${resp && resp.status()}` }); await ctx.close(); continue; }
    await sleep(3000);
    // Decline the cookie banner so its three buttons do not take tab stops 2–4 on every page.
    await page.evaluate(() => { const b = document.querySelector("#mcc-btn-reject-all"); if (b) b.click(); });
    await sleep(600);
    await page.evaluate(() => { document.activeElement?.blur?.(); window.scrollTo(0, 0); });
    const seen = new Set();
    for (let i = 1; i <= STOPS; i++) {
      await page.keyboard.press("Tab");
      await sleep(350);
      const info = await page.evaluate(() => {
        const e = document.activeElement;
        if (!e || e === document.body) return null;
        const r = e.getBoundingClientRect();
        return { tag: e.tagName.toLowerCase(), id: e.id || null,
                 text: (e.innerText || e.getAttribute("aria-label") || e.getAttribute("title") || "").trim().replace(/\s+/g, " ").slice(0, 60),
                 x: r.x, y: r.y, w: r.width, h: r.height, vw: innerWidth, vh: innerHeight, sy: scrollY };
      });
      if (!info || info.w < 2 || info.h < 2) continue;
      const key = `${info.tag}|${info.id}|${info.text}|${Math.round(info.x)}|${Math.round(info.y + info.sy)}`;
      if (seen.has(key)) break;                          // wrapped around
      seen.add(key);
      if (info.x + info.w < 0 || info.y + info.h < 0 || info.x > info.vw || info.y > info.vh) {
        results.push({ slug: p.slug, stop: i, ...info, offscreen: true });
        continue;
      }
      const pad = 8;
      const clip = { x: Math.max(0, info.x - pad), y: Math.max(0, info.y - pad),
                     width: Math.min(info.vw, info.x + info.w + pad) - Math.max(0, info.x - pad),
                     height: Math.min(info.vh, info.y + info.h + pad) - Math.max(0, info.y - pad) };
      if (clip.width < 4 || clip.height < 4) continue;
      const base = path.join(OUT, `${p.slug}.${String(i).padStart(2, "0")}`);
      await page.screenshot({ path: base + ".focused.png", clip });
      // Hold a direct reference to the focused element: re-finding it by text after the blur landed
      // on a different element with the same label, the tab order jumped back, and the walk ended
      // after ~25 stops without ever leaving the masthead.
      await page.evaluate(() => { window.__qcEl = document.activeElement; document.activeElement?.blur?.(); });
      await sleep(250);
      await page.screenshot({ path: base + ".blurred.png", clip });
      results.push({ slug: p.slug, url: "https://www.dosje.gov.in" + p.path, stop: i, ...info,
                     box: [info.x, info.y + info.sy, info.x + info.w, info.y + info.h + info.sy],
                     focused: path.basename(base) + ".focused.png", blurred: path.basename(base) + ".blurred.png" });
      // Restore focus to exactly this element so the next Tab continues from it.
      await page.evaluate(() => window.__qcEl?.focus?.({ preventScroll: true }));
      await sleep(150);
    }
    console.log(`${p.slug}: ${results.filter((r) => r.slug === p.slug).length} stops`);
  } catch (e) {
    results.push({ slug: p.slug, error: String(e).slice(0, 200) });
  }
  await ctx.close();
  await sleep(1500);
}
await browser.close();
// Merge with an earlier run so a partial re-run (--pages) does not erase pages already judged.
const prevPath = path.join(OUT, "_focus.json");
let prev = [];
try { prev = JSON.parse(fs.readFileSync(prevPath, "utf8")); } catch {}
const redone = new Set(targets.map((t) => t.slug));
fs.writeFileSync(prevPath, JSON.stringify([...prev.filter((r) => !redone.has(r.slug)), ...results], null, 1));
console.log("stops recorded:", results.filter((r) => r.focused).length);
