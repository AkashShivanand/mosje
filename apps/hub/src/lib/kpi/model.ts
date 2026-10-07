import { SMILE_AREAS, STATE_NAMES, type AreaNode } from "./geography.ts";
import { NMBA_STATES_SNAPSHOT } from "./feeds/nmba-states-snapshot.ts";
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
 *
 * EXCEPT REHABILITATION, re-anchored 6 Oct 2026 on what the Department has said in public.
 * The Lok Sabha was told 10,446 persons had been rehabilitated to 31 Jul 2026 (Unstarred
 * Question 3735, as reported; 7,622 adults and 2,824 children), against 9,958 identified
 * and 970 rehabilitated in the PIB factsheet of 5 May 2025 (to Dec 2024). The old 2,084
 * was a single year's order of magnitude on a cumulative KPI. 10,450 keeps it illustrative
 * and plausible (the page shows 10,411: the sum of the areas once each is capped by its own
 * mobilised figure, `smileStages`); 12,940 mobilised keeps the funnel monotone. Identified stays at the SMILE
 * Admin prototype's 19,810, inside the published range (≈10k Dec 2024 to the 31k reported
 * for Mar 2026). The SMILE Admin prototype still draws 2,084 and should follow.
 */
const SMILE = {
  identified: 19_810,
  mobilised: 12_940,
  rehabilitated: 10_450,
  /** ₹ thousand: ₹7.25 crore disbursed, ₹5.92 crore utilised. */
  released: 72_460,
  utilised: 59_230,
  agencies: 112,
  surveyors: 1_286,
  shelters: 312,
};

/** The figures that are capped by an earlier stage — a later stage never exceeds the one before. */
interface SmileStages {
  identified: number;
  mobilised: number;
  rehabilitated: number;
  children: number;
  released: number;
  utilised: number;
}

/**
 * The capped stages for one area, BUILT FROM THE MOST SPECIFIC AREAS UP. The caps are applied
 * where the figures are recorded — a district, or a State/UT with no districts on file — and
 * every larger area is the sum of the areas inside it. Capping each level on its own made the
 * All-India figure disagree with the sum of the States/UTs drawn beside it on the programme's
 * map (10,450 Persons Rehabilitated above a map adding to 10,434: `data-state-completeness.md`
 * §2, one request, one answer).
 */
function smileStages(scope: AreaScope): SmileStages {
  const leaf = (s: AreaScope): SmileStages => {
    const at = (total: number, measure: string) => split(total, measure, SMILE_AREAS).at(s);
    const identified = at(SMILE.identified, "identified");
    const mobilised = Math.min(identified, at(SMILE.mobilised, "mobilised"));
    const released = at(SMILE.released, "released");
    return {
      identified,
      mobilised,
      rehabilitated: Math.min(mobilised, at(SMILE.rehabilitated, "rehabilitated")),
      // Children: 11% of persons identified, as an indicative share.
      children: Math.min(identified, at(Math.round(SMILE.identified * 0.11), "children")),
      released,
      utilised: Math.min(released, at(SMILE.utilised, "utilised")),
    };
  };
  const sum = (parts: SmileStages[]): SmileStages =>
    parts.reduce(
      (t, x) => ({
        identified: t.identified + x.identified,
        mobilised: t.mobilised + x.mobilised,
        rehabilitated: t.rehabilitated + x.rehabilitated,
        children: t.children + x.children,
        released: t.released + x.released,
        utilised: t.utilised + x.utilised,
      }),
      { identified: 0, mobilised: 0, rehabilitated: 0, children: 0, released: 0, utilised: 0 },
    );
  const ofState = (state: string): SmileStages => {
    const node = SMILE_AREAS.find((n) => n.name === state);
    const districts = node?.children ?? [];
    return districts.length ? sum(districts.map((d) => leaf({ state, district: d.name }))) : leaf({ state });
  };
  if (scope.district) return leaf(scope);
  if (scope.state) return ofState(scope.state);
  return sum(SMILE_AREAS.map((n) => ofState(n.name)));
}

