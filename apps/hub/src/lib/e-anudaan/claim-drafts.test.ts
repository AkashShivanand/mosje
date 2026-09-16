/**
 * Batch B4 of the design-director audit (portal-audit/AUDIT.md): a claim is never offered while a
 * draft of it exists (N-02), a claim opened from its deep link skips the question it already
 * answered (W-04), and AVYAY's beneficiary count is guidance against the strength the project
 * type is costed for, not a minimum (W-01).
 */
import { test } from "node:test";
import assert from "node:assert/strict";

import { buildScenario } from "./demo-scenarios.ts";
import { claimStartStep, draftResumeRoute } from "./drafts.ts";
import { AVYAY_WIZARD, SHRESHTA_WIZARD, costedStrength, fieldVisible, isReadOnly, stepFields, strengthAdvice, validateStep, visibleSteps, wizardFor } from "./form-schema.ts";
import { draftOfClaim, instalmentPlan, nextInstalmentNotice, renewableProjects, renewalAnswers, upcomingInstalments } from "./instalments.ts";
import { buildSeed, SEED_SCHEMES } from "./store/seed.ts";
import type { EAnudaanState, GrantApplication } from "./types.ts";

const fresh = (): EAnudaanState => ({ version: 0, session: "ngo", schemes: SEED_SCHEMES, ...buildSeed() });
const NOW = new Date(2026, 8, 16);

/** An open instalment on the NGO's own projects, as the dashboard lists them. */
function openNotice(state: EAnudaanState, scheme: string) {
  const ngo = state.ngos[0]!;
  const n = upcomingInstalments(state, ngo.id, NOW).find((x) => x.plan.scheme === scheme && x.plan.state === "open" && !x.draft);
  assert.ok(n, `the seed should hold an open ${scheme} instalment`);
  return n;
}

/** A Draft of exactly this claim, filed as the wizard would save one. */
function draftFor(state: EAnudaanState, notice: ReturnType<typeof openNotice>, over: Partial<GrantApplication> = {}): GrantApplication {
  const last = notice.plan.lastSanctioned!;
  return {
    ...last,
    id: `DRAFT/${notice.plan.projectId}/I${notice.plan.instalment}`,
    status: "Draft",
    caseType: "Ongoing",
    instalment: notice.plan.instalment,
    financialYear: notice.plan.financialYear!,
    sanction: undefined,
    release: undefined,
    submittedAt: undefined,
    formValues: renewalAnswers(notice.plan),
    ...over,
  } as GrantApplication;
}

/* ── N-02: never offer a claim while a draft of it exists ─────────────────── */

test("draftOfClaim finds the Draft of the same scheme, project, instalment and year", () => {
  const state = fresh();
  const notice = openNotice(state, "AVYAY");
  assert.equal(draftOfClaim(state, notice.plan), undefined);
  const draft = draftFor(state, notice);
  state.applications = [...state.applications, draft];
  assert.equal(draftOfClaim(state, notice.plan)?.id, draft.id);
});

test("draftOfClaim ignores a draft of another instalment, another year, or a new project", () => {
  const state = fresh();
  const notice = openNotice(state, "AVYAY");
  const n = notice.plan.instalment!;
  state.applications = [
    ...state.applications,
    draftFor(state, notice, { id: "D1", instalment: (n === 3 ? 2 : n + 1) as GrantApplication["instalment"] }),
    draftFor(state, notice, { id: "D2", financialYear: "2019-20" }),
    draftFor(state, notice, { id: "D3", caseType: "New" }),
    draftFor(state, notice, { id: "D4", schemeCode: "NAPDDR" }),
  ];
  assert.equal(draftOfClaim(state, notice.plan), undefined);
});

test("the notice for a claim with a draft says so, and links to the draft instead of a new claim", () => {
  const state = fresh();
  const notice = openNotice(state, "NAPDDR");
  const draft = draftFor(state, notice);
  state.applications = [...state.applications, draft];
  const app = state.applications.find((a) => a.id === notice.plan.lastSanctioned!.id)!;
  const again = nextInstalmentNotice(state, app, NOW)!;
  assert.equal(again.draft?.id, draft.id);
  assert.match(again.title, /is saved as a draft$/);
  assert.equal(again.href, draftResumeRoute(draft));
  assert.ok(!again.href!.includes("?project="), "a claim with a draft is not offered as a new claim");
});

test("every seeded Ongoing Draft is the draft of its project's open claim, never a second entry point", () => {
  const state = fresh();
  const ngo = state.ngos[0]!;
  const notices = upcomingInstalments(state, ngo.id, NOW);
  for (const d of state.applications.filter((a) => a.ngoId === ngo.id && a.status === "Draft" && a.caseType === "Ongoing" && a.instalment)) {
    const plan = instalmentPlan(state, d.schemeCode, d.institutionId, NOW);
    if (plan.state !== "open" || plan.instalment !== d.instalment) continue;
    const n = notices.find((x) => x.plan.projectId === d.institutionId && x.plan.scheme === d.schemeCode);
    assert.equal(n?.draft?.id, d.id, `${d.id}: the dashboard should continue this draft`);
    assert.ok(n?.href?.includes("draft="), `${d.id}: the row should open the draft`);
  }
});

