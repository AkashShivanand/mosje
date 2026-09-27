/**
 * The district officer's registers — ILLUSTRATIVE data for the rebuild.
 *
 * Every figure here is invented and none of it is the department's. It is shaped like
 * the live registers the AGDistrict role reads on `pm-ajay.dosje.gov.in` — the same
 * columns, the same code formats, the same statuses — so a screen can be built and
 * reviewed before the API exists. Per `.claude/rules/prototype-data-modes.md`, every
 * surface that renders it carries a provenance line saying so.
 *
 * The scope is one district, because that is what the role sees — Gaya, Bihar, the
 * district the live AGDistrict account is posted to. Place names are real
 * administrative names; every count, cost, score and date is invented.
 */

export const DISTRICT_SCOPE = {
  state: "Bihar",
  district: "Gaya",
  financialYear: "2025-26",
  asOf: "24 Sep 2026",
} as const;

export const PROVENANCE_LINE =
  "Illustrative figures, shaped like the district register. Not departmental data.";

export const BLOCKS = ["Bodh Gaya", "Manpur", "Sherghati", "Tikari", "Wazirganj"] as const;

export const GRAM_PANCHAYATS: Record<string, string[]> = {
  "Bodh Gaya": ["Bakraur", "Silaunja", "Mastipur"],
  Manpur: ["Buniyadganj", "Kumhrar"],
  Sherghati: ["Bhadeja", "Dobhi"],
  Tikari: ["Amethi", "Konch"],
  Wazirganj: ["Deokund", "Naima"],
};

export type VdpStage =
  | "VDP Not Generated"
  | "VDP Drafted"
  | "DLCC Approved"
  | "Declared Adarsh Gram";

export interface VillageRecord {
  id: string;
  block: string;
  gramPanchayat: string;
  village: string;
  censusCode: string;
  population: number;
  scPopulation: number;
  scShare: number;
  households: number;
  stage: VdpStage;
  score: number | null;
  createdOn: string;
}

export const VILLAGES: VillageRecord[] = [
  { id: "v-01", block: "Bodh Gaya", gramPanchayat: "Bakraur", village: "Bakraur", censusCode: "2495201", population: 2148, scPopulation: 1192, scShare: 55.5, households: 486, stage: "Declared Adarsh Gram", score: 82, createdOn: "12 Apr 2026" },
  { id: "v-02", block: "Bodh Gaya", gramPanchayat: "Silaunja", village: "Silaunja", censusCode: "2495214", population: 1876, scPopulation: 998, scShare: 53.2, households: 402, stage: "DLCC Approved", score: 74, createdOn: "12 Apr 2026" },
  { id: "v-03", block: "Bodh Gaya", gramPanchayat: "Mastipur", village: "Mastipur", censusCode: "2495229", population: 3204, scPopulation: 1684, scShare: 52.6, households: 712, stage: "VDP Drafted", score: 61, createdOn: "18 Apr 2026" },
  { id: "v-04", block: "Manpur", gramPanchayat: "Buniyadganj", village: "Buniyadganj", censusCode: "2495308", population: 1442, scPopulation: 806, scShare: 55.9, households: 318, stage: "VDP Drafted", score: 58, createdOn: "18 Apr 2026" },
  { id: "v-05", block: "Manpur", gramPanchayat: "Kumhrar", village: "Kumhrar", censusCode: "2495317", population: 1120, scPopulation: 642, scShare: 57.3, households: 254, stage: "VDP Not Generated", score: null, createdOn: "02 May 2026" },
  { id: "v-06", block: "Sherghati", gramPanchayat: "Bhadeja", village: "Bhadeja", censusCode: "2495402", population: 2562, scPopulation: 1348, scShare: 52.6, households: 574, stage: "Declared Adarsh Gram", score: 88, createdOn: "12 Apr 2026" },
  { id: "v-07", block: "Sherghati", gramPanchayat: "Dobhi", village: "Dobhi", censusCode: "2495418", population: 986, scPopulation: 552, scShare: 56.0, households: 221, stage: "DLCC Approved", score: 71, createdOn: "22 Apr 2026" },
  { id: "v-08", block: "Tikari", gramPanchayat: "Amethi", village: "Amethi", censusCode: "2495511", population: 1704, scPopulation: 902, scShare: 52.9, households: 376, stage: "VDP Drafted", score: 64, createdOn: "22 Apr 2026" },
  { id: "v-09", block: "Tikari", gramPanchayat: "Konch", village: "Konch", censusCode: "2495524", population: 2290, scPopulation: 1226, scShare: 53.5, households: 512, stage: "VDP Not Generated", score: null, createdOn: "02 May 2026" },
  { id: "v-10", block: "Wazirganj", gramPanchayat: "Deokund", village: "Deokund", censusCode: "2495603", population: 1338, scPopulation: 748, scShare: 55.9, households: 294, stage: "DLCC Approved", score: 76, createdOn: "22 Apr 2026" },
  { id: "v-11", block: "Wazirganj", gramPanchayat: "Naima", village: "Naima", censusCode: "2495619", population: 1592, scPopulation: 842, scShare: 52.9, households: 351, stage: "VDP Drafted", score: 59, createdOn: "06 May 2026" },
  { id: "v-12", block: "Wazirganj", gramPanchayat: "Naima", village: "Bishunpur", censusCode: "2495622", population: 874, scPopulation: 498, scShare: 57.0, households: 196, stage: "VDP Not Generated", score: null, createdOn: "06 May 2026" },
];

