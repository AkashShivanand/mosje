#!/usr/bin/env node
/**
 * NO SHADOW UI KITS — a locally declared component may not take the NAME of a
 * design-system export.
 *
 * The audit of 2026-09-02 found FIVE hand-rolled kits inside `apps/hub`
 * re-implementing ~45 components the barrel already exports:
 *
 *   apps/hub/src/components/nhapoa/ui.tsx                 17 exports, 1 DS import
 *   apps/hub/src/components/tg/ui.tsx                     19 exports, 1 DS import
 *   apps/hub/src/components/scw/ui.tsx                    14 exports, 1 DS import
 *   apps/hub/src/components/pm-ajay/dashboard/ui.tsx      11 exports, 0 DS imports
 *   apps/hub/src/components/pm-ajay/dashboard/charts.tsx   9 exports, 0 DS imports
 *
 * Two costs, and the second is the one that is hard to see. Every accessibility
 * fix shipped to the design system in three months reached none of the five —
 * a `Select` repaired once was repaired in one place out of four. And the exact
 * NAME collisions (`Select`, `Footer`, `DataTable`, `Sparkline`) mean an import
 * auto-complete resolves to the wrong component with no error anywhere: the
 * page renders, it simply renders the copy that never got the fix.
 *
 * So this gate is deliberately narrow. It does not ask whether a local
 * component LOOKS like a DS one — that judgement cannot be automated and would
 * cry wolf. It asks the one question with an unambiguous answer: does a
 * component declared here have the same name as one the barrel exports? That is
 * the case where a reader, a reviewer and an IDE can all be wrong at once.
 *
 * A RATCHET, the shape the estate uses everywhere else:
 *
 *   - a NEW collision fails
 *   - a collision declared in the baseline is known debt and passes
 *   - a baselined collision that DISAPPEARS also fails, telling you to
 *     re-baseline in the same change, so one kit's migration cannot be spent
 *     silently on another kit's growth
 *
 * The baseline only ever shrinks. Never add an entry to make a build green.
 *
 *   npm run check:shadow-ui            the gate
 *   npm run check:shadow-ui:baseline   re-freeze after migrating a kit
 */
import { readFileSync, writeFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join, dirname, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

import { exportedComponents, DOCUMENTED_BY } from "../../scripts/lib/ds-exports.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..");
const BASELINE = join(HERE, "baseline.json");

/** Where a shadow kit can live. Both trees ship UI to citizens. */
const SCANNED = ["apps/hub/src/components", "apps/hub/src/app/portals"];

/*
 * WHAT THE BARREL EXPORTS, including the parts `exportedComponents` normally
 * hides.
 *
 * `exportedComponents` answers "what must be documented?", so it drops the
 * sub-parts a parent's page covers — `CardHeader`, `TabPanel`, `SkeletonRow`.
 * That is right for a docs gate and wrong for this one: `CardHeader` is a real
 * name in the barrel, and a local `function CardHeader()` collides with it
 * exactly as silently as a local `Select` does. `includeNonRenderable: true`
 * pulls in the providers for the same reason.
 */
const BARREL = new Set([
  ...exportedComponents({ includeNonRenderable: true }),
  ...Object.keys(DOCUMENTED_BY),
]);

/*
 * Comments are stripped before matching. Not pedantry: every kit in the estate
 * opens with a banner comment, several carry commented-out earlier versions of
 * the very components being replaced, and a gate that counts a commented-out
 * `export function Select` as live debt reports a migration as incomplete
 * forever. Strings are left alone — a declaration keyword inside a string
 * literal is not a shape that occurs here.
 */
const decomment = (src) =>
  src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:])\/\/.*$/gm, "$1");

/*
 * The three declaration shapes that put a name into a module's scope. A
 * re-export (`export { DataTable } from "@mosje/design-system"`) matches none of
 * them, which is the point — re-exporting is the FIX, and a gate that flagged
 * the fix would push people back to copies.
 */
