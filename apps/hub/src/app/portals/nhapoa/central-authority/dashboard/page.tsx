"use client";

import * as React from "react";
import { PortalPageHeader, StatTile, Card } from "@/components/nhapoa/ui";
import { useNhapoa } from "@/lib/nhapoa/store/store";

export default function CADashboard() {
  const { state } = useNhapoa();
  const total = state.cases.length;
  const resolved = state.cases.filter((c) => c.status === "CLOSED").length;
  const resolutionRate = total ? Math.round((resolved / total) * 100) : 0;

  const topStates = React.useMemo(() => {
    const m: Record<string, number> = {};
    for (const c of state.cases) m[c.state] = (m[c.state] ?? 0) + 1;
    return Object.entries(m).sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [state.cases]);
  const maxState = Math.max(1, ...topStates.map(([, v]) => v));

  return (
    <div>
      <PortalPageHeader title="Central Authority Dashboard" meta="SAMBAL scheme overview across all states" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="Total Grievances" value={total} />
        <StatTile label="Resolution Rate" value={`${resolutionRate}%`} accent="approve" />
        <StatTile label="SLA Compliance Rate" value="99%" />
        <StatTile label="States Covered" value={topStates.length} accent="await" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-title-2 text-ink">Top States by Grievances</h2>
          <p className="text-body-3 text-ink-hint">Highest grievance volume this FY</p>
          <div className="mt-5 space-y-4">
            {topStates.map(([st, v]) => (
              <div key={st}>
                <div className="mb-1 flex justify-between text-body-3"><span className="text-ink-muted">{st}</span><span className="font-semibold text-ink">{v}</span></div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-line"><div className="h-full rounded-full bg-navy/70" style={{ width: `${(v / maxState) * 100}%` }} /></div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-title-2 text-ink">National SLA Compliance</h2>
          <p className="text-body-3 text-ink-hint">Target: 90%</p>
          <div className="mt-8 flex items-center justify-center">
            <div className="relative grid h-40 w-40 place-items-center rounded-full" style={{ background: "conic-gradient(var(--sa-color-status-success) 0% 99%, var(--sa-border-neutral-base) 99% 100%)" }}>
              <div className="grid h-28 w-28 place-items-center rounded-full bg-white">
                <span className="text-headline-2 font-bold tabular-nums text-approve-fg">99%</span>
              </div>
            </div>
          </div>
          <p className="mt-4 text-center text-body-3 text-ink-hint">National average · above the 90% target</p>
        </Card>
      </div>
    </div>
  );
}
