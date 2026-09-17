// Who may open which E-Anudaan screen — officer console routes (S06) and NGO record pages (S05).
//
// The sidebar showed each role only its own links while no route checked the role, so an ASO
// could open the IFD Joint Secretary's worklist and the Sanction Desk by typing the address. The
// strongest guard is that the route table and the sidebar can never disagree: a link is allowed
// for exactly the roles whose sidebar carries it.
//
// Run: node --test src/lib/e-anudaan/route-access.test.ts

import { test } from "node:test";
import assert from "node:assert/strict";

import { ADMIN_ROLES, EANUDAAN_BASE as B, ROLES, consoleRouteAccess, ownApplication, reviewKeyOf, signedInNgoId } from "./roles.ts";

const APP = encodeURIComponent("GIA/2026-27/SHRESHTA_M2/PUNE/00977");

test("a sidebar link is allowed exactly for the roles whose sidebar carries it", () => {
  const hrefs = new Set(ADMIN_ROLES.flatMap((r) => r.nav.map((n) => n.href)));
  for (const role of ADMIN_ROLES) {
    const mine = new Set(role.nav.map((n) => n.href));
    for (const href of hrefs) {
      const expected = mine.has(href) ? "allowed" : "forbidden";
      assert.equal(consoleRouteAccess(href, role), expected, `${role.id} → ${href}`);
    }
  }
});

test("every officer's home and own review screen are allowed", () => {
  for (const role of ADMIN_ROLES) {
    assert.equal(consoleRouteAccess(role.home, role), "allowed", `${role.id} home`);
    const key = reviewKeyOf(role);
    if (key) assert.equal(consoleRouteAccess(`${B}/dashboard/sm2/${key}/review/${APP}`, role), "allowed", `${role.id} review`);
  }
});

test("the audit's cross-role openings are refused", () => {
  const aso = ROLES["pd-aso"];
  assert.equal(consoleRouteAccess(`${B}/dashboard/sm2/ifdjs`, aso), "forbidden");
  assert.equal(consoleRouteAccess(`${B}/dashboard/sm2/pd`, aso), "forbidden");
  assert.equal(consoleRouteAccess(`${B}/dashboard/sm2/pd/review/${APP}`, aso), "forbidden");
  assert.equal(consoleRouteAccess(`${B}/dashboard/sm2/audit`, aso), "forbidden");
  assert.equal(consoleRouteAccess(`${B}/dashboard/sm2/pmu`, aso), "forbidden");
  assert.equal(consoleRouteAccess(`${B}/dashboard/finance/js`, aso), "forbidden");

  const pmu = ROLES["pmu-field"];
  assert.equal(consoleRouteAccess(`${B}/dashboard/pd/us/all-applications`, pmu), "forbidden");
  assert.equal(consoleRouteAccess(`${B}/dashboard/sm2/pd/review/${APP}`, pmu), "forbidden");
  assert.equal(consoleRouteAccess(`${B}/finance/payment-status/${APP}`, pmu), "forbidden");

  const pd = ROLES["programme-director"];
  assert.equal(consoleRouteAccess(`${B}/dashboard/sm2/aso/review/${APP}`, pd), "forbidden");
});

test("an address that names no screen is not found, not a queue", () => {
  const aso = ROLES["pd-aso"];
  for (const path of [
    "/dashboard/pd/zzz",
    "/dashboard/pd/zzz/queries",
    "/dashboard/finance/zzz",
    "/dashboard/sm2/zzz",
    "/dashboard/sm2/js",
    "/dashboard/sm2/zzz/review/x",
    "/dashboard/pd/aso/sanctioned",
    "/dashboard/pd/aso/nonsense",
    "/dashboard/nowhere",
    "/finance/elsewhere",
  ]) {
    assert.equal(consoleRouteAccess(`${B}${path}`, aso), "not-found", path);
  }
});