const DECLARATIONS = [
  /^\s*export\s+(?:default\s+)?function\s+([A-Z]\w*)/gm,
  /^\s*export\s+(?:const|let|var)\s+([A-Z]\w*)\s*[:=]/gm,
  /^\s*function\s+([A-Z]\w*)\s*[(<]/gm,
];

function sources(dir) {
  const out = [];
  const abs = join(ROOT, dir);
  if (!existsSync(abs)) return out;
  const walk = (d) => {
    for (const e of readdirSync(d, { withFileTypes: true })) {
      const p = join(d, e.name);
      if (e.isDirectory()) {
        if (e.name === "node_modules" || e.name === "__snapshots__") continue;
        walk(p);
      } else if (/\.tsx?$/.test(e.name) && !/\.(test|spec|stories|figma)\.tsx?$/.test(e.name)) {
        out.push(p);
      }
    }
  };
  if (statSync(abs).isDirectory()) walk(abs);
  return out;
}

/** file (repo-relative, posix) -> sorted names it declares that the barrel also exports. */
function collisions() {
  const found = {};
  for (const dir of SCANNED) {
    for (const file of sources(dir)) {
      const src = decomment(readFileSync(file, "utf8"));
      const names = new Set();
      for (const re of DECLARATIONS) {
        for (const m of src.matchAll(re)) if (BARREL.has(m[1])) names.add(m[1]);
      }
      if (names.size) found[relative(ROOT, file).split(sep).join("/")] = [...names].sort();
    }
  }
  return found;
}

const found = collisions();
const base = existsSync(BASELINE) ? JSON.parse(readFileSync(BASELINE, "utf8")) : {};
const mode = process.argv[2];

if (mode === "--baseline") {
  const ordered = Object.fromEntries(Object.entries(found).sort(([a], [b]) => a.localeCompare(b)));
  const total = Object.values(ordered).reduce((n, v) => n + v.length, 0);
  writeFileSync(BASELINE, JSON.stringify(ordered, null, 2) + "\n");
  console.log(
    `✔ shadow-ui baseline: ${total} collision(s) across ${Object.keys(ordered).length} file(s) frozen.`,
  );
  process.exit(0);
}

/*
 * Two failure modes, and they are reported as different sentences because they
 * ask for different work. A NEW collision is a shadow component someone just
 * wrote — the fix is to import from the barrel. A GONE collision is a migration
 * that landed without re-freezing the baseline — the fix is one command, and
 * until it is run the gate's budget is larger than the debt, which is how a
 * ratchet quietly stops ratcheting.
 */
const added = [];
const gone = [];
for (const [file, names] of Object.entries(found)) {
  const known = new Set(base[file] ?? []);
  for (const n of names) if (!known.has(n)) added.push([file, n]);
}
for (const [file, names] of Object.entries(base)) {
  const now = new Set(found[file] ?? []);
  for (const n of names) if (!now.has(n)) gone.push([file, n]);
}

const total = Object.values(found).reduce((n, v) => n + v.length, 0);

if (added.length || gone.length) {
  console.error(`\n✖ shadow-ui: ${added.length + gone.length} problem(s)\n`);
  for (const [file, n] of added) {
    console.error(`   ${file}`);
    console.error(
      `      declares \`${n}\`, which @mosje/design-system already exports. ` +
        `An import of \`${n}\` can now resolve to either one, silently.`,
    );
  }
  for (const [file, n] of gone) {
    console.error(`   ${file}`);
    console.error(
      `      no longer declares \`${n}\`. Re-baseline in the same change ` +
        `(npm run check:shadow-ui:baseline).`,
    );
  }
  console.error(
    `\n   ${BARREL.size} barrel export(s) · ${total} collision(s) in ` +
      `${Object.keys(found).length} file(s).\n` +
      `   A component the design system already ships is a component that ` +
      `stops receiving its fixes.\n`,
  );
  process.exit(1);
}

console.log(
  `✔ shadow-ui: ${total} known collision(s) in ${Object.keys(found).length} file(s), ` +
    `all declared in the baseline — ${BARREL.size} barrel export(s) checked.`,
);
