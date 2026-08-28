"use client";

import * as React from "react";

import {
  BarChart,
  ChartCard,
  DashboardGrid,
  DataTable,
  FunnelChart,
  Heatmap,
  IndiaMap,
  KpiRow,
  LineChart,
  Sparkline,
  categoricalColor,
} from "@mosje/design-system";

import { Callout, StatusBadge } from "@/components/design-system/docs-kit";
import { h2Style, leadStyle, Rule } from "../viz-kit";
import {
  AGE_BANDS,
  AGENCIES,
  COMPLIANCE_MATRIX,
  DAILY_REGISTRATIONS,
  PIPELINE,
  SCHEME_FUNDS,
  SOCIAL_CATEGORY,
  STATE_COVERAGE,
  THROUGHPUT,
  formatCrore,
  formatPct,
  rupeesToCrore,
  type AgencyRow,
} from "@/lib/design-system/viz-samples";

import "../data-visualisation.css";

/** One archetype: the board itself, then what it is for and how it is arranged. */
function Archetype({
  id,
  name,
  serves,
  arrangement,
  children,
}: {
  id: string;
  name: string;
  serves: string;
  arrangement: string;
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <section style={{ marginBottom: "var(--sa-section-48)" }}>
      <h3
        id={id}
        style={{
          fontSize: "var(--sa-type-headline-3-size)",
          fontWeight: 600,
          margin: "0 0 var(--sa-stack-8) 0",
          scrollMarginTop: "var(--sa-section-48)",
        }}
      >
        {name}
      </h3>
      <p
        style={{
          fontSize: "var(--sa-type-body-2-size)",
          lineHeight: "var(--sa-type-body-2-lh)",
          color: "var(--sa-text-neutral-subtle)",
          maxWidth: "68ch",
          margin: "0 0 var(--sa-stack-8) 0",
        }}
      >
        {serves}
      </p>
      <p
        style={{
          fontSize: "var(--sa-type-body-3-size)",
          lineHeight: "var(--sa-type-body-3-lh)",
          color: "var(--sa-text-neutral-subtle)",
          maxWidth: "68ch",
          margin: "0 0 var(--sa-stack-16) 0",
        }}
      >
        <strong style={{ color: "var(--sa-text-neutral-bolder)" }}>Arrangement:</strong>{" "}
        {arrangement}
      </p>
      <div className="sa-viz-board">{children}</div>
    </section>
  );
}

