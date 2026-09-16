import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const css = readFileSync(new URL("./slider.css", import.meta.url), "utf8");
const rule = (selector: string): string => {
  const m = css.match(new RegExp(`\\.${selector}\\s*\\{([^}]*)\\}`));
  assert.ok(m, `no rule for .${selector}`);
  return m[1];
};

/**
 * A rule that sets a role's SIZE owes that role's weight too. The tick labels set label-2's size
 * and left the weight to whatever they inherited; the readout set body-2's size at weight 500,
 * which is no text style (fixed 16 Sep 2026, with five other components).
 */
test("slider: the tick labels take label-2's own weight", () => {
  const mark = rule("ds-slider__mark");
  assert.match(mark, /--sa-type-label-2-size/);
  assert.match(mark, /--sa-type-label-2-lh/);
  assert.match(mark, /--sa-font-weight-medium/);
});

test("slider: the readout is Body 2 SemiBold, the style its Figma master links", () => {
  const readout = rule("ds-slider__readout");
  assert.match(readout, /--sa-type-body-2-size/);
  assert.match(readout, /--sa-font-weight-semibold/);
});
