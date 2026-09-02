#!/usr/bin/env node
/**
 * THE DESIGN SYSTEM PACKAGE HAD NO LINT AT ALL.
 *
 * `npm run lint` resolves to `lint:hub`, and the hub's config scopes to the hub
 * — so 117 component files and roughly 29,700 lines had never been linted. No
 * `react-hooks/exhaustive-deps`, in a package with 88 `"use client"` files full
 * of effects. No `jsx-a11y`, on a government design system whose entire value
 * proposition is WCAG 2.2 AA. CI ran `npm run lint` and inspected zero lines of
 * it, while radius tokens carried six contract tests and a per-page ratchet.
 *
 * `packages/design-system/eslint.config.mjs` is the config. This is the gate,
 * and it is a RATCHET rather than a wall, because the first run found 50
 * findings across a package that is otherwise well made — failing the build on
 * all of them would mean the config gets reverted rather than the findings
 * fixed, which is how a package ends up with no lint for a year.
 *
 *   - a file whose count RISES fails
 *   - a NEW file with any finding fails
 *   - a file whose count FALLS fails, asking for a re-baseline in the same
 *     change, so one file's cleanup cannot pay for another's regression
 *
 *   npm run check:ds-lint            the gate
 *   npm run check:ds-lint:baseline   re-freeze after a genuine improvement
 */
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, relative, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..");
const PKG = join(ROOT, "packages/design-system");
const BASELINE = join(HERE, "baseline.json");

function run() {
  let out = "";
  try {
    out = execFileSync("npx", ["eslint", ".", "--no-error-on-unmatched-pattern", "-f", "json"], {
      cwd: PKG,
      encoding: "utf8",
      maxBuffer: 64 * 1024 * 1024,
      // ESLint exits non-zero when it finds anything; the JSON is on stdout either way.
    });
  } catch (e) {
    out = e.stdout ?? "";
  }
  if (!out.trim()) {
    console.error("\n✖ ds-lint: eslint produced no output. Is the config valid?\n");
    process.exit(1);
  }
  const counts = {};
  for (const file of JSON.parse(out)) {
    if (!file.messages.length) continue;
    counts[relative(PKG, file.filePath)] = file.messages.length;
  }
  return counts;
}

const counts = run();
const total = Object.values(counts).reduce((a, b) => a + b, 0);
const mode = process.argv[2];

if (mode === "--baseline") {
  writeFileSync(BASELINE, JSON.stringify(counts, null, 2) + "\n");
  console.log(`✔ ds-lint baseline: ${total} finding(s) across ${Object.keys(counts).length} file(s) frozen.`);
  process.exit(0);
}

const base = existsSync(BASELINE) ? JSON.parse(readFileSync(BASELINE, "utf8")) : {};
const problems = [];

for (const [file, n] of Object.entries(counts)) {
  const was = base[file];
  if (was === undefined) problems.push(`${file}: ${n} finding(s) in a file that had none. Fix them, or say why in the code.`);
  else if (n > was) problems.push(`${file}: ${was} → ${n}. The count may not rise.`);
  else if (n < was) problems.push(`${file}: ${was} → ${n}. Re-baseline in this change (npm run check:ds-lint:baseline).`);
}
for (const file of Object.keys(base)) {
  if (!(file in counts)) problems.push(`${file}: now clean. Re-baseline (npm run check:ds-lint:baseline).`);
}

if (problems.length) {
  console.error(`\n✖ ds-lint: ${problems.length} problem(s)\n`);
  for (const p of problems) console.error(`   ${p}`);
  console.error(`\n   Config: packages/design-system/eslint.config.mjs\n`);
  process.exit(1);
}
console.log(`✔ ds-lint: ${total} known finding(s) across ${Object.keys(counts).length} file(s), all declared in the baseline.`);
