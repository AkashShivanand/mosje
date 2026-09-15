// The officer review and decision gaps closed against the live DECISION captures of 16 Sep 2026:
// Return to Previous on every grade above the ASO, fund release and the next instalment's opening,
// Show Cause Notices, online inspections, and the funding history the review prints.
//
// Run: npm test --prefix apps/hub

import { test } from "node:test";
import assert from "node:assert/strict";

import {
  applyAction,
  issueShowCauseNotice,
  openForClaim,
  permittedActions,
  releaseFunds,
  scheduleOnlineInspection,
  type Clock,
  type WorkflowAction,
} from "./workflow.ts";
import { ROLES } from "./roles.ts";
import { GRADES, type EAnudaanState, type Grade, type GrantApplication, type RoleId } from "./types.ts";
import { buildSeed, SEED_SCHEMES } from "./store/seed.ts";
import { returnedBy, queryRowsFor } from "./registers.ts";
import { instalmentSchedule, ngoSanctions, projectDisbursement, releasePatternFact } from "./funding.ts";
import { notificationTitle, notifiesApplicant } from "./applicant.ts";

let seq = 0;
const NOW = "2026-09-16T09:00:00.000Z";
const clock = (now = NOW): Clock => ({ now, id: (p) => `${p}-r${++seq}` });

function draft(id = "GIA/2026-27/SHRESHTA_M2/PUNE/09001"): GrantApplication {
  return {
    id,
    schemeCode: "SHRESHTA_M2",
    caseType: "New",
    ngoId: "ngo-001",
    institutionId: "SC/MH/PUN/09000",
    projectLabel: "Residential School — Pune · FY 2026-27",
    financialYear: "2026-27",
    status: "Draft",
    holder: { kind: "ngo" },
    scBeneficiaries: 100,
    otherBeneficiaries: 10,
    totalBeneficiaries: 110,
    recurring: 4_000_000,
    nonRecurring: 1_000_000,
    total: 5_000_000,
    documents: [],
    deficiencies: [],
    queries: [],
    showCauseNotices: [],
    audit: [],
    updatedAt: "2026-09-01T00:00:00.000Z",
    ageingDays: 0,
  };
}

function must(app: GrantApplication, role: RoleId, action: WorkflowAction, remarks = "ok"): GrantApplication {
  const res = applyAction(app, role, action, { remarks, certified: true }, clock());
  assert.ok(res.ok, `expected ${role} to ${action}, got: ${res.ok ? "" : res.error}`);
  return res.app;
}

/** Submit and climb until `division:grade` holds the file. */
function heldBy(division: "pd" | "finance", grade: Grade): GrantApplication {
  let app = must(draft(), "ngo", "submit");
  app = must(app, "pd-aso", "certify");
  for (const g of GRADES) {
    if (division === "pd" && g === grade) return app;
    app = must(app, `pd-${g}`, "forward");
  }
  for (const g of GRADES) {
    if (g === grade) return app;
    app = must(app, `finance-${g}`, "forward");
  }
  return app;
}

function sanctioned(): GrantApplication {
  let app = heldBy("finance", "js");
  app = must(app, "finance-js", "concur");
  return must(app, "programme-director", "sanction");
}

/* ── Return to Previous ───────────────────────────────────────────────────── */

test("every grade above the ASO, in both divisions, may Return to Previous; the ASOs may not", () => {
  for (const division of ["pd", "finance"] as const) {
    for (const grade of GRADES) {
      const role = ROLES[`${division}-${grade}`];
      const app = heldBy(division, grade);
      const back = permittedActions(app, role).find((r) => r.action === "raiseQuery");
      if (grade === "aso") {
        assert.equal(back, undefined, `${role.id} has no level below it to return to`);
        continue;
      }
      assert.ok(back, `${role.id} should be offered Return to Previous`);
      assert.equal(back!.label(role, app), "Return to Previous");
    }
  }
});

