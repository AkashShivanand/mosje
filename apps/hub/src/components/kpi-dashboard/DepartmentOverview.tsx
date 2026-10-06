"use client";

import * as React from "react";
import {
  Badge,
  ChartCard,
  ComboChart,
  LineChart,
  ProvenanceLine,
  SectionTitle,
  SegmentedControl,
  useChartSize,
} from "@mosje/design-system";
import { isoDate } from "@/lib/kpi/format";
import {
  BENEFICIARY_TRENDS,
  DEPARTMENT_DASHBOARD_AS_ON,
  DEPARTMENT_DASHBOARD_SOURCE,
  FUND_SHARE,
  HOSTELS,
  SCHOLARSHIPS,
  YEAR_ON_YEAR,
} from "@/lib/website-shared/dashboard";
import { FundShareDonut, HostelCard, ScholarshipCard } from "./DepartmentCards";
import "./kpi-dashboard.css";

/**
 * The Department's Beneficiary Dashboard — a replica of dosje.gov.in/dashboard (read
 * 5 Oct 2026), section for section, card for card, in the live page's words. Shared by the
 * New, Classic and DBIM designs; each wraps it in its own page.
 *
 *   1. Scholarships and Fellowship — SETU pill, period pill, three cards with a coloured
 *      header band, an icon and three figures on a tinted body.
 *   2. Hostels and Top Class Education — three cards with a coloured top edge and an icon;
 *      Top Class Education splits into Schools and Colleges.
 *   3. Year by Year Trends — the SC / OBC / SHREYAS switch in a blue band over a curved area
 *      line, and the Share of Fund Release ring with its amounts beside it.
 *   4. Year on Year Report — three cards, each its own band colour, bars and a fund line.
 *
 * DS Audit: SectionTitle ✅ · Badge ✅ · SegmentedControl ✅ · ChartCard ✅ (`tone` ADDED) ·
 * Card / CardHeader / CardTitle / CardSubtitle / CardBody ✅ (`tone`, `accent`, `tinted`,
 * `CardHeader divided` ADDED) · CardIcon ➕ ADDED · DescriptionList ✅ (`size="figure"`,
 * `caps`, node terms ADDED) · LineChart / ComboChart ✅ (`curve`, `tickCount` ADDED) ·
 * DonutChart ✅ (`legendValue`, `layout="side"` ADDED) · ProvenanceLine ✅.
 *
 * NOTHING HERE STYLES A COMPONENT. The stylesheet holds the four section grids and one
 * two-column split; every colour, size and rule comes from the design system, so the DBIM
 * design re-colours the replica through its own palette.
 */

const PROVENANCE = {
  source: DEPARTMENT_DASHBOARD_SOURCE,
  asOf: isoDate(DEPARTMENT_DASHBOARD_AS_ON),
};

/** The axis title carries the unit ("Students Beneficiary (Lakh)"), as live; ticks are bare. */
const lakh = (n: number) =>
  n.toLocaleString("en-IN", { maximumFractionDigits: 2 });
const count = (n: number) => n.toLocaleString("en-IN");

/** Series colours: categorical slots, never a status scale (`semantic.json` `chart/cat`). */
const BARS = "var(--sa-chart-cat-1)";
const FUND_LINE = "var(--sa-chart-cat-4)";

type TrendId = (typeof BENEFICIARY_TRENDS.views)[number]["id"];

/**
 * A chart drawn at the width it is shown at. The charts scale by `viewBox`, so a 640-wide
 * chart on a 311px phone column sets its axis labels at half size; measured, they stay at
 * reading size. `fallback` is the width before the first measurement.
 */
export function FitChart({
  fallback,
  children,
}: {
  fallback: number;
  children: (width: number) => React.ReactNode;
}) {
  const [ref, size] = useChartSize<HTMLDivElement>();
  return (
    <div ref={ref}>
      {children(
        size.width > 0 ? Math.max(300, Math.round(size.width)) : fallback,
      )}
    </div>
  );
}