test("the renewal picker does not offer a project whose claim is saved as a draft", () => {
  const state = fresh();
  const notice = openNotice(state, "AVYAY");
  const ngo = state.ngos[0]!;
  assert.ok(renewableProjects(state, ngo.id, "AVYAY", NOW).some((p) => p.projectId === notice.plan.projectId));
  state.applications = [...state.applications, draftFor(state, notice)];
  assert.ok(!renewableProjects(state, ngo.id, "AVYAY", NOW).some((p) => p.projectId === notice.plan.projectId));
  // …except to the draft itself, which must still find its own project in the list.
  const own = draftFor(state, notice).id;
  assert.ok(renewableProjects(state, ngo.id, "AVYAY", NOW, own).some((p) => p.projectId === notice.plan.projectId));
});

/* ── W-04: a claim from its deep link opens past Application Type ─────────── */

test("a claim with its project chosen starts on the step after Application Type", () => {
  const state = fresh();
  for (const scheme of ["AVYAY", "NAPDDR", "SHRESHTA_M2", "SMILE"]) {
    const notice = openNotice(state, scheme);
    const wizard = wizardFor(scheme)!;
    const values = renewalAnswers(notice.plan);
    // The case type is the wizard's to set from the link; the renewal answers name the project.
    const withCase = { ...values, ...(scheme === "SHRESHTA_M2" ? {} : { case_type: visibleSteps(wizard, values)[0]!.sections.flatMap((s) => s.fields).find((f) => f.name === "case_type")!.options!.find((o) => /Ongoing|existing/i.test(o))! }) };
    const picker = { AVYAY: "fld_ongoing_source_application", NAPDDR: "fld_ongoing_source_application", SMILE: "fld_smile_project_select", SHRESHTA_M2: "fld_institution_select" }[scheme]!;
    const option = `${notice.plan.projectId} — x`;
    const answered = { ...withCase, [picker]: option, fld_project_id: notice.plan.projectId };
    const at = claimStartStep(wizard, answered);
    assert.equal(at, 1, `${scheme}: expected to open on step 2, errors ${JSON.stringify(validateStep(visibleSteps(wizard, answered)[0]!, answered))}`);
  }
});

test("a form with no claim, or an incomplete first step, starts on step 1", () => {
  assert.equal(claimStartStep(AVYAY_WIZARD, {}), 0);
  assert.equal(claimStartStep(AVYAY_WIZARD, { claim_stage: "later-instalment" }), 0);
});

/* ── W-01: beneficiaries against the strength the project type is costed for ─ */

test("AVYAY's project types are costed for a strength, and the demo answers it", () => {
  assert.equal(costedStrength({ fld_nature_of_project: "Senior Citizens' Home — 25 beneficiaries" }), 25);
  assert.equal(costedStrength({ fld_nature_of_project: "Senior Citizens' Home — 50 elderly women only" }), 50);
  assert.equal(costedStrength({ fld_nature_of_project: "Physiotherapy Clinic" }), undefined);
  const demo = buildScenario("complete", AVYAY_WIZARD).values;
  assert.equal(Number(demo.fld_total_beneficiaries), costedStrength(demo), "the complete demo agrees with the cost-norms panel");
});

test("fewer beneficiaries than the costed strength is advice, not a validation error", () => {
  const nature = "Senior Citizens' Home — 25 beneficiaries";
  const field = stepFields(visibleSteps(AVYAY_WIZARD, { case_type: "New project" }).find((s) => s.title.startsWith("Infrastructure"))!).find((f) => f.name === "fld_total_beneficiaries")!;
  assert.match(strengthAdvice(field, { fld_nature_of_project: nature, fld_total_beneficiaries: "12" }) ?? "", /25/);
  assert.equal(strengthAdvice(field, { fld_nature_of_project: nature, fld_total_beneficiaries: "25" }), undefined);
  const step = visibleSteps(AVYAY_WIZARD, { case_type: "New project" }).find((s) => s.title.startsWith("Infrastructure"))!;
  assert.equal(validateStep(step, { fld_nature_of_project: nature, fld_total_beneficiaries: "12" }).fld_total_beneficiaries, undefined);
  // The help never calls it a minimum.
  for (const f of stepFields(step)) assert.doesNotMatch(`${f.help ?? ""}`, /minimum|at least/i, f.name);
});

/* ── SHRESHTA: a New institution is not asked for its grant history ───────── */

test("SHRESHTA asks the year grant began only of an ongoing institution, and a claim cannot turn New", () => {
  const f = SHRESHTA_WIZARD.steps.flatMap(stepFields).find((x) => x.name === "fld_gia_since_year")!;
  assert.equal(fieldVisible(f, { fld_institution_status: "New" }), false);
  assert.equal(fieldVisible(f, { fld_institution_status: "Ongoing" }), true);
  const status = SHRESHTA_WIZARD.steps.flatMap(stepFields).find((x) => x.name === "fld_institution_status")!;
  assert.ok(status.options!.includes("New"));
  assert.equal(isReadOnly(status, { claim_stage: "first-instalment" }), true);
});
