import type { CardTone } from "@mosje/design-system";
import { PORTAL_DASHBOARDS } from "@/lib/kpi/register";

/**
 * The website's Dashboard — shared by the New, Classic and DBIM designs
 * (`.claude/rules/website-shared-content.md`).
 *
 * TWO PARTS, TWO KINDS OF FIGURE.
 *
 *  1. THE DEPARTMENT'S BENEFICIARY DASHBOARD — a replica of https://www.dosje.gov.in/dashboard/,
 *     read 5 Oct 2026: its four sections, its cards, its words (verbatim — "Students
 *     Beneficiary", "Latest Year (2025-26)", "SCHOOLS"), and the data behind its five
 *     charts. Departmental, published, mirrored on a date. Not a feed: the live page is
 *     hand-maintained, so this is content like any other on the website, and it renders
 *     in every data mode.
 *  2. DASHBOARDS BY PORTAL — one per portal that has submitted KPIs, drawn from the KPI
 *     register (`lib/kpi/register.ts`). NMBA is live; the rest are illustrative until their
 *     feeds are connected, and labelled so on the page.
 *
 * The live page's "SCHOOLS 45,228" and "COLLEGES 37,937" are students placed, by its own
 * Year on Year chart (1,275 + 3,177 + 13,769 + 27,007 = 45,228). The replica keeps the
 * live words; the question is recorded for the Department in
 * `docs/audit/kpi-dashboard-proforma-gaps.md`.
 */

export const DEPARTMENT_DASHBOARD_AS_ON = "05.10.2026";
/**
 * How these figures reached the estate: RECEIVED — supplied by hand, not read from a feed
 * (instruction, 6 Oct 2026). The proposed dashboard marks every one of them "Received"
 * (`ValueOrigin`), and draws them in every data mode, because they are the Department's.
 * Every figure and series below was checked against the live page's HTML on 6 Oct 2026 and
 * matches it exactly; the one number the page computes rather than prints is the ₹67,977
 * crore total of the nine fund slices (`FUND_SHARE`), which its own script sums.
 */
export const DEPARTMENT_DASHBOARD_ORIGIN = "received" as const;
export const DEPARTMENT_DASHBOARD_SOURCE = "Beneficiary Dashboard, Department of Social Justice and Empowerment";
export const DEPARTMENT_DASHBOARD_URL = "https://www.dosje.gov.in/dashboard/";

/**
 * The live page's card colours, as the design system's card tones (`Card tone`), which the
 * three designs re-bind through their palettes.
 */
export type DeptTone = CardTone;

export interface DeptAmount {
  /** As the live page prints the figure, without its unit: "₹4,896". */
  value: string;
  /** Set smaller after the figure: "Cr". */
  unit?: string;
}

export interface DeptMetric extends DeptAmount {
  label: string;
  /** The line under the figure: "Across Boys' and Girls' hostels". */
  sub?: string;
}

/** Section 1 — Scholarships and Fellowship: a coloured header, three figures. */
export interface DeptScholarshipCard {
  id: string;
  tone: DeptTone;
  /** Material Symbols name, standing for the live page's glyph. */
  icon: string;
  title: string;
  subtitle: string;
  metrics: DeptMetric[];
}

export const SCHOLARSHIPS = {
  pill: "SETU – Scholarship for Educational Transformation & Upliftment",
  title: "Scholarships and Fellowship",
  period: "Data: 2014–15 to 2025–26",
  cards: [
    {
      id: "sc",
      tone: "primary",
      icon: "school",
      title: "Scholarships for SC Students",
      subtitle: "Pre and Post Matric",
      metrics: [
        { label: "Pre-Matric (SCs & Others)", value: "₹4,896", unit: "Cr" },
        { label: "Post-Matric (SC)", value: "₹46,676", unit: "Cr" },
        { label: "Students Beneficiary", value: "9", unit: "Cr" },
      ],
    },
    {
      id: "obc",
      tone: "warning",
      icon: "group",
      title: "PM-YASASVI Scholarships",
      subtitle: "OBC, EBC and DNT · Pre-Matric and Post-Matric",
      metrics: [
        { label: "Pre-Matric", value: "₹2,163", unit: "Cr" },
        { label: "Post-Matric", value: "₹12,118", unit: "Cr" },
        { label: "Students Beneficiary", value: "11", unit: "Cr" },
      ],
    },
    {
      id: "shreyas",
      tone: "success",
      icon: "trophy",
      title: "SHREYAS National Fellowship",
      subtitle: "National Fellowship for OBC Students",
      metrics: [
        { label: "Fund Released", value: "₹640", unit: "Cr" },
        { label: "Scholars Funded", value: "14,757" },
        { label: "Latest Year (2025-26)", value: "2,506" },
      ],
    },
  ] satisfies DeptScholarshipCard[],
} as const;

