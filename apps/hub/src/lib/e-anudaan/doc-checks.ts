/**
 * Every validation an e-Anudaan document can fail, as ONE catalogue.
 *
 * Evidence: 328 live captures of the vendor's portal (`tools/design-audit/projects/e-anudaan/
 * captures/live`), 177 distinct validation messages among them, grouped by what the live checker
 * was judging. `source: "live"` rows quote the portal; `source: "practice"` rows are checks the live
 * portal does not make and a document service should — a password-protected PDF cannot be read by
 * the checker or opened by the officer, and a file whose bytes are not what its name says is the
 * commonest way a broken upload reaches a reviewer. Plan: docs/plans/2026-09-17-e-anudaan-
 * validations-demo-section-d-mobile.md, Phase 1.
 *
 * Three stages, in the order a file meets them:
 *
 *   device — decided on the applicant's own device, before anything is sent. The file never becomes
 *            the document's upload; a good file already there is kept.
 *   upload — the transfer itself.
 *   check  — the automatic check, after the file arrives. `invalid` stops the step, `review` asks
 *            the applicant to look and stops nothing (an officer confirms), `unavailable` routes the
 *            file to a hand check.
 *
 * The prototype's checker reads a check id from a sample file's name — `rent-agreement--
 * validity-lapsed.pdf` — so every row below can be rehearsed with a real file (Phase 2).
 */

import type { ApplicantFacts } from "./document-centre.ts";
import type { DocVerdict } from "./doc-verification.ts";

export type CheckStage = "device" | "upload" | "check";
export type CheckOutcome = "refused" | "failed" | "invalid" | "review" | "unavailable";

export type DeviceCheckId = "file-type" | "file-size" | "file-empty" | "file-locked" | "file-unreadable";
export type CheckVerdictId =
  | "placeholder"
  | "wrong-document"
  | "wrong-year"
  | "wrong-variant"
  | "missing-particulars"
  | "missing-parts"
  | "other-organisation"
  | "account-name"
  | "blank-template"
  | "validity-lapsed"
  | "not-notarised"
  | "unsigned"
  | "incomplete-table"
  | "address-mismatch"
  | "bank-mismatch"
  | "illegible"
  | "check-unavailable";
export type CheckId = DeviceCheckId | "upload-interrupted" | CheckVerdictId;

/**
 * What a document is about. Shared with `document-centre.ts`'s TOPICS, which reads the same keys
 * from a title or a file name. `"any"` is every document.
 */
export type Topic =
  | "registration" | "pan" | "annual-report" | "accounts" | "budget" | "uc" | "provisional" | "bank"
  | "bond" | "rent" | "staff" | "beneficiaries" | "committee" | "compliance" | "eat" | "income" | "moa"
  | "infrastructure" | "fire" | "progress" | "justification" | "monitoring";

export interface DocCheck {
  id: CheckId;
  stage: CheckStage;
  outcome: CheckOutcome;
  /** Title Case, for the demo rail and the officer's reference. */
  label: string;
  /** The documents it can apply to. */
  appliesTo: readonly Topic[] | "any";
  source: "live" | "practice";
  /** The live portal's words, or why a practice check exists. */
  evidence: string;
}

/** Documents that name a financial year. */
const YEARED: readonly Topic[] = ["annual-report", "accounts", "budget", "uc", "provisional", "eat", "income", "progress"];

