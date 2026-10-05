import { ALL_STATES, SMILE_AREAS, type AreaNode } from "./geography.ts";
import type { AreaRow, AreaScope, KpiReading, KpiValue, PortalId, PortalReading } from "./types.ts";

/**
 * THE ILLUSTRATIVE MODEL — what each portal's dashboard reads until its KPI feed is
 * connected.
 *
 * NMBA is the exception: its feed is live (`live.ts`, `feeds/nmba.ts`), and its model only
 * fills what the feed does not carry, scaled to the feed's totals.
 *
 * Modelled, never typed at random (`.claude/rules/prototype-data-modes.md`). Each
 * portal starts from a small set of NATIONAL anchors, stated and sourced beside them,
 * and every other figure is derived from those anchors by a rule written next to it.
 * That buys the two properties the rule exists for:
 *
 *  1. FIGURES ADD UP. States sum to All India and districts to their state exactly
 *     (`apportion` hands the rounding to the largest remainders). A funnel is
 *     monotone. A share is computed from the same two counts shown beside it, so the
 *     Aadhaar share and the Aadhaar gap can never disagree.
 *  2. ONE REQUEST, ONE ANSWER. The public page and the officer view call the same
 *     function with the same scope, so a State Nodal Officer and a citizen filtering to
 *     that state see the same number (`data-state-completeness.md` §2).
 *
 * The day a portal's API answers, its reading replaces the model KPI by KPI — the
 * keys are the register's ids — and the model for that KPI is deleted.
 */

const MODELLED = (value: KpiValue): KpiReading => ({ value, origin: "modelled" });
const figure = (value: number): KpiValue => ({ kind: "figure", value });

/** Integers in proportion to `weights` that sum to `total` exactly (largest remainder). */
export function apportion(total: number, weights: number[]): number[] {
  const sum = weights.reduce((t, w) => t + w, 0);
  if (sum <= 0 || total <= 0) return weights.map(() => 0);
  const raw = weights.map((w) => (total * w) / sum);
  const out = raw.map(Math.floor);
  let left = total - out.reduce((t, v) => t + v, 0);
  const order = raw.map((r, i) => ({ i, rem: r - Math.floor(r) })).sort((a, b) => b.rem - a.rem);
  for (let k = 0; left > 0; k = (k + 1) % order.length, left -= 1) out[order[k]!.i]! += 1;
  return out;
}

/**
 * A fixed spread of ±15% per area and per measure, so a ranking has something to rank.
 *
 * IT CARRIES NO MEANING. It is a hash of the measure and the area's name — the same
 * every render and every build — and it exists only so twenty states do not all
 * convert at exactly the national rate, which no real feed would do. A real feed
 * replaces it, and nothing should ever be read into it before then.
 */
export function spread(measure: string, area: string): number {
  let h = 2166136261;
  for (const ch of `${measure}:${area}`) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return 0.85 + ((h >>> 0) % 3001) / 10000;
}

interface Split {
  /** The value for the scope itself. */
  at: (scope: AreaScope) => number;
  /** The value for each area one level down: states for All India, districts for a state. */
  children: (scope: AreaScope) => AreaRow[];
  /** Every district, for an All India district ranking. */
  leaves: () => AreaRow[];
}

/** Split a national total over an area tree, varying each area's share by `spread`. */
function split(total: number, measure: string, tree: AreaNode[]): Split {
  const states = apportion(total, tree.map((n) => n.weight * spread(measure, n.name)));
  const districtsOf = (i: number): AreaRow[] => {
    const node = tree[i]!;
    const kids = node.children ?? [];
    const vals = apportion(states[i]!, kids.map((k) => k.weight * spread(measure, k.name)));
    return kids.map((k, j) => ({ area: k.name, value: vals[j]! }));
  };
  const indexOf = (name: string) => tree.findIndex((n) => n.name === name);
  return {
    at(scope) {
      if (!scope.state) return total;
      const i = indexOf(scope.state);
      if (i < 0) return 0;
      if (!scope.district) return states[i]!;
      return districtsOf(i).find((d) => d.area === scope.district)?.value ?? 0;
    },
    children(scope) {
      if (!scope.state) return tree.map((n, i) => ({ area: n.name, value: states[i]! }));
      if (scope.district) return [];
      const i = indexOf(scope.state);
      return i < 0 ? [] : districtsOf(i);
    },
    leaves() {
      return tree.flatMap((_, i) => districtsOf(i));
    },
  };
}