/** Section 2 — Hostels and Top Class Education: a coloured top edge, an icon, figures or splits. */
export interface DeptFeatureCard {
  id: string;
  tone: DeptTone;
  icon: string;
  title: string;
  /** Hostel and Dr. Ambedkar: stacked figures. */
  metrics?: DeptMetric[];
  /** Top Class Education: two side-by-side halves, each with a chip and a fund line. */
  splits?: (DeptAmount & { chip: string; chipTone: "success" | "info"; sub: string; fund: string })[];
}

export const HOSTELS = {
  title: "Hostels and Top Class Education",
  cards: [
    {
      id: "hostels",
      tone: "primary",
      icon: "home",
      title: "Construction of Hostels for OBC Boys & Girls",
      metrics: [
        { label: "Seats Sanctioned", value: "28,865", sub: "Across Boys' and Girls' hostels" },
        { label: "Cumulative Disbursement", value: "₹347", unit: "Cr", sub: "FY 2014–15 to 2025–26" },
      ],
    },
    {
      id: "top-class",
      tone: "secondary",
      icon: "school",
      title: "Top Class Education in School & Colleges for OBC, EBC and DNT Students",
      splits: [
        { chip: "Schools", chipTone: "success", value: "45,228", sub: "Since 2022-23 (4 years)", fund: "₹117 Cr" },
        { chip: "Colleges", chipTone: "info", value: "37,937", sub: "Since 2023-24 (3 years)", fund: "₹810 Cr" },
      ],
    },
    {
      id: "ambedkar",
      tone: "danger",
      icon: "public",
      title: "Dr. Ambedkar Scheme of Interest Subsidy on Educational Loan for Overseas Studies for OBCs & EBCs",
      metrics: [
        { label: "Beneficiaries", value: "29,015", sub: "OBC and EBC students" },
        { label: "Cumulative Disbursement", value: "₹210", unit: "Cr", sub: "FY 2014-15 to 2025-26" },
      ],
    },
  ] satisfies DeptFeatureCard[],
} as const;

const YEARS_12 = ["2014-15", "2015-16", "2016-17", "2017-18", "2018-19", "2019-20", "2020-21", "2021-22", "2022-23", "2023-24", "2024-25", "2025-26"];
/** The live chart marks the provisional year in its axis label. */
const YEARS_12_PROVISIONAL = [...YEARS_12.slice(0, -1), "2025-26*"];

/**
 * Section 3 — "Year by Year Trends". The live chart's three views.
 *
 * Series colours are the estate's categorical slots, never a status scale (`semantic.json`
 * `chart/cat`): Pre-Matric slot 1 (blue) and Post-Matric slot 4 (green), as the live SC
 * view draws them — and the same two in the OBC view, where the live page switches to
 * orange and brown, so one series keeps one colour whichever view is open.
 */
export const BENEFICIARY_TRENDS = {
  title: "Year by Year Trends",
  cardTitle: "Beneficiary Students",
  footnote: "* 2025-26 provisional",
  views: [
    {
      id: "sc",
      label: "SC",
      unit: "Students Beneficiary (Lakh)",
      labels: YEARS_12_PROVISIONAL,
      provisional: true,
      series: [
        { name: "Pre-Matric", color: "var(--sa-chart-cat-1)", data: [25.13, 24.44, 20.2, 22.82, 30.97, 31.37, 31.22, 32.38, 11.34, 21.29, 21.65, 26.7] },
        { name: "Post-Matric", color: "var(--sa-chart-cat-4)", data: [53.87, 56.8, 58.62, 59.25, 60.29, 54.27, 50.16, 30.25, 46.47, 47.38, 48.04, 47.53] },
      ],
    },
    {
      id: "obc",
      label: "OBC",
      unit: "Students Beneficiary (Lakh)",
      labels: YEARS_12_PROVISIONAL,
      provisional: true,
      series: [
        { name: "Pre-Matric", color: "var(--sa-chart-cat-1)", data: [70.22, 46.83, 152.05, 41.31, 33.86, 94.49, 54.95, 58.62, 25.99, 18.43, 20.61, 25.21] },
        { name: "Post-Matric", color: "var(--sa-chart-cat-4)", data: [43.89, 44.43, 39.79, 36.83, 38.3, 38.21, 45.45, 37.73, 18.05, 27.16, 24.53, 31.26] },
      ],
    },
    {
      id: "shreyas",
      label: "SHREYAS",
      unit: "Scholars Funded",
      // The live chart has no 2014-15 figure; its series starts in 2015-16.
      labels: YEARS_12.slice(1),
      provisional: false,
      series: [{ name: "SHREYAS (National Fellowship)", color: "var(--sa-chart-cat-4)", data: [409, 714, 910, 679, 1192, 1233, 1338, 1570, 2009, 2197, 2506] }],
    },
  ],
} as const;

