/**
 * THE SHAPE OF A KPI READING — what a dashboard figure IS, independent of which portal sends
 * it. Moved here from the website dashboard's KPI register (`apps/hub/src/lib/kpi/types.ts`,
 * Oct 2026) so any dashboard on the estate can hand a reading to `KpiView` and get the chart
 * that fits its shape. The register re-exports these; it keeps everything that is about the
 * Department's own KPIs (audience, category, API coverage).
 */

/** The unit a number is read in. */
export type KpiUnit = "number" | "crore" | "percent" | "days";

/**
 * Where ONE value came from.
 *
 * `live` is the portal's own feed, read on the day shown. `received` is a figure the
 * Department supplied by hand — a report, a spreadsheet, a letter — entered exactly as
 * received. `snapshot` is a figure a Department system has published, mirrored on a stated
 * date. `modelled` is illustrative: derived by a stated rule, and never a departmental figure.
 */
export type ValueOrigin = "live" | "received" | "snapshot" | "modelled";

export interface Labelled {
  label: string;
  value: number;
}

export interface AreaRow {
  /** State or district name, matching `IndiaMap`'s spelling for States/UTs. */
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
      /** One line under the chart, for what a label cannot say ("2026-27: spent to 30 Sep"). */
      note?: string;
    }
  | { kind: "stages"; stages: Labelled[] }
  /** One figure for the scope, and the same figure for each area inside it. */
  | { kind: "areas"; total: number; rows: AreaRow[] }
  | {
      kind: "table";
      columns: string[];
      rows: (string | number)[][];
      /**
       * A column holding a signed difference against a MINIMUM: drawn as "Meets, +0.8 pp" or
       * "Short by 0.7 pp", in words with an icon, so the colour follows compliance and not the
       * sign alone.
       */
      againstMinimum?: { column: number; header: string; unit: string };
    };

export interface KpiReading {
  value: KpiValue;
  origin: ValueOrigin;
  /** Who published it. */
  source?: string;
  /** DD.MM.YYYY. */
  asOn?: string;
}

/** What `KpiView` needs to know about a KPI to draw it. A register's own KPI type is wider. */
export interface KpiSpec {
  /** Stable id — also the export file name. */
  id: string;
  /** Title Case; the card's title. */
  name: string;
  unit: KpiUnit;
  /** What it measures; the card's subtitle. */
  definition?: string;
  /** Grid width on a 12-column dashboard. @default 6 */
  span?: 3 | 4 | 6 | 8 | 12;
  /** Its breakdown's parts add up to a meaningful whole, so a total leads it. */
  totalled?: boolean;
}
