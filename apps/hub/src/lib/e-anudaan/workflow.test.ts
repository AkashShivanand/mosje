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

import {
  RULES,
  applyAction,
  canEditDocVerdicts,
  deficiencyItemsFrom,
  permittedActions,
  seatName,
  statusLabel,
  verdictAttribution,
  type Clock,
  type DecisionContext,
  type WorkflowAction,
} from "./workflow.ts";
import { ROLES } from "./roles.ts";
import { GRADES, type GrantApplication, type RoleId } from "./types.ts";
import { buildSeed } from "./store/seed.ts";

let seq = 0;
const clock = (): Clock => ({ now: "2026-08-12T09:00:00.000Z", id: (p) => `${p}-t${++seq}` });

function draft(): GrantApplication {
  return {
    id: "GIA/2026-27/SHRESHTA_M2/PUNE/00001",
    schemeCode: "SHRESHTA_M2",
    caseType: "New",
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
    showCauseNotices: [],
    audit: [],
    updatedAt: "2026-08-01T00:00:00.000Z",
    ageingDays: 11,
  };
}

/** Fire an action, asserting it is permitted. */
function must(app: GrantApplication, role: RoleId, action: WorkflowAction, remarks = "ok"): GrantApplication {
  const items = action === "raiseDeficiency" ? deficiencyItemsFrom(app, remarks) : undefined;
  const res = applyAction(app, role, action, { remarks, certified: true, items }, clock());
  assert.ok(res.ok, `expected ${role} to ${action}, got: ${res.ok ? "" : res.error}`);
  return res.app;
}

/** Climb the whole PD chain, honouring PD:ASO's certification gate. */
function climbPd(app: GrantApplication): GrantApplication {
  let cur = must(app, "pd-aso", "certify");
  for (const g of GRADES) cur = must(cur, `pd-${g}`, "forward");
  return cur;
}

/** Climb PD then the IFD up to (not including) IFD:JS. */
function climbToIfdJs(app: GrantApplication): GrantApplication {
  let cur = climbPd(app);
  for (const g of GRADES.slice(0, 4)) cur = must(cur, `finance-${g}`, "forward");
  return cur;
}

test("an application climbs PD → IFD → Programme Director and is sanctioned", () => {
  let app = must(draft(), "ngo", "submit");
  assert.deepEqual(app.holder, { kind: "chain", division: "pd", grade: "aso" });
  assert.equal(app.status, "Submitted");

  app = climbPd(app);
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
  app = climbToIfdJs(app);

  const actions = permittedActions(app, ROLES["finance-js"]).map((r) => r.action);
  assert.ok(actions.includes("concur"), "IFD:JS should be able to concur");
  assert.ok(!actions.includes("forward"), "IFD:JS should NOT have a plain forward");
});

test("the Programme Director's return sends the file back to PD:ASO to re-climb", () => {
  let app = must(draft(), "ngo", "submit");
  app = climbToIfdJs(app);
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
  // Noted, not yet sent: its own state, and the SO may not forward past it.
  assert.equal(app.status, "DeficiencyProposed");
  assert.ok(!permittedActions(app, ROLES["pd-so"]).some((r) => r.action === "forward"));

  app = must(app, "pd-so", "communicateDeficiency", "Communicated to applicant.");
  assert.deepEqual(app.holder, { kind: "ngo" });
  assert.equal(app.status, "DeficiencyRaised");
  assert.equal(app.deficiencies[0]?.message, "Communicated to applicant.");

  app = must(app, "ngo", "respondDeficiency", "Legible scans attached.");
  assert.deepEqual(app.holder, { kind: "chain", division: "pd", grade: "so" });
  assert.equal(app.status, "DeficiencyResponded");
  assert.ok(app.deficiencies[0]?.respondedAt, "the deficiency should be closed out");
});

test("Return to Previous (a query) pushes the file down a grade and climbs back when answered", () => {
  let app = must(draft(), "ngo", "submit");
  app = must(app, "pd-aso", "certify");
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
  const certified = must(app, "pd-aso", "certify");
  const res = applyAction(certified, "pd-aso", "forward", { remarks: "   " }, clock());
  assert.equal(res.ok, false);
  assert.match(res.ok ? "" : res.error, /remarks/i);
});

