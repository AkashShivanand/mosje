import { formatKpi } from "@/lib/kpi/format";
import { canSeePortal, type OfficerRole } from "@/lib/kpi/access";
import { resolveReading, type DataModeName, type PortalFeed } from "@/lib/kpi/live";
import { PROGRAMMES, kpisFor, levelsOf } from "@/lib/kpi/register";
import { areaOptions } from "@/lib/kpi/model";
import type {
  AreaScope,
  KpiCategory,
  KpiDefinition,
  KpiReading,
  KpiUnit,
  KpiValue,
  PortalDashboard,
  PortalId,
  PortalReading,
  ValueOrigin,
} from "@/lib/kpi/types";

/**
 * The proposed dashboard's view of the KPI register: what is read, for whom, and how a
 * reading is reduced to the one figure a headline or a profile line needs.
 *
 * ONE REQUEST, ONE ANSWER (`data-state-completeness.md` §2). `readAll` resolves every
 * programme once for the scope and mode, and every lens — the headline tiles, the map,
 * the funds chart, a programme page, a state profile, the About panel — reads that one
 * result. Two parts of the page can never show the same KPI with two values.
 */

export type Lens = "overview" | "programmes" | "themes" | "states" | "readiness";

export interface Viewing {
  role: OfficerRole | undefined;
  audience: "public" | "officer";
  /** The programmes this viewer may see, in register order. */
  programmes: PortalDashboard[];
}

/**
 * The programmes the proposed dashboard draws: every portal whose KPIs are defined in the KPI
 * sheet — SMILE – Beggary, NMBA, DAPSC (e-Utthaan), SHRESHTA (e-Anudaan) and Senior Citizens
 * Welfare, one tab each (instruction, 6 Oct 2026, widening the three-portal scope set earlier
 * that day). A portal joins this list when its KPIs reach the sheet. The Department's own
 * sections (scholarships, hostels, trends, funds) are not programmes and are unaffected.
 */
export const PROGRAMMES_SHOWN: readonly PortalId[] = ["nmba", "smile-beggary", "e-utthaan", "shreshta", "senior-citizens"];

export function viewingFor(role: OfficerRole | undefined): Viewing {
  return {
    role,
    audience: role ? "officer" : "public",
    programmes: PROGRAMMES.filter((p) => PROGRAMMES_SHOWN.includes(p.id) && (!role || canSeePortal(role, p.id))),
  };
}

export type Readings = Partial<Record<PortalId, PortalReading>>;

/**
 * THE ONE GATE BETWEEN PRE-LOGIN AND POST-LOGIN. Every reading a viewer's audience may not see
 * is dropped HERE, before any tile, chart, map or sentence can reach it — so a citizen's page
 * cannot show an officer KPI however a component reads `readings`. The audience defaults to
 * the public, so a caller that forgets it shows less, never more.
 *
 * Until 6 Oct 2026 the readings carried every KPI and only some lenses filtered by audience:
 * the citizen's page showed Senior Citizens Welfare's budget and expenditure, and SMILE's
 * conversion rates, all of which the sheet marks Post-Login.
 */
export function readAll(
  programmes: PortalDashboard[],
  scope: AreaScope,
  mode: DataModeName,
  feeds: Partial<Record<PortalId, PortalFeed>>,
  audience: "public" | "officer" = "public",
): Readings {
  return Object.fromEntries(
    programmes.map((p) => {
      const visible = new Set(kpisFor(p, audience).map((k) => k.id));
      const reading = resolveReading(p.id, scope, mode, feeds[p.id]);
      return [p.id, Object.fromEntries(Object.entries(reading).filter(([id]) => visible.has(id)))];
    }),
  );
}

/* ── Financial Year ─────────────────────────────────────────────────────────── */

/**
 * THE FINANCIAL YEAR FILTER, WHERE A PROGRAMME'S FIGURES ARE COUNTED BY YEAR (approved
 * 8 Oct 2026): SMILE-Beggary, e-Anudaan (SHRESHTA) and Senior Citizens Welfare report the year
 * to date; e-Utthaan publishes allocations year by year. Not NMBA (cumulative since launch), not
 * the Department (its own published periods), not the landing page (its cards cover different
 * periods). The current year is the readings as they stand.
 */
