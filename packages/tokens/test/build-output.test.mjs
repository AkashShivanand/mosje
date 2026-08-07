import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { execSync } from "node:child_process";

const root = new URL("..", import.meta.url).pathname;
const legacy = JSON.parse(readFileSync(root + "test/legacy-snapshot.json", "utf8"));

function resolveVar(css, name, depth = 0) {
  // Recursively resolve var() chains (--sa-*, --ds-type-*, etc.) up to 5 levels.
  if (depth > 5) return null;
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const direct = css.match(new RegExp(`${escaped}\\s*:\\s*([^;]+);`));
  if (!direct) return null;
  const v = direct[1].trim();
  const ref = v.match(/^var\((--[a-zA-Z0-9-]+)\)$/);
  if (ref) return resolveVar(css, ref[1], depth + 1);
  return v;
}

/**
 * Compare two CSS values by what they RENDER, not by how they are spelt.
 *
 * The snapshot exists to catch value drift, and it must keep doing that — but the type
 * scale moved from px to rem (see the note on `clampExpr` in build/formats/legacy-ds-css.mjs)
 * and `clamp(2.5rem, …, 5rem)` renders exactly like `clamp(40px, …, 80px)` at the 16px
 * default root. Comparing strings would have forced a blanket snapshot rewrite, which would
 * have thrown away the guard along with the units. So: normalise every dimension to px and
 * compare numerically, with a tolerance for the rounding the rem conversion introduces
 * (the intercept is rounded at 4dp in rem instead of 3dp in px).
 *
 * Anything that is NOT a dimension — colours, easings, shadows, font stacks — still has to
 * match exactly, character for character.
 */
const REM_BASE = 16;
const DIMENSION = /(-?\d*\.?\d+)(px|rem)\b/g;

function sameRenderedValue(a, b, epsilonPx = 0.02) {
  const numbersOf = (s) => [...s.matchAll(DIMENSION)].map(([, n, unit]) =>
    unit === "rem" ? parseFloat(n) * REM_BASE : parseFloat(n)
  );
  const skeletonOf = (s) => s.replace(DIMENSION, " ").replace(/\s+/g, " ").trim();

  if (skeletonOf(a) !== skeletonOf(b)) return false;
  const [na, nb] = [numbersOf(a), numbersOf(b)];
  if (na.length !== nb.length) return false;
  return na.every((v, i) => Math.abs(v - nb[i]) <= epsilonPx);
}

test("build emits every legacy --ds-* var with an identical resolved value", () => {
  execSync("npm run build", { cwd: root });
  const css = readFileSync(root + "dist/tokens.css", "utf8");
  for (const [name, expected] of Object.entries(legacy)) {
    const got = resolveVar(css, name);
    assert.ok(got !== null, `missing ${name}`);
    assert.ok(
      sameRenderedValue(got, expected),
      `value drift for ${name}: got "${got}", expected "${expected}"`
    );
  }
});

test("the fluid type scale renders identically in rem as it did in px", () => {
  // Direct check that the px→rem conversion was value-preserving, independent of the
  // snapshot: every --ds-type-* bound, multiplied back up by the 16px default root, must
  // land on the px bound authored in primitive.json.
  const primitives = JSON.parse(readFileSync(root + "src/primitive.json", "utf8"));
  const css = readFileSync(root + "dist/tokens.css", "utf8");
  const rootCss = css.slice(0, css.indexOf("\n}"));

  // font.role is nested family → number → part (font/role/display/1/size) since the paths
  // were split on the hyphen for RULE 1. The EMITTED name still rejoins them, so flatten
  // back to `display-1` here to keep asserting against the shipped variable name.
  const roleEntries = [];
  for (const [family, byNumber] of Object.entries(primitives.font.role)) {
    if (family.startsWith("$")) continue;
    const numbered = Object.values(byNumber).every((v) => v && !("$value" in v));
    if (numbered) {
      for (const [number, parts] of Object.entries(byNumber)) {
        if (number.startsWith("$")) continue;
        roleEntries.push([`${family}-${number}`, parts]);
      }
    } else {
      roleEntries.push([family, byNumber]);
    }
  }

  let checked = 0;
  for (const [role, parts] of roleEntries) {
    for (const [part, token] of Object.entries(parts)) {
      const bounds = token.$extensions?.mosje?.type?.website;
      if (!bounds) continue;
      const declared = rootCss.match(
        new RegExp(`--ds-type-${role}-${part}:\\s*([^;]+);`)
      );
      assert.ok(declared, `--ds-type-${role}-${part} missing from :root`);

      const nums = [...declared[1].matchAll(DIMENSION)].map(([, n, u]) =>
        u === "rem" ? parseFloat(n) * REM_BASE : parseFloat(n)
      );
      const [min, max] = [parseFloat(bounds.min), parseFloat(bounds.max)];
      if (min === max) {
        assert.ok(Math.abs(nums[0] - min) <= 0.02, `${role}.${part} static value drifted`);
      } else {
        // clamp(lo, calc(intercept + slope), hi) → first and last dimensions are the bounds
        assert.ok(Math.abs(nums[0] - min) <= 0.02, `${role}.${part} min drifted: ${nums[0]} vs ${min}`);
        assert.ok(Math.abs(nums.at(-1) - max) <= 0.02, `${role}.${part} max drifted: ${nums.at(-1)} vs ${max}`);
      }
      checked++;
    }
  }
  assert.ok(checked > 50, `expected the full role scale, only checked ${checked}`);
});

