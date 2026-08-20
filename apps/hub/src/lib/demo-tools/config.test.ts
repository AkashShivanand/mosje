// Tests for demo-tool visibility.
//
// The shared parse/serialize rules live in `settings/toggle.test.ts`. What is
// specific here is the PRECEDENCE between a build-time flag and a stored row,
// and the direction the whole thing fails in.
//
// Run: npm test --prefix apps/hub

import { test } from "node:test";
import assert from "node:assert/strict";

import { toggleConfig } from "../settings/toggle.ts";
import { demoToolsEnabled } from "./config.ts";

const on = toggleConfig(true);
const off = toggleConfig(false);

test("with nothing configured the dock is ON — the demo is the product here", () => {
  assert.equal(demoToolsEnabled(null, undefined), true);
});

test("the stored setting decides when the build-time flag is not a hard off", () => {
  assert.equal(demoToolsEnabled(off, undefined), false);
  assert.equal(demoToolsEnabled(on, undefined), true);
  assert.equal(demoToolsEnabled(off, "true"), false);
});

test("NEXT_PUBLIC_DEMO_TOOLS=false is a HARD off the database cannot override", () => {
  // A deployment built without demo tooling must not acquire it from a row.
  assert.equal(demoToolsEnabled(on, "false"), false);
  assert.equal(demoToolsEnabled(null, "false"), false);
});

test("only the exact string 'false' is a hard off", () => {
  for (const v of ["False", "FALSE", "0", "no", "", "  false  "]) {
    assert.equal(demoToolsEnabled(on, v), true, `${JSON.stringify(v)} must not disable`);
  }
});

test("an unreadable store degrades to VISIBLE, not hidden", () => {
  // readToggle returns null on every failure. A paused database must not
  // silently strip the thing the prototype exists to demonstrate.
  assert.equal(demoToolsEnabled(null, undefined), true);
});
