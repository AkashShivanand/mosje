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

export interface UploadedDoc {
  fileName: string;
  /** Size in KB, as the live portal prints it. */
  sizeKb: number;
  uploadedOn: string;
  verdict: DocVerdict;
  /** The officer's own status, shown on the application detail screen. */
  officerStatus?: "Pending" | "Verified" | "Needs Correction";
  remarks?: string;
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
    reasons: ["You can use Re-verify if you would like to try the automatic check again."],
  },
  verified: {
    state: "verified",
    detectedType: "Annual Report of NGO",
    summary: "Valid Annual Report for FY 2025-26 from Sankalp Seva Sansthan with all required information present.",
    extracted: { "Financial Year": "2025-26", "Organisation Name": "Sankalp Seva Sansthan" },
    confidence: 100,
  },
  review: {
    state: "review",
    detectedType: "List of Managing Committee Members / Office-bearers",
    summary:
      "Valid list of 5 managing committee members for FY 2025-26 with names, occupations, addresses and contact details; formal role designations are not explicitly stated.",
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

/**
 * A demo verdict written against the slot it sits in, so the model's reasoning names the
 * document that was actually expected rather than a fixed example.
 */
export function demoVerdictFor(state: VerdictState, expected: string): DocVerdict {
  const base = DEMO_VERDICTS[state];
  if (state === "pending" || state === "unavailable") return base;
  if (state === "verified") {
    return {
      ...base,
      detectedType: expected,
      summary: `Valid ${expected} for FY 2025-26 from Sankalp Seva Sansthan with all required information present.`,
    };
  }
  if (state === "review") {
    return {
      ...base,
      detectedType: expected,
      summary: `Appears to be the required ${expected}, but some mandatory particulars could not be read with confidence.`,
      reasons: [
        "Key fields are present but partially illegible, so they could not be confirmed automatically.",
        "Automatic verification confidence is 82% (needs 90%). A reviewer will confirm this document.",
      ],
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
  const present = Object.values(uploaded);
  const invalid = present.filter((u) => u.verdict.state === "invalid").length;
  const pending = present.filter((u) => u.verdict.state === "pending").length;

  if (invalid > 0) {
    return {
      blocked: true,
      reason:
        `${invalid} document${invalid === 1 ? " is" : "s are"} not valid. Replace ` +
        `${invalid === 1 ? "it" : "them"} — or use Re-verify if you believe the check is wrong.`,
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
 * How far through the mandatory checklist an applicant is.
 *
 * Both halves must count the same set. Counting every upload against a denominator of only the
 * mandatory documents is how live shows SHRESHTA_M2 applicants "10 / 7 uploaded" — a fraction
 * that exceeds its own total and so cannot mean "done". Our clone had the same arithmetic.
 */
export function uploadProgress(
  documents: readonly { n: number; optional?: boolean }[],
  uploaded: Record<number, unknown>,
): { done: number; total: number } {
  const mandatory = documents.filter((d) => !d.optional);
  return {
    done: mandatory.filter((d) => uploaded[d.n] != null).length,
    total: mandatory.length,
  };
}
