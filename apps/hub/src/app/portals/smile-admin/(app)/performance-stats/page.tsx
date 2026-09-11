"use client";

import { useMemo, useState } from "react";
import { SmilePageHeader } from "@/components/smile-admin/shell/page-header";
import { GenderDonut, MonthlyPerf, ShelterStateBars } from "@/components/smile-admin/dashboard/charts";
import { ScopeBanner } from "@/components/smile-admin/shell/scope-banner";
import { ExportMenu } from "@/components/smile-admin/data/export-menu";
import { GENDER_DISTRIBUTION, PERF_MONTHLY, PERF_TOP_AGENCIES, SHELTER_HOMES_BY_STATE, STATE_DISTRIBUTION } from "@/lib/smile-admin/mock-data";
import { cn, formatNumber } from "@/lib/smile-admin/utils";
import { Badge, Button, Card, CardBody, CardHeader, CardTitle, DataTable, Icon, type DataTableColumn } from "@mosje/design-system";

interface TopState {
  stateId: number;
  state: string;
  count: number;
  rank: number;
  /** Share of the leading state's figure — what the bar draws. */
  pct: number;
}

/*
 * Not sortable, deliberately. This is a ranked leaderboard, not a register: the
 * "1." in the first cell IS the order, so letting a reader re-sort the seven rows
 * would leave the numbering describing an order the table no longer shows.
 */
const TOP_STATE_COLUMNS: DataTableColumn<TopState & Record<string, unknown>>[] = [
  {
    key: "state",
    header: "State",
    render: (s) => (
      <div className="font-semibold text-ink">
        {s.rank}. {s.state}
      </div>
    ),
    exportValue: (s) => `${s.rank}. ${s.state}`,
  },
  {
    key: "count",
    header: "Identified",
    className: "text-right tabular-nums",
    render: (s) => formatNumber(s.count),
  },
  {
    key: "pct",
    header: "Capture rate",
    render: (s) => (
      <div className="flex items-center gap-sm">
        <div className="relative h-2 w-32 overflow-hidden rounded-full bg-neutral-100">
          <div className="absolute inset-y-0 left-0 rounded-full bg-primary" style={{ width: `${s.pct}%` }} />
        </div>
        <span className="text-label-2 text-ink-muted">{s.pct}%</span>
      </div>
    ),
    exportValue: (s) => `${s.pct}%`,
  },
  {
    key: "trend",
    header: "Trend",
    render: (s) => (
      <span className="inline-flex items-center gap-xs text-label-2 font-semibold text-success-600">
        <Icon name="trending_up" size={12} /> +{(8 + (s.rank - 1) * 1.2).toFixed(1)}%
      </span>
    ),
    exportValue: (s) => `+${(8 + (s.rank - 1) * 1.2).toFixed(1)}%`,
  },
];

type Agency = (typeof PERF_TOP_AGENCIES)[number];

const AGENCY_COLUMNS: DataTableColumn<Agency & Record<string, unknown>>[] = [
  { key: "name", header: "Agency", sortable: true, className: "font-semibold text-ink" },
  { key: "state", header: "State", sortable: true },
  {
    key: "identified",
    header: "Identified",
    sortable: true,
    className: "text-right tabular-nums",
    render: (a) => formatNumber(a.identified),
    sortValue: (a) => a.identified,
  },
  {
    key: "mobilised",
    header: "Mobilised",
    sortable: true,
    className: "text-right tabular-nums",
    render: (a) => formatNumber(a.mobilised),
    sortValue: (a) => a.mobilised,
  },
  {
    key: "rehab",
    header: "Rehabilitated",
    sortable: true,
    className: "text-right tabular-nums",
    render: (a) => formatNumber(a.rehab),
    sortValue: (a) => a.rehab,
  },
  {
    key: "conversion",
    header: "Conversion",
    sortable: true,
    // The RATIO, not the string — "9%" sorts above "20%" as text.
    sortValue: (a) => a.rehab / a.identified,
    render: (a) => {
      const conv = Math.round((a.rehab / a.identified) * 100);
      return (
        <span
          className={cn(
            "inline-flex items-center gap-xs rounded-xs px-sm py-0.5 text-label-2",
            conv >= 20 ? "bg-success-50 text-success-600" : conv >= 15 ? "bg-warning-50 text-warning-600" : "bg-danger-50 text-danger-600",
          )}
        >
          {conv}%
        </span>
      );
    },
    exportValue: (a) => `${Math.round((a.rehab / a.identified) * 100)}%`,
  },
];

const PERIODS = ["Last 12 months", "Current FY", "Last FY", "Calendar Year"] as const;