test("Return to Previous sends the file exactly one level down, and the officer below sends it back up", () => {
  for (const division of ["pd", "finance"] as const) {
    for (const grade of GRADES.slice(1)) {
      const roleId: RoleId = `${division}-${grade}`;
      const below = GRADES[GRADES.indexOf(grade) - 1]!;
      let app = heldBy(division, grade);
      app = must(app, roleId, "raiseQuery", `Returned by ${grade}: reconcile the beneficiary count.`);
      assert.deepEqual(app.holder, { kind: "chain", division, grade: below }, `${roleId} → ${below}`);
      assert.equal(app.status, "QueryRaised");
      assert.equal(app.queries.at(-1)?.returnedTo, below);
      assert.equal(app.audit.at(-1)?.action, "raiseQuery");

      // The officer below cannot forward past it; they answer and it climbs back to the sender.
      const belowRole = ROLES[`${division}-${below}`];
      const acts = permittedActions(app, belowRole).map((r) => r.action);
      assert.ok(!acts.includes("forward"));
      assert.ok(acts.includes("resolveQuery"));
      app = must(app, `${division}-${below}`, "resolveQuery", "Count reconciled.");
      assert.deepEqual(app.holder, { kind: "chain", division, grade });
    }
  }
});

test("Return to Previous is refused without a remark", () => {
  const app = heldBy("pd", "us");
  const res = applyAction(app, "pd-us", "raiseQuery", { remarks: "  " }, clock());
  assert.equal(res.ok, false);
});

test("a returned file is on the sender's Returned register and the receiver's open queries, and is named in words", () => {
  let app = heldBy("pd", "js");
  app = must(app, "pd-js", "raiseQuery", "Recheck the rent agreement.");
  const state = { ...buildSeed(), schemes: SEED_SCHEMES, version: 0, session: null, applications: [app] } as EAnudaanState;
  const sent = returnedBy(state, "pd-js");
  assert.equal(sent.length, 1);
  assert.equal(sent[0]!.reason, "Recheck the rent agreement.");
  assert.equal(sent[0]!.returnedTo, "the Deputy Secretary, Programme Division");
  assert.equal(sent[0]!.responded, false);
  const open = queryRowsFor(state, "pd-ds").filter((r) => r.open);
  assert.equal(open.length, 1);
  assert.ok(open[0]!.canRespond);
  assert.equal(notificationTitle("raiseQuery"), "Returned to Previous Level");
  assert.equal(notifiesApplicant("raiseQuery"), false, "an internal return is not the applicant's business");
});

test("the SO's noted-deficiency return keeps its own wording", () => {
  let app = must(draft(), "ngo", "submit");
  app = { ...app, documents: [{ id: "d1", slot: 1, title: "Audited Accounts", group: "annual", fileName: "a.pdf", reviewStatus: "Deficient", officerRemarks: "Illegible" }] };
  const res = applyAction(app, "pd-aso", "raiseDeficiency", { remarks: "See items", items: [{ kind: "document", docId: "d1", label: "Audited Accounts", remark: "Illegible" }] }, clock());
  assert.ok(res.ok);
  const back = permittedActions(res.app, ROLES["pd-so"]).find((r) => r.action === "raiseQuery");
  assert.equal(back?.label(ROLES["pd-so"], res.app), "Return to the Assistant Section Officer Without Sending");
});

/* ── Fund release and the next instalment ─────────────────────────────────── */

test("only the PD Under Secretary releases funds, once, and only against a sanction", () => {
  const app = sanctioned();
  assert.equal(releaseFunds(app, "pd-so", clock()).ok, false);
  assert.equal(releaseFunds(app, "programme-director", clock()).ok, false);
  assert.equal(releaseFunds(heldBy("pd", "us"), "pd-us", clock()).ok, false, "nothing sanctioned yet");

  const res = releaseFunds(app, "pd-us", clock());
  assert.ok(res.ok);
  assert.equal(res.app.status, "Released");
  assert.equal(res.app.release?.amount, app.sanction!.total);
  assert.equal(res.app.audit.at(-1)?.action, "releaseFunds");
  assert.deepEqual(res.app.holder, app.holder, "a release does not move the file");
  assert.equal(releaseFunds(res.app, "pd-us", clock()).ok, false, "never released twice");
  assert.ok(notifiesApplicant("releaseFunds"));
});

