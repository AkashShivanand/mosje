#!/usr/bin/env node
/**
 * EVERY EXPORTED COMPONENT HAS A DOCUMENTATION PAGE — the reverse assertion.
 *
 * `check:docs-routes` verifies that every PAGE maps to a route and that the nav
 * resolves. It prints "100 page(s), one per component", which reads as complete
 * coverage and is in fact a statement about the hundred pages, not about the
 * ~124 components. Nothing looked the other way.
 *
 * What that cost, measured 2026-09-02: THIRTY-EIGHT exported components with no
 * page at all — including `Breadcrumb`, which was the headline of the newest
 * release; `Pagination`, which `data-state-completeness.md` §4 requires for the
 * "too much" state; and `SectionTitle`, which `ui-restraint-and-copy.md` §3
 * mandates for EVERY section heading in the estate. Ninety-nine pages hand-rolled
 * a heading instead, which is exactly what an undiscoverable component produces.
 *
 * A RATCHET, the shape the estate uses everywhere else:
 *
 *   - a NEW export with no page fails
 *   - an export declared in the baseline is known debt and passes
 *   - a baselined export that GAINS a page also fails, telling you to re-baseline
 *     in the same change, so one component's documentation cannot be spent
 *     silently on another's disappearance
 *
 * The baseline only ever shrinks. Never add an entry to make a build green.
 *
 *   npm run check:docs-coverage            the gate
 *   npm run check:docs-coverage:baseline   re-freeze after writing a page
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { exportedComponents } from "../../scripts/lib/ds-exports.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..");
const PAGES = join(ROOT, "apps/hub/src/app/design-system/components");
const BASELINE = join(HERE, "baseline.json");

/** Route segment for a component name — `SiteHeader` → `site-header`. */
const slug = (name) =>
  name
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();

function routes() {
  const out = new Set();
  if (!existsSync(PAGES)) return out;
  for (const group of readdirSync(PAGES, { withFileTypes: true })) {
    if (!group.isDirectory()) continue;
    for (const page of readdirSync(join(PAGES, group.name), { withFileTypes: true })) {
      if (page.isDirectory()) out.add(page.name);
    }
  }
  return out;
}

const have = routes();
const components = exportedComponents({ includeNonRenderable: true });

/*
 * A page's directory is matched against the component's slug. Several pages
 * legitimately document a family from one route (`identity-inputs` covers the
 * Aadhaar and PAN inputs), so a component also counts as documented when its
 * slug appears INSIDE a route name — matching the `DOCUMENTED_BY` convention
 * `ds-exports.mjs` already uses for the Storybook gates rather than inventing a
 * second vocabulary for the same idea.
 */
const documented = (name) => {
  const s = slug(name);
  if (have.has(s)) return true;
  for (const r of have) if (r.includes(s) || s.includes(r)) return true;
  return false;
};

const missing = [...components].filter((c) => !documented(c)).sort();
const base = existsSync(BASELINE) ? JSON.parse(readFileSync(BASELINE, "utf8")) : [];
const known = new Set(base);
const mode = process.argv[2];

if (mode === "--baseline") {
  writeFileSync(BASELINE, JSON.stringify(missing, null, 2) + "\n");
  console.log(`✔ docs-coverage baseline: ${missing.length} undocumented component(s) frozen.`);
  process.exit(0);
}

const isNew = missing.filter((c) => !known.has(c));
/*
 * A baselined name that is no longer in `missing` got there one of two ways, and
 * they need different sentences: it gained a page, or it stopped being exported.
 * The first version reported both as "now documented", so when the illustration
 * primitives were withdrawn from the barrel the gate told the reader to go and
 * find fifteen documentation pages that had never been written.
 */
const gained = base.filter((c) => components.has(c) && !missing.includes(c));
const retired = base.filter((c) => !components.has(c));

if (isNew.length || gained.length || retired.length) {
  console.error(`\n✖ docs-coverage: ${isNew.length + gained.length + retired.length} problem(s)\n`);
  for (const c of isNew) {
    console.error(`   ${c}: exported from the barrel with no documentation page.`);
  }
  for (const c of gained) {
    console.error(`   ${c}: now documented. Re-baseline (npm run check:docs-coverage:baseline).`);
  }
  for (const c of retired) {
    console.error(
      `   ${c}: no longer exported from the barrel. Re-baseline ` +
        `(npm run check:docs-coverage:baseline) — it needs no page.`,
    );
  }
  console.error(
    `\n   ${components.size} component(s) exported · ${have.size} page(s) · ` +
      `${missing.length} undocumented.\n` +
      `   A component nobody can find is a component that gets re-implemented.\n`,
  );
  process.exit(1);
}

console.log(
  `✔ docs-coverage: ${components.size - missing.length}/${components.size} component(s) ` +
    `documented — ${missing.length} known, declared in the baseline.`,
);
