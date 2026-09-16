/**
 * SMILE forks on case_type. No live UAT capture exists; the reference is the dev-portal walk in
 * docs/research/eanudaan-user-dev.mosje.in/CAPTURE-2026-08-22.md. Since 16 Sep 2026 the fork sits on
 * its own Application Type step, and a renewal's 2nd instalment is four steps.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { SHRESHTA_WIZARD, SMILE_CASE_EXISTING, SMILE_CASE_NEW, SMILE_WIZARD, applyAllAutoFields, fieldVisible, isReadOnly, stepFields, visibleDocuments, visibleSteps } from "./form-schema.ts";

const step1 = (caseType: string) => {
  const values = { case_type: caseType };
  return stepFields(SMILE_WIZARD.steps[0]!).filter((f) => fieldVisible(f, values)).map((f) => f.name);
};

test("a new SMILE project is asked the component, the branch and the year — nothing about a project it does not have", () => {
  assert.deepEqual(step1(SMILE_CASE_NEW), ["fld_nature_of_project", "case_type", "fld_financial_year"]);
});

test("an existing SMILE project names the project, and the portal states its ID and instalment", () => {
  assert.deepEqual(step1(SMILE_CASE_EXISTING), ["fld_nature_of_project", "case_type", "fld_smile_project_select", "fld_project_id", "fld_financial_year", "fld_installment_no"]);
});

test("SMILE is not asked for the submission date or acknowledgement number", () => {
  const all = SMILE_WIZARD.steps.flatMap(stepFields).map((f) => f.name);
  assert.ok(!all.includes("fld_submitted_on"));
  assert.ok(!all.includes("fld_ack_no"));
});

test("an existing SMILE project's Project ID is filled from the project and cannot be typed over", () => {
  const values = applyAllAutoFields(SMILE_WIZARD, { case_type: SMILE_CASE_EXISTING, fld_smile_project_select: "TG/MH/PUN/03641 — Garima Greh, Pune" });
  const field = stepFields(SMILE_WIZARD.steps[0]!).find((f) => f.name === "fld_project_id")!;
  assert.equal(values.fld_project_id, "TG/MH/PUN/03641");
  assert.ok(isReadOnly(field, values) || field.auto != null);
});

test("SMILE asks for the rent agreement and the CCTV proof only when the answers call for them — and never CCTV on a renewal", () => {
  const titles = (v: Record<string, string>) => visibleDocuments(SMILE_WIZARD, v).map((d) => d.title);
  const owned = titles({ case_type: SMILE_CASE_NEW, fld_premises_ownership: "Owned", camera_live_feed: "No" });
  assert.ok(!owned.some((t) => t.startsWith("Rent Agreement")));
  assert.ok(!owned.some((t) => t.startsWith("CCTV")));
  const rented = titles({ case_type: SMILE_CASE_NEW, fld_premises_ownership: "Rented", camera_live_feed: "Yes" });
  assert.ok(rented.some((t) => t.startsWith("Rent Agreement")));
  assert.ok(rented.some((t) => t.startsWith("CCTV")));
  const renewal = titles({ case_type: SMILE_CASE_EXISTING, fld_premises_ownership: "Owned", camera_live_feed: "Yes" });
  assert.ok(!renewal.some((t) => t.startsWith("CCTV")), "a carried-forward camera answer does not bring the CCTV proof back");
  const help = SMILE_WIZARD.steps.flatMap(stepFields).map((f) => f.help ?? "").join(" ");
  assert.doesNotMatch(help, /document \d+/i);
});

test("SMILE staff and functionaries are separate answers, and every person has a contact", () => {
  const names = SMILE_WIZARD.steps.flatMap(stepFields).map((f) => f.name);
  assert.ok(!names.includes("fld_staff_roster"), "no paragraph roster");
  for (const n of ["fld_head_mobile", "fld_key_person_1_mobile", "fld_key_person_1_designation", "fld_site_incharge_mobile", "fld_site_incharge_qualification", "fld_staff_project_director_name"]) {
    assert.ok(names.includes(n), n);
  }
});

test("a 2nd SMILE instalment is four steps", () => {
  assert.deepEqual(visibleSteps(SMILE_WIZARD, { case_type: SMILE_CASE_EXISTING, claim_stage: "later-instalment" }).map((s) => s.title), ["Application Type", "Confirm Details", "Upload Documents", "Review & Submit"]);
});

test("SHRESHTA asks for the rent agreement only for a rented building, and marks nothing optional", () => {
  const base = { fld_institution_status: "Ongoing" };
  const rented = visibleDocuments(SHRESHTA_WIZARD, { ...base, fld_building_ownership: "Rented" });
  const owned = visibleDocuments(SHRESHTA_WIZARD, { ...base, fld_building_ownership: "Owned" });
  assert.equal(rented.length, 20);
  assert.equal(owned.length, 19);
  assert.ok(!owned.some((d) => d.n === 17));
  assert.equal(SHRESHTA_WIZARD.documents.filter((d) => d.optional).length, 0);
});

test("SHRESHTA on an institution's record asks live's ten documents, with no CCTV status", () => {
  const onRecord = visibleDocuments(SHRESHTA_WIZARD, { fld_institution_status: "Ongoing", fld_building_ownership: "Rented", claim_stage: "first-instalment" }).map((d) => d.title);
  assert.equal(onRecord.length, 10);
  assert.ok(!onRecord.some((t) => /CCTV/.test(t)));
});