function smileBeggary(scope: AreaScope): PortalReading {
  const at = (total: number, measure: string) => split(total, measure, SMILE_AREAS).at(scope);

  const { identified, mobilised, rehabilitated, children, released, utilised } = smileStages(scope);
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
  /*
   * NO INVENTED STATE/UT FIGURES. A State/UT's NMBA figures, and the state map, come from
   * the feed or not at all. They were spread from the national total by population, which
   * the Department never supplied (instruction, 6 Oct 2026).
   */
  if (scope.state) return {};
  const anchored = Object.keys(anchors).length > 0;
  // With live anchors the national figures are the feed's and arrive separately; without
  // them they are the snapshot. Either way everything below a national figure is modelled.
  const snap = (value: number): KpiReading =>
    !anchored ? { value: figure(value), origin: "snapshot", source: NMBA_SOURCE, asOn: NMBA_AS_ON } : MODELLED(figure(value));
  const base = {
    outreach: anchors.outreach ?? NMBA.outreach,
    women: anchors.women ?? NMBA.women,
    youth: anchors.youth ?? NMBA.youth,
    pledges: anchors.pledges ?? NMBA.pledges,
    mitras: anchors.mitras ?? Math.round(NMBA.pledges * 0.012),
  };
  // Mitras and helpline calls are not on the NMBA dashboard: modelled at 1.2 Mitras per
  // 100 pledges and two calls per 1,000 people reached.
  return {
    // The State/UT map's fallback: the API's own State/UT figures, mirrored and dated — never
    // spread from the national total. A complete live reading replaces it (`resolveReading`).
    "nmba.outreach-by-state": {
      value: { kind: "areas", total: NMBA_STATES_SNAPSHOT.national, rows: NMBA_STATES_SNAPSHOT.rows.map((r) => ({ area: r.area, value: r.value })) },
      origin: "snapshot",
      source: NMBA_STATES_SNAPSHOT.source,
      asOn: NMBA_STATES_SNAPSHOT.asOn,
    },
    "nmba.outreach": snap(base.outreach),
    "nmba.women": snap(base.women),
    "nmba.youth": snap(base.youth),
    "nmba.pledges": snap(base.pledges),
    "nmba.mitras": MODELLED(figure(base.mitras)),
    "nmba.calls": MODELLED(figure(Math.round(base.outreach * 0.002))),
  };
}

/* ── e-Utthaan (DAPSC) ────────────────────────────────────────────────────── */

const FYS = ["2022-23", "2023-24", "2024-25", "2025-26", "2026-27"];
/**
 * Allocation for the welfare of Scheduled Castes, ₹ crore, B.E. — the Grand Total of the
 * Union Budget's Statement 10A in each year's own Expenditure Profile, rounded to the crore
 * (indiabudget.gov.in, read 6 Oct 2026): 1,42,342.36 · 1,59,126.22 · 1,65,492.72 ·
 * 1,68,478.38 · 1,96,400.37. Two were wrong until then (1,65,598 and 1,76,900).
 *
 * Still drawn as ILLUSTRATIVE: they are published figures, but not yet read from the
 * e-Utthaan portal or received from the Department, and R.E. and expenditure around them
 * are modelled. Where the Budget states one, it is used: R.E. 2025-26 1,61,205.10, and
 * the 2024-25 actual 1,23,372.16. Elsewhere R.E. is 95.7% of B.E. (the 2025-26 ratio) and
 * expenditure 74.5% of B.E. (the 2024-25 ratio); the current year to 30.09.2026 at 35%.
 */
const DAPSC_BE = [1_42_342, 1_59_126, 1_65_493, 1_68_478, 1_96_400];
/** Published figures by year index, where the Budget states one. */
const DAPSC_RE_KNOWN: Record<number, number> = { 3: 1_61_205 };
const DAPSC_ACTUAL_KNOWN: Record<number, number> = { 2: 1_23_372 };

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
  const re = DAPSC_BE.map((be, i) => DAPSC_RE_KNOWN[i] ?? Math.round(be * 0.957));
  const expenditure = DAPSC_BE.map((be, i) => (i === FYS.length - 1 ? Math.round(be * 0.35) : (DAPSC_ACTUAL_KNOWN[i] ?? Math.round(be * 0.745))));
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
      // The mandate is a minimum earmark: allocating above it complies.
      againstMinimum: { column: 3, header: "Against the Mandate", unit: "pp" },
    }),
    // The e-Utthaan portal's own count (devmosje.negd.in, read 6 Oct 2026): 38 Ministries /
    // Departments and 239 schemes. Was 41 and 329, which nothing supported.
    "e-utthaan.ministries": MODELLED(figure(38)),
    "e-utthaan.schemes": MODELLED(figure(239)),
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

/* ── Senior Citizens Welfare ──────────────────────────────────────────────── */

