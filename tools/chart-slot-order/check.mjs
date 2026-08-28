#!/usr/bin/env node
/**
 * No consumer may reach past categorical slot 9.
 *
 * `chart-palette.test.mjs` guarantees the RAMP: slots 1-9 are mutually
 * distinguishable, including through every dichromacy, and 10-12 are extension
 * colours carrying no such guarantee. That is a fact about the ramp. It says
 * nothing about which slots a consumer picks, and a guarantee over 1-9 does not
 * survive a consumer choosing 1, 3, 4, 6 and 10.
 *
 * WHY THIS GATE EXISTS. Regenerating the ramp on 2026-08-28 took it from zero
 * colour-blind-safe slots to nine. The NMBA de-addiction facility locator — a
 * PUBLIC citizen-facing map — did not improve: dE 1.2 to dE 1.5 under
 * deuteranopia, still one colour to a red-green-deficient reader, because it had
 * hand-picked cat-1/3/4/6/10 and slot 10 is outside the guarantee. Three of the
 * four consumers in the estate were reaching past 9 the same way. Moving them
 * into range took that page to dE 8.0.
 *
 * So the palette work was necessary and not sufficient, and the missing half is
 * a rule about consumers rather than about colours. The token description says
 * it — "take them in order rather than picking favourites" — and a description
 * is not a control.
 *
 * WHAT THIS DELIBERATELY DOES NOT CHECK: that a file's slots form a prefix
 * (1,2,3… with no gaps). That was the first draft of this rule and it is wrong,
 * because a file often holds SEVERAL independent charts. `smile-admin/dashboard/
 * charts.tsx` paints an age breakdown, a type breakdown and a shelter breakdown
 * from slots 1, 2 and 6 — three separate charts nobody sees side by side, so
 * there is nothing to tell apart and no gap to close. Which colours share a
 * comparison set is not decidable from static text, so this gate enforces only
 * the boundary that always holds: never reach past 9.
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = new URL("../..", import.meta.url).pathname;
const SCAN = ["apps/hub/src", "packages/design-system"];
const SKIP = /node_modules|\.next|dist/;

/** The guarantee boundary, and the source of truth for it. */
const SAFE_COUNT = 9;

/**
 * Files that DEFINE or DOCUMENT the ramp rather than consuming it. A generated
 * token sheet naming all twelve is a definition, and the colour foundations page
 * exists to show every slot — neither is a chart reaching for a colour.
 */
const EXEMPT = new Set([
  "apps/hub/src/app/design-system/foundations/color/page.tsx",
  "packages/design-system/tokens.css",
  "packages/design-system/components/data-display/charts/charts.css",
  "packages/design-system/components/data-display/charts/internal/palette.ts",
]);

/** Strip comments so a note ABOUT a slot is not mistaken for a use of one. */
function stripComments(src) {
  return src.replace(/\/\*[\s\S]*?\*\//g, " ").replace(/(^|[^:])\/\/[^\n]*/g, "$1 ");
}

function walk(dir, out = []) {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return out;
  }
  for (const name of entries) {
    const full = join(dir, name);
    if (SKIP.test(full)) continue;
    if (statSync(full).isDirectory()) walk(full, out);
    else if (/\.(ts|tsx|css)$/.test(full)) out.push(full);
  }
  return out;
}

const failures = [];
let scanned = 0;

for (const base of SCAN) {
  for (const file of walk(join(ROOT, base))) {
    const rel = relative(ROOT, file);
    if (EXEMPT.has(rel)) continue;
    const body = stripComments(readFileSync(file, "utf8"));

    // Token form: var(--sa-chart-cat-N)
    const tokenSlots = [...body.matchAll(/--sa-chart-cat-(\d+)/g)].map((m) => Number(m[1]));
    // Function form: categoricalColor(i) is ZERO-based, so slot = i + 1
    const fnSlots = [...body.matchAll(/categoricalColor\(\s*(\d+)\s*\)/g)].map(
      (m) => Number(m[1]) + 1,
    );

    const used = [...new Set([...tokenSlots, ...fnSlots])].sort((a, b) => a - b);
    if (!used.length) continue;
    scanned++;

    const over = used.filter((n) => n > SAFE_COUNT);
    if (!over.length) continue;
    failures.push(
      `${rel}\n      reaches ${over.map((n) => "cat-" + n).join(", ")}  (uses ${used.map((n) => "cat-" + n).join(", ")})`,
    );
  }
}

if (failures.length) {
  console.error(
    `\n✖ ${failures.length} file(s) reach past categorical slot ${SAFE_COUNT}:\n\n    ` +
      failures.join("\n\n    ") +
      `\n\n  Slots 1-${SAFE_COUNT} are guaranteed mutually distinguishable, including under every\n` +
      `  colour-vision deficiency. Slots ${SAFE_COUNT + 1}-12 are extension colours with NO such\n` +
      `  guarantee — reaching one throws the guarantee away for the whole chart. The NMBA\n` +
      `  public facility locator sat at dE 1.5 under deuteranopia doing exactly this, which\n` +
      `  is one colour to a red-green-deficient reader.\n\n` +
      `  If you need more than ${SAFE_COUNT} categories, bucket the tail as "Other" and keep the\n` +
      `  full breakdown in the screen-reader table.\n`,
  );
  process.exit(1);
}

console.log(
  `✔ no consumer reaches past categorical slot ${SAFE_COUNT} (${scanned} file(s) use the ramp)`,
);
