/**
 * Every scheme, every branch, walked to a submitted application through the functions the
 * wizard itself calls.
 *
 * Serious audit UX-01, 14 Sep 2026: an AVYAY application submitted with ₹2,50,000 recurring and
 * ₹2,50,000 non-recurring entered was recorded as "Requested ₹0", and its page read "Grant
 * Sought: 3 required questions unanswered" and "Verification & Authorised Person: 5 unanswered".
 * The answers on the last form step were lost between routes. This walk answers every visible
 * required question as an applicant would, one at a time through `answerField`, checks the whole
 * application with `checkApplication`, files it with `fileApplication`, and reads it back the
 * way the application page does (`answeredSections`).
 *
 * Also S01: an application nobody filled in is refused, at the first step.
 */
import { test } from "node:test";
import assert from "node:assert/strict";

import { answeredSections } from "./applicant.ts";
import { demoVerdictFor, type UploadedDoc } from "./doc-verification.ts";
import {
  WIZARDS,
  applyAllAutoFields,
  fieldVisible,
  isReadOnly,
  visibleDocuments,
  visibleOptions,
  visibleSteps,
  type FieldDef,
  type WizardDef,
} from "./form-schema.ts";
import { districtsOf } from "./geography.ts";
import { darpanSeed, declarationStamp } from "./prefill.ts";
import { buildSeed, SEED_SCHEMES } from "./store/seed.ts";
import { renewableProjects, renewalOption } from "./instalments.ts";
import { checkApplication, documentsOf } from "./submission.ts";
import { answerField, fileApplication } from "./submit-application.ts";
import type { EAnudaanState } from "./types.ts";

const seed = buildSeed();
const STATE: EAnudaanState = { version: 0, session: "ngo", schemes: SEED_SCHEMES, ...seed };
let seq = 0;
const clock = { now: "2026-09-14T10:00:00.000Z", id: (p: string) => `${p}-test-${++seq}` };

/** A valid answer to one question, in the shape its rule and kind expect. */
function answerFor(f: FieldDef, values: Record<string, string>): string {
  if (f.districtsOf) return districtsOf(values[f.districtsOf])[0] ?? "";
  // A renewal's project comes from the NGO's own sanctioned record.
  const options = visibleOptions(f, values, { [f.name]: f.optionsFrom ? renewableProjects(STATE, STATE.ngos[0]!.id, walking).map(renewalOption) : [] });
  if (options.length) return options[0] ?? "";
  switch (f.rule) {
    case "ifsc": return "SBIN0001234";
    case "pan": return "ABCPE1234F";
    case "pin": return "110001";
    case "nameAndPhone": return "Anita Kulkarni, 9876543210";
    case "lettersOnly": return "Anita Kulkarni";
    case "accountNumber": return "30112233445566";
    case "notFuture": return "2012-06-01";
    case "afterRegistration": return "2035-12-31";
    case "afterPeriodFrom": return "2026-03-31";
    default: break;
  }
  switch (f.kind) {
    case "email": return "office@sankalpseva.example.org";
    case "tel": return "9876543210";
    case "date": return "2015-04-01";
    case "time": return "10:30";
    case "number": return "250000";
    case "checkbox": return "true";
    default: return (f.maxLength ? "Sample entry".slice(0, f.maxLength) : "Sample entry");
  }
}

/** The answers that change which steps, questions and documents a form shows. */
function branchesOf(wizard: WizardDef): Record<string, string>[] {
  const controlling = new Set<string>();
  for (const s of wizard.steps) if (s.showWhen) controlling.add(s.showWhen.field);
  for (const d of wizard.documents) if (d.showWhen) controlling.add(d.showWhen.field);
  const fields = wizard.steps.flatMap((s) => s.sections.flatMap((x) => x.fields)).filter((f) => controlling.has(f.name) && f.options?.length);
  let combos: Record<string, string>[] = [{}];
  for (const f of fields) combos = combos.flatMap((c) => f.options!.map((o) => ({ ...c, [f.name]: o })));
  return combos;
}

/** Walk the form: every visible step, every visible question, answered through the wizard's own setter. */
let walking = "";
function walk(wizard: WizardDef, branch: Record<string, string>) {
  walking = wizard.code;
  let values = applyAllAutoFields(wizard, { ...darpanSeed(STATE.ngos[0]), ...declarationStamp() });
  for (let i = 0; i < visibleSteps(wizard, values).length; i++) {
    const step = visibleSteps(wizard, values)[i]!;
    if (step.kind === "documents" || step.kind === "review") continue;
    // Twice: a District's options exist only once its State is answered, and a branch answer
    // opens questions further down the same step.
    for (let pass = 0; pass < 2; pass++) {
      for (const f of step.sections.flatMap((s) => s.fields)) {
        if (!fieldVisible(f, values) || f.auto || isReadOnly(f, values)) continue;
        const want = branch[f.name] ?? ((values[f.name] ?? "").trim() ? null : answerFor(f, values));
        if (want == null || want === values[f.name]) continue;
        values = answerField(STATE, wizard, step, values, f.name, want);
      }
    }
  }
  const docs: Record<number, UploadedDoc> = {};
  for (const d of visibleDocuments(wizard, values)) {
    docs[d.n] = { fileName: `doc-${d.n}.pdf`, sizeKb: 100, uploadedOn: "14 Sep 2026", verdict: demoVerdictFor("verified", d.title, values.fld_financial_year) };
  }
  return { values, docs };
}

