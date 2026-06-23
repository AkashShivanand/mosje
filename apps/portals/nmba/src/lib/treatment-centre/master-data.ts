// Treatment-Centre master data — dropdown option-sets captured verbatim from the
// legacy NMBA treatment-centre registration forms (2026-06-22). Identical across
// all four roles, so they live in one place. `value` codes mirror the live site.

import type { SelectOption } from "@mosje/design-system";

export const GENDERS: SelectOption[] = [
  { label: "Male", value: "1" },
  { label: "Female", value: "2" },
  { label: "Transgender", value: "3" },
];

export const PLACE_OF_RESIDENCE: SelectOption[] = [
  { label: "Rural", value: "1" },
  { label: "Urban", value: "2" },
];

export const MARITAL_STATUS: SelectOption[] = [
  { label: "Never Married", value: "1" },
  { label: "Married", value: "2" },
  { label: "Divorced", value: "3" },
  { label: "Separated", value: "4" },
  { label: "Separated due to Drug Use", value: "5" },
  { label: "Widow/Widower", value: "6" },
  { label: "Cohabiting", value: "7" },
];

export const LIVING_ARRANGEMENTS: SelectOption[] = [
  { label: "Joint Family", value: "1" },
  { label: "Nuclear Family", value: "2" },
  { label: "With Friend/Hostel", value: "3" },
  { label: "Alone", value: "4" },
  { label: "Any Other", value: "5" },
];

export const EDUCATION: SelectOption[] = [
  { label: "Professional Degree", value: "1" },
  { label: "Graduate", value: "2" },
  { label: "Intermediate/Diploma", value: "3" },
  { label: "High School", value: "4" },
  { label: "Middle School", value: "5" },
  { label: "Primary School", value: "6" },
  { label: "Illiterate", value: "7" },
];

export const OCCUPATION: SelectOption[] = [
  { label: "Legislators/Senior Officials/Managers", value: "1" },
  { label: "Professionals", value: "2" },
  { label: "Technical/Associate Professionals", value: "3" },
  { label: "Clerk", value: "4" },
  { label: "Skilled Worker, shop and market sales workers", value: "5" },
  { label: "Skilled agricultural and fishery workers", value: "6" },
  { label: "Craft and related trade workers", value: "7" },
  { label: "Plant and machine operators and assemblers", value: "8" },
  { label: "Elementary Occupation", value: "9" },
  { label: "Unemployed", value: "10" },
  { label: "Teacher", value: "13" },
];

export const EMPLOYMENT: SelectOption[] = [
  { label: "Currently Unemployed", value: "1" },
  { label: "Never Employed", value: "2" },
  { label: "Employed", value: "3" },
  { label: "Self-Employed", value: "4" },
  { label: "House person", value: "5" },
  { label: "Any Other", value: "6" },
  { label: "Not Known", value: "7" },
];

export const INCOME: SelectOption[] = [
  { label: "<7500", value: "1" },
  { label: "7501-20,000", value: "2" },
  { label: "20,001-35,000", value: "3" },
  { label: "35,001-45,000", value: "4" },
  { label: "45001-60,000", value: "5" },
  { label: ">60,000", value: "6" },
];

export const CATEGORY: SelectOption[] = [
  { label: "Unreserved", value: "1" },
  { label: "OBC", value: "3" },
  { label: "SC", value: "4" },
  { label: "ST", value: "11" },
];

export const GOVERNMENT_ID: SelectOption[] = [
  { label: "Aadhaar Card", value: "Aadhaar Card" },
  { label: "PAN Card", value: "PAN Card" },
  { label: "Passport", value: "Passport" },
  { label: "Driving Licence", value: "Driving Licence" },
  { label: "Voter ID", value: "Voter ID" },
  { label: "Ration card", value: "Ration Card" },
];

export const DRUGS: SelectOption[] = [
  { label: "Alcohol", value: "1" },
  { label: "Cannabis", value: "2" },
  { label: "Synthetic Cannabinoids", value: "3" },
  { label: "Opioids", value: "4" },
  { label: "Sedatives, hypnotics and anxiolytics", value: "5" },
  { label: "Cocaine", value: "6" },
  { label: "Stimulants including amphetamines, methamphetamines or methcathinone", value: "7" },
  { label: "Synthetic cathinone", value: "8" },
  { label: "Caffeine", value: "9" },
  { label: "Hallucinogens", value: "10" },
  { label: "Nicotine", value: "11" },
  { label: "Volatile Inhalants", value: "12" },
  { label: "MDMA and related drugs including MDA", value: "13" },
  { label: "Dissociative Drugs including ketamine and phencyclidine", value: "14" },
  { label: "Other Specified Psychoactive Substances", value: "15" },
];

export const INITIATION_REASONS: SelectOption[] = [
  { label: "Anxiety and Depression", value: "1" },
  { label: "Loneliness", value: "2" },
  { label: "Curiosity", value: "3" },
  { label: "Peer Pressure", value: "4" },
  { label: "Individual Problem", value: "5" },
  { label: "Family Problem", value: "6" },
  { label: "Occupation-Related", value: "7" },
  { label: "Adverse Childhood Experiences", value: "8" },
  { label: "Any other Social Problem", value: "9" },
];

export const REFERRED_BY: SelectOption[] = [
  { label: "Self", value: "1" },
  { label: "Family", value: "2" },
  { label: "Friends", value: "3" },
  { label: "Private Practitioner", value: "4" },
  { label: "Hospital/ Health Centre", value: "5" },
  { label: "Referral", value: "9" },
  { label: "National Drug De-addiction Helpline", value: "10" },
  { label: "Awareness Programme", value: "11" },
  { label: "Recovered User", value: "13" },
  { label: "Other", value: "15" },
];

