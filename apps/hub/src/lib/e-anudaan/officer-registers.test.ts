// The officer registers and receiving desks added after the parity inventory of 16 Sep 2026:
// every workflow an NGO starts has an officer who finishes it, and no register is a dead end.
//
// Run: node --test src/lib/e-anudaan/officer-registers.test.ts

import { test } from "node:test";
import assert from "node:assert/strict";

import { buildSeed, SEED_SCHEMES } from "./store/seed.ts";
import { applyAction, type Clock } from "./workflow.ts";
import { queriesFor, worklistFor } from "./selectors.ts";
import { OFFICER_ROLES, ROLES } from "./roles.ts";
import type { BankChangeRequest, EAnudaanState, LocationChangeRequest } from "./types.ts";
import {
  bankChangeQueue,
  currentAddressOf,
  decideChangeRequest,
  locationChangeQueue,
  locationCheckFor,
  requestRaisedNotice,
} from "./change-requests.ts";
import { addressFromPosition, checkLocation } from "./district-centres.ts";
import {
  awaitingInspection,
  explorerTiles,
  institutionRegister,
  matchesExplorerStatus,
  officerApplications,
  queryRowsFor,
  returnedBy,
  sentBy,
  sentByState,
  ucDue,
} from "./registers.ts";
import { REPORTS, reportCsv } from "./reports.ts";
import { notificationItems } from "./notifications.ts";

function state(): EAnudaanState {
  const seed = buildSeed();
  return { version: 9, session: null, schemes: SEED_SCHEMES, ...seed };
}

let n = 0;
const clock = (now = "2026-09-16T10:00:00.000Z"): Clock => ({ now, id: (p) => `${p}-t-${++n}` });

/* ── Bank account changes ─────────────────────────────────────────────────── */

test("approving a bank change makes the new account current and keeps the old one on record, and tells the NGO", () => {
  const s = state();
  const req = bankChangeQueue(s, "Pending")[0]!;
  assert.ok(req, "the seed carries a pending bank change");
  const before = s.projectAccounts.filter((a) => a.projectId === req.projectId);
  const oldCurrent = before.find((a) => !a.activeTo)!;

  const res = decideChangeRequest(s, req.id, "approve", "Bank's merger letter verified.", "pd-js", clock());
  assert.ok(res.ok);
  const after = res.state.projectAccounts.filter((a) => a.projectId === req.projectId);
  const current = after.filter((a) => !a.activeTo);
  assert.equal(current.length, 1, "exactly one current account");
  assert.equal(current[0]!.last4, req.last4);
  assert.equal(current[0]!.ifsc, req.ifsc);
  assert.equal(after.length, before.length + 1, "nothing deleted");
  assert.equal(after.find((a) => a.id === oldCurrent.id)!.activeTo, "2026-09-16T10:00:00.000Z");

  const decided = res.state.changeRequests.find((r) => r.id === req.id)!;
  assert.equal(decided.status, "Approved");
  assert.equal(decided.decisionRemarks, "Bank's merger letter verified.");
  assert.equal(bankChangeQueue(res.state, "Pending").length, bankChangeQueue(s, "Pending").length - 1);

  const notice = notificationItems(res.state, "ngo").find((i) => i.action === "Bank Account Change Approved");
  assert.ok(notice, "the NGO is notified");
  assert.equal(notice.href, "/portals/e-anudaan/ngo/bank-accounts");
});

test("rejecting a bank change leaves the accounts alone; only the Joint Secretary decides, with remarks, once", () => {
  const s = state();
  const req = bankChangeQueue(s, "Pending")[0]!;
  assert.equal(decideChangeRequest(s, req.id, "reject", "Reason", "pd-ds", clock()).ok, false, "PD:DS cannot");
  assert.equal(decideChangeRequest(s, req.id, "reject", "  ", "pd-js", clock()).ok, false, "remarks required");
  const res = decideChangeRequest(s, req.id, "reject", "The cancelled cheque is not legible.", "pd-js", clock());
  assert.ok(res.ok);
  assert.deepEqual(res.state.projectAccounts, s.projectAccounts);
  assert.equal(res.state.changeRequests.find((r) => r.id === req.id)!.status, "Rejected");
  assert.equal(decideChangeRequest(res.state, req.id, "approve", "Again", "pd-js", clock()).ok, false, "already decided");
});

