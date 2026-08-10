import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolveContract } from "./lib/css-resolve.mjs";

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

const expected = JSON.parse(readFileSync(fixturePath, "utf8"));
const actual = resolveContract(readFileSync(cssPath, "utf8"));

/**
 * old canonical name -> new canonical name.
 *
 * Entries here are claims that a rename was value-preserving. Each one is checked,
 * not trusted.
 */
const RENAMES = {};

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