export const YEAR_FILTER: Partial<Record<PortalId, { current: string; years: string[]; toDate: boolean }>> = {
  "smile-beggary": { current: "2026-27", years: ["2026-27", "2025-26", "2024-25", "2023-24"], toDate: true },
  shreshta: { current: "2026-27", years: ["2026-27", "2025-26", "2024-25", "2023-24"], toDate: true },
  "senior-citizens": { current: "2026-27", years: ["2026-27", "2025-26", "2024-25", "2023-24"], toDate: true },
  "e-utthaan": { current: "2026-27", years: ["2026-27", "2025-26", "2024-25", "2023-24", "2022-23"], toDate: false },
};

export const yearOption = (spec: { current: string; toDate: boolean }, year: string) =>
  year === spec.current && spec.toDate ? `${year} (to date)` : year;

/**
 * An earlier year's figures, ILLUSTRATIVE: no portal feed carries past years yet, so the
 * prototype scales the current figures down by a fixed share per year back and marks every one
 * of them illustrative (`modelled`), as any figure without a source is. Percentages, series
 * (already year by year) and tables are left as they are. The live portals will supply the real
 * years; this only lets the filter be seen working.
 */
export function readingForYear(reading: Partial<Record<string, KpiReading>>, units: Readonly<Record<string, KpiUnit>>, spec: { current: string; years: string[] }, year: string): Partial<Record<string, KpiReading>> {
  const back = Math.max(0, spec.years.indexOf(year));
  if (back === 0) return reading;
  const f = [1, 0.86, 0.73, 0.62, 0.53][back] ?? 0.5;
  const n = (v: number) => (Number.isInteger(v) ? Math.round(v * f) : Math.round(v * f * 100) / 100);
  const scale = (v: KpiValue): KpiValue => {
    switch (v.kind) {
      case "figure": return { ...v, value: n(v.value) };
      case "pair": return { ...v, items: v.items.map((i) => (i.unit === "percent" ? i : { ...i, value: n(i.value) })) as typeof v.items };
      case "breakdown": return v.unit === "percent" ? v : { ...v, items: v.items.map((i) => ({ ...i, value: n(i.value) })) };
      case "stages": return { ...v, stages: v.stages.map((i) => ({ ...i, value: n(i.value) })) };
      case "areas": return { ...v, total: n(v.total), rows: v.rows.map((r) => ({ ...r, value: n(r.value) })) };
      default: return v;
    }
  };
  return Object.fromEntries(
    Object.entries(reading).flatMap(([id, r]) => {
      if (!r) return [];
      // A rate or a duration is not a count of the year: it keeps its value.
      const unit = units[id];
      const keep = unit === "percent" || unit === "days";
      return [[id, keep ? r : { ...r, value: scale(r.value), origin: "modelled" as const, source: undefined, asOn: undefined }]];
    }),
  );
}

/* ── A programme's figures, State/UT by State/UT ───────────────────────────── */

/**
 * The State/UT-level KPIs a programme's page maps, and the word each takes on its switch.
 * SMILE – Beggary's three stages, in the sheet's own short words (KPI 15, "Monthly Trend –
 * Identified / Mobilised / Rehabilitated"), as the SMILE – Beggary handoff draws its
 * State-wise Beneficiary Distribution (Figma `evmNmlK8g4VYwJVu2FwSGV` 8664:49263). NMBA maps
 * its own State/UT KPI (`nmba.outreach-by-state`) on its page already.
 */
export const STATE_MEASURES: Partial<Record<PortalId, { kpi: string; label: string }[]>> = {
  "smile-beggary": [
    { kpi: "smile-beggary.identified", label: "Identified" },
    { kpi: "smile-beggary.mobilised", label: "Mobilised" },
    { kpi: "smile-beggary.rehabilitated", label: "Rehabilitated" },
  ],
};

export interface StateMeasure {
  kpi: KpiDefinition;
  label: string;
  rows: { state: string; value: number }[];
}

/**
 * Each mapped KPI's figure in every State/UT the programme works in — each one read through
 * `readAll`, so the State/UT figures pass the same pre-login gate, and come from the same
 * source and mode, as the All-India figure above them.
 */