/** A rate for the most specific area in scope: `base` × that area's spread, clamped to 0–100. */
function rate(base: number, measure: string, scope: AreaScope): number {
  const area = scope.district ?? scope.state;
  const r = area ? base * spread(measure, area) : base;
  return Math.round(Math.min(99.5, Math.max(0, r)) * 10) / 10;
}

const pct = (part: number, whole: number) => (whole > 0 ? Math.round((part / whole) * 1000) / 10 : 0);
/** ₹ thousand → ₹ crore, two decimals. Amounts are split in thousands so they stay integers. */
const crore = (thousands: number) => Math.round(thousands / 100) / 100;

/** Twelve months to the cut-off, oldest first. */
const MONTHS = ["Oct 2025", "Nov 2025", "Dec 2025", "Jan 2026", "Feb 2026", "Mar 2026", "Apr 2026", "May 2026", "Jun 2026", "Jul 2026", "Aug 2026", "Sep 2026"];
/** A programme scaling up: each month a little busier than the last. */
const RAMP = [6, 6.4, 6.9, 7.3, 7.8, 8.2, 8.7, 9.1, 9.5, 9.9, 10.3, 10.6];

/* ── SMILE – Beggary ──────────────────────────────────────────────────────── */

/**
 * NATIONAL ANCHORS — the SMILE Admin prototype's own All India Programme Overview
 * (`lib/smile-admin/mock-data.ts`: `PROGRAMME_KPI_ALL_INDIA`, `SYSTEM_USERS_ALL`), so
 * the two prototypes agree on the headline figures. Illustrative there too.
 */
const SMILE = {
  identified: 19_810,
  mobilised: 4_316,
  rehabilitated: 2_084,
  /** ₹ thousand: ₹7.25 crore disbursed, ₹5.92 crore utilised. */
  released: 72_460,
  utilised: 59_230,
  agencies: 112,
  surveyors: 1_286,
  shelters: 312,
};

