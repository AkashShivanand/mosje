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
  isReadOnly,
  isSummarySection,
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

test("1–2: a renewal's bank account is a read-only record on every scheme, with the change instruction beside it", () => {
  for (const [w, v] of [[AVYAY_WIZARD, REN], [NAPDDR_WIZARD, REN]] as const) {
    const bank = w.steps.flatMap((st) => st.sections).find((x) => /^Bank/.test(x.title))!;
    assert.ok(isSummarySection(bank, v) && !isSummarySection(bank, NEW), w.code);
  }
  // Locked fields without the flag still show no help.
  const { field: total } = find(AVYAY_WIZARD, NEW, "fld_grant_total");
  assert.equal(shownHelp(total, NEW, true), undefined);
});

test("3: a new NAPDDR project types its account, and an empty account blocks the step", () => {
  assert.equal(darpanSeed(undefined).fld_bank_account_number, undefined);
  assert.deepEqual(CARRIED_FORWARD, {}, "a renewal carries the chosen project's own account, not a constant");
  const { step } = find(NAPDDR_WIZARD, NEW, "fld_bank_account_number");
  const errors = validateStep(step, { ...darpanSeed(undefined), ...NEW });
  assert.ok(errors.fld_bank_account_number, "an empty account blocks the step");
});

test("4: a name-only field says 'name', and accepts a name typed in Devanagari", () => {
  const { field, step } = find(NAPDDR_WIZARD, NEW, "fld_incharge_name");
  const bad = validateStep(step, { ...NEW, [field.name]: "Sunita 123" });
  assert.equal(bad[field.name], "Enter the name using letters only — e.g. Sunita Sharma.");
  const hindi = validateStep(step, { ...NEW, [field.name]: "सुनीता शर्मा" });
  assert.equal(hindi[field.name], undefined);
});

test("5: a mobile field takes a 10-digit mobile number, not a paragraph", () => {
  const { field, step } = find(NAPDDR_WIZARD, NEW, "fld_incharge_mobile");
  const check = (v: string) => validateStep(step, { ...NEW, [field.name]: v })[field.name];
  assert.equal(check("Call the office after 5 pm"), "Enter a 10-digit mobile number — e.g. 9876543210.");
  assert.equal(check("12345"), "Enter a 10-digit mobile number — e.g. 9876543210.");
  assert.equal(check("98765 43210"), undefined);
  assert.equal(check("+91-9876543210"), undefined);
});

test("6: a renewal's grant figures read as sanctioned, and the amount names the instalment", () => {
  const values = { ...REN, fld_installment_no: "2nd Instalment" };
  const { field: amount } = find(NAPDDR_WIZARD, values, "fld_instalment_amount");
  assert.equal(fieldLabel(amount, values), "Recurring Grant — 2nd Instalment, 40% (₹)");
  const { field: annual } = find(NAPDDR_WIZARD, values, "fld_sanctioned_recurring");
  assert.equal(fieldLabel(annual, values), "Annual Recurring Grant (₹)");
  assert.equal(isReadOnly(annual, values) && isReadOnly(amount, values), true);
});
