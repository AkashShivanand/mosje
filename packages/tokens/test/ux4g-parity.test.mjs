import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const root = new URL("..", import.meta.url).pathname;
const reference = JSON.parse(readFileSync(root + "reference/ux4g-3.0.tokens.json", "utf8"));
const css = readFileSync(root + "dist/ux4g.css", "utf8");
const tokensCss = readFileSync(root + "dist/tokens.css", "utf8");

/** Declarations inside the top-level `:root { … }` of a generated file. */
function rootBlock(source) {
  const start = source.indexOf(":root {");
  assert.notEqual(start, -1, "no :root block — the file failed to generate a token surface");
  const end = source.indexOf("\n}", start);
  return source.slice(start, end);
}

/**
 * Resolve a var() chain to a literal, reading ONLY the `:root` blocks. Searching the whole
 * file would pick up declarations inside `[data-color-mode="ux4g-light"]` and report the
 * UX4G palette as if it were the default — the opposite of what these tests check.
 */
const ROOTS = [rootBlock(css), rootBlock(tokensCss)];
function resolve(name, depth = 0) {
  if (depth > 8) return null;
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`^\\s*${escaped}\\s*:\\s*([^;]+);`, "m");
  const hit = ROOTS.map((src) => src.match(re)).find(Boolean);
  if (!hit) return null;
  const value = hit[1].trim();
  const ref = value.match(/^var\((--[A-Za-z0-9-]+)\)$/);
  return ref ? resolve(ref[1], depth + 1) : value;
}

test("the parity layer emits every token in the UX4G reference contract", () => {
  const block = rootBlock(css);
  const missing = Object.keys(reference.tokens).filter(
    (name) => !block.includes(`\n  ${name}:`)
  );
  assert.deepEqual(missing, [], `absent from the parity layer: ${missing.slice(0, 10)}`);
});

