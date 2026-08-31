// Deep-linking a login role tab. Run:
// node --test packages/design-system/components/auth/portal-login-url.test.ts

import { test } from "node:test";
import assert from "node:assert/strict";

import { portalLoginUrl, roleFromUrl } from "./portal-login-url.ts";

test("appends the role to a bare path", () => {
  assert.equal(portalLoginUrl("/portals/scw/login", "officer"), "/portals/scw/login?role=officer");
});

test("no role means the path is returned untouched", () => {
  assert.equal(portalLoginUrl("/portals/scw/login"), "/portals/scw/login");
  assert.equal(portalLoginUrl("/portals/scw/login", ""), "/portals/scw/login");
});

test("preserves query params already on the path", () => {
  const out = portalLoginUrl("/portals/scw/login?from=banner", "citizen");
  assert.ok(out.includes("from=banner"), out);
  assert.ok(out.includes("role=citizen"), out);
});

test("replaces an existing role rather than appending a second one", () => {
  const out = portalLoginUrl("/portals/scw/login?role=citizen", "officer");
  assert.equal(out, "/portals/scw/login?role=officer");
  assert.equal(out.match(/role=/g)?.length, 1);
});

test("role ids needing encoding survive the round trip", () => {
  const out = portalLoginUrl("/x", "district officer");
  assert.equal(roleFromUrl("http://x" + out), "district officer");
});

test("reads the role from the query", () => {
  assert.equal(roleFromUrl("https://x/portals/scw/login?role=officer"), "officer");
});

/*
 * The hash form is the tab anchor's ORIGINAL href. It is still read so links
 * shared before the query existed keep landing on the right tab.
 */
test("falls back to the legacy #role- hash", () => {
  assert.equal(roleFromUrl("https://x/portals/scw/login#role-citizen"), "citizen");
});

test("the query wins when both are present", () => {
  assert.equal(roleFromUrl("https://x/l?role=officer#role-citizen"), "officer");
});

test("returns null when there is no role, rather than guessing", () => {
  assert.equal(roleFromUrl("https://x/portals/scw/login"), null);
  assert.equal(roleFromUrl("https://x/l#section-2"), null);
  assert.equal(roleFromUrl("not a url at all"), null);
});
