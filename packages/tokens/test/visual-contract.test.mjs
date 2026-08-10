import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolveAxisCombinations, resolveContract } from "./lib/css-resolve.mjs";

/**
 * THE VISUAL CONTRACT.
 *
 * Token names are allowed to move. Rendered pixels are not. This test pins the
 * fully-resolved literal value of every custom property, in every selector context,
 * against a committed fixture.
 *
 * When you rename a token, the test does not just go quiet — you must declare the
 * rename in RENAMES below, and the test then asserts the OLD name's old value equals
 * the NEW name's new value. A rename that changes what renders cannot pass.
 *
 * Regenerate the fixture deliberately, never from inside the test:
 *   node test/lib/write-visual-contract.mjs
 */

const cssPath = new URL("../dist/tokens.css", import.meta.url);
const fixturePath = new URL("./visual-contract.fixture.json", import.meta.url);

const cssText = readFileSync(cssPath, "utf8");
const expected = JSON.parse(readFileSync(fixturePath, "utf8"));
const actual = resolveContract(cssText);

/**
 * old canonical name -> new canonical name.
 *
 * Entries here are claims that a rename was value-preserving. Each one is checked,
 * not trusted: the test asserts the old name's OLD value equals the new name's NEW value.
 *
 * 2026-08-10 — resolving the `default` ambiguity. `default` occupied three slot
 * dictionaries at once (prominence, state, link variant), so `text/link/visited/default`
 * bound its last segment to prominence and never reached the state slot. The prominence
 * canonical became `base` and the link variant became `brand`; `default` is now a state
 * and nothing else. Consumer-facing `--ds-*` and `--ux4g-*` names are deliberately absent
 * from this list — the compat layer was retargeted, not renamed.
 */
const RENAMES = {
  // Empty by design. The 2026-08-10 `default` ambiguity rename (prominence -> `base`, link
  // variant -> `brand`) was proven here — 27 names, byte-identical values in all 7 contexts —
  // and the fixture was then re-baselined when the appearance axis was removed, so those claims
  // are spent. The proof lives in commit fa7dd9b and the changelog, not in a list that can only
  // grow. Add an entry only for a rename that has not yet been baselined.
};

/** Cap the noise when a whole namespace shifts at once. */
function summarise(problems) {
  const shown = problems.slice(0, 15).join("\n  ");
  const rest = problems.length > 15 ? `\n  …and ${problems.length - 15} more` : "";
  return `\n  ${shown}${rest}`;
}

test("every selector context in the fixture is still emitted", () => {
  const missing = Object.keys(expected).filter((sel) => !(sel in actual));
  assert.deepEqual(
    missing,
    [],
    `these selector blocks vanished, so anything they themed reverts to :root:${summarise(missing)}`,
  );
});

test("no token changes what it renders, in any selector context", () => {
  const drifted = [];

  for (const [selector, props] of Object.entries(expected)) {
    const current = actual[selector];
    if (!current) continue; // reported by the selector test above

    for (const [name, wasValue] of Object.entries(props)) {
      const nowName = RENAMES[name] ?? name;
      const nowValue = current[nowName];

      if (nowValue === undefined) continue; // reported by the disappearance test below
      if (nowValue !== wasValue) {
        drifted.push(
          `${selector} ${name}${nowName === name ? "" : ` -> ${nowName}`}: ${wasValue} -> ${nowValue}`,
        );
      }
    }
  }

  assert.deepEqual(drifted, [], `these tokens resolve to a different value than before:${summarise(drifted)}`);
});

test("no token disappears without a declared rename", () => {
  const dropped = [];

  for (const [selector, props] of Object.entries(expected)) {
    const current = actual[selector];
    if (!current) continue;

    for (const name of Object.keys(props)) {
      const nowName = RENAMES[name] ?? name;
      if (current[nowName] !== undefined) continue;
      dropped.push(
        nowName === name
          ? `${selector} ${name}`
          : `${selector} ${name} -> ${nowName} (declared rename, but the new name is not emitted)`,
      );
    }
  }

  assert.deepEqual(
    dropped,
    [],
    `these tokens are gone; add an entry to RENAMES if they moved:${summarise(dropped)}`,
  );
});

