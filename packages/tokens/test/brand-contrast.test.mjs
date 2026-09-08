import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { execSync } from "node:child_process";

/**
 * NOTE — this file REBUILDS dist/ with a different brand pack, which is why the suite runs at
 * `--test-concurrency=1` (see package.json). `node --test` parallelises across FILES by
 * default, so while this test holds dist/tokens.css at the `_starter` brand, any other file
 * reading dist/ sees the wrong brand's output and fails at random. That produced two
 * non-reproducing failures before it was tracked down, in build-output and visual-contract.
 *
 * Serialising is the cheap fix. The real fix is to build into a temp directory and point the
 * assertions at that — worth doing if the suite ever gets slow enough to care.
 */

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

/** Assert the pairings against an already-built stylesheet. */
function assertPairings(css, brand) {
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
  // The shipped build, written where it belongs — this IS the artefact the
  // estate imports, so building it here is the point rather than a side effect.
  execSync("npm run build", { cwd: root, env: { ...process.env, BRAND: "mosje" } });
  assertPairings(readFileSync(root + "dist/tokens.css", "utf8"), "mosje");
});

/*
 * A RE-SKIN IS INSPECTED, NEVER INSTALLED.
 *
 * This used to build `_starter` straight over `dist/` and
 * `../design-system/tokens.css` — the file `globals.css` imports — and restore
 * `mosje` in a `finally`. That covers a failing assertion and nothing else. It
 * does not cover a Ctrl-C, a killed `npm run ci`, or the one that actually bit:
 * a dev server watching the file, catching the starter pack's India Green
 * `#095e34` in the seconds before the restore, and serving that chunk from cache
 * long after the disk was blue again — on every page in the estate, twice.
 *
 * A test that checks another brand has no business writing one. `TOKENS_OUT`
 * sends the whole build to a temporary directory, so there is no window in which
 * the shipped tokens are wrong and nothing to restore afterwards.
 */
test("a re-skin (_starter brand pack) also passes the contrast gate", () => {
  const tmp = mkdtempSync(join(tmpdir(), "mosje-tokens-brand-"));
  try {
    execSync("npm run build", {
      cwd: root,
      env: { ...process.env, BRAND: "_starter", TOKENS_OUT: tmp },
    });
    assertPairings(readFileSync(join(tmp, "dist/tokens.css"), "utf8"), "_starter");
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
});
