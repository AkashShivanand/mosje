#!/usr/bin/env node
/**
 * Follows every link on the DBIM design's organisation pages, two levels out, and
 * reports (a) any page that does not answer 200/30x and (b) any link that still names
 * a dosje.gov.in PAGE. The resolver is lib/website-dbim/live-links.ts; the rule that
 * the DBIM pages open the estate's own pages is the Department's, 29 Sep 2026.
 *
 *   node tools/dbim-live-links/crawl.mjs [http://localhost:3007]
 *
 * Needs a running hub. The DBIM design is selected with its cookie, as the demo rail does.
 * Exit code 1 when any page fails; live links are listed for review (portals and other
 * organisations' own sites are expected there — see live-links.ts).
 */
const B = process.argv[2] ?? "http://localhost:3007";
const H = { headers: { cookie: "sa-website-design=dbim" }, redirect: "manual" };
const ids = [
  "dr-ambedkar-foundation", "national-commission-for-scheduled-castes", "national-commission-for-safai-karamcharis",
  "national-commission-for-backward-classes-ncbc", "dr-ambedkar-international-centre",
  "national-scheduled-castes-finance-and-development-corporation", "national-safai-karamcharis-finance-development-corporation",
  "national-backward-classes-financeand-development-corporationnbcfdc",
  "development-and-welfare-board-for-de-notified-nomadic-and-semi-nomadic", "national-institute-of-social-defence",
  "babu-jagjivan-ram-national-foundation-jrf",
];
const SKIP = /^\/website\/(search|sitemap|help|feedback|cookies|important-links|related-links|policies|archives|whats-new|persona)/;
const seen = new Map();
const live = new Map();
const queue = ids.map((i) => [`/website/ministry/our-organisation/${i}`, "(start)", 0]);

async function visit([u, from, depth]) {
  if (seen.has(u)) return [];
  seen.set(u, "…");
  let r;
  for (let a = 0; a < 3; a++) {
    r = await fetch(B + u, H).catch(() => null);
    if (r && r.status < 500) break;
    await new Promise((z) => setTimeout(z, 1500));
  }
  seen.set(u, `${r?.status ?? 0} ← ${from}`);
  if (!r || r.status >= 300 || depth >= 2) return [];
  const html = await r.text();
  const i = html.indexOf('id="main');
  const j = html.lastIndexOf("<footer");
  const out = [];
  for (const m of html.slice(Math.max(i, 0), j > 0 ? j : html.length).matchAll(/href="([^"]+)"/g)) {
    const h = m[1].replace(/&amp;/g, "&").split("#")[0];
    if (!h || /^(tel|mailto):/.test(h)) continue;
    if (/^https?:/.test(h)) {
      if (/dosje\.gov\.in/.test(h) && !/\.(pdf|docx?|xlsx?|jpe?g|png)$/i.test(h)) live.set(h, u);
      continue;
    }
    if (/\.(pdf|docx?|xlsx?|jpe?g|png|webp|svg)$/i.test(h) || h.startsWith("/_next")) continue;
    if (h.startsWith("/website/") && !SKIP.test(h)) out.push([h.split("?")[0], u, depth + 1]);
  }
  return out;
}

while (queue.length) {
  const next = (await Promise.all(queue.splice(0, 4).map(visit))).flat();
  queue.push(...next.filter((n) => !seen.has(n[0])));
}
const bad = [...seen].filter(([, v]) => !/^(200|30\d)/.test(v));
console.log(`pages checked: ${seen.size} · failing: ${bad.length}`);
for (const [k, v] of bad) console.log(`  ${v.split(" ← ")[0]} ${k}  ← ${v.split(" ← ")[1]}`);
console.log(`dosje.gov.in links still on these pages: ${live.size}`);
for (const [h, u] of live) console.log(`  ${h}  on ${u}`);
process.exit(bad.length ? 1 : 0);
