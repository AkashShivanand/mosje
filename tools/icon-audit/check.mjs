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
 * ── MODES ────────────────────────────────────────────────────────────────────
 *   node tools/icon-audit/check.mjs                   report (human-readable)
 *   node tools/icon-audit/check.mjs --json            report (machine-readable)
 *   node tools/icon-audit/check.mjs --gate            RATCHET — used by CI
 *   node tools/icon-audit/check.mjs --update-baseline record today's counts
 *
 * ── WHY A RATCHET AND NOT A FIX ──────────────────────────────────────────────
 * 213 of 762 call sites are off the scale, 126 of them at `size={14}`. That is not
 * a typo — someone chose 14 to sit against 14px body text — and raising 126 glyphs
 * by 2px changes row heights in dense admin tables across seven live portals.
 *
 * The decision (2026-08-12) is to let these go as the pages are redesigned one by
 * one, rather than spend a sweep on them now. A ratchet is what makes that safe:
 * it costs nothing today, it refuses to let the number GROW, and it tells you to
 * lower the baseline every time a redesign takes some away — so the backlog can
 * only shrink, and it cannot quietly grow back.
 *
 * The baseline is PER FILE, deliberately. A single global count would let a
 * redesign remove five off-scale icons from one page while another page added
 * five, and report success for a net change of nothing.
 */

import { readFileSync, readdirSync, statSync, writeFileSync, existsSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("../..", import.meta.url));
const SCAN = ["apps/hub/src", "packages/design-system", "apps/storybook/stories"];
const SKIP = new Set(["node_modules", ".next", "dist", "storybook-static", "__snapshots__"]);
const BASELINE = join(ROOT, "tools/icon-audit/scale-baseline.json");

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

// A gate that cannot fail is worse than no gate: if either source went unread we
// would report a clean estate rather than a broken audit.
if (SCALE.size === 0 || CATALOGUE.size === 0) {
  console.error("✖ icon audit: could not read the size scale or the catalogue — refusing to report a false clean.");
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
/** file → { offScale, classSized } */
const perFile = new Map();

function bump(file, key) {
  const row = perFile.get(file) ?? { offScale: 0, classSized: 0 };
  row[key] += 1;
  perFile.set(file, row);
}

for (const scope of SCAN) {
  let files;
  try {
    files = walk(join(ROOT, scope));
  } catch {
    console.error(`✖ icon audit: scope does not exist: ${scope}`);
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
        if (!SCALE.has(n)) {
          findings.offScale.push({ file: rel, line: at, size: n });
          bump(rel, "offScale");
        }
      }

      const cls = tag.match(/className="([^"]*)"/);
      if (cls && /(?:^|\s)(?:sm:|md:|lg:|xl:)?[hw]-(?:\d|\[)/.test(cls[1])) {
        findings.classSized.push({ file: rel, line: at, className: cls[1] });
        bump(rel, "classSized");
      }

      const name = tag.match(/\bname="([a-z0-9_]+)"/);
      if (name) namesUsed.add(name[1]);
    }
  }
}

const usedNotInFigma = [...namesUsed].filter((n) => !CATALOGUE.has(n)).sort();
const inFigmaUnused = [...CATALOGUE].filter((n) => !namesUsed.has(n)).sort();
const current = Object.fromEntries([...perFile].sort(([a], [b]) => a.localeCompare(b)));
const offScale = findings.offScale.length;
const onScale = [...sizeHistogram].filter(([n]) => SCALE.has(n)).reduce((a, [, c]) => a + c, 0);

// ── --update-baseline ────────────────────────────────────────────────────────
if (process.argv.includes("--update-baseline")) {
  writeFileSync(
    BASELINE,
    `${JSON.stringify(
      {
        note: [
          "Known, pre-existing icon-scale debt, PER FILE. Written by",
          "`node tools/icon-audit/check.mjs --update-baseline`.",
          "",
          "These call sites size an icon off the seven-step scale, or size it with a",
          "CSS class instead of the `size` prop. The decision (2026-08-12) is to let",
          "them go as the pages are redesigned one by one, rather than sweep them now:",
          "126 of them are `size={14}`, and raising those by 2px changes row heights in",
          "dense admin tables across seven live portals.",
          "",
          "This file is a RATCHET, not a permission slip. The gate fails if a count",
          "GROWS or a new file appears, and it fails if a count SHRINKS without this",
          "file being updated — so the backlog can only go down. When you redesign a",
          "page, re-run --update-baseline in the same change.",
        ],
        totals: { offScale, classSized: findings.classSized.length },
        files: current,
      },
      null,
      2,
    )}\n`,
  );
  console.log(
    `• icon audit: baseline written — ${offScale} off-scale + ${findings.classSized.length} class-sized ` +
      `across ${Object.keys(current).length} file(s) recorded as known debt.`,
  );
  process.exit(0);
}