/**
 * ILLUSTRATIVE, FY 2026-27 to 30.09.2026, ₹ crore. No figure here is the Department's: the
 * portal's APIs answer only to a signed-in user. Each component's Financial Progress is its
 * expenditure over its Budget Estimate, computed here from the two figures shown beside it,
 * so the three can never disagree. Every figure is All-India.
 */
const SCW_FUNDS: Record<string, [budget: number, spent: number]> = {
  // Re-anchored 6 Oct 2026 on the Notes on Demands for Grants 2026-27 (Demand 93), B.E.
  // 2026-27: AVYAY (IPSrC + SAPSrC) ₹355 Cr, and AVYAY-CS (RVY, Elderline, caregivers, SAGE
  // and other) ₹385 Cr. The old split put ₹590 Cr on the first two. Elderline's ₹32 Cr
  // matches the ₹162 Cr released over five years (AIR, 21 Sep 2026); caregivers' ₹27 Cr the
  // ₹81 Cr over three. Each component's spend keeps its earlier pace against its budget.
  ipsrc: [250, 106.8],
  sapsrc: [105, 44.1],
  rvy: [280, 114.8],
  "pm-special": [27, 6.5],
  elderline: [32, 13.4],
};

function seniorCitizens(): PortalReading {
  const r: PortalReading = {};
  for (const [c, [budget, spent]] of Object.entries(SCW_FUNDS)) {
    // All-India only. SAPSrC's budget used to be spread across States/UTs by population, a
    // breakdown the Department has not supplied (instruction, 6 Oct 2026).
    r[`senior-citizens.${c}.budget`] = MODELLED(figure(budget));
    r[`senior-citizens.${c}.expenditure`] = MODELLED(figure(spent));
    r[`senior-citizens.${c}.progress`] = MODELLED(figure(Math.round((spent / budget) * 1000) / 10));
  }
  // RVY, half a year: 8.53 lakh beneficiaries and 46 lakh devices over FY 2017-18 to
  // 2025-26 (AIR, 21 Sep 2026) is about 0.95 lakh people and 5.4 devices each a year. The
  // cost is the RVY spend above, so the two can never disagree.
  const devices = 2_83_000;
  const generic = Math.round(devices * 0.83);
  // 705 senior care homes, 13 continuous care homes, 3 physiotherapy clinics and 17 mobile
  // medicare units are reported under IPSrC (secondary source); 1,212 had no anchor.
  r["senior-citizens.ipsrc.projects"] = MODELLED(figure(738));
  r["senior-citizens.ipsrc.beneficiaries"] = MODELLED(figure(1_04_350));
  r["senior-citizens.rvy.devices-cost"] = MODELLED({
    kind: "pair",
    items: [
      { label: "Devices Distributed", value: devices, unit: "number" },
      { label: "Cost Incurred", value: SCW_FUNDS.rvy![1], unit: "crore" },
    ],
  });
  r["senior-citizens.rvy.beneficiaries"] = MODELLED(figure(52_400));
  r["senior-citizens.rvy.devices"] = MODELLED(figure(devices));
  r["senior-citizens.rvy.activities"] = MODELLED({ kind: "breakdown", chart: "donut", items: [{ label: "Camp Mode", value: 846 }, { label: "Walk-in Mode", value: 438 }] });
  r["senior-citizens.rvy.devices-by-type"] = MODELLED({ kind: "breakdown", chart: "donut", items: [{ label: "Generic Items", value: generic }, { label: "Special Items", value: devices - generic }] });
  r["senior-citizens.pm-special.caregivers"] = MODELLED(figure(8_640));
  r["senior-citizens.elderline.calls"] = MODELLED({
    kind: "breakdown",
    chart: "bar",
    items: [
      // Half a year of Elderline: over 29 lakh calls since October 2021 (PIB, 24 Sep 2026) is
      // about 6 lakh a year. The old 4.27 lakh was a year's worth in six months.
      { label: "Information", value: 1_29_000 },
      { label: "Guidance", value: 71_800 },
      { label: "Emotional Support", value: 50_300 },
      { label: "Field Intervention", value: 26_900 },
      { label: "Other", value: 20_800 },
    ],
  });
  r["senior-citizens.sage.budget"] = MODELLED(figure(20));
  r["senior-citizens.sage.released"] = MODELLED(figure(6.3));
  r["senior-citizens.sage.startups"] = MODELLED(figure(54));
  r["senior-citizens.other.mous"] = MODELLED(figure(7));
  return r;
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
  if (portal === "nmba" && !state) return [...STATE_NAMES];
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
    case "senior-citizens":
      return seniorCitizens();
  }
}
