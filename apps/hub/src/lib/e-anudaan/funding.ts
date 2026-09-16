/**
 * What a file's NGO and project have been sanctioned and released, and where the file's own
 * instalments stand — the three money panels of the officer review screen.
 *
 * Live UAT carries all three on the Under Secretary's decision screen (SM2-PD-US-DECISION,
 * captured 16 Sep 2026): "Previously Allocated Funds — this NGO", "Sanction & Disbursement — this
 * Project" and "Instalments & Fund Release". Ours showed only the project's earlier sanctions,
 * with no released amount and no NGO-wide total (parity inventory §21 items 1, 2 and 8).
 *
 * Pure — no React — so the figures the review, the report and Payment Status print are the same
 * figures, computed once.
 */

import { annualRecurringOf, instalmentLabel, instalmentPlan, RELEASE_PATTERN } from "./instalments.ts";
import type { EAnudaanState, GrantApplication } from "./types.ts";

/** What has been released against a sanction. A sanction with no release has released nothing. */
export function releasedOf(app: Pick<GrantApplication, "release">): number {
  return app.release?.amount ?? 0;
}

/* ── Previously allocated funds — this NGO ────────────────────────────────── */

export interface NgoSanctionRow {
  app: GrantApplication;
  financialYear: string;
  orderNo: string;
  sanctionedAt: string;
  scheme: string;
  amount: number;
}

/**
 * Every sanction order issued to the NGO, newest first, excluding the file under review — the
 * live table lists prior orders "across financial years", and the file being decided is not prior.
 */
export function ngoSanctions(state: Pick<EAnudaanState, "applications">, ngoId: string, excludeId?: string): { rows: NgoSanctionRow[]; total: number } {
  const rows = state.applications
    .filter((a) => a.ngoId === ngoId && a.sanction && a.id !== excludeId)
    .map((a) => ({
      app: a,
      financialYear: a.financialYear,
      orderNo: a.sanction!.orderNo,
      sanctionedAt: a.sanction!.sanctionedAt,
      scheme: a.schemeCode,
      amount: a.sanction!.total,
    }))
    .sort((x, y) => y.sanctionedAt.localeCompare(x.sanctionedAt) || y.orderNo.localeCompare(x.orderNo));
  return { rows, total: rows.reduce((s, r) => s + r.amount, 0) };
}

/* ── Sanction and disbursement — this project ─────────────────────────────── */

export interface ProjectSanctionRow {
  app: GrantApplication;
  sanctioned: number;
  released: number;
}

/** Every sanctioned grant on the project, across years and schemes, with what each released. */
export function projectDisbursement(
  state: Pick<EAnudaanState, "applications">,
  projectId: string,
): { rows: ProjectSanctionRow[]; totalSanctioned: number; totalReleased: number } {
  const rows = state.applications
    .filter((a) => a.institutionId === projectId && a.sanction)
    .map((a) => ({ app: a, sanctioned: a.sanction!.total, released: releasedOf(a) }))
    .sort((x, y) => y.app.sanction!.sanctionedAt.localeCompare(x.app.sanction!.sanctionedAt));
  return {
    rows,
    totalSanctioned: rows.reduce((s, r) => s + r.sanctioned, 0),
    totalReleased: rows.reduce((s, r) => s + r.released, 0),
  };
}

/* ── Instalments and fund release — this file ────────────────────────────── */

export type ScheduleState =
  /** Released to the NGO. */
  | "released"
  /** Sanctioned and waiting for the Under Secretary to release it. */
  | "to-release"
  /** Claimed by the NGO and under examination. */
  | "claimed"
  /** Opened for claim; the NGO has not filed it yet. */
  | "open"
  /** The one before it is released; it can be opened for claim now. */
  | "can-open"
  /** Not open until the one before it is released. */
  | "not-opened"
  /** Due in a financial year that has not begun. */
  | "not-yet";

export interface ScheduleRow {
  key: string;
  label: string;
  /** Share of the year's recurring grant, per cent. Absent on a New grant's own row. */
  share?: number;
  planned: number;
  /** The file that claims it, once filed. */
  claim?: GrantApplication;
  released: number;
  state: ScheduleState;
  /** The released file an "Open for Claim" is recorded on, for a `can-open` or `open` row. */
  openedFrom?: GrantApplication;
  /** The label of the row before it, for "Opens once the 1st Instalment is released". */
  previousLabel?: string;
}

