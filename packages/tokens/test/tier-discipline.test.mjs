import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { parse, fromCssName, tierOfFile, toCssName } from "../build/grammar.mjs";

/**
 * Tier discipline — the rules from spec §3, §4.1 and §9.1, enforced rather than documented.
 *
 * A convention nobody can violate is a system; one you can is a style guide. Before this
 * file the tier rule existed only as a sentence in design.md, and design.md was itself
 * wrong about which prefix the component tier used.
 */

const root = new URL("..", import.meta.url).pathname;
const repo = new URL("../../../", import.meta.url).pathname;
const css = readFileSync(root + "dist/tokens.css", "utf8");
const ux4g = readFileSync(root + "dist/ux4g.css", "utf8");

const declared = new Set([...`${css}\n${ux4g}`.matchAll(/^\s*(--[A-Za-z0-9-]+)\s*:/gm)].map((m) => m[1]));

test("no var() in the generated CSS points at a name nothing declares", () => {
  // The tier rename broke 44 references the first time it ran. This is the guard that
  // turns that from a silent visual regression into a failing build.
  const used = new Set([...`${css}\n${ux4g}`.matchAll(/var\((--sa-[A-Za-z0-9-]+)/g)].map((m) => m[1]));
  const dangling = [...used].filter((n) => !declared.has(n)).sort();
  assert.deepEqual(dangling, [], `dangling --sa-* references:\n  ${dangling.join("\n  ")}`);
});

test("every emitted --sa-* name carries the tier marker its source file implies", () => {
  const src = JSON.parse(
    execSync("node -e \"import('./build/token-index.mjs').then(m=>console.log(JSON.stringify(m.index())))\"", {
      cwd: root,
    }).toString(),
  );
  const wrong = [];
  for (const { path, filePath } of src) {
    const tier = tierOfFile(filePath);
    const expected = toCssName(path, tier);
    // font.role/tracking feed --ds-type-* instead of emitting directly.
    if (path[0] === "font" && (path[1] === "role" || path[1] === "tracking")) continue;
    if (!declared.has(expected)) wrong.push(`${path.join(".")} (${tier}) → expected ${expected}`);
  }
  assert.deepEqual(wrong.slice(0, 10), [], `${wrong.length} token(s) not emitted under their tier marker`);
});

test("the Tier-2 namespace never starts with a reserved tier marker", () => {
  // If a Tier-2 path began `ref/…` it would flatten to `--sa-ref-…` and be indistinguishable
  // from Tier 1 — the projection would stop being reversible and the Figma round-trip
  // would silently pair the wrong variables.
  for (const name of declared) {
    if (!name.startsWith("--sa-")) continue;
    const { tier, path } = fromCssName(name);
    if (tier !== "sys") continue;
    const r = parse(path, "sys");
    if (!r.ok && /reserved/.test(r.error)) assert.fail(`${name} collides with a tier marker`);
  }
});

test("app code never references a Tier-1 reference token", () => {
  // Spec §9 lint: `--sa-ref-*` outside packages/tokens and the generated CSS is an error.
  // Referencing a primitive directly couples a component to one brand ramp and breaks
  // both the dark/HC themes and the brand-pack white-labelling.
  const files = execSync("git ls-files '*.css' '*.tsx' '*.ts'", { cwd: repo })
    .toString()
    .split("\n")
    .filter(Boolean)
    .filter(
      (f) =>
        !f.startsWith("packages/tokens/") &&
        f !== "packages/design-system/tokens.css" &&
        f !== "packages/design-system/ux4g.css",
    );

  const offenders = [];
  for (const f of files) {
    let text;
    try {
      text = readFileSync(repo + f, "utf8");
    } catch {
      continue;
    }
    if (/var\(--sa-ref-/.test(text)) offenders.push(f);
  }
  assert.deepEqual(
    offenders,
    [],
    `Tier-1 reference tokens used in app code:\n  ${offenders.join("\n  ")}\n` +
      `Use a Tier-2 (--sa-*) or --ds-* token instead, or add one if none fits.`,
  );
});
