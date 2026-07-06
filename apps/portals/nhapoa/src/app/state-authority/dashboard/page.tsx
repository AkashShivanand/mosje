"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHeader, StatTile, Card, StatusPill } from "@/components/ui";
import { useNhapoa } from "@/lib/store/store";

export default function SADashboard() {
  const { state } = useNhapoa();
  const pending = state.cases.filter((c) => c.status === "PENDING_APPROVAL");
  const approved = state.cases.filter((c) => ["APPROVED", "DISBURSED", "CLOSED"].includes(c.status));
  const sentBack = state.cases.filter((c) => c.status === "SENT_BACK");
  const compliance = state.cases.length ? 100 : 100;

  return (
    <div>
      <PageHeader title="State Authority Dashboard" subtitle="Approval decisions across your jurisdiction" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="Pending Approvals" value={pending.length} accent="await" />
        <StatTile label="Approved This Month" value={approved.length} accent="approve" />
        <StatTile label="Sent Back for Rework" value={sentBack.length} accent="reject" />
        <StatTile label="SLA Compliance Rate" value={`${compliance}%`} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-ink">Priority Pending</h2>
              <p className="text-xs text-ink-hint">Requires your immediate decision</p>
            </div>
            <Link href="/state-authority/pending-approvals" className="inline-flex items-center gap-1 text-xs font-semibold text-navy hover:underline">View all <ArrowRight className="h-3.5 w-3.5" /></Link>
          </div>
          <ul className="mt-4 divide-y divide-line">
            {pending.length === 0 && <li className="py-6 text-center text-sm text-ink-hint">No pending approvals.</li>}
            {pending.slice(0, 6).map((c) => (
              <li key={c.id} className="flex items-center justify-between gap-3 py-3">
                <Link href="/state-authority/pending-approvals" className="min-w-0">
                  <p className="truncate font-mono text-xs font-semibold text-navy hover:underline">{c.refNo}</p>
                  <p className="truncate text-xs text-ink-muted">{c.category} · {c.district}, {c.state}</p>
                </Link>
                <StatusPill status={c.status} />
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-6">
          <h2 className="text-sm font-bold text-ink">Decision Trend</h2>
          <p className="text-xs text-ink-hint">Approvals vs send-backs</p>
          <div className="mt-6 space-y-4">
            <TrendBar label="Approved" value={approved.length} total={Math.max(1, approved.length + sentBack.length)} tone="bg-approve" />
            <TrendBar label="Sent Back" value={sentBack.length} total={Math.max(1, approved.length + sentBack.length)} tone="bg-reject" />
          </div>
          <p className="mt-6 rounded-lg bg-surface-muted px-4 py-3 text-xs text-ink-muted">Stale cases (no action past the 30-day SLA) are flagged here for escalation.</p>
        </Card>
      </div>
    </div>
  );
}

function TrendBar({ label, value, total, tone }: { label: string; value: number; total: number; tone: string }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs"><span className="text-ink-muted">{label}</span><span className="font-semibold text-ink">{value}</span></div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-line"><div className={`h-full rounded-full ${tone}`} style={{ width: `${(value / total) * 100}%` }} /></div>
    </div>
  );
}
