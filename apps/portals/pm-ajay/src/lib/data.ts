/* PM-AJAY Dashboard — synthetic data model (FY 2025-26 baseline).
   Internally consistent: Executive aggregates ≈ scheme-view sums.
   Faithful port of the Claude Design handoff data.js (unified build: targets, SRC, AS_OF). */

export type Tone = "blue" | "green" | "amber" | "red";
export type KpiType = "amount" | "count" | "percent" | "days" | "special";
export type Dir = "up" | "down" | "flat";

export interface Kpi {
  label: string;
  value: string;
  unit: string;
  delta?: string;
  dir: Dir;
  sub: string;
  icon: string;
  tone: Tone;
  type: KpiType;
  spark: number[] | null;
  target: number | null;
}

export interface StateRow {
  code: string;
  name: string;
  share: number;
  util: number;
  uc: number;
  villages: number;
  seats: number;
  benef: number;
}

export interface District {
  code: string;
  name: string;
  parent: string;
  share: number;
  util: number;
  uc: number;
}

export interface ViewDef {
  id: string;
  label: string;
  icon: string;
  sub: string;
  badge?: number;
}

export type ViewId =
  | "executive"
  | "financial"
  | "gia"
  | "hostel"
  | "adarsh"
  | "governance";

export const FY = ["2025-26", "2024-25", "2023-24", "2022-23"];
export const FY_FACTOR: Record<string, number> = {
  "2025-26": 1,
  "2024-25": 0.92,
  "2023-24": 0.83,
  "2022-23": 0.71,
};

export const SCHEMES = [
  "All Schemes",
  "Grant-in-Aid (GIA)",
  "Hostel",
  "Adarsh Gram (PMAGY)",
];
export const PERIODS = ["Annual", "Q1", "Q2", "Q3", "Q4"];

export const STATES: StateRow[] = [
  { code: "AP", name: "Andhra Pradesh", share: 0.071, util: 91.2, uc: 88.0, villages: 642, seats: 11240, benef: 1.82 },
  { code: "TG", name: "Telangana", share: 0.058, util: 88.6, uc: 86.2, villages: 512, seats: 9180, benef: 1.41 },
  { code: "GJ", name: "Gujarat", share: 0.066, util: 86.1, uc: 84.8, villages: 588, seats: 10120, benef: 1.55 },
  { code: "TN", name: "Tamil Nadu", share: 0.069, util: 84.0, uc: 83.1, villages: 604, seats: 10860, benef: 1.66 },
  { code: "KA", name: "Karnataka", share: 0.064, util: 81.4, uc: 80.4, villages: 566, seats: 9740, benef: 1.49 },
  { code: "MH", name: "Maharashtra", share: 0.094, util: 78.9, uc: 79.6, villages: 842, seats: 14120, benef: 2.18 },
  { code: "OD", name: "Odisha", share: 0.052, util: 77.1, uc: 76.0, villages: 470, seats: 7980, benef: 1.22 },
  { code: "WB", name: "West Bengal", share: 0.078, util: 74.6, uc: 75.2, villages: 712, seats: 11860, benef: 1.86 },
  { code: "MP", name: "Madhya Pradesh", share: 0.071, util: 74.2, uc: 72.8, villages: 656, seats: 10720, benef: 1.62 },
  { code: "RJ", name: "Rajasthan", share: 0.061, util: 71.8, uc: 70.4, villages: 548, seats: 9120, benef: 1.38 },
  { code: "UP", name: "Uttar Pradesh", share: 0.118, util: 68.5, uc: 69.1, villages: 1064, seats: 17240, benef: 2.74 },
  { code: "BR", name: "Bihar", share: 0.086, util: 61.3, uc: 64.2, villages: 786, seats: 12480, benef: 1.98 },
  { code: "JH", name: "Jharkhand", share: 0.041, util: 58.6, uc: 60.8, villages: 372, seats: 6240, benef: 0.94 },
  { code: "CG", name: "Chhattisgarh", share: 0.038, util: 57.2, uc: 59.4, villages: 344, seats: 5680, benef: 0.86 },
];

export const MONTHS = ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];
export const RELEASED_M = [320, 410, 560, 640, 720, 610, 580, 690, 540, 480, 360, 218];
export const UTILIZED_M = [180, 260, 380, 470, 560, 520, 500, 590, 470, 420, 300, 156];

