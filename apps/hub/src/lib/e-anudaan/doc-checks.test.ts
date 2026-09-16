/**
 * Every document validation in the catalogue does what its row says (doc-checks.ts), and a sample
 * file named for a check produces exactly that check's verdict wherever it is uploaded.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  CHECK_BY_ID,
  DOC_CHECKS,
  checkApplies,
  checkIdOfFile,
  deviceCheckOfBytes,
  verdictForCheck,
  type CheckVerdictId,
} from "./doc-checks.ts";
import {
  REFUSALS,
  REFUSAL_OF,
  acceptFromNote,
  docState,
  rowReason,
  sampleSubject,
  simulateCheck,
  summariseDocuments,
  topicsOfTitle,
} from "./document-centre.ts";
import { expectedDocumentYear, shiftFy, yearCheckedVerdict } from "./doc-verification.ts";

const FY = "2026-27";
const FACTS = { organisationName: "Sankalp Seva Sansthan", registrationNumber: "S/1234/2012", financialYear: FY, ifsc: "SBIN0000001", accountNumber: "123456789012" };
const CHECKLIST = [
  { n: 1, title: "Registration Certificate (Societies Registration Act 1860 / Charitable Trust) — certified copy" },
  { n: 2, title: "PAN Card of the Organisation" },
  { n: 3, title: "Annual Report of NGO — previous FY" },
  { n: 4, title: "Audited Accounts of NGO — previous FY" },
  { n: 5, title: "Bank Authorisation Letter (name, A/C no., address, IFSC / MICR)" },
  { n: 6, title: "Rent Agreement, Institution Location & Route Map" },
  { n: 7, title: "List of Employees (name, designation, category, photo ID, Aadhaar)" },
  { n: 8, title: "Provisional UCs — Grants Released Previous Year (GFR 12-A)" },
  { n: 9, title: "Budget Estimates — Current Year" },
  { n: 10, title: "Agreement Bond / PSR on Non-Judicial Stamp Paper" },
  { n: 11, title: "List of Managing Committee Members" },
  { n: 12, title: "Fire Safety Audit Report" },
];

const check = (slotN: number, fileName: string, checks = 0) => {
  const slot = CHECKLIST.find((d) => d.n === slotN)!;
  const v = simulateCheck({ slot, checklist: CHECKLIST, fileName, sizeKb: 84, applicationFy: FY, facts: FACTS, checks });
  // What the applicant sees: the year is judged again at read time.
  return yearCheckedVerdict(v, slot.title, FY);
};

const OUTCOME_STATE = { invalid: "invalid", review: "review", unavailable: "unavailable" } as const;

test("every check id is unique and every row names its evidence", () => {
  const ids = DOC_CHECKS.map((c) => c.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const c of DOC_CHECKS) {
    assert.ok(c.evidence.length > 20, `${c.id} has no evidence`);
    assert.match(c.label, /^[A-Z]/, `${c.id} label is not Title Case`);
  }
});

test("a sample's file name carries its check id", () => {
  assert.equal(checkIdOfFile("rent-agreement--validity-lapsed.pdf"), "validity-lapsed");
  assert.equal(checkIdOfFile("annual-report--valid.pdf"), "valid");
  assert.equal(checkIdOfFile("staff-list--incomplete-table-2.jpg"), "incomplete-table");
  assert.equal(checkIdOfFile("budget-2026-27.pdf"), null);
  assert.equal(checkIdOfFile("x--not-a-check.pdf"), null);
  assert.equal(sampleSubject("pan-card--wrong-document.pdf"), "PAN Card");
  assert.equal(sampleSubject("provisional-uc-of-grants--valid.pdf"), "Provisional UC of Grants");
});

/**
 * Every check that happens in the automatic check, uploaded against every document it applies
 * to, gives the outcome its catalogue row promises — and names that document in its words.
 */
test("every check-stage row produces its promised outcome on every document it applies to", () => {
  let exercised = 0;
  for (const c of DOC_CHECKS.filter((row) => row.stage === "check")) {
    for (const d of CHECKLIST) {
      const topics = topicsOfTitle(d.title);
      if (!checkApplies(c.id, topics)) continue;
      // A wrong-year row only applies where a year is asked for.
      if (c.id === "wrong-year" && !expectedDocumentYear(d.title, FY)) continue;
      // The file is about the slot's own topic, so a mismatch can only come from the check itself —
      // except "wrong document", which by definition is a file about something else.
      const subject = c.id === "wrong-document" ? (topics.has("pan") ? "rent-agreement" : "pan-card") : ([...topics][0] ?? "document");
      const fileName = `${subject}--${c.id}.pdf`;
      const v = check(d.n, fileName);
      const want = OUTCOME_STATE[c.outcome as keyof typeof OUTCOME_STATE];
      assert.equal(v.state, want, `${c.id} on "${d.title}" gave ${v.state}`);
      exercised++;
    }
  }
  assert.ok(exercised >= 60, `only ${exercised} check × document pairs exercised`);
});

