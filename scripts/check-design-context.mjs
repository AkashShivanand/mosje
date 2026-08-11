#!/usr/bin/env node
/**
 * Design-context coverage gate.
 *
 * `packages/design-system/design.md` is the estate's authoritative AI design
 * context — `.claude/rules/design-system.md` says so, and says any change to a
 * component MUST update it. Agents read this file INSTEAD of the source, which
 * is exactly what makes a silent gap dangerous: an agent cannot tell the
 * difference between "this component has no constraints worth knowing" and
 * "the paragraph that said so was deleted".
 *
 * That is not hypothetical. The UX4G accessibility widget's entry landed with
 * the token work in 3cb9236 and was removed again by d6ba5ea, which rewrote the
 * file's version chain and dropped a whole range of entries with it. The
 * changelog half survived because `check-changelog-freshness.mjs` guards it;
 * design.md had no equivalent, so the widget's code sat on main for a day while
 * its authoritative context said nothing about it — including that its
 * telemetry defaults to OFF for privacy reasons, which is precisely the kind of
 * thing an agent must not flip casually.
 *
 * A RATCHET, deliberately, in the same shape as check-storybook-coverage.mjs:
 *
 *   - A component exported from the barrel and not mentioned in design.md
 *     FAILS the build…
 *   - …unless it is listed in the baseline as known, pre-existing debt.
 *   - A baseline entry that IS now mentioned also FAILS, so the backlog cannot
 *     quietly grow back.
 *
 * WHAT THIS DOES NOT CATCH, stated plainly so nobody trusts it further than it
 * goes: mentioning a component is a low bar. This gate proves a section still
 * EXISTS; it cannot prove the section is still TRUE, or that one sentence
 * carrying a decision survived an edit.
 *
 * Measured against the loss that motivated it, that is a partial win and worth
 * being precise about. Had the whole `UX4GAccessibilityWidget` section been
 * deleted, this now fails — that is the case the `NOT_RENDERABLE_IN_STORYBOOK`
 * split exists to cover. What actually happened was narrower: the section
 * survived and a version-chain entry inside it went, which this gate cannot
 * see. Catching THAT cheaply and generally is not something we found a way to
 * do; deeper accuracy stays a review problem.
 *
 *   node scripts/check-design-context.mjs
 *   node scripts/check-design-context.mjs --update-baseline
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";

import { exportedComponents } from "./lib/ds-exports.mjs";

const DESIGN_MD = process.env.DESIGN_MD ?? "packages/design-system/design.md";
const BASELINE =
  process.env.DESIGN_CONTEXT_BASELINE ?? "packages/design-system/design-context-baseline.json";

function fail(message) {
  console.error(`\n✖ design context: ${message}\n`);
  process.exit(1);
}

/**
 * Whether design.md mentions a component by name.
 *
 * Word-boundary matched so `Alert` does not satisfy `AlertDialog`, and so a
 * component named inside a longer identifier does not count. Deliberately a
 * plain mention rather than a required heading: a component explained inside
 * its parent's prose is genuinely documented, and demanding a heading per
 * export would push the file toward a generated prop dump — the opposite of
 * what it is for.
 */
function mentions(doc, name) {
  return new RegExp(`\\b${name}\\b`).test(doc);
}

const doc = readFileSync(DESIGN_MD, "utf8");
// includeNonRenderable: a component that cannot be shown in Storybook still has
// to be explained here — that exemption is Storybook's, not design.md's.
const components = exportedComponents({ includeNonRenderable: true });
const missing = [...components].filter((c) => !mentions(doc, c)).sort();

if (process.argv.includes("--update-baseline")) {
  writeFileSync(BASELINE, `${JSON.stringify({ missing }, null, 2)}\n`);
  console.log(
    `• design context: baseline written — ${missing.length} component(s) recorded as known debt.`,
  );
  process.exit(0);
}

const baseline = existsSync(BASELINE)
  ? new Set(JSON.parse(readFileSync(BASELINE, "utf8")).missing ?? [])
  : new Set();

const undeclared = missing.filter((c) => !baseline.has(c));
const stale = [...baseline].filter((c) => !missing.includes(c)).sort();

if (undeclared.length) {
  fail(
    `${undeclared.length} component(s) exported from the design system are not\n` +
      `  mentioned in ${DESIGN_MD}:\n` +
      undeclared.map((c) => `    · ${c}`).join("\n") +
      `\n\n  Document them there — what the component is FOR and when NOT to reach\n` +
      `  for it, not a restatement of the prop table. If an export genuinely is\n` +
      `  not a component, add it to NOT_COMPONENTS in scripts/lib/ds-exports.mjs\n` +
      `  with a reason; if a parent's section covers it, add it to DOCUMENTED_BY.`,
  );
}

if (stale.length) {
  fail(
    `${stale.length} baseline entr(y/ies) are now documented. Remove them from\n` +
      `  ${BASELINE} so the backlog cannot grow back:\n` +
      stale.map((c) => `    · ${c}`).join("\n"),
  );
}

const total = components.size;
const done = total - missing.length;
const pct = total ? Math.round((done / total) * 100) : 100;
console.log(
  `✔ design context: ${done}/${total} components (${pct}%) documented in design.md — ` +
    `${missing.length} known, declared in the baseline.`,
);
