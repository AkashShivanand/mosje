/**
 * AVYAY renewals as the review call of 11 Sep 2026 settled them, and the verification of 16 Sep
 * found them not working: every renewal derived "1st Instalment", the picker listed projects that
 * were not the NGO's, the grant was typed, key staff were one box, and the demo fill wrote over
 * NGO-Darpan's identity.
 */
import { test } from "node:test";
import assert from "node:assert/strict";

import { buildScenario } from "./demo-scenarios.ts";
import {
  AVYAY_WIZARD,
  avyayEntitlement,
  fieldHelp,
  fieldLabel,
  fieldVisible,
  isReadOnly,
  isSummarySection,
  stepFields,
  validateStep,
  visibleDocuments,
  visibleSections,
  visibleSteps,
  type StepDef,
  type WizardDef,
} from "./form-schema.ts";
import {
  applicationRefOf,
  claimIdFor,
  currentFinancialYear,
  instalmentPlan,
  nextInstalmentNotice,
  renewableProjects,
  renewalOption,
  upcomingInstalments,
} from "./instalments.ts";
import { darpanSeed, declarationStamp } from "./prefill.ts";
import { buildSeed, SEED_SCHEMES } from "./store/seed.ts";
import { checkApplication } from "./submission.ts";
import { answerField, fileApplication } from "./submit-application.ts";
import type { EAnudaanState, GrantApplication } from "./types.ts";

const STATE: EAnudaanState = { version: 0, session: "ngo", schemes: SEED_SCHEMES, ...buildSeed() };
const NGO = STATE.ngos[0]!;
const NOW = new Date(2026, 8, 16);
const NEW = "New project";
const RENEWAL = "Ongoing / Renewal of an existing project";
const clock = { now: "2026-09-16T10:00:00.000Z", id: (p: string) => `${p}-t-${Math.random().toString(36).slice(2, 7)}` };

const stepOne = (values: Record<string, string>): StepDef => visibleSteps(AVYAY_WIZARD, values)[0]!;

/** What a clerk answers on a renewal: every declaration and undertaking, given afresh. */
function declare(w: WizardDef, v: Record<string, string>): Record<string, string> {
  const out = { ...v };
  for (const f of visibleSteps(w, out).flatMap(stepFields)) {
    if (!fieldVisible(f, out) || (out[f.name] ?? "").trim()) continue;
    if (f.name.startsWith("decl_") || f.name === "prev_instalment_utilised") out[f.name] = f.kind === "checkbox" ? "true" : "Yes";
  }
  return out;
}

/** A renewal of `projectId`, chosen the way the wizard chooses it. */
function renew(projectId: string, state = STATE): Record<string, string> {
  let values: Record<string, string> = { ...darpanSeed(NGO, NOW), ...declarationStamp(NOW) };
  values = answerField(state, AVYAY_WIZARD, stepOne(values), values, "case_type", RENEWAL, NOW);
  const option = renewableProjects(state, NGO.id, "AVYAY", NOW).map(renewalOption).find((o) => o.startsWith(projectId));
  assert.ok(option, `${projectId} is offered`);
  return answerField(state, AVYAY_WIZARD, stepOne(values), values, "fld_ongoing_source_application", option!, NOW);
}

/* ── instalment derivation ────────────────────────────────────────────────── */

test("the next instalment comes from the project's sanctioned history, not a constant '1st'", () => {
  const byProject = Object.fromEntries(renewableProjects(STATE, NGO.id, "AVYAY", NOW).map((p) => [p.projectId, p]));
  assert.equal(byProject["SR/MH/PUN/03601"]?.instalment, 2, "1st of 2026-27 sanctioned → 2nd");
  assert.equal(byProject["SR/DL/NWD/03602"]?.instalment, 3, "1st and 2nd sanctioned → 3rd");
  assert.equal(byProject["SR/MH/THN/03603"]?.instalment, 1, "only the New grant → 1st of the next year");
  assert.equal(byProject["SR/MH/THN/03603"]?.financialYear, "2026-27");
});