function smileBeggary(scope: AreaScope): PortalReading {
  const at = (total: number, measure: string) => split(total, measure, SMILE_AREAS).at(scope);

  const identified = at(SMILE.identified, "identified");
  const mobilised = Math.min(identified, at(SMILE.mobilised, "mobilised"));
  const rehabilitated = Math.min(mobilised, at(SMILE.rehabilitated, "rehabilitated"));
  // Children: 11% of persons identified, as an indicative share.
  const children = Math.min(identified, at(Math.round(SMILE.identified * 0.11), "children"));
  const released = at(SMILE.released, "released");
  const utilised = Math.min(released, at(SMILE.utilised, "utilised"));
  const agencies = at(SMILE.agencies, "agencies");
  const shelters = at(SMILE.shelters, "shelters");
  // Capacity: an indicative 25 beds a Swashraya.
  const beds = shelters * 25;
  const surveyors = at(SMILE.surveyors, "surveyors");

  const [male, female, transgender] = apportion(identified, [62, 35, 3]);
  const rehabTypes = apportion(rehabilitated, [22, 14, 18, 20, 9, 7, 6, 4]);
  // Skill training: 42% of persons rehabilitated enrol; 45 / 43 / 12 in progress, completed, discontinued.
  const enrolled = Math.round(rehabilitated * 0.42);
  const [inProgress, completed, discontinued] = apportion(enrolled, [45, 43, 12]);
  // Convergence: 58% of persons rehabilitated are linked to at least one scheme; one person can hold several.
  const linked = Math.round(rehabilitated * 0.58);

  const aadhaarShare = rate(68, "aadhaar", scope);
  const withAadhaar = Math.round((identified * aadhaarShare) / 100);
  const bankShare = rate(41, "bank", scope);

  // Status pipeline — every identified person is in exactly one current stage, plus Cancelled.
  const fullyRehabilitated = Math.round(rehabilitated * 0.55);
  const notMobilised = identified - mobilised;
  const underMobilisation = Math.round(notMobilised * 0.22);

  // Fund chain, in ₹ thousand: NISD has released 1.35× and sanctioned 1.71× what has gone onward.
  const nisdReleased = Math.round(released * 1.35);
  const sanctioned = Math.round(released * 1.71);

  // Twelve-month activity: 40% of all identifications, 45% of mobilisations, 50% of rehabilitations happened in the last year.
  const monthly = (total: number) => apportion(total, RAMP);

  // Like-for-like Apr–Sep: 24% of all rehabilitations this year, 20% in the same months last year.
  const thisYear = Math.round(rehabilitated * 0.24 * spread("yoy", scope.district ?? scope.state ?? "india"));
  const lastYear = Math.round(rehabilitated * 0.2);

  const ranking: AreaRow[] = scope.district
    ? []
    : scope.state
      ? split(SMILE.identified, "identified", SMILE_AREAS).children(scope)
      : split(SMILE.identified, "identified", SMILE_AREAS).leaves();

  const utilisationRows: AreaRow[] = split(SMILE.released, "released", SMILE_AREAS)
    .children(scope)
    .map((r) => {
      const child: AreaScope = scope.state ? { state: scope.state, district: r.area } : { state: r.area };
      const u = Math.min(r.value, split(SMILE.utilised, "utilised", SMILE_AREAS).at(child));
      return { area: r.area, value: pct(u, r.value) };
    });

  const agencyRows = Math.min(8, agencies);
  const agencyIdentified = apportion(identified, Array.from({ length: agencyRows }, (_, i) => agencyRows - i));
  const agencySurveyors = apportion(surveyors, Array.from({ length: agencyRows }, (_, i) => agencyRows - i));
  const agencyAreas = scope.district ? [scope.district] : split(1, "identified", SMILE_AREAS).children(scope).map((r) => r.area);
  const districtsCovered = scope.state
    ? (SMILE_AREAS.find((n) => n.name === scope.state)?.children?.length ?? 0)
    : SMILE_AREAS.reduce((t, n) => t + (n.children?.length ?? 0), 0);

  return {
    "smile-beggary.identified": MODELLED(figure(identified)),
    "smile-beggary.mobilised": MODELLED(figure(mobilised)),
    "smile-beggary.children": MODELLED(figure(children)),
    "smile-beggary.rehabilitated": MODELLED(figure(rehabilitated)),
    "smile-beggary.gender": MODELLED({
      // The KPI is a share; the parts are counts, so the ring shows the share and the figures stay whole people.
      kind: "breakdown", chart: "donut", unit: "number",
      items: [{ label: "Male", value: male! }, { label: "Female", value: female! }, { label: "Transgender", value: transgender! }],
    }),
    "smile-beggary.states-covered": MODELLED(figure(SMILE_AREAS.length)),
    "smile-beggary.districts-covered": MODELLED(figure(districtsCovered)),
    "smile-beggary.agencies": MODELLED(figure(agencies)),
    "smile-beggary.shelters": MODELLED({
      kind: "pair",
      items: [
        { label: "Swashraya", value: shelters, unit: "number" },
        { label: "Beds", value: beds, unit: "number" },
      ],
    }),
    "smile-beggary.fund-released": MODELLED(figure(crore(released))),
    "smile-beggary.fund-utilised": MODELLED(figure(crore(utilised))),
    "smile-beggary.rehab-type": MODELLED({
      kind: "breakdown", chart: "bar",
      items: [
        "Wage Employment", "Self-Employment", "Skill Training", "Reunited with Family",
        "Care Home", "Child Welfare", "Anganwadi / School Admission", "SHG & Own House",
      ].map((label, i) => ({ label, value: rehabTypes[i]! })),
    }),
    "smile-beggary.skill-training": MODELLED({
      kind: "breakdown", chart: "donut",
      items: [{ label: "In Progress", value: inProgress! }, { label: "Completed", value: completed! }, { label: "Discontinued", value: discontinued! }],
    }),
    "smile-beggary.scheme-linkage": MODELLED({
      kind: "breakdown", chart: "bar",
      items: [
        ["e-SHRAM", 0.52], ["PM-JAY", 0.44], ["ONORC", 0.31], ["PMKVY", 0.17], ["NULM", 0.14], ["PMAY", 0.09],
      ].map(([label, share]) => ({ label: label as string, value: Math.round(linked * (share as number)) })),
    }),
    "smile-beggary.monthly-trend": MODELLED({
      kind: "series", chart: "line", labels: MONTHS,
      series: [
        { name: "Identified", data: monthly(Math.round(identified * 0.4)) },
        { name: "Mobilised", data: monthly(Math.round(mobilised * 0.45)) },
        { name: "Rehabilitated", data: monthly(Math.round(rehabilitated * 0.5)) },
      ],
    }),
    "smile-beggary.yoy-rehab": MODELLED(figure(lastYear > 0 ? pct(thisYear - lastYear, lastYear) : 0)),
    "smile-beggary.aadhaar": MODELLED(figure(aadhaarShare)),
    "smile-beggary.bank-account": MODELLED(figure(bankShare)),

    "smile-beggary.utilisation-pct": MODELLED({ kind: "areas", total: pct(utilised, released), rows: utilisationRows }),
    "smile-beggary.undisbursed": MODELLED(figure(crore(nisdReleased - released))),
    "smile-beggary.fund-pipeline": MODELLED({
      kind: "stages",
      stages: [
        { label: "Sanctioned", value: crore(sanctioned) },
        { label: "Released by NISD", value: crore(nisdReleased) },
        { label: "Released Onward to IAs", value: crore(released) },
      ],
    }),
    "smile-beggary.pipeline": MODELLED({
      kind: "breakdown", chart: "bar",
      items: [
        { label: "Identified", value: notMobilised - underMobilisation },
        { label: "Under Mobilization", value: underMobilisation },
        { label: "Mobilized", value: mobilised - rehabilitated },
        { label: "Under Rehabilitation", value: rehabilitated - fullyRehabilitated },
        { label: "Rehabilitated", value: fullyRehabilitated },
        // Cancelled sits outside "identified" (the register's KPI 1 excludes it): 3% of identified.
        { label: "Cancelled", value: Math.round(identified * 0.03) },
      ],
    }),
    "smile-beggary.conv-mobilised": MODELLED(figure(pct(mobilised, identified))),
    "smile-beggary.conv-rehab": MODELLED(figure(pct(rehabilitated, mobilised))),
    "smile-beggary.awaiting-review": MODELLED(figure(Math.round(identified * 0.032))),
    "smile-beggary.tat-sanction": MODELLED(figure(Math.round(21 * spread("tat-sanction", scope.state ?? "india")))),
    "smile-beggary.tat-onward": MODELLED(figure(Math.round(34 * spread("tat-onward", scope.district ?? scope.state ?? "india")))),
    "smile-beggary.tat-registration": MODELLED(figure(Math.round(18 * spread("tat-reg", scope.district ?? scope.state ?? "india")))),
    "smile-beggary.tat-review": MODELLED(figure(Math.round(6 * spread("tat-review", scope.district ?? scope.state ?? "india")))),
    "smile-beggary.follow-up": MODELLED({
      kind: "breakdown", chart: "bar",
      items: [
        { label: "3-Month", value: rate(78, "fu3", scope) },
        { label: "6-Month", value: rate(64, "fu6", scope) },
        { label: "12-Month", value: rate(51, "fu12", scope) },
      ],
    }),
    "smile-beggary.clarification": MODELLED(figure(Math.round(identified * 0.018))),
    "smile-beggary.files-not-filed": MODELLED(figure(Math.round(rehabilitated * 0.09))),
    "smile-beggary.pending-sync": MODELLED(figure(Math.round(identified * 0.006))),
    "smile-beggary.aadhaar-gap": MODELLED(figure(identified - withAadhaar)),
    "smile-beggary.ranking": MODELLED({ kind: "areas", total: identified, rows: ranking }),
    "smile-beggary.surveyors": MODELLED(figure(surveyors)),
    "smile-beggary.occupancy": MODELLED(figure(rate(71, "occupancy", scope))),
    "smile-beggary.shelters-unavailable": MODELLED({
      kind: "breakdown", chart: "bar",
      items: [
        { label: "Full", value: Math.round(shelters * 0.09) },
        { label: "Closed", value: Math.round(shelters * 0.03) },
        { label: "Under Inspection", value: Math.round(shelters * 0.04) },
      ],
    }),
    "smile-beggary.skill-completion": MODELLED({
      kind: "breakdown", chart: "bar",
      items: [
        { label: "Completed", value: pct(completed!, enrolled) },
        { label: "Discontinued", value: pct(discontinued!, enrolled) },
      ],
    }),
    "smile-beggary.relapse": MODELLED(figure(rate(6.8, "relapse", scope))),
    "smile-beggary.ia-registrations": MODELLED({
      kind: "breakdown", chart: "bar",
      items: [
        { label: "Approved", value: agencies },
        { label: "Pending", value: Math.round(agencies * 0.14) },
        { label: "Rejected", value: Math.round(agencies * 0.11) },
      ],
    }),
    "smile-beggary.ia-activity": MODELLED({
      kind: "table",
      columns: ["Implementing Agency", "Area", "Surveyors Mapped", "Beneficiaries Identified"],
      rows: Array.from({ length: agencyRows }, (_, i) => [
        `Implementing Agency ${String(i + 1).padStart(2, "0")}`,
        agencyAreas[i % Math.max(1, agencyAreas.length)] ?? "",
        agencySurveyors[i]!,
        agencyIdentified[i]!,
      ]),
    }),
    "smile-beggary.unassigned-locations": MODELLED(figure(Math.round(9 * spread("unassigned", scope.district ?? scope.state ?? "india") * (identified / SMILE.identified)))),
  };
}