// ── --gate ───────────────────────────────────────────────────────────────────
if (process.argv.includes("--gate")) {
  if (!existsSync(BASELINE)) {
    console.error(
      "✖ icon audit: no baseline. Run `node tools/icon-audit/check.mjs --update-baseline` and commit it.",
    );
    process.exit(1);
  }
  const base = JSON.parse(readFileSync(BASELINE, "utf8")).files ?? {};
  const grown = [];
  const appeared = [];
  const shrunk = [];
  const cleared = [];

  for (const [file, now] of Object.entries(current)) {
    const was = base[file];
    if (!was) {
      appeared.push({ file, now });
      continue;
    }
    for (const kind of ["offScale", "classSized"]) {
      if (now[kind] > (was[kind] ?? 0)) grown.push({ file, kind, was: was[kind] ?? 0, now: now[kind] });
      else if (now[kind] < (was[kind] ?? 0)) shrunk.push({ file, kind, was: was[kind] ?? 0, now: now[kind] });
    }
  }
  for (const file of Object.keys(base)) if (!current[file]) cleared.push(file);

  if (appeared.length || grown.length) {
    console.error("\n✖ icon audit: NEW off-scale icon sizing.\n");
    for (const a of appeared) {
      console.error(`  new file  ${a.file}  (offScale ${a.now.offScale}, classSized ${a.now.classSized})`);
    }
    for (const g of grown) console.error(`  grew      ${g.file}  ${g.kind} ${g.was} → ${g.now}`);
    console.error(
      `\n  The scale is 16 · 20 · 24 · 32 · 40 · 48 · 64, and it comes from the \`size\`\n` +
        `  prop — a CSS class sets the box but not the \`opsz\` axis, so the glyph is\n` +
        `  drawn for one size and shown at another.\n\n` +
        `  Existing debt is grandfathered and going away with the page redesigns. This\n` +
        `  is about not adding more. Pick the nearest step; if the design genuinely\n` +
        `  needs a value the scale lacks, that is a token conversation, not a literal.\n`,
    );
    process.exit(1);
  }

  if (shrunk.length || cleared.length) {
    console.error("\n✖ icon audit: debt went DOWN — update the baseline so it cannot grow back.\n");
    for (const s of shrunk) console.error(`  fixed     ${s.file}  ${s.kind} ${s.was} → ${s.now}`);
    for (const c of cleared) console.error(`  cleared   ${c}`);
    console.error(
      "\n  Nice. Run `node tools/icon-audit/check.mjs --update-baseline` and commit it\n" +
        "  in the same change.\n",
    );
    process.exit(1);
  }

  console.log(
    `✔ icon audit: no new off-scale icon sizing — ${offScale} off-scale + ` +
      `${findings.classSized.length} class-sized, all known and declared in the baseline ` +
      `(${onScale} of ${onScale + offScale} sized calls are on the scale).`,
  );
  process.exit(0);
}

// ── report ───────────────────────────────────────────────────────────────────
if (process.argv.includes("--json")) {
  console.log(JSON.stringify({ total, findings, usedNotInFigma, inFigmaUnused, perFile: current }, null, 2));
  process.exit(0);
}

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

console.log(`\nTop files by off-scale count:`);
for (const [f, r] of [...perFile].sort((a, b) => b[1].offScale - a[1].offScale).slice(0, 8)) {
  if (r.offScale) console.log(`     ${String(r.offScale).padStart(3)}  ${f}`);
}

console.log(
  `\nFindings 1 and 2 are RATCHETED, not fixed — they go away with the page\n` +
    `redesigns. \`--gate\` (in CI) refuses to let them grow. \`--update-baseline\`\n` +
    `records the reduction when a redesign lands.\n`,
);