function HeroStat({ label, value, delta, positive }: { label: string; value: string; delta: string; positive: boolean }) {
  return (
    <div className="rounded-lg border border-stroke-200 bg-white p-lg shadow-xs">
      <div className="text-label-3 uppercase text-ink-muted">{label}</div>
      <div className="mt-xs text-headline-2 tabular-nums text-ink">{value}</div>
      <div className={cn("mt-sm inline-flex items-center gap-xs rounded-xs px-sm py-0.5 text-label-2 font-semibold", positive ? "bg-success-50 text-success-600" : "bg-danger-50 text-danger-600")}>
        {positive ? <Icon name="arrow_outward" size={12} /> : <Icon name="south_east" size={12} />}
        {delta} <span className="text-ink-muted">vs prior</span>
      </div>
    </div>
  );
}

export default function PerformanceStatsPage() {
  const [period, setPeriod] = useState<(typeof PERIODS)[number]>("Last 12 months");

  const topStates = useMemo(() => {
    const ranked = [...STATE_DISTRIBUTION].sort((a, b) => b.count - a.count).slice(0, 7);
    const max = ranked[0]?.count ?? 1;
    return ranked.map((s, i) => ({ ...s, rank: i + 1, pct: Math.round((s.count / max) * 100) }));
  }, []);
  const totalIdentified = PERF_MONTHLY.at(-1)?.identified ?? 0;
  const totalMobilised = PERF_MONTHLY.at(-1)?.mobilised ?? 0;
  const totalRehab = PERF_MONTHLY.at(-1)?.rehab ?? 0;

  return (
    <div className="space-y-lg">
      <SmilePageHeader
        breadcrumbs={[{ label: "Reports & Analytics" }, { label: "Performance Statistics" }]}
        eyebrow="Reports & analytics"
        title="Performance Statistics"
        subtitle="Programme momentum across identification, mobilisation and rehabilitation — over time and by geography."
        actions={
          <div className="flex items-center gap-sm">
            <Button appearance="outlined" size="sm">
              <Icon name="filter_alt" size={14} /> Filters
            </Button>
            <ExportMenu
              filename="smile-top-states"
              title="Performance Statistics — Top States"
              subtitle="State-wise rollups of beneficiary identification."
              columns={[
                { header: "Rank", accessor: (r: { rank: number }) => r.rank },
                { header: "State", accessor: "state" },
                { header: "Identified", accessor: "count" },
              ]}
              rows={topStates}
            />
          </div>
        }
      />
      <ScopeBanner />

      <div className="flex flex-wrap items-center gap-xs">
        {PERIODS.map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={cn(
              "rounded-md border px-md py-1.5 text-label-1 transition",
              p === period ? "border-primary bg-primary text-white" : "border-stroke-200 bg-white text-ink-muted hover:text-primary"
            )}
          >
            {p}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-md md:grid-cols-4">
        <HeroStat label="Identified"     value={formatNumber(totalIdentified)} delta="+12.4%" positive />
        <HeroStat label="Mobilised"      value={formatNumber(totalMobilised)}  delta="+9.8%"  positive />
        <HeroStat label="Rehabilitated"  value={formatNumber(totalRehab)}      delta="+8.1%"  positive />
        <HeroStat label="Avg time to rehab" value="42 days"                    delta="-3 days" positive={false} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cumulative momentum</CardTitle>
          <span className="text-label-2 text-ink-muted">Beneficiaries by stage · monthly</span>
        </CardHeader>
        <CardBody>
          <MonthlyPerf data={PERF_MONTHLY} />
        </CardBody>
      </Card>

      <div className="grid gap-lg lg:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Top performing states</CardTitle>
            <span className="inline-flex items-center gap-xs rounded-xs bg-primary-50 px-sm py-0.5 text-label-2 text-primary">
              <Icon name="target" size={12} /> Beneficiaries onboarded
            </span>
          </CardHeader>
          <CardBody>
            <DataTable
              columns={TOP_STATE_COLUMNS}
              data={topStates as Array<TopState & Record<string, unknown>>}
              total={topStates.length}
              showPageSizes={false}
              caption="The seven states identifying the most beneficiaries"
              emptyLabel="No state has reported yet."
            />
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Gender split</CardTitle>
          </CardHeader>
          <CardBody>
            <GenderDonut data={GENDER_DISTRIBUTION} />
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top implementing agencies</CardTitle>
          <Badge status="info">FY 2025–26</Badge>
        </CardHeader>
        <CardBody>
          <DataTable
            columns={AGENCY_COLUMNS}
            data={PERF_TOP_AGENCIES as Array<Agency & Record<string, unknown>>}
            total={PERF_TOP_AGENCIES.length}
            showPageSizes={false}
            caption="Implementing agencies by beneficiaries identified, mobilised and rehabilitated"
            emptyLabel="No implementing agency has reported this year."
          />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Shelter homes density</CardTitle>
          <span className="text-label-2 text-ink-muted">Top states by operational shelter capacity</span>
        </CardHeader>
        <CardBody>
          <ShelterStateBars data={SHELTER_HOMES_BY_STATE} />
        </CardBody>
      </Card>
    </div>
  );
}
