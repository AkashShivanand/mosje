/**
 * The six form changes the field-by-field review (15 Sep 2026) flagged as not doing what they
 * were for. Each test pins the corrected behaviour.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  AVYAY_WIZARD,
  NAPDDR_WIZARD,
  fieldLabel,
  shownHelp,
  stepFields,
  validateStep,
  visibleSteps,
  type FieldDef,
  type StepDef,
  type WizardDef,
} from "./form-schema.ts";
import { CARRIED_FORWARD, darpanSeed } from "./prefill.ts";

const NEW = { case_type: "New project" };
const REN = { case_type: "Ongoing / Renewal of an existing project" };

function find(w: WizardDef, v: Record<string, string>, name: string): { field: FieldDef; step: StepDef } {
  for (const step of visibleSteps(w, v)) {
    const field = stepFields(step).find((f) => f.name === name);
    if (field) return { field, step };
  }
  throw new Error(`${name} not visible`);
}

test("1–2: a renewal's locked bank account still tells the applicant how to change it", () => {
  for (const [w, name] of [[AVYAY_WIZARD, "fld_bank_account_id"], [NAPDDR_WIZARD, "fld_bank_account_choice"]] as const) {
    const { field } = find(w, REN, name);
    const help = shownHelp(field, REN, true);
    assert.match(help ?? "", /Project Bank Accounts/, `${w.code}: the instruction must show on the locked field`);
  }
  // Locked fields without the flag still show no help.
  const { field: total } = find(AVYAY_WIZARD, NEW, "fld_grant_total");
  assert.equal(shownHelp(total, NEW, true), undefined);
});

test("3: a new NAPDDR project does not arrive with a bank account already chosen", () => {
  assert.equal(darpanSeed(undefined).fld_bank_account_choice, undefined);
  assert.ok(CARRIED_FORWARD.NAPDDR?.fld_bank_account_choice, "a renewal carries its account forward");
  const { step } = find(NAPDDR_WIZARD, NEW, "fld_bank_account_choice");
  const errors = validateStep(step, { ...darpanSeed(undefined), ...NEW });
  assert.ok(errors.fld_bank_account_choice, "an unchosen account blocks the step");
});

test("4: a name-only field says 'name', and accepts a name typed in Devanagari", () => {
  const { field, step } = find(NAPDDR_WIZARD, NEW, "fld_project_director");
  const bad = validateStep(step, { ...NEW, [field.name]: "Sunita 123" });
  assert.equal(bad[field.name], "Enter the name using letters only — e.g. Sunita Sharma.");
  const hindi = validateStep(step, { ...NEW, [field.name]: "सुनीता शर्मा" });
  assert.equal(hindi[field.name], undefined);
});

test("5: a mobile field takes a 10-digit mobile number, not a paragraph", () => {
  const { field, step } = find(NAPDDR_WIZARD, NEW, "fld_project_director_mobile");
  const check = (v: string) => validateStep(step, { ...NEW, [field.name]: v })[field.name];
  assert.equal(check("Call the office after 5 pm"), "Enter a 10-digit mobile number — e.g. 9876543210.");
  assert.equal(check("12345"), "Enter a 10-digit mobile number — e.g. 9876543210.");
  assert.equal(check("98765 43210"), undefined);
  assert.equal(check("+91-9876543210"), undefined);
});

test("6: a renewal's grant figures read as sanctioned, and the total names the instalment", () => {
  const { field: total } = find(NAPDDR_WIZARD, REN, "fld_grant_total");
  assert.equal(fieldLabel(total, REN), "Total Sanctioned Grant-in-Aid (₹)");
  assert.match(shownHelp(total, REN, true) ?? "", /instalment you are claiming/);
  assert.equal(fieldLabel(total, NEW), "Total Grant-in-Aid Requested (₹)");
  const { field: honorarium } = find(NAPDDR_WIZARD, REN, "fld_honorarium_cost");
  assert.equal(fieldLabel(honorarium, REN), "Sanctioned Staff Honorarium (₹)");
});
