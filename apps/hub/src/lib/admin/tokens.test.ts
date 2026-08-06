// Tests for the hub admin credential rules.
//
// These import tokens.ts, not auth.ts: auth.ts pulls in next/headers, which
// only resolves inside Next, so the cookie half is covered by the manual
// matrix in Task 9 of the implementation plan rather than here.
//
// Run: npm test --prefix apps/hub

import { test } from "node:test";
import assert from "node:assert/strict";

import { hmacToken } from "../hmac.ts";
import {
  ADMIN_COOKIE,
  adminConfigured,
  expectedAdminToken,
  verifyAdminPassword,
} from "./tokens.ts";

test("the admin cookie is not the gate cookie", () => {
  assert.equal(ADMIN_COOKIE, "mosje-admin");
  assert.notEqual(ADMIN_COOKIE, "mosje-gate");
});

test("adminConfigured is false when ADMIN_PASSWORD is unset or blank", () => {
  const previous = { ...process.env };
  try {
    delete process.env.ADMIN_PASSWORD;
    assert.equal(adminConfigured(), false);
    process.env.ADMIN_PASSWORD = "   ";
    assert.equal(adminConfigured(), false);
    process.env.ADMIN_PASSWORD = "s3cret";
    assert.equal(adminConfigured(), true);
  } finally {
    process.env = previous;
  }
});

test("expectedAdminToken is null when unconfigured", async () => {
  const previous = { ...process.env };
  try {
    delete process.env.ADMIN_PASSWORD;
    assert.equal(await expectedAdminToken(), null);
  } finally {
    process.env = previous;
  }
});

test("the admin token uses a different label from the gate token", async () => {
  const previous = { ...process.env };
  try {
    process.env.ADMIN_PASSWORD = "same-secret";
    const admin = await expectedAdminToken();
    const gate = await hmacToken("same-secret", "mosje-site-gate.v1");
    assert.notEqual(admin, gate, "a gate cookie must never be replayable as an admin cookie");
  } finally {
    process.env = previous;
  }
});

test("verifyAdminPassword accepts the configured password and rejects others", async () => {
  const previous = { ...process.env };
  try {
    process.env.ADMIN_PASSWORD = "correct-horse-battery";
    assert.equal(await verifyAdminPassword("correct-horse-battery"), true);
    assert.equal(await verifyAdminPassword("correct-horse-batter"), false);
    assert.equal(await verifyAdminPassword(""), false);
  } finally {
    process.env = previous;
  }
});

test("verifyAdminPassword rejects everything when unconfigured", async () => {
  const previous = { ...process.env };
  try {
    delete process.env.ADMIN_PASSWORD;
    assert.equal(await verifyAdminPassword(""), false);
    assert.equal(await verifyAdminPassword("anything"), false);
  } finally {
    process.env = previous;
  }
});

test("the configured password is trimmed before comparison", async () => {
  const previous = { ...process.env };
  try {
    process.env.ADMIN_PASSWORD = "  padded-secret  ";
    assert.equal(await verifyAdminPassword("padded-secret"), true);
  } finally {
    process.env = previous;
  }
});
