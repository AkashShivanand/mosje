/**
 * The e-Anudaan glossary — one term per concept, per audience, in the register the Ministry uses.
 *
 * Design-director audit of 16 Sep 2026, X-10: one concept went by six names ("Deficiency",
 * "Correction Requested", "Action Required", "Needs Correction", "Resolve", "Deficiency response
 * requested"), "Sanctioned" was printed on files whose grant had been released, "PD" meant both the
 * Programme Division and the Programme Director, and the automatic document check spoke the
 * officer's word "Verified". Clerks and officers talked past each other on the phone and in letters.
 *
 * This module is the ONE place those words live. Selectors, notifications, the workflow's labels
 * and the Document Centre read it; pages read those. The table, with the reason for every choice,
 * is docs/plans/2026-09-16-e-anudaan-glossary.md — change both together.
 *
 * Pure data, no imports, so any module in the portal may read it without a cycle.
 */

/* ── Who ─────────────────────────────────────────────────────────────────── */

/**
 * The two divisions and the one person the letters "PD" were standing in for. Never abbreviate
 * either to "PD" on screen: the portal's top decision-maker is the Programme Director, so "PD
 * Queries" read as queries raised BY the Director when it meant the Programme Division's register.
 */
export const DIVISION_NAME = {
  pd: "Programme Division",
  finance: "Integrated Finance Division",
} as const;

export const PROGRAMME_DIRECTOR = "Programme Director";

/* ── The applicant's status ──────────────────────────────────────────────── */

/**
 * The seven states an applicant is shown, in the order the filter chips list them.
 *
 * - A file moving between officers — a query one grade down, the Director's return — is still
 *   "In Review" to the applicant: nothing is asked of them, and their own history already folds
 *   those moves into "Under Examination at the Ministry". "Query / Returned" told them otherwise.
 * - "Sanctioned" and "Grant Released" are two states, not one: a sanction commits the money, a
 *   release moves it. An NGO waiting for funds must be able to tell which has happened (N-09).
 * - "Rejected" is the decision's own word, as the notification and the officer register say it.
 */
export const APPLICANT_STATUS = {
  draft: "Draft",
  actionRequired: "Action Required",
  submitted: "Submitted",
  inReview: "In Review",
  sanctioned: "Sanctioned",
  released: "Grant Released",
  rejected: "Rejected",
} as const;

export type ApplicantStatusLabel = (typeof APPLICANT_STATUS)[keyof typeof APPLICANT_STATUS];

/* ── Deficiency, correction, verdict ─────────────────────────────────────── */

/**
 * Four words, four concepts — and each is used for exactly one:
 *
 * - **Deficiency** — the Ministry's formal request that an application be corrected. The object:
 *   both audiences, every register, every notification about it.
 * - **Action Required** — the applicant's STATUS while a deficiency is open (above). A status
 *   names what it asks of the reader.
 * - **Correction** — what the applicant sends back. "Submit Correction", "Correction Submitted".
 * - **Needs Correction** — an OFFICER'S verdict on one document or one answer.
 *
 * Retired: "Correction Requested" (the deficiency, named by its consequence), "Deficiency response
 * requested" (sentence case, and a third name), "Resolve" (a verb nobody else uses).
 */
export const DEFICIENCY = {
  noun: "Deficiency",
  plural: "Deficiencies",
  /** The ASO has noted it; it has not left the Ministry. Officer only. */
  noted: "Deficiency Noted",
  /** Status while a noted deficiency waits for the Section Officer to send it. Officer only. */
  toSend: "Deficiency to Send",
  /** Sent to the applicant. The event, for both audiences. */
  raised: "Deficiency Raised",
  /** The audit entry for sending it. */
  sent: "Deficiency Sent to the NGO",
  /** The applicant's act, as a button. */
  submitCorrection: "Submit Correction",
  /** The applicant's act, as an event. */
  correctionSubmitted: "Correction Submitted",
  /** The officer's status once the applicant has answered. */
  resubmitted: "Resubmitted after Deficiency",
} as const;

/** The officer's own verdict on a document. Stored keys on the left. */
export const OFFICER_VERDICT = {
  Pending: "Not Reviewed",
  Verified: "Verified",
  Deficient: "Needs Correction",
} as const;

/* ── The automatic document check ────────────────────────────────────────── */

