"use client";

import * as React from "react";
import { PortalPageHeader, SearchInput, Card, StatusPill } from "@/components/nhapoa/ui";
import { SlaPill, PriorityBadge } from "@/components/nhapoa/case-views";
import { useNhapoa } from "@/lib/nhapoa/store/store";
import { fmtDate } from "@/lib/nhapoa/case-helpers";

export default function NationalGrievancesPage() {
  const { state } = useNhapoa();
  const [q, setQ] = React.useState("");
  const cases = state.cases.filter((c) => !q.trim() || c.refNo.toLowerCase().includes(q.toLowerCase()) || c.complainant.name.toLowerCase().includes(q.toLowerCase()) || c.category.toLowerCase().includes(q.toLowerCase()) || c.state.toLowerCase().includes(q.toLowerCase()));

  return (
    <div>
      <PortalPageHeader title="National Grievances" meta={`${state.cases.length} grievances across all states`} />
      <SearchInput placeholder="Search by grievance ID, citizen name, state…" value={q} onChange={(e) => setQ(e.target.value)} className="mb-4 max-w-2xl" />
      {cases.length === 0 ? (
        <Card className="px-6 py-16 text-center text-body-2 text-ink-muted">No grievances match your search.</Card>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-line bg-white shadow-card">
          <table className="w-full min-w-[820px] text-left text-body-2">
            <thead>
              <tr className="border-b border-line text-label-3 uppercase text-ink-hint">
                <th className="px-5 py-3.5 font-semibold">Grievance ID</th>
                <th className="px-5 py-3.5 font-semibold">Citizen</th>
                <th className="px-5 py-3.5 font-semibold">Category</th>
                <th className="px-5 py-3.5 font-semibold">State</th>
                <th className="px-5 py-3.5 font-semibold">Submitted</th>
                <th className="px-5 py-3.5 font-semibold">SLA</th>
                <th className="px-5 py-3.5 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {cases.map((c) => (
                <tr key={c.id} className="hover:bg-surface-muted/60">
                  <td className="px-5 py-4"><span className="font-mono text-body-3 font-semibold text-navy">{c.refNo}</span><PriorityBadge case={c} /></td>
                  <td className="px-5 py-4 text-ink">{c.complainant.name}</td>
                  <td className="px-5 py-4 max-w-[200px]"><span className="line-clamp-2 text-ink">{c.category}</span></td>
                  <td className="px-5 py-4 text-ink-muted">{c.state}</td>
                  <td className="px-5 py-4 text-ink-muted">{fmtDate(c.createdAt)}</td>
                  <td className="px-5 py-4"><SlaPill case={c} /></td>
                  <td className="px-5 py-4"><StatusPill status={c.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