test("a role that does not hold the file gets no actions", () => {
  const app = must(draft(), "ngo", "submit"); // sits with PD:ASO
  assert.deepEqual(permittedActions(app, ROLES["pd-ds"]), []);
  assert.deepEqual(permittedActions(app, ROLES["finance-js"]), []);
  // …and a closed file is inert for everyone.
  const done = must(must(must(app, "pd-aso", "certify"), "pd-aso", "forward"), "pd-so", "reject", "Ineligible.");
  assert.deepEqual(permittedActions(done, ROLES["pd-so"]), []);
});

test("only the Programme Director can sanction", () => {
  let app = must(draft(), "ngo", "submit");
  app = climbToIfdJs(app);
  app = must(app, "finance-js", "concur");

  for (const role of ["pd-js", "finance-js", "pd-aso"] as const) {
    const res = applyAction(app, role, "sanction", { remarks: "x" }, clock());
    assert.equal(res.ok, false, `${role} must not be able to sanction`);
  }
});

test("statusLabel renders the live portal's compound badge, in words", () => {
  const app = must(draft(), "ngo", "submit");
  assert.equal(statusLabel(app), "Received · With the Assistant Section Officer");
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

test("PD:ASO cannot forward until certification is recorded", () => {
  // The live ASO review screen renders Record Certification as its own section and its own
  // button, and leaves the forward disabled until it is pressed.
  const app = must(draft(), "ngo", "submit");
  assert.equal(app.certifiedAt, undefined);

  const early = applyAction(app, "pd-aso", "forward", { remarks: "looks fine" }, clock());
  assert.equal(early.ok, false, "forward must be blocked before certification");

  const certified = must(app, "pd-aso", "certify");
  assert.ok(certified.certifiedAt, "certification should be stamped");
  assert.deepEqual(certified.holder, app.holder, "certifying must not move the file");
  assert.equal(certified.status, app.status);

  const after = applyAction(certified, "pd-aso", "forward", { remarks: "verified" }, clock());
  assert.equal(after.ok, true, "forward should be permitted once certified");
});

test("forward buttons name their destination by the grade's full title, never its acronym", () => {
  // "Forward to US" read as the word "us" (UX audit UX-18).
  const app = must(draft(), "ngo", "submit");
  const fwd = RULES.find((r) => r.action === "forward")!;
  assert.equal(fwd.label(ROLES["pd-aso"], app), "Forward to the Section Officer");
  assert.equal(fwd.label(ROLES["pd-so"], app), "Forward to the Under Secretary");
  assert.equal(fwd.label(ROLES["pd-ds"], app), "Forward to the Joint Secretary");
  assert.equal(fwd.label(ROLES["pd-js"], app), "Forward to Integrated Finance");
  assert.equal(fwd.label(ROLES["finance-aso"], app), "Forward to the Section Officer");

  // No decision label on any grade carries a bare grade acronym.
  for (const role of Object.values(ROLES)) {
    for (const rule of RULES) {
      assert.doesNotMatch(rule.label(role, { ...app, status: "DeficiencyProposed" }), /\b(ASO|SO|US|DS|JS|IFD)\b/, `${role.id} ${rule.action}`);
    }
  }
});

function ctxFor(app: GrantApplication, role: RoleId, payload: DecisionContext["payload"] = { remarks: "Recommended." }): DecisionContext {
  return { app, role: ROLES[role], payload, ngoName: "Sankalp Seva Sansthan", project: "Hostel — Pune", };
}

test("every irreversible or outward decision carries a confirmation that names the file and the amounts", () => {
  // UX-03: the sanction and the return committed on one click; only Reject confirmed.
  let app = must(draft(), "ngo", "submit");
  const rule = (a: WorkflowAction) => RULES.find((r) => r.action === a)!;
  for (const a of ["sanction", "reject", "return", "communicateDeficiency", "concur"] as const) {
    assert.ok(rule(a).confirm, `${a} must be confirmed`);
  }

  // A forward one grade up is the everyday move; only the forward that leaves the division confirms.
  const certified = must(app, "pd-aso", "certify");
  assert.equal(rule("forward").confirm!(ctxFor(certified, "pd-aso")), null);
  let atJs = certified;
  for (const g of GRADES.slice(0, 4)) atJs = must(atJs, `pd-${g}`, "forward");
  const leaving = rule("forward").confirm!(ctxFor(atJs, "pd-js"));
  assert.ok(leaving);
  assert.equal(leaving.confirmLabel, "Forward to Integrated Finance");

  // Sanction: the confirm button states the amount being sanctioned, and so do the facts.
  app = { ...app, holder: { kind: "pd" }, status: "FinanceConcurred", total: 6_800_000, recurring: 5_500_000, nonRecurring: 1_300_000 };
  const partial = rule("sanction").confirm!(ctxFor(app, "programme-director", { remarks: "As recommended.", sanction: { recurring: 5_000_000, nonRecurring: 1_000_000 } }))!;
  assert.equal(partial.confirmLabel, "Sanction ₹60,00,000");
  const facts = Object.fromEntries(partial.facts.map((f) => [f.term, f.value]));
  assert.equal(facts["NGO"], "Sankalp Seva Sansthan");
  assert.equal(facts["Project"], "Hostel — Pune");
  assert.equal(facts["Amount Sought"], "₹68,00,000");
  assert.equal(facts["Amount to Sanction"], "₹60,00,000 (₹8,00,000 less than sought)");
  assert.equal(facts["Your Remarks"], "As recommended.");
  const full = rule("sanction").confirm!(ctxFor(app, "programme-director", { remarks: "x", sanction: { recurring: 5_500_000, nonRecurring: 1_300_000 } }))!;
  assert.equal(full.confirmLabel, "Sanction ₹68,00,000");
  assert.match(full.facts.find((f) => f.term === "Amount to Sanction")!.value, /the full amount sought/);

  // Reject is the only danger tone.
  assert.equal(rule("reject").confirm!(ctxFor(app, "programme-director"))!.tone, "danger");
  assert.equal(rule("return").confirm!(ctxFor(app, "programme-director"))!.tone, "primary");
});

test("outcome messages name what happened and where the file went, in full grade titles", () => {
  const app = must(must(draft(), "ngo", "submit"), "pd-aso", "certify");
  const toSo = must(app, "pd-aso", "forward");
  const fwd = RULES.find((r) => r.action === "forward")!;
  assert.equal(fwd.outcome({ ...ctxFor(app, "pd-aso"), after: toSo }), "File forwarded to the Section Officer, Programme Division.");
  const toUs = must(toSo, "pd-so", "forward");
  assert.equal(fwd.outcome({ ...ctxFor(toSo, "pd-so"), after: toUs }), "File forwarded to the Under Secretary, Programme Division.");

  const atPd: GrantApplication = { ...app, holder: { kind: "pd" }, status: "FinanceConcurred" };
  const sanctioned = must(atPd, "programme-director", "sanction");
  const san = RULES.find((r) => r.action === "sanction")!;
  assert.equal(san.outcome({ ...ctxFor(atPd, "programme-director"), after: sanctioned }), `Sanction order ${sanctioned.sanction!.orderNo} issued for Sankalp Seva Sansthan.`);

  assert.equal(seatName({ kind: "chain", division: "finance", grade: "ds" }), "the Deputy Secretary, Integrated Finance Division");
  for (const rule of RULES) assert.equal(typeof rule.outcome, "function", `${rule.action} has an outcome`);
});

test("once the ASO has certified, only the ASO-grade holder edits document verdicts", () => {
  // UX-11: the Programme Director was handed twenty editable verdicts on a certified file.
  const submitted = must(draft(), "ngo", "submit");
  assert.equal(canEditDocVerdicts(submitted, ROLES["pd-aso"]), true);
  assert.equal(canEditDocVerdicts(submitted, ROLES["pd-so"]), false, "not holding the file");

  const certified = must(submitted, "pd-aso", "certify");
  assert.equal(canEditDocVerdicts(certified, ROLES["pd-aso"]), true, "the certifying ASO still holds it");
  const atSo = must(certified, "pd-aso", "forward");
  assert.equal(canEditDocVerdicts(atSo, ROLES["pd-so"]), false);

  const atPd: GrantApplication = { ...atSo, holder: { kind: "pd" }, status: "FinanceConcurred" };
  assert.equal(canEditDocVerdicts(atPd, ROLES["programme-director"]), false);

  // A file resubmitted after a deficiency, never certified, is still judged by whoever holds it.
  const uncertifiedAtSo: GrantApplication = { ...submitted, holder: { kind: "chain", division: "pd", grade: "so" }, status: "DeficiencyResponded" };
  assert.equal(canEditDocVerdicts(uncertifiedAtSo, ROLES["pd-so"]), true);

  // The Integrated Finance Division examines the file, but it does not re-judge the Programme
  // Division's documents: the verdicts on a certified file belong to the seat that certified them.
  const atFinance: GrantApplication = { ...atSo, holder: { kind: "chain", division: "finance", grade: "aso" }, status: "WithFinance" };
  assert.equal(canEditDocVerdicts(atFinance, ROLES["finance-aso"]), false, "the IFD ASO may not change the PD ASO's verdicts");
  assert.equal(canEditDocVerdicts(atFinance, ROLES["pd-aso"]), false, "and the PD ASO no longer holds the file");
  assert.equal(canEditDocVerdicts({ ...atFinance, holder: { kind: "chain", division: "finance", grade: "so" } }, ROLES["finance-so"]), false);

  // An uncertified file inside Finance — never reached today, but the rule says the same thing.
  const uncertifiedAtFinance: GrantApplication = { ...submitted, holder: { kind: "chain", division: "finance", grade: "aso" }, status: "WithFinance" };
  assert.equal(canEditDocVerdicts(uncertifiedAtFinance, ROLES["finance-aso"]), true, "nothing is certified: the holder judges");

  // A certified file back with its own ASO after a correction: still theirs to judge.
  const backWithAso: GrantApplication = { ...certified, status: "DeficiencyResponded" };
  assert.equal(canEditDocVerdicts(backWithAso, ROLES["pd-aso"]), true);

  const attribution = verdictAttribution(certified);
  assert.match(attribution!, /^Examined and certified by Ananya Rao, Assistant Section Officer, on \d{2} \w{3} 2026\.$/);
  assert.equal(verdictAttribution(submitted), null);
});

// The certification gate itself moved to lib/e-anudaan/review-readiness.ts on 16 Sep 2026: it is
// now "every required document has a VERDICT" rather than "opened or judged", and it is tested in
// review-readiness.test.ts. `unexaminedRequiredDocs` was retired with this test.

/** A submitted file with real documents, sitting with PD:ASO, from the seed. */
function submittedWithDocuments(): GrantApplication {
  const app = buildSeed().applications.find((a) => a.status === "Submitted" && a.documents.some((d) => d.fileName));
  assert.ok(app, "the seed holds a submitted file with documents");
  return { ...app, documents: app.documents.map((d) => ({ ...d, reviewStatus: "Pending" as const, officerRemarks: undefined })), deficiencies: [] };
}

test("a deficiency carries the documents the officer marked, with their reasons, and the NGO sees the SO's message", () => {
  let app = submittedWithDocuments();
  const target = app.documents.find((d) => d.fileName)!;
  app = { ...app, documents: app.documents.map((d) => (d.id === target.id ? { ...d, reviewStatus: "Deficient" as const, officerRemarks: "Pages 3 to 6 are blurred." } : d)) };

  // No reason on a marked document: refused, so the NGO is never told to fix something unexplained.
  const unexplained = { ...app, documents: app.documents.map((d) => (d.id === target.id ? { ...d, officerRemarks: "" } : d)) };
  const refused = applyAction(unexplained, "pd-aso", "raiseDeficiency", { remarks: "note", items: deficiencyItemsFrom(unexplained, "note") }, clock());
  assert.equal(refused.ok, false);

  app = must(app, "pd-aso", "raiseDeficiency", "Internal: ask for a clear copy.");
  const items = app.deficiencies[0]!.items!;
  assert.equal(items.length, 1);
  assert.equal(items[0]!.kind, "document");
  assert.equal(items[0]!.docId, target.id);
  assert.equal(items[0]!.remark, "Pages 3 to 6 are blurred.");

  app = must(app, "pd-so", "communicateDeficiency", "Upload a legible copy of the audited accounts.");
  assert.equal(app.deficiencies[0]!.message, "Upload a legible copy of the audited accounts.");
  assert.equal(app.deficiencies[0]!.detail, "Internal: ask for a clear copy.");
});

test("the SO can return a noted deficiency to the ASO unsent, and it is withdrawn", () => {
  let app = submittedWithDocuments();
  app = must(app, "pd-aso", "raiseDeficiency", "Clarify the beneficiary count.");
  assert.equal(app.deficiencies[0]!.items![0]!.kind, "note");
  app = must(app, "pd-so", "raiseQuery", "Not a deficiency; examine the register first.");
  assert.equal(app.status, "QueryRaised");
  assert.ok(app.deficiencies[0]!.withdrawnAt);
});