/* ── NMBA ─────────────────────────────────────────────────────────────────── */

/**
 * SNAPSHOT — the NMBA public dashboard's national figures as the NMBA prototype
 * mirrored them (`lib/nmba/mock-data.ts`, `PUBLIC_DASHBOARD_STATS`, scraped from
 * nashamukt.dosje.gov.in on 19 Jun 2026). Copied rather than imported: that module also
 * carries record-level pledge data, which has no business in a website bundle.
 */
const NMBA_AS_ON = "19.06.2026";
const NMBA_SOURCE = "NMBA public dashboard";
const NMBA = { outreach: 25_89_78_572, youth: 9_33_63_189, women: 6_36_83_454, pledges: 22_75_906 };

/**
 * National figures a model can be anchored to — the live feed's, where it answered — so a
 * modelled gap (a state split, the helpline calls) is scaled to the live total shown
 * beside it rather than to the older snapshot (`prototype-data-modes.md`, anchor and scale).
 */
export interface ModelAnchors {
  outreach?: number;
  women?: number;
  youth?: number;
  pledges?: number;
  mitras?: number;
}

function nmba(scope: AreaScope, anchors: ModelAnchors = {}): PortalReading {
  const national = !scope.state;
  const anchored = Object.keys(anchors).length > 0;
  // With live anchors the national figures are the feed's and arrive separately; without
  // them they are the snapshot. Either way everything below a national figure is modelled.
  const snap = (value: number): KpiReading =>
    national && !anchored ? { value: figure(value), origin: "snapshot", source: NMBA_SOURCE, asOn: NMBA_AS_ON } : MODELLED(figure(value));
  const base = {
    outreach: anchors.outreach ?? NMBA.outreach,
    women: anchors.women ?? NMBA.women,
    youth: anchors.youth ?? NMBA.youth,
    pledges: anchors.pledges ?? NMBA.pledges,
    mitras: anchors.mitras ?? Math.round(NMBA.pledges * 0.012),
  };
  // By State/UT: the national figure spread by Census 2011 population (anchor and scale).
  const at = (total: number, measure: string) => split(total, measure, ALL_STATES).at(scope);
  const outreach = at(base.outreach, "outreach");
  // Mitras and helpline calls are not on the NMBA dashboard: modelled at 1.2 Mitras per
  // 100 pledges and two calls per 1,000 people reached.
  const reading: PortalReading = {
    "nmba.outreach": snap(outreach),
    "nmba.women": snap(Math.min(outreach, at(base.women, "women"))),
    "nmba.youth": snap(Math.min(outreach, at(base.youth, "youth"))),
    "nmba.pledges": snap(at(base.pledges, "pledges")),
    "nmba.mitras": MODELLED(figure(at(base.mitras, "mitras"))),
  };
  if (national) {
    reading["nmba.calls"] = MODELLED(figure(Math.round(base.outreach * 0.002)));
    reading["nmba.outreach-by-state"] = MODELLED({ kind: "areas", total: base.outreach, rows: split(base.outreach, "outreach", ALL_STATES).children({}) });
  }
  return reading;
}

