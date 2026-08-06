import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { execSync } from "node:child_process";

import { contrast, PAIRINGS } from "./lib/contrast.mjs";

// The brand contrast gate. White-labelling swaps the brand pack's colour ramp;
// this asserts the load-bearing semantic pairings still meet WCAG 2.1 AA so a
// re-skin can never ship an inaccessible government portal. This is the real
// mechanism behind "the brand can't break accessibility" — there is no
// "compliance by construction", there is this gate.

const root = new URL("..", import.meta.url).pathname;

function resolveVar(css, name, depth = 0) {
  if (depth > 6) return null;
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const m = css.match(new RegExp(`${escaped}\\s*:\\s*([^;]+);`));
  if (!m) return null;
  const v = m[1].trim();
  const ref = v.match(/^var\((--[a-zA-Z0-9-]+)\)$/);
  return ref ? resolveVar(css, ref[1], depth + 1) : v;
}

function assertBrandPasses(brand) {
  execSync(`npm run build`, { cwd: root, env: { ...process.env, BRAND: brand } });
  const css = readFileSync(root + "dist/tokens.css", "utf8");
  for (const p of PAIRINGS) {
    const fg = resolveVar(css, p.fg);
    const bg = resolveVar(css, p.bg);
    assert.ok(fg && /^#/.test(fg), `${p.fg} did not resolve to a hex colour (got ${fg})`);
    assert.ok(bg && /^#/.test(bg), `${p.bg} did not resolve to a hex colour (got ${bg})`);
    const ratio = contrast(fg, bg);
    assert.ok(
      ratio >= p.min,
      `[brand: ${brand}] ${p.label} (${p.fg} ${fg} on ${p.bg} ${bg}) = ${ratio.toFixed(2)}:1, below AA minimum ${p.min}:1`,
    );
  }
}

test("active brand (mosje) meets WCAG AA on load-bearing pairings", () => {
  assertBrandPasses("mosje");
});

test("a re-skin (_starter brand pack) also passes the contrast gate", () => {
  try {
    assertBrandPasses("_starter");
  } finally {
    // Restore the default brand so dist/ + design-system/tokens.css stay on mosje.
    execSync("npm run build", { cwd: root, env: { ...process.env, BRAND: "mosje" } });
  }
});