// data source per indicator group (provenance)
export const SRC: Record<ViewId, string> = {
  executive: "Aggregated · all feeds",
  financial: "PFMS",
  gia: "GIA-MIS",
  hostel: "Hostel-MIS",
  adarsh: "Adarsh Gram MIS (AGMIS)",
  governance: "UC Portal · PFMS",
};
export const AS_OF = "04 Jun 2026";

interface KpiOpts {
  unit?: string;
  delta?: string;
  dir?: Dir;
  sub?: string;
  icon?: string;
  tone?: Tone;
  type?: KpiType;
  spark?: number[] | null;
  target?: number | null;
}
const k = (label: string, value: string, opts: KpiOpts = {}): Kpi => ({
  label,
  value,
  unit: opts.unit || "",
  delta: opts.delta,
  dir: opts.dir || "up",
  sub: opts.sub || "",
  icon: opts.icon || "analytics",
  tone: opts.tone || "blue",
  type: opts.type || "count",
  spark: opts.spark || null,
  target: opts.target != null ? opts.target : null,
});

export const KPIS: Record<ViewId, Kpi[]> = {
  executive: [
    k("Total Allocation", "9,250", { unit: "Cr", delta: "4.2%", dir: "up", sub: "FY budget", icon: "account_balance", type: "amount", spark: [70, 74, 78, 80, 84, 88, 92] }),
    k("Total Sanction", "8,142", { unit: "Cr", delta: "6.1%", dir: "up", sub: "88.0% of allocation", icon: "verified", type: "amount", spark: [60, 64, 68, 72, 76, 79, 81] }),
    k("Total Release", "6,718", { unit: "Cr", delta: "3.4%", dir: "up", sub: "82.5% of sanction", icon: "payments", type: "amount", spark: [50, 54, 58, 61, 64, 66, 67] }),
    k("Total Utilization", "5,306", { unit: "Cr", delta: "2.0%", dir: "down", sub: "79.0% of release", icon: "task_alt", tone: "green", type: "amount", spark: [52, 53, 52, 54, 53, 53, 53] }),
    k("Utilization % (of release)", "79.0", { unit: "%", delta: "1.6 pts", dir: "down", sub: "utilized ÷ released", icon: "donut_large", tone: "amber", type: "percent", spark: [82, 81, 81, 80, 80, 79, 79], target: 85 }),
    k("Total Beneficiaries", "24.19", { unit: "Lakh", delta: "8.7%", dir: "up", sub: "all schemes", icon: "groups", tone: "green", type: "count", spark: [16, 18, 19, 21, 22, 23, 24] }),
    k("Adarsh Gram Declared", "7,842", { delta: "1,204", dir: "up", sub: "villages, FYTD", icon: "holiday_village", tone: "green", type: "count", spark: [40, 48, 56, 64, 70, 75, 78] }),
    k("Works Completed", "1,02,394", { delta: "11.3%", dir: "up", sub: "of 1.46 L identified", icon: "construction", type: "count", spark: [60, 68, 76, 84, 92, 98, 102] }),
    k("Hostel Seats Created", "1,48,200", { delta: "5.9%", dir: "up", sub: "62% girls capacity", icon: "bed", type: "count", spark: [120, 126, 132, 138, 142, 146, 148] }),
    k("UC Compliance %", "86.4", { unit: "%", delta: "2.1 pts", dir: "up", sub: "₹612 Cr blocked", icon: "fact_check", tone: "green", type: "percent", spark: [80, 81, 82, 83, 84, 85, 86], target: 95 }),
  ],
  financial: [
    k("Total Budget Allocation", "9,250", { unit: "Cr", delta: "4.2%", dir: "up", sub: "FY 2025-26", icon: "account_balance", type: "amount", spark: [70, 74, 78, 80, 84, 88, 92] }),
    k("Total Funds Sanctioned", "8,142", { unit: "Cr", delta: "6.1%", dir: "up", sub: "88.0% of allocation", icon: "verified", type: "amount", spark: [60, 64, 68, 72, 76, 79, 81] }),
    k("Total Funds Released", "6,718", { unit: "Cr", delta: "3.4%", dir: "up", sub: "82.5% of sanction", icon: "payments", type: "amount", spark: [50, 54, 58, 61, 64, 66, 67] }),
    k("Total Funds Utilized", "5,306", { unit: "Cr", delta: "2.0%", dir: "down", sub: "79.0% of release", icon: "task_alt", tone: "green", type: "amount", spark: [52, 53, 52, 54, 53, 53, 53] }),
    k("Overall Utilization % (of release)", "79.0", { unit: "%", delta: "1.6 pts", dir: "down", sub: "utilized ÷ released", icon: "donut_large", tone: "amber", type: "percent", spark: [82, 81, 81, 80, 80, 79, 79], target: 85 }),
    k("Unspent Balance", "1,412", { unit: "Cr", delta: "3.1%", dir: "up", sub: "released − utilized", icon: "savings", tone: "amber", type: "amount", spark: [10, 11, 12, 12, 13, 13, 14] }),
    k("PFMS Success Rate", "97.3", { unit: "%", delta: "0.4 pts", dir: "up", sub: "txn success", icon: "sync_alt", tone: "green", type: "percent", spark: [95, 96, 96, 97, 97, 97, 97], target: 99 }),
    k("Avg. Fund Utilization Time", "42", { unit: "days", delta: "5 days", dir: "down", sub: "release → spend", icon: "timer", tone: "green", type: "days", spark: [52, 50, 48, 46, 45, 43, 42], target: 35 }),
    k("State-wise Top Utilization", "91.2", { unit: "%", sub: "Andhra Pradesh", icon: "emoji_events", tone: "green", type: "percent", delta: "Rank 1", dir: "flat" }),
    k("Low Utilization Alerts", "9", { sub: "states below 50%", icon: "warning", tone: "red", type: "count", delta: "2 states", dir: "down", spark: [13, 12, 12, 11, 10, 9, 9] }),
  ],
  gia: [
    k("GIA Proposals Submitted", "3,412", { delta: "7.8%", dir: "up", sub: "FY to date", icon: "description", type: "count", spark: [22, 25, 27, 29, 31, 33, 34] }),
    k("GIA Projects Approved", "2,548", { delta: "9.2%", dir: "up", sub: "74.7% approval", icon: "verified", tone: "green", type: "count", spark: [16, 18, 20, 22, 23, 24, 25] }),
    k("Projects Rejected / Returned", "486", { delta: "1.4%", dir: "down", sub: "14.2% returned", icon: "undo", tone: "amber", type: "count", spark: [6, 5, 5, 5, 5, 5, 5] }),
    k("GIA Funds Sanctioned", "2,310", { unit: "Cr", delta: "6.6%", dir: "up", sub: "of ₹2,640 Cr ask", icon: "payments", type: "amount", spark: [16, 18, 20, 21, 22, 23, 23] }),
    k("GIA Funds Utilized", "1,712", { unit: "Cr", delta: "3.0%", dir: "up", sub: "74.1% of sanctioned", icon: "task_alt", tone: "green", type: "amount", spark: [12, 13, 14, 15, 16, 17, 17] }),
    k("GIA Beneficiaries", "14.82", { unit: "Lakh", delta: "8.1%", dir: "up", sub: "SC beneficiaries", icon: "groups", tone: "green", type: "count", spark: [10, 11, 12, 13, 14, 14, 15] }),
    k("Income Generation Projects", "1,024", { delta: "12.0%", dir: "up", sub: "livelihood", icon: "storefront", type: "count", spark: [7, 8, 8, 9, 9, 10, 10] }),
    k("Skill Development Projects", "768", { delta: "6.4%", dir: "up", sub: "training", icon: "school", type: "count", spark: [6, 6, 7, 7, 7, 8, 8] }),
    k("Infrastructure Projects", "612", { delta: "4.0%", dir: "up", sub: "community assets", icon: "foundation", type: "count", spark: [5, 5, 6, 6, 6, 6, 6] }),
    k("Physical Progress", "73.4", { unit: "%", delta: "4.5 pts", dir: "up", sub: "weighted milestones", icon: "trending_up", tone: "amber", type: "percent", spark: [64, 66, 68, 70, 71, 72, 73], target: 80 }),
  ],
  hostel: [
    k("Hostel Proposals Submitted", "1,186", { delta: "5.2%", dir: "up", sub: "FY to date", icon: "description", type: "count", spark: [9, 10, 10, 11, 11, 12, 12] }),
    k("Hostels Approved", "842", { delta: "7.1%", dir: "up", sub: "71.0% approval", icon: "verified", tone: "green", type: "count", spark: [6, 7, 7, 8, 8, 8, 8] }),
    k("Hostels Completed", "514", { delta: "9.8%", dir: "up", sub: "61.0% of approved", icon: "task_alt", tone: "green", type: "count", spark: [3, 4, 4, 4, 5, 5, 5] }),
    k("Under Construction", "328", { delta: "2.1%", dir: "up", sub: "39.0% in progress", icon: "engineering", tone: "amber", type: "count", spark: [3, 3, 3, 3, 3, 3, 3] }),
    k("Hostel Funds Sanctioned", "2,640", { unit: "Cr", delta: "5.5%", dir: "up", sub: "capital grants", icon: "payments", type: "amount", spark: [20, 22, 23, 24, 25, 26, 26] }),
    k("Hostel Funds Utilized", "1,894", { unit: "Cr", delta: "4.2%", dir: "up", sub: "71.7% of sanctioned", icon: "task_alt", type: "amount", spark: [14, 15, 16, 17, 18, 18, 19] }),
    k("Total Seats Created", "1,48,200", { delta: "5.9%", dir: "up", sub: "cumulative", icon: "bed", type: "count", spark: [120, 126, 132, 138, 142, 146, 148] }),
    k("Current Occupancy", "1,12,640", { delta: "3.3%", dir: "up", sub: "76.0% filled", icon: "group", tone: "green", type: "count", spark: [92, 98, 102, 106, 108, 110, 112] }),
    k("Girls Hostel Capacity", "91,884", { delta: "62%", dir: "flat", sub: "of total seats", icon: "female", tone: "green", type: "count", spark: [70, 76, 80, 84, 88, 90, 91] }),
    k("Hostel Occupancy %", "76.0", { unit: "%", delta: "1.2 pts", dir: "up", sub: "seats utilised", icon: "donut_large", tone: "amber", type: "percent", spark: [71, 72, 73, 74, 75, 75, 76], target: 85 }),
  ],
  adarsh: [
    k("Villages Selected", "12,640", { delta: "8.0%", dir: "up", sub: "SC-majority", icon: "holiday_village", type: "count", spark: [98, 104, 110, 116, 120, 124, 126] }),
    k("Need Assessments Done", "10,842", { delta: "11.4%", dir: "up", sub: "85.8% of selected", icon: "fact_check", tone: "green", type: "count", spark: [82, 88, 94, 100, 104, 106, 108] }),
    k("VDPs Generated", "9,418", { delta: "10.1%", dir: "up", sub: "village dev. plans", icon: "map", tone: "green", type: "count", spark: [70, 76, 82, 86, 90, 92, 94] }),
    k("DLCC Approved VDPs", "8,206", { delta: "9.0%", dir: "up", sub: "87.1% of VDPs", icon: "approval", tone: "green", type: "count", spark: [60, 66, 72, 76, 78, 80, 82] }),
    k("Adarsh Gram Declared", "7,842", { delta: "1,204", dir: "up", sub: "villages, FYTD", icon: "verified", tone: "green", type: "count", spark: [40, 48, 56, 64, 70, 75, 78] }),
    k("Total Works Identified", "1,46,210", { delta: "6.2%", dir: "up", sub: "across villages", icon: "list_alt", type: "count", spark: [120, 126, 132, 138, 142, 145, 146] }),
    k("Total Works Completed", "1,02,394", { delta: "11.3%", dir: "up", sub: "70.0% completion", icon: "construction", tone: "green", type: "count", spark: [60, 68, 76, 84, 92, 98, 102] }),
    k("Gap-Filling Released", "1,768", { unit: "Cr", delta: "5.0%", dir: "up", sub: "top-up funds", icon: "payments", type: "amount", spark: [13, 14, 15, 16, 17, 17, 18] }),
    k("Gap-Filling Utilized", "1,284", { unit: "Cr", delta: "3.6%", dir: "up", sub: "72.6% of released", icon: "task_alt", type: "amount", spark: [9, 10, 11, 12, 12, 12, 13] }),
    k("Average Village Score", "78.4", { unit: "/100", delta: "3.0 pts", dir: "up", sub: "Adarsh Gram index", icon: "speed", tone: "green", type: "special", spark: [72, 73, 75, 76, 77, 78, 78], target: 85 }),
  ],
  governance: [
    k("Total UCs Submitted", "13,012", { delta: "6.0%", dir: "up", sub: "FY to date", icon: "receipt_long", type: "count", spark: [102, 106, 110, 116, 120, 126, 130] }),
    k("Total UCs Accepted", "11,240", { delta: "7.2%", dir: "up", sub: "86.4% accepted", icon: "verified", tone: "green", type: "count", spark: [88, 92, 98, 104, 108, 110, 112] }),
    k("Pending UCs", "1,772", { delta: "4.0%", dir: "down", sub: "412 over 90 days", icon: "pending_actions", tone: "amber", type: "count", spark: [22, 21, 20, 19, 19, 18, 18] }),
    k("UC Compliance %", "86.4", { unit: "%", delta: "2.1 pts", dir: "up", sub: "accepted / submitted", icon: "fact_check", tone: "green", type: "percent", spark: [80, 81, 82, 83, 84, 85, 86], target: 95 }),
    k("Installments Blocked", "612", { unit: "Cr", delta: "8.0%", dir: "down", sub: "pending UC", icon: "block", tone: "red", type: "amount", spark: [7, 7, 7, 6, 6, 6, 6] }),
    k("Avg. Proposal Processing", "38", { unit: "days", delta: "4 days", dir: "down", sub: "submit → appraise", icon: "timer", tone: "green", type: "days", spark: [46, 44, 42, 41, 40, 39, 38], target: 30 }),
    k("Avg. Sanction Processing", "54", { unit: "days", delta: "3 days", dir: "down", sub: "appraise → sanction", icon: "schedule", tone: "amber", type: "days", spark: [62, 60, 58, 57, 56, 55, 54], target: 45 }),
    k("Proposals Pending Appraisal", "426", { delta: "12.0%", dir: "down", sub: "in queue", icon: "inbox", tone: "amber", type: "count", spark: [6, 6, 5, 5, 5, 4, 4] }),
    k("Overdue Projects", "86", { delta: "9.0%", dir: "down", sub: "avg 47-day slip", icon: "event_busy", tone: "red", type: "count", spark: [11, 10, 10, 9, 9, 9, 9] }),
    k("Audit Obs. Pending Closure", "214", { delta: "6.0%", dir: "down", sub: "across schemes", icon: "gavel", tone: "amber", type: "count", spark: [26, 25, 24, 23, 22, 22, 21] }),
  ],
};