export const DOC_CHECKS: readonly DocCheck[] = [
  // ── On the device ──────────────────────────────────────────────────────────
  { id: "file-type", stage: "device", outcome: "refused", label: "Wrong File Type", appliesTo: "any", source: "live",
    evidence: "“PDF / JPG / PNG · Max 5 MB per file” (NAPDDR) · “PDF · Max 5 MB per file” (AVYAY)" },
  { id: "file-size", stage: "device", outcome: "refused", label: "Over the Size Limit", appliesTo: "any", source: "live",
    evidence: "“Max 5 MB per file” — stated beside every live upload step; a larger file is refused before it is sent." },
  { id: "file-empty", stage: "device", outcome: "refused", label: "Empty File", appliesTo: "any", source: "practice",
    evidence: "A 0 KB file is what a failed scan or an interrupted download leaves behind; sending it wastes a check and an officer's time." },
  { id: "file-locked", stage: "device", outcome: "refused", label: "Password-Protected PDF", appliesTo: "any", source: "practice",
    evidence: "Bank statements and e-stamp certificates are commonly issued encrypted. Neither the checker nor the officer can open one." },
  { id: "file-unreadable", stage: "device", outcome: "refused", label: "File Is Not What Its Name Says", appliesTo: "any", source: "practice",
    evidence: "A renamed .docx or a truncated download named .pdf passes an extension check and fails every reader after it." },
  // ── The transfer ───────────────────────────────────────────────────────────
  { id: "upload-interrupted", stage: "upload", outcome: "failed", label: "Upload Interrupted", appliesTo: "any", source: "live",
    evidence: "“Upload failed. RETRY”" },
  // ── The automatic check — not valid ───────────────────────────────────────
  { id: "placeholder", stage: "check", outcome: "invalid", label: "Placeholder or Test File", appliesTo: "any", source: "live",
    evidence: "“✗ Document not valid — Test/placeholder document” · “The document contains no legible information relevant to the grant application.”" },
  { id: "wrong-document", stage: "check", outcome: "invalid", label: "Wrong Document", appliesTo: "any", source: "live",
    evidence: "“Wrong document: PAN card uploaded instead of Annual Report for 2025-26.” · “this is a bank authorization letter, not a Registration Certificate”" },
  { id: "wrong-year", stage: "check", outcome: "invalid", label: "Wrong Financial Year", appliesTo: YEARED, source: "live",
    evidence: "“Document is an annual report for 2024-25, but 2025-26 is required.”" },
  { id: "wrong-variant", stage: "check", outcome: "invalid", label: "Wrong Format of the Right Document", appliesTo: ["uc", "provisional", "accounts"], source: "live",
    evidence: "“Wrong document: this is an audited UC for 2024-25, but a provisional UC for current…” · “please upload the GFR 12-A format certificate”" },
  { id: "missing-particulars", stage: "check", outcome: "invalid", label: "Required Particulars Missing", appliesTo: ["registration", "pan", "annual-report", "accounts", "uc", "provisional", "bank", "budget"], source: "live",
    evidence: "“The registration number is not present.” · “The organisation name is not present.” · “must include a Chartered Accountant's declaration, signature”" },
  { id: "missing-parts", stage: "check", outcome: "invalid", label: "Required Parts Missing", appliesTo: ["accounts", "income"], source: "live",
    evidence: "“The document must contain the balance sheet, income & expenditure statement, and auditor's report”" },
  { id: "other-organisation", stage: "check", outcome: "invalid", label: "Another Organisation's Document", appliesTo: "any", source: "practice",
    evidence: "The live checker extracts “Organisation Name” from every file and never compares it with the application; a sister organisation's certificate passes." },
  { id: "account-name", stage: "check", outcome: "invalid", label: "Account Not in the Organisation's Name", appliesTo: ["bank"], source: "live",
    evidence: "“The account must be in the name of the NGO/VO, and it must be used for this project”" },
  // ── The automatic check — check the details ────────────────────────────────
  { id: "blank-template", stage: "check", outcome: "review", label: "Blank or Unfilled Template", appliesTo: ["rent", "bond", "staff", "beneficiaries", "committee"], source: "live",
    evidence: "“⚠ Needs review — Rent Agreement Template (blank/unfilled)” · “Monthly rent amount must be clearly stated and filled in the document.”" },
  { id: "validity-lapsed", stage: "check", outcome: "review", label: "Validity Does Not Cover the Year", appliesTo: ["rent", "registration", "fire"], source: "live",
    evidence: "“Agreement must show commencement and expiry dates covering the current financial year”" },
  { id: "not-notarised", stage: "check", outcome: "review", label: "Not Notarised", appliesTo: ["rent", "bond"], source: "live",
    evidence: "“No notarisation seal or certificate visible. Agreement must be notarised as per…”" },
  { id: "unsigned", stage: "check", outcome: "review", label: "Signature or Seal Missing", appliesTo: ["uc", "provisional", "accounts", "bank", "bond"], source: "live",
    evidence: "“The document must include a Chartered Accountant's declaration, signature and…”" },
  { id: "incomplete-table", stage: "check", outcome: "review", label: "Table Incomplete", appliesTo: ["staff", "beneficiaries", "committee", "budget"], source: "live",
    evidence: "“Staff list must include category, honorarium/salary, and period of employment for…” · “formal role designations are not explicitly stated”" },
  { id: "address-mismatch", stage: "check", outcome: "review", label: "Address Differs From the Application", appliesTo: ["rent", "fire", "infrastructure"], source: "live",
    evidence: "“Full project address must be filled in the agreement and match the grant application”" },
  { id: "bank-mismatch", stage: "check", outcome: "review", label: "Bank Details Differ From the Application", appliesTo: ["bank"], source: "live",
    evidence: "“The account number appears to be 13 digits (…); please verify this is…”" },
  { id: "illegible", stage: "check", outcome: "review", label: "Illegible Scan", appliesTo: "any", source: "live",
    evidence: "“OCR quality is poor in places … Automatic verification confidence is 82% (needs 90%).”" },
  { id: "check-unavailable", stage: "check", outcome: "unavailable", label: "Automatic Check Unavailable", appliesTo: "any", source: "live",
    evidence: "“Automatic check unavailable — We could not check this document automatically. Your upload is saved and a reviewer will verify it by hand”" },
];