test("each grade opens All Applications on its own path, and the new desks belong to their deciders", () => {
  // Verify bug 9: the ASO and SO sidebars pointed at the Under Secretary's path and their own answered 404.
  for (const g of ["aso", "so", "us", "ds", "js"] as const) {
    assert.equal(consoleRouteAccess(`${B}/dashboard/pd/${g}/all-applications`, ROLES[`pd-${g}`]), "allowed", g);
  }
  assert.equal(consoleRouteAccess(`${B}/dashboard/pd/so/all-applications`, ROLES["pd-aso"]), "forbidden");
  assert.equal(consoleRouteAccess(`${B}/dashboard/sm2/bank-changes`, ROLES["pd-js"]), "allowed");
  assert.equal(consoleRouteAccess(`${B}/dashboard/sm2/bank-changes`, ROLES["pd-ds"]), "forbidden");
  assert.equal(consoleRouteAccess(`${B}/dashboard/pmu/location-changes`, ROLES["pmu-field"]), "allowed");
  assert.equal(consoleRouteAccess(`${B}/dashboard/pmu/location-changes`, ROLES["pd-js"]), "forbidden");
  assert.equal(consoleRouteAccess(`${B}/dashboard/ir-repository`, ROLES["programme-director"]), "allowed");
  assert.equal(consoleRouteAccess(`${B}/dashboard/ir-repository`, ROLES["pmu-field"]), "allowed");
  assert.equal(consoleRouteAccess(`${B}/dashboard/ir-repository`, ROLES["pd-us"]), "forbidden");
  assert.equal(consoleRouteAccess(`${B}/dashboard/sent`, ROLES["programme-director"]), "allowed");
  assert.equal(consoleRouteAccess(`${B}/dashboard/pd/us/returned`, ROLES["pd-us"]), "allowed");
  assert.equal(consoleRouteAccess(`${B}/dashboard/finance/ds/returned`, ROLES["finance-ds"]), "allowed");
});

test("review keys match the shape the worklists link with", () => {
  assert.equal(reviewKeyOf(ROLES["pd-aso"]), "aso");
  assert.equal(reviewKeyOf(ROLES["pd-js"]), "jspd");
  assert.equal(reviewKeyOf(ROLES["finance-us"]), "ifdus");
  assert.equal(reviewKeyOf(ROLES["programme-director"]), "pd");
  assert.equal(reviewKeyOf(ROLES["pmu-field"]), null);
});

test("an NGO sees only its own applications, and another's reads as not found", () => {
  const state = { session: "ngo" as const, ngos: [{ id: "ngo-001" }, { id: "ngo-002" }] };
  const mine = { id: "A", ngoId: "ngo-001" };
  const theirs = { id: "B", ngoId: "ngo-002" };
  const ngoId = signedInNgoId(state);
  assert.equal(ngoId, "ngo-001");
  assert.equal(ownApplication(mine, ngoId), mine);
  assert.equal(ownApplication(theirs, ngoId), undefined);
  assert.equal(ownApplication(undefined, ngoId), undefined);
  // No NGO session: nothing is anyone's.
  assert.equal(signedInNgoId({ ...state, session: "pd-aso" as never }), undefined);
  assert.equal(ownApplication(mine, undefined), undefined);
});

test("one queue per seat: no sidebar carries a second copy of it, and the old address stays reachable", () => {
  // Audit O-04 (16 Sep 2026): the IFD sidebar listed "Finance Dashboard" and "My Worklist"
  // (`sm2/ifd<grade>`), two items drawing the same queue. `sm2/<key>` now redirects to the home.
  for (const role of ADMIN_ROLES) {
    const key = reviewKeyOf(role);
    if (!key || key === "pd") continue; // `sm2/pd` is the Programme Director's desk, a page of its own.
    const hrefs = role.nav.map((n) => n.href);
    assert.ok(!hrefs.includes(`${B}/dashboard/sm2/${key}`), `${role.id} still lists sm2/${key}`);
    assert.equal(hrefs.filter((h) => h === role.home).length, 1, `${role.id} lists its home once`);
    // Not a 403: the redirect page must render for the seat's own officer, so their link lands.
    assert.equal(consoleRouteAccess(`${B}/dashboard/sm2/${key}`, role), "allowed", `${role.id} sm2/${key}`);
  }
  for (const role of ADMIN_ROLES.filter((r) => r.division)) {
    const home = role.nav.find((n) => n.href === role.home);
    assert.equal(home?.label, "My Queue", `${role.id} home label`);
  }
});

test("no sidebar label abbreviates the Programme Division or the Programme Director", () => {
  // Audit O-08: "PD Queries" read as queries raised by the Programme Director.
  for (const role of ADMIN_ROLES) {
    for (const item of role.nav) assert.doesNotMatch(item.label, /\bPD\b/, `${role.id} · "${item.label}"`);
  }
  assert.equal(consoleRouteAccess(`${B}/dashboard/pd/so/queries`, ROLES["pd-so"]), "allowed");
});

test("a project's records open beside NGO 360 for every officer, and nothing deeper does", () => {
  const project = encodeURIComponent("SC/DL/NWD/02400");
  for (const role of ADMIN_ROLES) {
    assert.equal(consoleRouteAccess(`${B}/dashboard/ngo/ngo-001/project/${project}`, role), "allowed", role.id);
    assert.equal(consoleRouteAccess(`${B}/dashboard/ngo/ngo-001/project`, role), "not-found", role.id);
    assert.equal(consoleRouteAccess(`${B}/dashboard/ngo/ngo-001/project/${project}/edit`, role), "not-found", role.id);
  }
  assert.equal(consoleRouteAccess(`${B}/dashboard/ngo/ngo-001/project/${project}`, ROLES.ngo), "forbidden");
});