export function stateMeasures(
  p: PortalDashboard,
  mode: DataModeName,
  feeds: Partial<Record<PortalId, PortalFeed>>,
  audience: "public" | "officer",
): StateMeasure[] {
  const defs = STATE_MEASURES[p.id];
  if (!defs || !p.levels.includes("state")) return [];
  const per = areaOptions(p.id).map((state) => ({ state, r: readAll([p], { state }, mode, feeds, audience)[p.id] ?? {} }));
  return defs.flatMap((d) => {
    const kpi = kpisFor(p, audience).find((k) => k.id === d.kpi);
    if (!kpi) return [];
    const rows = per.flatMap(({ state, r }) => {
      const v = r[d.kpi]?.value;
      return v?.kind === "figure" ? [{ state, value: v.value }] : [];
    });
    return rows.length ? [{ kpi, label: d.label, rows }] : [];
  });
}

/** A programme's KPIs this viewer may see that have a reading for the scope. */
export function shownKpis(p: PortalDashboard, viewing: Viewing, readings: Readings, scope: AreaScope): KpiDefinition[] {
  const level = scope.district ? "district" : scope.state ? "state" : "national";
  const r = readings[p.id] ?? {};
  return kpisFor(p, viewing.audience).filter((k) => levelsOf(k, p).includes(level) && r[k.id]);
}

/* ── One figure from any reading ──────────────────────────────────────────── */

export interface Headline {
  value: number;
  unit: KpiUnit;
  /** What the figure is, where it is one part of the reading: "B.E. 2026-27". */
  qualifier?: string;
}

/**
 * The single figure a reading stands for, or nothing where it has none. A breakdown of
 * counts is its total; a breakdown of shares has no total, and a table has no one figure.
 */
export function headlineOf(kpi: KpiDefinition, reading: KpiReading): Headline | null {
  const v = reading.value;
  switch (v.kind) {
    case "figure":
      return { value: v.value, unit: kpi.unit };
    case "areas":
      return { value: v.total, unit: kpi.unit };
    case "pair":
      return { value: v.items[0].value, unit: v.items[0].unit, qualifier: v.items[0].label };
    case "breakdown": {
      const unit = v.unit ?? kpi.unit;
      if (unit === "percent") return null;
      return { value: Math.round(v.items.reduce((t, i) => t + i.value, 0) * 100) / 100, unit };
    }
    case "series": {
      const s = v.series[0];
      if (!s) return null;
      for (let i = v.labels.length - 1; i >= 0; i--) {
        if (!s.pending?.includes(i)) return { value: s.data[i] ?? 0, unit: kpi.unit, qualifier: `${s.name} ${v.labels[i]}` };
      }
      return null;
    }
    case "stages":
      return v.stages[0] ? { value: v.stages[0].value, unit: kpi.unit, qualifier: v.stages[0].label } : null;
    default:
      return null;
  }
}

export const formatHeadline = (h: Headline) => formatKpi(h.value, h.unit);

/* ── The programmes' headline KPIs ─────────────────────────────────────────── */

/**
 * The one public KPI that leads each programme: the first a citizen would ask about. Chosen
 * here, not in the register, because it is an editorial decision about this dashboard.
 */
export const HEADLINE_KPI: Record<PortalId, string> = {
  "smile-beggary": "smile-beggary.identified",
  nmba: "nmba.outreach",
  "e-utthaan": "e-utthaan.allocation",
  shreshta: "shreshta.beneficiaries",
  "senior-citizens": "senior-citizens.ipsrc.beneficiaries",
};

/**
 * The name a programme goes by on its tile, its button and every label that names it — ONE
 * name per programme across the page (instruction, 6 Oct 2026: one label, one wording). SMILE
 * – Beggary as the sheet's tab and the portal list name it; Senior Citizens Welfare as the
 * register names the programme.
 */
export const SHORT_NAME: Record<PortalId, string> = {
  "smile-beggary": "SMILE – Beggary",
  nmba: "NMBA",
  "e-utthaan": "DAPSC",
  shreshta: "SHRESHTA",
  "senior-citizens": "Senior Citizens Welfare",
};

/**
 * One glyph per programme, so a chip or a tile can be told apart at a glance: three of the
 * five programmes carry the State Emblem as their mark, which names the Department, not the
 * programme.
 */
export const PROGRAMME_ICON: Record<PortalId, string> = {
  "smile-beggary": "diversity_3",
  nmba: "health_and_safety",
  "e-utthaan": "account_balance",
  shreshta: "school",
  "senior-citizens": "elderly",
};

/* ── Funds: spent against what was provided ────────────────────────────────── */

