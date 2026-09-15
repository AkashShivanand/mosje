/**
 * Derived views the review call of 11 September 2026 asked for. Pure functions over the store,
 * so a dashboard count, a list and a detail page can never disagree about the same file.
 */

import { fieldVisible, visibleSteps, wizardFor, type FieldDef } from "./form-schema.ts";
import { placeOfProjectId } from "./geography.ts";
import { PROJECT_ID_PREFIX, projectForSubmission, type SubmittedProject } from "./submission.ts";
import { STATUS_LABEL } from "./workflow.ts";
import type {
  AuditEntry,
  Deficiency,
  DeficiencyItem,
  EAnudaanState,
  GrantApplication,
  Institution,
  NgoProfile,
  ProjectAccount,
} from "./types.ts";

/* ── deficiencies ─────────────────────────────────────────────────────────── */

export interface OpenDeficiency {
  app: GrantApplication;
  deficiency: Deficiency;
  items: DeficiencyItem[];
  /** Items the applicant has already put right but not yet submitted. */
  corrected: number;
}

/** The deficiency still waiting on the applicant, if any. */
export function openDeficiencyOf(app: GrantApplication): Deficiency | undefined {
  if (app.status !== "DeficiencyRaised") return undefined;
  return [...app.deficiencies].reverse().find((d) => !d.respondedAt);
}

/**
 * When the applicant was ASKED — the moment the deficiency was communicated to them, not the
 * moment an officer first noted it internally. Showing the internal date put "Requested on
 * 07 Aug" beside a history reading "Correction Requested 10 Aug" (review panel, 13 Sep 2026).
 */
export function requestedAt(app: GrantApplication, def: Deficiency): string {
  if (def.communicatedAt) return def.communicatedAt;
  const told = app.audit.find((e) => e.action === "communicateDeficiency" && Date.parse(e.at) >= Date.parse(def.raisedAt));
  return told?.at ?? def.raisedAt;
}

/**
 * Every open deficiency across the applicant's files. Most corrections outstanding first, then
 * the longest waiting — the dashboard shows three, and the three must be the ones that matter.
 */
export function openDeficiencies(state: EAnudaanState, ngoId: string): OpenDeficiency[] {
  return state.applications
    .filter((a) => a.ngoId === ngoId)
    .flatMap((app) => {
      const deficiency = openDeficiencyOf(app);
      if (!deficiency) return [];
      const items = deficiency.items ?? [];
      return [{ app, deficiency, items, corrected: items.filter((i) => i.correctedAt).length }];
    })
    .sort(
      (a, b) =>
        b.items.length - b.corrected - (a.items.length - a.corrected) ||
        Date.parse(requestedAt(a.app, a.deficiency)) - Date.parse(requestedAt(b.app, b.deficiency)),
    );
}

/** Days since the applicant was asked. */
export function daysOpen(app: GrantApplication, def: Deficiency, now = Date.now()): number {
  return Math.max(0, Math.floor((now - Date.parse(requestedAt(app, def))) / 86_400_000));
}

/* ── the applicant's processing history ───────────────────────────────────── */

export interface ApplicantStage {
  id: string;
  title: string;
  at: string;
  /** When the stage ran over several entries, the last one. */
  until?: string;
  detail?: string;
  tone: "neutral" | "attention" | "done" | "closed";
}

/** Actions that happen inside the Ministry and mean nothing on their own to the applicant. */
const INTERNAL = new Set<AuditEntry["action"]>([
  "certify",
  "forward",
  "concur",
  "raiseQuery",
  "resolveQuery",
  "routeDown",
  "raiseDeficiency",
  "return",
]);

/**
 * The applicant's history, in words the applicant can act on.
 *
 * The call was explicit on two points (T778–823): officer roles are never named to the
 * applicant, and six rows of "moved to next stage" tell them nothing. So every run of internal
 * movement becomes ONE "Under Examination" stage with its date range and a count of the levels
 * it cleared, and only the moments that change what the applicant must do stand on their own.
 */
