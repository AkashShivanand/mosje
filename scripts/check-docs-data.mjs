#!/usr/bin/env node
/**
 * Keep the generated documentation data honest, and the colour page's two surfaces in sync.
 *
 * The colour system is documented twice — a Figma frame designers read, and a web page
 * engineers and stakeholders link to. On 2026-08-12 an audit found the web page printing
 * 88 hand-copied hex literals, **14 of which matched no token in the system**: it showed
 * `#1f2428` beside `--sa-color-text-default`, which is `#1e2124`. The two surfaces had been
 * telling different stories for months and nothing noticed, because nothing was checking.
 *
 * VALUES are now pinned on both sides by construction — Figma binds every swatch to a
 * variable, and the web page reads generated data. This gate covers the two things that
 * construction does not:
 *
 *   1. STALE GENERATED DATA — color-data.ts is committed, so it can fall behind the tokens
 *      it was generated from. Regenerate and diff.
 *   2. STRUCTURAL DRIFT — a section added, removed or renamed on one surface and not the
 *      other. Two documents that disagree about what section 12 is about are not one document.
 *
 * What it deliberately does NOT do: reach Figma. CI has no library access, so the Figma side
 * is a recorded snapshot (docs/design-system/colour-doc-sections.json) refreshed by a human.
 * That means this gate catches website drift immediately and Figma drift at the next refresh —
 * a real limit, stated rather than papered over.
 *
 * Typography is covered by the staleness half only. Its 168 numbers were hand-typed and
 * verified once (126/126 on 2026-08-11) and were STILL correct when the generator replaced
 * them a day later — which is the argument, not a counter-argument. A table that is right
 * today and hand-maintained is not a correct table; it is one that has not drifted yet.
 *
 * Run: npm run check:docs-data
 */
import { readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const DATA = join(root, "apps/hub/src/app/design-system/foundations/color/color-data.ts");
const PAGE = join(root, "apps/hub/src/app/design-system/foundations/color/page.tsx");
const SNAPSHOT = join(root, "docs/design-system/colour-doc-sections.json");
const GENERATOR = join(root, "packages/tokens/build/generate-color-docs-data.mjs");

const problems = [];

// ── 1. is the committed data still what its generator produces? ────────────
const GENERATED = [
  {
    label: "colour",
    data: DATA,
    generator: GENERATOR,
  },
  {
    label: "typography",
    data: join(root, "apps/hub/src/app/design-system/foundations/typography/typography-data.ts"),
    generator: join(root, "packages/tokens/build/generate-typography-docs-data.mjs"),
  },
  // 2026-09-04 — every OTHER foundation (spacing, sizing, shape, stroke, elevation, layering,
  // opacity, motion, breakpoints, density, states, layout) reads one generated file. The
  // Elevation page had been printing three of six roles with a retired ink for a month;
  // the Motion page hard-coded the values it documented. Same gate, same reason.
  {
    label: "foundations",
    data: join(root, "apps/hub/src/lib/design-system/foundations-data.generated.ts"),
    generator: join(root, "packages/tokens/build/generate-foundation-docs-data.mjs"),
  },
];

for (const g of GENERATED) {
  const before = readFileSync(g.data, "utf8");
  try {
    execFileSync("node", [g.generator], { stdio: "pipe" });
    if (readFileSync(g.data, "utf8") !== before) {
      writeFileSync(g.data, before);
      problems.push(
        `${g.label} docs data is STALE — it no longer matches what the tokens produce.\n` +
          "    A token changed and the page was not rebuilt, so it is stating values the build\n" +
          "    does not produce. This is the exact failure the generated file exists to prevent.\n" +
          "    Fix: npm run build -w @mosje/tokens && commit the regenerated file",
      );
    }
  } catch (err) {
    writeFileSync(g.data, before);
    problems.push(`${g.label} generator failed to run: ${err.message.split("\n")[0]}`);
  }
}

// ── 2. do both surfaces agree on structure? ─────────────────────────────────
const snapshot = JSON.parse(readFileSync(SNAPSHOT, "utf8"));
const expected = snapshot.sections;

const sectionsBlock = /export const SECTIONS: readonly Section\[\] = (\[[\s\S]*?\n\]);/.exec(
  readFileSync(DATA, "utf8"),
);
if (!sectionsBlock) {
  problems.push("could not read SECTIONS out of color-data.ts — has the generator changed shape?");
} else {
  const actual = JSON.parse(sectionsBlock[1]);
  if (actual.length !== expected.length) {
    problems.push(
      `section COUNT differs: Figma has ${expected.length}, the website has ${actual.length}.\n` +
        `    Whichever surface changed, the other has to follow — they are one document.`,
    );
  }
  const n = Math.min(actual.length, expected.length);
  for (let i = 0; i < n; i++) {
    if (actual[i].id !== expected[i].web) {
      problems.push(`section ${i + 1}: website id "${actual[i].id}" ≠ recorded "${expected[i].web}"`);
    } else if (actual[i].title !== expected[i].title) {
      problems.push(
        `section ${i + 1} (${actual[i].id}) title differs:\n` +
          `      website : ${actual[i].title}\n` +
          `      Figma   : ${expected[i].title}`,
      );
    }
  }
}

// ── 3. does the page actually render every section it declares? ─────────────
const page = readFileSync(PAGE, "utf8");
const rendered = [...page.matchAll(/<Section id="([a-z-]+)"/g)].map((m) => m[1]);
const declared = expected.map((s) => s.web);
const missing = declared.filter((id) => !rendered.includes(id));
const extra = rendered.filter((id) => !declared.includes(id));
if (missing.length) problems.push(`page.tsx never renders: ${missing.join(", ")}`);
if (extra.length) problems.push(`page.tsx renders sections not in the shared list: ${extra.join(", ")}`);

// ── 4. no hand-written colour literals may creep back onto the page ─────────
const literals = [...page.matchAll(/#[0-9a-fA-F]{6}\b/g)].map((m) => m[0]);
if (literals.length) {
  problems.push(
    `page.tsx contains ${literals.length} hex literal(s): ${[...new Set(literals)].join(", ")}\n` +
      `    Colour values belong in color-data.ts, which is generated. A hex typed onto this page\n` +
      `    is how it came to print 14 colours that no longer existed.`,
  );
}

if (problems.length) {
  console.error(`✖ docs data out of sync — ${problems.length} problem(s):\n`);
  for (const p of problems) console.error(`  • ${p}\n`);
  process.exit(1);
}
console.log(
  `✔ docs data in sync: colour and typography data are current, ${expected.length} colour sections ` +
    `match across Figma and the website, and the colour page holds no hand-written literals.`,
);
