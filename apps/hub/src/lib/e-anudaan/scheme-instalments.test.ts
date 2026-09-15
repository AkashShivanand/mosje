/**
 * NAPDDR, SHRESHTA Mode 2 and SMILE renewals, to the standard AVYAY was held to on 16 Sep 2026:
 * the instalment and its amount come from the sanctioned record, the picker lists the NGO's own
 * eligible projects, a later instalment asks only what changes, one application ID runs across a
 * year, the account on record is shown not asked, no CCTV on a renewal, and a new application is
 * for the year now running.
 */
import { test } from "node:test";
import assert from "node:assert/strict";

import {
  NAPDDR_WIZARD,
  RENEWAL_PICKER,
  SHRESHTA_WIZARD,
  SMILE_CASE_EXISTING,
  SMILE_CASE_NEW,
  SMILE_WIZARD,
  fieldLabel,
  fieldVisible,
  isReadOnly,
  isSummarySection,
  stepFields,
  visibleDocuments,
  visibleSections,
  visibleSteps,
  type StepDef,
  type WizardDef,
} from "./form-schema.ts";
import { currentFinancialYear, instalmentPlan, renewableProjects, renewalOption, upcomingInstalments } from "./instalments.ts";
import { darpanSeed, declarationStamp } from "./prefill.ts";
import { buildSeed, SEED_SCHEMES } from "./store/seed.ts";
import { checkApplication } from "./submission.ts";
import { answerField, fileApplication } from "./submit-application.ts";
import type { EAnudaanState } from "./types.ts";

const STATE: EAnudaanState = { version: 0, session: "ngo", schemes: SEED_SCHEMES, ...buildSeed() };
const NGO = STATE.ngos[0]!;
const NOW = new Date(2026, 8, 16);
let seq = 0;
const clock = { now: "2026-09-16T10:00:00.000Z", id: (p: string) => `${p}-s-${++seq}` };

const RENEWAL_ANSWER: Record<string, string | undefined> = {
  NAPDDR: "Ongoing / Renewal of an existing project",
  SMILE: SMILE_CASE_EXISTING,
  SHRESHTA_M2: undefined,
};
const stepOne = (w: WizardDef, v: Record<string, string>): StepDef => visibleSteps(w, v)[0]!;

/** What a clerk answers on a renewal: every declaration and undertaking, given afresh. */
function declare(w: WizardDef, v: Record<string, string>): Record<string, string> {
  const out = { ...v };
  for (const f of visibleSteps(w, out).flatMap(stepFields)) {
    if (!fieldVisible(f, out) || (out[f.name] ?? "").trim()) continue;
    if (f.name.startsWith("decl_") || f.name === "prev_instalment_utilised") out[f.name] = f.kind === "checkbox" ? "true" : "Yes";
  }
  return out;
}

/** A renewal of `projectId` under `w`, chosen the way the wizard chooses it. */
function renew(w: WizardDef, projectId: string): Record<string, string> {
  let v: Record<string, string> = { ...darpanSeed(NGO, NOW), ...declarationStamp(NOW) };
  const caseAnswer = RENEWAL_ANSWER[w.code];
  if (caseAnswer) v = answerField(STATE, w, stepOne(w, v), v, "case_type", caseAnswer, NOW);
  const option = renewableProjects(STATE, NGO.id, w.code, NOW).map(renewalOption).find((o) => o.startsWith(projectId));
  assert.ok(option, `${w.code}: ${projectId} is offered`);
  return answerField(STATE, w, stepOne(w, v), v, RENEWAL_PICKER[w.code], option!, NOW);
}

const SCHEMES: { w: WizardDef; second: string; third?: string; first: string; share: [number, number, number?] }[] = [
  { w: NAPDDR_WIZARD, second: "DR/MH/PUN/03621", third: "DR/DL/NWD/03622", first: "DR/GJ/AHM/03623", share: [40, 40, 20] },
  { w: SHRESHTA_WIZARD, second: "SC/MH/PUN/03631", third: "SC/DL/NWD/03632", first: "SC/TN/MDR/03633", share: [40, 40, 20] },
  // TG/MH/PUN/03641's New grant is sanctioned but not released, so nothing is open on it yet.
  { w: SMILE_WIZARD, second: "TG/DL/NWD/03642", first: "TG/TN/MDR/03643", share: [50, 50] },
];

