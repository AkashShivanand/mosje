"use client";

import * as React from "react";
import { PortalPageHeader, SearchInput, Button } from "@/components/nhapoa/ui";
import { useNhapoa } from "@/lib/nhapoa/store/store";
import { fmtDate, fmtINR } from "@/lib/nhapoa/case-helpers";
import { Icon , Card} from "@mosje/design-system";

export default function TransactionsPage() {
  const { state } = useNhapoa();
  const [q, setQ] = React.useState("");
  const txns = state.disbursements.filter((d) => !q.trim() || d.refNo.toLowerCase().includes(q.toLowerCase()) || d.beneficiary.toLowerCase().includes(q.toLowerCase()));

  return (
    <div>
      <PortalPageHeader
        title="Transaction Log"
        meta="All fund disbursements — non-editable reconciliation record"
        actions={<div className="flex gap-2"><Button variant="outline"><Icon name="description" size={16} /> PDF</Button><Button variant="outline"><Icon name="table_chart" size={16} /> Excel</Button></div>}
      />
      <SearchInput placeholder="Search by ID, citizen name, category…" value={q} onChange={(e) => setQ(e.target.value)} className="mb-4 max-w-2xl" />
      {txns.length === 0 ? (
        <Card className="px-6 py-16 text-center text-body-2 text-ink-muted">No transactions match the current filters.</Card>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-line bg-white shadow-card">
          <table className="w-full min-w-[820px] text-left text-body-2">
            <thead>
              <tr className="border-b border-line text-label-3 uppercase text-ink-hint">
                <th className="px-5 py-3.5 font-semibold">Transaction ID</th>
                <th className="px-5 py-3.5 font-semibold">Grievance ID</th>
                <th className="px-5 py-3.5 font-semibold">Beneficiary</th>
                <th className="px-5 py-3.5 font-semibold">Amount</th>
                <th className="px-5 py-3.5 font-semibold">Mode</th>
                <th className="px-5 py-3.5 font-semibold">Disbursed On</th>
                <th className="px-5 py-3.5 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {txns.map((d) => (
                <tr key={d.id} className="hover:bg-surface-muted/60">
                  <td className="px-5 py-4 font-mono text-body-3 font-semibold text-navy">{d.txnRef}</td>
                  <td className="px-5 py-4 font-mono text-body-3 text-ink">{d.refNo}</td>
                  <td className="px-5 py-4 text-ink">{d.beneficiary}</td>
                  <td className="px-5 py-4 font-semibold text-ink">{fmtINR(d.amount)}</td>
                  <td className="px-5 py-4 text-ink-muted">{d.mode}</td>
                  <td className="px-5 py-4 text-ink-muted">{fmtDate(d.at)}</td>
                  <td className="px-5 py-4"><span className="inline-flex rounded-full bg-approve-bg px-2.5 py-0.5 text-label-2 font-semibold text-approve-fg">Success</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
