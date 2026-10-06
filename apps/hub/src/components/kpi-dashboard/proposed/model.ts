import { formatKpi } from "@/lib/kpi/format";
import { canSeePortal, type OfficerRole } from "@/lib/kpi/access";
import { resolveReading, type DataModeName, type PortalFeed } from "@/lib/kpi/live";
import { PROGRAMMES, kpisFor, levelsOf } from "@/lib/kpi/register";
import type {
  AreaScope,
  KpiCategory,
  KpiDefinition,
  KpiReading,
  KpiUnit,
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

export function viewingFor(role: OfficerRole | undefined): Viewing {
  return {
    role,
    audience: role ? "officer" : "public",
    programmes: PROGRAMMES.filter((p) => !role || canSeePortal(role, p.id)),
  };
}

export type Readings = Partial<Record<PortalId, PortalReading>>;

export function readAll(
  programmes: PortalDashboard[],
  scope: AreaScope,
  mode: DataModeName,
  feeds: Partial<Record<PortalId, PortalFeed>>,
): Readings {
  return Object.fromEntries(programmes.map((p) => [p.id, resolveReading(p.id, scope, mode, feeds[p.id])]));
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

/** "SMILE", "NMBA", "DAPSC", "SHRESHTA", "Senior Citizens" — the name on a chip. */
export const SHORT_NAME: Record<PortalId, string> = {
  "smile-beggary": "SMILE",
  nmba: "NMBA",
  "e-utthaan": "DAPSC",
  shreshta: "SHRESHTA",
  "senior-citizens": "Senior Citizens",
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
  ipsrc: "IPSrC",
  sapsrc: "SAPSrC",
  rvy: "RVY",
  "pm-special": "PM-SPECIAL",
  elderline: "Elderline 14567",
  sage: "SAGE",
  other: "Other Initiatives",
};

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