for (const { w, second, third, first, share } of SCHEMES) {
  test(`${w.code}: the next instalment and its amount come from the sanctioned history`, () => {
    const p2 = instalmentPlan(STATE, w.code, second, NOW);
    assert.equal(p2.state, "open");
    assert.equal(p2.instalment, 2);
    assert.equal(p2.share, share[1]);
    assert.equal(p2.amount, Math.round((p2.annualRecurring! * share[1]) / 100));
    assert.equal(p2.appliedPrior, Math.round((p2.annualRecurring! * share[0]) / 100));
    assert.ok(p2.applicationRef, "a 2nd instalment keeps the year's application ID");
    if (third) {
      const p3 = instalmentPlan(STATE, w.code, third, NOW);
      assert.equal(p3.instalment, 3);
      assert.equal(p3.share, share[2]);
      assert.equal(p3.remaining, 0, "the 3rd instalment releases the rest of the year");
    }
    const p1 = instalmentPlan(STATE, w.code, first, NOW);
    assert.equal(p1.instalment, 1);
    assert.equal(p1.applicationRef, undefined, "a year's 1st instalment gets a new application ID");
  });

  test(`${w.code}: the renewal picker lists the NGO's own projects of this scheme, and no one else's`, () => {
    const offered = renewableProjects(STATE, NGO.id, w.code, NOW).map((p) => p.projectId);
    const mine = new Set(NGO.institutions.map((i) => i.id));
    for (const id of [second, first, ...(third ? [third] : [])]) assert.ok(offered.includes(id), id);
    for (const id of offered) assert.ok(mine.has(id), `${id} is the applicant's`);
    const prefix = { NAPDDR: "DR/", SHRESHTA_M2: "SC/", SMILE: "TG/" }[w.code as "NAPDDR"]!;
    assert.ok(offered.every((id) => id.startsWith(prefix)), "only this scheme's projects");
    const picker = w.steps.flatMap(stepFields).find((f) => f.name === RENEWAL_PICKER[w.code])!;
    assert.equal(picker.optionsFrom, "renewableProjects");
  });

  test(`${w.code}: a 2nd instalment is four steps, with only what changes open`, () => {
    const v = renew(w, second);
    assert.equal(v.claim_stage, "later-instalment");
    assert.equal(v.fld_installment_no, "2nd Instalment");
    assert.deepEqual(visibleSteps(w, v).map((s) => s.title), ["Application Type", "Confirm Details", "Upload Documents", "Review & Submit"]);
    const confirm = visibleSteps(w, v)[1]!;
    const open = visibleSections(confirm, v).filter((s) => s.reconfirm).map((s) => s.title);
    assert.ok(open.some((t) => /Beneficiar/.test(t)), open.join(" · "));
    assert.ok(open.includes("Grant for This Instalment"), open.join(" · "));
  });

  test(`${w.code}: every renewal reaches Submit and is filed on the right ID for the instalment's amount`, () => {
    for (const id of [second, first, ...(third ? [third] : [])]) {
      const chosen = renew(w, id);
      const v: Record<string, string> = declare(w, { ...chosen, ...(chosen.fld_pfms_on_record === "No" ? { fld_pfms_registered: "Yes" } : {}) });
      const docs = Object.fromEntries(visibleDocuments(w, v).map((d) => [d.n, { fileName: "x.pdf", sizeKb: 10, uploadedOn: "", verdict: { state: "verified" as const } }]));
      const check = checkApplication(w, v, docs, undefined, "2026-09-16");
      assert.deepEqual(check, { ok: true }, `${w.code} ${id}: ${check.ok ? "" : check.reason}`);
      const { app } = fileApplication(STATE, { schemeCode: w.code, financialYear: v.fld_financial_year!, values: v }, clock);
      assert.equal(app.caseType, "Ongoing");
      assert.equal(app.institutionId, id);
      assert.equal(app.total, Number(v.fld_instalment_amount));
      assert.equal(app.nonRecurring, 0);
      if (v.fld_application_ref) assert.equal(app.id, `${v.fld_application_ref}/I${app.instalment}`);
    }
  });

  test(`${w.code}: the renewal's account is a compact read-only record with PFMS; a registered one is not asked again`, () => {
    const v = renew(w, second);
    const confirm = visibleSteps(w, v)[1]!;
    const bank = visibleSections(confirm, v).find((s) => /^Bank/.test(s.title))!;
    assert.equal(isSummarySection(bank, v), true);
    for (const name of ["fld_bank_name", "fld_bank_account_number", "fld_bank_ifsc", "fld_bank_branch"]) {
      assert.equal(isReadOnly(bank.fields.find((f) => f.name === name)!, v), true, name);
      assert.ok((v[name] ?? "").trim(), `${name} is carried`);
    }
    assert.match(v.fld_bank_account_number!, /^XXXX XXXX \d{4}$/, "shown once, masked");
    const shown = bank.fields.filter((f) => fieldVisible(f, v)).map((f) => f.name);
    assert.ok(shown.includes("fld_pfms_status") && !shown.includes("fld_pfms_registered"));
  });

  test(`${w.code}: no CCTV question, help or document on a renewal`, () => {
    for (const id of [second, first]) {
      const v = renew(w, id);
      const text = visibleSteps(w, v)
        .flatMap((s) => visibleSections(s, v))
        .flatMap((s) => s.fields.filter((f) => fieldVisible(f, v)).map((f) => `${fieldLabel(f, v)} ${f.help ?? ""}`))
        .concat(visibleDocuments(w, v).map((d) => d.title))
        .join(" ");
      assert.doesNotMatch(text, /CCTV|camera|live feed|live-feed/i, `${w.code} ${id}`);
    }
  });

  test(`${w.code}: a renewal's grant is read-only and names the instalment's share`, () => {
    const v = renew(w, second);
    const confirm = visibleSteps(w, v)[1]!;
    const grant = visibleSections(confirm, v).find((s) => s.title === "Grant for This Instalment")!;
    const shown = grant.fields.filter((f) => fieldVisible(f, v));
    assert.ok(shown.length >= 3);
    assert.ok(shown.every((f) => isReadOnly(f, v)));
    assert.match(fieldLabel(shown.find((f) => f.name === "fld_instalment_amount")!, v), new RegExp(`2nd Instalment.*${share[1]}%`));
    assert.ok(!visibleSections(confirm, v).some((s) => s.fields.some((f) => fieldVisible(f, v) && f.name === "fld_grant_non_recurring")), "no typed grant on a renewal");
  });
}

