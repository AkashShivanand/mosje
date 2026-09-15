/**
 * The Document Centre's model: every row state, both gates, placement, history and the
 * comparison with the application's own answers (docs/plans/2026-09-16-e-anudaan-document-centre.md).
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  DOC_STATE_META,
  OTHER_ORGANISATION,
  acceptFromNote,
  applicantFacts,
  classifyFile,
  commitUpload,
  compareFindings,
  docState,
  groupDocuments,
  historyEntries,
  historyEntriesOfRecord,
  orderForAttention,
  placeFiles,
  placementSummary,
  rejectionOf,
  requestCheck,
  rowReason,
  settleChecks,
  simulateCheck,
  summariseDocuments,
  withdrawUpload,
  type DocState,
  type UploadAttempt,
} from "./document-centre.ts";
import { demoVerdictFor, withYearCheck, type UploadedDoc } from "./doc-verification.ts";
import { visibleDocuments, wizardFor } from "./form-schema.ts";

const FACTS = { organisationName: "Sankalp Seva Sansthan", registrationNumber: "51-54", financialYear: "2026-27", ifsc: "SBIN0001234", accountNumber: "XXXX 4417" };
const CHECKLIST = [
  { n: 1, title: "Registration Certificate" },
  { n: 2, title: "Budget Estimates — Current Year" },
  { n: 3, title: "Annual Report — Previous Financial Year" },
  { n: 4, title: "Annual Report — previous-to-previous financial year" },
  { n: 5, title: "Bank Authorisation Letter (name, account number, address, IFSC / MICR)" },
  { n: 6, title: "List of Managing Committee Members" },
  { n: 7, title: "Staff Monitoring Sheet", optional: true },
];
const RULE = acceptFromNote("PDF / JPG / PNG · Max 5 MB per file");
const up = (state: Parameters<typeof demoVerdictFor>[0], fileName = "x.pdf"): UploadedDoc => ({
  fileName,
  sizeKb: 200,
  uploadedOn: "14 Sep 2026",
  verdict: demoVerdictFor(state, "Registration Certificate"),
});

/* ── states ── */

test("every state in the spec's table is reachable from docState", () => {
  const reached = new Set<DocState>();
  reached.add(docState({}, undefined));
  reached.add(docState({ optional: true }, undefined));
  for (const phase of ["uploading", "failed", "rejected-type", "rejected-size"] as const) {
    reached.add(docState({}, undefined, { fileName: "a.pdf", sizeKb: 1, phase }));
  }
  for (const s of ["pending", "verified", "review", "invalid", "unavailable"] as const) reached.add(docState({}, up(s)));
  assert.deepEqual([...reached].sort(), Object.keys(DOC_STATE_META).sort());
});

test("an attempt in flight shows over a stored file, and never costs it", () => {
  const attempt: UploadAttempt = { fileName: "new.pdf", sizeKb: 10, phase: "failed" };
  assert.equal(docState({}, up("verified"), attempt), "failed");
  assert.equal(docState({}, up("verified")), "verified");
});

test("the applicant's words are consequences, never a percentage", () => {
  for (const meta of Object.values(DOC_STATE_META)) assert.doesNotMatch(meta.words, /%/);
  assert.equal(DOC_STATE_META.review.words, "Please confirm");
  assert.equal(DOC_STATE_META.invalid.words, "Doesn't match");
  assert.equal(DOC_STATE_META.unavailable.words, "Saved — an officer will check it");
});