test("instalments release 40%, 40% and 20% of the year's sanctioned recurring grant", () => {
  const p2 = instalmentPlan(STATE, "AVYAY", "SR/MH/PUN/03601", NOW);
  const p3 = instalmentPlan(STATE, "AVYAY", "SR/DL/NWD/03602", NOW);
  assert.equal(p2.share, 40);
  assert.equal(p2.amount, Math.round(p2.annualRecurring! * 0.4));
  assert.equal(p3.share, 20);
  assert.equal(p3.amount, Math.round(p3.annualRecurring! * 0.2));
  // The year's figure is recovered from the 1st instalment's order, which carried only 40% of it.
  assert.equal(p3.annualRecurring, 3968263);
});

test("a 2nd or 3rd instalment keeps the application ID of the year's 1st; a 1st gets a new one", () => {
  const p2 = instalmentPlan(STATE, "AVYAY", "SR/MH/PUN/03601", NOW);
  const first = STATE.applications.find((a) => a.institutionId === "SR/MH/PUN/03601" && a.instalment === 1)!;
  assert.equal(p2.applicationRef, first.id);
  assert.equal(instalmentPlan(STATE, "AVYAY", "SR/MH/THN/03603", NOW).applicationRef, undefined);
  assert.equal(claimIdFor("GIA/2026-27/AVYAY/PUNE/03612", 3), "GIA/2026-27/AVYAY/PUNE/03612/I3");
  assert.equal(applicationRefOf({ id: "GIA/2026-27/AVYAY/PUNE/03612/I3" }), "GIA/2026-27/AVYAY/PUNE/03612");
});

test("after a year's 3rd instalment, the next is the 1st of the following year — and not before that year opens", () => {
  const base = STATE.applications.find((a) => a.institutionId === "SR/DL/NWD/03602" && a.instalment === 2)!;
  const third: GrantApplication = { ...base, id: `${applicationRefOf(base)}/I3`, instalment: 3, sanction: { ...base.sanction!, recurring: 793653, total: 793653 } };
  const state = { ...STATE, applications: [...STATE.applications, third] };
  const during = instalmentPlan(state, "AVYAY", "SR/DL/NWD/03602", NOW);
  assert.equal(during.instalment, 1);
  assert.equal(during.financialYear, "2027-28");
  assert.equal(during.state, "not-yet", "2027-28 has not begun in September 2026");
  assert.equal(instalmentPlan(state, "AVYAY", "SR/DL/NWD/03602", new Date(2027, 3, 2)).state, "open");
  const notice = nextInstalmentNotice(state, third, NOW);
  assert.match(notice?.title ?? "", /1st Instalment for 2027-28 opens when the Ministry opens applications/);
  assert.equal(notice?.href, undefined, "nothing to claim yet, so nowhere to go");
});

test("a project with a claim still with the Ministry, or never sanctioned, cannot be renewed", () => {
  assert.equal(instalmentPlan(STATE, "AVYAY", "SR/DL/NWD/03045", NOW).state, "in-progress");
  assert.equal(instalmentPlan(STATE, "AVYAY", "SR/MH/PUN/02556", NOW).state, "none");
});

/* ── the renewal picker ───────────────────────────────────────────────────── */

test("the renewal picker lists the NGO's own AVYAY projects with an instalment open — and nothing else", () => {
  const offered = renewableProjects(STATE, NGO.id, "AVYAY", NOW).map((p) => p.projectId).sort();
  assert.deepEqual(offered, ["SR/DL/NWD/03602", "SR/MH/PUN/03601", "SR/MH/THN/03603"]);
  const mine = new Set(NGO.institutions.map((i) => i.id));
  for (const id of offered) assert.ok(mine.has(id), `${id} is the applicant's`);
  // Another NGO has no AVYAY project of this applicant's to offer.
  assert.deepEqual(renewableProjects(STATE, STATE.ngos[1]!.id, "AVYAY", NOW).map((p) => p.projectId).filter((id) => mine.has(id)), []);
  // The picker's options come from the record, not the schema.
  const picker = stepFields(AVYAY_WIZARD.steps[0]!).find((f) => f.name === "fld_ongoing_source_application")!;
  assert.equal(picker.optionsFrom, "renewableProjects");
  assert.equal(picker.options, undefined);
});