test("NAPDDR renewal shows live's four grant figures: annual, this instalment, already applied, remaining", () => {
  const v = renew(NAPDDR_WIZARD, "DR/DL/NWD/03622");
  assert.equal(Number(v.fld_instalment_amount), Math.round(Number(v.fld_sanctioned_recurring) * 0.2));
  assert.equal(Number(v.fld_grant_applied_prior), Math.round(Number(v.fld_sanctioned_recurring) * 0.8));
  assert.equal(Number(v.fld_grant_remaining), 0);
});

test("a new application's financial year is locked to the year now running, on every scheme", () => {
  const cases: [WizardDef, Record<string, string>][] = [
    [NAPDDR_WIZARD, { case_type: "New project" }],
    [SMILE_WIZARD, { case_type: SMILE_CASE_NEW }],
    [SHRESHTA_WIZARD, {}],
  ];
  for (const [w, branch] of cases) {
    const fy = w.steps.flatMap(stepFields).find((f) => f.name === "fld_financial_year")!;
    let v: Record<string, string> = { fld_financial_year: "2025-26" };
    if (branch.case_type) v = answerField(STATE, w, stepOne(w, v), v, "case_type", branch.case_type, NOW);
    else v = answerField(STATE, w, stepOne(w, v), { ...v, fld_institution_select: "x" }, "fld_institution_select", "", NOW);
    assert.equal(v.fld_financial_year, currentFinancialYear(NOW), w.code);
    assert.equal(isReadOnly(fy, v), true, `${w.code}: locked`);
  }
});