test("the next instalment opens for claim only after a release", () => {
  const app = sanctioned();
  assert.equal(openForClaim(app, "pd-us", "2nd Instalment", clock()).ok, false);
  const released = releaseFunds(app, "pd-us", clock());
  assert.ok(released.ok);
  assert.equal(openForClaim(released.app, "pd-ds", "2nd Instalment", clock()).ok, false);
  const opened = openForClaim(released.app, "pd-us", "2nd Instalment", clock());
  assert.ok(opened.ok);
  assert.ok(opened.app.claimOpenedAt);
  assert.equal(opened.app.audit.at(-1)?.action, "openClaim");
  assert.equal(openForClaim(opened.app, "pd-us", "2nd Instalment", clock()).ok, false);
  assert.ok(notifiesApplicant("openClaim"));
});

/* ── The schedule the review and Payment Status print ─────────────────────── */

const STATE = (): EAnudaanState => ({ version: 0, session: "pd-us", schemes: SEED_SCHEMES, ...buildSeed() });
/**
 * The seed releases its demo instalments so the next one is open to claim (instalments.ts gates a
 * claim on the previous release). These tests start from a year nothing has been released in.
 */
const UNRELEASED = (ids: readonly string[]): EAnudaanState => {
  const s = STATE();
  return { ...s, applications: s.applications.map((a) => (ids.includes(a.id) ? { ...a, release: undefined, claimOpenedAt: undefined, status: "Sanctioned" as const } : a)) };
};
const DL_YEAR = ["GIA/2026-27/AVYAY/NORTH_WEST_DELHI/03613", "GIA/2026-27/AVYAY/NORTH_WEST_DELHI/03613/I2", "GIA/2025-26/AVYAY/NORTH_WEST_DELHI/03612"];
const SEP16 = new Date(2026, 8, 16);

test("an AVYAY year follows 40-40-20: release the 1st, open the 2nd, and the 3rd waits", () => {
  let state = UNRELEASED(DL_YEAR);
  const first = state.applications.find((a) => a.id === "GIA/2026-27/AVYAY/NORTH_WEST_DELHI/03613")!;
  const second = state.applications.find((a) => a.id === "GIA/2026-27/AVYAY/NORTH_WEST_DELHI/03613/I2")!;
  let s = instalmentSchedule(state, second, SEP16)!;
  assert.deepEqual(s.pattern, [40, 40, 20]);
  assert.equal(releasePatternFact(s.pattern), "The recurring grant is released in three instalments: 40%, 40%, 20%.");
  assert.deepEqual(s.rows.map((r) => r.state), ["to-release", "to-release", "not-opened"]);
  assert.deepEqual(s.rows.map((r) => r.planned), [1587305, 1587305, 793653]);
  assert.equal(s.releasedSoFar, 0);

  const put = (a: GrantApplication) => (state = { ...state, applications: state.applications.map((x) => (x.id === a.id ? a : x)) });
  const r1 = releaseFunds(first, "pd-us", clock());
  const r2 = releaseFunds(second, "pd-us", clock());
  assert.ok(r1.ok && r2.ok);
  put(r1.app);
  put(r2.app);
  s = instalmentSchedule(state, r2.app, SEP16)!;
  assert.deepEqual(s.rows.map((r) => r.state), ["released", "released", "can-open"]);
  assert.equal(s.releasedSoFar, first.sanction!.total + second.sanction!.total);
  assert.equal(s.rows[2]!.openedFrom?.id, second.id, "the 3rd is opened from the released 2nd");

  const opened = openForClaim(r2.app, "pd-us", s.rows[2]!.label, clock());
  assert.ok(opened.ok);
  put(opened.app);
  assert.equal(instalmentSchedule(state, opened.app, SEP16)!.rows[2]!.state, "open");
});

test("SMILE releases in two halves", () => {
  const state = STATE();
  const app: GrantApplication = { ...draft("GIA/2026-27/SMILE/X/1"), schemeCode: "SMILE", caseType: "Ongoing", instalment: 1, status: "Sanctioned", holder: { kind: "done" }, sanction: { orderNo: "SAN/2026-27/1", sanctionedAt: NOW, recurring: 500_000, nonRecurring: 0, total: 500_000, sanctionedBy: "programme-director" } };
  const s = instalmentSchedule({ ...state, applications: [app] }, app, SEP16)!;
  assert.deepEqual(s.pattern, [50, 50]);
  assert.equal(s.rows.length, 2);
  assert.equal(s.rows[0]!.planned, 500_000);
  assert.equal(releasePatternFact(s.pattern), "The recurring grant is released in two instalments: 50%, 50%.");
});

