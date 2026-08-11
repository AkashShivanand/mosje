// The admin cookie pair: settings access vs estate-wide preview.
//
// Two cookies exist because the proxy has to recognise an admin on
// /portals/* to wave them past a hidden entry, and the obvious fix — widening
// the settings cookie to "/" — would let an XSS anywhere in the estate drive
// authenticated requests against /admin. These tests pin the properties that
// make the split worth having.
//
// Run: npm test --prefix apps/hub

import { test } from "node:test";
import assert from "node:assert/strict";

import {
  ADMIN_COOKIE,
  ADMIN_COOKIE_CLEAR_PATHS,
  ADMIN_COOKIE_PATH,
  ADMIN_PREVIEW_COOKIE,
  ADMIN_PREVIEW_COOKIE_PATH,
  expectedAdminToken,
  expectedPreviewToken,
} from "./tokens.ts";

function withPassword(password: string | undefined, fn: () => Promise<void>) {
  const previous = process.env.ADMIN_PASSWORD;
  if (password === undefined) delete process.env.ADMIN_PASSWORD;
  else process.env.ADMIN_PASSWORD = password;
  return fn().finally(() => {
    if (previous === undefined) delete process.env.ADMIN_PASSWORD;
    else process.env.ADMIN_PASSWORD = previous;
  });
}

test("the settings cookie stays scoped to /admin", () => {
  // If this ever becomes "/", an XSS in any portal can reach the settings page
  // with credentials attached. httpOnly stops reading a cookie, not sending it.
  assert.equal(ADMIN_COOKIE_PATH, "/admin");
  assert.equal(ADMIN_PREVIEW_COOKIE_PATH, "/");
  assert.notEqual(ADMIN_COOKIE, ADMIN_PREVIEW_COOKIE);
});

test("a preview token cannot be replayed as an admin token", async () => {
  await withPassword("a-sufficiently-long-password", async () => {
    const admin = await expectedAdminToken();
    const preview = await expectedPreviewToken();
    assert.ok(admin && preview);
    assert.notEqual(
      admin,
      preview,
      "distinct HMAC labels must produce distinct digests",
    );
  });
});

test("both tokens are null when no admin password is configured", async () => {
  await withPassword(undefined, async () => {
    assert.equal(await expectedAdminToken(), null);
    assert.equal(await expectedPreviewToken(), null);
  });
});

test("both tokens change when the password changes", async () => {
  let first: [string | null, string | null] = [null, null];
  await withPassword("first-password-value", async () => {
    first = [await expectedAdminToken(), await expectedPreviewToken()];
  });
  await withPassword("second-password-value", async () => {
    assert.notEqual(await expectedAdminToken(), first[0]);
    assert.notEqual(await expectedPreviewToken(), first[1]);
  });
});

test("sign-out clears the admin cookie from every path it has ever used", () => {
  // "/" is in the list for migration: an earlier build scoped the admin cookie
  // there, and a delete whose path does not match the set path is a no-op — so
  // without this, sign-out would report success and leave the session alive.
  assert.ok(ADMIN_COOKIE_CLEAR_PATHS.includes("/admin"));
  assert.ok(
    ADMIN_COOKIE_CLEAR_PATHS.includes("/"),
    "the legacy estate-wide path must still be cleared",
  );
});
