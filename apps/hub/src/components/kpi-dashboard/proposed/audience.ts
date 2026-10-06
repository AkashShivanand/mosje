import { SD_PERSONAS } from "@/lib/explorations/service-discovery-master";
import type { PortalId } from "@/lib/kpi/types";

/**
 * TYPE OF APPLICANT — the public dashboard's one filter beyond the area, multi-select.
 *
 * THE LABEL AND THE GROUPS ARE THE ONES THE ADDITIONAL SECRETARY APPROVED: the eleven
 * "Type of Applicant" groups finalised at her review of 14 Sep 2026 (MoSJE Handoff,
 * Offerings › Scheme Discovery, node 52500:8212), held in the scheme-discovery master
 * (`SD_PERSONAS`) that the DBIM Schemes and Services filter and home personas also read
 * (`lib/website-dbim/applicants.ts`). Same words, same order, nothing invented.
 *
 * Only the groups this dashboard has figures for are offered — nine of the eleven.
 * Transgender Persons and Victims of Atrocities have no figure here yet, and a choice that
 * empties the page is not a filter (`data-state-completeness.md`).
 *
 * WHICH FIGURES BELONG TO WHICH GROUP is the same master's: each scheme's "who" list
 * (`SD_SCHEMES[].who`). A card is shown when ANY of its groups is chosen. Nothing chosen
 * means every group — the page unfiltered. The choice lives in the address
 * (`?for=sc,student`), like the area, so a filtered view can be shared.
 */
export type Audience = "student" | "sc" | "obc" | "dnt" | "safai" | "senior" | "drug" | "begging" | "ngo";

const OFFERED: Audience[] = ["student", "sc", "obc", "dnt", "safai", "senior", "drug", "begging", "ngo"];

/** The offered groups, in the approved order and words. */
export const AUDIENCES: { id: Audience; label: string }[] = SD_PERSONAS.filter((p): p is typeof p & { id: Audience } =>
  (OFFERED as string[]).includes(p.id),
).map((p) => ({ id: p.id, label: p.label }));

/** The filter's label, as approved. */
export const AUDIENCE_LABEL = "Type of Applicant";

const IDS = new Set<string>(AUDIENCES.map((a) => a.id));

/** `?for=` → the chosen groups, ignoring anything the page does not offer. */
export function parseAudiences(raw: string | null | undefined): Set<Audience> {
  return new Set((raw ?? "").split(",").filter((x): x is Audience => IDS.has(x)));
}

/** The chosen groups → `?for=`, in the approved order; empty when everyone is shown. */
export function serialiseAudiences(set: Set<Audience>): string {
  return AUDIENCES.filter((a) => set.has(a.id)).map((a) => a.id).join(",");
}

/** Whether something for these groups is shown under the current choice. Nothing chosen = everything. */
export const shows = (chosen: Set<Audience>, who: Audience | readonly Audience[]) =>
  chosen.size === 0 || (typeof who === "string" ? chosen.has(who) : who.some((w) => chosen.has(w)));

/* ── Each figure's groups, from the master's `who` for its scheme ───────────── */

/** Scheme portals: NMBA = `napddr`; SMILE – Beggary = `smile-begging`; SHRESHTA = `shreshta`;
 *  Senior Citizens = the AVYAY schemes; DAPSC is the allocation for Scheduled Castes. */
export const PROGRAMME_AUDIENCE: Record<PortalId, Audience[]> = {
  nmba: ["drug", "ngo"],
  "smile-beggary": ["begging"],
  "e-utthaan": ["sc"],
  shreshta: ["sc", "student", "ngo"],
  "senior-citizens": ["senior", "ngo"],
};

/** The Beneficiary Dashboard's cards, by the record's card id (`lib/website-shared/dashboard.ts`). */
export const CARD_AUDIENCE: Record<string, Audience[]> = {
  sc: ["sc", "safai", "student"], // pms-sc + pre-matric-sc (SCs and Others, incl. Safai Karamcharis)
  obc: ["obc", "dnt", "student"], // yasasvi-pre, yasasvi-post
  shreyas: ["obc", "student"], // nfobc
  hostels: ["obc", "student"], // yasasvi-hostel
  "top-class": ["obc", "dnt", "student"], // yasasvi-school, yasasvi-college
  ambedkar: ["obc", "student"], // interest-subsidy-overseas
};

/** The Year by Year Trends views: SC, OBC and SHREYAS. */
export const TREND_AUDIENCE: Record<string, Audience[]> = { sc: CARD_AUDIENCE.sc!, obc: CARD_AUDIENCE.obc!, shreyas: CARD_AUDIENCE.shreyas! };

/** The Year on Year Report cards, by the record's card id. */
export const YOY_AUDIENCE: Record<string, Audience[]> = {
  hostels: CARD_AUDIENCE.hostels!,
  "tce-schools": ["obc", "dnt", "student"],
  "tce-colleges": ["obc", "dnt", "student"],
};

/** The nine fund slices of Share of Fund Release, by the live page's own slice label. */
export const FUND_SLICE_AUDIENCE: Record<string, Audience[]> = {
  "Post-Matric SC": ["sc", "student"],
  "Pre-Matric SC": ["sc", "safai", "student"],
  "Post-Matric OBC": ["obc", "dnt", "student"],
  "Pre-Matric OBC": ["obc", "dnt", "student"],
  "Top Class Colleges": ["obc", "dnt", "student"],
  "National Fellowship (SHREYAS)": ["obc", "student"],
  "Hostel Construction": ["obc", "student"],
  "Overseas Loan Interest Subsidy": ["obc", "student"],
  "Top Class Schools": ["obc", "dnt", "student"],
};

/** Every group a set of fund slices covers — for a figure that is their total. */
export const ALL_FUND_GROUPS: Audience[] = [...new Set(Object.values(FUND_SLICE_AUDIENCE).flat())];
