/**
 * NAPDDR forks on case_type, and our schema did not model the fork at all.
 *
 * `e-anudaan-build-defects.md` left it open: "whether NAPDDR's step 1 forks (live shows a
 * Case Type radio our schema does not model at all)". Both branches were walked on
 * 2026-09-07 and they differ by a whole step and by all but one document:
 *
 *   new project   10 steps · 12 documents
 *   renewal       11 steps ·  8 documents · + CCTV / EAT / PFMS Compliance at step 8
 *
 * These figures are the live portal's, not a preference. If one changes, the capture is the
 * thing to re-read.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { NAPDDR_WIZARD, visibleDocuments, visibleSteps } from "./form-schema.ts";
import { uploadProgress } from "./doc-verification.ts";

const NEW = { case_type: "New project" };
const REN = { case_type: "Ongoing / Renewal of an existing project" };
const titles = (v: Record<string, string>) => visibleSteps(NAPDDR_WIZARD, v).map((s) => s.title);

test("a first-time applicant gets ten steps and twelve documents", () => {
  assert.equal(visibleSteps(NAPDDR_WIZARD, NEW).length, 10);
  assert.equal(visibleDocuments(NAPDDR_WIZARD, NEW).length, 12);
});

test("a renewal gets eleven steps and eight documents", () => {
  assert.equal(visibleSteps(NAPDDR_WIZARD, REN).length, 11);
  assert.equal(visibleDocuments(NAPDDR_WIZARD, REN).length, 8);
});

test("the extra renewal step is CCTV / EAT / PFMS Compliance, at position 8", () => {
  // A first-time applicant has no previous installment to account for and no sanctioned
  // project to have installed cameras at, so the step is meaningless to them.
  assert.equal(titles(REN)[7], "CCTV / EAT / PFMS Compliance");
  assert.ok(!titles(NEW).includes("CCTV / EAT / PFMS Compliance"));
});

test("both branches keep Upload Documents and Review & Submit last, in that order", () => {
  for (const v of [NEW, REN]) {
    const t = titles(v);
    assert.deepEqual(t.slice(-2), ["Upload Documents", "Review & Submit"]);
  }
});

test("the beneficiary list is the ONE document both branches ask for", () => {
  const n = new Set(visibleDocuments(NAPDDR_WIZARD, NEW).map((d) => d.title));
  const r = new Set(visibleDocuments(NAPDDR_WIZARD, REN).map((d) => d.title));
  const shared = [...n].filter((t) => r.has(t));
  assert.deepEqual(shared, ["List of Beneficiaries — previous year"]);
});

test("a renewal is never asked for a Registration Certificate the department already holds", () => {
  const r = visibleDocuments(NAPDDR_WIZARD, REN).map((d) => d.title);
  for (const t of ["Registration Certificate", "Memorandum of Association", "PAN Card copy of the organisation"]) {
    assert.ok(!r.includes(t), `renewal should not ask for ${t}`);
  }
});

test("a first-time applicant is never asked to account for a grant they have not held", () => {
  const n = visibleDocuments(NAPDDR_WIZARD, NEW).map((d) => d.title);
  for (const t of ["Utilisation Certificate (GFR-12A)", "Provisional UCs", "Half-Yearly Progress Report"]) {
    assert.ok(!n.includes(t), `new project should not ask for ${t}`);
  }
});

test("visibleDocuments renumbers each branch from 1, so neither shows a gap", () => {
  for (const v of [NEW, REN]) {
    const ns = visibleDocuments(NAPDDR_WIZARD, v).map((d) => d.n);
    assert.deepEqual(ns, ns.map((_, i) => i + 1));
  }
});

test("step 1 asks each branch only its own questions", () => {
  const step1 = visibleSteps(NAPDDR_WIZARD, NEW)[0]!;
  const names = (v: Record<string, string>) =>
    step1.sections.flatMap((sec) => sec.fields).filter((f) => !f.showWhen || f.showWhen.equals.includes(v.case_type!)).map((f) => f.name);
  assert.ok(names(NEW).includes("fld_project_type"));
  assert.ok(!names(NEW).includes("fld_installment_no"), "a first application has no installment");
  assert.ok(!names(NEW).includes("fld_renewal_project"), "a first application has no project to renew");
  assert.ok(names(REN).includes("fld_installment_no"));
  assert.ok(names(REN).includes("fld_renewal_project"));
  assert.ok(!names(REN).includes("fld_project_type"), "a renewal carries its project type forward");
});

test("the renewal lists eight documents but only six are mandatory", () => {
  // Live's own footer says so: "Upload all 6 documents to proceed (1/8)." The provisional
  // audit report and the staff monitoring sheet carry an OPTIONAL marker. Declaring all eight
  // mandatory would hold the forward control shut on two documents live never demands.
  const docs = visibleDocuments(NAPDDR_WIZARD, REN);
  assert.equal(docs.length, 8);
  assert.equal(uploadProgress(docs, {}).total, 6);
  const optional = docs.filter((d) => d.optional).map((d) => d.title);
  assert.deepEqual(optional.sort(), ["Provisional / unaudited audit report", "Staff Monitoring Sheet"]);
});

test("every one of the new branch's twelve documents is mandatory", () => {
  // Live reads "12 / 12 uploaded" with no OPTIONAL marker anywhere on the step.
  const docs = visibleDocuments(NAPDDR_WIZARD, NEW);
  assert.equal(uploadProgress(docs, {}).total, 12);
});
