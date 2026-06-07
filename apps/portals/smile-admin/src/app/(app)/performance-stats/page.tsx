"use client";

import { useMemo, useState } from "react";
import { ArrowDownRight, ArrowUpRight, Filter, Target, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shell/page-header";
import { GenderDonut, MonthlyPerf, ShelterStateBars } from "@/components/dashboard/charts";
import { ScopeBanner } from "@/components/shell/scope-banner";
import { ExportMenu } from "@/components/data/export-menu";
import { Table, TD, TH, THead, TR } from "@/components/ui/table";
import { GENDER_DISTRIBUTION, PERF_MONTHLY, PERF_TOP_AGENCIES, SHELTER_HOMES_BY_STATE, STATE_DISTRIBUTION } from "@/lib/mock-data";
import { cn, formatNumber } from "@/lib/utils";

const PERIODS = ["Last 12 months", "Current FY", "Last FY", "Calendar Year"] as const;

function HeroStat({ label, value, delta, positive }: { label: string; value: string; delta: string; positive: boolean }) {
  return (
    <div className="rounded-lg border border-stroke-200 bg-white p-lg shadow-xs">
      <div className="text-label-1 uppercase tracking-wide text-foreground-muted">{label}</div>
      <div className="mt-xs text-headline-2 font-bold tabular-nums text-foreground">{value}</div>
      <div className={cn("mt-sm inline-flex items-center gap-xs rounded-xs px-sm py-0.5 text-label-2 font-semibold", positive ? "bg-success-50 text-success-600" : "bg-danger-50 text-danger-600")}>
        {positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
        {delta} <span className="text-foreground-muted">vs prior</span>
      </div>
    </div>
  );
}

export default function PerformanceStatsPage() {
  const [period, setPeriod] = useState<(typeof PERIODS)[number]>("Last 12 months");

  const topStates = useMemo(() => [...STATE_DISTRIBUTION].sort((a, b) => b.count - a.count).slice(0, 7), []);
  const totalIdentified = PERF_MONTHLY.at(-1)?.identified ?? 0;
  const totalMobilised = PERF_MONTHLY.at(-1)?.mobilised ?? 0;
  const totalRehab = PERF_MONTHLY.at(-1)?.rehab ?? 0;

  return (
    <div className="space-y-lg">
      <PageHeader
        breadcrumbs={[{ label: "Reports & Analytics" }, { label: "Performance Statistics" }]}
        eyebrow="Reports & analytics"
        title="Performance Statistics"
        subtitle="Programme momentum across identification, mobilisation and rehabilitation — over time and by geography."
        actions={
          <div className="flex items-center gap-sm">
            <Button variant="outline" size="sm">
              <Filter className="h-3.5 w-3.5" /> Filters
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
              rows={topStates.map((s, i) => ({ ...s, rank: i + 1 }))}
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
              "rounded-md border px-md py-1.5 text-body-3 font-semibold transition",
              p === period ? "border-primary bg-primary text-white" : "border-stroke-200 bg-white text-foreground-muted hover:text-primary"
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
          <span className="text-label-2 text-foreground-muted">Beneficiaries by stage · monthly</span>
        </CardHeader>
        <CardContent>
          <MonthlyPerf data={PERF_MONTHLY} />
        </CardContent>
      </Card>

      <div className="grid gap-lg lg:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Top performing states</CardTitle>
            <span className="inline-flex items-center gap-xs rounded-xs bg-primary-50 px-sm py-0.5 text-label-3 font-semibold text-primary">
              <Target className="h-3 w-3" /> Beneficiaries onboarded
            </span>
          </CardHeader>
          <CardContent>
            <Table>
              <THead>
                <tr>
                  <TH>State</TH>
                  <TH className="text-right">Identified</TH>
                  <TH>Capture rate</TH>
                  <TH>Trend</TH>
                </tr>
              </THead>
              <tbody>
                {topStates.map((s, i) => {
                  const max = topStates[0].count;
                  const pct = Math.round((s.count / max) * 100);
                  return (
                    <TR key={s.state}>
                      <TD>
                        <div className="font-semibold text-foreground">{i + 1}. {s.state}</div>
                      </TD>
                      <TD className="text-right tabular-nums">{formatNumber(s.count)}</TD>
                      <TD>
                        <div className="flex items-center gap-sm">
                          <div className="relative h-2 w-32 overflow-hidden rounded-full bg-neutral-100">
                            <div className="absolute inset-y-0 left-0 rounded-full bg-primary" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-label-2 text-foreground-muted">{pct}%</span>
                        </div>
                      </TD>
                      <TD>
                        <span className="inline-flex items-center gap-xs text-label-2 font-semibold text-success-600">
                          <TrendingUp className="h-3 w-3" /> +{(8 + i * 1.2).toFixed(1)}%
                        </span>
                      </TD>
                    </TR>
                  );
                })}
              </tbody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Gender split</CardTitle>
          </CardHeader>
          <CardContent>
            <GenderDonut data={GENDER_DISTRIBUTION} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top implementing agencies</CardTitle>
          <Badge tone="info">FY 2025–26</Badge>
        </CardHeader>
        <CardContent>
          <Table>
            <THead>
              <tr>
                <TH>Agency</TH>
                <TH>State</TH>
                <TH className="text-right">Identified</TH>
                <TH className="text-right">Mobilised</TH>
                <TH className="text-right">Rehabilitated</TH>
                <TH>Conversion</TH>
              </tr>
            </THead>
            <tbody>
              {PERF_TOP_AGENCIES.map((a) => {
                const conv = Math.round((a.rehab / a.identified) * 100);
                return (
                  <TR key={a.name}>
                    <TD className="font-semibold text-foreground">{a.name}</TD>
                    <TD>{a.state}</TD>
                    <TD className="text-right tabular-nums">{formatNumber(a.identified)}</TD>
                    <TD className="text-right tabular-nums">{formatNumber(a.mobilised)}</TD>
                    <TD className="text-right tabular-nums">{formatNumber(a.rehab)}</TD>
                    <TD>
                      <span className={cn(
                        "inline-flex items-center gap-xs rounded-xs px-sm py-0.5 text-label-3 font-semibold",
                        conv >= 20 ? "bg-success-50 text-success-600" : conv >= 15 ? "bg-warning-50 text-warning-600" : "bg-danger-50 text-danger-600"
                      )}>
                        {conv}%
                      </span>
                    </TD>
                  </TR>
                );
              })}
            </tbody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Shelter homes density</CardTitle>
          <span className="text-label-2 text-foreground-muted">Top states by operational shelter capacity</span>
        </CardHeader>
        <CardContent>
          <ShelterStateBars data={SHELTER_HOMES_BY_STATE} />
        </CardContent>
      </Card>
    </div>
  );
}
