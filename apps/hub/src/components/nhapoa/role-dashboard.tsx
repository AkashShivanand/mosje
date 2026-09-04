"use client";

import * as React from "react";
import { PageHeader, StatTile, Card } from "./ui";
import { useNhapoa } from "@/lib/nhapoa/store/store";
import { ROLES } from "@/lib/nhapoa/roles";
import { CASE_STATUS_META, type CaseStatus, type RoleId } from "@/lib/nhapoa/store/types";

/**
 * NHA-1 foundation dashboard shared by every admin role. Shows live counts
 * derived from the shared store, proving the cross-role store is wired. The
 * role-specific screens (cases, approvals, queue, etc.) land in NHA-3…NHA-8.
 */
export function RoleDashboard({ roleId }: { roleId: Exclude<RoleId, "citizen"> }) {
  const { state } = useNhapoa();
  const role = ROLES[roleId];

  const counts = React.useMemo(() => {
    const by: Partial<Record<CaseStatus, number>> = {};
    for (const c of state.cases) by[c.status] = (by[c.status] ?? 0) + 1;
    return by;
  }, [state.cases]);

  const highlight: CaseStatus =
    roleId === "state-authority"
      ? "PENDING_APPROVAL"
      : roleId === "finance-officer"
        ? "APPROVED"
        : "SUBMITTED";

  return (
    <div>
      <PageHeader
        title={`${role.label} Dashboard`}
        subtitle="NHAPOA administration · live counts from the shared case store"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="Total Cases" value={state.cases.length} />
        <StatTile label={CASE_STATUS_META[highlight].label} value={counts[highlight] ?? 0} accent="await" />
        <StatTile label="Disbursed" value={counts.DISBURSED ?? 0} accent="approve" />
        <StatTile label="Sent Back" value={counts.SENT_BACK ?? 0} accent="reject" />
      </div>

      <Card className="mt-6 p-6">
        <h2 className="text-title-2 text-ink">Case status breakdown</h2>
        <ul className="mt-4 space-y-2 text-body-2">
          {(Object.keys(CASE_STATUS_META) as CaseStatus[]).map((st) => (
            <li key={st} className="flex items-center justify-between border-b border-line pb-2 last:border-0">
              <span className="text-ink-muted">{CASE_STATUS_META[st].label}</span>
              <span className="font-semibold text-ink">{counts[st] ?? 0}</span>
            </li>
          ))}
        </ul>
        <p className="mt-5 rounded-lg bg-surface-muted px-4 py-3 text-body-3 text-ink-muted">
          Foundation screen (NHA-1). The full {role.label} workflow screens are delivered in a
          later issue — this dashboard confirms the shared store, mock auth, and role shell are live.
        </p>
      </Card>
    </div>
  );
}