test("a new request notifies the desk that decides it", () => {
  const bank = requestRaisedNotice({ id: "r1", kind: "bank", projectId: "P", submittedAt: "x", status: "Pending", reason: "Branch closed.", bank: "B", branch: "b", last4: "1234", ifsc: "SBIN0001234", pfmsRegistered: true });
  assert.deepEqual(bank.audience, ["pd-js"]);
  assert.equal(bank.href, "/portals/e-anudaan/dashboard/sm2/bank-changes");
  const loc = requestRaisedNotice({ id: "r2", kind: "location", projectId: "P", submittedAt: "x", status: "Pending", reason: "Lease ended", address: "A" });
  assert.deepEqual(loc.audience, ["pmu-field"]);
});

/* ── Location changes ─────────────────────────────────────────────────────── */

test("verifying a location change moves the project's address; returning it does not", () => {
  const s = state();
  const req = locationChangeQueue(s, "Pending")[0]!;
  const was = currentAddressOf(s, req.projectId);
  assert.notEqual(was, req.address);

  const returned = decideChangeRequest(s, req.id, "reject", "Attach the new lease.", "pmu-field", clock());
  assert.ok(returned.ok);
  assert.equal(returned.state.changeRequests.find((r) => r.id === req.id)!.status, "Returned");
  assert.equal(currentAddressOf(returned.state, req.projectId), was);

  const verified = decideChangeRequest(s, req.id, "approve", "Premises seen.", "pmu-field", clock());
  assert.ok(verified.ok);
  assert.equal(currentAddressOf(verified.state, req.projectId), req.address);
  assert.ok(notificationItems(verified.state, "ngo").some((i) => i.action === "Project Location Change Approved"));
  assert.equal(decideChangeRequest(s, req.id, "approve", "x", "pd-js", clock()).ok, false, "only the PMU verifies");
});

test("a position far outside the project's district is flagged — Pune for a Delhi project", () => {
  const delhi = { state: "Delhi", district: "North West Delhi" };
  const pune = checkLocation(delhi, { latitude: 18.5314, longitude: 73.8446 });
  assert.equal(pune.kind, "far");
  if (pune.kind === "far") {
    assert.ok(pune.km > 1000, `${pune.km} km`);
    assert.equal(pune.nearest?.district, "Pune");
  }
  assert.equal(checkLocation(delhi, { latitude: 28.72, longitude: 77.08 }).kind, "within");
  assert.equal(checkLocation(delhi, {}).kind, "no-position");
  assert.equal(checkLocation({ state: "Kerala", district: "Idukki" }, { latitude: 9.8, longitude: 76.9 }).kind, "unchecked");

  // The seeded Ahmedabad request was recorded at Naroda, inside its district.
  const s = state();
  const seeded = s.changeRequests.find((r): r is LocationChangeRequest => r.kind === "location" && r.status === "Pending" && r.latitude !== undefined)!;
  assert.equal(locationCheckFor(s, seeded).kind, "within");
});

test("Use Current Location fills the district's locality line only inside the project's district", () => {
  const delhi = { state: "Delhi", district: "North West Delhi" };
  assert.equal(addressFromPosition(delhi, 28.72, 77.08), "Kanjhawala, North West Delhi, Delhi 110081");
  assert.equal(addressFromPosition(delhi, 18.52, 73.85), undefined);
  assert.equal(addressFromPosition({ state: "Maharashtra", district: "Pune" }, 18.52, 73.85), "Pune, Maharashtra 411001");
});

/* ── All Applications ─────────────────────────────────────────────────────── */

test("officer lists never hold a draft, and the explorer's tiles add up to its register", () => {
  const s = state();
  const rows = officerApplications(s);
  assert.ok(rows.length > 0 && rows.length < s.applications.length);
  assert.ok(rows.every((a) => a.status !== "Draft"));
  const t = explorerTiles(rows);
  const rejected = rows.filter((a) => matchesExplorerStatus(a, "rejected", null)).length;
  assert.equal(t.progress + t.sanctioned + t.returned + rejected, t.total);
  for (const role of OFFICER_ROLES) {
    assert.equal(
      rows.filter((a) => matchesExplorerStatus(a, "mine", role.id)).length,
      worklistFor(s, role.id).length,
      `${role.id}: "Needs My Action" is the officer's own worklist`,
    );
  }
});

