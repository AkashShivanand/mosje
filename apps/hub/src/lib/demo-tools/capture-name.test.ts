// Tests for the demo screenshot's file name.
//
// Run: npm test --prefix apps/hub

import { test } from "node:test";
import assert from "node:assert/strict";

import { captureFileName } from "./capture-name.ts";

const date = new Date(2026, 8, 28, 14, 5, 9);

test("a website shot names the page, the design, the scope and the time", () => {
  assert.equal(
    captureFileName({ pathname: "/website/ministry/our-team", scope: "viewport", design: "DBIM Design", date }),
    "website-ministry-our-team_dbim-design_visible-area_2026-09-28-140509.png",
  );
});

test("a portal shot carries no design, and a non-default colour mode is named", () => {
  assert.equal(
    captureFileName({ pathname: "/portals/pm-ajay/dashboard", scope: "page", colour: "Navy", date }),
    "portals-pm-ajay-dashboard_navy-colour_full-page_2026-09-28-140509.png",
  );
});

test("the root address is called home rather than left blank", () => {
  assert.equal(captureFileName({ pathname: "/", scope: "page", date }), "home_full-page_2026-09-28-140509.png");
});
