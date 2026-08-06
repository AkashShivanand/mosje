// Tests for the site gate's redirect clamping.
// Run: npm test --prefix apps/hub

import { test } from "node:test";
import assert from "node:assert/strict";

import { safeNextPath } from "./site-gate.ts";

test("safeNextPath keeps same-origin absolute paths", () => {
  assert.equal(safeNextPath("/website"), "/website");
  assert.equal(safeNextPath("/portals/nmba/admin/login"), "/portals/nmba/admin/login");
  assert.equal(safeNextPath("/website?tab=2"), "/website?tab=2");
});

test("safeNextPath rejects protocol-relative and absolute URLs", () => {
  assert.equal(safeNextPath("//evil.example"), "/");
  assert.equal(safeNextPath("https://evil.example"), "/");
  assert.equal(safeNextPath("http://evil.example"), "/");
});

test("safeNextPath rejects backslash tricks browsers treat as //", () => {
  assert.equal(safeNextPath("/\\evil.example"), "/");
});

test("safeNextPath rejects relative paths and empty input", () => {
  assert.equal(safeNextPath("website"), "/");
  assert.equal(safeNextPath(""), "/");
  assert.equal(safeNextPath(null), "/");
  assert.equal(safeNextPath(undefined), "/");
});
