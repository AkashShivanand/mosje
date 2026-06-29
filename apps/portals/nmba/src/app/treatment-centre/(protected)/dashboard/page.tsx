"use client";

import * as React from "react";
import { FolderOpen, ClipboardList, Users, Smartphone, MoreVertical } from "lucide-react";
import {
  MetricCard,
  Select,
  DonutChart,
  BarChart,
  type MetricCardChange,
  type ChartDatum,
} from "@mosje/design-system";
import { useTCSession } from "@/lib/treatment-centre/session-context";
import { useTCStore } from "@/lib/treatment-centre/store";
import { DASHBOARD_CARDS, type DashboardMetric } from "@/lib/treatment-centre/roles";
import { DRUGS } from "@/lib/treatment-centre/master-data";
import {
  US_NATIONAL_KPIS,
  US_GENDER,
  US_RESIDENCE,
  US_TREATMENT,
  US_DRUGS,
  US_STATES,
  US_AGES,
} from "@/lib/treatment-centre/us-national-stats";

const ICONS: Record<string, React.ReactNode> = {
  folder: <FolderOpen className="h-5 w-5" />,
  clipboard: <ClipboardList className="h-5 w-5" />,
  users: <Users className="h-5 w-5" />,
  smartphone: <Smartphone className="h-5 w-5" />,
};

/** Trend chip per KPI: a tinted pill (value) + a muted suffix. */
const TREND: Record<DashboardMetric, { value?: string; suffix: string; dir: MetricCardChange }> = {
  patients:            { value: "12%", suffix: "vs last month", dir: "up" },
  ircaPatients:        { value: "12%", suffix: "vs last month", dir: "up" },
  beneficiaries:       { value: "8%",  suffix: "vs last month", dir: "up" },
  odicBeneficiaries:   { value: "8%",  suffix: "vs last month", dir: "up" },
  peerVolunteers:      { value: "5%",  suffix: "vs last month", dir: "up" },
  readmissions:        { suffix: "no change vs last month", dir: "flat" },
  followUps:           { value: "9%",  suffix: "vs last month", dir: "up" },
  todayPatients:       { suffix: "registered today", dir: "flat" },
  todayBeneficiaries:  { suffix: "registered today", dir: "flat" },
  todayReadmissions:   { suffix: "today", dir: "flat" },
  todayFollowUps:      { suffix: "today", dir: "flat" },
};

/** Gender slice colours (DS tokens) mirroring the Figma donut. */
const GENDER_COLORS: Record<string, string> = {
  Male: "var(--ds-primary-400)",
  Female: "var(--ds-danger)",
  Transgender: "var(--ds-primary-700)",
  "Do Not Know": "var(--ds-ink-muted)",
  "Not specified": "var(--ds-ink-muted)",
};

const MONTH_OPTIONS = [
  { label: "June 2026", value: "2026-06" },
  { label: "May 2026", value: "2026-05" },
  { label: "April 2026", value: "2026-04" },
  { label: "March 2026", value: "2026-03" },
];

/** Age bands for the Age-Wise Report (mirrors the live Under-Secretary dashboard). */
const AGE_BANDS: { label: string; test: (n: number) => boolean }[] = [
  { label: "18-25", test: (n) => n >= 18 && n <= 25 },
  { label: "26-35", test: (n) => n >= 26 && n <= 35 },
  { label: "36-55", test: (n) => n >= 36 && n <= 55 },
  { label: "56-70", test: (n) => n >= 56 && n <= 70 },
  { label: "71-100", test: (n) => n >= 71 && n <= 100 },
];

type AnalyticalFilter = "gender" | "residence" | "treatment";

function tally(values: string[]): ChartDatum[] {
  const map = new Map<string, number>();
  for (const v of values) {
    const key = v || "Not specified";
    map.set(key, (map.get(key) ?? 0) + 1);
  }
  return [...map.entries()].map(([label, value]) => ({ label, value }));
}

/** Decorative chart-options affordance (matches the Figma kebab menu). */
function CardMenuButton() {
  return (
    <button
      type="button"
      aria-label="Chart options"
      className="inline-flex h-9 w-9 items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-black/5"
    >
      <MoreVertical className="h-4 w-4" aria-hidden />
    </button>
  );
}