/**
 * The automatic check and the officer's verdict are kept apart ON PURPOSE.
 *
 * "Verified" is the officer's word: it records that a named officer examined the document and
 * accepted it. The automatic check is advice, and it never says "Verified", "Valid" or "Not
 * valid" — an officer reading "Verified · 98%" beside their own unset verdict read it as though
 * the machine had decided, and an applicant reading it believed the Ministry had accepted a file
 * no one had opened. The check says what it saw: "Looks right", "Doesn't match".
 *
 * `review` (confidence under the bar) asks the applicant to look at what the check found; it does
 * not ask them to "confirm" anything, because there is nothing on the row to confirm with.
 */
export const AUTO_CHECK = {
  applicant: {
    pending: "Checking…",
    verified: "Looks right",
    review: "Check the details",
    invalid: "Doesn't match",
    unavailable: "Saved — an officer will check it",
  },
  officer: {
    pending: "Running",
    verified: "Looks right",
    review: "Unsure",
    invalid: "Doesn't match",
    unavailable: "Unavailable",
  },
  /** The name of the thing, where an officer's screen needs it in a sentence. */
  name: "Automatic check",
} as const;

/* ── Sanction, release, approval ─────────────────────────────────────────── */

/**
 * - **Sanctioned** — the Programme Director issued the sanction order. The grant is committed.
 * - **Grant Released** — the money has been transferred. Never shown as "Sanctioned".
 * - **Approved** — reserved for a CHANGE REQUEST (bank account, project location). A grant is
 *   never "Approved": an officer's forward is a recommendation, and "Approved in principle" in an
 *   officer's remark is that officer's words, not a status.
 */
export const GRANT = {
  sanctioned: "Sanctioned",
  released: "Grant Released",
  sanctionOrder: "Sanction Order",
} as const;

export const CHANGE_REQUEST_DECISION = {
  approved: "Approved",
  notApproved: "Not Approved",
} as const;

/* ── Returned, rejected, query ───────────────────────────────────────────── */

/**
 * - **Rejected** — final. The file is closed. Both audiences.
 * - **Returned for Rework** — sent back inside the Ministry to be examined again, by a query one
 *   grade down or by the Programme Director to the Assistant Section Officer. Not a closure, and
 *   never shown to the applicant (to whom the file is still In Review).
 * - **Query** — the officer's remark that travels with a return. The registers are "Queries".
 * - The button names WHERE the file goes: "Return to the Section Officer". "Return to Previous"
 *   did not say to whom, and the Director's "Return for Reconsideration" named the same act a
 *   third way.
 */
export const RETURN = {
  status: "Returned for Rework",
  query: "Query",
  queries: "Queries",
  respond: "Respond and Send Back",
  responded: "Responded and Sent Back",
} as const;

/** "Return to the Section Officer". `seat` is the grade's full title. */
export function returnTo(seat: string): string {
  return `Return to the ${seat}`;
}

export const REJECT = {
  action: "Reject",
  status: "Rejected",
} as const;

/* ── Case type and instalments ───────────────────────────────────────────── */

/**
 * "Instalment", one l, everywhere — the Ministry's and GFR's spelling. The case type names the
 * project, not the submission: "New" alone sat beside a "New Submission" status and a "New
 * Applications" figure that counted returned files too (O-05).
 */
export const INSTALMENT = "Instalment";

