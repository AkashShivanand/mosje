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
  // 2026-08-11 — `gov-` dropped from every colour name (gov-blue/gov-blue-dark/gov-blue-tonal/
  // gov-navy/gov-yellow -> primary/primary-dark/primary-tonal/navy/yellow, 330 call sites).
  // A colour is named for what it DOES in the system, not for who owns the system, and the
  // prefix carried no information: every colour here is a government colour. `gov-blue` and
  // `primary` were already the same value, so that pair was a merge, not a remap. The two
  // --ds-* renames were PROVEN value-preserving here before being baselined, so their
  // entries are deleted per the note above.

  // 2026-08-11 — the neutral endpoints renumbered to match UX4G 3.0 (pure white at `0`, pure
  // black at `1000`, near-black shade at `950`); we had them one slot high. All six were
  // PROVEN value-preserving here first — old name's old value === new name's new value, in
  // every selector context — and only then baselined, so their entries are deleted per the
  // note above. The proof is in this commit, not in a list that would otherwise only grow.

  // NOTE — the 2026-08-10 value-naming of the type primitives (`font/size/400` -> `font/size/16`)
  // is deliberately NOT listed here, because it was a rename AND a unit change: the steps now
  // alias the new `size/*` scale, which carries UX4G's rem values. RENAMES asserts the old and
  // new resolve identically, and `16px` -> `1rem` does not, so claiming it here would be false.
  //
  // The fixture was re-baselined instead. Safe, and an improvement: nothing renders from these
  // (zero `var(--sa-ref-font-size-*)` call sites), and their one consumer is the UX4G parity
  // layer — where `--ux4g-line-height-16` IS `1rem` in UX4G's own contract, so binding a rem
  // makes conformance more exact than binding a px did.

  // Otherwise empty, and that is the healthy state. Every rename this file has carried —
  // `spacing/*`→`space/*`, the brand ramps' `light|dark`→`blue|navy`, `color/chart/*`→`chart/*`,
  // and the ordinal ladder — was PROVEN here first (old name's old value === new name's new
  // value, in every selector context) and only then baselined into the fixture. The proof
  // lives in the commits and the changelog, not in a list that would otherwise only grow.
  //
  // Add an entry only for a rename that has not yet been baselined, and delete it once it has:
  // the stale-entry test below will tell you when.
  //
  // NOT a place for a VALUE change. A token that renders differently must move the fixture
  // with a written reason, never be laundered through here as if it had only been renamed.
};

/**
 * Tokens DELETED on purpose, with the reason.
 *
 * A rename and a deletion are different claims and were being treated the same: the only way
 * to retire a token was to quietly re-baseline the fixture, which is indistinguishable from
 * losing one by accident. Listing them makes the removal reviewable, and the stale-entry test
 * below stops the list outliving the tokens.
 *
 * The bar for an entry is EVIDENCE OF ZERO CONSUMERS, not "we think nobody uses it".
 */
const REMOVED = {
  // The fixed 5-role type scale. It shadowed the fluid 21-role scale under a friendlier name
  // (`--sa-type-display-size` beside `--sa-type-display-1-size`), aliased the RAW size steps so
  // it could never respond to surface or breakpoint, and had zero consumers — verified with an
  // exact-match grep for `var(--sa-type-<role>-<prop>)` across packages/ and apps/, including
  // the generated sheet itself. Anything reaching for type by name now gets the responsive one.
  ...Object.fromEntries(
    ["display", "title1", "headline", "body1", "body2"].flatMap((role) =>
      ["size", "leading", "weight"].map((prop) => [
        `--sa-type-${role}-${prop}`,
        "dead fixed type scale, 0 consumers — superseded by the fluid --sa-type-<role>-<n>-* roles",
      ]),
    ),
  ),
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
      if (REMOVED[name]) continue;
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
    `these tokens are gone. Add an entry to RENAMES if one MOVED, or to REMOVED — with ` +
      `evidence of zero consumers — if one was retired:${summarise(dropped)}`,
  );
});

test("every declared removal is actually gone — REMOVED has no stale entries", () => {
  // Symmetrical with the rename ratchet. A token listed as removed that still ships means the
  // list has stopped describing the system, and the next real deletion hides inside it.
  const stillHere = Object.keys(REMOVED).filter((name) =>
    Object.values(actual).some((props) => props[name] !== undefined),
  );
  assert.deepEqual(
    stillHere,
    [],
    `${stillHere.length} token(s) are listed in REMOVED but still emitted — delete the entries`,
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