test("type is sized in rem so a raised browser default font size still scales it", () => {
  // The reason for the conversion. Browser zoom satisfies WCAG 1.4.4 either way; this is
  // for the reader who raises their DEFAULT FONT SIZE instead — which a px scale ignores.
  const css = readFileSync(root + "dist/tokens.css", "utf8");
  const rootCss = css.slice(0, css.indexOf("\n}"));
  const typeDecls = [...rootCss.matchAll(/--ds-type-[A-Za-z0-9-]+-(?:size|lh):\s*([^;]+);/g)];
  assert.ok(typeDecls.length > 40, "expected the --ds-type-* scale");

  const pxLeaks = typeDecls
    .map(([, value]) => value)
    .filter((v) => /\d+px/.test(v) && !/^0px$/.test(v.trim()));
  assert.deepEqual(pxLeaks, [], `type tokens still carrying px: ${pxLeaks.slice(0, 5)}`);
});

test("generated CSS contains no unresolved token references", () => {
  const css = readFileSync(root + "dist/tokens.css", "utf8");
  const unresolved = css.match(/\{[a-z][a-z0-9.]+\}/gi);
  assert.equal(unresolved, null, `unresolved refs: ${unresolved}`);
});

test("every override block re-asserts the --ds-* aliases it invalidates", () => {
  // The invariant that makes TARGETED re-assertion safe. A custom property substitutes
  // var() at the element where it is DECLARED, so any block that redeclares --sa-X must
  // also redeclare every --ds-* alias pointing at --sa-X, or that alias keeps the value it
  // resolved to at :root and the subtree silently renders the wrong thing.
  //
  // Re-asserting aliases whose target the block does NOT touch is a provable no-op, which
  // is why the formatter stopped emitting the whole table into all four theme blocks. This
  // test is the guard on that trade: it fails if the targeting ever drops one it needed.
  const css = readFileSync(root + "dist/tokens.css", "utf8");
  const aliasesInRoot = [
    ...css.slice(0, css.indexOf("\n}")).matchAll(/^\s*(--ds-[A-Za-z0-9-]+)\s*:\s*var\((--[A-Za-z0-9-]+)\);/gm),
  ].map(([, alias, target]) => ({ alias, target }));
  assert.ok(aliasesInRoot.length > 100, "expected the --ds-* alias table in :root");

  const blocks = [...css.matchAll(/^(\[[^\]]+\]) \{\n([\s\S]*?)\n\}/gm)];
  assert.ok(blocks.length >= 4, `expected the override blocks, found ${blocks.length}`);

  const failures = [];
  for (const [, selector, body] of blocks) {
    const declared = new Set(
      [...body.matchAll(/^\s*(--[A-Za-z0-9-]+)\s*:/gm)].map((m) => m[1])
    );
    for (const { alias, target } of aliasesInRoot) {
      if (declared.has(target) && !declared.has(alias)) {
        failures.push(`${selector}: redeclares ${target} but leaves ${alias} stale`);
      }
    }
  }
  assert.deepEqual(failures, [], failures.slice(0, 8).join("\n"));
});
