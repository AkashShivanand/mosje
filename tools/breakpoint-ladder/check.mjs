/**
 * Breakpoint ladder — a ratchet over the media-query literals CSS forces on us.
 *
 * A `@media` condition cannot read a custom property, so every breakpoint in the estate is a
 * typed number and no token can bind it. The ladder is `breakpoint/*` in the token source
 * (360 · 768 · 1024 · 1280 · 1440 · 1920) and its max-width complements (one pixel less).
 * On 2026-09-05 a sweep counted 122 queries: roughly half on the ladder, 17 on 640 (Tailwind's
 * `sm`, which the estate never adopted), and 20 other off-ladder values — 900, 720, 1025, 860,
 * 960, 680, 600, 560, 540, 520, 500, 480, 479, 380, 1335, 1060 — while the 360 rung appeared in
 * no query at all.
 *
 * Changing a 640 to a 768 is a responsive-behaviour change that needs its own visual pass, so
 * this gate does not demand it. It holds the line: the number of OFF-LADDER media-query
 * literals may only fall. A new one fails the build; an improvement fails too until the
 * baseline is lowered, so one file's cleanup cannot be spent on another's regression.
 *
 * Run `node tools/breakpoint-ladder/check.mjs --baseline` to re-record after a genuine reduction.
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("../..", import.meta.url));
const SCOPES = ["packages/design-system", "apps/hub/src"];
const SKIP = new Set(["node_modules", ".next", "dist", "storybook-static", "public", "coverage"]);
const BASELINE = join(ROOT, "tools/breakpoint-ladder/baseline.json");

const tokens = readFileSync(join(ROOT, "packages/design-system/tokens.css"), "utf8");
const ladder = [...tokens.matchAll(/--sa-ref-breakpoint-[a-zA-Z]+:\s*(\d+)px/g)].map((m) => Number(m[1]));
if (ladder.length === 0) { console.error("✖ breakpoint ladder: no --sa-ref-breakpoint-* in tokens.css"); process.exit(1); }
const allowed = new Set([...ladder, ...ladder.map((n) => n - 1)]);

function* walk(dir) {
  for (const e of readdirSync(dir)) {
    if (SKIP.has(e)) continue;
    const p = join(dir, e);
    if (statSync(p).isDirectory()) yield* walk(p);
    else if (/\.css$/.test(e)) yield p;
  }
}
const strip = (s) => s.replace(/\/\*[\s\S]*?\*\//g, " ");

const offLadder = {};
let total = 0;
for (const scope of SCOPES) for (const file of walk(join(ROOT, scope))) {
  const src = strip(readFileSync(file, "utf8"));
  for (const m of src.matchAll(/@media[^{]*?\((?:min|max)-width:\s*(\d+)px\)/g)) {
    total++;
    const px = Number(m[1]);
    if (allowed.has(px)) continue;
    const rel = relative(ROOT, file);
    (offLadder[rel] ??= []).push(px);
  }
}
const count = Object.values(offLadder).reduce((n, a) => n + a.length, 0);
const distinct = [...new Set(Object.values(offLadder).flat())].sort((a, b) => a - b);

if (process.argv.includes("--baseline")) {
  writeFileSync(BASELINE, JSON.stringify({ $comment: "Off-ladder media-query literal count; may only fall. Re-record with --baseline after a real reduction.", recordedAt: new Date().toISOString().slice(0, 10), offLadder: count, distinct }, null, 2) + "\n");
  console.log(`✔ breakpoint ladder: baseline recorded — ${count} off-ladder literal(s) across ${Object.keys(offLadder).length} file(s).`);
  process.exit(0);
}
const base = JSON.parse(readFileSync(BASELINE, "utf8"));
if (count > base.offLadder) {
  console.error(`✖ breakpoint ladder: ${count} off-ladder media-query literal(s), baseline ${base.offLadder}. The ladder is ${ladder.join(" · ")} (and one pixel less for max-width). New off-ladder values:`);
  for (const [f, a] of Object.entries(offLadder)) console.error(`  ${f}: ${a.join(", ")}`);
  process.exit(1);
}
if (count < base.offLadder) {
  console.error(`✖ breakpoint ladder: ${count} off-ladder literal(s) is BELOW the baseline of ${base.offLadder} — good; re-record it with \`node tools/breakpoint-ladder/check.mjs --baseline\` so the improvement is kept.`);
  process.exit(1);
}
console.log(`✔ breakpoint ladder: ${total} media queries, ${count} off-ladder literal(s) — at the baseline (${distinct.join(", ")}). Ladder ${ladder.join(" · ")}.`);