export function applicantStages(app: GrantApplication): ApplicantStage[] {
  const out: ApplicantStage[] = [];
  let run: { first: AuditEntry; last: AuditEntry; moves: number } | null = null;

  const flush = () => {
    if (!run) return;
    out.push({
      id: run.first.id,
      title: "Under Examination at the Ministry",
      at: run.first.at,
      until: run.last.at === run.first.at ? undefined : run.last.at,
      detail:
        run.moves > 0
          ? `Examined and moved to the next level ${run.moves === 1 ? "once" : `${run.moves} times`}.`
          : "Being examined.",
      tone: "neutral",
    });
    run = null;
  };

  for (const e of app.audit) {
    if (INTERNAL.has(e.action)) {
      if (!run) run = { first: e, last: e, moves: 0 };
      run.last = e;
      if (e.action === "forward" || e.action === "concur" || e.action === "resolveQuery") run.moves += 1;
      continue;
    }
    flush();
    switch (e.action) {
      case "submit":
        out.push({ id: e.id, title: "Application Submitted", at: e.at, tone: "done" });
        break;
      case "communicateDeficiency": {
        const def = app.deficiencies.find((d) => Date.parse(d.raisedAt) <= Date.parse(e.at) && (!d.respondedAt || Date.parse(d.respondedAt) >= Date.parse(e.at)));
        const n = def?.items?.length ?? 0;
        out.push({
          id: e.id,
          title: "Correction Requested",
          at: e.at,
          detail: n ? `${n} item${n === 1 ? "" : "s"} to correct — ${def?.detail}` : def?.detail,
          tone: "attention",
        });
        break;
      }
      case "respondDeficiency":
        out.push({ id: e.id, title: "Correction Submitted", at: e.at, detail: e.remarks, tone: "done" });
        break;
      case "sanction":
        out.push({ id: e.id, title: "Sanctioned", at: e.at, tone: "done" });
        break;
      case "reject":
        out.push({ id: e.id, title: "Not Approved", at: e.at, detail: e.remarks, tone: "closed" });
        break;
      case "inspectionScheduled":
        out.push({ id: e.id, title: "Inspection Scheduled", at: e.at, tone: "neutral" });
        break;
      case "inspectionSubmitted":
      case "inspectionReviewed":
        out.push({ id: e.id, title: "Inspection Completed", at: e.at, tone: "done" });
        break;
      default:
        out.push({ id: e.id, title: "Updated", at: e.at, tone: "neutral" });
    }
  }
  flush();
  return out;
}

/** One sentence on where the application stands, for the applicant. */
export function applicantStanding(app: GrantApplication): string {
  if (app.status === "Draft") return "Not submitted yet.";
  if (app.status === "DeficiencyRaised") return "Waiting for your correction.";
  if (app.sanction || app.status === "Sanctioned" || app.status === "Released") return "Sanctioned.";
  if (app.status === "Rejected") return "Not approved.";
  return "Under examination at the Ministry. No action is needed from you.";
}

/* ── notifications ─────────────────────────────────────────────────────────── */

/**
 * What a notification is called, by what happened. Every movement used to arrive as "Application
 * moved forward" — including a query sending a file back down the chain, which is the opposite
 * (screen QA, 13 Sep 2026: twelve of them on one officer's notifications).
 */
const NOTIFICATION_TITLES: Record<AuditEntry["action"], string> = {
  submit: "Application Submitted",
  certify: "Application Certified",
  forward: "Application Forwarded",
  raiseDeficiency: "Deficiency Noted",
  communicateDeficiency: "Deficiency Raised",
  respondDeficiency: "Correction Submitted",
  raiseQuery: "Query Raised",
  resolveQuery: "Query Resolved",
  concur: "Financial Concurrence Recorded",
  sanction: "Application Sanctioned",
  reject: "Application Rejected",
  return: "Returned for Rework",
  routeDown: "Returned for Rework",
  inspectionScheduled: "Inspection Scheduled",
  inspectionSubmitted: "Inspection Report Submitted",
  inspectionReviewed: "Inspection Report Reviewed",
};

export function notificationTitle(action: AuditEntry["action"]): string {
  return NOTIFICATION_TITLES[action];
}

/**
 * The events an applicant is told about: the file was received, something needs them, or the
 * file has an outcome. The Ministry's internal moves — a forward from ASO to SO, a query between
 * divisions, a concurrence — are not, for the same reason the applicant's processing history
 * folds them into one step: they name the Ministry's seats and ask nothing of the NGO.
 */
const APPLICANT_NOTIFIED: ReadonlySet<AuditEntry["action"]> = new Set<AuditEntry["action"]>([
  "submit",
  "communicateDeficiency",
  "respondDeficiency",
  "sanction",
  "reject",
  "inspectionScheduled",
]);