export default function TreatmentCentreDashboard() {
  const session = useTCSession();
  const store = useTCStore();
  const [filter, setFilter] = React.useState<AnalyticalFilter>("gender");
  const [month, setMonth] = React.useState(MONTH_OPTIONS[0].value);
  const [today, setToday] = React.useState("");

  React.useEffect(() => {
    // Resolve "today" on the client only — computing it during SSR would risk a
    // server/client hydration mismatch when their dates/time-zones differ.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setToday(new Date().toISOString().slice(0, 10));
  }, []);

  const pieHeadingId   = React.useId();
  const barHeadingId   = React.useId();
  const stateHeadingId = React.useId();
  const ageHeadingId   = React.useId();

  const counts: Record<DashboardMetric, number> = {
    patients:           store.patients.length,
    ircaPatients:       store.patients.length,
    beneficiaries:      store.beneficiaries.length,
    odicBeneficiaries:  store.beneficiaries.length,
    peerVolunteers:     store.peerEducators.reduce((s, e) => s + e.numberOfVolunteers, 0),
    readmissions:       store.readmissions.length,
    followUps:          store.followUps.length,
    // "Today's" counts — compare YYYY-MM-DD string after the date is resolved client-side
    todayPatients:      today ? store.patients.filter(p => p.dateOfAdmission === today).length : 0,
    todayBeneficiaries: today ? store.beneficiaries.filter(b => b.dateOfRegistration === today).length : 0,
    todayReadmissions:  today ? store.readmissions.filter(r => r.readmissionDate === today).length : 0,
    todayFollowUps:     today ? store.followUps.filter(f => f.followUpDate === today).length : 0,
  };

  // The US role is a national aggregator — show the captured national figures
  // instead of counting the synthetic per-centre demo records.
  const isUs = session.role === "US";
  const displayCounts: Record<DashboardMetric, number> = isUs
    ? {
        ...counts,
        patients: US_NATIONAL_KPIS.totalRegistration,
        todayPatients: US_NATIONAL_KPIS.todayRegistration,
        readmissions: US_NATIONAL_KPIS.reAdmission,
        todayReadmissions: US_NATIONAL_KPIS.todayReAdmission,
        followUps: US_NATIONAL_KPIS.followUp,
        todayFollowUps: US_NATIONAL_KPIS.todayFollowUp,
      }
    : counts;

  const cards = DASHBOARD_CARDS[session.role];

  const pieData: ChartDatum[] = React.useMemo(() => {
    // National aggregator — use the captured live distributions.
    if (session.role === "US") {
      if (filter === "residence") return US_RESIDENCE;
      if (filter === "treatment") return US_TREATMENT;
      return US_GENDER;
    }

    const isOdic = session.role === "ODIC";

    if (filter === "gender") {
      const pGenders = !isOdic ? store.patients.map(p => p.gender) : [];
      const bGenders = isOdic  ? store.beneficiaries.map(b => b.gender) : [];
      return tally([...pGenders, ...bGenders]);
    }
    if (filter === "residence") {
      const pRes = !isOdic ? store.patients.map(p => p.placeOfResidence) : [];
      const bRes = isOdic  ? store.beneficiaries.map(b => b.placeOfResidence) : [];
      return tally([...pRes, ...bRes]);
    }
    if (filter === "treatment") {
      const pTreatment = !isOdic ? store.patients.map(p => {
        const val = p.previousDrugTreatment || p.clinicalDetails?.["Previous treatment"] || "No";
        return val === "Yes" ? "Previously Treated" : "First-time Treatment";
      }) : [];
      const bTreatment = isOdic ? store.beneficiaries.map(b => {
        const val = b.details?.["Previous treatment"] || b.details?.["Previous Treatment"] || "No";
        return val === "Yes" ? "Previously Treated" : "First-time Treatment";
      }) : [];
      return tally([...pTreatment, ...bTreatment]);
    }
    const pProg = !isOdic ? store.patients.map(p => p.registrationProgress) : [];
    const bProg = isOdic  ? store.beneficiaries.map(b => b.registrationProgress) : [];
    return tally([...pProg, ...bProg]);
  }, [session.role, filter, store.patients, store.beneficiaries]);

  // Colour gender slices to mirror the Figma donut; other filters use the palette.
  const pieDataColored = React.useMemo<ChartDatum[]>(
    () => (filter === "gender" ? pieData.map(d => ({ ...d, color: GENDER_COLORS[d.label] })) : pieData),
    [filter, pieData],
  );

  const drugData: ChartDatum[] = React.useMemo(() => {
    if (session.role === "US") return US_DRUGS;
    const map = new Map<string, number>();
    for (const p of store.patients) {
      for (const row of p.drugUse) {
        if (!row.drug) continue;
        const short = DRUGS.find(d => d.label === row.drug)?.label.split(",")[0] ?? row.drug;
        map.set(short, (map.get(short) ?? 0) + 1);
      }
    }
    return [...map.entries()].map(([label, value]) => ({ label, value }));
  }, [session.role, store.patients]);

  // State Wise Report — aggregate patients + beneficiaries by state
  const stateData: ChartDatum[] = React.useMemo(() => {
    if (session.role === "US") return US_STATES;
    const map = new Map<string, number>();
    for (const p of store.patients) {
      const s = p.state?.trim() || "Unknown";
      map.set(s, (map.get(s) ?? 0) + 1);
    }
    for (const b of store.beneficiaries) {
      const s = (b.state as string | undefined)?.trim() || "Unknown";
      map.set(s, (map.get(s) ?? 0) + 1);
    }
    return [...map.entries()]
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value);
  }, [session.role, store.patients, store.beneficiaries]);

  // Uniform bar colours (DS tokens) matching the Figma single-hue bar charts.
  const drugDataColored = React.useMemo<ChartDatum[]>(
    () => drugData.map(d => ({ ...d, color: "var(--ds-primary-300)" })),
    [drugData],
  );
  const stateDataColored = React.useMemo<ChartDatum[]>(
    () => stateData.map(d => ({ ...d, color: "var(--ds-primary-400)" })),
    [stateData],
  );

  // Age Wise Report — bucket patient + beneficiary ages into the live age bands.
  const ageData: ChartDatum[] = React.useMemo(() => {
    if (session.role === "US") return US_AGES;
    const counts = AGE_BANDS.map(b => ({ label: b.label, value: 0 }));
    let other = 0;
    const ages = [
      ...store.patients.map(p => Number(p.age)),
      ...store.beneficiaries.map(b => Number(b.age)),
    ];
    for (const a of ages) {
      const idx = Number.isFinite(a) ? AGE_BANDS.findIndex(b => b.test(a)) : -1;
      if (idx >= 0) counts[idx].value += 1;
      else other += 1;
    }
    return [...counts, { label: "Other", value: other }];
  }, [session.role, store.patients, store.beneficiaries]);

  const ageDataColored = React.useMemo<ChartDatum[]>(
    () => ageData.map(d => ({ ...d, color: "var(--ds-primary-300)" })),
    [ageData],
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Page head — title + centre + period filter */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-semibold leading-9 text-ink-strong">Dashboard</h1>
          <p className="mt-1 text-base text-ink-muted">{session.centerName}</p>
        </div>
        <label className="sr-only" htmlFor="dashboard-month">Reporting period</label>
        <Select
          id="dashboard-month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          options={MONTH_OPTIONS}
        />
      </div>

      {/* KPI cards */}
      <section aria-label="Key metrics" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <MetricCard
            key={card.label}
            label={card.label}
            value={displayCounts[card.metric].toLocaleString("en-IN")}
            icon={ICONS[card.icon]}
            changeValue={TREND[card.metric].value}
            changeLabel={TREND[card.metric].suffix}
            changeDirection={TREND[card.metric].dir}
          />
        ))}
      </section>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <section aria-labelledby={pieHeadingId} className="rounded-xl border border-line bg-white p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 id={pieHeadingId} className="text-base font-semibold text-ink">Analytical Report</h2>
            <div className="flex items-center gap-2">
              <Select
                aria-label="Analytical report filter"
                value={filter}
                onChange={(e) => setFilter(e.target.value as AnalyticalFilter)}
                options={[
                  { label: "Gender",             value: "gender" },
                  { label: "Place of Residence", value: "residence" },
                  { label: "Treatment Taken",    value: "treatment" },
                ]}
              />
              <CardMenuButton />
            </div>
          </div>
          <DonutChart data={pieDataColored} title="Analytical report distribution" />
        </section>

        <section aria-labelledby={barHeadingId} className="rounded-xl border border-line bg-white p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 id={barHeadingId} className="text-base font-semibold text-ink">Drug Distribution</h2>
            <CardMenuButton />
          </div>
          <BarChart
            data={drugDataColored}
            title="Drug distribution"
            yLabel="Number of Patients"
            orientation="horizontal"
            showValues
          />
        </section>

        <section aria-labelledby={stateHeadingId} className="rounded-xl border border-line bg-white p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 id={stateHeadingId} className="text-base font-semibold text-ink">State Wise Report</h2>
            <CardMenuButton />
          </div>
          <BarChart
            data={stateDataColored}
            title="State wise patient/beneficiary count"
            yLabel="Number of Patients"
            showValues
          />
        </section>

        <section aria-labelledby={ageHeadingId} className="rounded-xl border border-line bg-white p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 id={ageHeadingId} className="text-base font-semibold text-ink">Age Wise Report</h2>
            <CardMenuButton />
          </div>
          <BarChart
            data={ageDataColored}
            title="Age wise patient/beneficiary count"
            yLabel="Number of Patients"
            showValues
          />
        </section>
      </div>
    </div>
  );
}
