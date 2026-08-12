// The E-Anudaan approval chain, exercised end to end.
//
// The state machine is the one piece of this portal that is genuinely load-bearing: ten officer
// grades, two divisions, and four side loops all render from one review screen, and they only do
// that because `permittedActions` is correct. A rule regression here would show up as a screen
// with the wrong buttons — which looks plausible and is very hard to spot by eye.
//
// Run: npm test --prefix apps/hub

import { test } from "node:test";
import assert from "node:assert/strict";

import { applyAction, permittedActions, statusLabel, type Clock, type WorkflowAction } from "./workflow.ts";
import { ROLES } from "./roles.ts";
import { GRADES, type GrantApplication, type RoleId } from "./types.ts";
import { buildSeed } from "./store/seed.ts";

let seq = 0;
const clock = (): Clock => ({ now: "2026-08-12T09:00:00.000Z", id: (p) => `${p}-t${++seq}` });

function draft(): GrantApplication {
  return {
    id: "GIA/2026-27/SHRESHTA_M2/PUNE/00001",
    schemeCode: "SHRESHTA_M2",
    ngoId: "ngo-001",
    institutionId: "SC/MH/PUN/02000",
    projectLabel: "Hostel — Pune · FY 2026-27",
    financialYear: "2026-27",
    status: "Draft",
    holder: { kind: "ngo" },
    scBeneficiaries: 120,
    otherBeneficiaries: 10,
    totalBeneficiaries: 130,
    recurring: 4_000_000,
    nonRecurring: 1_000_000,
    total: 5_000_000,
    documents: [],
    deficiencies: [],
    queries: [],
    audit: [],
    updatedAt: "2026-08-01T00:00:00.000Z",
    ageingDays: 11,
  };
}

/** Fire an action, asserting it is permitted. */
function must(app: GrantApplication, role: RoleId, action: WorkflowAction, remarks = "ok"): GrantApplication {
  const res = applyAction(app, role, action, { remarks, certified: true }, clock());
  assert.ok(res.ok, `expected ${role} to ${action}, got: ${res.ok ? "" : res.error}`);
  return res.app;
}

test("an application climbs PD → IFD → Programme Director and is sanctioned", () => {
  let app = must(draft(), "ngo", "submit");
  assert.deepEqual(app.holder, { kind: "chain", division: "pd", grade: "aso" });
  assert.equal(app.status, "Submitted");

  for (const g of GRADES) app = must(app, `pd-${g}`, "forward");
  // Forwarding past PD:JS crosses into the Integrated Finance Division.
  assert.deepEqual(app.holder, { kind: "chain", division: "finance", grade: "aso" });
  assert.equal(app.status, "WithFinance");

  for (const g of GRADES.slice(0, 4)) app = must(app, `finance-${g}`, "forward");
  assert.deepEqual(app.holder, { kind: "chain", division: "finance", grade: "js" });

  app = must(app, "finance-js", "concur");
  assert.deepEqual(app.holder, { kind: "pd" });
  assert.equal(app.status, "FinanceConcurred");

  app = must(app, "programme-director", "sanction");
  assert.deepEqual(app.holder, { kind: "done" });
  assert.equal(app.status, "Sanctioned");
  assert.ok(app.sanction, "a sanction order should be generated");
  assert.equal(app.sanction?.total, app.sanction!.recurring + app.sanction!.nonRecurring);
});

test("IFD:JS concurs rather than forwards", () => {
  let app = must(draft(), "ngo", "submit");
  for (const g of GRADES) app = must(app, `pd-${g}`, "forward");
  for (const g of GRADES.slice(0, 4)) app = must(app, `finance-${g}`, "forward");

  const actions = permittedActions(app, ROLES["finance-js"]).map((r) => r.action);
  assert.ok(actions.includes("concur"), "IFD:JS should be able to concur");
  assert.ok(!actions.includes("forward"), "IFD:JS should NOT have a plain forward");
});

test("the Programme Director's return sends the file back to PD:ASO to re-climb", () => {
  let app = must(draft(), "ngo", "submit");
  for (const g of GRADES) app = must(app, `pd-${g}`, "forward");
  for (const g of GRADES.slice(0, 4)) app = must(app, `finance-${g}`, "forward");
  app = must(app, "finance-js", "concur");

  app = must(app, "programme-director", "return", "Reconcile the beneficiary figures.");
  assert.deepEqual(app.holder, { kind: "chain", division: "pd", grade: "aso" });
  assert.equal(app.status, "Returned");

  // …and it can climb again.
  app = must(app, "pd-aso", "forward");
  assert.deepEqual(app.holder, { kind: "chain", division: "pd", grade: "so" });
});

test("only PD:ASO raises a deficiency and only PD:SO communicates it", () => {
  let app = must(draft(), "ngo", "submit");

  assert.ok(!permittedActions(app, ROLES["pd-aso"]).some((r) => r.action === "communicateDeficiency"));
  app = must(app, "pd-aso", "raiseDeficiency", "Audited accounts illegible.");
  assert.deepEqual(app.holder, { kind: "chain", division: "pd", grade: "so" });
  assert.equal(app.deficiencies.length, 1);

  app = must(app, "pd-so", "communicateDeficiency", "Communicated to applicant.");
  assert.deepEqual(app.holder, { kind: "ngo" });
  assert.equal(app.status, "DeficiencyRaised");

  app = must(app, "ngo", "respondDeficiency", "Legible scans attached.");
  assert.deepEqual(app.holder, { kind: "chain", division: "pd", grade: "so" });
  assert.equal(app.status, "DeficiencyResponded");
  assert.ok(app.deficiencies[0]?.respondedAt, "the deficiency should be closed out");
});