export function ordinal(n: number): string {
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${n}th`;
  return n % 10 === 1 ? `${n}st` : n % 10 === 2 ? `${n}nd` : n % 10 === 3 ? `${n}rd` : `${n}th`;
}

/** "2nd Instalment". */
export function instalmentLabel(n: number): string {
  return `${ordinal(n)} ${INSTALMENT}`;
}

export const CASE_TYPE = {
  new: "New Project",
  newPlural: "New Projects",
  ongoing: "Ongoing Project",
} as const;

/** The status of a file that has just reached the Ministry and no officer has acted on. */
export const RECEIVED = "Received";

/* ── The schemes ─────────────────────────────────────────────────────────── */

/**
 * The four schemes an NGO applies under, named ONE way on every screen.
 *
 * Audit N-07: the picker, the dashboard and My Applications each kept their own map, and between
 * them one scheme went by four patterns — "NAPDDR", "AVYAY (Atal Vayo Abhyuday Yojana)", "SHRESHTA
 * Mode 2", and "Support for Marginalized Individuals…" on the picker beside "SMILE (Garima Greh)"
 * on the dashboard. A returning applicant could not match the card they chose to the row it made.
 *
 * The pattern is **Acronym — Full name**, in British spelling ("Marginalised"). Where a cell has no
 * room for the expansion it prints `short` alone, which is what the officer's Scheme column does.
 * The expansions are the schemes' published names; the subtitles say what each scheme funds.
 */
export interface SchemeName {
  /** The acronym, as a table cell prints it. */
  short: string;
  /** The expansion, as the Ministry publishes it. */
  fullName: string;
  /** "AVYAY — Atal Vayo Abhyuday Yojana". */
  title: string;
  /** What the scheme funds, in one line. */
  subtitle: string;
}

function scheme(short: string, fullName: string, subtitle: string): SchemeName {
  return { short, fullName, title: `${short} — ${fullName}`, subtitle };
}

/** In the order the picker lists them. */
export const SCHEME_NAMES: Readonly<Record<string, SchemeName>> = {
  SHRESHTA_M2: scheme(
    "SHRESHTA Mode 2",
    "Scheme for Residential Education for Students in High Schools in Targeted Areas",
    "Grant-in-Aid for SC Residential Schools",
  ),
  AVYAY: scheme("AVYAY", "Atal Vayo Abhyuday Yojana", "Integrated Programme for Senior Citizens"),
  NAPDDR: scheme("NAPDDR", "National Action Plan for Drug Demand Reduction", "Drug Demand Reduction & Social Re-integration"),
  SMILE: scheme(
    "SMILE",
    "Support for Marginalised Individuals for Livelihood and Enterprise",
    "Garima Greh — Shelter Homes for Transgender Persons",
  ),
};

/** Stored codes a scheme may still arrive under. */
const SCHEME_ALIASES: Readonly<Record<string, string>> = { SMILE_GG: "SMILE" };

/** The scheme's names, whatever code it arrives under. An unknown code reads as itself, unpunctuated. */
export function schemeName(code: string): SchemeName {
  const hit = SCHEME_NAMES[SCHEME_ALIASES[code] ?? code];
  if (hit) return hit;
  const name = code.replace(/_/g, " ");
  return { short: name, fullName: name, title: name, subtitle: "" };
}

/* ── The application wizard ──────────────────────────────────────────────── */

/**
 * An NGO APPLIES for grant-in-aid; it REGISTERS once, as an organisation. The wizard's subtitle
 * said "complete each section to register for AVYAY" on every step of every claim (W-02).
 *
 * Shown on the first step only. A claim names what is being claimed instead.
 */
export function wizardIntro(scheme: string): string {
  return `Application for grant-in-aid under ${scheme}. Fields marked * are required.`;
}

/** "3rd Instalment of FY 2026-27 · Project DR/DL/NWD/03622". */
export function claimIntro(instalment: number, financialYear: string, projectId: string): string {
  return `${instalmentLabel(instalment)} of FY ${financialYear} · Project ${projectId}`;
}

/* ── Words the portal does not use ───────────────────────────────────────── */

/**
 * Patterns no label in the portal may contain, with the word to use instead. The glossary test
 * runs every label table in the libs against these.
 */
export const RETIRED_TERMS: readonly { pattern: RegExp; use: string }[] = [
  { pattern: /\bPD\b/, use: `${DIVISION_NAME.pd} or ${PROGRAMME_DIRECTOR}, spelled out` },
  { pattern: /Installment/i, use: INSTALMENT },
  { pattern: /Correction Requested/i, use: DEFICIENCY.raised },
  { pattern: /response requested/i, use: DEFICIENCY.raised },
  { pattern: /Return to Previous|Previous Level/i, use: "Return to the <seat>, or Returned for Rework" },
  { pattern: /Reconsideration/i, use: "Return to the Assistant Section Officer" },
  { pattern: /Please confirm/i, use: AUTO_CHECK.applicant.review },
  { pattern: /Query \/ Returned|Closed \/ Rejected/, use: `${APPLICANT_STATUS.inReview}, or ${APPLICANT_STATUS.rejected}` },
  { pattern: /\bregister for\b/i, use: "apply for grant-in-aid under" },
];
