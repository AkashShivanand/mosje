// Officer console — the words and counts the screen QA of 13 Sep 2026 found wrong.
//
// Every assertion here failed before its fix: raw enum values reached officers
// ("FinanceConcurred / PD", "communicateDeficiency", "SHRESHTA_M2", "ord-01110"), a dashboard
// figure and the list it summarises came from two expressions, and each division's Rejected
// register listed the other division's decisions.
//
// Run: npm test --prefix apps/hub

import { test } from "node:test";
import assert from "node:assert/strict";

import { ACTION_LABEL, STATUS_LABEL, auditActionLabel, docReviewerLine, holderLabel, statusLabel } from "./workflow.ts";
import { divisionOfRole, queriesFor, rejectedFor, rejectionOf, schemeLabel } from "./selectors.ts";
import { inspectionActionFor, officerDashboard, recordInspection, scheduleInspection } from "./officer.ts";
import { OFFICER_ROLES, ROLES } from "./roles.ts";
import { buildSeed } from "./store/seed.ts";
import type { AppStatus, AuditAction, EAnudaanState } from "./types.ts";

const seed = buildSeed();
const state = { ...seed, version: 0, session: null, schemes: [] } as unknown as EAnudaanState;

/** A camelCase or PascalCase-joined word, or a snake_case key — what a stored code looks like. */
const RAW = /[a-z][A-Z]|_/;

test("no status label is a stored code", () => {
  const statuses = Object.keys(STATUS_LABEL) as AppStatus[];
  for (const s of statuses) assert.ok(!RAW.test(STATUS_LABEL[s]), `${s} → ${STATUS_LABEL[s]}`);
  for (const a of seed.applications) {
    const label = statusLabel(a);
    assert.ok(!RAW.test(label) && !label.includes(" / "), `${a.id}: ${label}`);
  }
});

test("the compound label keeps the seat holding the file, in words", () => {
  assert.equal(statusLabel({ status: "Submitted", holder: { kind: "chain", division: "pd", grade: "aso" } }), "Received · With the Assistant Section Officer");
  assert.equal(statusLabel({ status: "FinanceConcurred", holder: { kind: "pd" } }), "Concurred by Finance · With the Programme Director");
  assert.equal(statusLabel({ status: "Rejected", holder: { kind: "done" } }), "Rejected");
});

test("the seat holding a file is named by the grade's full title, never its acronym", () => {
  assert.equal(holderLabel({ kind: "chain", division: "pd", grade: "us" }), "With the Under Secretary");
  assert.equal(holderLabel({ kind: "chain", division: "pd", grade: "js" }), "With the Joint Secretary");
  assert.equal(holderLabel({ kind: "chain", division: "finance", grade: "ds" }), "With the Deputy Secretary, Integrated Finance");
  for (const a of seed.applications) assert.ok(!/With (IFD-)?[A-Z]{2,3}\b/.test(statusLabel(a)), `${a.id}: ${statusLabel(a)}`);
});

test("each document verdict names who gave it and when, and only when that was recorded", () => {
  const at = "2026-09-12T09:30:00.000Z";
  assert.equal(docReviewerLine({ reviewStatus: "Verified", reviewedBy: "pd-aso", reviewedAt: at }), "by the Assistant Section Officer, 12 Sep 2026");
  assert.equal(docReviewerLine({ reviewStatus: "Deficient", reviewedBy: "finance-so", reviewedAt: at }), "by the Section Officer, Integrated Finance Division, 12 Sep 2026");
  assert.equal(docReviewerLine({ reviewStatus: "Verified", reviewedBy: "programme-director", reviewedAt: at }), "by the Programme Director, 12 Sep 2026");
  assert.equal(docReviewerLine({ reviewStatus: "Verified" }), null, "a verdict saved without attribution falls back to the certification line");
  assert.equal(docReviewerLine({ reviewStatus: "Pending", reviewedBy: "pd-aso", reviewedAt: at }), null);
});

test("no audit action label is a stored key", () => {
  for (const a of Object.keys(ACTION_LABEL) as AuditAction[]) {
    assert.ok(!RAW.test(auditActionLabel(a)), `${a} → ${auditActionLabel(a)}`);
    assert.notEqual(auditActionLabel(a), a);
  }
});

test("scheme codes read as the scheme's short name", () => {
  assert.equal(schemeLabel("SHRESHTA_M2"), "SHRESHTA Mode 2");
  assert.equal(schemeLabel("NAPDDR"), "NAPDDR");
  for (const a of seed.applications) assert.ok(!RAW.test(schemeLabel(a.schemeCode)), a.schemeCode);
});

test("sanction order numbers are register numbers, not internal ids", () => {
  const sanctioned = seed.applications.filter((a) => a.sanction);
  assert.ok(sanctioned.length > 0);
  for (const a of sanctioned) assert.match(a.sanction!.orderNo, /^SAN\/\d{4}-\d{2}\/\d{5,}$/, a.id);
});

test("the dashboard's Returned for Rework figure is the Queries list's length, for every officer", () => {
  for (const role of OFFICER_ROLES) {
    const tile = officerDashboard(state, role.id, "").movement.find((m) => m.key === "rework")!;
    assert.equal(tile.count, queriesFor(state, role.id).length, role.id);
  }
  // The two cases the QA found: a PD return sits with PD:ASO; a query raised by PD:US is on
  // PD:US's list as well as on the list of the SO it was sent to.
  assert.ok(queriesFor(state, "pd-aso").length > 0, "PD:ASO holds files returned by the Programme Director");
  assert.ok(queriesFor(state, "pd-us").length > 0, "PD:US raised open queries");
  assert.deepEqual(
    queriesFor(state, "pd-us").map((a) => a.id).sort(),
    queriesFor(state, "pd-so").filter((a) => a.status === "QueryRaised").map((a) => a.id).sort(),
  );
});

test("each division's Rejected register holds only that division's decisions", () => {
  const pd = rejectedFor(state, "pd");
  const fin = rejectedFor(state, "finance");
  assert.ok(pd.length > 0, "the seed carries Programme Division rejections");
  assert.equal(pd.filter((a) => fin.includes(a)).length, 0, "no file is on both registers");
  for (const a of pd) assert.equal(divisionOfRole(rejectionOf(a)!.byRole), "pd", a.id);
  for (const a of fin) assert.equal(divisionOfRole(rejectionOf(a)!.byRole), "finance", a.id);
  assert.ok(pd.every((a) => a.status === "Rejected"), "a returned file is rework, not a rejection");
});

test("a PMU inspection offers the next step its state allows", () => {
  const base = seed.inspections.find((i) => i.status === "Pending")!;
  assert.equal(inspectionActionFor(base), "schedule");
  const scheduled = scheduleInspection(base, "2026-09-20", "Physical");
  assert.equal(scheduled.status, "Scheduled");
  assert.equal(inspectionActionFor(scheduled), "inspect");
  const done = recordInspection(scheduled, { findings: "Hostel in use.", recommendation: "Satisfactory" }, "2026-09-20T10:00:00.000Z");
  assert.equal(inspectionActionFor(done), "view");
  assert.throws(() => recordInspection(base, { findings: "x", recommendation: "Satisfactory" }, "now"));
  assert.equal(ROLES["pmu-field"].caps.includes("inspect"), true);
});