for (const wizard of Object.values(WIZARDS)) {
  for (const branch of branchesOf(wizard)) {
    const name = `${wizard.code} ${Object.values(branch).join(" / ") || "(single branch)"}`;

    test(`${name}: every required answer is kept and the amount is recorded`, () => {
      const { values, docs } = walk(wizard, branch);

      const check = checkApplication(wizard, values, docs, undefined, "2026-09-14");
      assert.deepEqual(check, { ok: true }, `${name}: ${check.ok ? "" : check.reason}`);

      const signed: Record<string, string> = { ...values, ...declarationStamp() };
      const list = visibleDocuments(wizard, signed);
      const { app, state } = fileApplication(
        STATE,
        { schemeCode: wizard.code, financialYear: signed.fld_financial_year ?? "2026-27", values: signed, documents: documentsOf(list, docs, clock.id, clock.now) },
        clock,
      );

      assert.ok(app.total > 0, `${name}: Requested is ₹${app.total}`);
      const gaps = answeredSections(app.schemeCode, app.formValues ?? {}).filter((s) => s.missingRequired > 0);
      assert.deepEqual(gaps.map((s) => `${s.title}: ${s.missingRequired} unanswered`), [], name);
      assert.equal(app.documents.filter((d) => d.fileName).length, list.length, `${name}: documents on the file`);
      assert.equal(state.applications[0]!.id, app.id);
      assert.equal(state.applications.length, STATE.applications.length + 1);
    });
  }
}

test("a walk covers every scheme, and both branches where a scheme forks", () => {
  const counts = Object.fromEntries(Object.values(WIZARDS).map((w) => [w.code, branchesOf(w).length]));
  for (const code of ["AVYAY", "NAPDDR", "SMILE"]) assert.ok((counts[code] ?? 0) >= 2, `${code}: ${counts[code]} branches`);
});

test("S01: the review address opened directly, with nothing filled, is refused at the first step", () => {
  for (const wizard of Object.values(WIZARDS)) {
    const values = applyAllAutoFields(wizard, { ...darpanSeed(STATE.ngos[0]), ...declarationStamp() });
    const check = checkApplication(wizard, values, {});
    assert.equal(check.ok, false, wizard.code);
    if (!check.ok) {
      assert.equal(check.stepIndex, 0, `${wizard.code} sends the applicant to step 1`);
      assert.ok(Object.keys(check.errors).length > 0, `${wizard.code} names the missing answers`);
    }
  }
});

test("S01: every form step complete but nothing uploaded stops at the upload step", () => {
  const wizard = WIZARDS.NAPDDR;
  const { values } = walk(wizard, { case_type: "New project" });
  const check = checkApplication(wizard, values, {}, undefined, "2026-09-14");
  const docsIndex = visibleSteps(wizard, values).findIndex((s) => s.kind === "documents");
  assert.equal(check.ok, false);
  if (!check.ok) {
    assert.equal(check.stepIndex, docsIndex);
    assert.match(check.reason, /Upload all \d+ mandatory documents/);
  }
});

test("S01: a forward jump checks only the steps before its target", () => {
  const wizard = WIZARDS.NAPDDR;
  const { values } = walk(wizard, { case_type: "New project" });
  const docsIndex = visibleSteps(wizard, values).findIndex((s) => s.kind === "documents");
  // Moving on to the upload step needs the form complete, not the uploads.
  assert.deepEqual(checkApplication(wizard, values, {}, docsIndex, "2026-09-14"), { ok: true });
  // A step-8 deep link with step 1 unanswered is sent back to step 1.
  const blanked = { ...values, fld_project_title: "" };
  const firstWithTitle = visibleSteps(wizard, values).findIndex((s) => s.sections.some((x) => x.fields.some((f) => f.name === "fld_project_title")));
  if (firstWithTitle >= 0) {
    const res = checkApplication(wizard, blanked, {}, docsIndex, "2026-09-14");
    assert.equal(res.ok, false);
    if (!res.ok) assert.equal(res.stepIndex, firstWithTitle);
  }
});