export interface FundsRow {
  programme: PortalId;
  label: string;
  /** The component's full name, as the register gives it — for a reader who does not know "RVY". */
  fullName?: string;
  spent: number;
  provided: number;
  /** "Expenditure of B.E." — what the two figures are, in the register's words. */
  measure: string;
  origin: ValueOrigin;
  kpiId: string;
}

/**
 * Every pair of fund figures that are the same programme's, the same period's and the same
 * source's — never a numerator from one reading and a denominator from another
 * (`live-data-fallback.md`: the 138% that shipped once).
 */
export function fundsRows(viewing: Viewing, readings: Readings): FundsRow[] {
  const rows: FundsRow[] = [];
  for (const p of viewing.programmes) {
    const r = readings[p.id] ?? {};
    const fig = (id: string): number | null => {
      const x = r[id];
      if (!x) return null;
      const v = x.value;
      return v.kind === "figure" ? v.value : v.kind === "areas" ? v.total : null;
    };
    const originOf = (...ids: string[]): ValueOrigin => {
      const os = ids.map((id) => r[id]?.origin);
      return os.includes("modelled") ? "modelled" : os.includes("snapshot") ? "snapshot" : "live";
    };
    if (p.id === "smile-beggary") {
      const released = fig("smile-beggary.fund-released");
      const utilised = fig("smile-beggary.fund-utilised");
      if (released && utilised != null)
        rows.push({ programme: p.id, label: "SMILE – Beggary", spent: utilised, provided: released, measure: "Utilised of Released", origin: originOf("smile-beggary.fund-released", "smile-beggary.fund-utilised"), kpiId: "smile-beggary.fund-utilised" });
    }
    if (p.id === "e-utthaan") {
      const alloc = r["e-utthaan.allocation"]?.value;
      const exp = r["e-utthaan.expenditure"]?.value;
      if (alloc?.kind === "series" && exp?.kind === "series") {
        const i = alloc.labels.length - 1;
        const be = alloc.series[0]?.data[i];
        const spent = exp.series[0]?.data[i];
        if (be && spent != null)
          rows.push({ programme: p.id, label: `DAPSC ${alloc.labels[i]}`, spent, provided: be, measure: "Expenditure of B.E.", origin: originOf("e-utthaan.allocation", "e-utthaan.expenditure"), kpiId: "e-utthaan.expenditure" });
      }
    }
    if (p.id === "senior-citizens") {
      for (const k of p.kpis.filter((k) => k.id.endsWith(".budget"))) {
        const base = k.id.replace(/\.budget$/, "");
        const budget = fig(k.id);
        const spent = fig(`${base}.expenditure`) ?? fig(`${base}.released`);
        if (budget && spent != null)
          rows.push({
            programme: p.id,
            label: `Senior Citizens · ${COMPONENT_SHORT[base.split(".")[1] ?? ""] ?? k.component}`,
            fullName: k.component,
            spent,
            provided: budget,
            measure: r[`${base}.expenditure`] ? "Expenditure of B.E." : "Released of B.E.",
            origin: originOf(k.id, `${base}.expenditure`),
            kpiId: `${base}.expenditure`,
          });
      }
    }
  }
  return rows;
}

/** The Senior Citizens components by the names their own documents use. */
export const COMPONENT_SHORT: Record<string, string> = {
  ipsrc: "IP-SrC",
  sapsrc: "SAPSrC",
  rvy: "RVY",
  "pm-special": "PM-SPECIAL",
  elderline: "Elderline (14567)",
  sage: "SAGE",
  other: "Other Initiatives",
};

/**
 * A KPI'S LABEL, ONE EXPRESSION FOR THE WHOLE PAGE: its name in the sheet's words, and for a
 * Senior Citizens Welfare KPI the component it belongs to — "Total Number of Beneficiaries
 * Covered · IP-SrC". The hero, a tile, the map, the State/UT panel and the officer page all
 * call this, so one KPI cannot read three ways (instruction, 6 Oct 2026; it read "people
 * reached", "People Reached" and "people reached, cumulative since launch" for one figure).
 */
export function kpiLabel(k: KpiDefinition): string {
  const component = k.component ? COMPONENT_SHORT[k.id.split(".")[1] ?? ""] : undefined;
  return component ? `${k.name} · ${component}` : k.name;
}

