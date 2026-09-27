/**
 * Format – III(A): Household Level Data — supporting data.
 *
 * `registers.ts` carries `HOUSEHOLDS` (the household register itself, with its survey
 * status) but not the two things the live Format III(A) screens key their pickers on:
 * the pre-listed household numbers a village has not yet been surveyed against (the
 * live "Household ID" picker on Household Level Data), and the survey particulars
 * behind each already-surveyed household (the domain the survey assessed, and any
 * remark carried on a return for correction). Both are invented here, in the same
 * illustrative spirit as `registers.ts` itself, and kept out of it per the district
 * build brief ("create your own file… never edit registers.ts").
 */

import { HOUSEHOLDS, VILLAGES, type HouseholdRecord } from "./registers";

/** The two household categories the register tracks. "All" is a filter value, not a category. */
export const HOUSEHOLD_CATEGORIES = ["SC", "Other"] as const;

export const SURVEY_STATUSES: readonly HouseholdRecord["surveyStatus"][] = [
  "Surveyed",
  "Pending",
  "Re-survey Required",
];

/**
 * Household numbers pre-listed for a village but not yet carried on the household
 * register — what the live "Household ID" picker on Household Level Data offers once a
 * village is chosen. Formatted on the village's own census code, the way the district's
 * household numbers are.
 */
export interface PendingHouseholdId {
  village: string;
  householdId: string;
}

function pendingHouseholdIds(): PendingHouseholdId[] {
  return VILLAGES.flatMap((v) => {
    const alreadyOnRegister = HOUSEHOLDS.filter((h) => h.village === v.village).length;
    const stillToList = Math.max(3, Math.round(v.households / 130));
    return Array.from({ length: stillToList }, (_, i) => ({
      village: v.village,
      householdId: `${v.censusCode}-${String(alreadyOnRegister + i + 1).padStart(4, "0")}`,
    }));
  });
}

export const PENDING_HOUSEHOLD_IDS: PendingHouseholdId[] = pendingHouseholdIds();

/**
 * The survey particulars behind each household already on the register — the domain its
 * Format III(A) survey assessed, and the remark a return for correction carries. Keyed
 * to `HouseholdRecord.id`. A household not listed here was surveyed against no
 * particular remark.
 */
export interface HouseholdSurveyDetail {
  householdId: string;
  domain: string;
  remarks: string | null;
}

export const HOUSEHOLD_SURVEY_DETAILS: HouseholdSurveyDetail[] = [
  { householdId: "h-01", domain: "Drinking Water & Sanitation", remarks: null },
  { householdId: "h-02", domain: "Health & Nutrition", remarks: null },
  { householdId: "h-03", domain: "Education", remarks: null },
  {
    householdId: "h-04",
    domain: "Rural Roads & Housing",
    remarks: "Household shifted to a rented address; door number to be re-verified.",
  },
  { householdId: "h-05", domain: "Social Security", remarks: null },
  { householdId: "h-06", domain: "Financial Inclusion", remarks: null },
];

export function surveyDetailFor(householdId: string): HouseholdSurveyDetail | undefined {
  return HOUSEHOLD_SURVEY_DETAILS.find((d) => d.householdId === householdId);
}