/**
 * "Share of Fund Release" — ₹ crore, across the nine schemes, 2014-15 to 2025-26 (totals
 * ₹67,977 crore).
 *
 * ONE DELIBERATE DEPARTURE FROM THE LIVE PAGE: the ring's colours. The live ring's nine
 * (navy, two greens, ochre, lavender, mauve, red, teal, grey) include pairs a
 * colour-blind reader cannot tell apart. The ring takes the estate's categorical slots 1-9
 * instead, which are guaranteed distinguishable under every colour-vision deficiency
 * (`check:chart-palette`; WCAG 2.2 AA ranks above fidelity, `standards-precedence.md`).
 */
export const FUND_SHARE = {
  title: "Share of Fund Release",
  subtitle: "Total spend across 9 schemes",
  slices: [
    { label: "Post-Matric SC", value: 46675.91, display: "₹46,676 Cr" },
    { label: "Post-Matric OBC", value: 12117.73, display: "₹12,118 Cr" },
    { label: "Pre-Matric SC", value: 4896.46, display: "₹4,896 Cr" },
    { label: "Pre-Matric OBC", value: 2163.11, display: "₹2,163 Cr" },
    { label: "Top Class Colleges", value: 810.15, display: "₹810 Cr" },
    { label: "National Fellowship (SHREYAS)", value: 640.14, display: "₹640 Cr" },
    { label: "Hostel Construction", value: 346.79, display: "₹347 Cr" },
    { label: "Overseas Loan Interest Subsidy", value: 209.94, display: "₹210 Cr" },
    { label: "Top Class Schools", value: 116.69, display: "₹117 Cr" },
  ],
} as const;

/**
 * Section 4 — "Year on Year Report": three cards, each with its own header colour.
 *
 * The live headers are violet, teal and rust. The design system has no violet tone — its
 * one violet is a chart slot, reserved for data — so the hostel card takes the primary band;
 * teal and rust are the info and secondary bands. Titles are one string; the live page's
 * hard line break is left to the card's own wrapping.
 */
export const YEAR_ON_YEAR = {
  title: "Year on Year Report",
  cards: [
    {
      id: "hostels",
      tone: "primary",
      title: "Construction of Hostels for OBC Boys & Girls",
      labels: YEARS_12,
      count: { name: "Seats", axis: "Seats", data: [2950, 2800, 2719, 600, 900, 1750, 3000, 2050, 2200, 2246, 3950, 3700] },
      fund: { name: "Fund Released (₹ Cr)", data: [30.21, 40.29, 40, 42.49, 36.05, 21.28, 31.59, 18.76, 18.8, 14.42, 31.84, 21.06] },
    },
    {
      id: "tce-schools",
      tone: "info",
      title: "Top Class Education in School for OBC, EBC and DNT",
      labels: ["2022-23", "2023-24", "2024-25", "2025-26"],
      count: { name: "Students placed", axis: "Students", data: [1275, 3177, 13769, 27007] },
      fund: { name: "Fund Released (₹ Cr)", data: [1.85, 6.73, 32.48, 75.63] },
    },
    {
      id: "tce-colleges",
      tone: "secondary",
      title: "Top Class Education in Colleges for OBC, EBC and DNT",
      labels: ["2023-24", "2024-25", "2025-26"],
      count: { name: "Students placed", axis: "Students", data: [5781, 14861, 17295] },
      fund: { name: "Fund Released (₹ Cr)", data: [124.06, 317.23, 368.86] },
    },
  ],
} as const;

/** Words for the page, shared by the three designs. */
export const DASHBOARD_PAGE = {
  /** The live page's h1. */
  title: "Beneficiary Dashboard",
  /** The live page's breadcrumb: Home / Dashboard. */
  crumb: "Dashboard",
  description:
    "Progress of the Department's schemes: the Beneficiary Dashboard, and the indicators reported by each scheme portal.",
  portalsTitle: "Dashboards by Portal",
  portalsDescription: "Key performance indicators reported by each scheme portal.",
} as const;

/** The portal dashboards the website lists, in the register's order. */
export const WEBSITE_PORTAL_DASHBOARDS = PORTAL_DASHBOARDS.map((p) => ({
  slug: p.slug,
  name: p.name,
  portal: p.portal,
  owner: p.owner,
  summary: p.summary,
  logoPath: p.logoPath,
  publicKpis: p.kpis.filter((k) => k.audience === "public").length,
  href: `/dashboard/${p.slug}`,
}));

/**
 * PM-AJAY is not in the KPI register — its KPIs are not yet received (tracker, 5 Oct
 * 2026) — but it is the one scheme whose figures ARE live, from its own report feeds, on
 * its own page. Listed beside the portal dashboards so a reader looking for it finds it.
 */
export const PMAJAY_DASHBOARD_LINK = {
  name: "Pradhan Mantri Anusuchit Jaati Abhyuday Yojana (PM-AJAY)",
  portal: "PM-AJAY Management Information System",
  summary: "Adarsh Gram, Grants-in-Aid to States and Districts, and hostels, from the scheme's live report feeds.",
  logoPath: "/portals/pm-ajay",
} as const;