/* ── Readiness: what each KPI's figure can come from ──────────────────────── */

export type Readiness = "live" | "available" | "partial" | "none" | "not-stated";

export const READINESS_LABEL: Record<Readiness, string> = {
  live: "Live on This Dashboard",
  available: "API Available",
  partial: "API Partial",
  none: "No API",
  "not-stated": "Not Yet Stated",
};

export const READINESS_TONE: Record<Readiness, "success" | "info" | "warning" | "danger" | "neutral"> = {
  live: "success",
  available: "info",
  partial: "warning",
  none: "danger",
  "not-stated": "neutral",
};

/** A KPI is live when the dashboard's own reading of it came from the feed. */
export function readinessOf(kpi: KpiDefinition, reading: KpiReading | undefined): Readiness {
  if (reading?.origin === "live") return "live";
  return kpi.api?.coverage ?? "not-stated";
}

/* ── Themes ────────────────────────────────────────────────────────────────── */

/** Themes in the order a reader meets them, each with the categories it gathers. */
export const THEMES: { id: string; title: string; question: string; categories: KpiCategory[] }[] = [
  { id: "people", title: "People Reached", question: "Who the programmes reach, and where.", categories: ["coverage", "geography"] },
  { id: "funds", title: "Funds", question: "What was provided, and how much of it has been spent.", categories: ["funds"] },
  { id: "results", title: "Results", question: "What the support has achieved, and how it is changing.", categories: ["outcomes", "trends", "digital"] },
  { id: "service", title: "Service", question: "How applications move, and how long each step takes.", categories: ["workflow", "turnaround", "onboarding"] },
  { id: "accountability", title: "Accountability", question: "Deficiencies raised, and the health of the systems behind the figures.", categories: ["deficiency", "system", "monitoring"] },
];

export function themeOf(category: KpiCategory): string {
  return THEMES.find((t) => t.categories.includes(category))?.id ?? "results";
}

/**
 * DAPSC'S ALLOCATION AND EXPENDITURE, ONE CHART (design review, 7 Oct 2026). The sheet keeps
 * them as two KPIs, and two cards made the reader compare budgeted and spent across a gap.
 * Allocation is budgeted twice a year (B.E., then R.E.); expenditure is the one amount spent.
 * Drawn together, each year shows all three side by side. The sheet's names are kept; the
 * combined title joins them. A year with no R.E. yet draws no bar for it (`not-due`).
 */
const FUNDS_PAIR = { allocation: "e-utthaan.allocation", expenditure: "e-utthaan.expenditure", into: "e-utthaan.funds" } as const;

export function mergeFundCharts(kpis: KpiDefinition[], reading: PortalReading): { kpis: KpiDefinition[]; reading: PortalReading } {
  const a = kpis.find((k) => k.id === FUNDS_PAIR.allocation);
  const e = kpis.find((k) => k.id === FUNDS_PAIR.expenditure);
  const ra = reading[FUNDS_PAIR.allocation];
  const re = reading[FUNDS_PAIR.expenditure];
  if (!a || !e || ra?.value.kind !== "series" || re?.value.kind !== "series") return { kpis, reading };
  const spent = re.value.series[0];
  if (!spent || spent.data.length !== ra.value.labels.length) return { kpis, reading };
  const last = ra.value.labels.length - 1;
  const merged: KpiDefinition = {
    ...a,
    id: FUNDS_PAIR.into,
    name: "Total DAPSC Allocation and Expenditure (B.E. and R.E.)",
    definition: "Allocation for the welfare of Scheduled Castes, as budgeted (B.E.) and revised (R.E.), and the amount spent, by financial year.",
    span: 12,
  };
  const value: KpiValue = {
    kind: "series",
    chart: "bar",
    labels: ra.value.labels,
    series: [...ra.value.series, { name: "Expenditure", data: spent.data }],
    note: `${ra.value.labels[last]}: R.E. not yet framed; expenditure up to 30 Sep 2026.`,
  };
  return {
    kpis: kpis.flatMap((k) => (k.id === FUNDS_PAIR.allocation ? [merged] : k.id === FUNDS_PAIR.expenditure ? [] : [k])),
    reading: { ...reading, [FUNDS_PAIR.into]: { ...ra, value, origin: ra.origin === "modelled" || re.origin === "modelled" ? "modelled" : ra.origin } },
  };
}
