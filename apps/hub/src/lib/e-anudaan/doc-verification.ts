/**
 * The AI document check the live portal runs on every upload.
 *
 * Observed on eanudaan-user-dev 2026-08-22 on both the SHRESHTA_M2 and AVYAY upload steps.
 * It is the NGO-visible verdict and is **distinct from** the officer's own per-document review
 * on the admin side — a document can be "AI: not valid" and still be Pending with the Ministry.
 *
 * Four states, with the live glyph and pill wording:
 *
 *   pending   "Verifying…"                        (no pill)
 *   unavailable "Automatic check unavailable"       (no pill)
 *   verified  "✓ Document verified — <type>"      "Verified · 100%"
 *   review    "⚠ Needs review — <type>"           "Needs review · 82%"
 *   invalid   "✗ Document not valid — <type>"     "Not valid · 95%"
 *
 * A verdict carries a one-sentence summary, a bullet list of reasons, and the key/value pairs
 * the model extracted from the file (Organisation Name, Pan, Financial Year, Amount Utilised,
 * Member Count, Beneficiary Count, Employee Count, Total Budget, Ifsc, Account Name,
 * Account Number, Rent Amount, Project Address …).
 */

export type VerdictState = "pending" | "verified" | "review" | "invalid" | "unavailable";

export interface DocVerdict {
  state: VerdictState;
  /** The document type the model believes it is looking at. */
  detectedType?: string;
  /** One-sentence verdict summary. */
  summary?: string;
  /** Why the model reached that verdict. */
  reasons?: readonly string[];
  /** Fields the model pulled out of the file, rendered as "Label: value". */
  extracted?: Readonly<Record<string, string>>;
  /** Confidence, 0–100. Rendered in the pill. */
  confidence?: number;
}

/**
 * One earlier upload of a document, kept when it is replaced (review call, T83–92: "a log of the
 * file", as many versions as there are replacements). Newest last, like `MockDoc.versions`.
 */
export interface DocHistoryEntry {
  fileName: string;
  sizeKb: number;
  /** "14 Sep 2026", as the row prints it. */
  uploadedOn: string;
  /** ISO time of the upload, when it is known. */
  uploadedAt?: string;
  /** ISO time it stopped being the current file. */
  replacedAt: string;
  /** What the automatic check said about it. */
  verdict: VerdictState;
}

export interface UploadedDoc {
  fileName: string;
  /** Size in KB, as the live portal prints it. */
  sizeKb: number;
  uploadedOn: string;
  verdict: DocVerdict;
  /** The officer's own status, shown on the application detail screen. */
  officerStatus?: "Pending" | "Verified" | "Needs Correction";
  remarks?: string;
  /** ISO time of the upload. `uploadedOn` is the printed date. */
  uploadedAt?: string;
  /** Earlier files for this document, oldest first. Replacing a file never loses it. */
  history?: DocHistoryEntry[];
  /** How many times the automatic check has been asked to run on this file. */
  checks?: number;
}

export const VERDICT_LABEL: Record<VerdictState, string> = {
  pending: "Verifying…",
  unavailable: "Automatic check unavailable",
  verified: "Document verified",
  review: "Needs review",
  invalid: "Document not valid",
};

export const VERDICT_GLYPH: Record<VerdictState, string> = {
  pending: "hourglass_top",
  unavailable: "cloud_off",
  verified: "check_circle",
  review: "warning",
  invalid: "cancel",
};

/** Pill text, e.g. "Verified · 100%". */
export function verdictPill(v: DocVerdict): string | null {
  if (v.state === "pending" || v.state === "unavailable" || v.confidence == null) return null;
  const word = v.state === "verified" ? "Verified" : v.state === "review" ? "Needs review" : "Not valid";
  return `${word} · ${v.confidence}%`;
}

