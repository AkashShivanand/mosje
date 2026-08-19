/**
 * Dangling custom properties — the gate that would have caught twelve broken radii.
 *
 * On 2026-08-19 the radius ladder was value-named (`shape/xs` -> `shape/4`) and the
 * rename did not follow into COMPONENT CSS. Twelve `var(--sa-shape-xs)` references were
 * left pointing at a name nothing declares, so they resolved to NOTHING and rendered
 * `border-radius: 0`. Every existing gate stayed green, because the one test that checks
 * dangling `var()` — `tier-discipline.test.mjs` — reads only the GENERATED token sheets.
 * Nothing looked at the stylesheets that actually consume them.
 *
 * The defect is invisible by construction: CSS does not warn, it silently drops the
 * declaration. The font-size buttons simply had square corners, and stayed that way
 * through a merge, a review and a release until somebody looked at the component.
 *
 * WHAT IS GATED: `--sa-*`, the design-token vocabulary. Those names are GENERATED, so a
 * rename can orphan a consumer without touching it, which is exactly the failure above.
 *
 * WHAT IS ADVISORY: every other prefix. `--color-*` and `--portal-*` are app-level and
 * legitimately declared across zone stylesheets; `--uw-*` belongs to the UX4G widget and
 * is declared by a script we do not ship. Reported, never failed — a gate that fires on
 * somebody else's stylesheet is a gate people learn to silence.
 *
 * KNOWN LIMITATION — PROSE INSIDE STRING LITERALS. Comments are stripped, but a token
 * name written in the `var(--sa-x)` form inside a STRING is indistinguishable from a real
 * reference, and the changelog is a .tsx file full of prose about tokens. This gate
 * flagged its own changelog entry on the day it was written. The convention, which the
 * existing entries already follow, is to name a token in prose by its PATH
 * (`status/warningStrong`) and to use a placeholder for the syntax (`var(--token,
 * fallback)`) — never a real name in the var() form. Cheaper than teaching the scanner
 * to parse TSX, and it makes the prose read better.
 *
 * A FALLBACK DOES NOT RESCUE A DANGLING NAME. `var(--gone, 4px)` renders 4px, so the page
 * looks fine while the token system has quietly stopped governing that value. Those are
 * reported separately rather than passed.
 */
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("../..", import.meta.url));
const SCOPES = ["packages/design-system", "packages/config", "apps/hub/src", "apps/storybook"];
const SKIP = new Set(["node_modules", ".next", "dist", "storybook-static", "__snapshots__", "coverage"]);
const EXT = /\.(css|tsx|ts)$/;

/** Declared elsewhere, by something we do not build. Used but never our job to declare. */
const EXTERNAL_PREFIXES = [
  "--uw-",        // UX4G accessibility widget, injected by the vendor script
  "--tw-",        // Tailwind internals, emitted at build time
  "--radix-",     // Radix primitives
  "--swiper-",    // Swiper
];

/**
 * Comments are stripped before scanning. A `var(--sa-X)` inside prose is documentation,
 * not a reference — website.css explains the fallback slot using exactly that spelling,
 * and an unstripped scan reports it as a broken token.
 */
function stripComments(src) {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, " ")     // /* … */ in CSS and JS alike
    .replace(/(^|[^:"'`\\])\/\/[^\n]*/g, "$1"); // // … , but not the // in a URL
}

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    if (SKIP.has(entry)) continue;
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (EXT.test(p)) out.push(p);
  }
  return out;
}

const files = [];
for (const scope of SCOPES) {
  const abs = join(ROOT, scope);
  if (!existsSync(abs)) {
    // A scope that cannot be read is a hard error, never a skipped scope: the first
    // version of the ds-linkage checker pointed at a path that never existed and
    // cheerfully reported it clean.
    console.error(`✖ dangling-vars: scope does not exist: ${scope}`);
    process.exit(2);
  }
  walk(abs, files);
}
if (files.length === 0) {
  console.error("✖ dangling-vars: matched no files — refusing to report a false clean.");
  process.exit(2);
}

const declared = new Set();
/** name -> [{file, line, hasFallback}] */
const used = new Map();