/* ── e-Utthaan (DAPSC) ────────────────────────────────────────────────────── */

const FYS = ["2022-23", "2023-24", "2024-25", "2025-26", "2026-27"];
/**
 * Allocation for the welfare of Scheduled Castes, ₹ crore, B.E. — ILLUSTRATIVE, of the
 * order the Union Budget's Statement 10A has carried. R.E. at 96% of B.E.; expenditure at
 * 93% of R.E.; the current year to 30.09.2026 at 41% of B.E.
 */
const DAPSC_BE = [1_42_342, 1_59_126, 1_65_598, 1_68_478, 1_76_900];

/** Obligated Ministries with an illustrative mandated and allocated share of their scheme outlay. */
const DAPSC_MINISTRIES: [string, number, number][] = [
  ["Department of Rural Development", 16.6, 17.4],
  ["Department of School Education and Literacy", 16.6, 15.9],
  ["Department of Agriculture and Farmers Welfare", 16.6, 14.2],
  ["Department of Drinking Water and Sanitation", 16.6, 16.8],
  ["Ministry of Housing and Urban Affairs", 8.3, 7.1],
  ["Department of Health and Family Welfare", 8.3, 8.9],
  ["Ministry of Women and Child Development", 8.3, 9.2],
  ["Department of Higher Education", 8.3, 6.4],
  ["Ministry of Labour and Employment", 4.3, 4.6],
  ["Ministry of Micro, Small and Medium Enterprises", 4.3, 3.2],
];

