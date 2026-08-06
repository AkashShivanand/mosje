import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { contrast, PAIRINGS } from "./lib/contrast.mjs";

/**
 * The contrast gate, swept across every THEMING AXIS rather than only the default `:root`.
 *
 * `brand-contrast.test.mjs` proves a brand swap cannot ship an inaccessible portal. It only
 * ever read `:root`, so a colour mode or theme could still put text below AA and nothing
 * would catch it. This sweeps all of them: blue-light (default), blue-dark, the two opt-in
 * UX4G modes, and the light/dark/hc appearance themes.
 *
 * This is the check the UX4G adoption plan schedules for week 2 — "apply the ministry's key
 * colour group through Theme Craft, then check colour contrast across every combination" —
 * done in code so it re-runs on every build instead of once.
 */

const root = new URL("..", import.meta.url).pathname;
const tokensCss = readFileSync(root + "dist/tokens.css", "utf8");
const ux4gCss = readFileSync(root + "dist/ux4g.css", "utf8");

/** Declarations of a selector block (or of `:root` when selector is null). */
function blockOf(css, selector) {
  const needle = selector ? `${selector} {` : ":root {";
  const start = css.indexOf(needle);
  if (start === -1) return null;
  const body = css.slice(start, css.indexOf("\n}", start));
  return new Map(
    [...body.matchAll(/^\s*(--[A-Za-z0-9-]+)\s*:\s*([^;]+);/gm)].map((m) => [m[1], m[2].trim()])
  );
}

const ROOT = new Map([...blockOf(tokensCss, null), ...blockOf(ux4gCss, null)]);

/**
 * Resolve as a browser would inside `overrides`: a declaration in the block shadows :root,
 * anything absent is inherited. This is the same rule the generator has to satisfy, so a
 * mode that forgets to re-assert an alias fails here with a real contrast number.
 */
function makeResolver(overrides) {
  return function resolve(name, depth = 0) {
    if (depth > 8) return null;
    const value = overrides.get(name) ?? ROOT.get(name) ?? null;
    if (value === null) return null;
    const ref = value.match(/^var\((--[A-Za-z0-9-]+)\)$/);
    return ref ? resolve(ref[1], depth + 1) : value;
  };
}

function sweep(label, overrides) {
  const resolve = makeResolver(overrides);
  const failures = [];
  for (const p of PAIRINGS) {
    const fg = resolve(p.fg);
    const bg = resolve(p.bg);
    // Only hex pairs are assertable; alpha values depend on what is behind them.
    if (!fg || !bg || !/^#/.test(fg) || !/^#/.test(bg)) continue;
    const ratio = contrast(fg, bg);
    if (ratio < p.min) {
      failures.push(`${label}: ${p.label} (${fg} on ${bg}) = ${ratio.toFixed(2)}:1 < ${p.min}:1`);
    }
  }
  return failures;
}

test("every colour mode meets WCAG AA on the load-bearing pairings", () => {
  const modes = [
    ["blue-light (default)", new Map()],
    ["blue-dark", blockOf(tokensCss, '[data-color-mode="blue-dark"]')],
    ["ux4g-light", blockOf(ux4gCss, '[data-color-mode="ux4g-light"]')],
    ["ux4g-dark", blockOf(ux4gCss, '[data-color-mode="ux4g-dark"]')],
  ];

  const failures = [];
  for (const [label, overrides] of modes) {
    assert.ok(overrides, `colour mode block missing: ${label}`);
    failures.push(...sweep(label, overrides));
  }
  assert.deepEqual(failures, [], "\n" + failures.join("\n"));
});

test("every appearance theme meets WCAG AA on the load-bearing pairings", () => {
  const failures = [];
  for (const theme of ["light", "dark", "hc"]) {
    const overrides = blockOf(tokensCss, `[data-theme="${theme}"]`);
    assert.ok(overrides, `theme block missing: ${theme}`);
    failures.push(...sweep(`theme:${theme}`, overrides));
  }
  assert.deepEqual(failures, [], "\n" + failures.join("\n"));
});