export function notifiesApplicant(action: AuditEntry["action"]): boolean {
  return APPLICANT_NOTIFIED.has(action);
}

/** "Application X — remark." with exactly one full stop, whatever the remark ends with. */
export function notificationBody(appId: string, remarks: string | undefined): string {
  const note = (remarks ?? "").trim().replace(/[.\s]+$/, "");
  return note ? `Application ${appId} — ${note}.` : `Application ${appId} has been updated.`;
}

/* ── the officer's status column ──────────────────────────────────────────── */

export interface OfficerStatus {
  label: string;
  tone: "warning" | "success" | "danger" | "info" | "neutral";
  /** Material Symbols glyph — the status is never carried by colour alone (WCAG 1.4.1). */
  icon: string;
  /** A second line naming the file's secondary state, where there is one. */
  note?: string;
}

/**
 * The status an officer reads in a worklist. The call (T879–925) asked for the deficiency and
 * rework states to stand out in words, not only a colour, and for "Resubmitted" to be named
 * as such rather than hidden under a generic "Submitted".
 */
export function officerStatus(app: GrantApplication, inspectionReady = false): OfficerStatus {
  let s: OfficerStatus;
  switch (app.status) {
    case "DeficiencyProposed":
      s = { label: "Deficiency to Send", tone: "warning", icon: "outgoing_mail", note: "Noted by the ASO · not yet sent to the NGO" };
      break;
    case "DeficiencyRaised":
      s = { label: "Deficiency Raised", tone: "warning", icon: "report", note: "With the NGO for correction" };
      break;
    case "DeficiencyResponded":
      s = { label: "Resubmitted after Deficiency", tone: "info", icon: "published_with_changes" };
      break;
    case "QueryRaised":
      s = { label: "Returned for Rework", tone: "warning", icon: "undo" };
      break;
    case "Returned":
      // The same state as a query pushed down, from one level higher; one name for both, so
      // the dashboard count and the rows it counts agree.
      s = { label: "Returned for Rework", tone: "warning", icon: "undo", note: "By the Programme Director" };
      break;
    case "Sanctioned":
    case "Released":
      s = { label: "Sanctioned", tone: "success", icon: "verified" };
      break;
    case "Rejected":
      s = { label: "Rejected", tone: "danger", icon: "cancel" };
      break;
    case "Draft":
      s = { label: "Draft", tone: "neutral", icon: "edit_note" };
      break;
    case "Submitted":
      s = { label: "New Submission", tone: "info", icon: "inbox" };
      break;
    default:
      // Under Examination, Under Financial Examination, Concurred by Finance, Awaiting Sanction,
      // Grant Released — the same words the review screen's badge uses, from one table.
      s = { label: STATUS_LABEL[app.status], tone: "neutral", icon: "pending" };
  }
  if (inspectionReady && !s.note) s.note = "Inspection report available";
  return s;
}

/** A short, human reference for the case type, used as a badge. */
export function caseLabel(app: GrantApplication): string {
  if (app.caseType === "New") return "New";
  return app.instalment ? `${ordinal(app.instalment)} Instalment` : "Ongoing";
}

export function ordinal(n: number): string {
  return n === 1 ? "1st" : n === 2 ? "2nd" : n === 3 ? "3rd" : `${n}th`;
}

/* ── projects, accounts, instalments ──────────────────────────────────────── */

export function projectsOf(state: EAnudaanState, ngoId: string): Institution[] {
  return state.ngos.find((n) => n.id === ngoId)?.institutions ?? [];
}

export function projectName(p: Institution): string {
  return `${p.name} — ${p.district}`;
}

/**
 * What to call the project an application is filed under. The NGO's own record first; failing
 * that, the district its Project ID names; only then the label written at submission, which for a
 * renewal is the picker's option text ("Garima Greh, Pune").
 */
export function projectTitleFor(state: EAnudaanState, app: GrantApplication): string {
  const inst = state.ngos.flatMap((n) => n.institutions).find((i) => i.id === app.institutionId);
  if (inst) return projectName(inst);
  const place = placeOfProjectId(app.institutionId);
  if (place) return `Project ${app.institutionId} — ${place.district}`;
  return app.projectLabel.split(" · ")[0] ?? app.institutionId;
}