export const CHECK_BY_ID: Readonly<Record<CheckId, DocCheck>> = Object.fromEntries(DOC_CHECKS.map((c) => [c.id, c])) as Record<CheckId, DocCheck>;

/** Whether a check can apply to a document about these topics. */
export function checkApplies(id: CheckId, topics: ReadonlySet<string>): boolean {
  const c = CHECK_BY_ID[id];
  return c.appliesTo === "any" || c.appliesTo.some((t) => topics.has(t));
}

/** The checks a document can fail, in catalogue order. */
export function checksFor(topics: ReadonlySet<string>): DocCheck[] {
  return DOC_CHECKS.filter((c) => checkApplies(c.id, topics));
}

/* ── Sample file names ───────────────────────────────────────────────────── */

/** `rent-agreement--validity-lapsed.pdf` → `validity-lapsed`; `annual-report--valid.pdf` → `valid`. */
export function checkIdOfFile(fileName: string): CheckId | "valid" | null {
  const m = /--([a-z][a-z-]*?)(?:-\d+)?\.[a-z0-9]+$/i.exec(fileName);
  const id = m?.[1]?.toLowerCase();
  if (!id) return null;
  if (id === "valid") return "valid";
  return id in CHECK_BY_ID ? (id as CheckId) : null;
}

/* ── Device checks, on the file's own bytes ──────────────────────────────── */

const startsWith = (b: Uint8Array, sig: readonly number[]) => sig.every((v, i) => b[i] === v);

/**
 * What the bytes of a file say, before it is sent. Pure: the upload step reads the file and passes
 * the bytes. `null` means the file is what its name claims and can be opened.
 *
 * - an empty file is empty whatever it is called;
 * - a `.pdf` must begin `%PDF-`, a `.png` with the PNG signature, a `.jpg` with `FF D8 FF`;
 * - a PDF carrying an `/Encrypt` dictionary cannot be read without its password.
 */
export function deviceCheckOfBytes(fileName: string, bytes: Uint8Array): Extract<DeviceCheckId, "file-empty" | "file-locked" | "file-unreadable"> | null {
  if (bytes.length === 0) return "file-empty";
  const ext = /\.([a-z0-9]+)$/i.exec(fileName)?.[1]?.toLowerCase();
  if (ext === "pdf") {
    if (!startsWith(bytes, [0x25, 0x50, 0x44, 0x46, 0x2d])) return "file-unreadable";
    // Latin-1 decoding keeps one character per byte, so a dictionary key is found where it sits.
    let text = "";
    const CHUNK = 0x8000;
    for (let i = 0; i < bytes.length; i += CHUNK) text += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
    if (/\/Encrypt\s/.test(text)) return "file-locked";
    return null;
  }
  if (ext === "png") return startsWith(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]) ? null : "file-unreadable";
  if (ext === "jpg" || ext === "jpeg") return startsWith(bytes, [0xff, 0xd8, 0xff]) ? null : "file-unreadable";
  return null;
}

/* ── Verdicts for each check ─────────────────────────────────────────────── */

export interface CheckContext {
  /** The document the slot asks for. */
  slotTitle: string;
  slotTopics: ReadonlySet<string>;
  /** What the file is, where its name says: "PAN Card". */
  fileIs?: string;
  facts: ApplicantFacts;
  /** The year the slot requires, where it requires one. */
  expectedYear?: string;
  /** The year before `expectedYear`, for a file one year out. */
  priorYear?: string;
}

