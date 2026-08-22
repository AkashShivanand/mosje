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
 *   verified  "✓ Document verified — <type>"      "Verified · 100%"
 *   review    "⚠ Needs review — <type>"           "Needs review · 82%"
 *   invalid   "✗ Document not valid — <type>"     "Not valid · 95%"
 *
 * A verdict carries a one-sentence summary, a bullet list of reasons, and the key/value pairs
 * the model extracted from the file (Organisation Name, Pan, Financial Year, Amount Utilised,
 * Member Count, Beneficiary Count, Employee Count, Total Budget, Ifsc, Account Name,
 * Account Number, Rent Amount, Project Address …).
 */

export type VerdictState = "pending" | "verified" | "review" | "invalid";

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
  verified: "Document verified",
  review: "Needs review",
  invalid: "Document not valid",
};

export const VERDICT_GLYPH: Record<VerdictState, string> = {
  pending: "hourglass_top",
  verified: "check_circle",
  review: "warning",
  invalid: "cancel",
};

/** Pill text, e.g. "Verified · 100%". */
export function verdictPill(v: DocVerdict): string | null {
  if (v.state === "pending" || v.confidence == null) return null;
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
  if (state === "pending") return base;
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

/** The live foot warning when invalid documents remain but the demo lets you continue. */
export function invalidDocsWarning(count: number): string | null {
  if (count === 0) return null;
  return `${count} document${count === 1 ? " is" : "s are"} not valid. Continuing anyway — test mode. This would block on the live portal.`;
}
