/**
 * Internal documentation links — the gate for pointers that go nowhere.
 *
 * A `<a href="/design-system/components/badge#toast">` that names an id no page
 * carries is not a broken link in any way a browser will tell you about. It
 * resolves, it returns 200, and it silently lands the reader at the TOP of a page
 * about something else. Nothing in the estate looked for that, so the sidebar
 * accumulated sixteen of them — nearly half its anchor links — advertising
 * documentation that was never written, plus one component (`AppSwitcher`) that
 * had since been retired outright.
 *
 * WHAT IS CHECKED, for every `/design-system/...` link in the docs app:
 *
 *   1. the ROUTE resolves — to a `page.tsx`, a `route.ts` handler, or a static
 *      file under `apps/hub/public`. All three are real; an earlier version of
 *      this scan knew only about pages and reported `llms.txt`, `tokens.json`
 *      and two SVGs as broken. A checker that cries wolf gets ignored.
 *   2. the ANCHOR, when present, matches an `id` that page actually renders.
 *
 * PROSE ABOUT LINKS IS INDISTINGUISHABLE FROM A LINK. The changelog is a .tsx file
 * that necessarily quotes the paths it is describing, and this gate flagged its own
 * changelog entry the day it was written — exactly as the dangling-var gate did. Same
 * convention, same reason: in prose, name a route WITHOUT the leading `/design-system`
 * (`components/app-switcher`), which reads no worse and costs nothing. Teaching the
 * scanner to parse TSX to tell a string in JSX from a string in a data array is a far
 * larger job than writing the sentence differently.
 *
 * KNOWN DEBT lives in `orphan-anchors.json` and MAY ONLY SHRINK — the same
 * ratchet `check-storybook-coverage.mjs` and the icon audit use. An entry that
 * has since been fixed FAILS too, so the list cannot rot: fixing something
 * forces you to delete its excuse in the same change.
 *
 * WHY A BASELINE RATHER THAN A CLEAN GATE. The sixteen orphans point at real,
 * exported, shipping components — Alert, Modal, Toast, Avatar and friends — that
 * simply have no doc section. Deleting the nav entries would hide components
 * people need to find; writing sixteen doc sections is not a bug fix. So the
 * debt is DECLARED, with the resolution left to a human, and the gate stops the
 * seventeenth from appearing quietly.
 */
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("../..", import.meta.url));
const APP = join(ROOT, "apps/hub/src/app");
const PUBLIC = join(ROOT, "apps/hub/public");
const BASELINE = join(ROOT, "tools/docs-links/orphan-anchors.json");

const SCAN = [
  "apps/hub/src/app/design-system",
  "apps/hub/src/components/design-system",
  "apps/hub/src/lib/design-system",
];

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (/\.(tsx?|css)$/.test(entry)) out.push(full);
  }
  return out;
}

// ── Build the map of what exists ────────────────────────────────────────────
/** route -> Set of ids rendered on it. Routes with no page (handlers, assets) map to null. */
const routes = new Map();

function collectPages(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      collectPages(full);
      continue;
    }
    const route = "/" + relative(APP, dir).replace(/\\/g, "/");
    if (entry === "page.tsx" || entry === "page.ts") {
      const src = readFileSync(full, "utf8");
      const ids = new Set();
      // `id="x"` in JSX, and `id: "x"` in the section-data objects some pages use.
      for (const m of src.matchAll(/\bid=["']([^"']+)["']/g)) ids.add(m[1]);
      for (const m of src.matchAll(/\bid:\s*["']([^"']+)["']/g)) ids.add(m[1]);
      routes.set(route, ids);
    } else if (entry === "route.ts" || entry === "route.tsx") {
      // A handler is a real route with no ids — `/design-system/llms.txt`.
      if (!routes.has(route)) routes.set(route, null);
    }
  }
}

const dsApp = join(APP, "design-system");
if (!existsSync(dsApp)) {
  console.error("✖ docs-links: apps/hub/src/app/design-system does not exist.");
  process.exit(2);
}
collectPages(dsApp);
if (routes.size === 0) {
  console.error("✖ docs-links: found no routes at all — the scan is broken.");
  process.exit(2);
}

const staticFile = (route) => existsSync(join(PUBLIC, route.replace(/^\//, "")));

// ── Collect every link ──────────────────────────────────────────────────────
const files = [];
for (const scope of SCAN) {
  const abs = join(ROOT, scope);
  if (!existsSync(abs)) {
    console.error(`✖ docs-links: scope does not exist: ${scope}`);
    process.exit(2);
  }
  if (statSync(abs).isDirectory()) walk(abs, files);
  else files.push(abs);
}

const missingRoute = [];
const missingAnchor = [];

for (const file of files) {
  const rel = relative(ROOT, file);
  const src = readFileSync(file, "utf8");
  src.split("\n").forEach((line, i) => {
    for (const m of line.matchAll(/["'`](\/design-system(?:\/[^"'`\s#]*)?(?:#[^"'`\s]+)?)["'`]/g)) {
      // A CONSTRUCTED path is not a link this scan can resolve — and it is not a
      // defect either. `/design-system/org-logos/${k}.png` interpolates a key at
      // render time; the 16 files it can resolve to are all present.
      if (m[1].includes("${")) continue;
      const [route, frag] = m[1].split("#");
      const key = route.replace(/\/$/, "") || "/design-system";
      const where = `${rel}:${i + 1}`;
      if (!routes.has(key)) {
        if (!staticFile(key)) missingRoute.push({ link: m[1], where });
        continue; // a static asset carries no ids
      }
      const ids = routes.get(key);
      if (frag && ids && !ids.has(frag)) missingAnchor.push({ link: m[1], where, anchor: frag });
    }
  });
}

// ── Ratchet the declared debt ───────────────────────────────────────────────
const baseline = existsSync(BASELINE)
  ? new Set(JSON.parse(readFileSync(BASELINE, "utf8")).orphans)
  : new Set();

const unexpected = missingAnchor.filter((f) => !baseline.has(f.link));
const seen = new Set(missingAnchor.map((f) => f.link));
const fixed = [...baseline].filter((b) => !seen.has(b));

console.log(
  `docs-links: ${routes.size} routes · ${files.length} files scanned · ` +
    `${baseline.size} declared orphan anchor(s).`,
);

let failed = false;

if (missingRoute.length) {
  failed = true;
  console.error(`\n✖ ${missingRoute.length} link(s) to a route that does not exist:\n`);
  for (const f of missingRoute) console.error(`   ${f.link}\n     ${f.where}`);
}

if (unexpected.length) {
  failed = true;
  console.error(`\n✖ ${unexpected.length} NEW link(s) to an anchor no page renders:\n`);
  for (const f of unexpected) console.error(`   ${f.link}\n     ${f.where}`);
  console.error(
    "\n   The link resolves and returns 200 — it just drops the reader at the top of\n" +
      "   a page about something else. Either add a section with that id, point the\n" +
      "   link at where the component IS documented, or remove it.\n",
  );
}

if (fixed.length) {
  failed = true;
  console.error(`\n✖ ${fixed.length} declared orphan(s) no longer broken — delete them from`);
  console.error(`   ${relative(ROOT, BASELINE)}:\n`);
  for (const f of fixed) console.error(`   ${f}`);
  console.error("\n   The baseline may only shrink, and it shrinks by hand so the fix is noticed.\n");
}

if (failed) process.exit(1);
console.log(`✔ every internal /design-system link resolves, anchors included.`);
