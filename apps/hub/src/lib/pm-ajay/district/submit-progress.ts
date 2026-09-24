/**
 * Extra records for the Submit Progress screens (Format IV / V / VII) — ILLUSTRATIVE,
 * derived from the district's own registers in `registers.ts`, which is never edited
 * per the build brief. Every figure here traces back to a record already in that file;
 * none of it is the department's, per `.claude/rules/prototype-data-modes.md`.
 */

import { BENEFICIARIES, INDICATOR_DOMAINS, type BeneficiaryRecord } from "./registers";

/**
 * Two illustrative monitorable indicators per Adarsh Gram domain, for the Format V
 * "Monitorable Indicator" filter, which the live screen scopes under "Domain".
 */
export const MONITORABLE_INDICATORS: Record<string, string[]> = {
  "Drinking Water & Sanitation": ["Household Tap Connections", "Individual Household Toilets"],
  Education: ["Out-of-School Children Enrolled", "Post-Matric Scholarship Coverage"],
  "Health & Nutrition": ["Anganwadi Enrolment", "Institutional Deliveries"],
  "Social Security": ["Old-Age and Widow Pension Coverage", "Disability Pension Coverage"],
  "Rural Roads & Housing": ["Pucca Housing for Eligible Households", "All-Weather Road Connectivity"],
  "Electricity & Clean Fuel": ["Household Electricity Connections", "LPG Connections Under Ujjwala"],
  "Agriculture Practices": ["Soil Health Card Coverage", "Livestock-Based Livelihood Support"],
  "Financial Inclusion": ["Jan Dhan Accounts Opened", "Access to a Banking Correspondent Point"],
  "Digital Literacy": ["Households With a Digitally Literate Member", "Common Service Centre Access"],
  "Livelihood & Skill Development": ["Youth Enrolled in Skill Training", "Self-Help Group Membership"],
};

/** Which domain and indicator each existing initiative in `BENEFICIARIES` sits under. */
const DOMAIN_BY_INITIATIVE: Record<string, string> = {
  "Pension — old age": "Social Security",
  Housing: "Rural Roads & Housing",
  Scholarship: "Education",
  "Skill training": "Livelihood & Skill Development",
  "Livestock support": "Agriculture Practices",
};

const INDICATOR_BY_INITIATIVE: Record<string, string> = {
  "Pension — old age": "Old-Age and Widow Pension Coverage",
  Housing: "Pucca Housing for Eligible Households",
  Scholarship: "Post-Matric Scholarship Coverage",
  "Skill training": "Youth Enrolled in Skill Training",
  "Livestock support": "Livestock-Based Livelihood Support",
};

const NEED_IDENTIFIED_ON: Record<string, string> = {
  "b-01": "12 May 2026",
  "b-02": "12 May 2026",
  "b-03": "20 May 2026",
  "b-04": "02 Jun 2026",
  "b-05": "18 Jun 2026",
};

export interface BeneficiaryProgress extends BeneficiaryRecord {
  domain: string;
  indicator: string;
  /** When the need was first identified for this beneficiary. */
  needIdentifiedOn: string;
  /** 0–100. Physical progress reported against this initiative so far this quarter. */
  physicalProgress: number;
}

/** `BENEFICIARIES`, widened with the Domain and Monitorable Indicator Format V filters on. */
export const BENEFICIARY_PROGRESS: BeneficiaryProgress[] = BENEFICIARIES.map((b, i) => {
  /* `?? ""` is not a fallback here — INDICATOR_DOMAINS is a non-empty tuple, so the
     modulo always lands. It satisfies noUncheckedIndexedAccess without pretending a
     domain could be missing. */
  const domain: string =
    DOMAIN_BY_INITIATIVE[b.initiative] ?? INDICATOR_DOMAINS[i % INDICATOR_DOMAINS.length] ?? INDICATOR_DOMAINS[0];
  return {
    ...b,
    domain,
    indicator: INDICATOR_BY_INITIATIVE[b.initiative] ?? MONITORABLE_INDICATORS[domain]?.[0] ?? domain,
    needIdentifiedOn: NEED_IDENTIFIED_ON[b.id] ?? "01 Jun 2026",
    physicalProgress: b.status === "Disbursed" ? 100 : b.status === "Sanctioned" ? 40 : 0,
  };
});
