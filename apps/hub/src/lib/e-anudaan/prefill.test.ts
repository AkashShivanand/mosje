/**
 * A required answer the applicant cannot edit must arrive filled.
 *
 * The full-wizard walk of 13 Sep 2026 found this broken twice in one day, on two schemes, both
 * times by a change that locked a field without supplying its value: NAPDDR's renewal estimates
 * (step 7) and AVYAY's renewal bank account (step 4). Either way the applicant met a required
 * field they could not type into, and no application on that path could be submitted.
 *
 * This walks every scheme on every branch, with only what the portal itself supplies — DARPAN,
 * and what a renewal carries forward once its project is chosen — and fails on any visible,
 * required, locked field left empty. Auto-calculated fields are exempt: they fill from inputs the
 * applicant does type.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { WIZARDS, applyAllAutoFields, fieldVisible, isReadOnly, stepFields, visibleSteps } from "./form-schema.ts";
import { CARRIED_FORWARD, darpanSeed, declarationStamp } from "./prefill.ts";

const RENEWAL_PROJECT_FIELDS = ["fld_renewal_project", "fld_ongoing_source_application", "fld_smile_project_select"];

for (const [code, def] of Object.entries(WIZARDS)) {
  const caseType = def.steps.flatMap(stepFields).find((f) => f.name === "case_type");
  const branches = caseType?.options ?? [""];

  for (const branch of branches) {
    test(`${code}${branch ? ` · ${branch}` : ""}: no required locked field is left empty`, () => {
      // The declaration's date and time are the portal's to fill, like DARPAN's.
      let values: Record<string, string> = { ...darpanSeed(undefined), ...declarationStamp(), ...(branch ? { case_type: branch } : {}) };
      // Choosing the project is the applicant's act; what it brings with it is the portal's.
      const projectField = def.steps.flatMap(stepFields).find((f) => RENEWAL_PROJECT_FIELDS.includes(f.name) && fieldVisible(f, values));
      if (projectField) {
        values = { ...values, [projectField.name]: projectField.options?.[0] ?? "P-1", fld_installment_no: "1st Instalment", ...(CARRIED_FORWARD[code] ?? {}) };
      }
      values = applyAllAutoFields(def, values);

      const dead = visibleSteps(def, values)
        .flatMap(stepFields)
        .filter((f) => fieldVisible(f, values) && f.required && !f.auto && isReadOnly(f, values) && !(values[f.name] ?? "").trim())
        .map((f) => f.name);
      assert.deepEqual(dead, [], `${code} has required fields the applicant cannot fill: ${dead.join(", ")}`);
    });
  }
}

test("every scheme the applicant can pick has a form", async () => {
  // The picker lists `SEED_SCHEMES`; the route resolves `WIZARDS`. SMILE was listed as
  // "SMILE_GG" and opened "Please choose a scheme first." instead of its form.
  const { SEED_SCHEMES } = await import("./store/seed.ts");
  const orphans = SEED_SCHEMES.map((s) => s.code).filter((c) => !(c in WIZARDS));
  assert.deepEqual(orphans, []);
});

test("a submission is filed under its own project, counts its people, and keeps its uploads", async () => {
  const { projectForSubmission, beneficiariesOf, documentsOf } = await import("./submission.ts");
  const { buildSeed } = await import("./store/seed.ts");
  const ngo = buildSeed().ngos[0]!;
  // A renewal names its project on step 1.
  const renewal = projectForSubmission(ngo, "NAPDDR", { fld_renewal_project: "DR/AN/NIC/40536 — Project, Nicobar · FY 2026-27" }, 1);
  assert.equal(renewal.institutionId, "DR/AN/NIC/40536");
  assert.equal(renewal.created, undefined);
  // A new project gets a new ID, not the NGO's first project.
  const fresh = projectForSubmission(ngo, "AVYAY", { fld_project_title: "Anand Old Age Home", fld_reg_office_state: "Maharashtra", fld_reg_office_district: "Pune" }, 83626);
  assert.equal(fresh.institutionId, "SR/MH/PUN/83626");
  assert.notEqual(fresh.institutionId, ngo.institutions[0]!.id);
  assert.ok(fresh.created);
  // NAPDDR asks beneficiaries under its own field.
  assert.equal(beneficiariesOf({ fld_target_beneficiaries: "40" }).total, 40);
  // Uploads survive.
  const docs = documentsOf([{ n: 3, title: "Audit Report" }], { 3: { fileName: "audit.pdf", sizeKb: 90, uploadedOn: "", verdict: { state: "verified" } } }, (p) => `${p}-1`, "2026-09-13T00:00:00Z");
  assert.equal(docs[0]!.fileName, "audit.pdf");
});

test("the declaration is dated now and cannot be backdated", async () => {
  const { SHRESHTA_WIZARD, validateStep, stepFields: fieldsOf } = await import("./form-schema.ts");
  const step = SHRESHTA_WIZARD.steps.find((st) => fieldsOf(st).some((f) => f.name === "fld_auth_date"))!;
  const date = fieldsOf(step).find((f) => f.name === "fld_auth_date")!;
  assert.equal(date.readOnly, true, "the applicant does not type the date they sign on");
  const stamp = declarationStamp(new Date(2026, 8, 14, 9, 5));
  assert.deepEqual(stamp, { fld_auth_date: "2026-09-14", fld_auth_time: "09:05" });
  assert.match(validateStep(step, { fld_auth_date: "2015-04-01" }, "2026-09-14").fld_auth_date ?? "", /cannot be earlier than today/);
  assert.equal(validateStep(step, { fld_auth_date: "2026-09-14" }, "2026-09-14").fld_auth_date, undefined);
});

test("a SHRESHTA institution that is ongoing is filed as an ongoing case", async () => {
  // It has no case_type question; it was filed New whatever it said about itself.
  const { caseTypeOf } = await import("./submission.ts");
  assert.equal(caseTypeOf({ fld_institution_status: "Ongoing", assistance_3yrs: "Yes" }), "Ongoing");
  assert.equal(caseTypeOf({ case_type: "New project" }), "New");
  assert.equal(caseTypeOf({ case_type: "Ongoing / Renewal of an existing project" }), "Ongoing");
  assert.equal(caseTypeOf({ case_type: "Yes — existing project (select the Project ID)" }), "Ongoing");
  assert.equal(caseTypeOf({ case_type: "No — new project (Project ID auto-generated)" }), "New");
});

test("a renewal can only pick a project that is renewable, on every scheme that renews", async () => {
  const { WIZARDS: all, RENEWAL_PROJECTS, stepFields: fieldsOf } = await import("./form-schema.ts");
  for (const def of Object.values(all)) {
    const picker = def.steps.flatMap(fieldsOf).find((f) => RENEWAL_PROJECT_FIELDS.includes(f.name));
    if (!picker) continue;
    const blocked = Object.values(RENEWAL_PROJECTS).flat().filter((p) => p.stage !== "pmu-verified").map((p) => p.id);
    const offered = (picker.options ?? []).map((o) => o.split(" — ")[0]!);
    assert.ok(offered.length > 0, `${def.code} offers nothing to renew`);
    assert.deepEqual(offered.filter((id) => blocked.includes(id)), [], `${def.code} offers a project that cannot be renewed`);
    for (const o of picker.options ?? []) assert.doesNotMatch(o, /awaiting sanction/i);
  }
});

test("the old SMILE code still reaches the SMILE form", async () => {
  const { wizardFor } = await import("./form-schema.ts");
  assert.equal(wizardFor("SMILE_GG")?.code, "SMILE");
  assert.equal(wizardFor("smile")?.code, "SMILE");
  assert.equal(wizardFor("NOPE"), undefined);
});