/** The particulars a document must carry, by topic — what "Required Particulars Missing" names. */
const PARTICULARS: ReadonlyArray<readonly [Topic, string, string]> = [
  ["registration", "registration number and date of registration", "Registration Number"],
  ["pan", "Permanent Account Number of the organisation", "PAN"],
  ["annual-report", "financial year and the activities undertaken in it", "Financial Year"],
  ["accounts", "Chartered Accountant's name, membership number and UDIN", "UDIN"],
  ["uc", "grant sanction number and the amount utilised", "Sanction Number"],
  ["provisional", "grant sanction number and the amount utilised", "Sanction Number"],
  ["bank", "account number, IFSC and the account holder's name", "Account Number"],
  ["budget", "head-wise estimates for the year", "Head-wise Estimates"],
];

const TABLE_COLUMNS: ReadonlyArray<readonly [Topic, string]> = [
  ["staff", "category, honorarium or salary, and period of employment"],
  ["beneficiaries", "date of admission and category"],
  ["committee", "designation of each member (President, Secretary, Treasurer)"],
  ["budget", "the amount against each head"],
];

const firstOf = <T,>(list: ReadonlyArray<readonly [Topic, ...T[]]>, topics: ReadonlySet<string>) =>
  list.find(([t]) => topics.has(t));

/**
 * The verdict a check produces for a slot, in the live checker's register.
 *
 * `wrong-year` returns a file that CARRIES the prior year and otherwise looks right: the year is
 * judged at read time by `yearCheckedVerdict`, so a year that later becomes right (the applicant
 * moves the application's financial year) is re-judged rather than frozen.
 */