test("choosing the project states the instalment, the year, the amount and the account", () => {
  const v = renew("SR/MH/PUN/03601");
  assert.equal(v.fld_installment_no, "2nd Instalment");
  assert.equal(v.fld_financial_year, "2026-27");
  assert.equal(v.claim_stage, "later-instalment");
  assert.equal(Number(v.fld_instalment_amount), Math.round(Number(v.fld_sanctioned_recurring) * 0.4));
  assert.equal(v.fld_bank_name, "State Bank of India");
  assert.match(v.fld_bank_account_number ?? "", /^XXXX XXXX \d{4}$/);
  assert.equal(v.fld_project_id, "SR/MH/PUN/03601");
  // Changing the branch takes it all away again.
  const back = answerField(STATE, AVYAY_WIZARD, stepOne(v), v, "case_type", NEW, NOW);
  for (const k of ["claim_stage", "fld_instalment_amount", "fld_application_ref", "fld_bank_account_number", "fld_installment_no"]) assert.equal(back[k] ?? "", "", k);
});

/* ── a later instalment asks only for what changes ─────────────────────────── */

test("a 2nd or 3rd instalment is four steps: Application Type, Confirm Details, Documents, Review", () => {
  const v = renew("SR/DL/NWD/03602");
  assert.deepEqual(visibleSteps(AVYAY_WIZARD, v).map((s) => s.title), ["Application Type", "Confirm Details", "Upload Documents", "Review & Submit"]);
  const confirm = visibleSteps(AVYAY_WIZARD, v)[1]!;
  const sections = visibleSections(confirm, v);
  assert.deepEqual(
    sections.filter((s) => s.reconfirm).map((s) => s.title),
    ["Beneficiaries", "Grant for This Instalment", "Verification & Authorised Person"],
  );
  // Nothing the full form asks is lost: the folded step still validates every question.
  const blanked = { ...v, fld_statute_act: "" };
  assert.ok(validateStep(confirm, blanked).fld_statute_act, "a carried-forward answer is still required");
  // A 1st instalment of a new year walks the whole (prefilled) form.
  assert.equal(visibleSteps(AVYAY_WIZARD, renew("SR/MH/THN/03603")).length, 7);
});

test("every AVYAY path reaches Submit from the portal's own answers plus what the applicant types", () => {
  for (const id of ["SR/MH/PUN/03601", "SR/DL/NWD/03602", "SR/MH/THN/03603"]) {
    // The one question a renewal can still be asked about its account: PFMS, where it is not on record.
    const chosen = renew(id);
    const v = declare(AVYAY_WIZARD, { ...chosen, fld_auth_place: "Pune", fld_auth_person_name: "Meena Deshpande", ...(chosen.fld_pfms_on_record === "No" ? { fld_pfms_registered: "Yes" } : {}) });
    const docs = Object.fromEntries(visibleDocuments(AVYAY_WIZARD, v).map((d) => [d.n, { fileName: "x.pdf", sizeKb: 10, uploadedOn: "", verdict: { state: "verified" as const } }]));
    const check = checkApplication(AVYAY_WIZARD, v, docs, undefined, "2026-09-16");
    assert.deepEqual(check, { ok: true }, `${id}: ${check.ok ? "" : check.reason}`);
  }
});

