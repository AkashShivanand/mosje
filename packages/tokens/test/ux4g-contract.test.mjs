import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolveContract } from "./lib/css-resolve.mjs";

/**
 * THE UX4G PARITY CONTRACT.
 *
 * Same idea as visual-contract.test.mjs, pointed at the other generated stylesheet.
 * It exists because `dist/ux4g.css` is the one output whose token names are typed by
 * HAND — `build/formats/ux4g-parity-css.mjs` carries string literals like
 * `"--sa-bg-neutral-base"` that a rename has to remember to update. Everything else is
 * derived from the source tree and follows a rename automatically.
 *
 * Resolved against tokens.css FIRST, which is the documented import order:
 *   import "@mosje/design-system/tokens.css";
 *   import "@mosje/design-system/ux4g.css";
 * Resolving ux4g.css alone would leave every `--sa-*` reference dangling and the whole
 * fixture would be a wall of `<unresolved:…>` that pins nothing.
 *
 * Regenerate deliberately: node test/lib/write-visual-contract.mjs
 */

const tokensCss = readFileSync(new URL("../dist/tokens.css", import.meta.url), "utf8");
const ux4gCss = readFileSync(new URL("../dist/ux4g.css", import.meta.url), "utf8");
const expected = JSON.parse(readFileSync(new URL("./ux4g-contract.fixture.json", import.meta.url), "utf8"));

const actual = resolveContract(`${tokensCss}\n${ux4gCss}`);

/**
 * Everything in the combined sheet, not just `--ux4g-*`.
 *
 * ux4g.css emits `--sa-*` overrides inside its colour-mode blocks — that is the mechanism
 * by which the UX4G palette repaints the SAMAVESH tokens. Those overrides are hand-typed
 * name literals and nothing else pins them: visual-contract.test.mjs reads tokens.css only,
 * so a rename that forgot this table would leave the UX4G colour modes silently failing to
 * repaint, with every other test green.
 */
const allProps = (props) => props;

function summarise(problems) {
  const shown = problems.slice(0, 15).join("\n  ");
  const rest = problems.length > 15 ? `\n  …and ${problems.length - 15} more` : "";
  return `\n  ${shown}${rest}`;
}

test("no token in the combined sheet changes what it renders, in any context", () => {
  const drifted = [];

  for (const [selector, props] of Object.entries(expected)) {
    const current = actual[selector];
    if (!current) continue;
    for (const [name, wasValue] of Object.entries(props)) {
      const nowValue = current[name];
      if (nowValue !== undefined && nowValue !== wasValue) {
        drifted.push(`${selector} ${name}: ${wasValue} -> ${nowValue}`);
      }
    }
  }

  assert.deepEqual(
    drifted,
    [],
    `UX4G names are a compatibility promise to anyone pasting UX4G markup — these moved:${summarise(drifted)}`,
  );
});

test("no token in the combined sheet disappears", () => {
  const dropped = [];

  for (const [selector, props] of Object.entries(expected)) {
    const current = actual[selector];
    if (!current) {
      dropped.push(`whole context gone: ${selector}`);
      continue;
    }
    for (const name of Object.keys(props)) {
      if (current[name] === undefined) dropped.push(`${selector} ${name}`);
    }
  }

  assert.deepEqual(dropped, [], `the UX4G surface shrank:${summarise(dropped)}`);
});

/**
 * Aliases that do not resolve, pinned so the list can only shrink.
 *
 * `--ux4g-blur-none: var(--ux4g-blur-none)` is self-referential, which CSS treats as
 * invalid at computed-value time, so the property ends up unset for every consumer.
 *
 * It is NOT our bug and must NOT be "fixed" here. The value is copied verbatim from
 * UX4G's own published contract (`reference/ux4g-3.0.tokens.json`, `--ux4g-blur-none`),
 * and reproducing UX4G's value faithfully is the entire promise of this layer — see
 * spec §8.1a. Giving it a working value would mean a developer pasting UX4G markup gets
 * a different rendering here than in the reference system, with nothing in the code to
 * explain the divergence. That is the failure mode §8.1a exists to prevent.
 *
 * The correct fix is upstream, in UX4G. If they ship one, the stale-entry test below
 * fails and this entry comes out.
 */
const KNOWN_UNRESOLVED = new Set(["--ux4g-blur-none"]);

test("every --ux4g-* alias still resolves to a literal", () => {
  // The failure this is really watching for: someone renames a --sa-* token and forgets
  // the hand-typed name table in build/formats/ux4g-parity-css.mjs. The alias would then
  // point at a name nobody declares, and the UX4G surface would silently render nothing.
  const broken = [];

  for (const [selector, props] of Object.entries(actual)) {
    for (const [name, value] of Object.entries(allProps(props))) {
      if (KNOWN_UNRESOLVED.has(name)) continue;
      if (value.includes("<unresolved:") || value.includes("<cycle:")) {
        broken.push(`${selector} ${name}: ${value}`);
      }
    }
  }

  assert.deepEqual(
    broken,
    [],
    `these UX4G aliases point at a token that is not declared — check the hand-maintained ` +
      `name table in build/formats/ux4g-parity-css.mjs:${summarise(broken)}`,
  );
});

test("the known-unresolved list has no stale entries", () => {
  const rootProps = allProps(actual[":root"] ?? {});
  const fixed = [...KNOWN_UNRESOLVED].filter((name) => {
    const value = rootProps[name];
    return value !== undefined && !value.includes("<unresolved:") && !value.includes("<cycle:");
  });

  assert.deepEqual(
    fixed,
    [],
    `these now resolve — delete them from KNOWN_UNRESOLVED so the guard stays honest:${summarise(fixed)}`,
  );
});