/* ── Returned and Queries ─────────────────────────────────────────────────── */

test("the Returned register lists files an officer sent back, and says when they were answered", () => {
  const s = state();
  const us = returnedBy(s, "pd-us");
  assert.ok(us.length >= 2, "PD:US queried two seeded files");
  assert.ok(us.every((r) => r.entry.byRole === "pd-us" && r.reason && r.returnedTo.startsWith("the Section Officer")));
  assert.ok(us.some((r) => !r.responded));
  assert.ok(returnedBy(s, "pd-so").length > 0, "the SO sent deficiencies to NGOs");
  assert.ok(returnedBy(s, "programme-director").length > 0, "the Programme Director returned files");
  // Rejections are not returns.
  assert.ok(returnedBy(s, "pd-us").every((r) => r.app.status !== "Rejected" || r.entry.action !== "reject"));

  const open = us.find((r) => !r.responded)!;
  const so = ROLES["pd-so"];
  const resolved = applyAction(open.app, so.id, "resolveQuery", { remarks: "Re-examined; figures corrected." }, clock());
  assert.ok(resolved.ok);
  const next = { ...s, applications: s.applications.map((a) => (a.id === open.app.id ? resolved.app : a)) };
  assert.equal(returnedBy(next, "pd-us").find((r) => r.app.id === open.app.id)!.responded, true);
});

test("the Queries page's open rows are the dashboard's Returned for Rework files, for every officer", () => {
  const s = state();
  for (const role of [...OFFICER_ROLES, ROLES["programme-director"]]) {
    const open = queryRowsFor(s, role.id).filter((r) => r.open);
    assert.deepEqual(open.map((r) => r.app.id).sort(), queriesFor(s, role.id).map((a) => a.id).sort(), role.id);
    assert.ok(open.every((r) => r.query.detail.trim()), `${role.id}: every open row carries the query text`);
  }
  const so = queryRowsFor(s, "pd-so").filter((r) => r.canRespond);
  assert.ok(so.length > 0, "the SO can respond to the queries sent down to it");
  const row = so[0]!;
  const res = applyAction(row.app, "pd-so", "resolveQuery", { remarks: "Answered." }, clock());
  assert.ok(res.ok);
  const next = { ...s, applications: s.applications.map((a) => (a.id === row.app.id ? res.app : a)) };
  const after = queryRowsFor(next, "pd-so").find((r) => r.app.id === row.app.id && r.query.id === row.query.id)!;
  assert.equal(after.open, false, "the answered query moves to Responded");
});

/* ── Programme Director, PMU ──────────────────────────────────────────────── */

test("the Programme Director's Sent files carry their movement, ageing and State", () => {
  const s = state();
  const rows = sentBy(s, "programme-director", Date.parse("2026-09-16T00:00:00Z"));
  assert.ok(rows.length > 0);
  assert.ok(rows.every((r) => ["sanction", "return", "reject"].includes(r.entry.action) && r.days >= 0 && r.place));
  const byState = sentByState(rows);
  assert.equal(byState.reduce((n2, x) => n2 + x.sent, 0), rows.length);
});

test("PMU: Awaiting Inspection holds sanctioned files with no inspection; Institutions put the never-visited first", () => {
  const s = state();
  const waiting = awaitingInspection(s);
  const inspected = new Set(s.inspections.map((i) => i.applicationId));
  assert.ok(waiting.length > 0);
  assert.ok(waiting.every((a) => a.sanction && !inspected.has(a.id)));
  const reg = institutionRegister(s);
  assert.equal(reg.length, s.ngos.reduce((k, x) => k + x.institutions.length, 0));
  const firstVisited = reg.findIndex((r) => r.lastVisited);
  if (firstVisited >= 0) assert.ok(reg.slice(firstVisited).every((r) => r.lastVisited), "never-visited rows all come first");
});

