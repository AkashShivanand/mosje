/**
 * SMILE's step 1 forks on `case_type`, and the fork was missed until the branch was walked on
 * live (2026-08-23). Only the NEW branch had ever been opened, so three fields the EXISTING
 * branch adds were absent from the clone and the generated Project Id was shown on both.
 *
 * The lesson these lock in: a wizard is not covered until every branch of it is.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { SHRESHTA_WIZARD, SMILE_WIZARD, fieldVisible, stepFields } from "./form-schema.ts";

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
  assert.equal(f.length, 45, "live shows 45 with both conditionals open");
  assert.ok(f.includes("fld_project_id_auto"));
  for (const absent of ["fld_smile_project_select", "fld_project_id", "fld_installment_no"]) {
    assert.ok(!f.includes(absent), `${absent} belongs to the existing-project branch only`);
  }
});

test("an existing SMILE project gets the three extra fields and loses the generated id", () => {
  const f = step1(EXISTING);
  assert.equal(f.length, 47, "live shows 47");
  assert.ok(!f.includes("fld_project_id_auto"), "live drops it on this branch");
  assert.deepEqual(f.slice(4, 8), [
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

test("SHRESHTA leaves exactly one of its twenty documents optional, so nineteen are mandatory", () => {
  // Live's own counter reads "n / 19 uploaded" against 20 slots — and contradicts itself in the
  // same breath with "Upload all 19 documents to proceed (16/20)", then reaches "20 / 19".
  const docs = SHRESHTA_WIZARD.documents;
  assert.equal(docs.length, 20);
  assert.equal(docs.filter((d) => !d.optional).length, 19);
  assert.equal(docs.find((d) => d.optional)?.n, 17, "the rented-building Rent Agreement");
});