test("a wrong-year sample names both years", () => {
  const v = check(3, "annual-report--wrong-year.pdf");
  assert.equal(v.state, "invalid");
  const expected = expectedDocumentYear(CHECKLIST[2]!.title, FY)!;
  assert.match(v.summary ?? "", new RegExp(`FY ${shiftFy(expected, -1)}`));
  assert.match(v.summary ?? "", new RegExp(`FY ${expected}`));
});

test("a passing sample in the wrong slot is the wrong document, named as what it is", () => {
  const v = check(3, "pan-card--valid.pdf");
  assert.equal(v.state, "invalid");
  assert.equal(v.detectedType, "PAN Card");
  assert.match(v.summary ?? "", /PAN Card uploaded instead of the Annual Report/);
});

test("a passing sample in its own slot looks right, carrying the year the slot asks for", () => {
  const v = check(3, "annual-report--valid.pdf");
  assert.equal(v.state, "verified");
  assert.equal(v.extracted?.["Financial Year"], shiftFy(FY, -1));
  assert.equal(check(2, "pan-card--wrong-document.pdf").state, "verified", "a wrong-document sample in its own slot is that document");
});

test("the outage clears on a second run; a placeholder is judged wherever it lands", () => {
  assert.equal(check(1, "registration-certificate--check-unavailable.pdf", 0).state, "unavailable");
  assert.equal(check(1, "registration-certificate--check-unavailable.pdf", 1).state, "verified");
  assert.equal(check(9, "specimen--placeholder.pdf").state, "invalid");
});

test("the check's words name the particulars, the parts and the table columns of the document in hand", () => {
  const ctx = (n: number) => {
    const title = CHECKLIST.find((d) => d.n === n)!.title;
    return { slotTitle: title, slotTopics: topicsOfTitle(title), facts: FACTS };
  };
  assert.match(verdictForCheck("missing-particulars", ctx(1)).reasons![0]!, /registration number and date of registration are not present/);
  assert.match(verdictForCheck("missing-particulars", ctx(4)).reasons![0]!, /UDIN/);
  assert.match(verdictForCheck("missing-parts", ctx(4)).reasons![0]!, /balance sheet, income & expenditure/);
  assert.match(verdictForCheck("incomplete-table", ctx(7)).reasons![0]!, /honorarium or salary/);
  assert.match(verdictForCheck("account-name", ctx(5)).reasons![0]!, /in the name of the organisation/);
  const variant = verdictForCheck("wrong-variant", ctx(8));
  assert.match(variant.summary!, /provisional Utilisation Certificate in GFR 12-A format/);
});

test("every verdict-producing check can be reached", () => {
  const ids = DOC_CHECKS.filter((c) => c.stage === "check").map((c) => c.id as CheckVerdictId);
  for (const id of ids) {
    const v = verdictForCheck(id, { slotTitle: "Rent Agreement", slotTopics: new Set(["rent"]), facts: FACTS, expectedYear: FY, priorYear: shiftFy(FY, -1) });
    assert.ok(v.summary, `${id} has no summary`);
  }
});

/* ── On the device ───────────────────────────────────────────────────────── */

const bytes = (s: string) => new Uint8Array([...s].map((ch) => ch.charCodeAt(0)));

test("the bytes of a file decide empty, locked and not-what-it-says", () => {
  assert.equal(deviceCheckOfBytes("a.pdf", new Uint8Array()), "file-empty");
  assert.equal(deviceCheckOfBytes("a.pdf", bytes("%PDF-1.7\n1 0 obj << >> endobj\ntrailer << /Root 1 0 R >>\n%%EOF")), null);
  assert.equal(deviceCheckOfBytes("a.pdf", bytes("%PDF-1.7\ntrailer << /Root 1 0 R /Encrypt 5 0 R >>\n%%EOF")), "file-locked");
  assert.equal(deviceCheckOfBytes("a.pdf", new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])), "file-unreadable");
  assert.equal(deviceCheckOfBytes("scan.jpg", new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0])), null);
  assert.equal(deviceCheckOfBytes("scan.jpg", bytes("PK")), "file-unreadable");
  assert.equal(deviceCheckOfBytes("logo.png", new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0])), null);
});

test("every refusal has row words, a reason, and an ErrorSummary line — and stops the step", () => {
  const rule = acceptFromNote("PDF / JPG / PNG · Max 5 MB per file");
  const docs = [{ n: 1, title: "PAN Card of the Organisation", optional: false }];
  for (const r of REFUSALS) {
    const attempt = { fileName: "pan.pdf", sizeKb: r === "rejected-size" ? 7373 : 12, phase: r };
    assert.equal(docState(docs[0]!, undefined, attempt), r);
    assert.ok(rowReason(r, undefined, attempt, rule), `${r} has no reason`);
    const summary = summariseDocuments(docs, {}, { 1: attempt });
    assert.equal(summary.continueBlockers.length, 1, `${r} does not stop Continue`);
    assert.doesNotMatch(summary.continueBlockers[0]!.message, /undefined/);
  }
  for (const id of ["file-empty", "file-locked", "file-unreadable"] as const) assert.ok(REFUSALS.includes(REFUSAL_OF[id]));
  assert.equal(CHECK_BY_ID["file-locked"].stage, "device");
});
