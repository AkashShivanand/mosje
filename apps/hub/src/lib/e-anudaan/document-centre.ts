/**
 * The Document Centre's model — upload, automatic check, placement and history for every
 * e-Anudaan document, free of React so every rule can be tested.
 *
 * Contract: docs/plans/2026-09-16-e-anudaan-document-centre.md. Evidence: the live portal's
 * DOCUMENT-UPLOADS and DECISION captures, and the review call of 11 Sep 2026.
 *
 * Four things live here:
 *
 *   1. `docState` — the ONE state a document row is in, from its definition, its stored upload
 *      and any upload attempt in flight. Every surface (the wizard's upload and review steps, the
 *      deficiency flow, the officer's list) derives its words, icon and gate from this.
 *   2. `simulateCheck` — the prototype's automatic check. Deterministic: the verdict is a function
 *      of the file (name, size) and the slot, so "Check Again" on the same file cannot turn
 *      "Doesn't match" into "Looks right" (serious audit UX-07). File-name keywords reach every
 *      verdict on purpose, so the vendor's passing and failing samples can be rehearsed (T680–686).
 *   3. `placeFiles` — batch placement by detected type, with every file it could not place listed,
 *      never dropped (T213–232).
 *   4. `commitUpload` / `historyEntries` — a replaced file is never lost (T83–92).
 */

import {
  demoVerdictFor,
  expectedDocumentYear,
  shiftFy,
  yearCheckedVerdict,
  type DocHistoryEntry,
  type DocVerdict,
  type UploadedDoc,
  type VerdictState,
} from "./doc-verification.ts";
import { checkIdOfFile, verdictForCheck, type CheckVerdictId, type DeviceCheckId } from "./doc-checks.ts";
import { formatDate } from "./format.ts";
import { AUTO_CHECK } from "./glossary.ts";

/* ── 1. States ───────────────────────────────────────────────────────────── */

/** Every state a document row can be in (spec §3.2). */
export type DocState =
  | "missing"
  | "optional"
  | "uploading"
  | "failed"
  | "rejected-type"
  | "rejected-size"
  | "rejected-empty"
  | "rejected-locked"
  | "rejected-unreadable"
  | "checking"
  | "verified"
  | "review"
  | "invalid"
  | "unavailable";

/**
 * An upload that has not become the document's file: in flight, failed, or refused before it
 * left the device. Held beside the stored upload, never in place of it — a file that fails to
 * upload must not cost the applicant the good file already there.
 */
/** Every way a file is refused on the device, before anything is sent (doc-checks.ts, stage "device"). */
export type Refusal = "rejected-type" | "rejected-size" | "rejected-empty" | "rejected-locked" | "rejected-unreadable";

export const REFUSALS: readonly Refusal[] = ["rejected-type", "rejected-size", "rejected-empty", "rejected-locked", "rejected-unreadable"];

export const isRefusal = (state: string): state is Refusal => (REFUSALS as readonly string[]).includes(state);

/** The refusal a byte check produces. */
export const REFUSAL_OF: Readonly<Record<Extract<DeviceCheckId, "file-empty" | "file-locked" | "file-unreadable">, Refusal>> = {
  "file-empty": "rejected-empty",
  "file-locked": "rejected-locked",
  "file-unreadable": "rejected-unreadable",
};

export interface UploadAttempt {
  fileName: string;
  sizeKb: number;
  phase: "uploading" | "failed" | Refusal;
  /**
   * The file's bytes are still being read on the device (empty, password-protected, not what its
   * name says). The transfer does not start until they have been.
   */
  sniffing?: boolean;
  /** 0–100 while uploading. */
  progress?: number;
  /** How many times this file has been sent. A retry after a dropped connection succeeds. */
  tries?: number;
}

/**
 * Which of the header's questions a row answers (spec §3.1). Exclusive.
 *
 * `attention` is "does this ask something of me?", and `blocksContinue` is "does this stop me?" —
 * two different questions. A file the check was unsure about asks the applicant to look at what it
 * found, so it is in Needs your attention; it does not stop them, because an officer decides it.
 * It is never counted Ready (audit D-01, spec §3.1 as amended 16 Sep 2026).
 */
export type DocBucket = "attention" | "checking" | "ready" | "optional";

export type DocTone = "neutral" | "info" | "success" | "warning" | "error";

export interface DocStateMeta {
  /** The words on the applicant's row. Never colour alone. */
  words: string;
  tone: DocTone;
  /** Material Symbols glyph, decorative beside the words. */
  icon: string;
  /** Stops the upload step's Continue. */
  blocksContinue: boolean;
  /** Stops Submit — the hard gate. A file still being checked stops Submit, not Continue. */
  blocksSubmit: boolean;
  bucket: DocBucket;
}