test("a refused file names the rule it broke, in the scheme's own limits", () => {
  assert.equal(rejectionOf({ name: "big.pdf", sizeKb: 7373 }, RULE), "rejected-size");
  assert.equal(rejectionOf({ name: "letter.docx", sizeKb: 20 }, RULE), "rejected-type");
  assert.equal(rejectionOf({ name: "photo.JPG", sizeKb: 20 }, RULE), null);
  assert.equal(rejectionOf({ name: "photo.jpg", sizeKb: 20 }, acceptFromNote("PDF · Max 5 MB per file")), "rejected-type");
  assert.equal(rowReason("rejected-size", undefined, { fileName: "big.pdf", sizeKb: 7373, phase: "rejected-size" }, RULE), "This file is 7.2 MB. The limit is 5 MB.");
  assert.equal(rowReason("rejected-type", undefined, undefined, RULE), "Only PDF, JPG or PNG files can be uploaded.");
  assert.equal(acceptFromNote("PDF · Max 3 MB per file").label, "PDF · up to 3 MB each");
});

/* ── gates ── */

test("checking holds Submit but not Continue; not valid, failed and missing hold both", () => {
  const docs = withYearCheck(CHECKLIST, { 1: up("pending"), 2: up("verified"), 3: up("review"), 5: up("unavailable"), 6: up("invalid") }, "2026-27");
  const s = summariseDocuments(CHECKLIST, docs, { 4: { fileName: "ar.pdf", sizeKb: 10, phase: "failed" } });
  assert.deepEqual(s.continueBlockers.map((b) => b.n), [4, 6]);
  assert.deepEqual(s.submitBlockers.map((b) => b.n), [1, 4, 6]);
  assert.equal(s.readyRequired, 3); // verified, review, unavailable
  assert.equal(s.required, 6);
  assert.deepEqual(s.counts, { attention: 2, checking: 1, ready: 3, optional: 1 });
});

test("progress counts ready documents, not uploads — a rejected upload is not progress", () => {
  const s = summariseDocuments(CHECKLIST, { 1: up("invalid"), 2: up("invalid") });
  assert.equal(s.readyRequired, 0);
});

test("an optional document left out blocks nothing; a wrong one uploaded does", () => {
  assert.equal(summariseDocuments([{ n: 7, title: "Sheet", optional: true }], {}).continueBlockers.length, 0);
  assert.equal(summariseDocuments([{ n: 7, title: "Sheet", optional: true }], { 7: up("invalid") }).continueBlockers.length, 1);
});

test("rows needing action sort first, from a snapshot — a missing document keeps its place", () => {
  const snap: Record<number, DocState> = { 1: "verified", 2: "missing", 3: "invalid" };
  assert.deepEqual(orderForAttention(CHECKLIST.slice(0, 3), snap).map((d) => d.n), [3, 1, 2]);
});

/* ── the simulated check ── */

const check = (slotN: number, fileName: string, checks = 0) =>
  simulateCheck({ slot: CHECKLIST.find((d) => d.n === slotN)!, checklist: CHECKLIST, fileName, sizeKb: 300, applicationFy: "2026-27", facts: FACTS, checks });

test("the vendor's sample names reach every verdict", () => {
  assert.equal(check(3, "annual-report-valid.pdf").state, "verified");
  assert.equal(check(6, "committee-list-needs-review.pdf").state, "review");
  assert.equal(check(1, "wrong-document-financial-statement.pdf").state, "invalid");
  assert.equal(check(1, "registration-offline.pdf").state, "unavailable");
});

test("Check Again cannot turn a verdict round on the same file; only an outage clears", () => {
  assert.equal(check(1, "wrong-document.pdf", 0).state, check(1, "wrong-document.pdf", 3).state);
  assert.equal(check(1, "registration-offline.pdf", 1).state, "verified");
  // Same file, same answer, every time.
  assert.deepEqual(check(2, "budget-2026-27.pdf"), check(2, "budget-2026-27.pdf"));
});

test("a file that is plainly another document is named as that document", () => {
  const v = check(1, "budget-estimates.pdf");
  assert.equal(v.state, "invalid");
  assert.match(v.reasons?.[0] ?? "", /Budget Estimates — Current Year/);
});

test("another organisation's document does not match; a different IFSC asks an officer", () => {
  const org = check(1, "registration-other-org.pdf");
  assert.equal(org.state, "invalid");
  assert.equal(org.extracted?.["Organisation Name"], OTHER_ORGANISATION);
  const bank = check(5, "bank-letter-other-bank.pdf");
  assert.equal(bank.state, "review");
});

