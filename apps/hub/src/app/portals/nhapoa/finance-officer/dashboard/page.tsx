"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHeader, StatTile, Card } from "@/components/nhapoa/ui";
import { useNhapoa } from "@/lib/nhapoa/store/store";
import { fmtINR } from "@/lib/nhapoa/case-helpers";

export default function FODashboard() {
  const { state } = useNhapoa();
  const queue = state.cases.filter((c) => c.status === "APPROVED");
  const disbursedCount = state.disbursements.length;
  const totalDisbursed = state.disbursements.reduce((s, d) => s + d.amount, 0);

  return (
    <div>
      <PageHeader title="Finance Dashboard" subtitle="State-approved cases ready for sanction and disbursement" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="Cases in Queue" value={queue.length} accent="await" />
        <StatTile label="Disbursements (this FY)" value={disbursedCount} accent="approve" />
        <StatTile label="Funds Disbursed (this FY)" value={fmtINR(totalDisbursed)} />
        <StatTile label="Avg. Processing Time" value={disbursedCount ? "2 days" : "—"} />
      </div>

      <Card className="mt-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-ink">Priority Queue</h2>
            <p className="text-xs text-ink-hint">Earliest-received first</p>
          </div>
          <Link href="/portals/nhapoa/finance-officer/queue" className="inline-flex items-center gap-1 text-xs font-semibold text-navy hover:underline">View all <ArrowRight className="h-3.5 w-3.5" /></Link>
        </div>
        <ul className="mt-4 divide-y divide-line">
          {queue.length === 0 && <li className="py-6 text-center text-sm text-ink-hint">No cases in the disbursement queue.</li>}
          {queue.slice(0, 6).map((c) => (
            <li key={c.id} className="flex items-center justify-between gap-3 py-3">
              <Link href="/portals/nhapoa/finance-officer/queue" className="min-w-0">
                <p className="truncate font-mono text-xs font-semibold text-navy hover:underline">{c.refNo}</p>
                <p className="truncate text-xs text-ink-muted">{c.complainant.name} · {fmtINR(c.reliefAmount)}</p>
              </Link>
              <span className="inline-flex rounded-full bg-approve-bg px-2.5 py-0.5 text-xs font-semibold text-approve-fg">Ready</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
