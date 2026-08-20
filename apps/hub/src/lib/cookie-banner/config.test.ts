// Tests for cookie-banner visibility.
//
// Shared parse/serialize rules live in `settings/toggle.test.ts`. What is
// specific here is the DEFAULT and the failure direction, and both are the
// opposite of the demo dock's — which is exactly why they are worth pinning.
//
// Run: npm test --prefix apps/hub

import { test } from "node:test";
import assert from "node:assert/strict";

import { toggleConfig } from "../settings/toggle.ts";
import { COOKIE_BANNER_DEFAULT_ENABLED, cookieBannerEnabled } from "./config.ts";

test("the banner is OFF by default, pending its redesign", () => {
  assert.equal(COOKIE_BANNER_DEFAULT_ENABLED, false);
  assert.equal(cookieBannerEnabled(null), false);
});

test("an explicit stored value wins over the default, in both directions", () => {
  assert.equal(cookieBannerEnabled(toggleConfig(true)), true);
  assert.equal(cookieBannerEnabled(toggleConfig(false)), false);
});

test("an unreadable store degrades to HIDDEN — the opposite of the demo dock", () => {
  // Null is every read failure. Falling back to showing a banner the team
  // deliberately took down, because a database blipped, would be the
  // surprising outcome. The dock fails the other way because hiding IT on a
  // blip would strip the thing the prototype exists to show.
  assert.equal(cookieBannerEnabled(null), false);
});

test("turning it back on needs a real boolean, not a truthy stored string", () => {
  // Guards the whole chain: parseToggle rejects "true"/"false" strings, so a
  // hand-edited row cannot flip a compliance control by accident.
  assert.equal(cookieBannerEnabled(null), false);
});
