// Run: node --test src/lib/e-anudaan/cctv.test.ts
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  CCTV_AREAS,
  EMPTY_CAMERA,
  EMPTY_UPTIME,
  RETENTION_MIN_DAYS,
  cctvCompliance,
  coverageOf,
  dueDeclarationMonth,
  privacyExclusionOf,
  seedCctvDetail,
  validateCamera,
  validateRecords,
  validateUptime,
  withDeclaration,
} from "./cctv.ts";
import type { CctvCamera, CctvSetup } from "./types.ts";

const now = new Date(2026, 8, 17, 12);
const base: CctvSetup = { projectId: "SC/DL/NWD/02400", cameras: 2, liveFeed: true, activationCode: "EANU-0000-0000", savedAt: "2026-04-22T06:19:00.000Z" };
const cam = (area: CctvCamera["area"], working = true, i = 0): CctvCamera => ({
  id: `c${area}${i}`, location: "Somewhere", area, placement: "Indoor", recording: "Continuous", nightVision: false, installedOn: "2026-04-01", working,
});
const goodCamera = { ...EMPTY_CAMERA, location: "Main gate", area: "entrance", placement: "Outdoor", recording: "Continuous", nightVision: "Yes", installedOn: "2026-04-01", working: "Working" } as const;

test("the privacy exclusions refuse toilets, bathrooms, dormitories and medical rooms, with the reason", () => {
  for (const [loc, label] of [
    ["Girls' washroom, first floor", "toilets"],
    ["Toilet block", "toilets"],
    ["Bathroom corridor end", "bathrooms"],
    ["Dormitory 2", "dormitory sleeping areas"],
    ["Sleeping hall", "dormitory sleeping areas"],
    ["Medical examination room", "medical examination rooms"],
    ["Sick bay", "medical examination rooms"],
  ] as const) {
    assert.equal(privacyExclusionOf(loc), label, loc);
    const r = validateCamera({ ...goodCamera, location: loc }, "x", now);
    assert.equal(r.ok, false);
    if (!r.ok) assert.match(r.errors.location!, new RegExp(`cannot be installed in ${label}`));
  }
  for (const loc of ["Main gate", "Ground-floor corridor", "Dining hall", "Kitchen", "Office and records room", "Rear boundary wall"]) {
    assert.equal(privacyExclusionOf(loc), undefined, loc);
  }
});

test("a camera needs every field, and cannot be installed in the future", () => {
  const empty = validateCamera(EMPTY_CAMERA, "x", now);
  assert.equal(empty.ok, false);
  if (!empty.ok) assert.deepEqual(Object.keys(empty.errors).sort(), ["area", "installedOn", "location", "nightVision", "placement", "recording", "working"]);
  const future = validateCamera({ ...goodCamera, installedOn: "2026-09-18" }, "x", now);
  assert.equal(future.ok, false);
  const ok = validateCamera(goodCamera, "cam-1", now);
  assert.ok(ok.ok);
  if (ok.ok) assert.deepEqual(ok.value, { id: "cam-1", location: "Main gate", area: "entrance", placement: "Outdoor", recording: "Continuous", nightVision: true, installedOn: "2026-04-01", working: true });
});

test("retention is held to the stated minimum", () => {
  const v = { retentionDays: "29", storageMedium: "Cloud Storage", capacityGb: "500", storageLocation: "Office" } as const;
  const short = validateRecords(v);
  assert.equal(short.ok, false);
  if (!short.ok) assert.match(short.errors.retentionDays!, /at least 30 days/);
  assert.ok(validateRecords({ ...v, retentionDays: String(RETENTION_MIN_DAYS) }).ok);
  const bad = validateRecords({ retentionDays: "30.5", storageMedium: "", capacityGb: "0", storageLocation: "" });
  assert.equal(bad.ok, false);
  if (!bad.ok) assert.deepEqual(Object.keys(bad.errors).sort(), ["capacityGb", "retentionDays", "storageLocation", "storageMedium"]);
});

test("coverage counts only working cameras", () => {
  const rows = coverageOf([cam("entrance"), cam("kitchen", false), cam("corridors", false, 1), cam("corridors", true, 2)]);
  assert.equal(rows.length, CCTV_AREAS.length);
  const by = Object.fromEntries(rows.map((r) => [r.id, r.status]));
  assert.equal(by.entrance, "covered");
  assert.equal(by.corridors, "covered");
  assert.equal(by.kitchen, "not-working");
  assert.equal(by.dining, "uncovered");
});

