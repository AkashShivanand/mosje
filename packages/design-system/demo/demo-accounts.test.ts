import test from "node:test";
import assert from "node:assert/strict";

import { DEMO_ACCOUNTS, findDemoAccounts, isLoginRoute } from "./demo-accounts.ts";

test("matches a portal by path prefix", () => {
  const found = findDemoAccounts("/portals/nmba/admin/login");
  assert.equal(found?.path, "/portals/nmba");
  assert.ok(found!.accounts.length > 0);
});

test("returns null when no set matches", () => {
  assert.equal(findDemoAccounts("/website/schemes-services"), null);
  assert.equal(findDemoAccounts("/"), null);
});

test("longest matching prefix wins", () => {
  // /portals/tg has both a citizen and an admin set.
  const admin = findDemoAccounts("/portals/tg/admin/login");
  assert.equal(admin?.path, "/portals/tg/admin");
});

test("every set has a non-empty path starting with a slash", () => {
  for (const set of DEMO_ACCOUNTS) {
    assert.match(set.path, /^\//, `bad path: ${set.path}`);
    assert.ok(set.accounts.length > 0, `empty set: ${set.path}`);
  }
});

test("every account carries a role, id and password", () => {
  for (const set of DEMO_ACCOUNTS) {
    for (const a of set.accounts) {
      assert.ok(a.role && a.id && a.password, `incomplete account in ${set.path}`);
    }
  }
});

test("isLoginRoute matches the three login-route suffixes", () => {
  assert.equal(isLoginRoute("/portals/nmba/admin/login"), true);
  assert.equal(isLoginRoute("/portals/nmba/treatment-centre/login-otp"), true);
  assert.equal(isLoginRoute("/portals/tg/citizen/sign-in"), true);
  assert.equal(isLoginRoute("/admin/login"), true);
});

test("isLoginRoute ignores trailing slash and query/hash", () => {
  assert.equal(isLoginRoute("/portals/nmba/admin/login/"), true);
  assert.equal(isLoginRoute("/portals/nmba/admin/login?next=/x"), true);
  assert.equal(isLoginRoute("/portals/nmba/admin/login#top"), true);
});

test("isLoginRoute is false for a page under a portal that has a demo set but isn't the login page", () => {
  // /portals/nmba/admin/dashboard has a demo account set (findDemoAccounts
  // matches on the /portals/nmba prefix) but isn't a login route itself.
  assert.equal(isLoginRoute("/portals/nmba/admin/dashboard"), false);
  assert.ok(findDemoAccounts("/portals/nmba/admin/dashboard") !== null);
});

test("isLoginRoute is false for non-login paths", () => {
  assert.equal(isLoginRoute("/website"), false);
  assert.equal(isLoginRoute("/"), false);
  assert.equal(isLoginRoute("/portals/nmba/admin/logins"), false);
});