/** The headline line, e.g. "✗ Document not valid — Utilisation Certificate in GFR 12-A format". */
export function verdictHeadline(v: DocVerdict): string {
  const label = VERDICT_LABEL[v.state];
  return v.detectedType ? `${label} — ${v.detectedType}` : label;
}

/**
 * Seeded verdicts for the demo, one per state so every branch of the UI is reachable.
 * Wording follows the live model's register without reproducing any real organisation's data.
 */
export const DEMO_VERDICTS: Record<VerdictState, DocVerdict> = {
  pending: { state: "pending" },
  unavailable: {
    state: "unavailable",
    summary:
      "We could not check this document automatically. Your upload is saved and a reviewer " +
      "will verify it by hand — you do not need to do anything.",
  },
  // No financial year here: which year a document should cover depends on the application it is
  // uploaded to, so the year is written in by `demoVerdictFor` from the application's own FY.
  // A fixed "FY 2025-26" once verified every document on an FY 2026-27 application, a Budget
  // Estimate for the current year included (form-path QA, 13 Sep 2026).
  verified: {
    state: "verified",
    detectedType: "Annual Report of NGO",
    summary: "Valid Annual Report from Sankalp Seva Sansthan with all required information present.",
    extracted: { "Organisation Name": "Sankalp Seva Sansthan" },
    confidence: 100,
  },
  review: {
    state: "review",
    detectedType: "List of Managing Committee Members / Office-bearers",
    summary:
      "Valid list of 5 managing committee members with names, occupations, addresses and contact details; formal role designations are not explicitly stated.",
    reasons: [
      "Formal designations (President, Secretary, Treasurer, etc.) are not clearly labelled in the committee member list, though members are listed with occupations.",
      "OCR quality is poor in places, but the structure and key information are identifiable.",
      "Automatic verification confidence is 82% (needs 90%). A reviewer will confirm this document.",
    ],
    extracted: { "Member Count": "5" },
    confidence: 82,
  },
  invalid: {
    state: "invalid",
    detectedType: "Financial statement (Form-VII) showing income and expenditure details",
    summary: "Wrong document: this is a financial statement (Form-VII), not a Registration Certificate.",
    reasons: [
      "This is a financial statement (Form-VII) showing income/expenditure, not a Registration Certificate under the Societies Registration Act 1860 or the Charitable Trust Act.",
      "Registration number and registration date are not present in this document.",
      "Please upload the certified copy of the organisation's Registration Certificate, not a financial statement.",
    ],
    extracted: { "Organisation Name": "Sankalp Seva Sansthan" },
    confidence: 95,
  },
};

/* ── Which financial year a document must cover ─────────────────────────── */

/** `"2026-27"` shifted by whole years: `shiftFy("2026-27", -1)` is `"2025-26"`. */
export function shiftFy(fy: string, delta: number): string | undefined {
  const start = Number(/^(\d{4})-\d{2}$/.exec(fy.trim())?.[1]);
  if (!Number.isInteger(start)) return undefined;
  const y = start + delta;
  return `${y}-${String((y + 1) % 100).padStart(2, "0")}`;
}

/**
 * The financial year a document must be for, read from its title and the application's FY.
 *
 * "previous-to-previous" is two years back, "previous" or "last" one year back, "current" or
 * "proposed" the application's own year. A title that names no year (a Registration
 * Certificate, a PAN card) has no expected year and is never judged on one.
 */
export function expectedDocumentYear(title: string, applicationFy: string | undefined): string | undefined {
  if (!applicationFy) return undefined;
  const t = title.toLowerCase();
  if (/previous[- ]to[- ]previous/.test(t)) return shiftFy(applicationFy, -2);
  // "last two financial years" spans two years; the later of them is the one a file must reach.
  if (/\b(previous|last)\b/.test(t)) return shiftFy(applicationFy, -1);
  if (/\b(current|proposed)\b/.test(t)) return applicationFy;
  return undefined;
}

const ORGANISATION = "Sankalp Seva Sansthan";