export const DOC_STATE_META: Readonly<Record<DocState, DocStateMeta>> = {
  missing: { words: "Not uploaded", tone: "neutral", icon: "radio_button_unchecked", blocksContinue: true, blocksSubmit: true, bucket: "attention" },
  optional: { words: "Optional", tone: "neutral", icon: "remove", blocksContinue: false, blocksSubmit: false, bucket: "optional" },
  // Leaving the step mid-upload would lose the file, so an upload in flight holds Continue.
  uploading: { words: "Uploading", tone: "info", icon: "progress_activity", blocksContinue: true, blocksSubmit: true, bucket: "checking" },
  failed: { words: "Upload failed", tone: "error", icon: "error", blocksContinue: true, blocksSubmit: true, bucket: "attention" },
  "rejected-type": { words: "Can't be uploaded", tone: "error", icon: "error", blocksContinue: true, blocksSubmit: true, bucket: "attention" },
  "rejected-size": { words: "Can't be uploaded", tone: "error", icon: "error", blocksContinue: true, blocksSubmit: true, bucket: "attention" },
  "rejected-empty": { words: "Can't be uploaded", tone: "error", icon: "error", blocksContinue: true, blocksSubmit: true, bucket: "attention" },
  "rejected-locked": { words: "Can't be uploaded", tone: "error", icon: "error", blocksContinue: true, blocksSubmit: true, bucket: "attention" },
  "rejected-unreadable": { words: "Can't be uploaded", tone: "error", icon: "error", blocksContinue: true, blocksSubmit: true, bucket: "attention" },
  checking: { words: AUTO_CHECK.applicant.pending, tone: "info", icon: "progress_activity", blocksContinue: false, blocksSubmit: true, bucket: "checking" },
  verified: { words: AUTO_CHECK.applicant.verified, tone: "success", icon: "check_circle", blocksContinue: false, blocksSubmit: false, bucket: "ready" },
  // Was "Please confirm", counted Ready: the row asked the applicant to act while the header said
  // "10 of 10 ready" and the row offered nothing to confirm with (audit D-01). It asks them to look
  // at what the check found, sits in Needs your attention, and blocks nothing.
  review: { words: AUTO_CHECK.applicant.review, tone: "warning", icon: "warning", blocksContinue: false, blocksSubmit: false, bucket: "attention" },
  invalid: { words: AUTO_CHECK.applicant.invalid, tone: "error", icon: "report", blocksContinue: true, blocksSubmit: true, bucket: "attention" },
  unavailable: { words: AUTO_CHECK.applicant.unavailable, tone: "neutral", icon: "info", blocksContinue: false, blocksSubmit: false, bucket: "ready" },
};

/**
 * The state of one document. `up` must already be year-checked (`withYearCheck`) when the
 * application's financial year can move after upload.
 */
export function docState(doc: { optional?: boolean }, up: Pick<UploadedDoc, "verdict"> | undefined, attempt?: UploadAttempt): DocState {
  if (attempt) return attempt.phase;
  if (!up) return doc.optional ? "optional" : "missing";
  return up.verdict.state === "pending" ? "checking" : up.verdict.state;
}

/**
 * Words for the automatic check as an OFFICER reads it — the confidence stays on this side.
 *
 * Never "Verified": that is the officer's own verdict, and "Verified · 98%" beside an unset verdict
 * read as though the machine had decided (glossary: automatic check vs officer's verdict).
 */
export function officerCheckWords(verdict: DocVerdict | undefined): string {
  if (!verdict) return "Not checked";
  const pct = verdict.confidence != null ? ` · ${verdict.confidence}%` : "";
  switch (verdict.state) {
    case "pending": return `${AUTO_CHECK.name} running`;
    case "unavailable": return `${AUTO_CHECK.name} unavailable`;
    case "verified":
    case "review":
    case "invalid":
      return `${AUTO_CHECK.officer[verdict.state]}${pct}`;
  }
}

/* ── Accepted files ──────────────────────────────────────────────────────── */

export interface AcceptRule {
  /** Lower-case extensions: `["pdf", "jpg", "jpeg", "png"]`. */
  extensions: readonly string[];
  maxKb: number;
  /** "PDF, JPG or PNG" — for "Only … files can be uploaded." */
  typesLabel: string;
  /** "PDF, JPG or PNG · up to 5 MB each" — stated once, where files are chosen. */
  label: string;
  /** The `accept` attribute for a file input. */
  inputAccept: string;
}

