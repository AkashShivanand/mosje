"use client";

import * as React from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardIcon,
  CardSubtitle,
  CardTitle,
  ChartCard,
  ComboChart,
  DescriptionList,
  FilterSelect,
  HeadlineFigure,
  LineChart,
  RankedBarList,
  SectionTitle,
  Sparkline,
  type CardTone,
} from "@mosje/design-system";
import { OriginChip } from "@/components/website/ProvenanceChip";
import {
  BENEFICIARY_TRENDS,
  DEPARTMENT_DASHBOARD_ORIGIN,
  FUND_SHARE,
  HOSTELS,
  SCHOLARSHIPS,
  YEAR_ON_YEAR,
  type DeptAmount,
} from "@/lib/website-shared/dashboard";
import { FitChart } from "../DepartmentOverview";

/**
 * THE DEPARTMENT'S OWN FIGURES, in the proposed dashboard's shape.
 *
 * The Beneficiary Dashboard's figures (`lib/website-shared/dashboard.ts` — received from
 * the Department, and checked against dosje.gov.in/dashboard on 6 Oct 2026) are not
 * re-typed here and not re-shown as the live page's cards. They are re-ORGANISED by the
 * question a reader brings (instruction, 6 Oct 2026):
 *
 *   Scholarships  — three schemes, each a tile: what was released, how many students,
 *                   and the twelve years behind it as one line.
 *   Places        — hostels, Top Class Education and overseas study: places and
 *                   students, with the money beside them.
 *   Year by Year  — every series the live page carries, one chooser, one chart, in
 *                   place of five charts across two sections.
 *   Funds         — the nine-scheme fund split joins the page's Funds movement
 *                   (`FundsReleased`), where a reader looking for money looks.
 *
 * Every value is the record's own: the display strings exactly as the Department prints
 * them, and the series as published. The only arithmetic is a year's Pre- and
 * Post-Matric students added together for a tile's line, and each scheme's share of the
 * fund total — both from the figures shown beside them.
 *
 * DS Audit: Card / CardHeader / CardIcon / CardBody ✅ · HeadlineFigure ✅ · DescriptionList ✅ ·
 * Sparkline ✅ · ChartCard ✅ · LineChart ✅ · ComboChart ✅ · RankedBarList ✅ · FilterSelect ✅ ·
 * SectionTitle ✅ · OriginChip (app) ✅.
 */

const RECEIVED = <OriginChip origin={DEPARTMENT_DASHBOARD_ORIGIN} />;

/** A card of the shared record by its id. The record is a constant; a missing id is a bug, not a state. */
function card<T extends { id: string }>(cards: readonly T[], id: string): T {
  const c = cards.find((x) => x.id === id);
  if (!c) throw new Error(`Beneficiary Dashboard record has no card "${id}"`);
  return c;
}
/** The i-th entry of a record's list — present by construction (`dashboard.ts`). */
function nth<T>(list: readonly T[] | undefined, i: number): T {
  const v = list?.[i];
  if (v === undefined) throw new Error(`Beneficiary Dashboard record has no entry ${i}`);
  return v;
}
const amount = ({ value, unit }: DeptAmount) => (unit ? `${value} ${unit}` : value);
const lakh = (n: number) => `${n.toLocaleString("en-IN", { maximumFractionDigits: 2 })} lakh`;
const count = (n: number) => n.toLocaleString("en-IN");
/** Years in the record end with the provisional one, marked as the live page marks it. */
const plainYear = (label: string) => label.replace("*", "");

function Tile({ tone, icon, title, subtitle, children }: { tone: CardTone; icon: string; title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <Card tone={tone} accent="edge" className="pd-tile">
      <CardHeader>
        <CardIcon name={icon} />
        <div className="pd-tile__titles">
          <CardTitle size="sm">{title}</CardTitle>
          <CardSubtitle>{subtitle}</CardSubtitle>
        </div>
      </CardHeader>
      <CardBody className="pd-tile__body">{children}</CardBody>
    </Card>
  );
}

/** A tile's closing line and the twelve years behind it. */
function YearsLine({ labels, data, unit, format }: { labels: readonly string[]; data: number[]; unit: string; format: (n: number) => string }) {
  const lastLabel = labels[labels.length - 1]!;
  const provisional = lastLabel.endsWith("*");
  return (
    <div className="pd-trend">
      <p className="pd-fact">
        <b>{format(data[data.length - 1]!)}</b> {unit} in {plainYear(lastLabel)}
        {provisional ? " (provisional)" : ""}.
      </p>
      <Sparkline data={data} width={420} height={44} label={`${unit}, each year, ${plainYear(labels[0]!)} to ${plainYear(lastLabel)}`} />
    </div>
  );
}

const sum = (a: readonly number[], b: readonly number[]) => a.map((v, i) => Math.round((v + (b[i] ?? 0)) * 100) / 100);

