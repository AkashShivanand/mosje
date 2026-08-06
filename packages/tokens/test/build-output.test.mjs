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

test("build emits every legacy --ds-* var with an identical resolved value", () => {
  execSync("npm run build", { cwd: root });
  const css = readFileSync(root + "dist/tokens.css", "utf8");
  for (const [name, expected] of Object.entries(legacy)) {
    const got = resolveVar(css, name);
    assert.ok(got !== null, `missing ${name}`);
    assert.equal(
      got.replace(/\s+/g, " "),
      expected.replace(/\s+/g, " "),
      `value drift for ${name}: got "${got}", expected "${expected}"`
    );
  }
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
