"use client";

import * as React from "react";
import { PortalPageHeader, Card, StatTile } from "@/components/nhapoa/ui";
import { useNhapoa } from "@/lib/nhapoa/store/store";
import { CASE_STATUS_META, type CaseStatus } from "@/lib/nhapoa/store/types";

export default function AnalyticsPage() {
  const { state } = useNhapoa();

  const byCat = React.useMemo(() => {
    const m: Record<string, number> = {};
    for (const c of state.cases) m[c.category] = (m[c.category] ?? 0) + 1;
    return Object.entries(m).sort((a, b) => b[1] - a[1]);
  }, [state.cases]);
  const maxCat = Math.max(1, ...byCat.map(([, v]) => v));

  const byStatus = React.useMemo(() => {
    const m: Partial<Record<CaseStatus, number>> = {};
    for (const c of state.cases) m[c.status] = (m[c.status] ?? 0) + 1;
    return m;
  }, [state.cases]);
  const statuses = Object.keys(CASE_STATUS_META) as CaseStatus[];

  return (
    <div>
      <PortalPageHeader title="Grievance Analytics" meta="Category and status distribution across the portal" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatTile label="Total Grievances" value={state.cases.length} />
        <StatTile label="Distinct Categories" value={byCat.length} accent="await" />
        <StatTile label="Closed" value={byStatus.CLOSED ?? 0} accent="approve" />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-title-2 text-ink">By Category</h2>
          <div className="mt-5 space-y-3">
            {byCat.map(([cat, v]) => (
              <div key={cat}>
                <div className="mb-1 flex justify-between text-body-3"><span className="line-clamp-1 text-ink-muted">{cat}</span><span className="font-semibold text-ink">{v}</span></div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-line"><div className="h-full rounded-full bg-navy/70" style={{ width: `${(v / maxCat) * 100}%` }} /></div>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-6">
          <h2 className="text-title-2 text-ink">By Status</h2>
          <ul className="mt-4 space-y-2 text-body-2">
            {statuses.map((s) => (
              <li key={s} className="flex items-center justify-between border-b border-line pb-2 last:border-0">
                <span className="text-ink-muted">{CASE_STATUS_META[s].label}</span>
                <span className="font-semibold text-ink">{byStatus[s] ?? 0}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