test("every declared rename actually corresponds to a token that moved", () => {
  const stale = Object.keys(RENAMES).filter((name) =>
    Object.values(expected).every((props) => props[name] === undefined),
  );

  assert.deepEqual(stale, [], `RENAMES lists names that were never in the contract:${summarise(stale)}`);
});

test("theming axes layer cleanly when a page sets more than one at once", () => {
  // A portal renders data-brand AND data-theme AND data-surface together. 41 properties
  // in this sheet are declared by both the brand axis and the theme axis, so each has an
  // opinion about them, and the single-axis contexts above cannot say who wins.
  //
  // The invariant: a combined context's value always equals the value from one of its own
  // active axes. That holds today, which is why combinations are not pinned separately.
  // If it ever breaks, some pair of axes has started INTERACTING — producing a colour
  // nobody declared — and that is a real visual bug that no single-axis test can see.
  const singles = actual;
  const surprises = [];

  for (const { key, active, resolved } of resolveAxisCombinations(cssText)) {
    for (const [prop, value] of Object.entries(resolved)) {
      const explained =
        value === singles[":root"]?.[prop] || active.some((sel) => singles[sel]?.[prop] === value);
      if (!explained) {
        surprises.push(`${key} ${prop}: ${value} — matches neither :root nor any active axis`);
      }
    }
  }

  assert.deepEqual(
    surprises,
    [],
    `combining theming axes produced values no single axis explains:${summarise(surprises)}`,
  );
});

test("the Tailwind v4 @theme points at tokens that actually exist", () => {
  // dist/tokens-tailwind.css is a public export (@mosje/tokens/tailwind-v4). It once
  // hand-rolled its target names as `--sa-${path}`, which dropped the tier marker, so 111
  // entries aliased `--sa-color-*` while the sheet declares `--sa-ref-color-*`. Every
  // Tailwind colour utility built on those resolved to nothing, and no test noticed
  // because nothing in the estate imports this file yet.
  const twCss = readFileSync(new URL("../dist/tokens-tailwind.css", import.meta.url), "utf8");
  const declared = new Set([...cssText.matchAll(/^\s*(--[a-zA-Z0-9-]+)\s*:/gm)].map((m) => m[1]));
  const dangling = [
    ...new Set([...twCss.matchAll(/var\((--sa-[a-zA-Z0-9-]+)/g)].map((m) => m[1])),
  ].filter((name) => !declared.has(name));

  assert.deepEqual(
    dangling,
    [],
    `the @theme block aliases custom properties tokens.css never declares, so these ` +
      `utilities resolve to nothing. Build the target name with toCssName/tierOfFile, ` +
      `never by hand:${summarise(dangling)}`,
  );
});

test("the sheet stays flat, so the resolver cannot silently mis-parse it", () => {
  // resolveContract() matches `selector { decls }` with a regex that assumes no nesting.
  // An @media / @supports / CSS-nesting block would not blow up — it would parse into
  // something subtly wrong, and this whole contract would go quietly green on garbage.
  // Cheaper to forbid the shape than to make the parser clever: if the generator ever
  // needs an at-rule, that is the moment to reach for a real CSS parser here.
  const atRules = [...cssText.matchAll(/^\s*@[a-z-]+/gim)].map((m) => m[0].trim());

  assert.deepEqual(
    atRules,
    [],
    `dist/tokens.css now contains at-rules (${atRules.join(", ")}). test/lib/css-resolve.mjs ` +
      `parses flat blocks only — teach it to nest before allowing these, or the visual contract ` +
      `silently stops meaning anything.`,
  );
});

test("no var() chain dead-ends or loops in any context", () => {
  const broken = [];

  for (const [selector, props] of Object.entries(actual)) {
    for (const [name, value] of Object.entries(props)) {
      if (value.includes("<unresolved:") || value.includes("<cycle:")) {
        broken.push(`${selector} ${name}: ${value}`);
      }
    }
  }

  assert.deepEqual(broken, [], `these tokens do not resolve to a literal:${summarise(broken)}`);
});
