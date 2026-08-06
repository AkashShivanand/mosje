// Tests for the HMAC primitives shared by the site gate and the admin auth.
// Run: npm test --prefix apps/hub

import { test } from "node:test";
import assert from "node:assert/strict";

import { hmacToken, safeEqual } from "./hmac.ts";

test("hmacToken is deterministic for the same secret and label", async () => {
  const a = await hmacToken("hunter2", "label.v1");
  const b = await hmacToken("hunter2", "label.v1");
  assert.equal(a, b);
});

test("hmacToken separates domains by label", async () => {
  const a = await hmacToken("hunter2", "gate.v1");
  const b = await hmacToken("hunter2", "admin.v1");
  assert.notEqual(a, b);
});

test("hmacToken output is base64url of fixed width", async () => {
  const token = await hmacToken("hunter2", "label.v1");
  assert.equal(token.length, 43);
  assert.match(token, /^[A-Za-z0-9_-]+$/);
});

test("hmacToken differs for different secrets", async () => {
  const a = await hmacToken("hunter2", "label.v1");
  const b = await hmacToken("hunter3", "label.v1");
  assert.notEqual(a, b);
});

test("safeEqual matches identical strings and rejects others", () => {
  assert.equal(safeEqual("abc", "abc"), true);
  assert.equal(safeEqual("abc", "abd"), false);
  assert.equal(safeEqual("abc", "abcd"), false);
  assert.equal(safeEqual("", ""), true);
});
