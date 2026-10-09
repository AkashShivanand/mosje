/**
 * The six dashboards and KPIs of BRD §11, computed from one list of advices.
 *
 * Every report reads its stage from `stageOf()` — the same expression the queues and the case
 * page use — so a count on the pipeline can always be traced to the rows beneath it.
 */

import type { ClaimReferenceBatch, Masters, PaymentAdvice } from "./types.ts";
import { STAGES, EXCEPTIONS, type AnyStage, latestRequest, stageOf, allCredited } from "./stages.ts";
import { pfmsError } from "./errors.ts";
import { everyAdvice, pfmsFinancialYear } from "./advice.ts";

const DAY = 86_400_000;

/** An advice and the ones it replaced: a consumed number or a refusal stays counted after a fresh start. */
const withEarlier = (advices: readonly PaymentAdvice[]): PaymentAdvice[] => everyAdvice(advices) as PaymentAdvice[];

/* ── Sanction Pipeline ───────────────────────────────────────────────────── */

export function pipelineCounts(advices: readonly PaymentAdvice[], awaitingAdvice: number): Record<AnyStage, number> {
  const out = Object.fromEntries([...STAGES, ...EXCEPTIONS].map((s) => [s, 0])) as Record<AnyStage, number>;
  out["awaiting-advice"] = awaitingAdvice;
  for (const a of advices) out[stageOf(a)] += 1;
  return out;
}

/* ── Ageing (DDO-wise) ───────────────────────────────────────────────────── */

export interface AgeingRow {
  ddoCode: string;
  ddoName: string;
  stage: AnyStage;
  adviceId: string;
  appId: string;
  days: number;
  overThreshold: boolean;
}

/** When the advice last moved: its latest PFMS status, else its last local change. */
export function sinceLastMove(a: PaymentAdvice): string {
  return latestRequest(a)?.statusAt ?? a.updatedAt;
}

export function ageing(advices: readonly PaymentAdvice[], masters: Masters, now: string, thresholdDays: number): AgeingRow[] {
  return advices
    .filter((a) => {
      const s = stageOf(a);
      return s !== "paid" && s !== "closed" && s !== "cancelled" && s !== "fy-expired";
    })
    .map((a) => {
      const days = Math.max(0, Math.floor((Date.parse(now) - Date.parse(sinceLastMove(a))) / DAY));
      return {
        ddoCode: a.header.ddoCode || "—",
        ddoName: masters.ddos.find((d) => d.code === a.header.ddoCode)?.name ?? "DDO not chosen",
        stage: stageOf(a),
        adviceId: a.id,
        appId: a.appId,
        days,
        overThreshold: days > thresholdDays,
      };
    })
    .sort((x, y) => y.days - x.days);
}

/* ── Disbursement Reconciliation ─────────────────────────────────────────── */

/** One line of the Ministry Release / Transfer Entry feed (GetPFMSMinistryReleaseAndTEData). */
export interface ReleaseEntry {
  uniqueIdentifier: string;
  amount: number;
  utr: string;
  date: string;
}

export type ReconState = "matched" | "amount-differs" | "utr-differs" | "not-in-feed";

export interface ReconRow {
  adviceId: string;
  appId: string;
  schemeCode: string;
  ddoCode: string;
  sanctioned: number;
  credited: number;
  utr: string;
  feedAmount: number | null;
  state: ReconState;
}

export const RECON_LABEL: Record<ReconState, string> = {
  matched: "Matched",
  "amount-differs": "Amount Differs",
  "utr-differs": "UTR Differs",
  "not-in-feed": "Not in Release Feed",
};

export function reconcile(advices: readonly PaymentAdvice[], feed: readonly ReleaseEntry[]): ReconRow[] {
  return advices
    .filter((a) => allCredited(latestRequest(a)))
    .map((a) => {
      const req = latestRequest(a)!;
      const credited = req.payments.reduce((s, p) => s + p.amount, 0);
      const utr = req.payments.map((p) => p.utr).join(", ");
      const entry = feed.find((f) => f.uniqueIdentifier === req.uniqueIdentifier);
      const state: ReconState = !entry ? "not-in-feed" : entry.amount !== credited ? "amount-differs" : entry.utr !== req.payments[0]?.utr ? "utr-differs" : "matched";
      return { adviceId: a.id, appId: a.appId, schemeCode: a.schemeCode, ddoCode: a.header.ddoCode, sanctioned: a.sanctionAmount, credited, utr, feedAmount: entry?.amount ?? null, state };
    });
}

/* ── Failure / Exception trend ───────────────────────────────────────────── */

export interface FailureRow {
  month: string; // YYYY-MM
  category: string;
  count: number;
}