test("the generated CSS has no comment that closes itself early", () => {
  // A stray `*` + `/` inside the header comment ends it, after which the prose is parsed
  // as CSS and error recovery swallows the `:root` selector — dropping all 755 tokens
  // silently. This regressed once; the `comment()` helper in the format guards it.
  const opens = (css.match(/\/\*/g) ?? []).length;
  const closes = (css.match(/\*\//g) ?? []).length;
  assert.equal(opens, closes, "unbalanced block comments in ux4g.css");

  // …and the surface really did survive parsing.
  const declared = rootBlock(css).match(/^\s*--ux4g-[A-Za-z0-9-]+:/gm) ?? [];
  assert.equal(
    declared.length,
    Object.keys(reference.tokens).length,
    "the :root block does not carry the full token surface"
  );
});

test("structural tokens carry UX4G's exact values, whether aliased or literal", () => {
  // Spot-check across every structural family. If SAMAVESH aliases the token, the alias
  // must still resolve to the number UX4G published — that is what conformance means.
  const cases = {
    "--ux4g-space-none": "0px",
    "--ux4g-space-4": "8px",
    "--ux4g-space-6": "16px",
    "--ux4g-space-9": "32px",
    "--ux4g-space-15": "120px",
    "--ux4g-space-16": "360px",
    "--ux4g-radius-0": "0px",
    "--ux4g-radius-3": "8px",
    "--ux4g-radius-6": "24px",
    "--ux4g-radius-circular": "999px",
    "--ux4g-stack-m": "16px",
    "--ux4g-inline-xl": "32px",
    "--ux4g-section-2xl": "80px",
    "--ux4g-padding-3xl": "120px",
    "--ux4g-font-weight-semibold": "600",
  };
  for (const [name, expected] of Object.entries(cases)) {
    assert.equal(resolve(name), expected, `${name} drifted from the UX4G value`);
  }
});

test("UX4G type sizes stay in rem so browser font-size scaling keeps working", () => {
  // Deliberate divergence: SAMAVESH sizes type in px, UX4G in rem. We do NOT alias these
  // onto our px tokens — that would silently defeat users who raise their default font
  // size without zooming. Recorded in the readiness audit as the open follow-up.
  for (const name of ["--ux4g-size-16", "--ux4g-size-60", "--ux4g-line-height-24"]) {
    const value = resolve(name);
    assert.match(value, /rem$/, `${name} should stay in rem, got ${value}`);
  }
});

test("colour maps by ROLE onto the MoSJE palette, not by UX4G's value", () => {
  // The whole Theme Craft / DBIM position in one assertion: a UX4G-named primary token
  // must render the ministry's key colour by default, never UX4G's violet.
  const govBlue600 = resolve("--sa-color-primaryScale-600");
  assert.equal(resolve("--ux4g-bg-primary-strong"), govBlue600);
  assert.equal(resolve("--ux4g-text-link-default-default"), govBlue600);
  assert.notEqual(
    resolve("--ux4g-bg-primary-strong").toLowerCase(),
    "#4a2bc2",
    "default palette leaked UX4G violet"
  );
});

test("the ux4g colour modes repaint the whole --ux4g-* chain, not just the roots", () => {
  // Custom properties substitute where they are DECLARED, so flipping the --sa-* roots is
  // not enough: every --ux4g-* token reading from them has to be re-declared inside the
  // block. Without the closure the mode changed --ds-primary but left --ux4g-bg-primary-*
  // on gov-blue, which is exactly the wrong way round for a conformance demo.
  const start = css.indexOf('[data-color-mode="ux4g-light"]');
  assert.notEqual(start, -1, "ux4g-light mode block missing");
  const block = css.slice(start, css.indexOf("\n}", start));

  for (const name of ["--ux4g-color-primary-600", "--ux4g-bg-primary-strong", "--ds-primary"]) {
    assert.ok(block.includes(`\n  ${name}:`), `${name} not re-asserted in the ux4g-light block`);
  }

  // The invariant that actually matters: resolve as a browser would inside the block —
  // block declarations shadow :root, anything absent is inherited unchanged — and check
  // the UX4G-named tokens land on UX4G's own violet. Before the closure existed this
  // returned gov-blue, i.e. the conformance demo showed the wrong palette.
  const inBlock = new Map(
    [...block.matchAll(/^\s*(--[A-Za-z0-9-]+)\s*:\s*([^;]+);/gm)].map((m) => [m[1], m[2].trim()])
  );
  const resolveInMode = (name, depth = 0) => {
    if (depth > 8) return null;
    const value = inBlock.get(name) ?? null;
    if (value === null) return resolve(name, depth); // not overridden → inherited from :root
    const ref = value.match(/^var\((--[A-Za-z0-9-]+)\)$/);
    return ref ? resolveInMode(ref[1], depth + 1) : value;
  };

  assert.equal(resolveInMode("--ds-primary").toLowerCase(), "#4a2bc2");
  assert.equal(resolveInMode("--ux4g-bg-primary-strong").toLowerCase(), "#4a2bc2");
  assert.equal(resolveInMode("--ux4g-color-primary-600").toLowerCase(), "#4a2bc2");

  // Structure must NOT move when only the palette changes.
  assert.equal(resolveInMode("--ux4g-stack-m"), "16px");
});

test("the [data-surface=portal] block re-asserts the --ds-text-* aliases", () => {
  // Regression guard. data-surface sits on a wrapper <div> in all six natively-mounted
  // portals, not on <html>. Without re-assertion the --ds-text-*/--ds-leading-* aliases
  // keep the value they resolved to at :root — the WEBSITE scale — so portals silently
  // rendered display headings up to 80px instead of 56px. Verified in-browser.
  const start = tokensCss.indexOf('[data-surface="portal"]');
  assert.notEqual(start, -1, "portal surface block missing");
  const block = tokensCss.slice(start, tokensCss.indexOf("\n}", start));

  for (const alias of ["--ds-text-display", "--ds-leading-display", "--ds-text-body-1"]) {
    assert.ok(block.includes(`\n  ${alias}:`), `${alias} not re-asserted under [data-surface="portal"]`);
  }
});