test("the declaration due moves on after the 7th of the month", () => {
  assert.equal(dueDeclarationMonth(new Date(2026, 8, 7)), "2026-07");
  assert.equal(dueDeclarationMonth(new Date(2026, 8, 8)), "2026-08");
  assert.equal(dueDeclarationMonth(new Date(2026, 0, 20)), "2025-12");
});

test("an uptime declaration: completed month, outages explain any shortfall, authorised and confirmed", () => {
  const e = validateUptime(EMPTY_UPTIME, now);
  assert.equal(e.ok, false);
  const current = validateUptime({ ...EMPTY_UPTIME, month: "2026-09", uptimePercent: "100", declaredBy: "A", designation: "B", confirmed: true }, now);
  assert.equal(current.ok, false);
  const shortfall = validateUptime({ ...EMPTY_UPTIME, month: "2026-08", uptimePercent: "96.5", declaredBy: "A", designation: "B", confirmed: true }, now);
  assert.equal(shortfall.ok, false);
  if (!shortfall.ok) assert.match(shortfall.errors.uptimePercent!, /outage/);
  const outside = validateUptime(
    { ...EMPTY_UPTIME, month: "2026-08", uptimePercent: "96.5", outages: [{ from: "2026-07-30", to: "2026-08-01", reason: "Power cut" }], declaredBy: "A", designation: "B", confirmed: true },
    now,
  );
  assert.equal(outside.ok, false);
  if (!outside.ok) assert.ok(outside.errors.outageErrors?.[0]?.from);
  const good = validateUptime(
    { ...EMPTY_UPTIME, month: "2026-08", uptimePercent: "96.5", outages: [{ from: "2026-08-10", to: "2026-08-11", reason: "Power cut" }], declaredBy: " Asha ", designation: "Warden", confirmed: true },
    now,
  );
  assert.ok(good.ok);
  if (good.ok) assert.equal(good.value.declaredBy, "Asha");
});

test("withDeclaration replaces a month and keeps newest first", () => {
  const d = (month: string, pct = 100) => ({ month, uptimePercent: pct, outages: [], declaredBy: "A", designation: "B", declaredAt: "x" });
  const list = withDeclaration(withDeclaration([d("2026-06")], d("2026-08")), d("2026-06", 99));
  assert.deepEqual(list.map((x) => [x.month, x.uptimePercent]), [["2026-08", 100], ["2026-06", 99]]);
});

test("compliance: every state reads from one expression", () => {
  assert.equal(cctvCompliance(undefined, now).status, "not-configured");
  assert.equal(cctvCompliance(base, now).status, "no-cameras");

  const compliant = cctvCompliance(seedCctvDetail(base, 0), now);
  assert.equal(compliant.status, "compliant", compliant.flags.join(" "));
  assert.equal(compliant.covered, 7);

  const partial = cctvCompliance(seedCctvDetail(base, 1), now);
  assert.equal(partial.status, "action-needed");
  assert.deepEqual(partial.gaps.map((g) => g.id), ["dining", "common", "kitchen"]);

  const noCert = cctvCompliance(seedCctvDetail(base, 2), now);
  assert.equal(noCert.certificate, "missing");
  assert.deepEqual(noCert.flags, ["Installation certificate not uploaded."]);

  const overdue = cctvCompliance(seedCctvDetail(base, 3), now);
  assert.equal(overdue.declarationOverdue, true);
  assert.equal(overdue.latestDeclaration?.month, "2026-06");
  assert.deepEqual(overdue.flags, ["Uptime declarations not filed for 2 months: July 2026, August 2026."]);

  const short = cctvCompliance(seedCctvDetail(base, 4), now);
  assert.equal(short.retention, "short");

  // A skipped month stays owed after a later month is filed.
  const compliantSetup = seedCctvDetail(base, 0);
  const skipped = cctvCompliance({ ...compliantSetup, uptime: (compliantSetup.uptime ?? []).filter((x) => x.month !== "2026-07") }, now);
  assert.equal(skipped.declarationOverdue, true);
  assert.deepEqual(skipped.missingMonths, ["2026-07"]);

  // A setup registered after the due month owes no declaration yet.
  const fresh = cctvCompliance({ ...seedCctvDetail(base, 0), savedAt: "2026-09-10T00:00:00.000Z", uptime: [] }, now);
  assert.equal(fresh.declarationOverdue, false);
});

test("the seeded register's camera count is the register's length", () => {
  const s = seedCctvDetail(base, 1);
  assert.equal(s.cameras, s.cameraRegister!.length);
});