test("funding history: the NGO's prior orders exclude the file under review, and the project shows released beside sanctioned", () => {
  const state = UNRELEASED(DL_YEAR);
  const app = state.applications.find((a) => a.id === "GIA/2026-27/AVYAY/NORTH_WEST_DELHI/03613/I2")!;
  const ngo = ngoSanctions(state, app.ngoId, app.id);
  assert.ok(ngo.rows.length > 0);
  assert.ok(ngo.rows.every((r) => r.app.id !== app.id && r.app.ngoId === app.ngoId));
  assert.equal(ngo.total, ngo.rows.reduce((s, r) => s + r.amount, 0));
  assert.ok(ngo.rows.every((r, i) => i === 0 || ngo.rows[i - 1]!.sanctionedAt >= r.sanctionedAt), "newest first");

  const before = projectDisbursement(state, app.institutionId);
  assert.equal(before.rows.length, 3);
  assert.equal(before.totalReleased, 0);
  const released = releaseFunds(app, "pd-us", clock());
  assert.ok(released.ok);
  const after = projectDisbursement({ applications: state.applications.map((a) => (a.id === app.id ? released.app : a)) }, app.institutionId);
  assert.equal(after.totalSanctioned, before.totalSanctioned);
  assert.equal(after.totalReleased, app.sanction!.total);
  assert.equal(after.rows.find((r) => r.app.id === app.id)?.released, app.sanction!.total);
});

/* ── Show Cause Notices and online inspections ────────────────────────────── */

test("a Show Cause Notice is issued by the PD SO or JS, with grounds, and leaves the file where it is", () => {
  const app = heldBy("pd", "so");
  assert.equal(issueShowCauseNotice(app, "pd-us", { grounds: "x" }, clock()).ok, false);
  assert.equal(issueShowCauseNotice(app, "pd-so", { grounds: "   " }, clock()).ok, false);
  assert.equal(issueShowCauseNotice(app, "pd-so", { grounds: "Late UC", respondBy: "2026-09-01" }, clock()).ok, false, "a deadline in the past");
  const res = issueShowCauseNotice(app, "pd-js", { grounds: "Utilisation certificate for 2025-26 not filed.", respondBy: "2026-10-01" }, clock());
  assert.ok(res.ok);
  assert.equal(res.app.showCauseNotices.length, 1);
  assert.equal(res.app.showCauseNotices[0]!.respondBy, "2026-10-01");
  assert.equal(res.app.showCauseNotices[0]!.respondByDays, 15);
  assert.deepEqual(res.app.holder, app.holder);
  assert.equal(res.app.audit.at(-1)?.action, "showCauseIssued");
  assert.ok(notifiesApplicant("showCauseIssued"));
});

test("an online inspection is scheduled from the review by grades that hold the capability, with a valid window", () => {
  const app = heldBy("finance", "us");
  const input = { title: "Online inspection — Pune school", startsAt: "2026-09-20T05:30:00.000Z", endsAt: "2026-09-20T06:30:00.000Z" };
  assert.equal(scheduleOnlineInspection(app, "pd-aso", input, [], clock()).ok, false, "the PD ASO does not schedule");
  assert.equal(scheduleOnlineInspection(app, "finance-us", { ...input, title: "" }, [], clock()).ok, false);
  assert.equal(scheduleOnlineInspection(app, "finance-us", { ...input, endsAt: input.startsAt }, [], clock()).ok, false);
  assert.equal(scheduleOnlineInspection(app, "finance-us", { ...input, startsAt: "2026-09-10T05:30:00.000Z" }, [], clock()).ok, false, "not in the past");

  const res = scheduleOnlineInspection(app, "finance-us", input, [], clock());
  assert.ok(res.ok);
  assert.equal(res.inspection.visitType, "Online");
  assert.equal(res.inspection.status, "Scheduled");
  assert.equal(res.inspection.scheduledBy, "finance-us");
  assert.equal(res.app.audit.at(-1)?.action, "inspectionScheduled");
  assert.equal(scheduleOnlineInspection(res.app, "pd-us", input, [res.inspection], clock()).ok, false, "one online inspection at a time");
  for (const id of ["pd-so", "pd-us", "pd-ds", "pd-js", "programme-director"] as RoleId[]) {
    assert.ok(ROLES[id].caps.includes("scheduleInspection"), `${id} schedules online inspections`);
  }
});
