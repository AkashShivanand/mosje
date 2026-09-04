"use client";

import * as React from "react";
import { PageHeader, StatTile, Card } from "@/components/nhapoa/ui";
import { useNhapoa } from "@/lib/nhapoa/store/store";
import { CASE_STATUS_META, type CaseStatus } from "@/lib/nhapoa/store/types";

const FUNNEL: CaseStatus[] = ["SUBMITTED", "ASSIGNED", "UNDER_INVESTIGATION", "PENDING_APPROVAL", "APPROVED", "DISBURSED", "CLOSED"];

export default function AdminDashboard() {
  const { state } = useNhapoa();
  const total = state.cases.length;
  const pending = state.cases.filter((c) => !["CLOSED", "DISBURSED"].includes(c.status)).length;
  const resolved = state.cases.filter((c) => c.status === "CLOSED").length;

  const counts = React.useMemo(() => {
    const by: Partial<Record<CaseStatus, number>> = {};
    for (const c of state.cases) by[c.status] = (by[c.status] ?? 0) + 1;
    return by;
  }, [state.cases]);
  const maxFunnel = Math.max(1, ...FUNNEL.map((s) => counts[s] ?? 0));

  return (
    <div>
      <PageHeader title="System Overview" subtitle="Real-time SAMBAL portal monitoring" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="Total Grievances" value={total} />
        <StatTile label="Pending Cases" value={pending} accent="await" />
        <StatTile label="Resolved Cases" value={resolved} accent="approve" />
        <StatTile label="Active Users" value={state.users.filter((u) => u.active).length} />
      </div>

      <Card className="mt-6 p-6">
        <h2 className="text-title-2 text-ink">Grievance Lifecycle Funnel</h2>
        <p className="text-body-3 text-ink-hint">Distribution across statuses</p>
        <div className="mt-6 space-y-3">
          {FUNNEL.map((s) => (
            <div key={s} className="flex items-center gap-3">
              <span className="w-40 shrink-0 text-body-3 text-ink-muted">{CASE_STATUS_META[s].label}</span>
              <div className="h-6 flex-1 overflow-hidden rounded bg-line">
                <div className="flex h-full items-center rounded bg-navy/70 px-2 text-label-2 font-semibold text-white" style={{ width: `${Math.max(6, ((counts[s] ?? 0) / maxFunnel) * 100)}%` }}>{counts[s] ?? 0}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
