#!/usr/bin/env node
/**
 * ONE SHAPE FOR EVERY DOCUMENTED COMPONENT — enforced, not hoped for.
 *
 * The estate had a house style for documentation pages written down since
 * 2026-08-11 (`.claude/rules/figma-documentation-style.md`). On 2026-08-31 a
 * census found THREE of one hundred web pages carried the full shape, and ten of
 * forty-six Figma component pages had a documentation frame at all. A rule with
 * no gate is a rule with a half-life; this is the gate.
 *
 * THE SHAPE. Every component documentation page under
 * apps/hub/src/app/design-system/components/ carries all six:
 *
 *   StatusBadge     what maturity the reader is looking at
 *   FIGMA_NODES     a link to the component in the library — the single most
 *                   missing element, present on 10 of 100 pages at the census
 *   DocsTabs        Design / Code / Accessibility, in that order
 *   PropsTable      the API, generated from the props the component really has
 *   A11yChecklist   the criteria this component is claimed to meet
 *   FeedbackBar     a way for the reader to say the page is wrong
 *
 * A RATCHET, the same shape the estate already uses for storybook coverage,
 * icon scale, space and radius linkage:
 *
 *   - a NEW page that is not fully conformant fails
 *   - a baselined page whose score DROPS fails
 *   - a baselined page whose score IMPROVES also fails, telling you to
 *     re-baseline in the same change — so one page's cleanup cannot be spent
 *     silently on another page's regression
 *
 * Never add an entry to the baseline to make a build green. The baseline only
 * ever shrinks.
 *
 *   npm run check:ds-pages            the gate
 *   npm run check:ds-pages:baseline   re-freeze after a genuine improvement
 *   npm run check:ds-pages:report     the full table, worst first
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { join, relative, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..");
const PAGES = join(ROOT, "apps/hub/src/app/design-system/components");
const BASELINE = join(HERE, "baseline.json");

/** The six. Order is the order a reader meets them on the page. */
/*
 * Matched on USAGE, never on the bare identifier. A page that imports
 * `FeedbackBar` and never renders it is not documented by it — and the first
 * version of this gate scored exactly that as conformant, because the import
 * line satisfied a substring test. It was caught by deliberately deleting a
 * `<FeedbackBar />` and watching the gate stay green.
 */
export const REQUIRED = [
  [/<StatusBadge[\s/>]/, "a maturity badge"],
  [/figmaUrl\(\s*FIGMA_NODES\./, "a link to the component in Figma"],
  [/<DocsTabs[\s/>]/, "Design / Code / Accessibility tabs"],
  [/<PropsTable[\s/>]/, "a props table"],
  [/<A11yChecklist[\s/>]/, "an accessibility checklist"],
  [/<FeedbackBar[\s/>]/, "a feedback bar"],
];

function collect(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const f = join(dir, e.name);
    if (e.isDirectory()) collect(f, out);
    else if (e.name === "page.tsx") out.push(f);
  }
  return out;
}

export function scorePages() {
  return collect(PAGES)
    .map((file) => {
      const src = readFileSync(file, "utf8");
      const missing = REQUIRED.filter(([re]) => !re.test(src)).map(([, label]) => label);
      return {
        page: relative(PAGES, file).replace(/\/page\.tsx$/, ""),
        score: REQUIRED.length - missing.length,
        missing,
      };
    })
    .sort((a, b) => a.score - b.score || a.page.localeCompare(b.page));
}

const rows = scorePages();
const max = REQUIRED.length;
const conformant = rows.filter((r) => r.score === max);
const mode = process.argv[2];

if (mode === "--baseline") {
  const frozen = Object.fromEntries(rows.filter((r) => r.score < max).map((r) => [r.page, r.score]));
  writeFileSync(BASELINE, JSON.stringify(frozen, null, 2) + "\n");
  console.log(`✔ ds-pages baseline: ${Object.keys(frozen).length} page(s) frozen below ${max}/${max}.`);
  process.exit(0);
}

if (mode === "--report") {
  console.log(`ds-pages: ${conformant.length}/${rows.length} fully conformant (${Math.round((conformant.length / rows.length) * 100)}%)\n`);
  for (const r of rows) {
    if (r.score === max) continue;
    console.log(`  ${r.score}/${max}  ${r.page}`);
    console.log(`        missing: ${r.missing.join(", ")}`);
  }
  process.exit(0);
}

const base = existsSync(BASELINE) ? JSON.parse(readFileSync(BASELINE, "utf8")) : {};
const problems = [];

for (const r of rows) {
  const frozen = base[r.page];
  if (r.score === max) {
    if (frozen !== undefined) {
      problems.push(`${r.page}: now ${max}/${max}. Delete its baseline entry (npm run check:ds-pages:baseline).`);
    }
    continue;
  }
  if (frozen === undefined) {
    problems.push(`${r.page}: ${r.score}/${max} and not baselined — a NEW page must carry the full shape.\n     missing: ${r.missing.join(", ")}`);
  } else if (r.score < frozen) {
    problems.push(`${r.page}: dropped ${frozen}/${max} → ${r.score}/${max}.\n     missing: ${r.missing.join(", ")}`);
  } else if (r.score > frozen) {
    problems.push(`${r.page}: improved ${frozen}/${max} → ${r.score}/${max}. Re-baseline in this change (npm run check:ds-pages:baseline).`);
  }
}

const known = rows.filter((r) => r.score < max).length;
if (problems.length) {
  console.error(`\n✖ ds-pages: ${problems.length} problem(s)\n`);
  for (const p of problems) console.error(`   ${p}`);
  console.error(`\n   The shape every component page carries: ${REQUIRED.map(([, l]) => l).join(" · ")}.`);
  console.error(`   Standard: .claude/rules/ds-documentation-standard.md`);
  console.error(`   npm run check:ds-pages:report lists every page and what it is missing.\n`);
  process.exit(1);
}
console.log(`✔ ds-pages: ${conformant.length}/${rows.length} fully conformant — ${known} known, declared in the baseline.`);
