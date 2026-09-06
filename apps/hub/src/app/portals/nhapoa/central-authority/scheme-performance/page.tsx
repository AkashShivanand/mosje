"use client";

import * as React from "react";
import { PortalPageHeader, StatTile } from "@/components/nhapoa/ui";
import { useNhapoa } from "@/lib/nhapoa/store/store";
import { Icon, Card, Button } from "@mosje/design-system";

export default function SchemePerformancePage() {
  const { state } = useNhapoa();

  const byCategory = React.useMemo(() => {
    const m: Record<string, number> = {};
    for (const c of state.cases) m[c.category] = (m[c.category] ?? 0) + 1;
    return Object.entries(m).sort((a, b) => b[1] - a[1]);
  }, [state.cases]);
  const maxCat = Math.max(1, ...byCategory.map(([, v]) => v));

  const byRole = React.useMemo(() => {
    const m: Record<string, number> = {};
    for (const c of state.cases) m[c.complainantRole] = (m[c.complainantRole] ?? 0) + 1;
    return Object.entries(m);
  }, [state.cases]);

  return (
    <div>
      <PortalPageHeader title="Scheme Performance Analytics" meta="Beneficiaries, categories and submission roles" actions={<Button appearance="outlined"><Icon name="download" size={16} /> Export</Button>} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="Total Beneficiaries" value={state.cases.length} />
        <StatTile label="Top Category" value={byCategory[0]?.[1] ?? 0} accent="await" />
        <StatTile label="Cases Closed" value={state.cases.filter((c) => c.status === "CLOSED").length} accent="approve" />
        <StatTile label="Categories" value={byCategory.length} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-title-2 text-ink">Grievance Category Breakdown</h2>
          <div className="mt-5 space-y-3">
            {byCategory.map(([cat, v]) => (
              <div key={cat}>
                <div className="mb-1 flex justify-between text-body-3"><span className="line-clamp-1 text-ink-muted">{cat}</span><span className="font-semibold text-ink">{v}</span></div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-line"><div className="h-full rounded-full bg-navy/70" style={{ width: `${(v / maxCat) * 100}%` }} /></div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-title-2 text-ink">Submission Role Breakdown</h2>
          <div className="mt-5 space-y-3">
            {byRole.map(([role, v]) => (
              <div key={role} className="flex items-center justify-between border-b border-line pb-2 last:border-0">
                <span className="text-body-2 text-ink-muted">{role}</span>
                <span className="text-title-3 text-ink">{v}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