export interface AgencyRecord {
  id: string;
  state: string;
  district: string;
  name: string;
  type: string;
  contactPerson: string;
  mobile: string;
}

export const AGENCIES: AgencyRecord[] = [
  { id: "a-01", state: "Bihar", district: "Gaya", name: "Agriculture Department", type: "Line Department", contactPerson: "A. K. Sinha", mobile: "94400 11223" },
  { id: "a-02", state: "Bihar", district: "Gaya", name: "Rural Water Supply Division", type: "Line Department", contactPerson: "Rekha Devi", mobile: "94400 11245" },
  { id: "a-03", state: "Bihar", district: "Gaya", name: "District Rural Development Agency", type: "Implementing Agency", contactPerson: "Nand Kishore", mobile: "94400 11267" },
  { id: "a-04", state: "Bihar", district: "Gaya", name: "Panchayat Raj Engineering Division", type: "Works Agency", contactPerson: "Sanjay Prasad", mobile: "94400 11289" },
  { id: "a-05", state: "Bihar", district: "Gaya", name: "District Medical & Health Office", type: "Line Department", contactPerson: "Pushpa Kumari", mobile: "94400 11301" },
  { id: "a-06", state: "Bihar", district: "Gaya", name: "Social Welfare Department", type: "Line Department", contactPerson: "Vijay Ram", mobile: "94400 11323" },
  { id: "a-07", state: "Bihar", district: "Gaya", name: "Block Education Office", type: "Line Department", contactPerson: "Kiran Bala", mobile: "94400 11345" },
  { id: "a-08", state: "Bihar", district: "Gaya", name: "Building Construction Department", type: "Works Agency", contactPerson: "Suresh Yadav", mobile: "94400 11367" },
];

export const AGENCY_TYPES = ["Line Department", "Implementing Agency", "Works Agency", "Society or Trust"] as const;

/** The ten Adarsh Gram monitorable-indicator domains, as the scheme names them. */
export const INDICATOR_DOMAINS = [
  "Drinking Water & Sanitation",
  "Education",
  "Health & Nutrition",
  "Social Security",
  "Rural Roads & Housing",
  "Electricity & Clean Fuel",
  "Agriculture Practices",
  "Financial Inclusion",
  "Digital Literacy",
  "Livelihood & Skill Development",
] as const;

export interface IndicatorStatus {
  domain: string;
  identified: number;
  completed: number;
  inProgress: number;
  pending: number;
  estimatedCost: number;
}

export const INDICATOR_STATUS: IndicatorStatus[] = INDICATOR_DOMAINS.map((domain, i) => ({
  domain,
  identified: 640 + i * 96,
  completed: i < 4 ? 120 + i * 40 : 0,
  inProgress: i % 3 === 0 ? 88 : 46,
  pending: 380 + i * 42,
  estimatedCost: 240.5 + i * 38.2,
}));

export interface WorkRecord {
  id: string;
  village: string;
  domain: string;
  work: string;
  agency: string;
  sanctioned: number;
  released: number;
  utilised: number;
  status: "Identified" | "In Progress" | "Completed" | "Withheld";
  targetDate: string;
}

