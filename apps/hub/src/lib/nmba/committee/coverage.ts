// Coverage = registered committees vs the number expected for the viewer's
// jurisdiction. Turns the flow from "fill forms" into "close the gap".
//
//   Denominators come from the official hierarchy we hold:
//     STATE tier    → 1 per state (or all States/UTs, for Admin)
//     DISTRICT tier → the districts in STATE_DISTRICTS
//     BLOCK tier    → no master list (blocks are free text) → count only, no %.

import { STATES, STATE_DISTRICTS } from "@/lib/nmba/states";
import type { CommitteeRecord, PortalSession } from "./types";

export interface CoverageMetric {
  key: string;
  label: string;
  registered: number;
  /** null when there is no known denominator (blocks). */
  expected: number | null;
}

function distinct<T>(values: (T | undefined)[]): number {
  return new Set(values.filter((v): v is T => v !== undefined && v !== null)).size;
}

/** Coverage metrics for the viewer, computed from the records they can see. */
export function computeCoverage(records: CommitteeRecord[], session: PortalSession): CoverageMetric[] {
  const byTier = (t: CommitteeRecord["tier"]) => records.filter((r) => r.tier === t);

  if (session.role === "ADMIN") {
    const knownDistrictTotal = Object.values(STATE_DISTRICTS).reduce((n, ds) => n + ds.length, 0);
    return [
      { key: "states", label: "States/UTs with a State committee", registered: distinct(byTier("STATE").map((r) => r.state)), expected: STATES.length },
      { key: "districts", label: "Districts with a committee", registered: distinct(byTier("DISTRICT").map((r) => `${r.state}|${r.district}`)), expected: knownDistrictTotal },
      { key: "blocks", label: "Block committees registered", registered: byTier("BLOCK").length, expected: null },
    ];
  }

  if (session.role === "STATE") {
    // The State officer's own State committee is always 0/1 or 1/1 — not a
    // meaningful "coverage" number, and already visible on the State page. Show
    // only the metric that actually varies: district registration across the state.
    const districtsExpected = session.state ? STATE_DISTRICTS[session.state]?.length ?? null : null;
    return [
      { key: "districts", label: "Districts registered", registered: distinct(byTier("DISTRICT").map((r) => r.district)), expected: districtsExpected },
      { key: "blocks", label: "Block committees registered", registered: byTier("BLOCK").length, expected: null },
    ];
  }

  // DISTRICT — one district committee (1-max) plus free-text blocks with no
  // master list, so there is no meaningful denominator; only a block count.
  return [
    { key: "blocks", label: "Block committees registered", registered: byTier("BLOCK").length, expected: null },
  ];
}
