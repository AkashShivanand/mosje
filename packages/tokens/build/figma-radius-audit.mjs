#!/usr/bin/env node
/**
 * Radius binding audit over the SAMAVESH Figma library.
 *
 * Mirrors build/figma-space-audit.mjs. Radius had NO gate of any kind until
 * 2026-08-18, while colour had six contract tests, spacing had this same
 * ratchet, and icons had a per-file ratchet. The first census showed what that
 * cost: 2.37 % of radius properties sit on a correct Tier-2 token.
 *
 * The ratchet runs on AUTHORABLE properties (outside any instance). Instance
 * descendants are derived from their main, so counting them both double-counts
 * and imports the cross-sync instability documented for the space census —
 * Navbar's authorable figures were byte-identical across independent reads
 * while its totals moved by hundreds.
 *
 *   node build/figma-radius-audit.mjs                    report
 *   node build/figma-radius-audit.mjs --update-baseline  refreeze the debt
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname.replace(/\/$/, "");
const CENSUS = join(ROOT, "reference/figma-radius-bindings.json");
const BASELINE = join(ROOT, "reference/radius-bindings-baseline.json");

/** Classes that are DEFECTS. `rawZero` is excluded: 0 is the absence of a
 *  radius, not a wrong one — the same reasoning ds-linkage applies to `0px`. */
export const DEFECT_CLASSES = ["t1", "xf", "rm", "gh", "rn"];

/** Accounted for, never defects. `r0` is the absence of a radius, not a wrong one.
 *  `ch` is a COMPONENT_SET's own radius — Figma's dashed variant-set wrapper, default 5px,
 *  which renders in no product. Counting it as raw made 5 the most persistent off-ladder
 *  value in the whole census and put a phantom defect on 23 pages at once. */
export const NON_DEFECT_CLASSES = ["t2", "r0", "ch"];

export function readCensus() {
  return JSON.parse(readFileSync(CENSUS, "utf8"));
}

export function readBaseline() {
  return JSON.parse(readFileSync(BASELINE, "utf8"));
}

/** Per-page authorable defect counts, keyed by page id. */
export function defectsByPage(census) {
  const out = {};
  for (const p of census.pages) {
    const d = {};
    for (const k of DEFECT_CLASSES) d[k] = p.authorable[k] ?? 0;
    out[p.id] = { name: p.name, ...d };
  }
  return out;
}

export function totals(census, key = "authorable") {
  const t = { t2: 0, t1: 0, xf: 0, gh: 0, rm: 0, r0: 0, rn: 0, ch: 0 };
  for (const p of census.pages) for (const k of Object.keys(t)) t[k] += p[key][k] ?? 0;
  return t;
}

function main() {
  const census = readCensus();
  const t = totals(census);
  const all = Object.values(t).reduce((a, b) => a + b, 0);
  const defects = DEFECT_CLASSES.reduce((a, k) => a + t[k], 0);

  console.log(`\nRadius bindings — ${census.pages.length} of ${census.coverage.libraryPages} pages censused (${census.capturedAt})\n`);
  console.log(`  authorable properties   ${all}`);
  console.log(`  on a correct Tier-2     ${t.t2}  (${((100 * t.t2) / all).toFixed(2)} %)`);
  console.log(`  defects                 ${defects}`);
  for (const k of DEFECT_CLASSES) console.log(`      ${k.padEnd(4)} ${String(t[k]).padStart(6)}  ${census.classes[{ t1: "tier1", xf: "crossFamily", rm: "remote", gh: "ghost", rn: "rawNonZero" }[k]]}`);
  console.log(`  rawZero (not a defect)  ${t.r0}`);
  console.log(`  chrome  (not a defect)  ${t.ch}  COMPONENT_SET wrappers — Figma editor chrome`);

  if (census.coverage.uncensused.length) {
    console.log(`\n  ${census.coverage.uncensused.length} pages NOT yet censused — the gate fails until each is censused or`);
    console.log(`  explicitly declared empty. A page in neither list is how a surface goes ungated.`);
  }

  if (process.argv.includes("--update-baseline")) {
    const baseline = {
      note: [
        "Frozen radius debt, per page, in AUTHORABLE properties (outside any instance).",
        "A page that REGRESSES fails. A page that IMPROVES also fails, telling you to",
        "re-baseline in the same change — that is what stops one page's cleanup being",
        "silently spent on another page's regression. Never add entries to go green.",
        "",
        "`uncensusedPages` is not a skip list. Every entry must be censused or proven",
        "empty before this gate can be called complete; the test names them on failure.",
      ],
      capturedAt: census.capturedAt,
      method: census.method,
      totals: t,
      pages: defectsByPage(census),
      uncensusedPages: census.coverage.uncensused,
    };
    writeFileSync(BASELINE, JSON.stringify(baseline, null, 2) + "\n");
    console.log(`\n✔ baseline refrozen — ${Object.keys(baseline.pages).length} pages, ${defects} defects\n`);
  } else {
    console.log("");
  }
}

if (import.meta.url === `file://${process.argv[1]}`) main();