test("a later instalment is filed on its application's ID, for the instalment's amount and no non-recurring grant", () => {
  const v: Record<string, string> = { ...renew("SR/MH/PUN/03601"), fld_auth_place: "Pune" };
  const { app } = fileApplication(STATE, { schemeCode: "AVYAY", financialYear: v.fld_financial_year!, values: v }, clock);
  assert.equal(app.id, `${v.fld_application_ref}/I2`);
  assert.equal(app.instalment, 2);
  assert.equal(app.caseType, "Ongoing");
  assert.equal(app.recurring, Number(v.fld_instalment_amount));
  assert.equal(app.nonRecurring, 0);
  assert.equal(app.total, Number(v.fld_instalment_amount));
  // The project is not offered again until that claim is decided.
  const after = { ...STATE, applications: [app, ...STATE.applications] };
  assert.equal(instalmentPlan(after, "AVYAY", "SR/MH/PUN/03601", NOW).state, "in-progress");
});

/* ── grant sought ─────────────────────────────────────────────────────────── */

test("a new project types one figure; the recurring grant and the total are worked out", () => {
  const grant = AVYAY_WIZARD.steps.find((s) => s.title === "Grant Sought & Declaration")!;
  const base = { case_type: NEW, fld_nature_of_project: "Senior Citizens' Home — 25 beneficiaries", fld_agency_type: "NGO", fld_project_state: "Maharashtra", fld_building_ownership: "Owned" };
  let v: Record<string, string> = { ...base };
  v = answerField(STATE, AVYAY_WIZARD, grant, v, "fld_grant_non_recurring", "250000", NOW);
  assert.equal(v.fld_grant_recurring, "2034140", "live: ₹20,34,140 for a 25-bed NGO home, owned, Z");
  assert.equal(v.fld_grant_total, String(2034140 + 250000));
  const editable = stepFields(grant).filter((f) => fieldVisible(f, v) && !f.auto && !isReadOnly(f, v) && /₹/.test(f.label));
  assert.deepEqual(editable.map((f) => f.name), ["fld_grant_non_recurring"]);
  const panel = avyayEntitlement({ natureOfProject: base.fld_nature_of_project, agencyType: base.fld_agency_type, projectState: base.fld_project_state, buildingOwnership: base.fld_building_ownership });
  assert.equal(panel.recurringCentral, Number(v.fld_grant_recurring), "the panel and the field agree");
});

test("a renewal's grant is read-only, from the sanctioned amount, and names the instalment", () => {
  const v = renew("SR/DL/NWD/03602");
  const confirm = visibleSteps(AVYAY_WIZARD, v)[1]!;
  const grant = visibleSections(confirm, v).find((s) => s.title === "Grant for This Instalment")!;
  const shown = grant.fields.filter((f) => fieldVisible(f, v));
  assert.ok(shown.every((f) => isReadOnly(f, v)));
  const amount = shown.find((f) => f.name === "fld_instalment_amount")!;
  assert.equal(fieldLabel(amount, v), "Amount of the 3rd Instalment — 20% (₹)");
  assert.ok(!visibleSections(confirm, v).some((s) => s.title === "Grant Sought"), "no typed grant on a renewal");
});

/* ── key functionaries ────────────────────────────────────────────────────── */

test("key functionaries are four answers each, and a half-filled optional one is caught", () => {
  const infra = AVYAY_WIZARD.steps.find((s) => s.title === "Infrastructure, Beneficiaries & Bank")!;
  const names = stepFields(infra).map((f) => f.name);
  for (const who of ["fld_incharge", "fld_key_staff_1", "fld_key_staff_2"]) {
    for (const part of ["name", "qualification", "designation", "mobile"]) assert.ok(names.includes(`${who}_${part}`), `${who}_${part}`);
  }
  assert.ok(!names.includes("fld_project_incharge"), "no 'name & contact' box");
  const errors = validateStep(infra, { case_type: NEW, fld_key_staff_2_name: "Anil Verma", fld_incharge_mobile: "12345", fld_incharge_name: "Meena 2" });
  assert.ok(errors.fld_key_staff_2_designation, "a second staff member needs a designation once named");
  assert.equal(errors.fld_key_staff_2_name, undefined);
  assert.match(errors.fld_incharge_mobile ?? "", /10-digit mobile/);
  assert.match(errors.fld_incharge_name ?? "", /letters only/);
  const clean = validateStep(infra, { case_type: NEW });
  assert.equal(clean.fld_key_staff_2_name, undefined, "left wholly blank, the optional one is not asked for");
});