function eUtthaan(): PortalReading {
  const re = DAPSC_BE.map((be) => Math.round(be * 0.96));
  const expenditure = re.map((r, i) => (i === FYS.length - 1 ? Math.round(DAPSC_BE[i]! * 0.41) : Math.round(r * 0.93)));
  return {
    "e-utthaan.allocation": MODELLED({
      kind: "series", chart: "bar", labels: FYS,
      series: [
        { name: "B.E.", data: DAPSC_BE },
        // The current year has no Revised Estimate yet: marked pending, never drawn as 0.
        { name: "R.E.", data: re.map((v, i) => (i === FYS.length - 1 ? 0 : v)), pending: [FYS.length - 1] },
      ],
    }),
    "e-utthaan.expenditure": MODELLED({
      kind: "series", chart: "bar", // The current year is half a year: labelled by its months, so its short bar is not read as a full year.
      labels: FYS.map((y, i) => (i === FYS.length - 1 ? "Apr–Sep 2026" : y)),
      series: [{ name: "Expenditure", data: expenditure }],
    }),
    "e-utthaan.mandate": MODELLED({
      kind: "table",
      columns: ["Ministry / Department", "Mandated (%)", "Allocated (%)", "Difference (Percentage Points)"],
      rows: DAPSC_MINISTRIES.map(([name, mandated, allocated]) => [name, mandated, allocated, Math.round((allocated - mandated) * 10) / 10]),
    }),
    "e-utthaan.ministries": MODELLED(figure(41)),
    "e-utthaan.schemes": MODELLED(figure(329)),
  };
}

/* ── SHRESHTA ─────────────────────────────────────────────────────────────── */

/** Illustrative, FY 2026-27 to 30.09.2026: ₹ crore and students, Mode-I and Mode-II. */
function shreshta(): PortalReading {
  return {
    "shreshta.funds": MODELLED({ kind: "breakdown", chart: "donut", items: [{ label: "Mode-I", value: 64.2 }, { label: "Mode-II", value: 18.35 }] }),
    "shreshta.beneficiaries": MODELLED({ kind: "breakdown", chart: "donut", items: [{ label: "Mode-I", value: 4_562 }, { label: "Mode-II", value: 2_914 }] }),
    "shreshta.field-inspection": MODELLED(figure(37)),
    "shreshta.sanctioned": MODELLED(figure(214)),
    "shreshta.deficiency": MODELLED(figure(46)),
  };
}

/* ── Entry point ──────────────────────────────────────────────────────────── */

/** Whether a portal has any presence in an area. SMILE – Beggary works in 17 states. */
export function covers(portal: PortalId, scope: AreaScope): boolean {
  if (!scope.state) return true;
  if (portal === "smile-beggary") {
    const node = SMILE_AREAS.find((n) => n.name === scope.state);
    if (!node) return false;
    return !scope.district || Boolean(node.children?.some((c) => c.name === scope.district));
  }
  if (portal === "nmba") return !scope.district;
  return false;
}

/** The areas a filter can offer for a portal: states, and the districts of a state. */
export function areaOptions(portal: PortalId, state?: string): string[] {
  if (portal === "smile-beggary") {
    if (!state) return SMILE_AREAS.map((n) => n.name).sort((a, b) => a.localeCompare(b));
    return SMILE_AREAS.find((n) => n.name === state)?.children?.map((c) => c.name) ?? [];
  }
  if (portal === "nmba" && !state) return ALL_STATES.map((n) => n.name).sort((a, b) => a.localeCompare(b));
  return [];
}

/** Everything a portal publishes for one area. A KPI the portal cannot read there is absent. */
export function readPortal(portal: PortalId, scope: AreaScope = {}, anchors?: ModelAnchors): PortalReading {
  if (!covers(portal, scope)) return {};
  switch (portal) {
    case "smile-beggary":
      return smileBeggary(scope);
    case "nmba":
      return nmba(scope, anchors);
    case "e-utthaan":
      return eUtthaan();
    case "shreshta":
      return shreshta();
  }
}
