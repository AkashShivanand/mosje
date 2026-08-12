#!/usr/bin/env node
/**
 * Icon-usage audit — does the estate actually use the system the Iconography
 * page documents?
 *
 * The documentation says three things that are checkable, so this checks them:
 *
 *   1. SIZE      Every icon sits on the seven-step scale (16/20/24/32/40/48/64).
 *                Read from `iconSize` in the design system, never hardcoded here,
 *                so the audit tracks the scale rather than a copy of it.
 *   2. SIZING    The size comes from the `size` prop, not from a CSS class.
 *                `className="h-5 w-5"` sets the box but NOT the `opsz` optical-size
 *                axis, so the glyph is drawn for one size and displayed at another.
 *   3. CATALOGUE Every icon name used is in the starter set synced from Figma.
 *                A name outside it is not an error — the set is a floor — but it is
 *                drift worth seeing, in whichever direction it points.
 *
 * NOT checked here: aria-hidden / aria-label. That was the largest finding in the
 * first run (533 of 718 call sites) and is now handled at source — `<Icon>` hides
 * itself unless given a label — so there is nothing left for a linter to count.
 *
 * Reports; does not gate. Run: node tools/icon-audit/check.mjs [--json]
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("../..", import.meta.url));
const SCAN = ["apps/hub/src", "packages/design-system", "apps/storybook/stories"];
const SKIP = new Set(["node_modules", ".next", "dist", "storybook-static", "__snapshots__"]);

/** The scale, read from the design system so this file cannot hold a stale copy. */
const SCALE = new Set(
  [...readFileSync(join(ROOT, "packages/design-system/tokens.ts"), "utf8")
    .matchAll(/px(\d+):\s*(\d+)/g)].map((m) => Number(m[2])),
);

/** The starter set, synced from Figma section 02. */
const CATALOGUE = new Set(
  [...readFileSync(
    join(ROOT, "apps/hub/src/app/design-system/foundations/iconography/icon-catalogue.data.ts"),
    "utf8",
  ).matchAll(/^\s*"([a-z0-9_]+)",$/gm)].map((m) => m[1]),
);

if (SCALE.size === 0 || CATALOGUE.size === 0) {
  console.error("✖ could not read the size scale or the catalogue — refusing to report a false clean.");
  process.exit(2);
}

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    if (SKIP.has(entry)) continue;
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(tsx|ts)$/.test(p)) out.push(p);
  }
  return out;
}

/** Every `<Icon … />` element, including multi-line ones. */
function* icons(src) {
  for (const m of src.matchAll(/<Icon\s[^>]*?\/>/gs)) yield m[0];
}

const findings = { offScale: [], classSized: [] };
let total = 0;
const sizeHistogram = new Map();
const namesUsed = new Set();

for (const scope of SCAN) {
  let files;
  try {
    files = walk(join(ROOT, scope));
  } catch {
    console.error(`✖ scope does not exist: ${scope}`);
    process.exit(2);
  }
  for (const file of files) {
    const rel = relative(ROOT, file);
    // The documentation page renders the whole scale and the whole catalogue on purpose.
    if (rel.includes("design-system/foundations/iconography")) continue;
    const src = readFileSync(file, "utf8");
    const lines = src.split("\n");

    for (const tag of icons(src)) {
      total += 1;
      const head = tag.split("\n")[0].trim();
      const at = lines.findIndex((l) => l.includes(head)) + 1;

      const size = tag.match(/\bsize=\{(\d+)\}/);
      if (size) {
        const n = Number(size[1]);
        sizeHistogram.set(n, (sizeHistogram.get(n) ?? 0) + 1);
        if (!SCALE.has(n)) findings.offScale.push({ file: rel, line: at, size: n });
      }

      const cls = tag.match(/className="([^"]*)"/);
      if (cls && /(?:^|\s)(?:md:|lg:)?[hw]-(?:\d|\[)/.test(cls[1])) {
        findings.classSized.push({ file: rel, line: at, className: cls[1] });
      }

      const name = tag.match(/\bname="([a-z0-9_]+)"/);
      if (name) namesUsed.add(name[1]);
    }
  }
}

const usedNotInFigma = [...namesUsed].filter((n) => !CATALOGUE.has(n)).sort();
const inFigmaUnused = [...CATALOGUE].filter((n) => !namesUsed.has(n)).sort();

if (process.argv.includes("--json")) {
  console.log(JSON.stringify({ total, findings, usedNotInFigma, inFigmaUnused }, null, 2));
  process.exit(0);
}

const onScale = [...sizeHistogram].filter(([n]) => SCALE.has(n)).reduce((a, [, c]) => a + c, 0);
const offScale = findings.offScale.length;

console.log(`\nIcon usage audit — ${total} <Icon> elements across ${SCAN.length} scopes\n`);
console.log(`  Scale       ${SCALE.size} steps: ${[...SCALE].sort((a, b) => a - b).join(", ")}`);
console.log(`  Catalogue   ${CATALOGUE.size} icons (synced from Figma)\n`);

console.log(`1. SIZE — ${onScale} on-scale, ${offScale} off-scale`);
for (const [n, c] of [...sizeHistogram].sort((a, b) => b[1] - a[1])) {
  console.log(`     ${SCALE.has(n) ? "✔" : "✖"} size={${n}}  ×${c}`);
}

console.log(`\n2. SIZING — ${findings.classSized.length} sized by CSS class instead of the size prop`);
for (const f of findings.classSized.slice(0, 10)) {
  console.log(`     ✖ ${f.file}:${f.line}  className="${f.className}"`);
}
if (findings.classSized.length > 10) console.log(`     …and ${findings.classSized.length - 10} more`);

console.log(`\n3. CATALOGUE — ${usedNotInFigma.length} names used that Figma's starter set lacks`);
for (const n of usedNotInFigma) console.log(`     • ${n}`);
console.log(`   ${inFigmaUnused.length} of the ${CATALOGUE.size} starter icons are not yet used in code.`);

console.log(
  `\nReported, not gated. The size scale is a documented standard; moving ${offScale} call\n` +
    `sites onto it changes rendered size in live portals, so it is a human decision.\n`,
);
