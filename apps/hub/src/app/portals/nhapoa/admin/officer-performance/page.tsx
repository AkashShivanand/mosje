"use client";

import { PortalPageHeader, Card } from "@/components/nhapoa/ui";
import { useNhapoa } from "@/lib/nhapoa/store/store";
import { ROLES } from "@/lib/nhapoa/roles";
import type { RoleId } from "@/lib/nhapoa/store/types";

const FIELD_ROLES: RoleId[] = ["district-officer", "sho", "state-authority", "finance-officer"];

export default function OfficerPerformancePage() {
  const { state } = useNhapoa();
  const officers = state.users.filter((u) => FIELD_ROLES.includes(u.role));

  const handled = (username: string, role: RoleId) =>
    state.cases.filter((c) => c.assignedOfficer === username || c.timeline.some((t) => t.byRole === role)).length;

  return (
    <div>
      <PortalPageHeader title="Officer Performance" meta="Case handling across officers" />
      <Card className="overflow-x-auto p-0">
        <table className="w-full min-w-[640px] text-left text-body-2">
          <thead>
            <tr className="border-b border-line text-label-3 uppercase text-ink-hint">
              <th className="px-5 py-3.5 font-semibold">Officer</th>
              <th className="px-5 py-3.5 font-semibold">Role</th>
              <th className="px-5 py-3.5 font-semibold">District / State</th>
              <th className="px-5 py-3.5 text-right font-semibold">Cases Handled</th>
              <th className="px-5 py-3.5 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {officers.map((u) => (
              <tr key={u.id} className="hover:bg-surface-muted/60">
                <td className="px-5 py-4"><div className="font-medium text-ink">{u.name}</div><div className="font-mono text-body-3 text-ink-hint">{u.username}</div></td>
                <td className="px-5 py-4 text-ink">{ROLES[u.role as Exclude<RoleId, "citizen">]?.label}</td>
                <td className="px-5 py-4 text-ink-muted">{[u.district, u.state].filter(Boolean).join(", ") || "—"}</td>
                <td className="px-5 py-4 text-right font-semibold text-ink">{handled(u.username, u.role)}</td>
                <td className="px-5 py-4"><span className={`inline-flex rounded-full px-2.5 py-0.5 text-label-2 font-semibold ${u.active ? "bg-approve-bg text-approve-fg" : "bg-slate-100 text-slate-500"}`}>{u.active ? "Active" : "Inactive"}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