/* ── Reports ─────────────────────────────────────────────────────────────── */

test("all nine reports build, filter by scheme and export the rows they show", () => {
  const s = state();
  const now = new Date("2026-09-16T00:00:00Z");
  assert.equal(REPORTS.length, 9);
  for (const r of REPORTS) {
    const rows = r.rows(s, { scheme: "", fy: "", ngo: "" }, now);
    assert.ok(Array.isArray(rows), r.id);
    const csv = reportCsv(r, rows).split("\n");
    assert.equal(csv[0], r.columns.map((c) => c.header).join(","), r.id);
    assert.equal(csv.length, rows.length + 1, r.id);
    assert.ok(!/RP-SM2/.test(csv.join("\n")), `${r.id}: no requirement codes`);
    // A reference number carries the scheme code by design; a scheme or text column never does.
    const plain = r.columns.filter((c) => c.kind !== "reference").map((c) => c.key);
    assert.ok(rows.every((row) => plain.every((k) => !/SHRESHTA_M2/.test(String(row[k] ?? "")))), `${r.id}: no stored scheme codes`);
  }
  const sanction = REPORTS.find((r) => r.id === "sanction-status")!;
  assert.equal(sanction.rows(s, { scheme: "", fy: "", ngo: "" }, now).length, officerApplications(s).filter((a) => a.sanction).length);
  const avyay = sanction.rows(s, { scheme: "AVYAY", fy: "", ngo: "" }, now);
  assert.ok(avyay.every((row) => String(row.scheme).startsWith("AVYAY")));
});

/* ── Utilisation certificates ─────────────────────────────────────────────── */

test("a utilisation certificate is due on last year's latest sanction, and clears once filed", () => {
  const s = state();
  const now = new Date("2026-09-16T00:00:00Z");
  const due = ucDue(s, s.ngos[0]!.id, now);
  assert.ok(due.length > 0);
  assert.ok(due.every((a) => a.financialYear === "2025-26" && a.sanction));
  const items = notificationItems(s, "ngo").filter((i) => i.id.startsWith("uc-"));
  assert.ok(items.every((i) => i.actionRequired && i.href?.endsWith("/uc")));
  const filed = {
    ...s,
    applications: s.applications.map((a) =>
      a.id === due[0]!.id ? { ...a, utilisation: { filedAt: now.toISOString(), amountUtilised: 1, remarks: "r", documentName: "uc.pdf" } } : a,
    ),
  };
  assert.equal(ucDue(filed, s.ngos[0]!.id, now).length, due.length - 1);
});

test("a pending bank change on the seed is the NGO's own, so the approval reaches its page", () => {
  const s = state();
  const req = s.changeRequests.find((r): r is BankChangeRequest => r.kind === "bank")!;
  assert.ok(s.ngos[0]!.institutions.some((i) => i.id === req.projectId));
});

/* ── The dashboard's figures open the lists they count (audit O-03) ────────── */

test("each register-wide dashboard figure equals the list it opens, in every year", async () => {
  const { officerDashboard, explorerView, DEFAULT_EXPLORER_FILTERS } = await import("./officer.ts");
  const { forwardedFor } = await import("./selectors.ts");
  const s = state();
  const years = ["", ...new Set(s.applications.map((a) => a.financialYear))];
  for (const role of OFFICER_ROLES.filter((r) => r.division === "pd")) {
    for (const fy of years) {
      const dash = officerDashboard(s, role.id, fy);
      const figure = (k: string) => dash.movement.find((m) => m.key === k)!.count;
      const opened = (status: "deficiency" | "corrected") =>
        explorerView(s, role.id, { ...DEFAULT_EXPLORER_FILTERS, status, financialYear: fy }).rows.length;
      assert.equal(opened("deficiency"), figure("deficiency"), `${role.id} ${fy}: Deficiencies Raised`);
      assert.equal(opened("corrected"), figure("resolved"), `${role.id} ${fy}: Deficiencies Resolved`);
      assert.equal(
        forwardedFor(s, role.id).filter((a) => !fy || a.financialYear === fy).length,
        figure("forwarded"),
        `${role.id} ${fy}: Forwarded by You`,
      );
    }
  }
});