/** The account a project is paid into now, and the ones it used before. */
export function accountsFor(state: EAnudaanState, projectId: string): { current?: ProjectAccount; previous: ProjectAccount[] } {
  const all = state.projectAccounts.filter((a) => a.projectId === projectId);
  return {
    current: all.find((a) => !a.activeTo),
    previous: all.filter((a) => a.activeTo).sort((a, b) => Date.parse(b.activeTo!) - Date.parse(a.activeTo!)),
  };
}

export function maskedAccount(last4: string): string {
  return `XXXX XXXX ${last4}`;
}

/**
 * The instalment an ongoing application for this project will claim next. The call settled
 * (T370–383) that the applicant is never asked to choose: the system knows what has been
 * claimed. Instalments run 1 → 2 → 3 and then begin again for the following cycle.
 *
 * Read from the LAST claim, not from a count of claims: a project migrated from the earlier
 * system opens on whichever instalment it had reached there, so counting from zero put a
 * "1st Instalment" claim on a project whose last sanctioned file here was its 3rd.
 */
export function nextInstalment(state: EAnudaanState, schemeCode: string, projectId: string): 1 | 2 | 3 {
  const last = state.applications
    .filter(
      (a) =>
        a.schemeCode === schemeCode &&
        a.institutionId === projectId &&
        a.caseType === "Ongoing" &&
        a.instalment &&
        a.status !== "Draft" &&
        a.status !== "Rejected",
    )
    .sort((a, b) => a.financialYear.localeCompare(b.financialYear) || Date.parse(a.submittedAt ?? a.updatedAt) - Date.parse(b.submittedAt ?? b.updatedAt))
    .at(-1);
  return instalmentAfter(last?.instalment);
}

/** 1 → 2 → 3 → 1. The one rule the seed and the wizard both follow. */
export function instalmentAfter(previous: number | undefined): 1 | 2 | 3 {
  return (((previous ?? 0) % 3) + 1) as 1 | 2 | 3;
}

/**
 * Since when a project has been running, and so owes monthly attendance returns.
 *
 *   `null`       never sanctioned — a project still at application stage owes no returns.
 *   `undefined`  running since before the portal's records begin (a project migrated from the
 *                earlier system, whose first file here is already an instalment claim).
 *   ISO string   the first sanction recorded on the portal.
 */
export function projectRunningSince(state: EAnudaanState, projectId: string): string | null | undefined {
  const files = state.applications.filter((a) => a.institutionId === projectId);
  const firstFile = [...files].filter((a) => a.status !== "Draft").sort((a, b) => a.financialYear.localeCompare(b.financialYear))[0];
  if (firstFile?.caseType === "Ongoing") return undefined;
  // The earlier of the first sanction order and the start (1 April) of the year it was sanctioned
  // for: a grant for 2022-23 sanctioned late still means the project ran in 2022-23.
  const starts = files
    .filter((a) => a.sanction)
    .flatMap((a) => [a.sanction!.sanctionedAt, `${a.financialYear.slice(0, 4)}-04-01T00:00:00.000Z`])
    .sort();
  return starts[0] ?? null;
}

/**
 * A project belongs to one scheme, and its ID says which in its first segment — the convention
 * `submission.ts` mints new IDs by. A SHRESHTA school cannot also be a NAPDDR centre.
 */
// One table for both minting a Project ID and reading its scheme back — defined beside
// `projectForSubmission`, which mints them.
export { PROJECT_ID_PREFIX };

export function schemeOfProjectId(projectId: string): string | undefined {
  const prefix = projectId.split("/")[0];
  return Object.keys(PROJECT_ID_PREFIX).find((code) => PROJECT_ID_PREFIX[code] === prefix);
}

/* ── reference numbers ────────────────────────────────────────────────────── */

/** Where the live portal's application serials stood at the 22 Aug 2026 walkthrough (83515, 83516). */
export const REFERENCE_SERIAL_BASE = 83500;

/**
 * The reference number minted on submit: `GIA/<FY>/<SCHEME>/<DISTRICT>/<serial>`.
 *
 * The DISTRICT segment is the district of the project the application is filed under. It used to
 * be taken from whatever the form held — the institution's address on SHRESHTA and AVYAY, the site
 * district on SMILE — so an address typed into a textarea became `PLOT_14_SECTOR_5_ROHINI_NORTH`,
 * and a SMILE renewal of a Pune project carried NICOBAR from an unrelated answer (full-wizard
 * walk, 13 Sep 2026). The live portal was seen using the address on SHRESHTA on 22 Aug 2026; the
 * department's documented form is district, and a reference is read by people, so district it is.
 */