test("staff and functionaries are separate answers with a contact, on NAPDDR and SMILE", () => {
  const napddr = NAPDDR_WIZARD.steps.flatMap(stepFields).map((f) => f.name);
  for (const who of ["fld_incharge", "fld_functionary_1", "fld_key_staff_1", "fld_key_staff_2"]) {
    for (const part of ["name", "qualification", "designation", "mobile"]) assert.ok(napddr.includes(`${who}_${part}`), `${who}_${part}`);
  }
  assert.ok(!napddr.includes("fld_functionary_1") && !napddr.includes("fld_project_incharge"), "no paragraph boxes");
  const smile = SMILE_WIZARD.steps.flatMap(stepFields).map((f) => f.name);
  for (const n of ["fld_head_mobile", "fld_key_person_1_mobile", "fld_site_incharge_mobile"]) assert.ok(smile.includes(n), n);
});

test("SHRESHTA: an institution not on record walks the full form; one on record gets live's ten documents", () => {
  const blank = { ...darpanSeed(NGO, NOW) };
  assert.equal(visibleSteps(SHRESHTA_WIZARD, blank).length, 7);
  const v = renew(SHRESHTA_WIZARD, "SC/TN/MDR/03633");
  assert.equal(v.fld_institution_id, "SC/TN/MDR/03633");
  assert.equal(visibleSteps(SHRESHTA_WIZARD, v).length, 7, "a year's 1st instalment walks the prefilled form");
  assert.ok(visibleDocuments(SHRESHTA_WIZARD, v).length <= 10);
});

test("a claim opens only once the instalment before it is released; a sanction alone opens nothing", () => {
  const waiting = instalmentPlan(STATE, "SMILE", "TG/MH/PUN/03641", NOW);
  assert.equal(waiting.state, "not-released");
  assert.equal(waiting.instalment, 1);
  assert.ok(!renewableProjects(STATE, NGO.id, "SMILE", NOW).some((p) => p.projectId === "TG/MH/PUN/03641"), "not offered to claim");
  const note = upcomingInstalments(STATE, NGO.id, NOW).find((n) => n.plan.projectId === "TG/MH/PUN/03641");
  assert.equal(note?.title, "1st Instalment opens once the New Grant is released");
  assert.equal(note?.href, undefined);
  // Every open demo instalment rests on a recorded release of the one before it.
  for (const scheme of ["AVYAY", "NAPDDR", "SHRESHTA_M2", "SMILE"]) {
    for (const p of renewableProjects(STATE, NGO.id, scheme, NOW)) assert.ok(p.lastSanctioned?.release, `${p.projectId} opened without a release`);
  }
  // Releasing it opens it.
  const file = STATE.applications.find((a) => a.institutionId === "TG/MH/PUN/03641" && a.sanction)!;
  const released = { ...file, release: { amount: file.sanction!.total, releasedAt: "2026-08-01T06:00:00.000Z", releasedBy: "pd-us" as const } };
  const after = { ...STATE, applications: STATE.applications.map((a) => (a.id === file.id ? released : a)) };
  assert.equal(instalmentPlan(after, "SMILE", "TG/MH/PUN/03641", NOW).state, "open");
});

test("the dashboard lists every scheme's open instalments, each where its form can claim it", () => {
  const upcoming = upcomingInstalments(STATE, NGO.id, NOW);
  for (const scheme of ["AVYAY", "NAPDDR", "SHRESHTA_M2", "SMILE"]) {
    assert.ok(upcoming.some((n) => n.plan.scheme === scheme && n.href?.includes(`/scheme/${scheme}/`)), scheme);
  }
});

test("declarations are given afresh on every renewal, never carried forward ticked", () => {
  for (const { w, second } of SCHEMES) {
    const v = renew(w, second);
    const decls = visibleSteps(w, v).flatMap(stepFields).filter((f) => fieldVisible(f, v) && f.name.startsWith("decl_"));
    assert.ok(decls.length > 0, w.code);
    for (const f of decls) assert.equal(v[f.name] ?? "", "", `${w.code}: ${f.name}`);
  }
});
