#!/usr/bin/env node
/**
 * Every foundation page carries the ONE shape — rendered from `FoundationDocPage`.
 *
 * The census on 2026-09-04 found eleven foundation pages on FIVE different page shells,
 * 0 of 11 carrying a maturity badge, tabs or a feedback bar, two of them hand-typing the
 * values they documented, and no gate looking. `check:ds-pages` covers component pages
 * only. This is its foundations half — and unlike that ratchet it has NO baseline: every
 * page was converted in the same change, so the only permitted state is 100%.
 *
 * A page passes when it renders `<FoundationDocPage` with every load-bearing prop:
 *   name · status · summary · figma · glance · sections · tokens · a11y
 * Matched on USAGE (the JSX attribute), never on an import line — `check:ds-pages` learned
 * that the hard way.
 *
 * Run: npm run check:foundations
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const PAGES = join(ROOT, "apps/hub/src/app/design-system/foundations");

const REQUIRED = [
  [/<FoundationDocPage[\s/>]/, "the FoundationDocPage template"],
  [/\bname=/, "a name (name=)"],
  [/\bstatus=/, "a maturity badge (status=)"],
  [/\bsummary=/, "a one-paragraph summary (summary=)"],
  [/\bfigma=\{\{\s*(node|absent):/, "a Figma node or a declared absence (figma=)"],
  [/\bglance=\{/, "counted at-a-glance stats (glance=)"],
  [/\bsections=\{/, "numbered, claim-titled sections (sections=)"],
  [/\btokens=\{/, "the generated token table (tokens=)"],
  [/\ba11y=\{/, "an accessibility checklist (a11y=)"],
];

// A foundation page may not type the thing it documents.
const LITERALS = [
  [/(?<![\d.])\d+ms\b/, "a millisecond literal — read durations from foundations-data.generated.ts"],
  [/#[0-9a-fA-F]{6}\b/, "a hex colour literal — read colours from the generated data"],
  [/style=\{\{[^}]*(fontSize|lineHeight|marginTop|padding|gap):\s*"/, "an inline style with a hand-typed value — put it in the page's .css bound to --sa-*"],
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

const problems = [];
const pages = collect(PAGES);
for (const file of pages) {
  const src = readFileSync(file, "utf8");
  const route = relative(PAGES, file).replace(/\/page\.tsx$/, "");
  const missing = REQUIRED.filter(([re]) => !re.test(src)).map(([, label]) => label);
  if (missing.length) problems.push(`${route}: missing ${missing.join(", ")}`);
  // Literal scan ignores comments and the metadata description.
  // A "don't" specimen may show the literal it warns against — mark the line `ds-exempt(specimen)`.
  const code = src
    .split("\n").filter((l) => !/ds-exempt\(specimen\)/.test(l)).join("\n")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/.*$/gm, "")
    .replace(/description:\s*"[^"]*"/g, "");
  for (const [re, label] of LITERALS) {
    const m = re.exec(code);
    if (m) problems.push(`${route}: ${label} (${m[0]})`);
  }
}

if (process.argv.includes("--report") || !problems.length) {
  console.log(`✔ foundation pages: ${pages.length - problems.length}/${pages.length} on the template` + (problems.length ? "" : " — all conformant."));
}
if (problems.length) {
  console.error(`✖ foundation-page-standard: ${problems.length} problem(s)\n  ` + problems.join("\n  "));
  process.exit(1);
}