export function DepartmentOverview({
  sectionLevel = 2,
}: {
  sectionLevel?: 2 | 3;
}) {
  const [trend, setTrend] = React.useState<TrendId>("sc");
  const view = BENEFICIARY_TRENDS.views.find((v) => v.id === trend)!;
  const cardLevel = (sectionLevel + 1) as 3 | 4;

  return (
    <div className="kd-bd">
      {/* ── 1 · Scholarships and Fellowship ─────────────────────────────── */}
      <section className="kd-bd__section" aria-labelledby="kd-bd-scholarships">
        {/* The SETU pill sits above the title, as live; SectionTitle's eyebrow is a text kicker. */}
        <div className="kd-bd__head">
          <Badge status="success" size="lg" wrap>
            {SCHOLARSHIPS.pill}
          </Badge>
          <SectionTitle
            as={sectionLevel}
            size="display"
            headingId="kd-bd-scholarships"
            title={SCHOLARSHIPS.title}
          >
            <Badge status="neutral" size="lg" wrap>
              {SCHOLARSHIPS.period}
            </Badge>
          </SectionTitle>
        </div>
        <ul className="kd-bd__grid kd-bd__grid--cats">
          {SCHOLARSHIPS.cards.map((c) => (
            <li key={c.id}>
              <ScholarshipCard c={c} />
            </li>
          ))}
        </ul>
      </section>

      {/* ── 2 · Hostels and Top Class Education ─────────────────────────── */}
      <section className="kd-bd__section" aria-labelledby="kd-bd-hostels">
        <SectionTitle
          as={sectionLevel}
          size="display"
          headingId="kd-bd-hostels"
          title={HOSTELS.title}
        />
        <ul className="kd-bd__grid kd-bd__grid--feats">
          {HOSTELS.cards.map((c) => (
            <li key={c.id}>
              <HostelCard c={c} />
            </li>
          ))}
        </ul>
      </section>

      {/* ── 3 · Year by Year Trends ──────────────────────────────────────── */}
      <section className="kd-bd__section" aria-labelledby="kd-bd-trends">
        <SectionTitle
          as={sectionLevel}
          size="display"
          headingId="kd-bd-trends"
          title={BENEFICIARY_TRENDS.title}
        />
        <div className="kd-bd__grid kd-bd__grid--charts">
          <ChartCard
            tone="primary"
            headingLevel={cardLevel}
            title={BENEFICIARY_TRENDS.cardTitle}
            actions={
              <SegmentedControl
                ariaLabel="Students shown"
                value={trend}
                onChange={setTrend}
                options={BENEFICIARY_TRENDS.views.map((v) => ({
                  value: v.id,
                  label: v.label,
                }))}
              />
            }
            footer={view.provisional ? BENEFICIARY_TRENDS.footnote : undefined}
          >
            <span
              className="ds-sr-only"
              role="status"
            >{`Showing ${view.label}: ${view.unit}`}</span>
            <FitChart fallback={640}>
              {(width) => (
                <LineChart
                  title={`${BENEFICIARY_TRENDS.cardTitle}, ${view.label}: ${view.unit}`}
                  labels={[...view.labels]}
                  series={view.series.map((s) => ({
                    name: s.name,
                    data: [...s.data],
                    color: s.color,
                  }))}
                  valueFormat={view.unit === "Scholars Funded" ? count : lakh}
                  yLabel={view.unit}
                  area
                  showDots
                  curve="smooth"
                  tickCount={8}
                  width={width}
                  height={340}
                />
              )}
            </FitChart>
          </ChartCard>

          <ChartCard
            tone="primary"
            headingLevel={cardLevel}
            title={FUND_SHARE.title}
            subtitle={FUND_SHARE.subtitle}
          >
            <FundShareDonut />
          </ChartCard>
        </div>
      </section>

      {/* ── 4 · Year on Year Report ──────────────────────────────────────── */}
      <section className="kd-bd__section" aria-labelledby="kd-bd-yoy">
        <SectionTitle
          as={sectionLevel}
          size="display"
          headingId="kd-bd-yoy"
          title={YEAR_ON_YEAR.title}
        />
        <ul className="kd-bd__grid kd-bd__grid--yoy">
          {YEAR_ON_YEAR.cards.map((c) => (
            <li key={c.id}>
              <ChartCard tone={c.tone} headingLevel={cardLevel} title={c.title}>
                <FitChart fallback={400}>
                  {(width) => (
                    <ComboChart
                      title={`${c.title}: ${c.count.name} and fund released, by year`}
                      labels={[...c.labels]}
                      bars={[
                        {
                          name: c.count.name,
                          data: [...c.count.data],
                          color: BARS,
                        },
                      ]}
                      lines={[
                        {
                          name: c.fund.name,
                          data: [...c.fund.data],
                          color: FUND_LINE,
                        },
                      ]}
                      leftLabel={c.count.axis}
                      rightLabel="Fund (₹ Cr)"
                      valueFormat={count}
                      curve="smooth"
                      tickCount={6}
                      width={width}
                      height={300}
                    />
                  )}
                </FitChart>
              </ChartCard>
            </li>
          ))}
        </ul>
      </section>

      <ProvenanceLine provenance={PROVENANCE} className="kd-bd__source" />
    </div>
  );
}
