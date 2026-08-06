// Tests for the site gate's redirect clamping.
// Run: npm test --prefix apps/hub

import { test } from "node:test";
import assert from "node:assert/strict";

import { deriveToken, resolveGateToken, safeNextPath } from "./site-gate.ts";
import { resetSettingsCache } from "./settings/store.ts";

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

test("resolveGateToken prefers the stored token over the env password", async () => {
  const previous = { ...process.env };
  const previousFetch = globalThis.fetch;
  resetSettingsCache();
  process.env.SUPABASE_URL = "https://p.supabase.co";
  process.env.SUPABASE_SERVICE_ROLE_KEY = "svc";
  process.env.SITE_PASSWORD = "env-password";
  globalThis.fetch = (async () =>
    new Response(JSON.stringify([{ value: "stored-token" }]), {
      status: 200,
      headers: { "content-type": "application/json" },
    })) as unknown as typeof fetch;
  try {
    assert.equal(await resolveGateToken(), "stored-token");
  } finally {
    process.env = previous;
    globalThis.fetch = previousFetch;
    resetSettingsCache();
  }
});

test("resolveGateToken falls back to the env password when the store is empty", async () => {
  const previous = { ...process.env };
  resetSettingsCache();
  delete process.env.SUPABASE_URL;
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  process.env.SITE_PASSWORD = "env-password";
  try {
    assert.equal(await resolveGateToken(), await deriveToken("env-password"));
  } finally {
    process.env = previous;
    resetSettingsCache();
  }
});

test("resolveGateToken returns null when neither store nor env is set", async () => {
  const previous = { ...process.env };
  resetSettingsCache();
  delete process.env.SUPABASE_URL;
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  delete process.env.SITE_PASSWORD;
  try {
    assert.equal(await resolveGateToken(), null);
  } finally {
    process.env = previous;
    resetSettingsCache();
  }
});
