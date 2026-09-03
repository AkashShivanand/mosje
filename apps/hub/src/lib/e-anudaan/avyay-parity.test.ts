/**
 * AVYAY parity locks — every figure and sequence here was read off
 * eanudaan-user-dev.mosje.in on 2026-08-23, walking the NEW branch to Review.
 *
 * These exist because three of them were wrong before that walk: the checklist did not vary by
 * branch, the cost norms were the 50-beneficiary table applied to every capacity, and the panel
 * showed norms where live shows the central share.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  AVYAY_WIZARD,
  applyAutoFields,
  fieldVisible,
  avyayCostHeads,
  visibleDocuments,
  visibleSteps,
  visibleOptions,
  isReadOnly,
} from "./form-schema.ts";

const NEW = { case_type: "New project" };
const RENEWAL = { case_type: "Ongoing / Renewal of an existing project" };

test("a new project gets live's eight steps, Justification included", () => {
  assert.deepEqual(
    visibleSteps(AVYAY_WIZARD, NEW).map((s) => s.title),
    [
      "Application Type",
      "Organisation Details",
      "Project Details",
      "Justification",
      "Infrastructure, Beneficiaries & Bank",
      "Grant Sought & Declaration",
      "Upload Documents",
      "Review & Submit",
    ],
  );
});

test("a renewal gets live's seven — Justification is carried forward, not re-asked", () => {
  // The gap this locks: the old version of this test asserted the step list ONCE, with no
  // branch, so it passed while the wizard showed a renewal an eighth step live never asks for.
  // Every e-anudaan test was green throughout.
  assert.deepEqual(
    visibleSteps(AVYAY_WIZARD, RENEWAL).map((s) => s.title),
    [
      "Application Type",
      "Organisation Details",
      "Project Details",
      "Infrastructure, Beneficiaries & Bank",
      "Grant Sought & Declaration",
      "Upload Documents",
      "Review & Submit",
    ],
  );
});

test("a new project is not asked which instalment it is claiming", () => {
  // Live shows a new applicant the financial year alone. Ours rendered Installment on both
  // branches, `required`, with help text about "the selected financial year's recurring grant"
  // — so the new-project path could not be completed at all.
  const step1 = visibleSteps(AVYAY_WIZARD, NEW)[0]!;
  const names = step1.sections
    .flatMap((sec) => sec.fields)
    .filter((f) => fieldVisible(f, NEW))
    .map((f) => f.name);
  assert.deepEqual(names, ["case_type", "fld_financial_year"]);
});

test("a renewal IS asked, and for the project it is renewing", () => {
  const step1 = visibleSteps(AVYAY_WIZARD, RENEWAL)[0]!;
  const names = step1.sections
    .flatMap((sec) => sec.fields)
    .filter((f) => fieldVisible(f, RENEWAL))
    .map((f) => f.name);
  assert.deepEqual(names, [
    "case_type",
    "fld_ongoing_source_application",
    "fld_financial_year",
    "fld_installment_no",
  ]);
});

test("a new project gets live's eleven documents, in live's order", () => {
  assert.deepEqual(
    visibleDocuments(AVYAY_WIZARD, NEW).map((d) => `${d.n}. ${d.title}`),
    [
      "1. Registration Certificate",
      "2. PAN Card of the Organisation",
      "3. Annual Report of NGO — previous FY",
      "4. Annual Report of NGO — previous-to-previous FY",
      "5. Audited Accounts of NGO — previous FY",
      "6. Audited Accounts of NGO — previous-to-previous FY",
      "7. Bank Details of the Project",
      "8. Beneficiary List",
      "9. Staff List",
      "10. Rent Agreement",
      "11. Fire Safety Audit Report",
    ],
  );
});

test("a renewal gets nine, renumbered from one", () => {
  assert.deepEqual(
    visibleDocuments(AVYAY_WIZARD, RENEWAL).map((d) => `${d.n}. ${d.title}`),
    [
      "1. Registration Certificate",
      "2. Annual Report of NGO — previous FY",
      "3. Bank Details of the Project",
      "4. Beneficiary List",
      "5. Staff List",
      "6. Rent Agreement",
      "7. Budget Estimate",
      "8. Audited Accounts of Project",
      "9. Utilisation Certificate (GFR-12A)",
    ],
  );
});

test("the 25-beneficiary norms are live's, head for head and in live's row order", () => {
  assert.deepEqual(
    avyayCostHeads("Senior Citizens' Home — 25 beneficiaries").map((h) => [h.head, h.norm]),
    [
      ["Superintendent", 154553],
      ["Social Worker/ Counsellor", 98914],
      ["Yoga Therapist", 61821],
      ["Nurse", 80367],
      ["Cook", 98914],
      ["Multi-Tasking Staff (MTS)", 296741],
      ["Accountant /Clerk", 72000],
      ["Food/Nutrition (attendance-linked)", 705146],
      ["Doctor", 204009],
      ["Hygiene (attendance-linked)", 50000],
      ["Medicine/ Tests (attendance-linked)", 103035],
      ["Clothing /Oil, soap etc (attendance-linked)", 103035],
      ["Recreation and production related Charges", 61821],
      ["Water, electricity charges", 100000],
      ["Toiletries (attendance-linked)", 30000],
      ["Miscellaneous & Unforeseen", 20000],
      ["Owned Building on Z Category City (10% of Rent)", 19800],
      [
        "Non-Recurring Items including the cost of CCTV cameras and website developing charges",
        309105,
      ],
    ],
  );
});

test("a 25-beneficiary home does not draw the 50-beneficiary figures", () => {
  const h25 = avyayCostHeads("Senior Citizens' Home — 25 beneficiaries");
  const h50 = avyayCostHeads("Senior Citizens' Home — 50 beneficiaries");
  const food = (hs: readonly { head: string; norm: number }[]) =>
    hs.find((h) => h.head.startsWith("Food"))!.norm;
  const superintendent = (hs: readonly { head: string; norm: number }[]) =>
    hs.find((h) => h.head === "Superintendent")!.norm;

  assert.equal(food(h50), food(h25) * 2, "food scales with the residents fed");
  assert.equal(superintendent(h50), superintendent(h25), "one Superintendent either way");
});

test("the panel's derived figures reproduce live's summary for a 25-bed Z-category home", () => {
  const heads = avyayCostHeads("Senior Citizens' Home — 25 beneficiaries");
  const recurringAllowed = heads.filter((h) => !h.nonRecurring).reduce((a, h) => a + h.norm, 0);
  const nonRecurring = heads.filter((h) => h.nonRecurring).reduce((a, h) => a + h.norm, 0);
  const attendance = heads.filter((h) => h.attendanceLinked).reduce((a, h) => a + h.norm, 0);
  const ownedLine = heads.find((h) => h.head.startsWith("Owned Building"))!.norm;
  const ownedDeduction = ownedLine * 10 - ownedLine;

  assert.equal(recurringAllowed + ownedDeduction, 2438356, "live: Norm ₹24,38,356");
  assert.equal(ownedDeduction, 178200, "live: less ₹1,78,200 because the building is owned");
  assert.equal(attendance, 991216, "live: ₹9,91,216 is attendance-linked");
  assert.equal(nonRecurring, 309105, "live: non-recurring norm ₹3,09,105");

  // Live's value column is the central share, and its Total adds the two shares.
  const share = 90;
  const recurringCentral = Math.round((recurringAllowed * share) / 100);
  const nonRecurringCentral = Math.round((nonRecurring * share) / 100);
  assert.equal(recurringCentral, 2034140, "live: ₹20,34,140");
  assert.equal(nonRecurringCentral, 278195, "live: ₹2,78,195");
  assert.equal(recurringCentral + nonRecurringCentral, 2312335, "live: Total ₹23,12,335");
});

test("choosing a bank account fills the three fields live fills for you", () => {
  const step = AVYAY_WIZARD.steps.find((s) => s.title === "Infrastructure, Beneficiaries & Bank")!;
  const chosen = "State Bank of India · ••••••••••4417 · SBIN0001234";

  const filled = applyAutoFields(step, { fld_bank_account_id: chosen });

  assert.equal(filled.fld_bank_account_number, "••••••••••4417");
  assert.equal(filled.fld_bank_ifsc, "SBIN0001234");
  assert.equal(filled.fld_bank_name_branch, "State Bank of India");
});

test("the three bank fields stay empty until an account is chosen", () => {
  const step = AVYAY_WIZARD.steps.find((s) => s.title === "Infrastructure, Beneficiaries & Bank")!;
  const filled = applyAutoFields(step, {});
  assert.equal(filled.fld_bank_account_number, "");
  assert.equal(filled.fld_bank_ifsc, "");
});

test("city category is derived from the project district, not left blank", () => {
  const step = AVYAY_WIZARD.steps.find((s) => s.title === "Project Details")!;
  const blank = applyAutoFields(step, {});
  assert.equal(blank.fld_city_category, undefined, "nothing to derive it from yet");

  const filled = applyAutoFields(step, { fld_project_district: "Pune" });
  assert.ok(
    (filled.fld_city_category ?? "").length > 0,
    "a chosen district must produce a category — it is required and read-only, so nothing else can",
  );
});

test("Physiotherapy Clinic and Mobile Medicare Unit are offered to renewals only", () => {
  // FR-NEW-04, stated in the field's own help. Before this the two were named in the help text
  // and were not in the options array at all, so the sentence promised project types the field
  // never offered to anybody, and nothing enforced the rule either way.
  const nature = AVYAY_WIZARD.steps
    .flatMap((s) => s.sections)
    .flatMap((sec) => sec.fields)
    .find((f) => f.name === "fld_nature_of_project")!;

  assert.ok(!visibleOptions(nature, NEW).includes("Physiotherapy Clinic"));
  assert.ok(!visibleOptions(nature, NEW).includes("Mobile Medicare Unit"));
  assert.ok(visibleOptions(nature, RENEWAL).includes("Physiotherapy Clinic"));
  assert.ok(visibleOptions(nature, RENEWAL).includes("Mobile Medicare Unit"));
  assert.equal(visibleOptions(nature, NEW).length, visibleOptions(nature, RENEWAL).length - 2);
});

test("the bank account is fixed on a renewal and choosable on a new project", () => {
  // "Carried forward from this project — it cannot be changed on a renewal" was help text with
  // nothing behind it; the field was fully editable on both branches.
  const bank = AVYAY_WIZARD.steps
    .flatMap((s) => s.sections)
    .flatMap((sec) => sec.fields)
    .find((f) => f.name === "fld_bank_account_id")!;

  assert.equal(isReadOnly(bank, RENEWAL), true);
  assert.equal(isReadOnly(bank, NEW), false);
});
