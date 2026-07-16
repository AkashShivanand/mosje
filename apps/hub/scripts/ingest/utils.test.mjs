import { test } from "node:test";
import assert from "node:assert/strict";
import { decodeEntities } from "./utils.mjs";

test("decodes numeric (decimal) entities", () => {
  assert.equal(decodeEntities("1993 &#8211; 94"), "1993 – 94");
});
test("decodes hex entities", () => {
  assert.equal(decodeEntities("A &#x26; B"), "A & B");
});
test("decodes named entities and trims", () => {
  assert.equal(decodeEntities("  A &amp; B  "), "A & B");
});
test("decodes curly apostrophe", () => {
  assert.equal(decodeEntities("DoSJE&#8217;s report"), "DoSJE’s report");
});
