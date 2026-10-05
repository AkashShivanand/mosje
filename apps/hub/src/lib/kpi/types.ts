/**
 * The KPI contract every portal dashboard on the estate reads.
 *
 * WHERE THE SHAPE COMES FROM. `SAMAVESH_KPI_Data_Collection_Proforma` (Google Sheet,
 * read 5 Oct 2026) asks each portal for the same eleven columns — KPI Type, Category,
 * Name, Definition, Unit, Data Source System, Update Frequency, Calculation Logic,
 * Information Captured on Portal, Remarks. `KpiDefinition` carries all of them, so a
 * portal's sheet can be transcribed row for row and an API can later be mapped onto
 * the same keys.
 *
 * WHAT THE SHEET DOES NOT CARRY, AND WHY IT IS HERE ANYWAY. A dashboard "by portal and
 * by role" needs three things the proforma never asks for: the geography a figure can
 * be broken down by (`levels`), the shape of the reading (`KpiValue["kind"]`), and the
 * audience in one fixed vocabulary (the sheet's tabs spell it four different ways).
 * Each is stated per KPI below and listed in `docs/audit/kpi-dashboard-proforma-gaps.md`
 * as a column the proforma should gain.
 */

/** The proforma's "KPI Type", normalised. "Both" in the proforma means public. */
export type KpiAudience = "public" | "officer";

/**
 * The proforma's "KPI Category", normalised to one fixed list.
 *
 * The proforma's dropdown offers five categories; the SMILE – Beggary tab uses eleven.
 * This is the union, in the order a reader meets them on a dashboard.
 */
export type KpiCategory =
  | "coverage"
  | "geography"
  | "funds"
  | "outcomes"
  | "trends"
  | "digital"
  | "workflow"
  | "turnaround"
  | "deficiency"
  | "system"
  | "monitoring"
  | "onboarding";

/** Geography a figure can be read at. A KPI with no `state` level is national only. */
export type AreaLevel = "national" | "state" | "district";

/** The area a reading is taken for. Absent fields widen the scope. */
export interface AreaScope {
  state?: string;
  district?: string;
}

export type KpiFrequency = "Real-time" | "Daily" | "Weekly" | "Monthly" | "Quarterly" | "Bi-annual" | "Annual";

/** The unit a number is read in. The proforma's "Unit of Measurement" is free text; these are its values. */
export type KpiUnit = "number" | "crore" | "percent" | "days";

export interface KpiDefinition {
  /** Stable id, `<portal>.<slug>`. The key an API reading will be mapped onto. */
  id: string;
  /** The proforma's S. No., so a row can be found in the source sheet. */
  sNo: number;
  audience: KpiAudience;
  category: KpiCategory;
  /** The proforma's KPI Name, Title Case. */
  name: string;
  /** The proforma's "KPI Definition (what it measures)". Absent where the portal has not supplied one. */
  definition?: string;
  unit: KpiUnit;
  /** The proforma's "Data Source System". */
  source?: string;
  frequency?: KpiFrequency;
  /** The proforma's "Calculation Logic / Formula". */
  formula?: string;
  /** The proforma's "Information Captured on Portal": whether the portal already shows it. */
  onPortal?: boolean;
  /** The proforma's remarks, kept for the KPI register. Never shown to a citizen. */
  remarks?: string;
  /** The finest geography this KPI can be read at. Defaults to the portal's. */
  levels?: AreaLevel[];
  /** Grid width on a 12-column dashboard. Charts take more than a figure. */
  span?: 3 | 4 | 6 | 8 | 12;
}

export type PortalId = "smile-beggary" | "nmba" | "e-utthaan" | "shreshta";

export interface PortalDashboard {
  id: PortalId;
  /** The URL segment, `/website/dashboard/<slug>`. Equal to `id`. */
  slug: PortalId;
  /** The scheme or programme, as the Department names it. */
  name: string;
  /** The portal the figures come from. */
  portal: string;
  /** The body that runs the portal. */
  owner: string;
  /** One sentence, in the Department's register, saying what the scheme does. */
  summary: string;
  /** `OrgLogo` registry path for the mark. */
  logoPath: string;
  /** The portal in the hub. */
  portalHref: string;
  /** Geography the portal publishes at all. A DAPSC figure has no state. */
  levels: AreaLevel[];
  /** The tracker's "Date KPI Received", DD.MM.YYYY. */
  kpisReceived: string;
  /** The financial year and cut-off the figures describe. */
  period: string;
  kpis: KpiDefinition[];
}

/* ── Readings ─────────────────────────────────────────────────────────────── */

/**
 * Where ONE value came from.
 *
 * `live` is the portal's own feed, read on the day shown (NMBA, since 5 Oct 2026).
 * `snapshot` is a figure a Department system has published, mirrored on a stated date.
 * `modelled` is illustrative: derived by a stated rule, consistent with every other
 * figure on the dashboard, and never a departmental figure.
 */
export type ValueOrigin = "live" | "snapshot" | "modelled";

export interface Labelled {
  label: string;
  value: number;
}

export interface AreaRow {
  /** State or district name, matching `IndiaMap`'s spelling for states. */
  area: string;
  value: number;
}

export type KpiValue =
  | { kind: "figure"; value: number }
  /** Two figures read together, e.g. shelters and their bed capacity. */
  | { kind: "pair"; items: [Labelled & { unit: KpiUnit }, Labelled & { unit: KpiUnit }] }
  /** `unit` overrides the KPI's where the parts are counted differently, e.g. a share drawn from counts. */
  | { kind: "breakdown"; items: Labelled[]; chart: "donut" | "bar"; unit?: KpiUnit }
  | {
      kind: "series";
      labels: string[];
      /** `pending` lists label indices a series has no figure for yet — drawn as "not reported", never as 0. */
      series: { name: string; data: number[]; pending?: number[] }[];
      chart: "line" | "bar";
    }
  | { kind: "stages"; stages: Labelled[] }
  /** One figure for the scope, and the same figure for each area inside it. */
  | { kind: "areas"; total: number; rows: AreaRow[] }
  | { kind: "table"; columns: string[]; rows: (string | number)[][] };

export interface KpiReading {
  value: KpiValue;
  origin: ValueOrigin;
  /** For `snapshot`: who published it. */
  source?: string;
  /** For `snapshot`: DD.MM.YYYY. */
  asOn?: string;
}

/** Everything one portal publishes for one area. A KPI absent here is not published for that area. */
export type PortalReading = Partial<Record<string, KpiReading>>;
