import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

/**
 * The selection stylesheets carry ZERO raw lengths and ZERO raw durations. The previous
 * controls.css held eight 18px boxes, a 1.5px border and twelve raw transition durations;
 * this is what stops them coming back. Toggle keeps its verbatim geometry (a documented
 * follow-up), so it is asserted only for the two media blocks.
 */
const dir = new URL("./", import.meta.url);
const read = (f: string): string =>
  readFileSync(new URL(f, dir), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");

const TOKENISED = ["selection-control.css", "checkbox.css", "radio.css"];

for (const file of TOKENISED) {
  test(`${file} has no raw px outside comments`, () => {
    const hits = read(file).match(/(?<![\w-])\d+(\.\d+)?px/g) ?? [];
    // 1px is the sr-only clip box, the one length that is a technique rather than a size.
    const bad = hits.filter((h) => h !== "1px");
    assert.deepEqual(bad, [], `${file}: ${bad.join(", ")}`);
  });
  test(`${file} has no raw duration`, () => {
    const hits = read(file).match(/\b\d+(\.\d+)?m?s\b/g) ?? [];
    assert.deepEqual(hits, [], `${file}: ${hits.join(", ")}`);
  });
}

for (const file of [...TOKENISED, "toggle.css"]) {
  test(`${file} declares prefers-reduced-motion and forced-colors blocks`, () => {
    const css = read(file);
    if (file === "selection-control.css" || file === "toggle.css") {
      assert.match(css, /prefers-reduced-motion:\s*reduce/);
    }
    assert.match(css, /forced-colors:\s*active/);
  });
}

test("the checked fill is painted in forced colours, not left to the glyph", () => {
  const box = read("checkbox.css");
  const forced = box.slice(box.indexOf("forced-colors"));
  assert.match(forced, /:checked[^{]*\{[^}]*background-color:\s*Highlight/);
  const circle = read("radio.css");
  assert.match(circle.slice(circle.indexOf("forced-colors")), /ds-radio__dot[^{]*\{[^}]*background-color:\s*Highlight/);
});