export const SCHEME_SHARE: Record<string, number> = {
  "All Schemes": 1,
  "Grant-in-Aid (GIA)": 0.34,
  Hostel: 0.3,
  "Adarsh Gram (PMAGY)": 0.27,
};

const DISTRICT_NAMES: Record<string, string[]> = {
  AP: ["Anantapur", "Guntur", "Visakhapatnam", "Kurnool", "Chittoor", "Nellore"],
  MH: ["Pune", "Nagpur", "Nashik", "Aurangabad", "Solapur", "Amravati"],
  UP: ["Lucknow", "Varanasi", "Agra", "Gorakhpur", "Bareilly", "Jhansi"],
  BR: ["Patna", "Gaya", "Muzaffarpur", "Bhagalpur", "Darbhanga", "Purnia"],
  TN: ["Coimbatore", "Madurai", "Salem", "Tiruchirappalli", "Vellore", "Erode"],
  KA: ["Belagavi", "Kalaburagi", "Mysuru", "Ballari", "Tumakuru", "Vijayapura"],
  GJ: ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Junagadh"],
};

export function districtsFor(state: StateRow): District[] {
  const names =
    DISTRICT_NAMES[state.code] ||
    Array.from({ length: 6 }, (_, i) => state.name + " Dist. " + (i + 1));
  const n = names.length;
  return names.map((name, i) => {
    const j = ((i * 37) % 11) - 5;
    const share = (1 / n) * (1 + ((i % 3) - 1) * 0.18);
    return {
      code: state.code + "-" + i,
      name,
      parent: state.code,
      share,
      util: Math.max(38, Math.min(96, state.util + j)),
      uc: Math.max(40, Math.min(97, state.uc + j - 1)),
    };
  });
}

export const VIEWS: ViewDef[] = [
  { id: "executive", label: "Executive Summary", icon: "dashboard", sub: "Secretary / JS overview" },
  { id: "financial", label: "Financial Management", icon: "account_balance_wallet", sub: "Allocation to utilisation" },
  { id: "gia", label: "Grant-in-Aid (GIA)", icon: "volunteer_activism", sub: "NGO & institution grants" },
  { id: "hostel", label: "Hostel Scheme", icon: "apartment", sub: "Construction & occupancy" },
  { id: "adarsh", label: "Adarsh Gram (PMAGY)", icon: "holiday_village", sub: "Village development" },
  { id: "governance", label: "Governance & Compliance", icon: "gavel", sub: "UCs, processing, audit", badge: 3 },
];