/** Read a scheme's format line — "PDF / JPG / PNG · Max 5 MB per file" — into a rule. */
export function acceptFromNote(note: string): AcceptRule {
  const n = note.toUpperCase();
  const types: string[] = [];
  if (n.includes("PDF")) types.push("PDF");
  if (n.includes("JPG") || n.includes("JPEG")) types.push("JPG");
  if (n.includes("PNG")) types.push("PNG");
  if (types.length === 0) types.push("PDF");
  const mb = Number(/(\d+(?:\.\d+)?)\s*MB/i.exec(note)?.[1] ?? 5);
  const typesLabel = types.length === 1 ? types[0]! : `${types.slice(0, -1).join(", ")} or ${types[types.length - 1]}`;
  const extensions = types.flatMap((t) => (t === "JPG" ? ["jpg", "jpeg"] : [t.toLowerCase()]));
  const mime: Record<string, string> = { pdf: "application/pdf", jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png" };
  return {
    extensions,
    maxKb: mb * 1024,
    typesLabel,
    label: `${typesLabel} · up to ${mb} MB each`,
    inputAccept: [...new Set(extensions.map((e) => mime[e] ?? `.${e}`)), ...extensions.map((e) => `.${e}`)].join(","),
  };
}

/** Whether a file may be uploaded at all. Checked on the device, before anything is sent. */
export function rejectionOf(file: { name: string; sizeKb: number }, rule: AcceptRule): "rejected-type" | "rejected-size" | null {
  const ext = /\.([a-z0-9]+)$/i.exec(file.name)?.[1]?.toLowerCase();
  if (!ext || !rule.extensions.includes(ext)) return "rejected-type";
  if (file.sizeKb > rule.maxKb) return "rejected-size";
  return null;
}

/** "812 KB", "2.1 MB". */
export function fileSizeLabel(kb: number): string {
  if (kb >= 1024) {
    const mb = kb / 1024;
    return `${mb >= 10 ? Math.round(mb) : Math.round(mb * 10) / 10} MB`;
  }
  return `${Math.max(1, Math.round(kb))} KB`;
}

/** The one sentence under a row that needs attention — the model's first reason, or why a file was refused. */
export function rowReason(state: DocState, up: Pick<UploadedDoc, "verdict"> | undefined, attempt: UploadAttempt | undefined, rule: AcceptRule): string | undefined {
  switch (state) {
    case "failed":
      return "The connection dropped before the file arrived. Check your connection and try again.";
    case "rejected-size":
      return `This file is ${fileSizeLabel(attempt?.sizeKb ?? 0)}. The limit is ${fileSizeLabel(rule.maxKb)}.`;
    case "rejected-type":
      return `Only ${rule.typesLabel} files can be uploaded.`;
    case "rejected-empty":
      return "This file is empty. Scan or save the document again and choose the new file.";
    case "rejected-locked":
      return "This PDF is protected by a password, so it cannot be opened for checking. Save a copy without the password and upload that.";
    case "rejected-unreadable":
      return "This file could not be opened. It may be damaged, or saved in another format and renamed. Save it again as a PDF, JPG or PNG.";
    case "invalid":
    case "review":
      // The reason is what the applicant is being asked to look at — both states need it.
      return up?.verdict.reasons?.[0] ?? up?.verdict.summary;
    default:
      return undefined;
  }
}

/* ── 2. What the application says, and what the file says ─────────────────── */

/** The application's own answers a document is compared with. */
export interface ApplicantFacts {
  organisationName?: string;
  registrationNumber?: string;
  financialYear?: string;
  ifsc?: string;
  accountNumber?: string;
}

export function applicantFacts(values: Record<string, string>): ApplicantFacts {
  // A renewal names its account as one option string: "State Bank of India · XXXX 4417 · SBIN0001234 · Pune".
  const choice = values.fld_bank_account_choice ?? "";
  return {
    organisationName: values.fld_ngo_name || undefined,
    registrationNumber: values.fld_registration_number || undefined,
    financialYear: values.fld_financial_year || undefined,
    ifsc: values.fld_bank_ifsc || /\b[A-Z]{4}0[A-Z0-9]{6}\b/.exec(choice)?.[0] || undefined,
    accountNumber: values.fld_bank_account_number || undefined,
  };
}

export interface FindingRow {
  label: string;
  /** What the check read from the file. */
  found: string;
  /** What the application says, where it says anything about this field. */
  expected?: string;
  /** Undefined when there is nothing to compare with. */
  matches?: boolean;
}

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

/**
 * The fields the check extracted, each compared with the application's own answer (spec §3.2,
 * "What we found"). The live portal shows the value and leaves the comparison to the reader; a
 * mismatch with the applicant's own answers is the most useful thing the check produces.
 */
export function compareFindings(extracted: Readonly<Record<string, string>> | undefined, facts: ApplicantFacts, expectedYear?: string): FindingRow[] {
  if (!extracted) return [];
  const against: Record<string, string | undefined> = {
    "Organisation Name": facts.organisationName,
    "Registration Number": facts.registrationNumber,
    "Financial Year": expectedYear,
    IFSC: facts.ifsc,
    Ifsc: facts.ifsc,
    "Account Number": facts.accountNumber,
  };
  return Object.entries(extracted).map(([label, found]) => {
    const expected = against[label];
    if (!expected) return { label, found };
    // Account numbers are printed masked on the application ("XXXX 4417"): the last four decide.
    const matches =
      label === "Account Number"
        ? norm(found).slice(-4) === norm(expected).slice(-4)
        : norm(found) === norm(expected);
    return { label, found, expected, matches };
  });
}

/* ── Detecting what a file is ─────────────────────────────────────────────── */

/**
 * A topic: what a document title is about, and what a file name about it tends to contain.
 * Titles vary by scheme ("Audit Report", "Audited Accounts", "Accounts in Parts") and file names
 * are whatever a clerk's scanner produced, so both sides are matched to a shared vocabulary.
 */
const TOPICS: ReadonlyArray<readonly [key: string, title: RegExp, file: RegExp]> = [
  ["registration", /registration certificate/i, /regist|\bregn?\b|society[-_ ]?cert|trust[-_ ]?deed/i],
  ["pan", /\bpan\b/i, /(^|[^a-z])pan([^a-z]|$)/i],
  ["annual-report", /annual report/i, /annual[-_ ]?report/i],
  ["accounts", /audit(ed)? (accounts|report)|accounts in parts|balance sheet/i, /audit(?!.*fire)|balance[-_ ]?sheet|accounts/i],
  ["budget", /budget/i, /budget|estimate/i],
  ["uc", /utilisation certificate|\bgfr/i, /(^|[^a-z])ucs?([^a-z]|$)|utili[sz]ation|gfr|12[-_ ]?a/i],
  ["provisional", /provisional/i, /provisional/i],
  ["bank", /\bbank\b/i, /bank|passbook|cheque|mandate/i],
  ["bond", /bond|psr|stamp paper/i, /bond|psr|stamp/i],
  ["rent", /\brent\b/i, /(^|[^a-z])rent|lease|route[-_ ]?map/i],
  ["staff", /employees|staff/i, /employee|staff|salary/i],
  ["beneficiaries", /beneficiar/i, /beneficiar/i],
  ["committee", /committee|office-bearers/i, /committee|members|governing|office[-_ ]?bearers/i],
  ["compliance", /compliance|cctv|proactive/i, /cctv|compliance|disclosure/i],
  ["eat", /\beat\b|expenditure, advance/i, /(^|[^a-z])eat([^a-z]|$)|pfms/i],
  ["income", /income and expenditure/i, /income|expenditure/i],
  ["moa", /memorandum/i, /(^|[^a-z])moa([^a-z]|$)|memorandum|bye[-_ ]?laws/i],
  ["infrastructure", /infrastructure/i, /infra|rooms/i],
  ["fire", /\bfire\b/i, /fire/i],
  ["progress", /progress report/i, /progress/i],
  ["justification", /justification/i, /justif/i],
  ["monitoring", /monitoring sheet/i, /monitoring/i],
];

export const topicsOfTitle = (title: string) => new Set(TOPICS.filter(([, t]) => t.test(title)).map(([k]) => k));
export const topicsOfFile = (name: string) => new Set(TOPICS.filter(([, , f]) => f.test(name)).map(([k]) => k));

/** Which year a file name points at, relative to the application: -2, -1, 0, or unknown. */
function yearCueOfFile(name: string, applicationFy?: string): number | undefined {
  const n = name.toLowerCase();
  if (/prev(ious)?[-_ ]?(to[-_ ]?)?prev|two[-_ ]?years?[-_ ]?ago/.test(n)) return -2;
  const fy = /(20\d{2})[-_](\d{2})/.exec(n);
  if (fy && applicationFy) {
    for (const d of [0, -1, -2]) if (shiftFy(applicationFy, d) === `${fy[1]}-${fy[2]}`) return d;
  }
  if (/prev(ious)?|last[-_ ]?year|(^|[^a-z])old([^a-z]|$)/.test(n)) return -1;
  if (/current|proposed/.test(n)) return 0;
  return undefined;
}

function yearCueOfTitle(title: string): number | undefined {
  const t = title.toLowerCase();
  if (/previous[- ]to[- ]previous/.test(t)) return -2;
  if (/\b(previous|last)\b/.test(t)) return -1;
  if (/\b(current|proposed)\b/.test(t)) return 0;
  return undefined;
}

export interface Candidate {
  n: number;
  score: number;
}

/**
 * The documents a file could be, best first. Empty when the name says nothing recognisable —
 * "scan0043.pdf" is listed as a file we could not place, never guessed into a slot.
 */
export function classifyFile(fileName: string, docs: readonly { n: number; title: string }[], applicationFy?: string): Candidate[] {
  const file = topicsOfFile(fileName);
  if (file.size === 0) return [];
  const cue = yearCueOfFile(fileName, applicationFy);
  const out: Candidate[] = [];
  for (const d of docs) {
    const title = topicsOfTitle(d.title);
    const hit = [...title].filter((k) => file.has(k)).length;
    if (hit === 0) continue;
    const missed = title.size - hit;
    const extra = [...file].filter((k) => !title.has(k)).length;
    let score = hit - 0.5 * missed - 0.25 * extra;
    const titleCue = yearCueOfTitle(d.title);
    if (cue !== undefined && titleCue !== undefined) score += cue === titleCue ? 0.5 : -0.75;
    if (score > 0) out.push({ n: d.n, score });
  }
  return out.sort((a, b) => b.score - a.score || a.n - b.n);
}

/* ── The simulated automatic check ────────────────────────────────────────── */

/** A small, stable string hash (FNV-1a), so a file's seeded outcome never changes between runs. */
export function seedOf(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

export interface CheckInput {
  slot: { n: number; title: string };
  /** The whole checklist, so a file that is plainly another document can be named as such. */
  checklist: readonly { n: number; title: string }[];
  fileName: string;
  sizeKb: number;
  applicationFy?: string;
  facts: ApplicantFacts;
  /** How many times the check has already run on this file. */
  checks?: number;
}

/** An illustrative name that belongs to no applicant, for a file from the wrong organisation. */
export const OTHER_ORGANISATION = "Illustrative Other Welfare Society";

/**
 * The prototype's automatic check. Deterministic in the file and the slot.
 *
 * Keywords in the file name (the vendor's sample names use them):
 *   valid                                 → Looks right
 *   needs-review · illegible · blurry     → Check the details
 *   wrong · invalid · placeholder         → Doesn't match
 *   other-org                             → Doesn't match (another organisation's document)
 *   other-bank                            → Check the details (IFSC differs from the application)
 *   2024-25 · old · previous              → the year the file carries, compared at read time
 *   offline                               → check unavailable on the first run, then checks
 * A file that is plainly another document on the checklist is "Doesn't match" whatever it is
 * called. Anything else takes a seeded outcome: mostly "Looks right", some "Check the details", a
 * few "unavailable" on the first run.
 */
export function simulateCheck(input: CheckInput): DocVerdict {
  const { slot, fileName, facts, applicationFy } = input;
  const checks = input.checks ?? 0;
  const name = fileName.toLowerCase();
  const seed = seedOf(`${slot.n}|${name}|${input.sizeKb}`);

  // A sample file names the check it rehearses (doc-checks.ts): `rent-agreement--validity-lapsed.pdf`.
  // Its verdict is decided by the catalogue, never by the keyword heuristics below.
  const sample = checkIdOfFile(fileName);
  if (sample) {
    const slotTopics = topicsOfTitle(slot.title);
    const fileTopics = topicsOfFile(fileName);
    const expectedYear = expectedDocumentYear(slot.title, applicationFy);
    const ctx = {
      slotTitle: slot.title,
      slotTopics,
      fileIs: sampleSubject(fileName),
      facts,
      expectedYear,
      priorYear: expectedYear ? shiftFy(expectedYear, -1) : undefined,
    };
    // Whatever a sample rehearses, a file about another document in this slot is the wrong document —
    // a passing PAN card is not a passing Annual Report. A placeholder names no real document.
    const fits = fileTopics.size === 0 || [...fileTopics].some((t) => slotTopics.has(t));
    if (!fits && sample !== "placeholder") return verdictForCheck("wrong-document", ctx);
    // The outage clears on a second run, as a real one does; a "wrong document" sample in its own
    // slot is simply that document; a device check's name means nothing once the bytes have passed.
    const clean = sample === "valid" || sample === "wrong-document" || (sample === "check-unavailable" && checks > 0) || !isVerdictCheck(sample);
    if (!clean) return verdictForCheck(sample as CheckVerdictId, ctx);
    const extracted: Record<string, string> = { "Organisation Name": facts.organisationName ?? "Not found" };
    if (expectedYear) extracted["Financial Year"] = expectedYear;
    if (slotTopics.has("registration") && facts.registrationNumber) extracted["Registration Number"] = facts.registrationNumber;
    if (slotTopics.has("bank")) {
      if (facts.ifsc) extracted.IFSC = facts.ifsc;
      if (facts.accountNumber) extracted["Account Number"] = facts.accountNumber;
    }
    return {
      state: "verified",
      detectedType: slot.title,
      summary: `Valid ${slot.title}${expectedYear ? ` for FY ${expectedYear}` : ""} from ${extracted["Organisation Name"]} with all required information present.`,
      extracted,
      confidence: 96 + (seed % 5),
    };
  }

  if (/offline|unavailable|timeout/.test(name) && checks === 0) return demoVerdictFor("unavailable", slot.title);
  if (!/\bvalid\b|[-_]valid/.test(name) || /invalid/.test(name)) {
    // Not declared valid by name: the file may be plainly something else.
    const best = classifyFile(fileName, input.checklist, applicationFy)[0];
    const bestTitle = best ? input.checklist.find((d) => d.n === best.n)?.title : undefined;
    const slotFits = classifyFile(fileName, [slot], applicationFy).length > 0;
    if (best && best.n !== slot.n && bestTitle && !slotFits) {
      return {
        state: "invalid",
        detectedType: bestTitle,
        summary: `Wrong document: this looks like the ${bestTitle}, not the ${slot.title}.`,
        reasons: [
          `This looks like the ${bestTitle}, not the ${slot.title}.`,
          `Upload the ${slot.title} here. If this file is the ${bestTitle}, upload it against that document instead.`,
        ],
        extracted: { "Organisation Name": facts.organisationName ?? "Not found" },
        confidence: 92,
      };
    }
  }
  if (/wrong|invalid|placeholder|not[-_]valid|financial[-_]statement/.test(name)) {
    return demoVerdictFor("invalid", slot.title, applicationFy);
  }

  // What the file carries.
  const expectedYear = expectedDocumentYear(slot.title, applicationFy);
  const cue = yearCueOfFile(fileName, applicationFy);
  const extracted: Record<string, string> = {
    "Organisation Name": /other[-_]?org|another[-_]?org/.test(name) ? OTHER_ORGANISATION : (facts.organisationName ?? "Not found"),
  };
  const topics = topicsOfTitle(slot.title);
  if (topics.has("registration") && facts.registrationNumber) extracted["Registration Number"] = facts.registrationNumber;
  if (expectedYear) {
    // A file that names no year is taken to carry the year the slot asks for; one that names a
    // year ("2024-25", "previous") carries that year, and the read-time year check judges it.
    extracted["Financial Year"] = cue === undefined || !applicationFy ? expectedYear : (shiftFy(applicationFy, cue) ?? expectedYear);
  }
  if (topics.has("bank")) {
    if (facts.ifsc || /other[-_]?bank/.test(name)) extracted.IFSC = /other[-_]?bank/.test(name) ? "UBIN0000002" : facts.ifsc!;
    if (facts.accountNumber) extracted["Account Number"] = facts.accountNumber;
  }
  if (topics.has("committee")) extracted["Member Count"] = String(5 + (seed % 6));
  if (topics.has("beneficiaries")) extracted["Beneficiary Count"] = String(40 + (seed % 60));
  if (topics.has("staff")) extracted["Employee Count"] = String(6 + (seed % 9));

  // Compared with the application: another organisation's document is not this application's.
  if (facts.organisationName && norm(extracted["Organisation Name"]!) !== norm(facts.organisationName)) {
    return {
      state: "invalid",
      detectedType: slot.title,
      summary: `This ${slot.title} is for ${extracted["Organisation Name"]}, not ${facts.organisationName}.`,
      reasons: [
        `The organisation on this document is ${extracted["Organisation Name"]}. Your application is for ${facts.organisationName}.`,
        `Upload the ${slot.title} issued to ${facts.organisationName}.`,
      ],
      extracted,
      confidence: 96,
    };
  }
  if (extracted.IFSC && facts.ifsc && norm(extracted.IFSC) !== norm(facts.ifsc)) {
    return {
      state: "review",
      detectedType: slot.title,
      summary: `The IFSC on this document (${extracted.IFSC}) is not the one on your application (${facts.ifsc}).`,
      reasons: [
        `The IFSC on this document is ${extracted.IFSC}. Your application gives ${facts.ifsc}. An officer will confirm which is right.`,
      ],
      extracted,
      confidence: 81,
    };
  }

  const forYear = extracted["Financial Year"] ? ` for FY ${extracted["Financial Year"]}` : "";
  if (/needs[-_]?review|illegible|blurr?y|unclear|low[-_]?res/.test(name) || (!/\bvalid\b|[-_]valid/.test(name) && seed % 20 < 2)) {
    const confidence = 70 + (seed % 19);
    return {
      state: "review",
      detectedType: slot.title,
      summary: `Appears to be the ${slot.title}${forYear}, but some particulars could not be read with confidence.`,
      reasons: [
        "Some of the text is too faint to read, so the details could not be confirmed automatically. An officer will confirm this document.",
        `Automatic verification confidence is ${confidence}% (needs 90%).`,
      ],
      extracted,
      confidence,
    };
  }
  if (!/\bvalid\b|[-_]valid/.test(name) && seed % 20 === 2 && checks === 0) return demoVerdictFor("unavailable", slot.title);
  return {
    state: "verified",
    detectedType: slot.title,
    summary: `Valid ${slot.title}${forYear} from ${extracted["Organisation Name"]} with all required information present.`,
    extracted,
    confidence: 92 + (seed % 9),
  };
}

const VERDICT_CHECKS = new Set<string>([
  "placeholder", "wrong-document", "wrong-year", "wrong-variant", "missing-particulars", "missing-parts", "other-organisation",
  "account-name", "blank-template", "validity-lapsed", "not-notarised", "unsigned", "incomplete-table", "address-mismatch",
  "bank-mismatch", "illegible", "check-unavailable",
] satisfies CheckVerdictId[]);

const isVerdictCheck = (id: string): id is CheckVerdictId => VERDICT_CHECKS.has(id);

/** `pan-card--wrong-document.pdf` → "PAN Card": what a sample file says it is. */
export function sampleSubject(fileName: string): string | undefined {
  const stem = /^(.+?)--/.exec(fileName.replace(/^.*[\\/]/, ""))?.[1];
  if (!stem) return undefined;
  const SMALL = new Set(["of", "and", "the", "for", "in", "on", "to", "a", "an"]);
  const UPPER = new Set(["pan", "uc", "gfr", "ngo", "eat", "pfms", "moa", "cctv", "ifsc"]);
  return stem
    .split("-")
    .map((w, i) => (UPPER.has(w) ? w.toUpperCase() : i > 0 && SMALL.has(w) ? w : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(" ");
}

/** A verdict to show, with the financial year compared again against the application now. */
export function currentVerdict(up: Pick<UploadedDoc, "verdict"> | undefined, title: string, applicationFy?: string): DocVerdict | undefined {
  return up ? yearCheckedVerdict(up.verdict, title, applicationFy) : undefined;
}

/* ── 3. Placement ─────────────────────────────────────────────────────────── */

export interface PlacementItem {
  id: string;
  fileName: string;
  sizeKb: number;
  /** The document it went to, or null when it could not be placed. */
  n: number | null;
  /** The file it replaced in that slot, which moved to the slot's history. */
  replaces?: string;
  /** Refused before upload. Such a file is listed, never placed. */
  rejected?: Refusal;
  /** Why an unplaced file is unplaced. */
  unplaced?: "unrecognised" | "duplicate";
}

/**
 * Where each dropped file goes (spec §3.3). A file goes to the best-matching document not already
 * taken by an earlier file in the same drop; among equally good matches, an empty slot first. A
 * file that matches nothing, or only documents another file in the drop already took, is listed
 * as unplaced. Placement never decides silently: the tray shows every line and each can change.
 */
export function placeFiles(
  files: readonly { name: string; sizeKb: number }[],
  checklist: readonly { n: number; title: string }[],
  uploaded: Readonly<Record<number, { fileName: string }>>,
  rule: AcceptRule,
  applicationFy?: string,
  idOf: (i: number) => string = (i) => `placement-${i}`,
): PlacementItem[] {
  const taken = new Set<number>();
  return files.map((f, i) => {
    const base = { id: idOf(i), fileName: f.name, sizeKb: f.sizeKb };
    const rejected = rejectionOf(f, rule);
    if (rejected) return { ...base, n: null, rejected };
    const candidates = classifyFile(f.name, checklist, applicationFy);
    if (candidates.length === 0) return { ...base, n: null, unplaced: "unrecognised" as const };
    const top = candidates[0]!.score;
    const free = candidates.filter((c) => !taken.has(c.n));
    if (free.length === 0) return { ...base, n: null, unplaced: "duplicate" as const };
    const best = free.filter((c) => c.score === free[0]!.score);
    // Equal scores: the empty slot before the filled one.
    const chosen = best.find((c) => !uploaded[c.n]) ?? best[0]!;
    if (chosen.score < top - 1) return { ...base, n: null, unplaced: "duplicate" as const };
    taken.add(chosen.n);
    return { ...base, n: chosen.n, ...(uploaded[chosen.n] ? { replaces: uploaded[chosen.n]!.fileName } : {}) };
  });
}

/** "We placed 7 of 9 files." */
export function placementSummary(items: readonly PlacementItem[]): string {
  const placed = items.filter((i) => i.n != null).length;
  const total = items.length;
  if (total === 1) return placed === 1 ? "We placed your file." : "We couldn't place your file.";
  return `We placed ${placed} of ${total} files.`;
}

/* ── 4. Upload and history ────────────────────────────────────────────────── */

/**
 * A file becomes a document's current upload. The file that was there moves to the document's
 * history — nothing is lost (T83–92) — and the automatic check starts.
 */
export function commitUpload(
  uploaded: Readonly<Record<number, UploadedDoc>>,
  n: number,
  file: { name: string; sizeKb: number },
  now: Date = new Date(),
): Record<number, UploadedDoc> {
  const prev = uploaded[n];
  const at = now.toISOString();
  const history: DocHistoryEntry[] = prev
    ? [
        ...(prev.history ?? []),
        {
          fileName: prev.fileName,
          sizeKb: prev.sizeKb,
          uploadedOn: prev.uploadedOn,
          uploadedAt: prev.uploadedAt,
          replacedAt: at,
          verdict: prev.verdict.state,
        },
      ]
    : [];
  return {
    ...uploaded,
    [n]: {
      fileName: file.name,
      sizeKb: file.sizeKb,
      uploadedOn: formatDate(now),
      uploadedAt: at,
      verdict: { state: "pending" },
      checks: 0,
      ...(history.length ? { history } : {}),
    },
  };
}

/**
 * Undo a placement: the file leaves the slot and the one it replaced, if any, comes back from
 * history. Used when the applicant moves a batch-placed file elsewhere from the tray.
 */
export function withdrawUpload(uploaded: Readonly<Record<number, UploadedDoc>>, n: number, fileName: string): Record<number, UploadedDoc> {
  const cur = uploaded[n];
  const out = { ...uploaded };
  if (!cur || cur.fileName !== fileName) return out;
  const history = [...(cur.history ?? [])];
  const earlier = history.pop();
  if (!earlier) {
    delete out[n];
    return out;
  }
  out[n] = {
    fileName: earlier.fileName,
    sizeKb: earlier.sizeKb,
    uploadedOn: earlier.uploadedOn,
    uploadedAt: earlier.uploadedAt,
    // Restored, it is checked again rather than trusted from memory.
    verdict: { state: "pending" },
    checks: 0,
    ...(history.length ? { history } : {}),
  };
  return out;
}

/** Run the check again on the same file. */
export function requestCheck(uploaded: Readonly<Record<number, UploadedDoc>>, n: number): Record<number, UploadedDoc> {
  const cur = uploaded[n];
  if (!cur) return { ...uploaded };
  return { ...uploaded, [n]: { ...cur, verdict: { state: "pending" }, checks: (cur.checks ?? 0) + 1 } };
}

/** Settle every document still being checked, as the checking service would. */
export function settleChecks(
  uploaded: Readonly<Record<number, UploadedDoc>>,
  checklist: readonly { n: number; title: string }[],
  applicationFy: string | undefined,
  facts: ApplicantFacts,
  /** Settle only these documents. The whole checklist is still what a file is compared against. */
  only?: ReadonlySet<number>,
): Record<number, UploadedDoc> {
  const out = { ...uploaded };
  for (const d of checklist) {
    if (only && !only.has(d.n)) continue;
    const up = out[d.n];
    if (!up || up.verdict.state !== "pending") continue;
    // `checks` counts runs already made; this settles run `checks`, so the NEXT Check Again is `checks + 1`.
    out[d.n] = {
      ...up,
      verdict: simulateCheck({ slot: d, checklist, fileName: up.fileName, sizeKb: up.sizeKb, applicationFy, facts, checks: up.checks ?? 0 }),
    };
  }
  return out;
}

export interface HistoryLine {
  id: string;
  fileName: string;
  sizeKb?: number;
  /** ISO or printed date of the upload. */
  uploadedOn: string;
  current: boolean;
  /** The automatic check's words for this version, as the applicant reads them. */
  status: string;
  note?: string;
}

const VERDICT_WORDS: Record<VerdictState, string> = {
  pending: "Checking…",
  verified: DOC_STATE_META.verified.words,
  review: DOC_STATE_META.review.words,
  invalid: DOC_STATE_META.invalid.words,
  unavailable: DOC_STATE_META.unavailable.words,
};

/** One document's log — current first, then earlier versions newest first (spec §3.4). */
export function historyEntries(up: UploadedDoc | undefined): HistoryLine[] {
  if (!up) return [];
  const earlier = [...(up.history ?? [])].reverse().map((h, i) => ({
    id: `earlier-${i}-${h.replacedAt}`,
    fileName: h.fileName,
    sizeKb: h.sizeKb,
    uploadedOn: h.uploadedOn,
    current: false,
    status: VERDICT_WORDS[h.verdict],
    note: `Replaced ${formatDate(h.replacedAt)}`,
  }));
  return [
    { id: "current", fileName: up.fileName, sizeKb: up.sizeKb, uploadedOn: up.uploadedOn, current: true, status: VERDICT_WORDS[up.verdict.state] },
    ...earlier,
  ];
}

/** The same log, read from a submitted application's document (officer and deficiency flows). */
export function historyEntriesOfRecord(doc: {
  fileName?: string;
  sizeKb?: number;
  uploadedAt?: string;
  aiVerdict?: DocVerdict;
  versions?: readonly { fileName: string; sizeKb?: number; uploadedAt?: string; replacedAt: string; verdict?: VerdictState; note?: string }[];
}): HistoryLine[] {
  const earlier = [...(doc.versions ?? [])].reverse().map((v, i) => ({
    id: `earlier-${i}-${v.replacedAt}`,
    fileName: v.fileName,
    sizeKb: v.sizeKb,
    uploadedOn: v.uploadedAt ? formatDate(v.uploadedAt) : "Date not recorded",
    current: false,
    status: v.verdict ? VERDICT_WORDS[v.verdict] : "Not checked",
    note: v.note ?? `Replaced ${formatDate(v.replacedAt)}`,
  }));
  if (!doc.fileName) return earlier;
  return [
    {
      id: "current",
      fileName: doc.fileName,
      sizeKb: doc.sizeKb,
      uploadedOn: doc.uploadedAt ? formatDate(doc.uploadedAt) : "Date not recorded",
      current: true,
      status: doc.aiVerdict ? VERDICT_WORDS[doc.aiVerdict.state] : "Not checked",
    },
    ...earlier,
  ];
}

/* ── Demo control ─────────────────────────────────────────────────────────── */

/** Dispatched on `window` by the demo dock to force one document into one state. */
export const DEMO_DOC_STATE_EVENT = "e-anudaan:demo-doc-state";
/** Dispatched on `window` by the upload step so the dock can list its documents. */
export const DOC_LIST_EVENT = "e-anudaan:doc-list";

export interface DemoDocStateDetail {
  /** A document's identity, or every document on the checklist. */
  n: number | "all";
  state: DocState;
}

export interface DocListDetail {
  scheme: string;
  documents: { n: number; title: string; optional?: boolean }[];
}

/* ── Grouping and the gate ────────────────────────────────────────────────── */

export interface DocGroup<D> {
  id: string;
  title: string;
  docs: D[];
}

/**
 * SHRESHTA Mode 2's six groups, as the live upload step draws them. Keyed by the document's
 * identity `n`, which never changes with the branch (form-schema `visibleDocuments`).
 */
const SHRESHTA_GROUPS: ReadonlyArray<readonly [id: string, title: string, ns: readonly number[]]> = [
  ["identity", "Registration & Identity", [1, 2]],
  ["reports", "Reports & Beneficiary Records", [3, 4, 5]],
  ["financial", "Financial", [6, 7, 8, 9, 15, 18]],
  ["banking", "Banking & Legal", [10, 11, 17]],
  ["compliance", "Compliance & Operations", [12, 13, 16]],
  ["supporting", "Supporting", [14]],
];

/**
 * The checklist in the groups a reader meets it in. SHRESHTA Mode 2 uses the live portal's six
 * groups; the other schemes' live steps have none, so they are split only into required and
 * optional documents. Empty groups are dropped.
 */
export function groupDocuments<D extends { n: number; optional?: boolean }>(schemeCode: string, checklist: readonly D[]): DocGroup<D>[] {
  if (schemeCode.toUpperCase() === "SHRESHTA_M2") {
    const placed = new Set<number>();
    const groups = SHRESHTA_GROUPS.map(([id, title, ns]) => {
      const docs = checklist.filter((d) => ns.includes(d.n));
      docs.forEach((d) => placed.add(d.n));
      return { id, title, docs };
    });
    // A document the six lists do not name is placed by what it is about, and only failing that
    // under Supporting — an "Audit Report" belongs with the accounts, not at the foot of the page.
    const byTopic: ReadonlyArray<readonly [string, RegExp]> = [
      ["identity", /registration|recognition|\bpan\b|memorandum/i],
      ["financial", /audit|accounts|budget|utilisation|income|expenditure/i],
      ["banking", /bank|bond|rent|lease/i],
      ["compliance", /employee|staff|compliance|cctv|\beat\b/i],
      ["reports", /annual report|beneficiar|committee|progress/i],
    ];
    for (const d of checklist.filter((x) => !placed.has(x.n))) {
      const id = byTopic.find(([, re]) => re.test((d as unknown as { title?: string }).title ?? ""))?.[0] ?? "supporting";
      groups.find((g) => g.id === id)!.docs.push(d);
    }
    return groups.filter((g) => g.docs.length > 0);
  }
  return [
    { id: "required", title: "Required Documents", docs: checklist.filter((d) => !d.optional) },
    { id: "optional", title: "Optional Documents", docs: checklist.filter((d) => d.optional) },
  ].filter((g) => g.docs.length > 0);
}

export interface DocBlocker {
  n: number;
  title: string;
  state: DocState;
  /** The ErrorSummary line: what is wrong and what to do, in the applicant's words. */
  message: string;
}

const BLOCKER_MESSAGE: Partial<Record<DocState, (t: string) => string>> = {
  missing: (t) => `Upload the ${t}`,
  uploading: (t) => `Wait for the ${t} to finish uploading`,
  failed: (t) => `The ${t} did not upload — try again`,
  "rejected-type": (t) => `The file chosen for the ${t} is not an accepted type — choose another file`,
  "rejected-size": (t) => `The file chosen for the ${t} is too large — choose a smaller file`,
  "rejected-empty": (t) => `The file chosen for the ${t} is empty — choose another file`,
  "rejected-locked": (t) => `The file chosen for the ${t} is protected by a password — upload a copy without one`,
  "rejected-unreadable": (t) => `The file chosen for the ${t} could not be opened — save it again and choose the new file`,
  invalid: (t) => `The ${t} doesn't match what was asked for — replace it`,
  checking: (t) => `The ${t} is still being checked — Submit is available when the check finishes`,
};

export interface DocSummary {
  /** Required documents that are ready — looks right, or saved for an officer's hand check. A file the check was unsure about is not ready. */
  readyRequired: number;
  required: number;
  counts: Record<DocBucket, number>;
  states: Record<number, DocState>;
  /** What stops Continue on the upload step. */
  continueBlockers: DocBlocker[];
  /** What stops Submit. */
  submitBlockers: DocBlocker[];
}

/**
 * Everything the header, the chips and both gates read — computed once, so the progress bar, a
 * chip's count and the ErrorSummary can never disagree (data-state-completeness.md §2).
 * `uploaded` must already be year-checked.
 */
export function summariseDocuments(
  checklist: readonly { n: number; title: string; optional?: boolean }[],
  uploaded: Readonly<Record<number, Pick<UploadedDoc, "verdict">>>,
  attempts: Readonly<Record<number, UploadAttempt>> = {},
): DocSummary {
  const counts: Record<DocBucket, number> = { attention: 0, checking: 0, ready: 0, optional: 0 };
  const states: Record<number, DocState> = {};
  const continueBlockers: DocBlocker[] = [];
  const submitBlockers: DocBlocker[] = [];
  let readyRequired = 0;
  let required = 0;
  for (const d of checklist) {
    const state = docState(d, uploaded[d.n], attempts[d.n]);
    const meta = DOC_STATE_META[state];
    states[d.n] = state;
    counts[meta.bucket]++;
    if (!d.optional) {
      required++;
      if (meta.bucket === "ready") readyRequired++;
    }
    const message = BLOCKER_MESSAGE[state]?.(d.title) ?? d.title;
    if (meta.blocksContinue) continueBlockers.push({ n: d.n, title: d.title, state, message });
    if (meta.blocksSubmit) submitBlockers.push({ n: d.n, title: d.title, state, message });
  }
  return { readyRequired, required, counts, states, continueBlockers, submitBlockers };
}

/** "3 Documents Need Your Attention Before You Continue" — a heading, so Title Case (ui-restraint-and-copy.md). */
export function blockerTitle(count: number, when: "continue" | "submit"): string {
  const what = count === 1 ? "1 Document Needs" : `${count} Documents Need`;
  return `${what} Your Attention Before You ${when === "continue" ? "Continue" : "Submit"}`;
}

/**
 * Rows in the order they are drawn: rows needing attention first within their group, otherwise
 * the checklist's own order. Computed from a SNAPSHOT of states the caller refreshes only when the
 * applicant asks for it (opening the step, a drop, pressing Continue) — re-sorting on every verdict
 * would move the row the applicant is working on out from under the pointer.
 */
export function orderForAttention<D extends { n: number }>(docs: readonly D[], snapshot: Readonly<Record<number, DocState>>): D[] {
  const rank = (d: D) => (snapshot[d.n] && DOC_STATE_META[snapshot[d.n]!].bucket === "attention" && snapshot[d.n] !== "missing" ? 0 : 1);
  return [...docs].sort((a, b) => rank(a) - rank(b));
}