/* ── DARPAN, the financial year, CCTV, the bank ────────────────────────────── */

test("NGO-Darpan's name, ID, State and District are locked, and the demo fill never writes them", () => {
  const all = AVYAY_WIZARD.steps.flatMap(stepFields);
  for (const name of ["fld_ngo_name", "fld_darpan_id", "fld_reg_office_state", "fld_reg_office_district"]) {
    assert.equal(isReadOnly(all.find((f) => f.name === name)!, {}), true, name);
  }
  for (const id of ["complete", "validation-errors", "ready-to-submit"]) {
    const v = buildScenario(id, AVYAY_WIZARD).values;
    const seed = darpanSeed(undefined);
    for (const name of ["fld_ngo_name", "fld_darpan_id", "fld_reg_office_state", "fld_reg_office_district"]) {
      assert.equal(v[name], seed[name], `${id}: ${name}`);
      assert.doesNotMatch(v[name] ?? "", /Illustrative/);
    }
  }
});

test("the demo's Complete & valid is complete and valid, for the year now running", () => {
  const { values, docs } = buildScenario("complete", AVYAY_WIZARD);
  assert.equal(values.fld_financial_year, currentFinancialYear());
  assert.deepEqual(checkApplication(AVYAY_WIZARD, { ...values, ...declarationStamp() }, docs), { ok: true });
});

test("a new application's financial year is fixed to the year now running, and says why", () => {
  const fy = AVYAY_WIZARD.steps.flatMap(stepFields).find((f) => f.name === "fld_financial_year")!;
  let v: Record<string, string> = { fld_financial_year: "2025-26" };
  v = answerField(STATE, AVYAY_WIZARD, stepOne(v), v, "case_type", NEW, NOW);
  assert.equal(v.fld_financial_year, "2026-27");
  assert.equal(isReadOnly(fy, v), true);
  assert.equal(fieldHelp(fy, v), "A new application is for the financial year now running.");
  // Since 16 Sep 2026 (audit W-09) no claim chooses its year: the instalment plan decides it, for a
  // 1st instalment as for a 2nd. An editable year let a claim be filed for the wrong one.
  assert.equal(isReadOnly(fy, renew("SR/MH/THN/03603")), true);
  assert.equal(isReadOnly(fy, renew("SR/MH/PUN/03601")), true);
});

test("a renewal is not asked about CCTV — no question, no help, no document", () => {
  for (const id of ["SR/MH/PUN/03601", "SR/MH/THN/03603"]) {
    const v = renew(id);
    const text = visibleSteps(AVYAY_WIZARD, v)
      .flatMap((s) => visibleSections(s, v))
      .flatMap((s) => s.fields.filter((f) => fieldVisible(f, v)).map((f) => `${fieldLabel(f, v)} ${fieldHelp(f, v) ?? ""}`))
      .concat(visibleDocuments(AVYAY_WIZARD, v).map((d) => d.title))
      .join(" ");
    assert.doesNotMatch(text, /CCTV/i, id);
  }
});

