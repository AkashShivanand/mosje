"use client";

/* ============================================================================
   SMILE admin dashboard charts.

   These are portal-level *compositions* over the design-system chart layer —
   they bind SMILE's mock-data shapes to `@mosje/design-system` components and
   nothing else. There is no charting logic here, and there must never be
   again: this file previously wrapped Recharts, which put a second, ungoverned
   charting stack inside the estate with no `ChartFrame`, no screen-reader
   table and no keyboard model. The DS components were written to absorb it
   (see the doc comments on BarChart, LineChart and IndiaMap) and this is that
   migration landing.

   Series colours come from `categoricalColor`, never from a semantic or brand
   token. The Recharts version reached for `--sa-chart-trend-up` and
   `--sa-color-brand-navy` as series colours, which made an arbitrary series
   read as "good" — the collision the chart palette contract forbids.
   ============================================================================ */

import { BarChart, DonutChart, LineChart, categoricalColor } from "@mosje/design-system";

/**
 * Stable slot assignment for SMILE's three recurring activity series.
 *
 * Slot 3 is deliberately skipped: `--sa-chart-cat-3` is `#046a38`, which is
 * byte-identical to `--sa-chart-trend-up`. Using it would put the semantic
 * "good" green back on an arbitrary series by a different route. Slots 1, 5
 * and 2 are blue / teal / orange — mutually distinct and none of them a
 * semantic ink.
 */
const SERIES_COLOR = {
  identified: categoricalColor(0), // cat-1  #0373df
  mobilised: categoricalColor(4), // cat-5  #0e7490
  rehabilitated: categoricalColor(1), // cat-2  #e1560f
} as const;

const AGE_COLOR = categoricalColor(0);
const TYPE_COLOR = categoricalColor(1);
const SHELTER_COLOR = categoricalColor(5);

export function GenderDonut({
  data,
}: {
  data: { name: string; value: number; color: string }[];
}) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  return (
    <DonutChart
      title="Beneficiaries by gender"
      data={data.map((d) => ({ label: d.name, value: d.value, color: d.color }))}
      center={total.toLocaleString("en-IN")}
      centerSub="total"
    />
  );
}

export function AgeBars({ data }: { data: { band: string; value: number }[] }) {
  return (
    <BarChart
      title="Beneficiaries by age band"
      orientation="horizontal"
      /* These sit in a ~260px column. The viewBox aspect drives the rendered
         height, so the 480×240 default squashed them to half their old size. */
      width={320}
      height={260}
      data={data.map((d) => ({ label: d.band, value: d.value, color: AGE_COLOR }))}
    />
  );
}

export function TypeBars({ data }: { data: { type: string; value: number }[] }) {
  return (
    <BarChart
      title="Beneficiaries by type"
      orientation="horizontal"
      width={320}
      height={260}
      data={data.map((d) => ({ label: d.type, value: d.value, color: TYPE_COLOR }))}
    />
  );
}

export function ActivityLine({
  data,
  series,
}: {
  data: { date: string; identified: number; mobilised: number; rehabilitated: number }[];
  series: "identified" | "mobilised" | "rehabilitated";
}) {
  const label = series.charAt(0).toUpperCase() + series.slice(1);
  return (
    <LineChart
      title={`Daily survey activity — ${label.toLowerCase()}`}
      area
      height={240}
      /* Dates arrive ISO; the axis wants day-and-month, not the year. */
      labels={data.map((d) => d.date.slice(5))}
      series={[{ name: label, data: data.map((d) => d[series]), color: SERIES_COLOR[series] }]}
    />
  );
}

export function ShelterStateBars({ data }: { data: { state: string; count: number }[] }) {
  return (
    <BarChart
      title="Shelter homes by state"
      /* 18 long state names collide as x-axis labels at any dashboard width;
         horizontal is the readable encoding for many long categories. */
      orientation="horizontal"
      width={480}
      height={560}
      /* Ranked, because both captions promise a ranking ("Top states by
         operational shelter capacity"). The alphabetical order was only
         survivable while the old chart's labels were too crowded to read.
         NOTE: SHELTER_HOMES_BY_STATE is 16 zeros out of 18 — the chart is
         readable now but the mock data still needs real values. */
      data={[...data]
        .sort((a, b) => b.count - a.count)
        .map((d) => ({ label: d.state, value: d.count, color: SHELTER_COLOR }))}
    />
  );
}

export function MonthlyPerf({
  data,
}: {
  data: { month: string; identified: number; mobilised: number; rehab: number }[];
}) {
  return (
    <LineChart
      title="Monthly performance"
      height={300}
      labels={data.map((d) => d.month)}
      series={[
        { name: "Identified", data: data.map((d) => d.identified), color: SERIES_COLOR.identified },
        { name: "Mobilised", data: data.map((d) => d.mobilised), color: SERIES_COLOR.mobilised },
        { name: "Rehabilitated", data: data.map((d) => d.rehab), color: SERIES_COLOR.rehabilitated },
      ]}
    />
  );
}
