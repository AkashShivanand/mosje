import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

/**
 * Guards the TWO generations of typography alias that coexist in tokens.css.
 *
 * This file exists because the difference between them looks exactly like a bug
 * and has been reported as one: `--ds-text-title-1` resolves to 24→32px while
 * design.md's role table puts Title 1 at 20px (portal) / 22px (website). Both
 * facts are correct, because they describe different things.
 *
 *   • HYPHENATED legacy family (--ds-text-title-1, --ds-leading-body-2, …)
 *     predates the Portal-DS scale. Each alias is mapped to whichever canonical
 *     role reproduces its HISTORICAL rendered value, so the names deliberately
 *     do NOT line up with the role table. build-output.test.mjs already pins the
 *     values against test/legacy-snapshot.json; what is asserted here is the
 *     *shape* of the mapping that produces them, so a well-meaning rename is
 *     caught at its cause rather than as 18 downstream value diffs.
 *
 *   • UNHYPHENATED canonical family (--ds-text-title1, --ds-leading-headline3, …)
 *     IS 1:1 with the roles. That invariant had no test at all; it does now.
 */

const root = new URL("..", import.meta.url).pathname;
const generator = readFileSync(
  root + "build/formats/legacy-ds-css.mjs",
  "utf8",
);

/** Every `"--ds-text-…": "--ds-type-…"` pair declared in the generator. */
function aliasPairs() {
  const re =
    /"(--ds-(?:text|leading)-[a-z0-9-]+)":\s*"(--ds-type-[a-z]+-\d-(?:size|lh))"/g;
  const out = [];
  let m;
  while ((m = re.exec(generator)) !== null) out.push([m[1], m[2]]);
  return out;
}

/** `--ds-text-title1` → `--ds-type-title-1-size` (the same-named role). */
function sameNamedRole(alias) {
  const m = /^--ds-(text|leading)-([a-z]+)(\d)$/.exec(alias);
  if (!m) return null;
  const [, kind, role, n] = m;
  return `--ds-type-${role}-${n}-${kind === "text" ? "size" : "lh"}`;
}

test("the unhyphenated canonical aliases are 1:1 with their role tokens", () => {
  const canonical = aliasPairs().filter(([alias]) => sameNamedRole(alias));
  assert.ok(
    canonical.length >= 30,
    `expected the full canonical role set, found ${canonical.length}`,
  );

  for (const [alias, target] of canonical) {
    assert.equal(
      target,
      sameNamedRole(alias),
      `${alias} must point at its own role. Pointing it elsewhere makes the ` +
        `canonical family as confusing as the legacy one it exists to replace.`,
    );
  }
});

test("the hyphenated legacy aliases keep their value-preserving mapping", () => {
  /**
   * Pinned deliberately, including the two that look wrong. `title-1` → the
   * headline-2 role and `title-2` → the title-1 role are a one-step shift that
   * reproduces the pre-Portal-DS scale; "correcting" either one resizes every
   * legacy callsite in the estate (h2s in the docs portal, modal and side-sheet
   * titles, the identity inputs, SLA indicators).
   */
  const PINNED = {
    "--ds-text-display": "--ds-type-display-1-size",
    "--ds-leading-display": "--ds-type-display-1-lh",
    "--ds-text-headline": "--ds-type-headline-1-size",
    "--ds-leading-headline": "--ds-type-headline-1-lh",
    "--ds-text-title-1": "--ds-type-headline-2-size",
    "--ds-leading-title-1": "--ds-type-headline-2-lh",
    "--ds-text-title-2": "--ds-type-title-1-size",
    "--ds-leading-title-2": "--ds-type-title-1-lh",
    "--ds-text-body-1": "--ds-type-body-1-size",
    "--ds-leading-body-1": "--ds-type-body-1-lh",
    "--ds-text-body-2": "--ds-type-body-2-size",
    "--ds-leading-body-2": "--ds-type-body-2-lh",
    "--ds-text-body-3": "--ds-type-body-3-size",
    "--ds-leading-body-3": "--ds-type-body-3-lh",
    "--ds-text-label-1": "--ds-type-label-1-size",
    "--ds-leading-label-1": "--ds-type-label-1-lh",
    "--ds-text-label-3": "--ds-type-label-3-size",
    "--ds-leading-label-3": "--ds-type-label-3-lh",
  };

  const declared = Object.fromEntries(aliasPairs());
  for (const [alias, expected] of Object.entries(PINNED)) {
    assert.equal(
      declared[alias],
      expected,
      `${alias} is a legacy alias pinned to ${expected} to preserve its ` +
        `historical size. See test/legacy-snapshot.json before changing it.`,
    );
  }
});

test("every alias in the generator resolves to a role the build actually emits", () => {
  // A typo'd target (`--ds-type-titel-1-size`) yields a var() chain that dead-ends
  // and renders as nothing — invisible in review, obvious here.
  const css = readFileSync(root + "dist/tokens.css", "utf8");
  const emitted = new Set(
    [...css.matchAll(/(--ds-type-[a-z]+-\d-(?:size|lh))\s*:/g)].map((m) => m[1]),
  );

  for (const [alias, target] of aliasPairs()) {
    assert.ok(
      emitted.has(target),
      `${alias} points at ${target}, which the build never emits`,
    );
  }
});