/**
 * A demo verdict written against the slot it sits in, so the model's reasoning names the
 * document that was actually expected rather than a fixed example.
 *
 * `applicationFy` is the financial year of the application the file is uploaded to. The sample
 * file stands for a correct upload, so it carries the year the slot requires for THAT
 * application; the check below then compares like with like. Without an application year no
 * year is claimed at all, rather than a fixed one.
 */
export function demoVerdictFor(state: VerdictState, expected: string, applicationFy?: string): DocVerdict {
  const base = DEMO_VERDICTS[state];
  if (state === "pending" || state === "unavailable") return base;
  const year = expectedDocumentYear(expected, applicationFy);
  const forYear = year ? ` for FY ${year}` : "";
  const extracted: Record<string, string> = year
    ? { "Financial Year": year, "Organisation Name": ORGANISATION }
    : { "Organisation Name": ORGANISATION };
  if (state === "verified") {
    return {
      ...base,
      detectedType: expected,
      summary: `Valid ${expected}${forYear} from ${ORGANISATION} with all required information present.`,
      extracted,
    };
  }
  if (state === "review") {
    return {
      ...base,
      detectedType: expected,
      summary: `Appears to be the required ${expected}${forYear}, but some mandatory particulars could not be read with confidence.`,
      reasons: [
        "Key fields are present but partially illegible, so they could not be confirmed automatically.",
        "Automatic verification confidence is 82% (needs 90%). A reviewer will confirm this document.",
      ],
      extracted,
    };
  }
  return {
    ...base,
    detectedType: "Financial statement (Form-VII) showing income and expenditure details",
    summary: `Wrong document: this is a financial statement (Form-VII), not the ${expected} this slot asks for.`,
    reasons: [
      `This is a financial statement (Form-VII) showing income and expenditure, not the ${expected}.`,
      "The particulars the slot requires are not present in this document.",
      `Please upload the ${expected}, not a financial statement.`,
    ],
  };
}

/**
 * The verdict as it stands against the application's financial year NOW.
 *
 * A verdict is recorded when the file is checked, but the year it must match belongs to the
 * application and can change after the upload — an applicant who uploads for 2026-27 and then
 * moves the application to 2027-28 holds documents for the wrong year. So the year is compared
 * every time the verdict is read, and a mismatch is reported as a document that is not valid:
 * it is something the applicant can put right, and the step must not pass it.
 */
export function yearCheckedVerdict(verdict: DocVerdict, title: string, applicationFy: string | undefined): DocVerdict {
  if (verdict.state !== "verified" && verdict.state !== "review") return verdict;
  const found = verdict.extracted?.["Financial Year"];
  const expected = expectedDocumentYear(title, applicationFy);
  if (!found || !expected || found === expected) return verdict;
  return {
    state: "invalid",
    detectedType: verdict.detectedType ?? title,
    summary: `Wrong financial year: this document is for FY ${found}, and an application for FY ${applicationFy} needs the one for FY ${expected}.`,
    reasons: [
      `The ${title} must cover FY ${expected}.`,
      `Upload the ${title} for FY ${expected}, or change the financial year of the application if it is wrong.`,
    ],
    extracted: verdict.extracted,
    confidence: 100,
  };
}

/** Every upload with its verdict checked against the application's financial year. */
export function withYearCheck<T extends { verdict: DocVerdict }>(
  documents: readonly { n: number; title: string }[],
  uploaded: Record<number, T>,
  applicationFy: string | undefined,
): Record<number, T> {
  const out: Record<number, T> = { ...uploaded };
  for (const d of documents) {
    const up = uploaded[d.n];
    if (up) out[d.n] = { ...up, verdict: yearCheckedVerdict(up.verdict, d.title, applicationFy) };
  }
  return out;
}