export function verdictForCheck(id: CheckVerdictId, ctx: CheckContext): DocVerdict {
  const { slotTitle: title, facts } = ctx;
  const org = facts.organisationName ?? "the organisation";
  const base: Record<string, string> = { "Organisation Name": facts.organisationName ?? "Not found" };
  if (ctx.expectedYear) base["Financial Year"] = ctx.expectedYear;

  switch (id) {
    case "placeholder":
      return { state: "invalid", detectedType: "Test or placeholder document", confidence: 98,
        summary: `This appears to be a test or placeholder file, not the ${title}.`,
        reasons: ["The document contains no legible information relevant to the grant application.", `Please upload the actual ${title}.`] };

    case "wrong-document": {
      const is = ctx.fileIs ?? "a different document";
      return { state: "invalid", detectedType: is, confidence: 94, extracted: { "Organisation Name": facts.organisationName ?? "Not found" },
        summary: `Wrong document: ${is} uploaded instead of the ${title}.`,
        reasons: [`This is ${/^[aeiou]/i.test(is) ? "an" : "a"} ${is}, not the ${title}.`, `Please upload the ${title}. If this file is needed, upload it against its own document.`] };
    }

    case "wrong-year": {
      const found = ctx.priorYear ?? "an earlier year";
      if (!ctx.expectedYear) {
        return { state: "invalid", detectedType: title, confidence: 97, extracted: base,
          summary: `This ${title} does not pertain to the financial year the application is for.`,
          reasons: [`Please upload the ${title} for the year the application is for.`] };
      }
      return { state: "verified", detectedType: title, confidence: 97, extracted: { ...base, "Financial Year": found },
        summary: `${title} identified, for FY ${found}.` };
    }

    case "wrong-variant": {
      const provisional = ctx.slotTopics.has("provisional");
      const want = provisional ? "a provisional Utilisation Certificate in GFR 12-A format" : ctx.slotTopics.has("uc") ? "a Utilisation Certificate in GFR 12-A format" : "audited accounts signed by a Chartered Accountant";
      const got = provisional ? "an audited Utilisation Certificate" : ctx.slotTopics.has("uc") ? "a utilisation statement not in GFR 12-A format" : "unaudited accounts prepared by the organisation";
      return { state: "invalid", detectedType: got.replace(/^an? /, ""), confidence: 93, extracted: base,
        summary: `Wrong format: this is ${got}, but the slot needs ${want}.`,
        reasons: [`This is ${got}.`, `Please upload ${want}.`] };
    }

    case "missing-particulars": {
      const p = firstOf(PARTICULARS, ctx.slotTopics);
      const what = p?.[1] ?? "the particulars this document must carry";
      const field: string | undefined = p?.[2];
      const extracted = { ...base, ...(field ? { [field]: "Not found" } : {}) };
      return { state: "invalid", detectedType: title, confidence: 91, extracted,
        summary: `The ${title} is missing its ${what}.`,
        reasons: [`The ${what} ${/ and | or /.test(what) ? "are" : "is"} not present.`, `Please upload a clear copy of the complete ${title}.`] };
    }

    case "missing-parts":
      return { state: "invalid", detectedType: title, confidence: 92, extracted: base,
        summary: `The ${title} is incomplete: only the balance sheet is present.`,
        reasons: ["The document must contain the balance sheet, income & expenditure statement, receipts & payments account, and the auditor's report.",
          `Please upload the complete ${title}.`] };

    case "other-organisation": {
      const other = "Illustrative Other Welfare Society";
      return { state: "invalid", detectedType: title, confidence: 96, extracted: { ...base, "Organisation Name": other },
        summary: `This ${title} is for ${other}, not ${org}.`,
        reasons: [`The organisation on this document is ${other}. Your application is for ${org}.`, `Please upload the ${title} issued to ${org}.`] };
    }

    case "account-name":
      return { state: "invalid", detectedType: title, confidence: 95,
        extracted: { ...base, "Account Holder": "Illustrative Individual Name", ...(facts.ifsc ? { IFSC: facts.ifsc } : {}) },
        summary: `The account on this ${title} is held in an individual's name, not ${org}'s.`,
        reasons: ["The account must be in the name of the organisation, and it must be used for this project.", "Please upload the authorisation for the organisation's own account."] };

    case "blank-template":
      return { state: "review", detectedType: `${title} (template, not filled in)`, confidence: 74, extracted: base,
        summary: `This looks like a blank ${title} template: the particulars have not been filled in.`,
        reasons: ["Names, dates and amounts must be filled in on the document itself.", "Automatic verification confidence is 74% (needs 90%). A reviewer will confirm this document."] };

    case "validity-lapsed":
      return { state: "review", detectedType: title, confidence: 83, extracted: { ...base, "Valid Until": "31 Mar 2025" },
        summary: `The ${title} ends on 31 Mar 2025 and does not cover the year of the application.`,
        reasons: ["The document must show a period of validity covering the current financial year.", "Upload the renewed document, or an officer will confirm it."] };

    case "not-notarised":
      return { state: "review", detectedType: title, confidence: 80, extracted: base,
        summary: `No notarisation seal or certificate is visible on the ${title}.`,
        reasons: ["The document must be notarised.", "Automatic verification confidence is 80% (needs 90%). A reviewer will confirm this document."] };

    case "unsigned":
      return { state: "review", detectedType: title, confidence: 79, extracted: base,
        summary: `The ${title} carries no signature or seal where one is required.`,
        reasons: ["The signature, name and seal of the signing authority must be visible.", "Automatic verification confidence is 79% (needs 90%). A reviewer will confirm this document."] };

    case "incomplete-table": {
      const cols = firstOf(TABLE_COLUMNS, ctx.slotTopics)?.[1] ?? "every column the list requires";
      return { state: "review", detectedType: title, confidence: 84, extracted: base,
        summary: `The ${title} is present but does not give the ${cols} for every entry.`,
        reasons: [`The list must include the ${cols}.`, "Automatic verification confidence is 84% (needs 90%). A reviewer will confirm this document."] };
    }

    case "address-mismatch":
      return { state: "review", detectedType: title, confidence: 82, extracted: { ...base, "Project Address": "House No. 14, Illustrative Lane, Other District" },
        summary: `The address on the ${title} is not the project address on your application.`,
        reasons: ["The full project address must be filled in and match the grant application.", "An officer will confirm which address is right."] };

    case "bank-mismatch": {
      const theirs = "UBIN0000002";
      return { state: "review", detectedType: title, confidence: 81, extracted: { ...base, IFSC: theirs, "Account Number": "6248906556201" },
        summary: `The IFSC on this document (${theirs}) is not the one on your application${facts.ifsc ? ` (${facts.ifsc})` : ""}.`,
        reasons: [`The IFSC on this document is ${theirs}${facts.ifsc ? `. Your application gives ${facts.ifsc}` : ""}. An officer will confirm which is right.`,
          "The account number appears to be 13 digits; please verify it against the passbook."] };
    }

    case "illegible":
      return { state: "review", detectedType: title, confidence: 78, extracted: base,
        summary: `Appears to be the ${title}, but some particulars could not be read with confidence.`,
        reasons: ["Some of the text is too faint to read, so the details could not be confirmed automatically. An officer will confirm this document.",
          "Automatic verification confidence is 78% (needs 90%)."] };

    case "check-unavailable":
      return { state: "unavailable",
        summary: "We could not check this document automatically. Your upload is saved and a reviewer will verify it by hand — you do not need to do anything." };
  }
}
