"use client";

import * as React from "react";
import { FolderOpen, ClipboardList, Users, Smartphone } from "lucide-react";
import { MetricCard, Select, type MetricCardChange } from "@mosje/design-system";
import { useTCSession } from "@/lib/treatment-centre/session-context";
import { useTCStore } from "@/lib/treatment-centre/store";
import { DASHBOARD_CARDS, type DashboardMetric } from "@/lib/treatment-centre/roles";
import { PieChart, BarChart, type ChartDatum } from "@/components/treatment-centre/tc-charts";
import { DRUGS } from "@/lib/treatment-centre/master-data";

const ICONS: Record<string, React.ReactNode> = {
  folder: <FolderOpen className="h-5 w-5" />,
  clipboard: <ClipboardList className="h-5 w-5" />,
  users: <Users className="h-5 w-5" />,
  smartphone: <Smartphone className="h-5 w-5" />,
};

/** Demo month-over-month trend per metric (synthetic data portal). */
const TREND: Record<DashboardMetric, { label: string; dir: MetricCardChange }> = {
  patients: { label: "+12% vs last month", dir: "up" },
  ircaPatients: { label: "+12% vs last month", dir: "up" },
  beneficiaries: { label: "+8% vs last month", dir: "up" },
  odicBeneficiaries: { label: "+8% vs last month", dir: "up" },
  peerVolunteers: { label: "+5% vs last month", dir: "up" },
  followUps: { label: "+9% vs last month", dir: "up" },
  readmissions: { label: "no change vs last month", dir: "flat" },
};

type AnalyticalFilter = "gender" | "residence" | "treatment";

function tally(values: string[]): ChartDatum[] {
  const map = new Map<string, number>();
  for (const v of values) {
    const key = v || "Not specified";
    map.set(key, (map.get(key) ?? 0) + 1);
  }
  return [...map.entries()].map(([label, value]) => ({ label, value }));
}

export default function TreatmentCentreDashboard() {
  const session = useTCSession();
  const store = useTCStore();
  const [filter, setFilter] = React.useState<AnalyticalFilter>("gender");
  const [updatedAt, setUpdatedAt] = React.useState("");
  React.useEffect(() => {
    setUpdatedAt(
      new Date().toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    );
  }, []);
  const overviewHeadingId = React.useId();
  const analyticsHeadingId = React.useId();
  const pieHeadingId = React.useId();
  const barHeadingId = React.useId();

  const counts: Record<DashboardMetric, number> = {
    patients: store.patients.length,
    ircaPatients: store.patients.length,
    beneficiaries: store.beneficiaries.length,
    odicBeneficiaries: store.beneficiaries.length,
    peerVolunteers: store.peerEducators.reduce((sum, e) => sum + e.numberOfVolunteers, 0),
    readmissions: store.readmissions.length,
    followUps: store.followUps.length,
  };

  const cards = DASHBOARD_CARDS[session.role];

  // Analytical report draws from patients (IRCA/DDAC) or beneficiaries (ODIC).
  const pieData: ChartDatum[] = React.useMemo(() => {
    if (session.role === "ODIC") {
      if (filter === "gender") return tally(store.beneficiaries.map((b) => b.gender));
      if (filter === "residence") return tally(store.beneficiaries.map((b) => b.placeOfResidence));
      return tally(store.beneficiaries.map((b) => b.registrationProgress));
    }
    if (filter === "gender") return tally(store.patients.map((p) => p.gender));
    if (filter === "residence") return tally(store.patients.map((p) => p.placeOfResidence));
    return tally(store.patients.map((p) => p.registrationProgress));
  }, [session.role, filter, store.patients, store.beneficiaries]);

  const drugData: ChartDatum[] = React.useMemo(() => {
    const map = new Map<string, number>();
    for (const p of store.patients) {
      for (const row of p.drugUse) {
        if (!row.drug) continue;
        const short = DRUGS.find((d) => d.label === row.drug)?.label.split(",")[0] ?? row.drug;
        map.set(short, (map.get(short) ?? 0) + 1);
      }
    }
    return [...map.entries()].map(([label, value]) => ({ label, value }));
  }, [store.patients]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold text-ink">Dashboard</h1>
        <p className="mt-0.5 text-sm text-ink-muted">
          {session.role} · {session.centerName}
        </p>
        {updatedAt && (
          <p className="mt-0.5 text-xs text-ink-muted">Last updated: {updatedAt}</p>
        )}
      </div>

      {/* Stat cards */}
      <section aria-labelledby={overviewHeadingId} className="flex flex-col gap-3">
        <h2
          id={overviewHeadingId}
          className="text-xs font-semibold uppercase tracking-wide text-ink-muted"
        >
          Overview
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => (
            <MetricCard
              key={card.label}
              label={card.label}
              value={counts[card.metric].toLocaleString("en-IN")}
              icon={ICONS[card.icon]}
              changeLabel={TREND[card.metric].label}
              changeDirection={TREND[card.metric].dir}
            />
          ))}
        </div>
      </section>

      {/* Charts */}
      <section aria-labelledby={analyticsHeadingId} className="flex flex-col gap-3">
        <h2
          id={analyticsHeadingId}
          className="text-xs font-semibold uppercase tracking-wide text-ink-muted"
        >
          Analytics
        </h2>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <section aria-labelledby={pieHeadingId} className="rounded-xl border border-line bg-white p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h3 id={pieHeadingId} className="text-base font-semibold text-ink">Analytical Report</h3>
            <label className="flex items-center gap-2 text-sm text-ink-muted">
              Analytical report filter
              <Select
                value={filter}
                onChange={(e) => setFilter(e.target.value as AnalyticalFilter)}
                options={[
                  { label: "Gender", value: "gender" },
                  { label: "Place of Residence", value: "residence" },
                  { label: "Treatment Taken", value: "treatment" },
                ]}
              />
            </label>
          </div>
          <PieChart data={pieData} title="Analytical report distribution" />
        </section>

        <section aria-labelledby={barHeadingId} className="rounded-xl border border-line bg-white p-5">
          <h3 id={barHeadingId} className="mb-4 text-base font-semibold text-ink">Drug Distribution</h3>
          <BarChart data={drugData} title="Drug distribution" yLabel="Number of Patients" />
        </section>
        </div>
      </section>
    </div>
  );
}