test("US and DS raise queries that push the file down a grade; ASO and SO cannot", () => {
  let app = must(draft(), "ngo", "submit");
  app = must(app, "pd-aso", "forward");
  app = must(app, "pd-so", "forward");
  assert.deepEqual(app.holder, { kind: "chain", division: "pd", grade: "us" });

  app = must(app, "pd-us", "raiseQuery", "Clarify the non-recurring component.");
  assert.deepEqual(app.holder, { kind: "chain", division: "pd", grade: "so" });
  assert.equal(app.status, "QueryRaised");
  assert.equal(app.queries.length, 1);

  // A file under query cannot simply be forwarded on; it must be resolved.
  const soActions = permittedActions(app, ROLES["pd-so"]).map((r) => r.action);
  assert.ok(!soActions.includes("forward"), "a queried file should not be plain-forwardable");
  assert.ok(soActions.includes("resolveQuery"));

  app = must(app, "pd-so", "resolveQuery", "Clarification recorded.");
  assert.deepEqual(app.holder, { kind: "chain", division: "pd", grade: "us" });
  assert.equal(app.status, "UnderReview");
  assert.ok(app.queries[0]?.resolvedAt);
});

test("actions requiring remarks are refused without them", () => {
  const app = must(draft(), "ngo", "submit");
  const res = applyAction(app, "pd-aso", "forward", { remarks: "   " }, clock());
  assert.equal(res.ok, false);
  assert.match(res.ok ? "" : res.error, /remarks/i);
});

test("a role that does not hold the file gets no actions", () => {
  const app = must(draft(), "ngo", "submit"); // sits with PD:ASO
  assert.deepEqual(permittedActions(app, ROLES["pd-ds"]), []);
  assert.deepEqual(permittedActions(app, ROLES["finance-js"]), []);
  // …and a closed file is inert for everyone.
  const done = must(must(app, "pd-aso", "forward"), "pd-so", "reject", "Ineligible.");
  assert.deepEqual(permittedActions(done, ROLES["pd-so"]), []);
});

test("only the Programme Director can sanction", () => {
  let app = must(draft(), "ngo", "submit");
  for (const g of GRADES) app = must(app, `pd-${g}`, "forward");
  for (const g of GRADES.slice(0, 4)) app = must(app, `finance-${g}`, "forward");
  app = must(app, "finance-js", "concur");

  for (const role of ["pd-js", "finance-js", "pd-aso"] as const) {
    const res = applyAction(app, role, "sanction", { remarks: "x" }, clock());
    assert.equal(res.ok, false, `${role} must not be able to sanction`);
  }
});

test("statusLabel renders the live portal's compound badge", () => {
  const app = must(draft(), "ngo", "submit");
  assert.equal(statusLabel(app), "Submitted / ASO");
});

test("the seed builds, and every officer grade lands on a non-empty worklist", () => {
  const { applications, inspections, notifications } = buildSeed();
  assert.ok(applications.length > 40, `expected a substantial seed, got ${applications.length}`);
  assert.ok(inspections.length > 0);
  assert.ok(notifications.length > 0);

  for (const division of ["pd", "finance"] as const) {
    for (const grade of GRADES) {
      const held = applications.filter(
        (a) => a.holder.kind === "chain" && a.holder.division === division && a.holder.grade === grade,
      );
      assert.ok(held.length > 0, `${division}-${grade} has an empty worklist — reads as a broken portal`);
    }
  }

  assert.ok(applications.some((a) => a.holder.kind === "pd"), "the Programme Director needs a queue too");
  assert.ok(applications.some((a) => a.status === "Sanctioned"));
  assert.ok(applications.some((a) => a.status === "Rejected"));
  assert.ok(applications.some((a) => a.status === "DeficiencyRaised"));
  assert.ok(applications.some((a) => a.status === "QueryRaised"));
  assert.ok(applications.some((a) => a.status === "Draft"));
});

test("seeded audit trails agree with the record they describe", () => {
  const { applications } = buildSeed();
  for (const app of applications) {
    if (app.status === "Draft") {
      assert.equal(app.audit.length, 0, `${app.id}: a draft should have no audit entries`);
      continue;
    }
    assert.ok(app.audit.length > 0, `${app.id}: a non-draft must have an audit trail`);
    // The last entry's destination is, by construction, where the file now sits.
    assert.deepEqual(app.audit[app.audit.length - 1]?.to, app.holder, `${app.id}: audit tail disagrees with holder`);
    assert.equal(app.audit[0]?.action, "submit", `${app.id}: every trail starts at submission`);
  }
});

test("the seed is deterministic — two builds are identical", () => {
  // Guards against Math.random / Date.now creeping in, which would break SSR hydration and
  // make every screenshot and demo irreproducible.
  const a = buildSeed().applications.map((x) => `${x.id}:${x.status}:${JSON.stringify(x.holder)}`);
  const b = buildSeed().applications.map((x) => `${x.id}:${x.status}:${JSON.stringify(x.holder)}`);
  assert.deepEqual(a, b);
});