test("a file for the wrong year is judged at read time against the application's year", () => {
  const docs = { 2: { fileName: "budget-2025-26.pdf", sizeKb: 300, uploadedOn: "", verdict: check(2, "budget-valid-2025-26.pdf") } };
  assert.equal(docs[2].verdict.extracted?.["Financial Year"], "2025-26");
  assert.equal(withYearCheck(CHECKLIST, docs, "2026-27")[2]!.verdict.state, "invalid");
});

test("settleChecks resolves only what is still being checked", () => {
  const docs = { 1: { ...up("pending"), fileName: "registration-valid.pdf" }, 2: up("invalid") };
  const out = settleChecks(docs, CHECKLIST, "2026-27", FACTS);
  assert.equal(out[1]!.verdict.state, "verified");
  assert.equal(out[2]!.verdict.state, "invalid");
});

/* ── comparison ── */

test("What we found compares each extracted field with the application's answer", () => {
  const rows = compareFindings({ "Organisation Name": OTHER_ORGANISATION, "Financial Year": "2026-27", "Member Count": "5", "Account Number": "30211234417" }, FACTS, "2026-27");
  assert.deepEqual(rows.map((r) => [r.label, r.matches]), [
    ["Organisation Name", false],
    ["Financial Year", true],
    ["Member Count", undefined],
    ["Account Number", true],
  ]);
  assert.equal(rows[0]!.expected, "Sankalp Seva Sansthan");
});

test("facts are read from the application, including a renewal's chosen account", () => {
  const f = applicantFacts({ fld_ngo_name: "A", fld_bank_account_choice: "State Bank of India · XXXX 4417 · SBIN0001234 · Pune Main" });
  assert.equal(f.ifsc, "SBIN0001234");
  assert.equal(f.organisationName, "A");
});

/* ── placement ── */

test("batch placement puts each file by type and lists what it cannot place", () => {
  const items = placeFiles(
    [
      { name: "budget-2026-27.pdf", sizeKb: 400 },
      { name: "scan0043.pdf", sizeKb: 300 },
      { name: "annual-report-2024-25.pdf", sizeKb: 900 },
      { name: "annual-report-2025-26.pdf", sizeKb: 900 },
      { name: "huge-committee-members.pdf", sizeKb: 9000 },
      { name: "budget-copy.pdf", sizeKb: 400 },
    ],
    CHECKLIST,
    { 3: { fileName: "annual_2025.pdf" } },
    RULE,
    "2026-27",
  );
  assert.equal(items[0]!.n, 2);
  assert.equal(items[1]!.n, null);
  assert.equal(items[1]!.unplaced, "unrecognised");
  assert.equal(items[2]!.n, 4, "2024-25 is the previous-to-previous year of a 2026-27 application");
  assert.equal(items[3]!.n, 3);
  assert.equal(items[3]!.replaces, "annual_2025.pdf", "a placement onto a filled slot says what it replaces");
  assert.equal(items[4]!.rejected, "rejected-size");
  assert.equal(items[5]!.unplaced, "duplicate");
  assert.equal(placementSummary(items), "We placed 3 of 6 files.");
});

test("an unrecognisable name is never guessed into a slot", () => {
  assert.deepEqual(classifyFile("IMG_20260914.jpg", CHECKLIST), []);
});

/* ── history ── */

test("replacing a file keeps every earlier version, newest shown first", () => {
  let docs: Record<number, UploadedDoc> = {};
  docs = commitUpload(docs, 2, { name: "budget.pdf", sizeKb: 6 }, new Date("2026-09-14T17:02:00Z"));
  docs = settleChecks(docs, CHECKLIST, "2026-27", FACTS);
  docs = commitUpload(docs, 2, { name: "budget-v2.pdf", sizeKb: 90 }, new Date("2026-09-16T11:30:00Z"));
  docs = commitUpload(docs, 2, { name: "budget-v3.pdf", sizeKb: 95 }, new Date("2026-09-16T11:42:00Z"));
  assert.equal(docs[2]!.history?.length, 2);
  const lines = historyEntries(docs[2]);
  assert.deepEqual(lines.map((l) => [l.fileName, l.current]), [
    ["budget-v3.pdf", true],
    ["budget-v2.pdf", false],
    ["budget.pdf", false],
  ]);
  assert.equal(lines[1]!.status, "Checking…");
});

