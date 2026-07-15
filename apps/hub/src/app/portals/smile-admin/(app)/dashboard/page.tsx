"use client";

import { useMemo, useState } from "react";
import { BarChart3 } from "lucide-react";
import { ExportMenu } from "@/components/smile-admin/data/export-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/smile-admin/ui/card";
import { PageHeader } from "@/components/smile-admin/shell/page-header";
import { ScopeBanner } from "@/components/smile-admin/shell/scope-banner";
import { DateRangeChips } from "@/components/smile-admin/dashboard/date-range-chips";
import { KpiCard, KPI_ICONS, type KpiSpec } from "@/components/smile-admin/dashboard/kpi-card";
import { IndiaMap } from "@/components/smile-admin/dashboard/india-map";
import { SystemUsersRail } from "@/components/smile-admin/dashboard/system-users-rail";
import {
  ActivityLine,
  AgeBars,
  GenderDonut,
  ShelterStateBars,
  TypeBars,
} from "@/components/smile-admin/dashboard/charts";
import { SectionTitle } from "@/components/smile-admin/ui/section";
import { useApp } from "@/store/smile-admin/app-context";
import {
  AGE_DISTRIBUTION,
  BEGGAR_TYPE,
  GENDER_DISTRIBUTION,
  PROGRAMME_KPI_ALL_INDIA,
  PROGRAMME_KPI_MAHARASHTRA,
  PROGRAMME_KPI_NEW_DELHI,
  SHELTER_HOMES_BY_STATE,
  STATE_DISTRIBUTION,
  SURVEY_ACTIVITY,
  SYSTEM_USERS_ALL,
} from "@/lib/smile-admin/mock-data";

const TABS = [
  { id: "identified", label: "Identified" },
  { id: "mobilised", label: "Mobilised" },
  { id: "rehabilitated", label: "Rehabilitation" },
] as const;