export function ArchetypesContent(): React.JSX.Element {
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
          <h1 style={{ fontSize: "var(--sa-type-display-1-size)", fontWeight: 500, lineHeight: 1.1 }}>
            Dashboard Archetypes
          </h1>
          <StatusBadge status="Beta" />
        </div>
        <p
          style={{
            fontSize: "var(--sa-type-headline-2-size)",
            fontWeight: 400,
            color: "var(--sa-color-text-default)",
            maxWidth: "60ch",
            lineHeight: 1.5,
          }}
        >
          Five boards that cover most of what a department needs to show. Start from one
          and change the data, rather than arranging tiles from scratch.
        </p>
      </div>

      <p style={leadStyle}>
        Nobody ships a bar chart; they ship a board. These five are the reference
        arrangements — each one exists so that a designer and a developer building the same
        screen reach for the same layout without negotiating it. Where a department&rsquo;s
        need genuinely differs, deviate and say why; where it does not, the consistency is
        worth more than the originality.
      </p>

      <Rule>
        Every board opens with the summary and descends into the detail. A reader who
        stops after the first row should still have the answer; a reader who continues
        should find out why. That ordering is the one rule shared by all five, and it is
        the one most often broken.
      </Rule>

      <Callout type="info" title="What the numbers are">
        Illustrative figures in real Government-of-India shapes — ₹ crore, an April–March
        fiscal year, census age bands. Not published statistics. Each board is live: tab
        into any chart and its data points take focus, and every chart carries a
        screen-reader table.
      </Callout>

      <h2 id="boards" style={{ ...h2Style, marginTop: "var(--sa-section-48)" }}>
        The five boards
      </h2>

      {/* ── 1 · Scheme performance ─────────────────────────────────────── */}
      <Archetype
        id="scheme-performance"
        name="Scheme performance"
        serves="The default board for anyone accountable for a scheme: is it moving, is the money going out, and where is it stuck?"
        arrangement="Metrics across the top, then the trend that explains them, then the breakdown that localises them, then the register that names them."
      >
        <DashboardGrid>
          <KpiRow
            span={12}
            items={[
              { label: "Applications received", value: (128_400).toLocaleString("en-IN"), changeValue: "+12.4%", changeDirection: "up", changeLabel: "vs prior FY" },
              { label: "Sanctioned", value: (58_240).toLocaleString("en-IN"), changeValue: "+9.8%", changeDirection: "up", changeLabel: "vs prior FY" },
              { label: "Disbursed", value: formatCrore(6_104), changeValue: "+3.1%", changeDirection: "up", changeLabel: "vs prior FY" },
              { label: "Average clearance", value: "34 days", changeValue: "−6 days", changeDirection: "up", changeLabel: "vs prior FY" },
            ]}
          />
          <ChartCard span={7} title="Applications received against cleared" subtitle="Monthly, FY 2025–26">
            <LineChart
              title="Applications received against cleared, monthly"
              labels={THROUGHPUT.labels}
              series={[
                { name: "Received", data: THROUGHPUT.received },
                { name: "Cleared", data: THROUGHPUT.cleared },
              ]}
              height={260}
            />
          </ChartCard>
          <ChartCard span={5} title="Allocation against utilisation" subtitle="By scheme, ₹ crore">
            <BarChart
              title="Allocation against utilisation by scheme"
              labels={SCHEME_FUNDS.labels}
              series={[
                { name: "Allocated", data: SCHEME_FUNDS.allocated },
                { name: "Utilised", data: SCHEME_FUNDS.utilised },
              ]}
              valueFormat={formatCrore}
              height={300}
            />
          </ChartCard>
          <ChartCard span={12} title="Implementing agencies" subtitle="Sanction and utilisation, as of 27 August 2026">
            <DataTable<AgencyRow>
              data={AGENCIES}
              total={AGENCIES.length}
              columns={[
                { key: "agency", header: "Implementing agency" },
                { key: "state", header: "State" },
                { key: "sanctioned", header: "Sanctioned", render: (r) => rupeesToCrore(r.sanctioned) },
                { key: "utilised", header: "Utilised", render: (r) => rupeesToCrore(r.utilised) },
                { key: "status", header: "Status" },
              ]}
            />
          </ChartCard>
        </DashboardGrid>
      </Archetype>

      {/* ── 2 · Geographic distribution ────────────────────────────────── */}
      <Archetype
        id="geographic-distribution"
        name="Geographic distribution"
        serves="Where a scheme is and is not reaching people — the board that answers a parliamentary question about a particular state."
        arrangement="The map orients, the ranked bar makes the map's colours comparable, and the table carries the exact numbers the map cannot."
      >
        <DashboardGrid>
          <ChartCard span={7} title="Coverage rate by state" subtitle="Percentage of eligible population reached">
            <IndiaMap
              title="Scheme coverage rate by state"
              data={STATE_COVERAGE}
              valueFormat={formatPct}
            />
          </ChartCard>
          <ChartCard span={5} title="States ranked" subtitle="Highest to lowest coverage">
            <BarChart
              title="Coverage rate by state, ranked"
              orientation="horizontal"
              data={STATE_COVERAGE.map((s) => ({
                label: s.state,
                value: s.value,
                color: categoricalColor(0),
              }))}
              valueFormat={formatPct}
              width={420}
              height={560}
            />
          </ChartCard>
        </DashboardGrid>
      </Archetype>

      {/* ── 3 · Application pipeline ───────────────────────────────────── */}
      <Archetype
        id="application-pipeline"
        name="Application pipeline"
        serves="Where citizens fall out of a process. The board an operations team reads every morning."
        arrangement="The funnel shows the drop-off; the bar beside it converts drop-off into the days that caused it; the register names the cases now breaching."
      >
        <DashboardGrid>
          <ChartCard span={6} title="Pipeline" subtitle="FY 2025–26 to date">
            <FunnelChart title="Application pipeline, FY 2025–26" stages={PIPELINE} />
          </ChartCard>
          <ChartCard span={6} title="Days at each stage" subtitle="Median, current quarter">
            <BarChart
              title="Median days at each pipeline stage"
              orientation="horizontal"
              data={[
                { label: "Document verification", value: 6 },
                { label: "Eligibility check", value: 11 },
                { label: "Sanction", value: 14 },
                { label: "Disbursement", value: 3 },
              ].map((d) => ({ ...d, color: categoricalColor(1) }))}
              width={420}
              height={280}
            />
          </ChartCard>
        </DashboardGrid>
      </Archetype>

      {/* ── 4 · Compliance status ──────────────────────────────────────── */}
      <Archetype
        id="compliance-status"
        name="Compliance status"
        serves="Which schemes and agencies are behind on their obligations, and whether that is getting better or worse."
        arrangement="The matrix finds the problem cells at a glance; the sparklines say whether each one is recovering; the register is what gets acted on."
      >
        <DashboardGrid>
          <ChartCard span={7} title="Utilisation certificates" subtitle="Compliance % by scheme and quarter">
            <Heatmap
              title="Utilisation-certificate compliance by scheme and quarter"
              xLabels={COMPLIANCE_MATRIX.xLabels}
              yLabels={COMPLIANCE_MATRIX.yLabels}
              matrix={COMPLIANCE_MATRIX.matrix}
              valueFormat={formatPct}
            />
          </ChartCard>
          <ChartCard span={5} title="Direction of travel" subtitle="Last four quarters, by scheme">
            <div style={{ display: "grid", gap: "var(--sa-stack-16)" }}>
              {COMPLIANCE_MATRIX.yLabels.map((scheme, i) => {
                const row = COMPLIANCE_MATRIX.matrix[i] ?? [];
                const latest = row[row.length - 1] ?? 0;
                return (
                  <div
                    key={scheme}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "var(--sa-inline-16)",
                    }}
                  >
                    <span style={{ fontSize: "var(--sa-type-body-3-size)" }}>{scheme}</span>
                    <span style={{ display: "flex", alignItems: "center", gap: "var(--sa-inline-8)" }}>
                      <Sparkline data={row} label={`${scheme} compliance, last four quarters`} width={72} height={24} />
                      <span
                        style={{
                          fontSize: "var(--sa-type-body-3-size)",
                          fontWeight: 600,
                          fontVariantNumeric: "tabular-nums",
                          minWidth: "3ch",
                          textAlign: "right",
                        }}
                      >
                        {latest}%
                      </span>
                    </span>
                  </div>
                );
              })}
            </div>
          </ChartCard>
        </DashboardGrid>
      </Archetype>

      {/* ── 5 · Beneficiary demographics ───────────────────────────────── */}
      <Archetype
        id="beneficiary-demographics"
        name="Beneficiary demographics"
        serves="Who a scheme is actually reaching — the board that answers an equity question, and the one where suppression rules matter most."
        arrangement="Distributions first, because they are what gets quoted; the cross-tab second, because that is where the gap shows; the suppression-aware table last."
      >
        <DashboardGrid>
          <ChartCard span={6} title="By age band" subtitle="Census buckets">
            <BarChart
              title="Beneficiaries by age band"
              orientation="horizontal"
              data={AGE_BANDS.map((d) => ({ ...d, color: categoricalColor(0) }))}
              width={420}
              height={280}
            />
          </ChartCard>
          <ChartCard span={6} title="By social category" subtitle="Self-declared at registration">
            <BarChart
              title="Beneficiaries by social category"
              orientation="horizontal"
              data={SOCIAL_CATEGORY.map((d) => ({ ...d, color: categoricalColor(4) }))}
              width={420}
              height={280}
            />
          </ChartCard>
          <ChartCard span={12} title="Registrations" subtitle="Daily, last 14 days">
            <LineChart
              title="Daily registrations, last 14 days"
              area
              labels={DAILY_REGISTRATIONS.map((_, i) => `D${i + 1}`)}
              series={[{ name: "Registrations", data: DAILY_REGISTRATIONS }]}
              height={220}
            />
          </ChartCard>
        </DashboardGrid>
      </Archetype>

      {/* ── The contract ───────────────────────────────────────────────── */}
      <h2 id="coordination" style={h2Style}>
        What the boards do not show
      </h2>
      <p style={leadStyle}>
        The arrangement is only half an archetype. The other half is the coordination
        contract — and it is the half a designer cannot draw, which is exactly why it has
        to be written down rather than inferred from a mockup.
      </p>
      <ul
        style={{
          fontSize: "var(--sa-type-body-2-size)",
          lineHeight: "var(--sa-type-body-2-lh)",
          color: "var(--sa-text-neutral-subtle)",
          maxWidth: "68ch",
          paddingLeft: "var(--sa-padding-24)",
          marginBottom: "var(--sa-stack-24)",
        }}
      >
        <li>How filter state reaches every tile, and in what shape.</li>
        <li>
          Whether loading is per-board or per-tile, and what a half-loaded board looks
          like.
        </li>
        <li>What a cross-filter click does, and how a tile declares itself filterable.</li>
        <li>Which filters a tile responds to, and which it deliberately ignores.</li>
        <li>What happens to one tile whose data fails while its neighbours succeed.</li>
      </ul>
      <Callout type="warning" title="Boards are not yet templates">
        These render live but are not yet exported as reusable board components, and they
        have no Figma counterparts. Until both exist, treat this page as the reference to
        copy from rather than a package to import — and expect the arrangement to be
        stable while the code shape is not.
      </Callout>
    </>
  );
}