test("moving a placed file away brings back the file it replaced", () => {
  let docs: Record<number, UploadedDoc> = { 3: up("verified", "annual_2025.pdf") };
  docs = commitUpload(docs, 3, { name: "annual-report-old.pdf", sizeKb: 10 });
  docs = withdrawUpload(docs, 3, "annual-report-old.pdf");
  assert.equal(docs[3]!.fileName, "annual_2025.pdf");
  assert.equal(docs[3]!.history, undefined);
  assert.equal(withdrawUpload({ 1: up("verified", "a.pdf") }, 1, "a.pdf")[1], undefined);
});

test("Check Again counts its runs", () => {
  const docs = requestCheck({ 1: up("invalid") }, 1);
  assert.equal(docs[1]!.verdict.state, "pending");
  assert.equal(docs[1]!.checks, 1);
});

test("the officer and deficiency flows read the same log from the record", () => {
  const lines = historyEntriesOfRecord({
    fileName: "bank-v2.pdf",
    uploadedAt: "2026-09-16T10:00:00Z",
    aiVerdict: { state: "verified" },
    versions: [{ fileName: "bank.pdf", replacedAt: "2026-09-16T10:00:00Z", verdict: "invalid", note: "Replaced after the Ministry's query" }],
  });
  assert.deepEqual(lines.map((l) => [l.fileName, l.status]), [
    ["bank-v2.pdf", "Looks right"],
    ["bank.pdf", "Doesn't match"],
  ]);
  assert.equal(lines[1]!.note, "Replaced after the Ministry's query");
});

/* ── grouping, every scheme ── */

test("SHRESHTA Mode 2 keeps the live portal's six groups; other schemes split required and optional", () => {
  const sh = wizardFor("SHRESHTA_M2")!;
  const shValues = { fld_institution_status: "Ongoing", fld_building_ownership: "Rented" };
  const groups = groupDocuments("SHRESHTA_M2", visibleDocuments(sh, shValues));
  assert.deepEqual(groups.map((g) => g.title), ["Registration & Identity", "Reports & Beneficiary Records", "Financial", "Banking & Legal", "Compliance & Operations", "Supporting"]);
  assert.equal(groups.reduce((a, g) => a + g.docs.length, 0), visibleDocuments(sh, shValues).length, "every document is in exactly one group");
  for (const code of ["AVYAY", "NAPDDR", "SMILE"]) {
    const def = wizardFor(code)!;
    for (const caseType of ["New project", "Ongoing / Renewal of an existing project"]) {
      const list = visibleDocuments(def, { case_type: caseType });
      const g = groupDocuments(code, list);
      assert.equal(g.reduce((a, x) => a + x.docs.length, 0), list.length, `${code} ${caseType}`);
    }
  }
});

test("every scheme's own document names are recognised as themselves", () => {
  for (const code of ["AVYAY", "NAPDDR", "SHRESHTA_M2", "SMILE"]) {
    const def = wizardFor(code)!;
    const list = def.documents;
    for (const d of list) {
      if (/any other document/i.test(d.title)) continue;
      const name = `${d.title.replace(/[^A-Za-z0-9]+/g, "_").slice(0, 40)}.pdf`;
      const v = simulateCheck({ slot: d, checklist: list, fileName: name, sizeKb: 100, applicationFy: "2026-27", facts: FACTS });
      assert.notEqual(v.state, "invalid", `${code} · ${d.title} was judged the wrong document as ${name}: ${v.summary}`);
    }
  }
});