export function buildReference(schemeCode: string, financialYear: string, district: string | undefined, serial: number): string {
  const slug = (district ?? "")
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 30)
    .replace(/_+$/, "");
  return `GIA/${financialYear}/${schemeCode.toUpperCase()}/${slug || "PROVISIONAL"}/${serial}`;
}

/**
 * The district a Project ID belongs to: the NGO's record of it; else the project this submission
 * creates; else another of the NGO's projects under the same State and district codes; else the
 * codes in the ID read against the district list.
 */
export function districtOfProject(ngo: NgoProfile | undefined, projectId: string, created?: Institution): string | undefined {
  const codes = projectId.split("/").slice(1, 3).join("/");
  return (
    ngo?.institutions.find((i) => i.id === projectId)?.district ??
    created?.district ??
    (codes.includes("/") ? ngo?.institutions.find((i) => i.id.split("/").slice(1, 3).join("/") === codes)?.district : undefined) ??
    placeOfProjectId(projectId)?.district
  );
}

/**
 * The next serial, one past the highest already issued. A count of applications is not a
 * sequence — it repeats the moment a record leaves the list — so the serial is read from the
 * references themselves.
 */
export function nextReferenceSerial(existingIds: readonly string[]): number {
  let max = REFERENCE_SERIAL_BASE - 1;
  for (const id of existingIds) {
    const m = /^GIA\/.+\/(\d+)$/.exec(id);
    if (m) max = Math.max(max, Number(m[1]));
  }
  return max + 1;
}

/**
 * Everything a submission needs to be filed: the serial, the project it is filed under, and the
 * reference built from both. One function, so the serial the new Project ID carries and the one
 * the reference carries cannot drift apart.
 */
export function mintReference(
  ngo: NgoProfile,
  existingIds: readonly string[],
  schemeCode: string,
  financialYear: string,
  values: Record<string, string>,
): { id: string; serial: number; project: SubmittedProject } {
  const serial = nextReferenceSerial(existingIds);
  const project = projectForSubmission(ngo, schemeCode, values, serial);
  const id = buildReference(schemeCode, financialYear, districtOfProject(ngo, project.institutionId, project.created), serial);
  return { id, serial, project };
}

/* ── the answers as submitted ─────────────────────────────────────────────── */

export interface AnsweredSection {
  index: number;
  title: string;
  /** The questions this application was actually asked, on its own branch. */
  fields: readonly FieldDef[];
  /** Questions with an answer. */
  answered: number;
  /** Required questions without one — what would make the application incomplete. */
  missingRequired: number;
  /** Optional questions left blank. Not a gap: the applicant was entitled to leave them. */
  optionalBlank: number;
}

/**
 * The sections of an application as its applicant saw them. A step the branch never shows (AVYAY
 * renewal's Justification) and a field hidden by an earlier answer are not questions this
 * applicant was asked, so they are neither listed nor counted — counting them told a complete
 * application it was "47 of 51" done (full-wizard walk, 13 Sep 2026).
 */
export function answeredSections(schemeCode: string, values: Record<string, string>): AnsweredSection[] {
  const wizard = wizardFor(schemeCode);
  if (!wizard) return [];
  const has = (f: FieldDef) => (values[f.name] ?? "").trim() !== "";
  const sections = visibleSteps(wizard, values)
    .filter((step) => step.kind !== "documents" && step.kind !== "review")
    .flatMap((step) => step.sections);
  const out: AnsweredSection[] = [];
  for (const section of sections) {
    const fields = section.fields.filter((f) => fieldVisible(f, values));
    if (fields.length === 0) continue;
    out.push({
      index: out.length + 1,
      title: section.title,
      fields,
      answered: fields.filter(has).length,
      missingRequired: fields.filter((f) => f.required && !has(f)).length,
      optionalBlank: fields.filter((f) => !f.required && !has(f)).length,
    });
  }
  return out;
}

/**
 * The financial years an application may be made for: the one running, the one before it and
 * the one after. "Maximum three" was the department's own answer (T363–368) — a year-long
 * approval can push a claim into the next year, or leave one owed for the last.
 */
export function selectableFinancialYears(now = new Date()): string[] {
  const y = now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;
  const fy = (start: number) => `${start}-${String((start + 1) % 100).padStart(2, "0")}`;
  return [fy(y - 1), fy(y), fy(y + 1)];
}