export const WORKS: WorkRecord[] = [
  { id: "w-01", village: "Bakraur", domain: "Drinking Water & Sanitation", work: "Overhead tank, 40 KL", agency: "Rural Water Supply Division", sanctioned: 42.5, released: 42.5, utilised: 40.1, status: "Completed", targetDate: "30 Jun 2026" },
  { id: "w-02", village: "Bakraur", domain: "Rural Roads & Housing", work: "Internal CC road, 1.2 km", agency: "Panchayat Raj Engineering Division", sanctioned: 68.0, released: 48.0, utilised: 38.4, status: "In Progress", targetDate: "31 Dec 2026" },
  { id: "w-03", village: "Silaunja", domain: "Education", work: "Two additional classrooms", agency: "Block Education Office", sanctioned: 54.0, released: 27.0, utilised: 19.6, status: "In Progress", targetDate: "31 Mar 2027" },
  { id: "w-04", village: "Bhadeja", domain: "Health & Nutrition", work: "Sub-centre upgrade", agency: "District Medical & Health Office", sanctioned: 36.0, released: 36.0, utilised: 34.8, status: "Completed", targetDate: "31 Aug 2026" },
  { id: "w-05", village: "Mastipur", domain: "Electricity & Clean Fuel", work: "Street lighting, 60 points", agency: "Panchayat Raj Engineering Division", sanctioned: 18.5, released: 0, utilised: 0, status: "Identified", targetDate: "30 Sep 2027" },
  { id: "w-06", village: "Konch", domain: "Livelihood & Skill Development", work: "Skill centre equipment", agency: "District Rural Development Agency", sanctioned: 24.0, released: 12.0, utilised: 0, status: "Withheld", targetDate: "31 Mar 2027" },
  { id: "w-07", village: "Deokund", domain: "Agriculture Practices", work: "Community seed storage", agency: "Agriculture Department", sanctioned: 31.5, released: 31.5, utilised: 22.9, status: "In Progress", targetDate: "31 Jan 2027" },
  { id: "w-08", village: "Naima", domain: "Financial Inclusion", work: "Banking correspondent kiosk", agency: "District Rural Development Agency", sanctioned: 9.5, released: 9.5, utilised: 9.5, status: "Completed", targetDate: "30 Apr 2026" },
];

export interface HouseholdRecord {
  id: string;
  village: string;
  head: string;
  category: string;
  members: number;
  surveyStatus: "Surveyed" | "Pending" | "Re-survey Required";
  surveyedOn: string | null;
}

export const HOUSEHOLDS: HouseholdRecord[] = [
  { id: "h-01", village: "Bakraur", head: "Household 4821", category: "SC", members: 5, surveyStatus: "Surveyed", surveyedOn: "18 May 2026" },
  { id: "h-02", village: "Bakraur", head: "Household 4822", category: "SC", members: 4, surveyStatus: "Surveyed", surveyedOn: "18 May 2026" },
  { id: "h-03", village: "Silaunja", head: "Household 5104", category: "SC", members: 6, surveyStatus: "Pending", surveyedOn: null },
  { id: "h-04", village: "Mastipur", head: "Household 5390", category: "Other", members: 3, surveyStatus: "Re-survey Required", surveyedOn: "02 Jun 2026" },
  { id: "h-05", village: "Bhadeja", head: "Household 5612", category: "SC", members: 7, surveyStatus: "Surveyed", surveyedOn: "22 May 2026" },
  { id: "h-06", village: "Dobhi", head: "Household 5744", category: "SC", members: 4, surveyStatus: "Pending", surveyedOn: null },
];

export interface BeneficiaryRecord {
  id: string;
  village: string;
  initiative: string;
  beneficiary: string;
  scheme: string;
  sanctionedAmount: number;
  status: "Sanctioned" | "Disbursed" | "Pending";
}

export const BENEFICIARIES: BeneficiaryRecord[] = [
  { id: "b-01", village: "Bakraur", initiative: "Pension — old age", beneficiary: "Beneficiary 1041", scheme: "NSAP", sanctionedAmount: 0.036, status: "Disbursed" },
  { id: "b-02", village: "Bakraur", initiative: "Housing", beneficiary: "Beneficiary 1042", scheme: "PMAY-G", sanctionedAmount: 1.2, status: "Sanctioned" },
  { id: "b-03", village: "Silaunja", initiative: "Scholarship", beneficiary: "Beneficiary 1188", scheme: "Post-Matric Scholarship", sanctionedAmount: 0.18, status: "Disbursed" },
  { id: "b-04", village: "Bhadeja", initiative: "Skill training", beneficiary: "Beneficiary 1312", scheme: "DDU-GKY", sanctionedAmount: 0.42, status: "Pending" },
  { id: "b-05", village: "Deokund", initiative: "Livestock support", beneficiary: "Beneficiary 1466", scheme: "State livestock mission", sanctionedAmount: 0.65, status: "Sanctioned" },
];

export interface MomRecord {
  id: string;
  committee: "DLCC" | "Gram Sabha" | "Block Convergence";
  heldOn: string;
  chairedBy: string;
  agendaItems: number;
  minutesFile: string | null;
  status: "Uploaded" | "Awaiting Minutes";
}

