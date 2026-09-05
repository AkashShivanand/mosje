"use client";

/**
 * Attendance Master — monthly attendance for one project.
 *
 * DS Audit: Tabs ✅ existing · MetricCard ✅ · BarChart ✅ · ChartCard ✅ · Badge ✅ ·
 * FormField ✅ · Select ✅ · EmptyState ✅ — nothing new.
 *
 * Three tabs (Dashboard / Monthly Returns / History), the four stat tiles, the
 * "ATTENDANCE TREND (MONTHLY AVERAGE %)" chart and all three tables are transcribed from the
 * live screen (walkthrough 2026-08-22).
 */

import * as React from "react";
import {
  Badge,
  BarChart,
  ChartCard,
  FormField,
  MetricCard,
  Select,
  Tabs,
  categoricalColor,
} from "@mosje/design-system";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { ngoApplications } from "@/lib/e-anudaan/selectors";
import { buildMonthlyReturns } from "@/lib/e-anudaan/roster";

const TABS = [
  { id: "dashboard", label: "Dashboard" },
  { id: "returns", label: "Monthly Returns" },
  { id: "history", label: "History" },
];

export default function AttendanceMasterPage() {
  const { state } = useEAnudaan();
  const idBase = React.useId();
  const ngo = state.ngos[0];

  const projects = React.useMemo(() => {
    if (!ngo) return [];
    const seen = new Map<string, string>();
    for (const a of ngoApplications(state, ngo.id)) {
      if (!seen.has(a.id)) seen.set(a.id, a.projectLabel);
    }
    return [...seen.entries()].map(([id, label]) => ({ id, label }));
  }, [state, ngo]);

  // Derived, not synced: an empty selection simply means "the first project".
  const [projectChoice, setProjectChoice] = React.useState("");
  const project = projectChoice || projects[0]?.id || "";
  const [tab, setTab] = React.useState(0);

  const rows = React.useMemo(() => buildMonthlyReturns(), []);
  const projectLabel = projects.find((p) => p.id === project)?.label ?? "your selected project";

  const submitted = rows.length;
  // Every month on record has been submitted, so nothing is outstanding — the live account
  // reads "11 submitted · 0 awaiting · 11 on record" for exactly this reason.
  const awaiting = rows.filter((r) => r.status !== "Submitted").length;
  const average = submitted
    ? Math.round(rows.reduce((a, r) => a + r.percent, 0) / submitted)
    : 0;

  // Oldest first for the trend, as the live chart reads Apr → Mar. One measure over time is a
  // single series, so every bar carries the same colour rather than a categorical rotation.
  const trendColor = categoricalColor(0);
  const trend = [...rows].reverse().map((r) => ({
    label: r.month.split(" ")[0]!.slice(0, 3),
    value: r.percent,
    color: trendColor,
  }));

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-headline-1 text-ink">Attendance Master</h1>
        <p className="mt-1 text-body-2 text-ink-muted">Monthly attendance for {projectLabel}.</p>
      </header>

      <FormField label="Scheme / Project" id="master-project">
        {(control) => (
          <Select {...control} value={project} onChange={(e) => setProjectChoice(e.target.value)}>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </Select>
        )}
      </FormField>

      <Tabs tabs={TABS} active={tab} onChange={setTab} idBase={idBase} ariaLabel="Attendance master sections" />

      {tab === 0 && (
        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard label="Months Submitted" value={String(submitted)} />
            <MetricCard label="Awaiting Submission" value={String(awaiting)} />
            <MetricCard label="Average Attendance" value={`${average}%`} />
            <MetricCard label="Months on Record" value={String(submitted)} />
          </div>

          <ChartCard
            title="Attendance trend (monthly average %)"
            actions={<Badge status="info">{submitted} months</Badge>}
          >
            <BarChart
              title="Attendance trend, monthly average percentage"
              data={trend}
              yLabel="Average present (%)"
              valueFormat={(v) => `${v.toFixed(1)}%`}
              showValues
            />
          </ChartCard>

          <section className="rounded-xl border border-line bg-surface p-5">
            <h2 className="text-title-2 text-ink">Recent Attendance Records</h2>
            <ReturnsTable rows={rows.slice(0, 5)} caption="Recent attendance records" />
          </section>
        </div>
      )}

      {tab === 1 && (
        <section className="space-y-3 rounded-xl border border-line bg-surface p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-title-2 text-ink">Monthly Attendance Returns</h2>
            <Badge status="info">{submitted} months</Badge>
          </div>
          <ReturnsTable rows={rows} caption="Monthly attendance returns" withAction />
        </section>
      )}

      {tab === 2 && (
        <section className="space-y-3 rounded-xl border border-line bg-surface p-5">
          <h2 className="text-title-2 text-ink">Attendance History (submitted)</h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[34rem] text-body-2">
              <caption className="sr-only">Attendance history</caption>
              <thead>
                <tr className="border-b border-line text-left text-label-3 uppercase text-ink-muted">
                  <th scope="col" className="pb-2 pr-3 font-medium">Month</th>
                  <th scope="col" className="pb-2 pr-3 font-medium">FY</th>
                  <th scope="col" className="pb-2 pr-3 font-medium">Avg %</th>
                  <th scope="col" className="pb-2 pr-3 font-medium">Status</th>
                  <th scope="col" className="pb-2 font-medium">Submitted On</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.month} className="border-b border-line">
                    <td className="py-2 pr-3 text-ink">{r.month}</td>
                    <td className="py-2 pr-3 text-ink">{r.fy}</td>
                    <td className="py-2 pr-3 text-ink">{r.percent.toFixed(1)}%</td>
                    <td className="py-2 pr-3"><Badge status="success">{r.status}</Badge></td>
                    <td className="py-2 font-mono text-ink">{r.submittedOn}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}

function ReturnsTable({
  rows,
  caption,
  withAction = false,
}: {
  rows: ReturnType<typeof buildMonthlyReturns>;
  caption: string;
  withAction?: boolean;
}) {
  return (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full min-w-[34rem] text-body-2">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b border-line text-left text-label-3 uppercase text-ink-muted">
            <th scope="col" className="pb-2 pr-3 font-medium">Month</th>
            <th scope="col" className="pb-2 pr-3 font-medium">Beneficiaries</th>
            <th scope="col" className="pb-2 pr-3 font-medium">Avg Present</th>
            <th scope="col" className="pb-2 pr-3 font-medium">%</th>
            <th scope="col" className="pb-2 pr-3 font-medium">Status</th>
            {withAction && <th scope="col" className="pb-2 font-medium"><span className="sr-only">Action</span></th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.month} className="border-b border-line">
              <td className="py-2 pr-3 text-ink">{r.month}</td>
              <td className="py-2 pr-3 text-ink">{r.beneficiaries}</td>
              <td className="py-2 pr-3 text-ink">{r.avgPresent}</td>
              <td className="py-2 pr-3 text-ink">{r.percent.toFixed(1)}%</td>
              <td className="py-2 pr-3"><Badge status="success">{r.status}</Badge></td>
              {withAction && <td className="py-2 text-ink-muted">Submitted</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
