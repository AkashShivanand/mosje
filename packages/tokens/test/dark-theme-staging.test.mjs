import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { CVD_KINDS, contrast, deltaE, simulate } from "../../../tools/chart-palette/colour.mjs";

/**
 * THE DARK THEME THAT IS AUTHORED AND NOT EMITTED.
 *
 * 65 tokens across seven families carry an `$extensions.mosje.themes.dark`
 * value in `src/semantic.json`, and **not one of them reaches any output**.
 * `tokens.css` emits no `[data-theme]` block at all — the appearance axis was
 * deliberately retired (see `skeleton.css`, which documents that decision).
 *
 * That is a legitimate scope choice. What was NOT legitimate is that nothing
 * said so: an audit found the values by accident, and the honest reading was
 * ambiguous between "staged work awaiting a dark theme" and "65 dead values
 * nobody noticed". This test settles it in the repository rather than in
 * somebody's memory.
 *
 * It deliberately does NOT require the values to be emitted or deleted. It
 * requires the situation to stay *known*: the count cannot drift, and the
 * chart ramp's measured unfitness cannot be forgotten if a dark theme is ever
 * switched on.
 */

const root = new URL("..", import.meta.url).pathname;
const src = JSON.parse(readFileSync(root + "src/semantic.json", "utf8"));
const css = readFileSync(root + "dist/tokens.css", "utf8");

function darkTokens() {
  const found = [];
  const walk = (node, path) => {
    if (!node || typeof node !== "object") return;
    const dark = node.$extensions?.mosje?.themes?.dark;
    if (dark) found.push({ path, dark });
    for (const k of Object.keys(node)) {
      if (!k.startsWith("$")) walk(node[k], path ? `${path}.${k}` : k);
    }
  };
  walk(src, "");
  return found;
}

/** Frozen so a change in either direction is a decision, not a drift. */
const EXPECTED_DARK_TOKENS = 65;

test("the staged dark values are still staged, and their count has not drifted", () => {
  const found = darkTokens();
  assert.equal(
    found.length,
    EXPECTED_DARK_TOKENS,
    `${found.length} tokens carry a dark theme value; the record says ${EXPECTED_DARK_TOKENS}. ` +
      `If you added or removed one deliberately, update EXPECTED_DARK_TOKENS in the same change ` +
      `— the point of this number is that nobody can move it by accident.`,
  );
});

test("no dark value is emitted, because there is no dark theme to emit it into", () => {
  assert.equal(
    /\[data-theme/.test(css),
    false,
    "tokens.css now emits a [data-theme] block. If a dark theme has landed, this test is the " +
      "wrong shape: replace it with real dark-mode contrast and separation assertions, and read " +
      "the chart-ramp warning in the next test first.",
  );
});

/**
 * The warning that has to survive until someone switches dark mode on.
 *
 * The chart ramp's dark values were never measured. They are measurably worse
 * than the light ramp and their ORDER is inherited from it rather than derived
 * from their own separation, so the leading slots are not the best ones.
 */
test("the chart dark ramp is recorded as NOT ready to ship", () => {
  const cat = src.chart.cat;
  const dark = Array.from({ length: 12 }, (_, i) => cat[String(i + 1)].$extensions.mosje.themes.dark);

  let worstNormal = Infinity;
  const worstCvd = {};
  for (let i = 0; i < dark.length; i += 1) {
    for (let j = i + 1; j < dark.length; j += 1) {
      worstNormal = Math.min(worstNormal, deltaE(dark[i], dark[j]));
      for (const k of CVD_KINDS) {
        const d = deltaE(simulate(dark[i], k), simulate(dark[j], k));
        worstCvd[k] = Math.min(worstCvd[k] ?? Infinity, d);
      }
    }
  }

  // These are the measurements as of 2026-09-02. They are asserted as a FLOOR
  // that must not silently improve either: if someone fixes the dark ramp, this
  // test should fail and be rewritten to assert the new, passing thresholds.
  assert.ok(
    worstNormal < 15,
    `the dark ramp's worst normal-vision pair is now ΔE ${worstNormal.toFixed(1)}, at or above the ` +
      `floor of 15. If the ramp was fixed, rewrite this test to assert it PASSES instead of ` +
      `recording that it fails.`,
  );
  assert.ok(
    worstCvd.deutan < 8,
    `the dark ramp's worst deuteranopia pair is now ΔE ${worstCvd.deutan.toFixed(1)}. Same as above.`,
  );

  // A dark surface is not defined anywhere yet; #121417 is the value used to
  // take this reading and is named so the number can be reproduced.
  const belowContrast = dark.filter((h) => contrast(h, "#121417") < 3);
  assert.deepEqual(
    belowContrast,
    [],
    `these dark chart colours fall below 3:1 on a #121417 surface: ${belowContrast.join(", ")}`,
  );
});