export function failureTrend(advices: readonly PaymentAdvice[]): FailureRow[] {
  const map = new Map<string, number>();
  for (const a of withEarlier(advices)) {
    for (const r of a.requests) {
      for (const e of r.errors) {
        const key = `${r.sentAt.slice(0, 7)}|${pfmsError(e.code).category}`;
        map.set(key, (map.get(key) ?? 0) + 1);
      }
    }
  }
  return [...map.entries()]
    .map(([k, count]) => {
      const [month, category] = k.split("|") as [string, string];
      return { month, category, count };
    })
    .sort((x, y) => x.month.localeCompare(y.month) || x.category.localeCompare(y.category));
}

export function failureCodes(advices: readonly PaymentAdvice[]): { code: string; count: number; message: string; category: string }[] {
  const map = new Map<string, number>();
  for (const a of withEarlier(advices)) for (const r of a.requests) for (const e of r.errors) map.set(e.code, (map.get(e.code) ?? 0) + 1);
  return [...map.entries()].map(([code, count]) => ({ code, count, message: pfmsError(code).message, category: pfmsError(code).category })).sort((x, y) => y.count - x.count);
}

/* ── Claim Reference Pool Utilisation ────────────────────────────────────── */

export interface PoolRow {
  pdCode: string;
  financialYear: string;
  drawn: number;
  consumed: number;
  remaining: number;
}

export function usedClaimReferences(advices: readonly PaymentAdvice[]): Set<string> {
  return new Set(withEarlier(advices).flatMap((a) => a.beneficiaries.map((b) => b.claimReference).filter((n): n is string => !!n)));
}

export function poolUtilisation(pool: readonly ClaimReferenceBatch[], advices: readonly PaymentAdvice[]): PoolRow[] {
  const used = usedClaimReferences(advices);
  const groups = new Map<string, PoolRow>();
  for (const b of pool) {
    const key = `${b.pdCode}|${b.financialYear}`;
    const row = groups.get(key) ?? { pdCode: b.pdCode, financialYear: b.financialYear, drawn: 0, consumed: 0, remaining: 0 };
    row.drawn += b.numbers.length;
    row.consumed += b.numbers.filter((n) => used.has(n)).length;
    row.remaining = row.drawn - row.consumed;
    groups.set(key, row);
  }
  return [...groups.values()].sort((x, y) => x.pdCode.localeCompare(y.pdCode));
}

/** Draw a fresh batch from PFMS (GetClaimReferenceNumber), numbered after the last one drawn. */
export function drawBatch(pool: readonly ClaimReferenceBatch[], pdCode: string, financialYear: string, size: number, now: string): ClaimReferenceBatch {
  const fy = pfmsFinancialYear(financialYear);
  const already = pool.filter((b) => b.pdCode === pdCode && b.financialYear === fy).reduce((s, b) => s + b.numbers.length, 0);
  const numbers = Array.from({ length: size }, (_, i) => `CR${fy.slice(-2)}${pdCode.slice(-4)}${String(already + i + 1).padStart(5, "0")}`);
  return { pdCode, financialYear: fy, drawnAt: now, numbers };
}

/* ── Turnaround ──────────────────────────────────────────────────────────── */

export interface TurnaroundRow {
  schemeCode: string;
  count: number;
  averageDays: number;
  longestDays: number;
  longestAppId: string;
}

/** Days from the US-PD sanction to the confirmed credit, per scheme (§11, last row). */
export function turnaround(advices: readonly PaymentAdvice[], sanctionedAt: (appId: string) => string | undefined): TurnaroundRow[] {
  const rows = new Map<string, { days: number[]; longest: { d: number; appId: string } }>();
  for (const a of advices) {
    const req = latestRequest(a);
    if (!allCredited(req)) continue;
    const creditedAt = req!.payments.map((p) => p.scrollDate).filter(Boolean).sort().at(-1);
    const from = sanctionedAt(a.appId);
    if (!creditedAt || !from) continue;
    const d = Math.max(0, Math.round((Date.parse(creditedAt) - Date.parse(from)) / DAY));
    const g = rows.get(a.schemeCode) ?? { days: [], longest: { d: -1, appId: "" } };
    g.days.push(d);
    if (d > g.longest.d) g.longest = { d, appId: a.appId };
    rows.set(a.schemeCode, g);
  }
  return [...rows.entries()].map(([schemeCode, g]) => ({
    schemeCode,
    count: g.days.length,
    averageDays: Math.round(g.days.reduce((s, x) => s + x, 0) / g.days.length),
    longestDays: g.longest.d,
    longestAppId: g.longest.appId,
  }));
}