export default function DashboardPage() {
  const { account } = useApp();
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("identified");

  const kpi = useMemo(() => {
    if (account?.role === "district_nodal_officer" && account.districtName === "New Delhi")
      return PROGRAMME_KPI_NEW_DELHI;
    if (account?.stateId === 14) return PROGRAMME_KPI_MAHARASHTRA;
    if (account?.stateId === 33) return PROGRAMME_KPI_NEW_DELHI;
    return PROGRAMME_KPI_ALL_INDIA;
  }, [account]);

  const stateDist = useMemo(() => {
    if (account?.stateName) {
      return STATE_DISTRIBUTION.filter((s) => s.state === account.stateName);
    }
    return STATE_DISTRIBUTION;
  }, [account]);

  const KPI_SPECS: KpiSpec[] = [
    {
      key: "identified",
      label: "Identified / Surveyed",
      value: kpi.identified,
      icon: KPI_ICONS.identified,
      iconBg: "bg-info-50",
      iconColor: "text-info-600",
      labelColor: "text-info-600",
      delta: "+4.2%",
    },
    {
      key: "mobilised",
      label: "Mobilised",
      value: kpi.mobilised,
      icon: KPI_ICONS.mobilised,
      iconBg: "bg-primary-50",
      iconColor: "text-primary",
      labelColor: "text-primary",
      delta: "+2.8%",
    },
    {
      key: "shelter",
      label: "Shelter Assigned",
      value: kpi.shelterAssigned,
      icon: KPI_ICONS.shelter,
      iconBg: "bg-warning-50",
      iconColor: "text-warning-600",
      labelColor: "text-warning-600",
      delta: "+1.1%",
    },
    {
      key: "rehab",
      label: "Rehabilitated",
      value: kpi.rehabilitated,
      icon: KPI_ICONS.rehab,
      iconBg: "bg-success-50",
      iconColor: "text-success-600",
      labelColor: "text-success-600",
      delta: "+6.4%",
    },
    {
      key: "disbursed",
      label: "Fund Disbursed",
      value: kpi.fundDisbursed,
      icon: KPI_ICONS.disbursed,
      iconBg: "bg-danger-50",
      iconColor: "text-danger-600",
      labelColor: "text-danger-600",
      format: "currency",
      meta: "2026-03-31 → 2026-05-14",
    },
    {
      key: "utilised",
      label: "Fund Utilised",
      value: kpi.fundUtilised,
      icon: KPI_ICONS.utilised,
      iconBg: "bg-secondary-50",
      iconColor: "text-secondary-500",
      labelColor: "text-secondary-500",
      format: "currency",
      meta: "2026-03-31 → 2026-05-14",
    },
  ];

  return (
    <div className="space-y-lg">
      <PageHeader
        eyebrow="Programme overview"
        title="Programme Overview"
        subtitle="Support For Marginalised Individuals For Livelihood &amp; Enterprise"
        actions={
          <ExportMenu
            filename="smile-programme-overview"
            title="Programme Overview"
            subtitle="Snapshot of identification, mobilisation, rehabilitation and fund metrics."
            columns={[
              { header: "Metric", accessor: "label" },
              { header: "Value", accessor: "value" },
              { header: "Delta", accessor: (r: { delta?: string }) => r.delta ?? "—" },
              { header: "Period", accessor: (r: { meta?: string }) => r.meta ?? "All-time" },
            ]}
            rows={KPI_SPECS.map((s) => ({
              label: s.label,
              value: s.format === "currency" ? `₹${s.value.toLocaleString("en-IN")}` : s.value.toLocaleString("en-IN"),
              delta: s.delta,
              meta: s.meta,
            }))}
          />
        }
      />
      <ScopeBanner />
      <DateRangeChips />

      {/* Programme Overview */}
      <section
        aria-label="Programme overview key metrics"
        className="grid grid-cols-2 gap-sm md:gap-lg lg:grid-cols-[2fr_2fr_2fr_280px]"
      >
        {KPI_SPECS.slice(0, 3).map((s) => (
          <KpiCard key={s.key} spec={s} />
        ))}
        <div className="row-span-2 hidden lg:block">
          <SystemUsersRail items={SYSTEM_USERS_ALL} />
        </div>
        {KPI_SPECS.slice(3).map((s) => (
          <KpiCard key={s.key} spec={s} />
        ))}
      </section>
      <div className="lg:hidden">
        <SystemUsersRail items={SYSTEM_USERS_ALL} />
      </div>

      {/* Beneficiary profile */}
      <div className="space-y-md">
        <SectionTitle
          eyebrow="Profile"
          title="Beneficiary distribution"
          description="Snapshot of how registered beneficiaries break down by gender, age, and type."
        />
        <div className="grid gap-lg lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Gender</CardTitle>
            </CardHeader>
            <CardContent>
              <GenderDonut data={GENDER_DISTRIBUTION} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Age</CardTitle>
            </CardHeader>
            <CardContent>
              <AgeBars data={AGE_DISTRIBUTION} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Type</CardTitle>
            </CardHeader>
            <CardContent>
              <TypeBars data={BEGGAR_TYPE} />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* State distribution */}
      <Card>
        <div className="flex items-center justify-between gap-md border-b border-stroke-100 p-lg">
          <div className="space-y-xxs">
            <CardTitle>State-wise beneficiary distribution</CardTitle>
            <p className="text-body-3 text-foreground-muted">
              Heat map across India · click a state to drill down
            </p>
          </div>
          <div className="inline-flex rounded-md border border-stroke-200 bg-white p-1 shadow-xs">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`rounded-sm px-md py-1 text-body-3 font-semibold transition-colors ${
                  tab === t.id
                    ? "bg-primary text-white shadow-xs"
                    : "text-foreground-muted hover:bg-neutral-100 hover:text-foreground"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
        <CardContent className="grid grid-cols-1 gap-lg p-lg lg:grid-cols-[1.4fr_1fr]">
          <div className="relative overflow-hidden rounded-md border border-stroke-100 bg-gradient-to-br from-primary-50/50 to-primary-50/10 p-md">
            <IndiaMap highlightState={account?.stateName ?? undefined} />
          </div>
          <div className="overflow-hidden rounded-md border border-stroke-200">
            <table className="w-full text-body-3">
              <thead className="bg-neutral-50/80 text-label-3 uppercase tracking-[0.08em] text-foreground-muted">
                <tr>
                  <th className="px-md py-sm text-left font-semibold">#</th>
                  <th className="px-md py-sm text-left font-semibold">State</th>
                  <th className="px-md py-sm text-right font-semibold">Identified</th>
                </tr>
              </thead>
              <tbody>
                {stateDist.slice(0, 12).map((row, i) => (
                  <tr
                    key={row.state}
                    className="border-b border-stroke-100 transition-colors last:border-0 hover:bg-primary-50/40"
                  >
                    <td className="px-md py-sm tabular-nums text-foreground-hint">
                      {(i + 1).toString().padStart(2, "0")}
                    </td>
                    <td className="px-md py-sm font-medium text-foreground">{row.state}</td>
                    <td className="px-md py-sm text-right font-mono tabular-nums text-foreground">
                      {row.count.toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Activity + Shelter homes */}
      <div className="grid gap-lg lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Survey activity</CardTitle>
            <span className="inline-flex items-center gap-xs rounded-full bg-info-50 px-sm py-0.5 text-label-3 font-bold uppercase tracking-[0.06em] text-info-600 ring-1 ring-inset ring-info-100">
              <BarChart3 className="h-3 w-3" /> Identified
            </span>
          </CardHeader>
          <CardContent>
            <ActivityLine data={SURVEY_ACTIVITY} series="identified" />
            <p className="mt-sm text-label-2 text-foreground-muted">
              77 surveys logged in window · low daily activity — review surveyor coverage
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Shelter homes</CardTitle>
            <span className="text-label-2 text-foreground-muted">
              5 homes across 37 locations
            </span>
          </CardHeader>
          <CardContent>
            <ShelterStateBars data={SHELTER_HOMES_BY_STATE} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
