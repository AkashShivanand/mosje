// Tests for the shared on/off setting.
//
// Everything here is about what happens when the stored value is WRONG —
// absent, hand-edited, written by a future build, or the wrong type. A
// settings row must never be able to break a page, and a toggle that silently
// does nothing is worse than one that fails loudly.
//
// Run: npm test --prefix apps/hub

import { test } from "node:test";
import assert from "node:assert/strict";

import {
  TOGGLE_CONFIG_MAX_BYTES,
  TOGGLE_CONFIG_VERSION,
  parseToggle,
  serializeToggle,
  toggleConfig,
} from "./toggle.ts";

test("parse rejects anything that is not a current, well-formed config", () => {
  assert.equal(parseToggle(null), null);
  assert.equal(parseToggle(""), null);
  assert.equal(parseToggle("not json"), null);
  assert.equal(parseToggle("[]"), null);
  assert.equal(parseToggle(JSON.stringify({ enabled: true })), null, "no version");
  assert.equal(
    parseToggle(JSON.stringify({ version: 99, enabled: true })),
    null,
    "a future version must not be half-read",
  );
});

test("a string 'false' is REJECTED, never coerced", () => {
  // Boolean("false") is true. Coercing here is the exact bug that makes an
  // admin toggle look like it does nothing.
  assert.equal(
    parseToggle(JSON.stringify({ version: TOGGLE_CONFIG_VERSION, enabled: "false" })),
    null,
  );
  assert.equal(
    parseToggle(JSON.stringify({ version: TOGGLE_CONFIG_VERSION, enabled: 0 })),
    null,
  );
});

test("an oversized payload is refused before it is parsed", () => {
  const huge = JSON.stringify({
    version: TOGGLE_CONFIG_VERSION,
    enabled: true,
    padding: "x".repeat(TOGGLE_CONFIG_MAX_BYTES),
  });
  assert.ok(new TextEncoder().encode(huge).length > TOGGLE_CONFIG_MAX_BYTES);
  assert.equal(parseToggle(huge), null);
});

test("serialize round-trips through parse, both ways", () => {
  for (const enabled of [true, false]) {
    assert.deepEqual(parseToggle(serializeToggle(toggleConfig(enabled))), toggleConfig(enabled));
  }
});

test("serialize emits only the two fields, so a hand-edited row cannot smuggle more", () => {
  assert.equal(serializeToggle(toggleConfig(true)), '{"version":1,"enabled":true}');
});