/**
 * Whether the upload step may be left, and what to say when it may not.
 *
 * The live portal BLOCKS on an invalid document and on one still verifying; our clone used
 * to print "Continuing anyway — test mode. This would block on the live portal." and let the
 * applicant through. A prototype that walks past its own gate teaches the wrong flow to
 * everyone who is shown it, and it is the one behaviour the live capture of 2026-09-07 is
 * unambiguous about:
 *
 *   "12 documents are not valid. Replace them — or use Re-verify if you believe the check
 *    is wrong."
 *
 * The clone's Re-verify used to turn the automated check's "not valid" into "Verified" on the same
 * file, which is a verdict only an officer may overrule (serious audit UX-07 / S08, 14 Sep 2026).
 * The Document Centre brings the control back as "Check Again" (live parity) with that defect
 * designed out: the check is a function of the file, so running it again on the same file gives
 * the same verdict — only an outage ("unavailable") can clear on a second run. The way past an
 * invalid document is still to replace it, and the message says only that.
 *
 * `unavailable` does NOT block. That is the whole point of the state: when the checking
 * service is down the portal accepts the upload and routes it to a human, so an applicant is
 * never trapped by an outage that is not their fault. It was the live behaviour throughout
 * August.
 *
 * `review` does not block either — it is a confidence shortfall the officer resolves, not a
 * defect the applicant can fix.
 */
export function uploadGate(
  documents: readonly { n: number; optional?: boolean }[],
  uploaded: Record<number, { verdict: DocVerdict }>,
): { blocked: boolean; reason: string | null } {
  const mandatory = documents.filter((d) => !d.optional);
  const missing = mandatory.filter((d) => uploaded[d.n] == null).length;
  // Only uploads for documents on THIS list. A checklist now changes with the answers — a Rent
  // Agreement leaves it when the building is owned — and a file left behind for a document no
  // longer asked for must not hold the step shut.
  const present = documents.map((d) => uploaded[d.n]).filter((u): u is { verdict: DocVerdict } => u != null);
  const invalid = present.filter((u) => u.verdict.state === "invalid").length;
  const pending = present.filter((u) => u.verdict.state === "pending").length;

  if (invalid > 0) {
    return {
      blocked: true,
      reason:
        `${invalid} document${invalid === 1 ? " is" : "s are"} not valid. Replace ` +
        `${invalid === 1 ? "it" : "them"} to proceed.`,
    };
  }
  if (pending > 0) {
    return {
      blocked: true,
      reason:
        `Checking ${pending} document${pending === 1 ? "" : "s"}… this takes a few seconds. ` +
        `Next opens as soon as the check completes.`,
    };
  }
  if (missing > 0) {
    return {
      blocked: true,
      reason: `Upload all ${mandatory.length} mandatory documents to proceed (${mandatory.length - missing}/${mandatory.length}).`,
    };
  }
  return { blocked: false, reason: null };
}

/**
 * How far through the checklist an applicant is — the ONE count every surface shows.
 *
 * `done` / `total` count every document on the list, optional ones included, so the badge over
 * a twenty-item list reads "of 20" and agrees with the application page, which counts every
 * document the application carries. The mandatory figures are reported beside them, never in
 * their place: "19 / 19 uploaded" over a list of twenty, with one marked optional, was two
 * different sets in one sentence (form-path QA, 13 Sep 2026).
 *
 * Both halves of each fraction count the same set, so neither can exceed its own total — the
 * arithmetic behind live's "10 / 7 uploaded".
 */
export function uploadProgress(
  documents: readonly { n: number; optional?: boolean }[],
  uploaded: Record<number, unknown>,
): { done: number; total: number; mandatoryDone: number; mandatoryTotal: number; optionalTotal: number } {
  const mandatory = documents.filter((d) => !d.optional);
  return {
    done: documents.filter((d) => uploaded[d.n] != null).length,
    total: documents.length,
    mandatoryDone: mandatory.filter((d) => uploaded[d.n] != null).length,
    mandatoryTotal: mandatory.length,
    optionalTotal: documents.length - mandatory.length,
  };
}
