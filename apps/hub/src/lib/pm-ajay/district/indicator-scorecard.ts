/**
 * Format VI — Status of Monitorable Indicators.
 *
 * The live screen scores a village against the scheme's ten monitorable-indicator
 * domains (`registers.ts`) and totals them into the one score already carried on
 * `VillageRecord.score`. There is no per-domain breakdown in the register — only
 * the total — so this derives one deterministically FROM that total: each of the
 * ten domains is worth ten points, and the totals never disagree, by construction,
 * with the score the dashboard and the village register already show for the same
 * village. Illustrative, per `.claude/rules/prototype-data-modes.md`.
 */

import { INDICATOR_DOMAINS, type VillageRecord } from "./registers";

export type IndicatorAchievement = "Achieved" | "Partially Achieved" | "Not Achieved";

export interface IndicatorScoreRow {
  domain: (typeof INDICATOR_DOMAINS)[number];
  status: IndicatorAchievement;
  /** Out of 10 — ten domains, equally weighted, sum to the village's score out of 100. */
  points: number;
  remarks: string;
}

const POINTS_PER_DOMAIN = 10;

const REMARKS: Record<IndicatorAchievement, string> = {
  Achieved: "All monitorable indicators achieved for this domain.",
  "Partially Achieved": "Some monitorable indicators achieved; others are in progress.",
  "Not Achieved": "Monitorable indicators for this domain are not yet achieved.",
};

/**
 * The village's ten-domain scorecard, or `null` when no score has been recorded
 * for it yet (Format VI has not been generated) — the screen's `empty` state,
 * distinct from `idle`.
 */
export function scorecardFor(village: VillageRecord): IndicatorScoreRow[] | null {
  if (village.score == null) return null;
  const achievedCount = Math.floor(village.score / POINTS_PER_DOMAIN);
  const remainder = village.score % POINTS_PER_DOMAIN;

  return INDICATOR_DOMAINS.map((domain, index) => {
    const status: IndicatorAchievement =
      index < achievedCount
        ? "Achieved"
        : index === achievedCount && remainder > 0
          ? "Partially Achieved"
          : "Not Achieved";
    const points = index < achievedCount ? POINTS_PER_DOMAIN : index === achievedCount ? remainder : 0;
    return { domain, status, points, remarks: REMARKS[status] };
  });
}

export function scoreTone(score: number): "success" | "warning" | "danger" {
  if (score >= 80) return "success";
  if (score >= 60) return "warning";
  return "danger";
}

export function scoreBand(score: number): string {
  if (score >= 80) return "On Track";
  if (score >= 60) return "Needs Attention";
  return "At Risk";
}

export function statusTone(status: IndicatorAchievement): "success" | "warning" | "danger" {
  if (status === "Achieved") return "success";
  if (status === "Partially Achieved") return "warning";
  return "danger";
}
