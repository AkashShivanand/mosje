/**
 * Website link targets — the gate for links that point at nothing.
 *
 * `check:docs-links` already does this for `/design-system/...`. It cannot help the
 * public website, because every link that broke there broke on a DYNAMIC route: the
 * path resolves to a real `page.tsx`, and the 404 comes from the SLUG not existing in
 * the content that page reads. `/website/organisation/national-helpline-against-atrocities`
 * matches `organisation/[...slug]` perfectly and still 404s.
 *
 * WHAT WENT WRONG, and why a re-audit found it rather than a build:
 *
 *   1. The organisations grid linked an organisation with no record in
 *      `organisation.json` at all — the profile page was never ingested.
 *   2. The mega menu linked the SAME organisation, spelled `...-atro-ro-cities`.
 *      A typo on top of a destination that did not exist either way.
 *   3. The mega menu filed SMILE under `/website/organisation/`. The slug was
 *      real; it lives in `schemes.json`, so the route prefix was the bug.
 *
 * None of the three is visible to `tsc`, to eslint, or to the build — a broken
 * `href` is a well-typed string. They shipped, and were found by resolving all 45
 * links on the home page by hand.
 *
 * WHAT IS CHECKED, for every internal link in the website's source:
 *
 *   1. STATIC routes resolve to a `page.tsx` / `page.ts` / `route.ts`, or to a file
 *      under `apps/hub/public`. Route groups — `(app)`, `(console)` — are not path
 *      segments and are skipped, or every portal link would report broken.
 *   2. DYNAMIC routes resolve to a known pattern AND the slug exists in whatever
 *      that page reads. The three patterns and their sources are declared in
 *      `DYNAMIC` below; a fourth appearing without an entry FAILS LOUDLY rather
 *      than being waved through, because silently accepting an unknown dynamic
 *      route is how this class of bug gets back in.
 *
 * NO BASELINE. Unlike the docs-links and icon-scale gates there is no declared debt
 * here, because there is none: the estate is at zero broken links and a link that
 * goes nowhere is never a considered trade-off the way an undocumented component is.
 * If this gate ever needs an exception, that is a bug to fix, not an entry to add.
 *
 * COMMENTS ARE STRIPPED BEFORE SCANNING. Prose that quotes a path is
 * indistinguishable from a link — `docs-links` solves this by asking authors to write
 * paths differently in prose, which works there because its scope is documentation.
 * Here the paths under discussion are usually in a code comment explaining why a link
 * changed, so stripping comments is both simpler and more honest than a style rule.
 */
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("../..", import.meta.url));
const APP = join(ROOT, "apps/hub/src/app");
const PUBLIC = join(ROOT, "apps/hub/public");
const CONTENT = join(ROOT, "apps/hub/src/content/website");

/** Where the website declares links. */
const SCAN = [
  "apps/hub/src/app/website",
  "apps/hub/src/components/website",
  "apps/hub/src/data/website",
];

const fail = (msg) => {
  console.error(`✖ website-links: ${msg}`);
  process.exit(2);
};

// ── Slugs behind each dynamic route ─────────────────────────────────────────
const jsonSlugs = (file) => {
  const p = join(CONTENT, file);
  if (!existsSync(p)) fail(`content file missing: ${relative(ROOT, p)}`);
  const rows = JSON.parse(readFileSync(p, "utf8"));
  if (!Array.isArray(rows)) fail(`expected an array in ${file}`);
  return new Set(rows.map((r) => r.slug).filter(Boolean));
};

/**
 * `events/[slug]` keeps its records inline in the page rather than in
 * `content/website`, so its slugs are the keys of that object literal.
 */