export const MOMS: MomRecord[] = [
  { id: "m-01", committee: "DLCC", heldOn: "14 Aug 2026", chairedBy: "District Collector", agendaItems: 6, minutesFile: "DLCC-14Aug2026.pdf", status: "Uploaded" },
  { id: "m-02", committee: "Gram Sabha", heldOn: "02 Aug 2026", chairedBy: "Sarpanch, Bandlapalli", agendaItems: 4, minutesFile: "GS-Bandlapalli-02Aug2026.pdf", status: "Uploaded" },
  { id: "m-03", committee: "Block Convergence", heldOn: "27 Jul 2026", chairedBy: "Block Development Officer", agendaItems: 5, minutesFile: null, status: "Awaiting Minutes" },
];

export interface DeclarationRequest {
  id: string;
  village: string;
  gramPanchayat: string;
  score: number;
  submittedOn: string;
  status: "Pending with State" | "Returned for Correction" | "Approved";
  remarks: string | null;
}

export const DECLARATION_REQUESTS: DeclarationRequest[] = [
  { id: "d-01", village: "Silaunja", gramPanchayat: "Silaunja", score: 74, submittedOn: "08 Sep 2026", status: "Pending with State", remarks: null },
  { id: "d-02", village: "Dobhi", gramPanchayat: "Dobhi", score: 71, submittedOn: "08 Sep 2026", status: "Pending with State", remarks: null },
  { id: "d-03", village: "Deokund", gramPanchayat: "Deokund", score: 76, submittedOn: "22 Aug 2026", status: "Returned for Correction", remarks: "Format VI signature page missing." },
];

export interface VdpUnlockRequest {
  id: string;
  village: string;
  requestedOn: string;
  reason: string;
  status: "Pending with State" | "Unlocked" | "Rejected";
}

export const VDP_UNLOCK_REQUESTS: VdpUnlockRequest[] = [
  { id: "u-01", village: "Mastipur", requestedOn: "12 Sep 2026", reason: "Household count revised after re-survey.", status: "Pending with State" },
  { id: "u-02", village: "Amethi", requestedOn: "30 Aug 2026", reason: "Two works moved to the next financial year.", status: "Unlocked" },
];

export interface PortalUser {
  id: string;
  name: string;
  designation: string;
  level: "District" | "Block" | "Village";
  mobile: string;
  status: "Active" | "Inactive";
  lastSignIn: string | null;
}

export const USERS: PortalUser[] = [
  { id: "u-101", name: "Ramesh Kumar", designation: "District Welfare Officer", level: "District", mobile: "94400 20011", status: "Active", lastSignIn: "24 Sep 2026" },
  { id: "u-102", name: "Sunita Kumari", designation: "Block Development Officer", level: "Block", mobile: "94400 20033", status: "Active", lastSignIn: "22 Sep 2026" },
  { id: "u-103", name: "Vinod Paswan", designation: "Panchayat Secretary", level: "Village", mobile: "94400 20055", status: "Active", lastSignIn: "19 Sep 2026" },
  { id: "u-104", name: "Anita Devi", designation: "Panchayat Secretary", level: "Village", mobile: "94400 20077", status: "Inactive", lastSignIn: null },
];

/** The dashboard's own figures, all derived from the registers above. */
export const DASHBOARD = {
  eligibleVillages: VILLAGES.length,
  vdpDrafted: VILLAGES.filter((v) => v.stage !== "VDP Not Generated").length,
  dlccApproved: VILLAGES.filter((v) => v.stage === "DLCC Approved" || v.stage === "Declared Adarsh Gram").length,
  declared: VILLAGES.filter((v) => v.stage === "Declared Adarsh Gram").length,
  vdpNotGenerated: VILLAGES.filter((v) => v.stage === "VDP Not Generated").length,
  dlccPending: VILLAGES.filter((v) => v.stage === "VDP Drafted").length,
  eligibleNotDeclared: VILLAGES.filter((v) => (v.score ?? 0) >= 70 && v.stage !== "Declared Adarsh Gram").length,
  projectsIdentified: INDICATOR_STATUS.reduce((n, i) => n + i.identified, 0),
  projectsCompleted: INDICATOR_STATUS.reduce((n, i) => n + i.completed, 0),
  projectsInProgress: INDICATOR_STATUS.reduce((n, i) => n + i.inProgress, 0),
  projectsPending: INDICATOR_STATUS.reduce((n, i) => n + i.pending, 0),
  estimatedCost: INDICATOR_STATUS.reduce((n, i) => n + i.estimatedCost, 0),
  fundsSanctioned: WORKS.reduce((n, w) => n + w.sanctioned, 0),
  fundsReleased: WORKS.reduce((n, w) => n + w.released, 0),
  fundsUtilised: WORKS.reduce((n, w) => n + w.utilised, 0),
} as const;

/** Money in this portal is stated in lakh, as the district's own formats do. */
export function lakh(value: number): string {
  return `₹${value.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} L`;
}

export function count(value: number): string {
  return value.toLocaleString("en-IN");
}
