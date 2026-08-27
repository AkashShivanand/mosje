/* ============================================================================
   Sample data for the data-visualisation reference library.

   Every figure here is a plausible Government-of-India shape — DoSJE scheme
   allocations in ₹ crore, an April–March fiscal year, census-style age bands,
   social-category breakdowns, SLA counts, audit statuses. It is illustrative,
   not published statistics, and the pages that render it say so.

   Why real shapes matter for a specimen: charts fail on the shape of the data,
   not on its truth. Nine-digit rupee values are what break axis padding;
   "Person with Disability" is what breaks a legend; a suppressed cell is what
   breaks a total. Lorem numbers hide every one of those.
   ============================================================================ */

/* ── Financial / budget ──────────────────────────────────────────────────── */

/** Scheme-wise allocation vs utilisation, ₹ crore, FY 2025–26. */
export const SCHEME_FUNDS = {
  labels: ["PM-AJAY", "SMILE", "NAPDDR", "Scholarships", "NSFDC", "Venture Fund"],
  allocated: [2140, 360, 285, 6820, 480, 220],
  utilised: [1687, 291, 246, 6104, 402, 131],
};

/** Monthly disbursement against target, ₹ crore — the combo-chart specimen. */
export const DISBURSEMENT = {
  labels: ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  disbursed: [412, 508, 634, 590, 721, 803, 768, 892, 940],
  targetPct: [68, 72, 79, 74, 83, 88, 85, 91, 94],
};

/* ── Census / demographic ────────────────────────────────────────────────── */

/** Beneficiaries by age band — census-style buckets, not even decades. */
export const AGE_BANDS = [
  { label: "0–14", value: 184_320 },
  { label: "15–29", value: 512_880 },
  { label: "30–44", value: 447_150 },
  { label: "45–59", value: 298_640 },
  { label: "60+", value: 163_910 },
];

/** Social category split. Categorical slots only — never a semantic hue. */
export const SOCIAL_CATEGORY = [
  { label: "Scheduled Caste", value: 742_180 },
  { label: "Other Backward Class", value: 519_460 },
  { label: "Scheduled Tribe", value: 231_770 },
  { label: "General", value: 113_490 },
];

/** Gender split for the donut specimen. */
export const GENDER = [
  { label: "Female", value: 861_240 },
  { label: "Male", value: 738_910 },
  { label: "Transgender", value: 6_750 },
];

/* ── Service delivery / operations ───────────────────────────────────────── */

/** Application pipeline — genuinely sequential and monotonically decreasing. */
export const PIPELINE = [
  { label: "Applications received", value: 128_400 },
  { label: "Documents verified", value: 96_310 },
  { label: "Eligibility confirmed", value: 71_880 },
  { label: "Sanctioned", value: 58_240 },
  { label: "Disbursed", value: 54_106 },
];

/** Daily registrations across a fortnight — the sparkline and area specimens. */
export const DAILY_REGISTRATIONS = [
  1840, 2010, 1760, 2240, 2680, 1120, 890, 2410, 2790, 3020, 2880, 3140, 1390, 1010,
];

/** Applications received vs cleared, monthly — the line/area specimen. */
export const THROUGHPUT = {
  labels: ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov"],
  received: [10_240, 11_870, 13_410, 12_980, 15_620, 17_100, 16_440, 18_920],
  cleared: [9_180, 10_240, 11_960, 12_310, 13_880, 15_020, 15_610, 16_740],
};

/* ── Health / welfare ────────────────────────────────────────────────────── */

/** State-wise coverage rate, %. A choropleth takes rates, never raw counts. */
export const STATE_COVERAGE = [
  { state: "Kerala", value: 94 },
  { state: "Tamil Nadu", value: 91 },
  { state: "Himachal Pradesh", value: 88 },
  { state: "Karnataka", value: 84 },
  { state: "Maharashtra", value: 81 },
  { state: "Gujarat", value: 79 },
  { state: "Punjab", value: 77 },
  { state: "Andhra Pradesh", value: 74 },
  { state: "Telangana", value: 73 },
  { state: "West Bengal", value: 68 },
  { state: "Odisha", value: 64 },
  { state: "Rajasthan", value: 61 },
  { state: "Madhya Pradesh", value: 57 },
  { state: "Assam", value: 54 },
  { state: "Uttar Pradesh", value: 49 },
  { state: "Jharkhand", value: 46 },
  { state: "Bihar", value: 41 },
];

