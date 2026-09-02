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

/**
 * THE TEMPLATE ROUTE.
 *
 * The six markers above were written when every page hand-assembled the shape.
 * `ComponentDocPage` now renders all six from data, which is the fix for the
 * ninety-nine pages that each retyped them — but a page built on the template
 * contains none of the six literals, so the original test would score it 0/6
 * and fail the very change that repaired it.
 *
 * So a page also conforms by USING THE TEMPLATE PROPERLY. "Properly" is the
 * load-bearing word: rendering `<ComponentDocPage />` with nothing in it would
 * give the reader an empty page, so every prop that carries one of the six is
 * required here too. The template guarantees the SHAPE; this guarantees the
 * page put something in it.
 *
 * `figma` covers both a node and a declared absence, because a component with
 * no Figma counterpart is a fact to state, not a link to fake.
 */
const TEMPLATE_USE = /<ComponentDocPage[\s/>]/;
const TEMPLATE_PROPS = [
  [/\bstatus=/, "a maturity badge (status=)"],
  [/\bfigma=/, "a Figma node or a declared absence (figma=)"],
  [/\bspecimen=/, "a running specimen (specimen=)"],
  /*
   * `propsFrom` counts too, and it is the PREFERRED half. The template's own
   * docstring says a hand-written table is how `ChartCard` came to document a
   * prop that does not exist, so the generated key is the correct way to
   * document a component's API — and a gate that scored only `props=` would
   * have marked every page that took the better path as missing its API table.
   */
  [/\bprops(From)?=/, "a props table (props= or propsFrom=)"],
  [/\ba11y=/, "an accessibility checklist (a11y=)"],
  [/\bsummary=/, "a one-line summary (summary=)"],
];

function scoreOne(src) {
  if (TEMPLATE_USE.test(src)) {
    const missing = TEMPLATE_PROPS.filter(([re]) => !re.test(src)).map(([, label]) => label);
    return { score: TEMPLATE_PROPS.length - missing.length, missing };
  }
  const missing = REQUIRED.filter(([re]) => !re.test(src)).map(([, label]) => label);
  return { score: REQUIRED.length - missing.length, missing };
}

export function scorePages() {
  return collect(PAGES)
    .map((file) => {
      const src = readFileSync(file, "utf8");
      const { score, missing } = scoreOne(src);
      return {
        page: relative(PAGES, file).replace(/\/page\.tsx$/, ""),
        score,
        missing,
      };
    })
    .sort((a, b) => a.score - b.score || a.page.localeCompare(b.page));
}

/*
 * A DECLARED ABSENCE MUST BE TRUE.
 *
 * `figma={{ absent: "…" }}` is how a page states honestly that a component has
 * no Figma counterpart, and the gate accepts it for the same reason the standard
 * does: a missing link and an unbuilt component are different facts. But the
 * shape check cannot tell an honest absence from a stale one, and eight pages
 * shipped saying "not yet registered in the estate's Figma node index" in the
 * SAME COMMIT that registered them — sending the reader away from a link that
 * existed.
 *
 * So an absence is checked against the registry. If the route's key is in
 * FIGMA_NODES, the page must link it.
 */
function staleAbsences() {
  const figmaSrc = readFileSync(join(ROOT, "apps/hub/src/lib/design-system/figma.ts"), "utf8");
  const keys = new Set([...figmaSrc.matchAll(/^ {2}(\w+):\s*"/gm)].map((m) => m[1]));
  const stale = [];
  for (const file of collect(PAGES)) {
    const src = readFileSync(file, "utf8");
    if (!/figma=\{\{\s*absent:/.test(src)) continue;
    const route = relative(PAGES, file).replace(/\/page\.tsx$/, "");
    const leaf = route.split("/").pop() ?? "";
    const camel = leaf.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    if (keys.has(camel)) stale.push(`${route}: declares no Figma component, but FIGMA_NODES.${camel} exists. Link it.`);
  }
  return stale;
}

/*
 * HAND-WRITTEN PROPS TABLES MAY ONLY FALL.
 *
 * `propsFrom` reads the API out of the TypeScript type checker; `props` is a
 * hand-typed array and is how this estate came to document a `ChartCard` prop
 * called `action` when the prop is `actions`. The shape check accepts either,
 * correctly — a hook's arguments cannot be extracted — but nothing stopped the
 * hand-written form from being the default forever. Fifty-seven of a hundred
 * pages carried one on 2026-09-01; three do now, and each of the three is a
 * case the extractor genuinely cannot reach — `data-display/axis` (inline
 * parameter objects and bare formatter functions, no interface at all),
 * `feedback/toast` (a provider taking an inline parameter object plus a hook)
 * and `forms/identity-inputs` (an overview of three components, whose rows are
 * prefixed by the component that owns them and so cannot come from one key).
 *
 * A count, ratcheted: it may fall and it may not rise.
 */
const HANDWRITTEN_BASELINE = Number(process.env.DS_PAGES_HANDWRITTEN ?? 3);

function handWrittenTables() {
  return collect(PAGES).filter((f) => {
    const src = readFileSync(f, "utf8");
    return /\bprops=\{/.test(src) && !/\bpropsFrom=/.test(src);
  }).length;
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
const problems = [...staleAbsences()];

const handWritten = handWrittenTables();
if (handWritten > HANDWRITTEN_BASELINE) {
  problems.push(
    `${handWritten} page(s) hand-write their props table, up from ${HANDWRITTEN_BASELINE}. ` +
      `Use propsFrom="<Name>Props" — the generated table cannot drift from the interface.`,
  );
} else if (handWritten < HANDWRITTEN_BASELINE) {
  problems.push(
    `${handWritten} page(s) hand-write their props table, down from ${HANDWRITTEN_BASELINE}. ` +
      `Lower HANDWRITTEN_BASELINE in tools/ds-page-standard/check.mjs in this change, so the ` +
      `gain cannot be given back.`,
  );
}

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
