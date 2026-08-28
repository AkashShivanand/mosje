/* =============================================================================
   Adarsh Gram — the eighteen published counters, as the feed reported them.

   TRANSPORT ONLY. This module fetches and validates; it decides nothing about
   what a figure means. Whether a 0 is a reading or a gap, and which figures must
   agree with which, are declared in `ADARSH_GRAM_DESCRIPTOR` at the bottom and
   applied by `lib/data-mode/merge.ts` — in the browser, where the viewer's
   choice of data mode lives.

   Contract: `.claude/rules/live-data-fallback.md` and
   `.claude/rules/prototype-data-modes.md`.
   ========================================================================= */

import type { Descriptor, Reading } from "@/lib/data-mode/types";
import { ADARSH_GRAM_COUNTS_FALLBACK } from "./adarsh-gram-stats";

export type CountKey = keyof AdarshGramCounts;

export interface AdarshGramCounts {
  states_covered: number;
  districts_covered: number;
  villages: number;
  households: number;
  total_population: number;
  sc_population: number;
  assessment_initiated: number;
  assessment_completed: number;
  works_identified: number;
  works_gap_filling: number;
  works_completed: number;
  gap_filling_release_lakh: number;
  gap_filling_utilized_lakh: number;
  beneficiaries_identified: number;
  beneficiaries_covered: number;
  vdp_generated: number;
  vdp_dlcc_approved: number;
  adarsh_gram_declared: number;
}

export interface AdarshGramFeed {
  /**
   * What the feed actually said, per counter. `null` where it said nothing.
   *
   * DELIBERATELY UNMERGED. Merging here would settle, on the server, a question
   * the viewer answers in the demo rail — and it would settle it once, for a
   * page that is statically generated. The reading and the snapshot both travel
   * to the browser, and `mergeData` decides between them there.
   */
  reading: Reading<CountKey>;
  /** The mirrored snapshot, as published on `ADARSH_GRAM_AS_ON`. */
  mock: AdarshGramCounts;
  /** Whether the endpoint answered at all. Distinct from whether it had figures. */
  reachable: boolean;
}

const ENDPOINT =
  process.env.NEXT_PUBLIC_ADARSH_GRAM_API ??
  "https://adarshgram-api-dev.mosje.in/api/v1/admin/public/ag/home-counters";

const KEYS = Object.keys(ADARSH_GRAM_COUNTS_FALLBACK) as CountKey[];

/**
 * The eighteen counters, as the feed reported them.
 *
 * NOTE WHAT IS NO LONGER HERE. This function used to hold two pieces of
 * judgement — "a zero means unpopulated" and "a ratio's halves must share a
 * source" — hand-written for these particular counters. Both were right, and
 * both are now expressed once, declaratively, in `ADARSH_GRAM_DESCRIPTOR`, and
 * enforced for every dashboard by one tested merge. What is left here is
 * transport: fetch, validate the shape, hand back what was said.
 */
export async function getAdarshGramCounts(): Promise<AdarshGramFeed> {
  const mock = { ...ADARSH_GRAM_COUNTS_FALLBACK };
  try {
    const res = await fetch(ENDPOINT, {
      // An hour is well inside how often these counters move, and it keeps the
      // page static between refreshes rather than hitting the feed per request.
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const body: unknown = await res.json();
    const counts = (body as { data?: { counts?: Partial<AdarshGramCounts> } })?.data?.counts;
    if (!counts) throw new Error("no data.counts in response");

    const reading: Reading<CountKey> = {};
    for (const k of KEYS) {
      const v = counts[k];
      // `null` for anything that is not a finite number. A literal 0 is kept as
      // a 0 and judged later — whether it is a reading or a gap is a question
      // about its GROUP, which transport cannot answer.
      reading[k] = typeof v === "number" && Number.isFinite(v) ? v : null;
    }
    return { reading, mock, reachable: true };
  } catch {
    return { reading: {}, mock, reachable: false };
  }
}

/**
 * What must hold true across the eighteen counters.
 *
 * Every group here was learned from a defect this page actually shipped:
 *
 *  · The FUNNEL is monotone because a later stage cannot exceed an earlier one.
 *  · The three SUBSETS are the pairs that produced "gap-filling funds utilised:
 *    138%" — a snapshot numerator over a live denominator. Declared as a group,
 *    the merge cannot split them.
 *  · The ZERO settings are the dev feed's three unpopulated columns (works
 *    completed, works under gap-filling, funds utilised) versus the counters
 *    that are populated. `corroborated` lets the group answer rather than
 *    requiring an opinion per counter.
 */
export const ADARSH_GRAM_DESCRIPTOR: Descriptor<CountKey> = {
  id: "adarsh-gram",
  fields: {
    states_covered: { label: "States covered", zero: "missing" },
    districts_covered: { label: "Districts covered", zero: "missing" },
    villages: { label: "Villages selected", zero: "missing" },
    households: { label: "Need assessments filed", zero: "missing" },
    total_population: { label: "Total population", zero: "missing" },
    sc_population: { label: "SC population", zero: "missing" },
    assessment_initiated: { label: "Assessment initiated", zero: "corroborated" },
    assessment_completed: { label: "Assessment completed", zero: "corroborated" },
    works_identified: { label: "Works identified", zero: "missing" },
    // An unpopulated column on the dev feed today.
    works_gap_filling: { label: "Works under gap-filling", zero: "missing" },
    works_completed: { label: "Works completed", zero: "corroborated" },
    gap_filling_release_lakh: { label: "Gap-filling released", zero: "missing" },
    gap_filling_utilized_lakh: { label: "Gap-filling utilised", zero: "corroborated" },
    beneficiaries_identified: { label: "Beneficiaries identified", zero: "missing" },
    beneficiaries_covered: { label: "Beneficiaries covered", zero: "corroborated" },
    vdp_generated: { label: "Plans drawn", zero: "corroborated" },
    vdp_dlcc_approved: { label: "Plans approved", zero: "corroborated" },
    adarsh_gram_declared: { label: "Declared Adarsh Gram", zero: "corroborated" },
  },
  invariants: [
    {
      kind: "monotone",
      series: [
        "villages",
        "assessment_initiated",
        "assessment_completed",
        "vdp_generated",
        "vdp_dlcc_approved",
        "adarsh_gram_declared",
      ],
    },
    { kind: "subset", part: "works_completed", of: "works_identified" },
    { kind: "subset", part: "works_gap_filling", of: "works_identified" },
    { kind: "subset", part: "gap_filling_utilized_lakh", of: "gap_filling_release_lakh" },
    { kind: "subset", part: "beneficiaries_covered", of: "beneficiaries_identified" },
    { kind: "subset", part: "sc_population", of: "total_population" },
  ],
};
