// Captured NATIONAL aggregates for the US / Under-Secretary dashboard, taken from
// the live legacy portal (2026-06-29, login USDP1). The US role is a national
// rollup, so its dashboard shows these real aggregate figures rather than counting
// the handful of synthetic demo records the centre roles use. Non-PII statistics.
// Source: docs/reference/nmba-us-undersecretary-legacy-capture.md.

import type { ChartDatum } from "@mosje/design-system";

/** Headline KPI figures (8 cards = these 6 totals/todays, In-Patient mirrors Registration). */
export const US_NATIONAL_KPIS = {
  totalRegistration: 17156,
  todayRegistration: 54,
  reAdmission: 11,
  todayReAdmission: 0,
  followUp: 100,
  todayFollowUp: 2,
} as const;

/** Analytical Report — Gender (counts derived from live %: 96.45 / 3.54 / 0.01). */
export const US_GENDER: ChartDatum[] = [
  { label: "Male", value: 16547 },
  { label: "Female", value: 607 },
  { label: "Transgender", value: 2 },
];

/** Analytical Report — Place of Residence (live %: 63.81 / 36.19). */
export const US_RESIDENCE: ChartDatum[] = [
  { label: "Rural", value: 10948 },
  { label: "Urban", value: 6208 },
];

/** Analytical Report — Treatment Taken (live %: 82.36 / 7.47 / 5.33 / 3.35 / 1.48). */
export const US_TREATMENT: ChartDatum[] = [
  { label: "No Previous Treatment Taken", value: 14132 },
  { label: "DoSJE supported GIA", value: 1282 },
  { label: "Private De-addiction Facility", value: 914 },
  { label: "Central Govt De-addiction Facility", value: 575 },
  { label: "State Govt De-addiction Facility", value: 253 },
];

/** Drug Distribution — Number of Patients per substance (verbatim live counts). */
export const US_DRUGS: ChartDatum[] = [
  { label: "Alcohol", value: 10941 },
  { label: "Opioids", value: 3024 },
  { label: "Cannabis", value: 2181 },
  { label: "Nicotine", value: 1164 },
  { label: "Synthetic Cannabinoids", value: 210 },
  { label: "Sedatives", value: 147 },
  { label: "Other Specified", value: 113 },
  { label: "Cocaine", value: 87 },
  { label: "Volatile Inhalants", value: 79 },
  { label: "Caffeine", value: 31 },
  { label: "MDMA", value: 30 },
  { label: "Hallucinogens", value: 28 },
  { label: "Dissociative Drugs", value: 14 },
  { label: "Stimulants", value: 11 },
  { label: "Synthetic cathinone", value: 2 },
];

/** State Wise Report — Number of Patients per state/UT (verbatim live counts). */
export const US_STATES: ChartDatum[] = [
  { label: "Andhra Pradesh", value: 2754 },
  { label: "Telangana", value: 2011 },
  { label: "Manipur", value: 2101 },
  { label: "Assam", value: 1908 },
  { label: "Madhya Pradesh", value: 957 },
  { label: "Delhi", value: 948 },
  { label: "Odisha", value: 983 },
  { label: "Jammu and Kashmir", value: 596 },
  { label: "Punjab", value: 588 },
  { label: "Bihar", value: 532 },
  { label: "Tamil Nadu", value: 426 },
  { label: "Kerala", value: 411 },
  { label: "Jharkhand", value: 409 },
  { label: "Rajasthan", value: 366 },
  { label: "West Bengal", value: 365 },
  { label: "Maharashtra", value: 286 },
  { label: "Mizoram", value: 240 },
  { label: "Uttarakhand", value: 240 },
  { label: "Chattisgarh", value: 235 },
  { label: "Karnataka", value: 212 },
  { label: "Uttar Pradesh", value: 184 },
  { label: "Himachal Pradesh", value: 108 },
  { label: "Gujarat", value: 83 },
  { label: "Arunachal Pradesh", value: 75 },
  { label: "Nagaland", value: 55 },
  { label: "Haryana", value: 31 },
  { label: "Puducherry", value: 19 },
  { label: "Tripura", value: 16 },
  { label: "Chandigarh", value: 7 },
  { label: "Meghalaya", value: 5 },
  { label: "Andaman and Nicobar", value: 4 },
  { label: "Goa", value: 1 },
];

/** Age Wise Report — Number of Patients per age band (verbatim live counts). */
export const US_AGES: ChartDatum[] = [
  { label: "18-25", value: 2842 },
  { label: "26-35", value: 5985 },
  { label: "36-55", value: 7418 },
  { label: "56-70", value: 782 },
  { label: "71-100", value: 52 },
  { label: "Other", value: 77 },
];
