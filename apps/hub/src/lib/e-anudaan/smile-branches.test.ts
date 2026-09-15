/**
 * SMILE's step 1 forks on `case_type`, and the fork was missed until the branch was walked on
 * live (2026-08-23). Only the NEW branch had ever been opened, so three fields the EXISTING
 * branch adds were absent from the clone and the generated Project Id was shown on both.
 *
 * The lesson these lock in: a wizard is not covered until every branch of it is.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { SHRESHTA_WIZARD, SMILE_WIZARD, applyAllAutoFields, fieldVisible, isReadOnly, stepFields, visibleDocuments } from "./form-schema.ts";

const NEW = "No — new project (Project ID auto-generated)";
const EXISTING = "Yes — existing project (select the Project ID)";

const step1 = (caseType: string) => {
  const values = { case_type: caseType, website_available: "Yes", fcra_80g: "Yes" };
  return stepFields(SMILE_WIZARD.steps[0]!)
    .filter((f) => fieldVisible(f, values))
    .map((f) => f.name);
};

test("a new SMILE project gets the generated Project Id and none of the existing-project fields", () => {
  const f = step1(NEW);
  // Live shows 45; the two questions the system answers itself on submit — the submission date
  // and the acknowledgement number — are no longer asked of the applicant.
  assert.equal(f.length, 43, "45 on live, less the two system-issued values");
  assert.ok(f.includes("fld_project_id_auto"));
  for (const absent of ["fld_smile_project_select", "fld_project_id", "fld_installment_no"]) {
    assert.ok(!f.includes(absent), `${absent} belongs to the existing-project branch only`);
  }
});

test("an existing SMILE project gets the three extra fields and loses the generated id", () => {
  const f = step1(EXISTING);
  assert.equal(f.length, 45, "47 on live, less the two system-issued values");
  assert.ok(!f.includes("fld_project_id_auto"), "live drops it on this branch");
  assert.deepEqual(f.slice(2, 6), [
    "case_type",
    "fld_smile_project_select",
    "fld_project_id",
    "fld_installment_no",
  ], "live's order, straight after case_type");
});

test("the two branches differ by exactly those four fields, and nothing else", () => {
  const a = new Set(step1(NEW));
  const b = new Set(step1(EXISTING));
  const onlyNew = [...a].filter((x) => !b.has(x));
  const onlyExisting = [...b].filter((x) => !a.has(x));
  assert.deepEqual(onlyNew, ["fld_project_id_auto"]);
  assert.deepEqual(onlyExisting, [
    "fld_smile_project_select",
    "fld_project_id",
    "fld_installment_no",
  ]);
});

test("SMILE is not asked for the submission date or acknowledgement number", () => {
  const all = SMILE_WIZARD.steps.flatMap(stepFields).map((f) => f.name);
  assert.ok(!all.includes("fld_submitted_on"));
  assert.ok(!all.includes("fld_ack_no"));
});

test("an existing SMILE project's Project ID is filled from the project and cannot be typed over", () => {
  const values = applyAllAutoFields(SMILE_WIZARD, { case_type: EXISTING, fld_smile_project_select: "TG/MH/PUN/09003 — Garima Greh, Pune" });
  const field = stepFields(SMILE_WIZARD.steps[0]!).find((f) => f.name === "fld_project_id")!;
  assert.equal(values.fld_project_id, "TG/MH/PUN/09003");
  assert.ok(isReadOnly(field, values) || field.auto != null);
});

test("SMILE asks for the rent agreement and the CCTV proof only when the answers call for them", () => {
  const titles = (v: Record<string, string>) => visibleDocuments(SMILE_WIZARD, v).map((d) => d.title);
  const owned = titles({ fld_premises_ownership: "Owned", camera_live_feed: "No" });
  assert.ok(!owned.some((t) => t.startsWith("Rent Agreement")));
  assert.ok(!owned.some((t) => t.startsWith("CCTV")));
  const rented = titles({ fld_premises_ownership: "Rented", camera_live_feed: "Yes" });
  assert.ok(rented.some((t) => t.startsWith("Rent Agreement")));
  assert.ok(rented.some((t) => t.startsWith("CCTV")));
  // No help text points at a document by number; the position changes with the answers.
  const help = SMILE_WIZARD.steps.flatMap(stepFields).map((f) => f.help ?? "").join(" ");
  assert.doesNotMatch(help, /document \d+/i);
});

test("SHRESHTA asks for the rent agreement only for a rented building, and marks nothing optional", () => {
  // Live's own counter reads "n / 19 uploaded" against 20 slots; ours printed "19 / 19 uploaded ·
  // All mandatory" over twenty with one OPTIONAL, while that one was "Required when rented".
  const base = { fld_institution_status: "Ongoing" };
  const rented = visibleDocuments(SHRESHTA_WIZARD, { ...base, fld_building_ownership: "Rented" });
  const owned = visibleDocuments(SHRESHTA_WIZARD, { ...base, fld_building_ownership: "Owned" });
  assert.equal(rented.length, 20);
  assert.equal(owned.length, 19);
  assert.ok(!owned.some((d) => d.n === 17));
  assert.equal(SHRESHTA_WIZARD.documents.filter((d) => d.optional).length, 0);
});