/** Scheme uptake against per-capita income — the scatter specimen. */
export const UPTAKE_VS_INCOME = [
  { x: 42, y: 91, label: "Kerala" },
  { x: 48, y: 84, label: "Karnataka" },
  { x: 51, y: 81, label: "Maharashtra" },
  { x: 39, y: 88, label: "Himachal Pradesh" },
  { x: 45, y: 79, label: "Gujarat" },
  { x: 28, y: 64, label: "Odisha" },
  { x: 24, y: 49, label: "Uttar Pradesh" },
  { x: 21, y: 41, label: "Bihar" },
  { x: 31, y: 57, label: "Madhya Pradesh" },
  { x: 26, y: 46, label: "Jharkhand" },
  { x: 34, y: 61, label: "Rajasthan" },
  { x: 37, y: 68, label: "West Bengal" },
];

/* ── Compliance / regulatory ─────────────────────────────────────────────── */

/** Quarterly utilisation-certificate compliance, % — the heatmap specimen. */
export const COMPLIANCE_MATRIX = {
  xLabels: ["Q1", "Q2", "Q3", "Q4"],
  yLabels: ["PM-AJAY", "SMILE", "NAPDDR", "Scholarships", "NSFDC"],
  matrix: [
    [92, 88, 95, 79],
    [74, 81, 86, 68],
    [96, 94, 91, 89],
    [88, 90, 84, 77],
    [61, 70, 73, 66],
  ],
};

/** Implementing-agency register — the table specimen. */
export interface AgencyRow extends Record<string, unknown> {
  agency: string;
  state: string;
  sanctioned: number;
  utilised: number;
  /** null renders as an em dash: the value exists but is withheld. */
  beneficiaries: number | null;
  status: "Compliant" | "Under review" | "Overdue";
}

export const AGENCIES: AgencyRow[] = [
  { agency: "Kerala Social Justice Directorate", state: "Kerala", sanctioned: 184_00_00_000, utilised: 171_20_00_000, beneficiaries: 42_180, status: "Compliant" },
  { agency: "Maharashtra SC Corporation", state: "Maharashtra", sanctioned: 312_50_00_000, utilised: 268_90_00_000, beneficiaries: 78_640, status: "Compliant" },
  { agency: "Bihar Mahadalit Vikas Mission", state: "Bihar", sanctioned: 96_80_00_000, utilised: 51_40_00_000, beneficiaries: 19_320, status: "Overdue" },
  { agency: "Tamil Nadu Adi Dravidar Welfare", state: "Tamil Nadu", sanctioned: 241_00_00_000, utilised: 219_60_00_000, beneficiaries: 61_450, status: "Compliant" },
  { agency: "Odisha ST & SC Development", state: "Odisha", sanctioned: 128_40_00_000, utilised: 94_10_00_000, beneficiaries: null, status: "Under review" },
  { agency: "Rajasthan Social Justice Board", state: "Rajasthan", sanctioned: 154_70_00_000, utilised: 118_30_00_000, beneficiaries: 28_910, status: "Under review" },
];

/* ── Formatters used across the specimens ────────────────────────────────── */

/** ₹ in crore, Indian grouping. Government financial reporting speaks crore. */
export const formatCrore = (n: number): string => `₹${n.toLocaleString("en-IN")} Cr`;

/** A whole-rupee figure rendered in crore — for the agency table. */
export const rupeesToCrore = (paise: number): string =>
  `₹${(paise / 1_00_00_000).toLocaleString("en-IN", { maximumFractionDigits: 2 })} Cr`;

export const formatPct = (n: number): string => `${n}%`;
