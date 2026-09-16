/**
 * NAPDDR forks on case_type. The live UAT portal (NGO-NAPDDR-{NEW,RENEWAL}-S*, 07–08 Sep 2026):
 *
 *   new project   10 steps · 12 documents
 *   renewal       11 steps ·  8 documents · + "CCTV / EAT / PFMS Compliance" at step 8
 *
 * After the review call of 11 Sep 2026 the renewal keeps eleven steps but asks no CCTV question and
 * no CCTV document (T640–644), so it has seven documents; a 2nd or 3rd instalment is four steps.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { NAPDDR_WIZARD, WIZARDS, isReadOnly, isSummarySection, stepFields, visibleDocuments, visibleSteps } from "./form-schema.ts";
import { uploadProgress } from "./doc-verification.ts";

const NEW = { case_type: "New project" };
const REN = { case_type: "Ongoing / Renewal of an existing project" };
const titles = (v: Record<string, string>) => visibleSteps(NAPDDR_WIZARD, v).map((s) => s.title);

test("a first-time applicant gets live's ten steps and twelve documents", () => {
  assert.deepEqual(titles(NEW), [
    "Application Type",
    "Organisation Details",
    "Project Details",
    "Location, Infrastructure & Preparedness",
    "Functionaries, Staff & Committee",
    "Capability & Prior Work",
    "Beneficiaries, Bank & Grant",
    "Verification & Declaration",
    "Upload Documents",
    "Review & Submit",
  ]);
  assert.equal(visibleDocuments(NAPDDR_WIZARD, NEW).length, 12);
});

test("a renewal gets eleven steps, the eighth about the previous instalment, and seven documents", () => {
  assert.equal(titles(REN).length, 11);
  assert.equal(titles(REN)[7], "Previous Instalment");
  assert.ok(!titles(NEW).includes("Previous Instalment"));
  assert.equal(visibleDocuments(NAPDDR_WIZARD, REN).length, 7);
});

test("a 2nd or 3rd instalment is four steps", () => {
  assert.deepEqual(titles({ ...REN, claim_stage: "later-instalment" }), ["Application Type", "Confirm Details", "Upload Documents", "Review & Submit"]);
});

test("no CCTV question or document on a renewal; the renewal's account is a read-only record", () => {
  const fields = (v: Record<string, string>) => visibleSteps(NAPDDR_WIZARD, v).flatMap(stepFields).filter((f) => !f.showWhen || f.showWhen.equals.includes(v[f.showWhen.field] ?? ""));
  assert.ok(!fields(REN).some((f) => /cctv|live_feed/i.test(f.name)));
  assert.ok(!visibleDocuments(NAPDDR_WIZARD, REN).some((d) => /CCTV/i.test(d.title)));
  const bank = NAPDDR_WIZARD.steps.flatMap((s) => s.sections).find((s) => s.title === "Bank Account Details")!;
  assert.equal(isSummarySection(bank, REN), true);
  for (const name of ["fld_bank_name", "fld_bank_account_number", "fld_bank_ifsc", "fld_bank_branch"]) {
    assert.equal(isReadOnly(bank.fields.find((f) => f.name === name)!, REN), true, name);
  }
  const instalment = fields(REN).find((f) => f.name === "fld_installment_no")!;
  assert.equal(instalment.readOnly, true, "the instalment is stated, not chosen");
});

test("both branches keep Upload Documents and Review & Submit last, in that order", () => {
  for (const v of [NEW, REN]) assert.deepEqual(titles(v).slice(-2), ["Upload Documents", "Review & Submit"]);
});

test("the beneficiary list is the ONE document both branches ask for", () => {
  const n = new Set(visibleDocuments(NAPDDR_WIZARD, NEW).map((d) => d.title));
  const r = new Set(visibleDocuments(NAPDDR_WIZARD, REN).map((d) => d.title));
  assert.deepEqual([...n].filter((t) => r.has(t)), ["List of Beneficiaries — previous year"]);
});

test("a document keeps the SAME n on both branches", () => {
  const inNew = visibleDocuments(NAPDDR_WIZARD, NEW).find((d) => d.title.startsWith("List of Beneficiaries"));
  const inRen = visibleDocuments(NAPDDR_WIZARD, REN).find((d) => d.title.startsWith("List of Beneficiaries"));
  assert.ok(inNew && inRen);
  assert.equal(inNew.n, inRen.n);
});

test("every scheme's declared document numbers are unique, so a key can never collide", () => {
  for (const [code, w] of Object.entries(WIZARDS)) {
    const ns = w.documents.map((d) => d.n);
    assert.equal(new Set(ns).size, ns.length, `${code} has a duplicate document n`);
  }
});

test("step 1 asks each branch only its own questions", () => {
  const step1 = visibleSteps(NAPDDR_WIZARD, NEW)[0]!;
  const names = (v: Record<string, string>) => step1.sections.flatMap((sec) => sec.fields).filter((f) => !f.showWhen || f.showWhen.equals.includes(v.case_type!)).map((f) => f.name);
  assert.ok(names(NEW).includes("fld_project_type"));
  assert.ok(!names(NEW).includes("fld_installment_no"));
  assert.ok(!names(NEW).includes("fld_ongoing_source_application"));
  assert.ok(names(REN).includes("fld_installment_no"));
  assert.ok(names(REN).includes("fld_ongoing_source_application"));
  assert.ok(!names(REN).includes("fld_project_type"), "a renewal carries its project type forward");
});

test("the renewal's seven documents: five mandatory, two optional", () => {
  const docs = visibleDocuments(NAPDDR_WIZARD, REN);
  assert.equal(uploadProgress(docs, {}).mandatoryTotal, 5);
  assert.deepEqual(docs.filter((d) => d.optional).map((d) => d.title).sort(), ["Provisional / unaudited audit report", "Staff Monitoring Sheet"]);
});

test("every one of the new branch's twelve documents is mandatory, and the format line matches every upload row", () => {
  const docs = visibleDocuments(NAPDDR_WIZARD, NEW);
  assert.equal(uploadProgress(docs, {}).mandatoryTotal, 12);
  // Live UAT: "PDF / JPG / PNG · Max 5 MB per file". The header said "PDF only" over rows that
  // accepted JPG and PNG; the rows are read from this line.
  assert.equal(NAPDDR_WIZARD.documentsNote, "PDF / JPG / PNG · Max 5 MB per file");
});
