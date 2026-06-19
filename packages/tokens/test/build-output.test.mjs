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
