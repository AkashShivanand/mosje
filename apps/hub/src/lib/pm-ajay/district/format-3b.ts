/**
 * Format – III(B): Beneficiary Level Data for Initiatives — supporting data.
 *
 * `registers.ts` carries the ten indicator domains and the `BENEFICIARIES` register
 * but not the two lists the live Format III(B) screens key their pickers on: the
 * monitorable indicator under each domain, and the PMAGY schemes a beneficiary can be
 * sanctioned against. Both are invented here, in the same illustrative spirit as
 * `registers.ts` itself, and kept out of it per the district build brief ("create your
 * own file… never edit registers.ts").
 */

import type { VillageRecord } from "./registers";

/** Two monitorable indicators per domain — illustrative, shaped like the scheme's own. */
export const MONITORABLE_INDICATORS: Record<string, readonly string[]> = {
  "Drinking Water & Sanitation": ["Individual Household Toilet", "Piped Water Connection"],
  Education: ["Out-of-School Children Enrolled", "Anganwadi Attendance"],
  "Health & Nutrition": ["Immunisation Coverage", "Institutional Delivery"],
  "Social Security": ["Old-Age Pension Coverage", "Life Insurance Enrolment"],
  "Rural Roads & Housing": ["Pucca House Coverage", "All-Weather Road Access"],
  "Electricity & Clean Fuel": ["Household Electrification", "LPG Connection"],
  "Agriculture Practices": ["Soil Health Card Coverage", "Kisan Credit Card Coverage"],
  "Financial Inclusion": ["Bank Account Coverage", "Direct Benefit Transfer Enablement"],
  "Digital Literacy": ["Digital Literacy Certification", "Common Service Centre Access"],
  "Livelihood & Skill Development": ["Self-Help Group Membership", "Skill Certification"],
};

/** The scheme a beneficiary-oriented initiative is sanctioned under. */
export const PMAGY_SCHEMES = [
  "NSAP",
  "PMAY-G",
  "Post-Matric Scholarship",
  "DDU-GKY",
  "State Livestock Mission",
  "PM Ujjwala Yojana",
  "Jal Jeevan Mission",
  "Ayushman Bharat – PMJAY",
] as const;

export const BENEFICIARY_STATUSES = ["Sanctioned", "Disbursed", "Pending"] as const;

/** The consolidated household position for one village, domain and monitorable indicator. */
export interface HouseholdConsolidation {
  householdsInVillage: number;
  householdsCovered: number;
  needsIdentified: number;
  initiativesSanctioned: number;
  estimatedCost: number;
}

/**
 * A deterministic, illustrative aggregate — not a real computation over
 * `BENEFICIARIES`, because the live Format III(B) summary is a household-level
 * roll-up (Format III(A)) the estate has no register for. Varies with the
 * village and the picker so two selections do not read identically.
 */
export function consolidatedPosition(
  village: VillageRecord,
  domain: string,
  indicator: string,
): HouseholdConsolidation {
  const domainIndex = Math.max(0, Object.keys(MONITORABLE_INDICATORS).indexOf(domain));
  const indicatorIndex = Math.max(0, (MONITORABLE_INDICATORS[domain] ?? []).indexOf(indicator));
  const seed = domainIndex * 2 + indicatorIndex + 1;
  const householdsInVillage = village.households;
  const coverageShare = 0.35 + ((seed * 7) % 40) / 100;
  const householdsCovered = Math.round(householdsInVillage * coverageShare);
  const needsIdentified = Math.round(householdsInVillage * Math.min(coverageShare + 0.15, 1));
  const initiativesSanctioned = Math.round(householdsCovered * 0.8);
  const estimatedCost = Math.round((householdsInVillage * (4 + seed)) / 10) / 10;
  return { householdsInVillage, householdsCovered, needsIdentified, initiativesSanctioned, estimatedCost };
}
