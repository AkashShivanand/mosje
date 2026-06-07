import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { execSync } from "node:child_process";

const root = new URL("..", import.meta.url).pathname;
const legacy = JSON.parse(readFileSync(root + "test/legacy-snapshot.json", "utf8"));

function resolveVar(css, name) {
  // Resolve one level of var() indirection against the same :root block.
  const direct = css.match(new RegExp(`${name}\\s*:\\s*([^;]+);`));
  if (!direct) return null;
  const v = direct[1].trim();
  const ref = v.match(/^var\((--sa-[a-zA-Z0-9-]+)\)$/);
  if (ref) {
    const m = css.match(new RegExp(`${ref[1]}\\s*:\\s*([^;]+);`));
    return m ? m[1].trim() : null;
  }
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
