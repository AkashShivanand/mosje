#!/usr/bin/env node
/**
 * Storybook coverage gate.
 *
 * Storybook is the estate's shared reference for what a component is meant to
 * do — the thing BAs, QAs and designers open instead of reading source. It only
 * works if it reflects the design system. In August 2026 it covered 2 of ~78
 * exported components and had done for months, because nothing ever checked.
 * Docs that lag the code that far are worse than none: people trust them.
 *
 * So the rule is mechanical, not cultural. This is a RATCHET, not a demand for
 * 100% today:
 *
 *   - A component exported from the barrel with no story FAILS the build…
 *   - …unless it is listed in the baseline as known, pre-existing debt.
 *   - A baseline entry that now HAS a story also FAILS, telling you to delete
 *     the line. That is what stops the backlog quietly growing back.
 *
 * Net effect: coverage can only improve. Adding a component without a story is
 * blocked; burning down the backlog is rewarded by a gate that tightens itself.
 *
 *   node scripts/check-storybook-coverage.mjs
 *   node scripts/check-storybook-coverage.mjs --update-baseline
 */

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from "node:fs";
import path from "node:path";

// Shared with check-design-context.mjs so the two gates cannot disagree about
// what counts as a component — see scripts/lib/ds-exports.mjs.
import { exportedComponents } from "./lib/ds-exports.mjs";

const STORIES_DIR = process.env.STORIES_DIR ?? "apps/storybook/stories";
const BASELINE =
  process.env.STORYBOOK_BASELINE ?? "apps/storybook/coverage-baseline.json";

function fail(message) {
  console.error(`\n✖ storybook coverage: ${message}\n`);
  process.exit(1);
}

function storyFiles(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((entry) => {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) return storyFiles(full);
    return full.endsWith(".stories.tsx") || full.endsWith(".stories.ts") ? [full] : [];
  });
}

/**
 * Which components a story file covers, from three signals:
 *
 *   1. the `component:` field of its default export,
 *   2. an explicit `@covers A, B, C` comment — for a file that legitimately
 *      documents several components together, where showing them side by side
 *      is the point (selection controls, chart primitives),
 *   3. the filename, so renaming a file cannot silently drop coverage.
 *
 * Note what is deliberately NOT a signal: imports. A story that imports Button
 * to put one next to the thing it is actually demonstrating does not document
 * Button, and counting it would let coverage drift upward on its own.
 */
function coveredComponents() {
  const covered = new Set();
  for (const file of storyFiles(STORIES_DIR)) {
    const src = readFileSync(file, "utf8");

    const declared = src.match(/component:\s*([A-Z][A-Za-z0-9_]*)/);
    if (declared) covered.add(declared[1]);

    for (const match of src.matchAll(/@covers\s+([A-Za-z0-9_,\s]+)/g)) {
      for (const name of match[1].split(",")) {
        const trimmed = name.trim();
        if (/^[A-Z][A-Za-z0-9_]*$/.test(trimmed)) covered.add(trimmed);
      }
    }

    const base = path.basename(file).replace(/\.stories\.tsx?$/, "");
    if (/^[A-Z]/.test(base)) covered.add(base);
  }
  return covered;
}

const components = exportedComponents();
const covered = coveredComponents();
const missing = [...components].filter((c) => !covered.has(c)).sort();

if (process.argv.includes("--update-baseline")) {
  writeFileSync(BASELINE, `${JSON.stringify({ missing }, null, 2)}\n`);
  console.log(
    `• storybook coverage: baseline written — ${missing.length} component(s) recorded as known debt.`,
  );
  process.exit(0);
}

const baseline = existsSync(BASELINE)
  ? new Set(JSON.parse(readFileSync(BASELINE, "utf8")).missing ?? [])
  : new Set();

// New drift: a component with no story that nobody signed off as debt.
const undeclared = missing.filter((c) => !baseline.has(c));
// The ratchet: debt that has since been paid off must leave the baseline, or it
// silently re-opens a licence to delete that story later.
const stale = [...baseline].filter((c) => !missing.includes(c)).sort();

if (undeclared.length) {
  fail(
    `${undeclared.length} component(s) exported from the design system have no story:\n` +
      undeclared.map((c) => `    · ${c}`).join("\n") +
      `\n\n  Add a story under ${STORIES_DIR}/, or — only if it genuinely cannot have\n` +
      `  one — add it to NOT_COMPONENTS in this script with a reason.`,
  );
}

if (stale.length) {
  fail(
    `${stale.length} baseline entr(y/ies) now have stories. Remove them from\n` +
      `  ${BASELINE} so the backlog cannot grow back:\n` +
      stale.map((c) => `    · ${c}`).join("\n"),
  );
}

const total = components.size;
const done = total - missing.length;
const pct = total ? Math.round((done / total) * 100) : 100;
console.log(
  `✔ storybook coverage: ${done}/${total} components (${pct}%) — ` +
    `${missing.length} known, declared in the baseline.`,
);
