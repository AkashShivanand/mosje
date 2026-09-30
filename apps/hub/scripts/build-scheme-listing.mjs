#!/usr/bin/env node
/**
 * The live Schemes & Services listing, read from dosje.gov.in and written to
 * src/lib/website-shared/scheme-listing.json.
 *
 *   node apps/hub/scripts/build-scheme-listing.mjs
 *
 * The listing is built in the browser (the cards arrive by script), so it is read
 * with Playwright: the Active tab, filtered to MoSJE, with every group opened and
 * every "View All N Schemes" followed. The live page lists 42 entries in 11 groups;
 * a scheme sits in every group the Department files it under, so the unique list
 * is shorter. Names, groups, their order and "Who It Is For" are kept as published.
 */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const LISTING_URL = "https://www.dosje.gov.in/schemes-services/?org=mosje";
const OUT = fileURLToPath(new URL("../src/lib/website-shared/scheme-listing.json", import.meta.url));

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
await page.goto(LISTING_URL, { waitUntil: "networkidle", timeout: 120_000 });
await page.waitForTimeout(3000);

for (let round = 0; round < 3; round++) {
  for (const h of await page.$$('button[aria-expanded="false"], [data-bs-toggle="collapse"][aria-expanded="false"]')) {
    await h.click({ timeout: 2000 }).catch(() => {});
    await page.waitForTimeout(250);
  }
  for (const a of await page.$$("text=/View All \\d+ Schemes/")) {
    await a.click({ timeout: 2000 }).catch(() => {});
    await page.waitForTimeout(600);
  }
}

const groups = await page.evaluate(() => {
  const out = [];
  for (const g of document.querySelectorAll(".accordion-item")) {
    const head = g.querySelector(".accordion-button, h3, h2");
    if (!head) continue;
    const links = [...g.querySelectorAll('a[href*="/schemes-and-services/"]')].filter((a) => !/view scheme/i.test(a.innerText));
    if (!links.length) continue;
    const count = Number((g.innerText.match(/(\d+) Schemes?/) || [])[1]) || links.length;
    const items = new Map();
    for (const a of links) {
      let card = a;
      for (let i = 0; i < 6 && card && !/Who It Is For/.test(card.innerText); i++) card = card.parentElement;
      const who = card
        ? [...card.querySelectorAll("span, li, .badge")]
            .flatMap((s) => s.innerText.split("\n"))
            .map((t) => t.trim())
            .filter((t) => t && t.length < 40 && !/Who It Is For|View Scheme/.test(t))
        : [];
      const slug = new URL(a.href).pathname.split("/").filter(Boolean).pop();
      if (!items.has(slug)) items.set(slug, { slug, title: a.innerText.replace(/\s+/g, " ").trim(), who: [...new Set(who)] });
    }
    out.push({ name: head.innerText.replace(/\s+\d+ Schemes?.*$/s, "").replace(/\s+/g, " ").trim(), count, items: [...items.values()] });
  }
  return out;
});
await browser.close();

const schemes = {};
for (const g of groups) for (const it of g.items) schemes[it.slug] ??= { title: it.title, who: it.who };
const listing = {
  asOn: new Date().toISOString().slice(0, 10),
  source: LISTING_URL,
  groups: groups.map((g) => ({ name: g.name, slugs: g.items.map((i) => i.slug) })),
  schemes,
};
const entries = listing.groups.reduce((n, g) => n + g.slugs.length, 0);
if (!entries) throw new Error("The live listing returned no schemes; nothing written.");
writeFileSync(OUT, `${JSON.stringify(listing, null, 2)}\n`);
console.log(`${entries} entries in ${listing.groups.length} groups; ${Object.keys(schemes).length} schemes → ${OUT}`);