const inlineEventSlugs = () => {
  const p = join(APP, "website/events/[slug]/page.tsx");
  if (!existsSync(p)) fail("events/[slug]/page.tsx missing");
  const src = readFileSync(p, "utf8");
  const block = src.match(/const EVENTS[^=]*=\s*\{([\s\S]*?)\n\};/);
  if (!block) fail("could not find the EVENTS record in events/[slug]/page.tsx");
  const slugs = new Set();
  for (const m of block[1].matchAll(/^\s{2}["']?([a-z0-9-]+)["']?\s*:\s*\{/gm)) slugs.add(m[1]);
  if (slugs.size === 0) fail("parsed the EVENTS record but found no slugs");
  return slugs;
};

/** route prefix -> the slugs that route accepts. */
const DYNAMIC = [
  { prefix: "/website/organisation/", catchAll: true, slugs: () => jsonSlugs("organisation.json") },
  { prefix: "/website/schemes-services/", catchAll: false, slugs: () => jsonSlugs("schemes.json") },
  { prefix: "/website/events/", catchAll: false, slugs: () => inlineEventSlugs() },
];
for (const d of DYNAMIC) d.set = d.slugs();

// ── Every static route the app serves ───────────────────────────────────────
const routes = new Set();
const dynamicDirs = new Set();

const collect = (dir) => {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      collect(full);
      continue;
    }
    if (!/^(page|route)\.(tsx?|ts)$/.test(entry)) continue;
    // Route groups are organisational, not path segments.
    const segs = relative(APP, dir).split(/[\\/]/).filter((s) => s && !/^\(.*\)$/.test(s));
    if (segs.some((s) => s.startsWith("["))) {
      dynamicDirs.add("/" + segs.join("/"));
      continue;
    }
    routes.add("/" + segs.join("/"));
  }
};
if (!existsSync(APP)) fail("apps/hub/src/app does not exist");
collect(APP);
if (routes.size === 0) fail("found no routes at all — the scan is broken");

// Any dynamic route we did NOT declare above is an unknown we must not wave through.
const declared = DYNAMIC.map((d) => d.prefix.replace(/\/$/, ""));
const undeclared = [...dynamicDirs].filter(
  (d) => d.startsWith("/website/") && !declared.some((p) => d.startsWith(p)),
);

// ── Collect the links ───────────────────────────────────────────────────────
const stripComments = (src) =>
  src.replace(/\/\*[\s\S]*?\*\//g, " ").replace(/(^|[^:])\/\/[^\n]*/g, "$1 ");

const walk = (dir, out = []) => {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (/\.tsx?$/.test(entry)) out.push(full);
  }
  return out;
};

const files = [];
for (const scope of SCAN) {
  const abs = join(ROOT, scope);
  if (!existsSync(abs)) fail(`scope does not exist: ${scope}`);
  walk(abs, files);
}

const LINK_KEYS = /\b(?:href|profileHref|viewAllHref|cardLink)\s*[:=]\s*["'`](\/[^"'`]*)["'`]/g;

const broken = [];
for (const file of files) {
  const rel = relative(ROOT, file);
  const src = stripComments(readFileSync(file, "utf8"));
  for (const m of src.matchAll(LINK_KEYS)) {
    const raw = m[1];
    if (!/^\/(website|portals)(\/|$)/.test(raw)) continue;
    const path = raw.split(/[?#]/)[0].replace(/\/$/, "");

    if (routes.has(path)) continue;
    if (existsSync(join(PUBLIC, path.replace(/^\//, "")))) continue;

    const dyn = DYNAMIC.find((d) => path.startsWith(d.prefix));
    if (dyn) {
      const slug = path.slice(dyn.prefix.length);
      if (dyn.set.has(slug)) continue;
      // A catch-all also serves its own parents: `a/b` is valid if `a` is.
      if (dyn.catchAll && [...dyn.set].some((s) => s.startsWith(slug + "/"))) continue;
      broken.push({ rel, path, why: `no such slug — ${dyn.prefix}* is served from ${dyn.prefix.includes("organisation") ? "organisation.json" : dyn.prefix.includes("schemes") ? "schemes.json" : "the EVENTS record"}` });
      continue;
    }
    broken.push({ rel, path, why: "no route, no static file, and not under a known dynamic route" });
  }
}

// ── Report ──────────────────────────────────────────────────────────────────
if (undeclared.length) {
  console.error("✖ website-links: dynamic website route(s) this gate does not know about.\n");
  for (const d of undeclared) console.error(`  ${d}`);
  console.error(
    "\n  Add it to DYNAMIC in tools/website-links/check.mjs with the source its\n" +
      "  slugs come from. Until then links into it cannot be verified, and an\n" +
      "  unverified dynamic route is exactly how the three broken ones shipped.\n",
  );
  process.exit(1);
}

if (broken.length) {
  console.error(`✖ website-links: ${broken.length} link(s) point at nothing.\n`);
  const byFile = new Map();
  for (const b of broken) {
    if (!byFile.has(b.rel)) byFile.set(b.rel, []);
    byFile.get(b.rel).push(b);
  }
  for (const [rel, items] of byFile) {
    console.error(`  ${rel}`);
    for (const i of items) console.error(`    ${i.path}\n      ${i.why}`);
  }
  console.error(
    "\n  A broken href is a well-typed string, so nothing else in the toolchain\n" +
      "  will tell you. Point it at a route that exists, or add the missing record\n" +
      "  to the content it reads.\n",
  );
  process.exit(1);
}

// ── Anchors inside INGESTED CONTENT ─────────────────────────────────────────
/**
 * The checks above scan the website's own source. They cannot see a dead link
 * that arrived in `content/website/*.json`, because ingested HTML is a string in
 * a data file, not an `href` in a component.
 *
 * That gap shipped: the NCBC judgments table carried three
 * `href="PLACEHOLDER_URL_1..3"` anchors, rendering a "View" button per row that
 * went nowhere. They came in verbatim from the upstream dosje.gov.in page, which
 * still serves them today — so this is not a bug the ingest introduced, and
 * re-running the ingest would reinstate it. Hence a gate rather than a one-time
 * content edit.
 *
 * A usable destination is absolute (http/https/mailto/tel), site-relative, or a
 * fragment. Anything else — a bare token like `PLACEHOLDER_URL_1`, an empty
 * href — is a link the reader can click that does nothing.
 */
const USABLE_HREF = /^(https?:\/\/|mailto:|tel:|\/|#)/i;
const contentDead = [];

const walkStrings = (node, visit) => {
  if (typeof node === "string") return visit(node);
  if (Array.isArray(node)) return node.forEach((n) => walkStrings(n, visit));
  if (node && typeof node === "object") return Object.values(node).forEach((n) => walkStrings(n, visit));
};

const contentFiles = existsSync(CONTENT)
  ? readdirSync(CONTENT).filter((f) => f.endsWith(".json"))
  : [];

for (const file of contentFiles) {
  const raw = readFileSync(join(CONTENT, file), "utf8");
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    fail(`content file is not valid JSON: ${file}`);
  }
  walkStrings(parsed, (str) => {
    if (!str.includes("<a")) return;
    for (const m of str.matchAll(/<a\b[^>]*>/gi)) {
      const href = m[0].match(/\bhref\s*=\s*["']([^"']*)["']/i)?.[1];
      if (href === undefined) continue; // an anchor with no href is not a link
      if (!USABLE_HREF.test(href.trim())) {
        contentDead.push({ file, href: href.trim() || "(empty)" });
      }
    }
  });
}

if (contentDead.length) {
  console.error(
    `✖ website-links: ${contentDead.length} anchor(s) in ingested content point at nothing.\n`,
  );
  const byFile = new Map();
  for (const d of contentDead) {
    if (!byFile.has(d.file)) byFile.set(d.file, []);
    byFile.get(d.file).push(d.href);
  }
  for (const [file, hrefs] of byFile) {
    console.error(`  apps/hub/src/content/website/${file}`);
    for (const h of hrefs) console.error(`    href="${h}"`);
  }
  console.error(
    "\n  These render as clickable controls that do nothing. If the real document\n" +
      "  exists, link it (or copy it under apps/hub/public/website/content/). If it\n" +
      "  does not, drop the anchor and leave the label as plain text — never ship a\n" +
      "  control that lies about being one.\n",
  );
  process.exit(1);
}

const linkCount = files.reduce(
  (n, f) => n + [...stripComments(readFileSync(f, "utf8")).matchAll(LINK_KEYS)]
    .filter((m) => /^\/(website|portals)(\/|$)/.test(m[1])).length,
  0,
);
console.log(
  `✔ website-links: ${linkCount} internal link(s) across ${files.length} files — every one resolves ` +
    `(${routes.size} static routes, ${DYNAMIC.length} dynamic routes); ` +
    `every anchor in ${contentFiles.length} ingested content file(s) has a usable destination.`,
);
