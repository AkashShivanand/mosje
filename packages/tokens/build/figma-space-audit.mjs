/**
 * The space-linkage ratchet — shared logic for `test/space-linkage.test.mjs`, plus the
 * `--update-baseline` runner.
 *
 * WHY THIS EXISTS
 * ---------------
 * Colour has six contract tests (on-pair-contrast, brand-contrast, action-contrast,
 * mode-contrast, prominence-contract, slot-disjointness). Icons have a per-file ratchet.
 * The web documentation has `check:ds-linkage`. Space — the most-bound token family in the
 * library — had nothing, and the first full census (2026-08-17) found why that matters:
 *
 *   65,657 spacing properties across 68 pages
 *   86.4% "bound"  … but only 6.96% bound to a CORRECT semantic space token
 *
 * The 86.4% is the trap. Almost all of it is wrong:
 *
 *   crossFamily  38,799  a radius/type/colour variable bound to padding or gap
 *   tier1         7,286  a hidden `ref/space|ref/size` primitive, which does not publish
 *   ghost         4,771  a local variable id that no collection owns
 *   remote        1,317  a variable imported from a DIFFERENT library
 *   tier2         4,568  correct
 *
 * Every one of those classes is invisible to a "is it bound?" check, which is exactly the
 * check a human performs by eye in the inspector. Hence a gate.
 *
 * WHY A RATCHET AND NOT A CLEAN ASSERTION
 * ---------------------------------------
 * Same reasoning as `figma-ghost-bindings.test.mjs`: asserting zero would fail on day one
 * and keep failing for as long as remediation takes, which teaches people to skip the suite.
 * So the debt is frozen per page and may only shrink. A page that IMPROVES also fails, with
 * an instruction to re-baseline — that is what stops one page's cleanup being silently spent
 * on another page's regression.
 *
 * WHY THE BASELINE IS PER PAGE
 * ----------------------------
 * A single global count would let Dropdown shed 1,000 cross-family bindings while Charts &
 * Graphs gained 1,000, and report clean. Per page is also how the remediation is actually
 * scheduled, so the diff reads as a worklist.
 *
 * REFRESHING THE DATA — READ THIS BEFORE RE-SWEEPING
 * --------------------------------------------------
 * `reference/figma-space-bindings.json` is produced by walking the live library through the
 * Figma MCP, ONE PAGE PER `use_figma` INVOCATION via `setCurrentPageAsync`. That constraint
 * is load-bearing, not stylistic. Walking several pages in one invocation — by
 * `setCurrentPageAsync`, by `PageNode.loadAsync`, or even after loading every page up front —
 * returns partial and NON-DETERMINISTIC trees. Navbar measured 2,885 bound properties
 * per-page, then 1,685 and 1,669 on two batched runs of identical code. `findAll(() => true)`
 * returned an identical node count both ways, so the shortfall does not show up in a
 * node-count sanity check. A batched re-sweep will under-report and must not be committed.
 */

import { readFileSync, writeFileSync } from "node:fs";

const root = new URL("..", import.meta.url).pathname;

export const CENSUS_PATH = root + "reference/figma-space-bindings.json";
export const BASELINE_PATH = root + "reference/space-bindings-baseline.json";

/** The classes a bound spacing property can fall into, worst first. */
export const DEBT_KEYS = ["crossFamily", "tier1", "ghost", "remote", "raw"];

export const readCensus = () => JSON.parse(readFileSync(CENSUS_PATH, "utf8"));
export const readBaseline = () => JSON.parse(readFileSync(BASELINE_PATH, "utf8"));

/** Pages that carry no spacing debt at all need no baseline entry. */
export const hasDebt = (page) => DEBT_KEYS.some((k) => page[k] > 0);

/**
 * Compare a census against a baseline.
 *
 * `grown`  — a page got worse, or a page with debt is missing from the baseline. Hard fail.
 * `shrunk` — a page got better and the baseline was not refreshed. Also a fail, so the gain
 *            is locked in rather than left available to be spent elsewhere.
 * `stale`  — a baseline entry for a page that no longer exists or no longer carries debt.
 */
export function diff(census, baseline) {
  const base = new Map(baseline.pages.map((p) => [p.id, p]));
  const seen = new Set();
  const grown = [];
  const shrunk = [];

  for (const page of census.pages) {
    if (!hasDebt(page)) continue;
    seen.add(page.id);
    const b = base.get(page.id);
    if (!b) {
      grown.push(`${page.name} (${page.id}) is not in the baseline — ` +
        DEBT_KEYS.filter((k) => page[k] > 0).map((k) => `${k}=${page[k]}`).join(", "));
      continue;
    }
    for (const k of DEBT_KEYS) {
      if (page[k] > b[k]) grown.push(`${page.name}: ${k} ${b[k]} → ${page[k]} (+${page[k] - b[k]})`);
      else if (page[k] < b[k]) shrunk.push(`${page.name}: ${k} ${b[k]} → ${page[k]} (−${b[k] - page[k]})`);
    }
  }

  const stale = baseline.pages.filter((p) => !seen.has(p.id)).map((p) => `${p.name} (${p.id})`);
  return { grown, shrunk, stale };
}

/** Ghost ids observed anywhere in the census, with their total bind count. */
export function ghostIds(census) {
  const out = new Map();
  for (const page of census.pages) {
    for (const [id, n] of Object.entries(page.ghostIds ?? {})) out.set(id, (out.get(id) ?? 0) + n);
  }
  return out;
}

function updateBaseline() {
  const census = readCensus();
  const next = {
    $description:
      "Frozen spacing-binding debt, per page. THE FILE MAY ONLY SHRINK. A page that regresses " +
      "fails `npm run check:space-linkage`; a page that improves also fails, telling you to " +
      "re-run `node build/figma-space-audit.mjs --update-baseline` and commit the result in the " +
      "same change. Do not add entries to get a build green — the whole point is that this " +
      "number is the remediation worklist. See build/figma-space-audit.mjs for the rationale.",
    $baselinedAt: census.$sweptAt,
    $totals: census.$totals,
    $knownGhostIds: [...ghostIds(census).keys()].sort(),
    pages: census.pages
      .filter(hasDebt)
      .map((p) => ({ name: p.name, id: p.id, ...Object.fromEntries(DEBT_KEYS.map((k) => [k, p[k]])) }))
      .sort((a, b) => a.name.localeCompare(b.name)),
  };
  writeFileSync(BASELINE_PATH, JSON.stringify(next, null, 2) + "\n");
  const total = next.pages.reduce((a, p) => a + DEBT_KEYS.reduce((s, k) => s + p[k], 0), 0);
  console.log(`space baseline written: ${next.pages.length} pages, ${total} debt entries`);
}

if (process.argv.includes("--update-baseline")) updateBaseline();