for (const file of files) {
  const raw = readFileSync(file, "utf8");
  const src = stripComments(raw);
  const rel = relative(ROOT, file);

  // Declarations: `--name:` in CSS, and `"--name":` / `'--name':` in inline style objects.
  for (const m of src.matchAll(/(?:^|[;{\s])(--[A-Za-z0-9_-]+)\s*:/gm)) declared.add(m[1]);
  // React needs a COMPUTED key to set a custom property, and TypeScript needs a cast
  // inside it: `style={{ ["--hero-speed" as string]: `${speed}s` }}`. The `as string]`
  // sitting between the quote and the colon is why a plain `"--x":` pattern misses
  // these, and why --hero-speed and --cmp-card-span read as dangling until 2026-08-19.
  for (const m of src.matchAll(/["'`](--[A-Za-z0-9_-]+)["'`](?:\s+as\s+[A-Za-z]+)?\s*\]?\s*:/g))
    declared.add(m[1]);
  // A property SET AT RUNTIME is declared just as surely as one written in a stylesheet.
  // `--sa-font-scale` exists only because AccessibilityBar calls setProperty on :root;
  // without this the gate would demand a stylesheet declaration that must not exist.
  for (const m of src.matchAll(/setProperty\(\s*["'`](--[A-Za-z0-9_-]+)["'`]/g)) declared.add(m[1]);
  // ...and setProperty is often handed the name through a VARIABLE, so the literal is
  // nowhere near the call. `useCornerRailOffset` declares it as a destructuring default
  // — `const { property = "--sa-corner-rail-bottom" } = options` — and calls
  // `setProperty(property, …)` seventy lines later. A custom-property name sitting in
  // VALUE position (after `=` or `:`) is a name being plumbed somewhere, never a
  // reference: references live inside `var(...)`. Without this the gate reports the
  // corner rail's own token as dangling, which is how it greeted the merge that
  // introduced it.
  for (const m of src.matchAll(/[=:]\s*["'`](--[A-Za-z0-9_-]+)["'`]/g)) declared.add(m[1]);

  // Usages. The name must be FOLLOWED BY a terminator — `,` or `)`. Without that the
  // regex also matches the static prefix of a CONSTRUCTED name, `var(--sa-${token})`,
  // and reports `--sa-` as a broken token. Nine of those in the first run.
  src.split("\n").forEach((line, i) => {
    for (const m of line.matchAll(/var\(\s*(--[A-Za-z0-9_-]+)\s*(?=([,)]))/g)) {
      const entry = { file: rel, line: i + 1, hasFallback: m[2] === "," };
      const list = used.get(m[1]);
      list ? list.push(entry) : used.set(m[1], [entry]);
    }
  });
}

if (declared.size === 0) {
  console.error("✖ dangling-vars: found no declarations at all — the scan is broken.");
  process.exit(2);
}

const isExternal = (n) => EXTERNAL_PREFIXES.some((p) => n.startsWith(p));
const gated = [];
const advisory = [];
for (const [name, sites] of used) {
  if (declared.has(name) || isExternal(name)) continue;
  (name.startsWith("--sa-") ? gated : advisory).push({ name, sites });
}
const withFallback = gated.filter((g) => g.sites.some((s) => s.hasFallback));

const count = (rows) => rows.reduce((n, r) => n + r.sites.length, 0);
console.log(
  `dangling-vars: ${files.length} files · ${declared.size} custom properties declared · ${used.size} referenced.`,
);
if (advisory.length) {
  console.log(`  • ${advisory.length} non --sa-* name(s) referenced but not declared here (advisory):`);
  for (const a of advisory.slice(0, 8)) console.log(`      ${a.name}  ${a.sites.length}× e.g. ${a.sites[0].file}:${a.sites[0].line}`);
  if (advisory.length > 8) console.log(`      …and ${advisory.length - 8} more`);
}

if (gated.length === 0) {
  console.log("✔ every --sa-* reference resolves to a declared token.");
  process.exit(0);
}

console.error(`\n✖ ${count(gated)} reference(s) to ${gated.length} --sa-* token(s) that nothing declares:\n`);
for (const g of gated.sort((a, b) => b.sites.length - a.sites.length)) {
  console.error(`   ${g.name}   (${g.sites.length}×)`);
  for (const s of g.sites.slice(0, 6)) console.error(`     ${s.file}:${s.line}${s.hasFallback ? "   [has a fallback — renders, but the token no longer governs it]" : ""}`);
  if (g.sites.length > 6) console.error(`     …and ${g.sites.length - 6} more`);
}
if (withFallback.length) {
  console.error(
    `\n   ${withFallback.length} of these carry a fallback, so the page LOOKS fine — that is worse,\n` +
    `   not better: the value renders while the token system has stopped governing it.`,
  );
}
console.error(
  `\n   A --sa-* name is GENERATED from packages/tokens. If a token was renamed, follow the\n` +
  `   rename into its consumers; if it was retired, declare the removal in visual-contract's\n` +
  `   REMOVED with evidence of zero consumers. CSS does not warn — it drops the declaration.`,
);
process.exit(1);