test("a renewal's bank account is shown once, compactly, with PFMS — and a registered account is not asked again", () => {
  const v = renew("SR/MH/PUN/03601");
  const confirm = visibleSteps(AVYAY_WIZARD, v)[1]!;
  const bank = visibleSections(confirm, v).find((s) => s.title === "Bank Account Details")!;
  assert.equal(isSummarySection(bank, v), true);
  const shown = bank.fields.filter((f) => fieldVisible(f, v)).map((f) => f.name);
  assert.deepEqual(shown, ["fld_bank_name", "fld_bank_account_number", "fld_bank_ifsc", "fld_bank_branch", "fld_pfms_status"]);
  assert.equal(v.fld_pfms_status, "Registered");
  // An account not yet registered is asked, once.
  const unregistered = renew("SR/MH/THN/03603");
  const shownThere = AVYAY_WIZARD.steps.flatMap(stepFields).filter((f) => fieldVisible(f, unregistered)).map((f) => f.name);
  assert.ok(shownThere.includes("fld_pfms_registered") && !shownThere.includes("fld_pfms_status"));
  assert.ok(!shownThere.includes("bank_ngo_name_declared"), "the account on record is not re-declared");
});

/* ── the applicant is told when the next instalment opens ─────────────────── */

test("My Applications and the dashboard say when the next instalment opens, on the latest sanctioned file only", () => {
  const files = STATE.applications.filter((a) => a.institutionId === "SR/DL/NWD/03602" && a.sanction);
  const latest = files.find((a) => a.instalment === 2)!;
  const older = files.find((a) => a.instalment === 1)!;
  const notice = nextInstalmentNotice(STATE, latest, NOW);
  assert.equal(notice?.title, "3rd Instalment is open to claim");
  assert.match(notice?.href ?? "", /scheme\/AVYAY\/step-1\?project=SR%2FDL%2FNWD%2F03602$/);
  assert.equal(nextInstalmentNotice(STATE, older, NOW), undefined);
  const upcoming = upcomingInstalments(STATE, NGO.id, NOW).filter((n) => n.plan.scheme === "AVYAY");
  assert.deepEqual(upcoming.map((n) => n.plan.projectId).sort(), ["SR/DL/NWD/03602", "SR/MH/PUN/03601", "SR/MH/THN/03603"]);
});

/* ── upload history reaches the submitted record ───────────────────────────── */

test("a document replaced on the form keeps its earlier versions on the submitted application", async () => {
  const { commitUpload } = await import("./document-centre.ts");
  const { documentsOf } = await import("./submission.ts");
  const { historyEntriesOfRecord } = await import("./document-centre.ts");
  const doc = { n: 12, title: "Budget Estimate" };
  let up = commitUpload({}, 12, { name: "budget-v1.pdf", sizeKb: 90 }, new Date("2026-09-10T09:00:00Z"));
  up = { 12: { ...up[12]!, verdict: { state: "invalid" } } };
  up = commitUpload(up, 12, { name: "budget-v2.pdf", sizeKb: 95 }, new Date("2026-09-12T09:00:00Z"));
  up = commitUpload(up, 12, { name: "budget-v3.pdf", sizeKb: 99 }, new Date("2026-09-14T09:00:00Z"));
  const [filed] = documentsOf([doc], up, (p) => `${p}-1`, "2026-09-16T10:00:00.000Z");
  assert.equal(filed!.fileName, "budget-v3.pdf");
  assert.equal(filed!.uploadedAt, "2026-09-14T09:00:00.000Z", "the upload's own time, not the submission's");
  assert.deepEqual(
    filed!.versions?.map((v) => [v.fileName, v.sizeKb, v.uploadedAt, v.replacedAt, v.verdict]),
    [
      ["budget-v1.pdf", 90, "2026-09-10T09:00:00.000Z", "2026-09-12T09:00:00.000Z", "invalid"],
      ["budget-v2.pdf", 95, "2026-09-12T09:00:00.000Z", "2026-09-14T09:00:00.000Z", "pending"],
    ],
  );
  // The officer's history log reads them back: the current file and two earlier ones.
  assert.equal(historyEntriesOfRecord(filed!).length, 3);
  // A document uploaded once carries no empty history.
  const [single] = documentsOf([doc], commitUpload({}, 12, { name: "once.pdf", sizeKb: 10 }), (p) => `${p}-2`, "2026-09-16T10:00:00.000Z");
  assert.equal(single!.versions, undefined);
});