/* ── The trends chooser: every series the Department publishes, one chart ──── */

type SeriesId = "sc" | "obc" | "shreyas" | (typeof YEAR_ON_YEAR.cards)[number]["id"];

const SERIES_OPTIONS: { value: SeriesId; label: string }[] = [
  { value: "sc", label: "SC Scholarships · Students" },
  { value: "obc", label: "PM-YASASVI Scholarships · Students" },
  { value: "shreyas", label: "SHREYAS Fellowship · Scholars" },
  { value: "hostels", label: "OBC Hostels · Seats and Funds" },
  { value: "tce-schools", label: "Top Class Schools · Students and Funds" },
  { value: "tce-colleges", label: "Top Class Colleges · Students and Funds" },
];

function YearByYear({ headingLevel }: { headingLevel: 3 | 4 }) {
  const [id, setId] = React.useState<SeriesId>("sc");
  const option = SERIES_OPTIONS.find((o) => o.value === id)!;
  const trend = BENEFICIARY_TRENDS.views.find((v) => v.id === id);
  const yoy = YEAR_ON_YEAR.cards.find((c) => c.id === id);
  return (
    <ChartCard
      headingLevel={headingLevel}
      title="Year by Year"
      subtitle={option.label}
      actions={
        <FilterSelect
          label="Series"
          value={id}
          onChange={(v) => setId(v as SeriesId)}
          options={SERIES_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
        />
      }
      footer={trend?.provisional ? BENEFICIARY_TRENDS.footnote : undefined}
    >
      <FitChart fallback={960}>
        {(width) =>
          trend ? (
            <LineChart
              title={`${option.label}: ${trend.unit}, by year`}
              labels={[...trend.labels]}
              series={trend.series.map((s) => ({ name: s.name, data: [...s.data], color: s.color }))}
              valueFormat={trend.unit === "Scholars Funded" ? count : (n: number) => n.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
              yLabel={trend.unit}
              showDots
              curve="smooth"
              tickCount={6}
              width={width}
              height={320}
            />
          ) : yoy ? (
            <ComboChart
              title={`${yoy.title}: ${yoy.count.name} and fund released, by year`}
              labels={[...yoy.labels]}
              bars={[{ name: yoy.count.name, data: [...yoy.count.data], color: "var(--sa-chart-cat-1)" }]}
              lines={[{ name: yoy.fund.name, data: [...yoy.fund.data], color: "var(--sa-chart-cat-4)" }]}
              leftLabel={yoy.count.axis}
              rightLabel="Fund (₹ Cr)"
              valueFormat={count}
              curve="smooth"
              tickCount={6}
              width={width}
              height={320}
            />
          ) : null
        }
      </FitChart>
    </ChartCard>
  );
}

/* ── The movement ──────────────────────────────────────────────────────────── */

export function Education({ sectionLevel, state }: { sectionLevel: 2 | 3; state?: string }) {
  const sc = card(SCHOLARSHIPS.cards, "sc");
  const obc = card(SCHOLARSHIPS.cards, "obc");
  const shreyas = card(SCHOLARSHIPS.cards, "shreyas");
  const hostels = card(HOSTELS.cards, "hostels");
  const topClass = card(HOSTELS.cards, "top-class");
  const ambedkar = card(HOSTELS.cards, "ambedkar");
  const scTrend = BENEFICIARY_TRENDS.views.find((v) => v.id === "sc")!;
  const obcTrend = BENEFICIARY_TRENDS.views.find((v) => v.id === "obc")!;
  const shreyasTrend = BENEFICIARY_TRENDS.views.find((v) => v.id === "shreyas")!;
  const hostelYears = YEAR_ON_YEAR.cards.find((c) => c.id === "hostels")!;
  const [schools, colleges] = topClass.splits ?? [];
  const cardLevel = (sectionLevel + 1) as 3 | 4;

  return (
    <section className="pd-section" aria-labelledby="pd-education">
      <SectionTitle
        as={sectionLevel}
        headingId="pd-education"
        size="display"
        eyebrow="Scholarships and Education"
        title="Support to Students"
        description={
          state
            ? "All-India figures, Financial Years 2014-15 to 2025-26. They are not published by State/UT."
            : "All-India figures, Financial Years 2014-15 to 2025-26."
        }
      >
        {RECEIVED}
      </SectionTitle>

      <ul className="pd-bento pd-bento--n3" aria-label="Scholarships">
        <li>
          <Tile tone={sc.tone} icon={sc.icon} title="SC Scholarships" subtitle={`${sc.subtitle} Scholarships for Scheduled Caste Students`}>
            <HeadlineFigure size="md" value={amount(nth(sc.metrics, 2))} label="students benefited" />
            <DescriptionList size="sm" columns={2} items={(sc.metrics ?? []).slice(0, 2).map((m) => ({ term: m.label, value: amount(m) }))} />
            <YearsLine labels={scTrend.labels} data={sum(nth(scTrend.series, 0).data, nth(scTrend.series, 1).data)} unit="students" format={lakh} />
          </Tile>
        </li>
        <li>
          <Tile tone={obc.tone} icon={obc.icon} title={obc.title} subtitle="Scholarships for OBC, EBC and DNT Students">
            <HeadlineFigure size="md" value={amount(nth(obc.metrics, 2))} label="students benefited" />
            <DescriptionList size="sm" columns={2} items={(obc.metrics ?? []).slice(0, 2).map((m) => ({ term: m.label, value: amount(m) }))} />
            <YearsLine labels={obcTrend.labels} data={sum(nth(obcTrend.series, 0).data, nth(obcTrend.series, 1).data)} unit="students" format={lakh} />
          </Tile>
        </li>
        <li>
          <Tile tone={shreyas.tone} icon={shreyas.icon} title="SHREYAS" subtitle={shreyas.subtitle}>
            <HeadlineFigure size="md" value={amount(nth(shreyas.metrics, 1))} label="scholars funded" />
            <DescriptionList size="sm" columns={2} items={[{ term: nth(shreyas.metrics, 0).label, value: amount(nth(shreyas.metrics, 0)) }]} />
            <YearsLine labels={shreyasTrend.labels} data={[...nth(shreyasTrend.series, 0).data]} unit="scholars funded" format={count} />
          </Tile>
        </li>
      </ul>

      <ul className="pd-bento pd-bento--n3" aria-label="Hostels and Top Class Education">
        <li>
          <Tile tone={hostels.tone} icon={hostels.icon} title="OBC Hostels" subtitle={hostels.title}>
            <HeadlineFigure size="md" value={amount(nth(hostels.metrics, 0))} label="seats sanctioned, across Boys' and Girls' hostels" />
            <DescriptionList size="sm" columns={2} items={[{ term: nth(hostels.metrics, 1).label, value: amount(nth(hostels.metrics, 1)) }]} />
            <YearsLine labels={hostelYears.labels} data={[...hostelYears.count.data]} unit="seats sanctioned" format={count} />
          </Tile>
        </li>
        <li>
          <Tile tone={topClass.tone} icon={topClass.icon} title="Top Class Education" subtitle="In Schools and Colleges, for OBC, EBC and DNT Students">
            {schools && colleges ? (
              <>
                {/* Two figures side by side, each a HeadlineFigure like every other tile's lead —
                    never one invented total: the two count different students over different years. */}
                <div className="pd-pair">
                  <HeadlineFigure size="md" value={schools.value} label={`students in schools, ${schools.sub.toLowerCase()}`} />
                  <HeadlineFigure size="md" value={colleges.value} label={`students in colleges, ${colleges.sub.toLowerCase()}`} />
                </div>
                <DescriptionList
                  size="sm"
                  columns={2}
                  items={[
                    { term: "Released, Schools", value: schools.fund },
                    { term: "Released, Colleges", value: colleges.fund },
                  ]}
                />
              </>
            ) : null}
          </Tile>
        </li>
        <li>
          <Tile tone="info" icon={ambedkar.icon} title="Overseas Study" subtitle={ambedkar.title}>
            <HeadlineFigure size="md" value={amount(nth(ambedkar.metrics, 0))} label="OBC and EBC students benefited" />
            <DescriptionList size="sm" columns={2} items={[{ term: nth(ambedkar.metrics, 1).label, value: amount(nth(ambedkar.metrics, 1)) }]} />
          </Tile>
        </li>
      </ul>

      <YearByYear headingLevel={cardLevel} />
    </section>
  );
}

/**
 * The nine schemes' fund release, for the page's Funds movement. Ranked bars, not the live
 * page's ring: nine slices, one of them two-thirds of the whole, are compared by length far
 * more accurately than by angle, and every bar can carry its amount and share as text.
 */
export function FundsReleased({ headingLevel }: { headingLevel: 3 | 4 }) {
  const total = FUND_SHARE.slices.reduce((t, s) => t + s.value, 0);
  return (
    <ChartCard
      headingLevel={headingLevel}
      title="Funds Released, by Scheme"
      subtitle={`₹${Math.round(total).toLocaleString("en-IN")} Cr across nine schemes, 2014-15 to 2025-26`}
      actions={RECEIVED}
    >
      <RankedBarList
        title="Funds released, by scheme, 2014-15 to 2025-26"
        items={FUND_SHARE.slices.map((s) => ({ label: s.label, value: s.value, detail: `${Math.round((s.value / total) * 1000) / 10}%` }))}
        valueFormat={(v: number) => FUND_SHARE.slices.find((s) => s.value === v)?.display ?? `₹${Math.round(v).toLocaleString("en-IN")} Cr`}
        showRank={false}
        sort="none"
      />
    </ChartCard>
  );
}