export const YES_NO: SelectOption[] = [
  { label: "Yes", value: "Yes" },
  { label: "No", value: "No" },
];

export const ASSIST_SCORE: SelectOption[] = [
  { label: "Low Risk (0-3)", value: "low" },
  { label: "Moderate Risk (4-26)", value: "moderate" },
  { label: "High Risk (27+)", value: "high" },
];

export const SEXUAL_PRACTICES: SelectOption[] = [
  { label: "Heterosexual", value: "1" },
  { label: "Homosexual", value: "2" },
  { label: "Bisexual", value: "3" },
  { label: "Not Applicable", value: "4" },
];

export const PREVIOUS_TREATMENT: SelectOption[] = [
  { label: "None", value: "0" },
  { label: "Outpatient", value: "1" },
  { label: "Inpatient/Hospitalisation", value: "2" },
  { label: "Detoxification", value: "3" },
  { label: "Counselling Only", value: "4" },
];

export const SOURCE_OF_REFERRAL: SelectOption[] = [
  { label: "Self", value: "1" },
  { label: "Family/Friends", value: "2" },
  { label: "Hospital/Health Centre", value: "3" },
  { label: "NGO/Outreach", value: "4" },
  { label: "Helpline", value: "5" },
  { label: "Court/Legal", value: "6" },
];

export const PROVISIONAL_DIAGNOSIS: SelectOption[] = [
  { label: "6C40 — Disorders due to use of alcohol", value: "6C40" },
  { label: "6C41 — Disorders due to use of cannabis", value: "6C41" },
  { label: "6C43 — Disorders due to use of opioids", value: "6C43" },
  { label: "6C44 — Disorders due to use of sedatives, hypnotics or anxiolytics", value: "6C44" },
  { label: "6C45 — Disorders due to use of cocaine", value: "6C45" },
  { label: "6C46 — Disorders due to use of stimulants", value: "6C46" },
  { label: "6C4A — Disorders due to use of nicotine", value: "6C4A" },
];

/** State / UT list with the live site's numeric codes. */
export const STATES: SelectOption[] = [
  { label: "ANDAMAN AND NICOBAR", value: "35" },
  { label: "ANDHRA PRADESH", value: "28" },
  { label: "ARUNACHAL PRADESH", value: "12" },
  { label: "ASSAM", value: "18" },
  { label: "BIHAR", value: "10" },
  { label: "CHANDIGARH", value: "4" },
  { label: "CHATTISGARH", value: "22" },
  { label: "DADRA & NAGAR HAVELI", value: "26" },
  { label: "DAMAN & DIU(ONLY DAMAN)", value: "25" },
  { label: "DELHI", value: "7" },
  { label: "GOA", value: "30" },
  { label: "GUJARAT", value: "24" },
  { label: "HARYANA", value: "6" },
  { label: "HIMACHAL PRADESH", value: "2" },
  { label: "JAMMU AND KASHMIR", value: "1" },
  { label: "JHARKHAND", value: "20" },
  { label: "KARNATAKA", value: "29" },
  { label: "KERALA", value: "32" },
  { label: "LADAKH", value: "37" },
  { label: "LAKSHADWEEP", value: "31" },
  { label: "MADHYA PRADESH", value: "23" },
  { label: "MAHARASHTRA", value: "27" },
  { label: "MANIPUR", value: "14" },
  { label: "MEGHALAYA", value: "17" },
  { label: "MIZORAM", value: "15" },
  { label: "NAGALAND", value: "13" },
  { label: "ODISHA", value: "21" },
  { label: "PUDUCHERRY", value: "34" },
  { label: "PUNJAB", value: "3" },
  { label: "RAJASTHAN", value: "8" },
  { label: "SIKKIM", value: "11" },
  { label: "TAMIL NADU", value: "33" },
  { label: "TELANGANA", value: "36" },
  { label: "TRIPURA", value: "16" },
  { label: "UTTAR PRADESH", value: "9" },
  { label: "UTTARAKHAND", value: "5" },
  { label: "WEST BENGAL", value: "19" },
];

/** A small representative district set per a few states (synthetic demo helper). */
export const DISTRICTS_BY_STATE: Record<string, SelectOption[]> = {
  "7": [
    { label: "New Delhi", value: "new-delhi" },
    { label: "North Delhi", value: "north-delhi" },
    { label: "South Delhi", value: "south-delhi" },
    { label: "East Delhi", value: "east-delhi" },
    { label: "West Delhi", value: "west-delhi" },
  ],
  "9": [
    { label: "Lucknow", value: "lucknow" },
    { label: "Kanpur", value: "kanpur" },
    { label: "Varanasi", value: "varanasi" },
    { label: "Agra", value: "agra" },
    { label: "Gautam Buddha Nagar", value: "gautam-buddha-nagar" },
  ],
  "27": [
    { label: "Mumbai", value: "mumbai" },
    { label: "Pune", value: "pune" },
    { label: "Nagpur", value: "nagpur" },
    { label: "Nashik", value: "nashik" },
  ],
  "3": [
    { label: "Amritsar", value: "amritsar" },
    { label: "Ludhiana", value: "ludhiana" },
    { label: "Jalandhar", value: "jalandhar" },
    { label: "Patiala", value: "patiala" },
  ],
};

/** Fallback districts for any state without an explicit list (demo only). */
export const GENERIC_DISTRICTS: SelectOption[] = [
  { label: "District 1", value: "district-1" },
  { label: "District 2", value: "district-2" },
  { label: "District 3", value: "district-3" },
];

export function districtsForState(stateValue: string): SelectOption[] {
  return DISTRICTS_BY_STATE[stateValue] ?? GENERIC_DISTRICTS;
}
