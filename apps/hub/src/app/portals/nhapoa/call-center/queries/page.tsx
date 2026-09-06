"use client";

import * as React from "react";
import Link from "next/link";
import { PortalPageHeader, Card, SearchInput } from "@/components/nhapoa/ui";
import { useNhapoa } from "@/lib/nhapoa/store/store";
import { fmtDate } from "@/lib/nhapoa/case-helpers";
import { Icon } from "@mosje/design-system";

export default function QueryLogPage() {
  const { state, resolveQuery } = useNhapoa();
  const [q, setQ] = React.useState("");
  const rows = state.queries.filter((x) => !q.trim() || x.callerMobile.includes(q) || x.subject.toLowerCase().includes(q.toLowerCase()));

  return (
    <div>
      <PortalPageHeader
        title="Query Log"
        meta={`${state.queries.length} quer${state.queries.length === 1 ? "y" : "ies"} logged (latest first)`}
        actions={<Link href="/portals/nhapoa/call-center/query" className="inline-flex items-center gap-2 rounded-lg bg-navy px-4 py-2.5 text-label-1 font-semibold text-white hover:bg-navy-800"><Icon name="add" size={16} /> Log a query</Link>}
      />
      <SearchInput placeholder="Search by caller mobile or subject…" value={q} onChange={(e) => setQ(e.target.value)} className="mb-4 max-w-2xl" />
      {rows.length === 0 ? (
        <Card className="px-6 py-16 text-center text-body-2 text-ink-muted">No queries logged yet.</Card>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-line bg-white shadow-card">
          <table className="w-full min-w-[640px] text-left text-body-2">
            <thead>
              <tr className="border-b border-line text-label-3 uppercase text-ink-hint">
                <th className="px-5 py-3.5 font-semibold">Caller</th>
                <th className="px-5 py-3.5 font-semibold">Query</th>
                <th className="px-5 py-3.5 font-semibold">Logged</th>
                <th className="px-5 py-3.5 font-semibold">Status</th>
                <th className="px-5 py-3.5 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rows.map((x) => (
                <tr key={x.id} className="hover:bg-surface-muted/60">
                  <td className="px-5 py-4 font-mono text-body-3 text-ink">{x.callerMobile}</td>
                  <td className="px-5 py-4 max-w-[360px]"><span className="line-clamp-2 text-ink">{x.subject}</span></td>
                  <td className="px-5 py-4 text-ink-muted">{fmtDate(x.at)}</td>
                  <td className="px-5 py-4"><span className={`inline-flex rounded-full px-2.5 py-0.5 text-label-2 font-semibold ${x.status === "RESOLVED" ? "bg-approve-bg text-approve-fg" : "bg-await-bg text-await-fg"}`}>{x.status === "RESOLVED" ? "Resolved" : "Open"}</span></td>
                  <td className="px-5 py-4 text-right">{x.status === "OPEN" ? <button type="button" onClick={() => resolveQuery(x.id)} className="rounded-lg border border-line px-3 py-1.5 text-label-2 font-semibold text-navy hover:bg-navy/5">Mark Resolved</button> : <span className="text-body-3 text-ink-hint">—</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
