"use client";

import * as React from "react";

import {
  AreaChart,
  BarChart,
  ChartCard,
  ComboChart,
  DataTable,
  DonutChart,
  FunnelChart,
  Gauge,
  Heatmap,
  IndiaMap,
  KpiRow,
  LineChart,
  MetricCard,
  PieChart,
  Progress,
  RankedBarList,
  ScatterChart,
  Sparkline,
  categoricalColor,
} from "@mosje/design-system";

import { Callout, StatusBadge } from "@/components/design-system/docs-kit";
import { Specimen, SpecimenGrid, Rule, h2Style, leadStyle } from "./viz-kit";
import {
  AGE_BANDS,
  AGENCIES,
  COMPLIANCE_MATRIX,
  DAILY_REGISTRATIONS,
  DISBURSEMENT,
  GENDER,
  PIPELINE,
  SCHEME_FUNDS,
  SOCIAL_CATEGORY,
  STATE_COVERAGE,
  THROUGHPUT,
  UPTAKE_VS_INCOME,
  formatCrore,
  formatPct,
  rupeesToCrore,
  type AgencyRow,
} from "@/lib/design-system/viz-samples";

import "./data-visualisation.css";

export function DataVisualisationContent(): React.JSX.Element {
  return (
    <>
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div style={{ marginBottom: "var(--sa-stack-32)" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--sa-stack-12)",
            marginBottom: "var(--sa-stack-12)",
          }}
        >
          <h1 style={{ fontSize: "var(--sa-type-display-1-size)", fontWeight: "var(--sa-font-weight-medium)", lineHeight: "var(--sa-type-display-1-lh)" }}>
            Data Visualisation
          </h1>
          <StatusBadge status="Beta" />
        </div>
        <p
          style={{
            fontSize: "var(--sa-type-headline-2-size)",
            fontWeight: "var(--sa-font-weight-regular)",
            color: "var(--sa-color-text-default)",
            maxWidth: "var(--sa-container-measure)",
            lineHeight: "var(--sa-type-headline-2-lh)",
          }}
        >
          Every chart, metric, table and container in one place — rendered live, so a
          designer and a developer are looking at the same thing.
        </p>
      </div>

      <Callout type="info" title="What the numbers are">
        Illustrative figures in real Government-of-India shapes: ₹ crore, an April–March
        fiscal year, census age bands, social-category splits. They are not published
        statistics. Real shapes matter for a specimen because charts fail on the shape of
        data rather than its truth — nine-digit rupee values are what break axis padding,
        and a withheld cell is what breaks a total.
      </Callout>

      {/* ── Charts ─────────────────────────────────────────────────────── */}
      <h2 id="charts" style={{ ...h2Style, marginTop: "var(--sa-section-48)" }}>
        Charts
      </h2>
      <p style={leadStyle}>
        Thirteen components, and the list stops there deliberately. Each one has a fixed
        encoding — there is no general <code>encoding</code> prop, because a grammar that
        can express any chart can express a misleading one. Waterfall, sankey, treemap and
        radar are recipes composed from the same toolkit, not supported components.
      </p>
      <Rule>
        Every chart is two renderings of one data contract: the visual, and a
        screen-reader table generated from the same values. The table is not a fallback.
        Tab into any chart below and the data points take focus in order.
      </Rule>

      <SpecimenGrid>
        <Specimen
          name="Bar — grouped"
          answers="How does a quantity compare across categories, split by a second dimension?"
          notFor="More than four series. Past that the groups stop reading as groups."
        >
          <BarChart
            title="Allocation against utilisation by scheme, FY 2025–26"
            labels={SCHEME_FUNDS.labels}
            series={[
              { name: "Allocated", data: SCHEME_FUNDS.allocated },
              { name: "Utilised", data: SCHEME_FUNDS.utilised },
            ]}
            valueFormat={formatCrore}
            height={300}
          />
        </Specimen>

        <Specimen
          name="Bar — horizontal"
          answers="The same question, when the category names are long or numerous."
          notFor="Time. A horizontal axis of dates reads as unordered categories."
        >
          <BarChart
            title="Beneficiaries by age band"
            orientation="horizontal"
            data={AGE_BANDS}
            width={420}
            height={300}
          />
        </Specimen>

        <Specimen
          name="Line"
          answers="How has a quantity changed over time, and do two series diverge?"
          notFor="Unordered categories — a line between them implies a progression that is not there."
        >
          <LineChart
            title="Applications received against cleared, monthly"
            labels={THROUGHPUT.labels}
            series={[
              { name: "Received", data: THROUGHPUT.received },
              { name: "Cleared", data: THROUGHPUT.cleared },
            ]}
            height={280}
          />
        </Specimen>

        <Specimen
          name="Area"
          answers="Change over time where the quantity genuinely accumulates."
          notFor="Non-cumulative measures. A filled area asserts a running total whether or not one exists."
        >
          <AreaChart
            title="Applications cleared, monthly"
            labels={THROUGHPUT.labels}
            series={[{ name: "Cleared", data: THROUGHPUT.cleared }]}
            height={280}
          />
        </Specimen>

        <Specimen
          name="Combo"
          answers="A count and a rate together, when they share a time axis but not a unit."
          notFor="Two measures of the same kind — that is a second line, not a second axis."
        >
          <ComboChart
            title="Disbursement against target achievement"
            labels={DISBURSEMENT.labels}
            bars={[{ name: "Disbursed (₹ Cr)", data: DISBURSEMENT.disbursed }]}
            lines={[{ name: "Target met (%)", data: DISBURSEMENT.targetPct }]}
            leftLabel="₹ crore"
            rightLabel="%"
            height={300}
          />
        </Specimen>

        <Specimen
          name="Scatter"
          answers="Are two quantities related across a population of places or agencies?"
          notFor="Implying causation. The chart shows association and nothing more."
        >
          <ScatterChart
            title="Scheme uptake against per-capita income by state"
            series={[{ name: "State", points: UPTAKE_VS_INCOME }]}
            xLabel="Per-capita income index"
            yLabel="Coverage %"
            height={300}
          />
        </Specimen>

        <Specimen
          name="Donut"
          answers="What is a whole made of, when the total itself is worth stating?"
          notFor="More than six slices, or any breakdown where a remainder exceeds a quarter."
        >
          <DonutChart
            title="Beneficiaries by gender"
            data={GENDER}
            center={(1_606_900).toLocaleString("en-IN")}
            centerSub="total"
          />
        </Specimen>

        <Specimen
          name="Pie"
          answers="The same question where the total needs no restating."
          notFor="Comparing slices of similar size — angle is the weakest comparison the eye makes."
        >
          <PieChart title="Beneficiaries by social category" data={SOCIAL_CATEGORY} />
        </Specimen>

        <Specimen
          name="Funnel"
          answers="How far through a process does a population get, and where does it fall away?"
          notFor="Unordered stages, or any sequence that can increase between steps."
        >
          <FunnelChart
            title="Application pipeline, FY 2025–26"
            stages={PIPELINE}
          />
        </Specimen>

        <Specimen
          name="Heatmap"
          answers="How dense is a measure across two dimensions at once?"
          notFor="A single dimension. That is a bar chart, and a bar chart reads faster."
        >
          <Heatmap
            title="Utilisation-certificate compliance by scheme and quarter"
            xLabels={COMPLIANCE_MATRIX.xLabels}
            yLabels={COMPLIANCE_MATRIX.yLabels}
            matrix={COMPLIANCE_MATRIX.matrix}
            valueFormat={formatPct}
          />
        </Specimen>

        <Specimen
          name="Choropleth"
          answers="Where is something happening, as a rate across states and union territories?"
          notFor="Raw counts. A count map renders population, not the phenomenon."
          span={2}
        >
          <IndiaMap
            title="Scheme coverage rate by state"
            data={STATE_COVERAGE}
            valueFormat={formatPct}
          />
        </Specimen>

        <Specimen
          name="Gauge"
          answers="One bounded value against its ceiling, when the ceiling is the point."
          notFor="Unbounded counts, or any value whose maximum is arbitrary."
        >
          <Gauge title="Fund utilisation" value={79} max={100} unit="of allocation" valueFormat={formatPct} />
        </Specimen>

        <Specimen
          name="Sparkline"
          answers="The shape of a trend beside the number it belongs to — never on its own."
          notFor="Standing alone. Without an adjacent value it has no scale and says nothing."
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--sa-inline-16)",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontSize: "var(--sa-type-headline-1-size)",
                fontWeight: "var(--sa-font-weight-semibold)",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              3,140
            </span>
            <Sparkline
              data={DAILY_REGISTRATIONS}
              label="Daily registrations, last 14 days"
              fill
              width={160}
              height={44}
            />
          </div>
        </Specimen>

        <Specimen
          name="Progress"
          answers="Completion against a target, inline and at small size."
          notFor="Comparison. Two progress bars side by side is a bar chart wearing a disguise."
        >
          <div style={{ display: "grid", gap: "var(--sa-stack-16)" }}>
            <Progress label="Scholarships disbursed" value={89} showValue />
            <Progress label="PM-AJAY utilisation" value={79} showValue target={85} />
            <Progress label="NSFDC utilisation" value={84} showValue color={categoricalColor(4)} />
          </div>
        </Specimen>

        <Specimen
          name="Ranked list"
          answers="Which categories lead, and by how much — with the figure printed per row and the bar as the aid."
          notFor="Several series across the same categories; that is a grouped bar chart."
        >
          <RankedBarList
            title="Scheme coverage rate by state, ranked"
            items={STATE_COVERAGE.slice(0, 6).map((s) => ({ label: s.state, value: s.value }))}
            max={100}
            valueFormat={(n) => `${n}%`}
          />
        </Specimen>
      </SpecimenGrid>

      {/* ── Metrics ────────────────────────────────────────────────────── */}
      <h2 id="metrics" style={h2Style}>
        Metrics and KPI
      </h2>
      <p style={leadStyle}>
        There are five genuine variants of showing one number, separated by what else the
        reader needs. They are not sizes of the same card.
      </p>
      <Rule>
        A KPI card becomes a chart the moment the reader has to compare more than two
        numbers. And a comparison without a named baseline — against last period, against
        target, against a peer state — is not a comparison; it is a decoration.
      </Rule>

      <SpecimenGrid>
        <Specimen name="Bare value" answers="A count or amount where formatting is the entire component.">
          <MetricCard label="Beneficiaries reached" value={(1_606_900).toLocaleString("en-IN")} />
        </Specimen>

        <Specimen
          name="Value with comparison"
          answers="A number against a stated baseline — the variant that carries most of the weight on a board."
          notFor="Any use where the baseline is left unnamed."
        >
          <MetricCard
            label="Applications cleared"
            value={(16_740).toLocaleString("en-IN")}
            changeValue="+7.2%"
            changeDirection="up"
            changeLabel="vs October"
          />
        </Specimen>

        <Specimen
          name="Value against target"
          answers="A bounded measure with a denominator that matters — drawn as a bar, because the reader's question is how far there is to go."
        >
          <MetricCard
            label="Fund utilisation"
            value="79%"
            changeValue="−4 pts"
            changeDirection="down"
            changeLabel="vs FY 2024–25"
            progress={{ value: 79, max: 100, target: 85, targetLabel: "Target 85%" }}
          />
        </Specimen>

        <Specimen
          name="Value with status"
          answers="A figure the scheme has judged against a stated threshold. The chip carries the words; the tone carries the colour."
          notFor="A tone with no stated rule. Red means breached on this estate."
        >
          <MetricCard
            label="Overdue applications"
            value="54"
            tone="danger"
            status={{ label: "Above limit", tone: "danger" }}
            changeValue="14.5%"
            changeDirection="up"
            changeLabel="vs last month"
          />
        </Specimen>

        <Specimen
          name="Row of metrics"
          answers="The standard opening of a board: three to five numbers, one baseline each."
          span={2}
        >
          <KpiRow
            items={[
              { label: "Applications received", value: (128_400).toLocaleString("en-IN"), changeValue: "+12.4%", changeDirection: "up", changeLabel: "vs prior FY" },
              { label: "Sanctioned", value: (58_240).toLocaleString("en-IN"), changeValue: "+9.8%", changeDirection: "up", changeLabel: "vs prior FY" },
              { label: "Disbursed", value: formatCrore(6_104), changeValue: "+3.1%", changeDirection: "up", changeLabel: "vs prior FY" },
              { label: "Average clearance", value: "34 days", changeValue: "−6 days", changeDirection: "up", changeLabel: "vs prior FY" },
            ]}
          />
        </Specimen>
      </SpecimenGrid>

      {/* ── Tables ─────────────────────────────────────────────────────── */}
      <h2 id="tables" style={h2Style}>
        Tables
      </h2>
      <p style={leadStyle}>
        The design system owns the presentational table and a controlled state contract for
        sort, filter and page. It does not own the data layer — virtualisation, server
        pagination, column pinning, grouping and export belong to a data grid, which is a
        separate product, and every adopting department&rsquo;s backend differs anyway.
      </p>
      <Rule>
        Two things a government table needs that generic systems omit: row-level
        provenance, and a withheld value that renders as an em dash rather than a zero.
        The Odisha row below has its beneficiary count withheld pending review — it is not
        nought, and a chart built from this column must exclude it from any total rather
        than sum it as zero.
      </Rule>

      <div style={{ marginBottom: "var(--sa-section-48)" }}>
        <DataTable<AgencyRow>
          caption="Implementing agencies — sanction and utilisation, FY 2025–26 (as of 27 August 2026)"
          data={AGENCIES}
          total={AGENCIES.length}
          columns={[
            { key: "agency", header: "Implementing agency" },
            { key: "state", header: "State" },
            { key: "sanctioned", header: "Sanctioned", render: (r) => rupeesToCrore(r.sanctioned) },
            { key: "utilised", header: "Utilised", render: (r) => rupeesToCrore(r.utilised) },
            {
              key: "beneficiaries",
              header: "Beneficiaries",
              render: (r) =>
                r.beneficiaries === null ? (
                  <span
                    title="Withheld pending review"
                    style={{ color: "var(--sa-text-neutral-subtle)" }}
                  >
                    &mdash;
                  </span>
                ) : (
                  r.beneficiaries.toLocaleString("en-IN")
                ),
            },
            { key: "status", header: "Status" },
          ]}
        />
      </div>

      {/* ── Containers ─────────────────────────────────────────────────── */}
      <h2 id="containers" style={h2Style}>
        Cards and containers
      </h2>
      <p style={leadStyle}>
        Containers carry the states a chart cannot carry itself — loading, empty, and the
        difference between having no data and having filtered it all away. Those are three
        different messages, and a board that collapses them into one blank panel makes its
        reader guess.
      </p>

      <SpecimenGrid>
        <Specimen name="Chart card — populated" answers="The normal case: a titled frame, and one provenance line naming the source and the as-of date.">
          <ChartCard
            title="Applications cleared"
            subtitle="Monthly, FY 2025–26"
            provenance={{ source: "Scheme MIS, Department of Social Justice and Empowerment", asOf: "2026-08-27" }}
          >
            <LineChart
              title="Applications cleared, monthly"
              labels={THROUGHPUT.labels}
              series={[{ name: "Cleared", data: THROUGHPUT.cleared }]}
              height={220}
            />
          </ChartCard>
        </Specimen>

        <Specimen
          name="Chart card — loading"
          answers="A skeleton that preserves the final footprint, so nothing shifts when the data lands."
          notFor="A spinner in a collapsed box. That guarantees a layout shift on resolve."
        >
          <ChartCard title="Applications cleared" subtitle="Monthly, FY 2025–26" loading />
        </Specimen>

        <Specimen
          name="Chart card — empty"
          answers="No data at all, said plainly."
          notFor="Filtered-to-empty, which needs a different message and a way back."
        >
          <ChartCard
            title="Disbursement by district"
            subtitle="FY 2025–26"
            empty
            emptyLabel="No disbursement recorded for this scheme yet."
          />
        </Specimen>

        <Specimen
          name="Chart card — filtered to empty"
          answers="The filter removed everything. Names the filter and offers the way back."
        >
          <ChartCard
            title="Disbursement by district"
            subtitle="Filtered to: Ladakh · Q4"
            empty
            emptyLabel="No districts match Ladakh in Q4. Clear the quarter filter to see all 34 districts."
          />
        </Specimen>
      </SpecimenGrid>

      <Callout type="warning" title="Colour is never the only encoding — and here is the measurement">
        Every specimen above is readable without hue: bars carry length, lines carry
        position and marker shape, the choropleth carries a labelled legend, and each chart
        carries a screen-reader table with the exact values. Where a chart has nine series
        or fewer, direct labelling is preferred over a legend — for a citizen-facing
        audience it is the single highest-value default in this system.
        <br />
        <br />
        Nine is measured, not asserted. The first nine slots of the categorical ramp stay
        distinguishable from one another <em>and</em> under deuteranopia, protanopia and
        tritanopia; slots 10&ndash;12 are extension colours that are distinct in full
        colour but carry no colour-blindness guarantee. The ramp was regenerated to reach
        that number &mdash; the previous one held for five slots and survived no dichromacy
        at all, because it varied hue while holding lightness nearly flat, and lightness is
        the channel a dichromat keeps. Enforced by{" "}
        <code>packages/tokens/test/chart-palette.test.mjs</code>.
      </Callout>
    </>
  );
}