export interface InstalmentSchedule {
  scheme: string;
  financialYear: string;
  /** "40%, 40%, 20%" */
  pattern: readonly number[];
  annualRecurring: number;
  rows: ScheduleRow[];
  releasedSoFar: number;
}

const patternOf = (scheme: string): readonly number[] => RELEASE_PATTERN[scheme.toUpperCase()] ?? [40, 40, 20];

const isLive = (a: GrantApplication) => a.status !== "Draft" && a.status !== "Rejected";

function claimState(claim: GrantApplication): ScheduleState {
  if (claim.release) return "released";
  if (claim.sanction) return "to-release";
  return "claimed";
}

/** The row that follows a released file: opened, openable, or waiting for a year to begin. */
function followingState(prev: GrantApplication | undefined, prevState: ScheduleState | undefined, yearOpen = true): ScheduleState {
  if (!prev || prevState !== "released") return "not-opened";
  if (prev.claimOpenedAt) return "open";
  return yearOpen ? "can-open" : "not-yet";
}

/**
 * The instalments of the year a sanctioned file belongs to, following the scheme's release pattern
 * (`RELEASE_PATTERN` — 40/40/20, SMILE 50/50). A New grant is released whole and is followed by the
 * next year's 1st instalment, as `instalmentPlan` derives it. Undefined for a file with no sanction.
 */
export function instalmentSchedule(state: EAnudaanState, app: GrantApplication, now: Date = new Date()): InstalmentSchedule | undefined {
  if (!app.sanction) return undefined;
  const scheme = app.schemeCode.toUpperCase();
  const pattern = patternOf(scheme);
  const files = state.applications.filter(
    (a) => a.schemeCode.toUpperCase() === scheme && a.institutionId === app.institutionId && a.financialYear === app.financialYear && isLive(a),
  );
  const rows: ScheduleRow[] = [];

  const newGrant = files.find((a) => a.caseType === "New" && a.sanction);
  const anchor = files.find((a) => a.caseType === "Ongoing" && a.sanction) ?? newGrant ?? app;
  const annualRecurring = annualRecurringOf(anchor);

  if (app.caseType === "New") {
    rows.push({ key: "new", label: "New Grant", planned: app.sanction.total, claim: app, released: releasedOf(app), state: claimState(app) });
    // The next claim is next year's 1st instalment.
    const plan = instalmentPlan(state, scheme, app.institutionId, now);
    const share = pattern[0] ?? 0;
    rows.push({
      key: "next-1",
      label: `${instalmentLabel(1)}, FY ${plan.financialYear ?? ""}`.trim(),
      share,
      planned: Math.round((annualRecurring * share) / 100),
      released: 0,
      state: followingState(app, rows[0]!.state, plan.state !== "not-yet"),
      openedFrom: app,
      previousLabel: "New Grant",
    });
  } else {
    pattern.forEach((share, i) => {
      const n = i + 1;
      const claim = files.filter((a) => a.caseType === "Ongoing" && a.instalment === n).sort((x, y) => Number(!!y.sanction) - Number(!!x.sanction))[0];
      const prev = rows[i - 1];
      const label = instalmentLabel(n);
      rows.push({
        key: `i${n}`,
        label,
        share,
        planned: Math.round((annualRecurring * share) / 100),
        claim,
        released: claim ? releasedOf(claim) : 0,
        state: claim ? claimState(claim) : n === 1 ? "not-opened" : followingState(prev?.claim, prev?.state),
        openedFrom: claim ? undefined : prev?.claim,
        previousLabel: prev?.label,
      });
    });
  }

  return {
    scheme,
    financialYear: app.financialYear,
    pattern,
    annualRecurring,
    rows,
    releasedSoFar: rows.reduce((s, r) => s + r.released, 0),
  };
}

/** "Released in three instalments: 40%, 40%, 20%." — the pattern stated as a fact, once. */
export function releasePatternFact(pattern: readonly number[]): string {
  const words = ["", "one", "two", "three", "four", "five"];
  return `The recurring grant is released in ${words[pattern.length] ?? pattern.length} instalments: ${pattern.map((p) => `${p}%`).join(", ")}.`;
}
