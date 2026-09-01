#!/usr/bin/env node
/**
 * AN ACCESSIBILITY CLAIM THAT IS NOT VERIFIED MAY NOT MULTIPLY.
 *
 * `A11yChecklist` used to render a fixed green tick against named WCAG success
 * criteria on seventy-four pages, with no way to say a criterion had not been
 * checked — a compliance assertion with nothing behind it, on a Government of
 * India property. Rows now carry `status: "verified" | "partial" | "untested"`,
 * defaulting to `untested`, and an `evidence` field.
 *
 * That replaced an unevidenced OVER-claim with a blanket UNDER-claim, which is
 * more honest and, left alone, no more useful: most of the catalogue now
 * publishes "not yet verified" and nothing stops that number growing with every
 * page added. An auditor's question is "what has been tested", and "less than
 * before" is the wrong direction for an answer.
 *
 * So the untested count is a ratchet. It may fall. It may not rise.
 *
 *   npm run check:a11y-evidence            the gate
 *   npm run check:a11y-evidence:baseline   re-freeze after verifying some
 *   npm run check:a11y-evidence:report     what is unverified, worst page first
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { join, relative, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..");
const PAGES = join(ROOT, "apps/hub/src/app/design-system/components");
const BASELINE = join(HERE, "baseline.json");

function collect(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const f = join(dir, e.name);
    if (e.isDirectory()) collect(f, out);
    else if (e.name === "page.tsx") out.push(f);
  }
  return out;
}

/**
 * Rows are counted by their `criterion:` key, and a row is VERIFIED only when it
 * carries `status: "verified"`. `partial` counts as unverified on purpose: it is
 * an honest admission, not a claim, and the point of this number is how much of
 * the catalogue has actually been tested.
 */
function score() {
  const rows = [];
  for (const file of collect(PAGES)) {
    const src = readFileSync(file, "utf8");
    const criteria = (src.match(/criterion:/g) ?? []).length;
    if (!criteria) continue;
    const verified = (src.match(/status:\s*"verified"/g) ?? []).length;
    const partial = (src.match(/status:\s*"partial"/g) ?? []).length;
    rows.push({
      page: relative(PAGES, file).replace(/\/page\.tsx$/, ""),
      criteria,
      verified,
      partial,
      unverified: criteria - verified,
    });
  }
  return rows.sort((a, b) => b.unverified - a.unverified || a.page.localeCompare(b.page));
}

const rows = score();
const total = rows.reduce((n, r) => n + r.criteria, 0);
const verified = rows.reduce((n, r) => n + r.verified, 0);
const unverified = total - verified;
const mode = process.argv[2];

if (mode === "--baseline") {
  writeFileSync(BASELINE, JSON.stringify({ unverified }, null, 2) + "\n");
  console.log(`✔ a11y-evidence baseline: ${unverified} unverified row(s) frozen.`);
  process.exit(0);
}

if (mode === "--report") {
  console.log(`a11y-evidence: ${verified}/${total} criteria verified (${Math.round((verified / total) * 100)}%)\n`);
  for (const r of rows) {
    if (!r.unverified) continue;
    console.log(`  ${String(r.unverified).padStart(3)} unverified of ${r.criteria}  ${r.page}`);
  }
  process.exit(0);
}

const base = existsSync(BASELINE) ? JSON.parse(readFileSync(BASELINE, "utf8")) : { unverified };

if (unverified > base.unverified) {
  console.error(
    `\n✖ a11y-evidence: ${unverified} unverified criteria, up from ${base.unverified}.\n\n` +
      `   A new criterion may only be added as \`status: "verified"\` with an \`evidence\`\n` +
      `   string naming the code or test that earns it — or the catalogue's honest\n` +
      `   answer to "what has been tested" gets worse with every page.\n`,
  );
  process.exit(1);
}
if (unverified < base.unverified) {
  console.error(
    `\n✖ a11y-evidence: ${unverified} unverified criteria, down from ${base.unverified}.\n\n` +
      `   Re-baseline in this change (npm run check:a11y-evidence:baseline) so the gain\n` +
      `   cannot be given back.\n`,
  );
  process.exit(1);
}

console.log(
  `✔ a11y-evidence: ${verified}/${total} criteria verified — ${unverified} unverified, declared in the baseline.`,
);
