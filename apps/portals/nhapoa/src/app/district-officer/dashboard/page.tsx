"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHeader, StatTile, Card, StatusPill } from "@/components/ui";
import { useNhapoa } from "@/lib/store/store";
import { doQueue, priorityOf } from "@/lib/case-helpers";
import { CASE_STATUS_META, type CaseStatus } from "@/lib/store/types";

const BREAKDOWN: CaseStatus[] = ["SUBMITTED", "ASSIGNED", "UNDER_INVESTIGATION", "PENDING_APPROVAL", "SENT_BACK"];

export default function DODashboard() {
  const { state } = useNhapoa();
  const queue = doQueue(state.cases);

  const counts = React.useMemo(() => {
    const by: Partial<Record<CaseStatus, number>> = {};
    for (const c of queue) by[c.status] = (by[c.status] ?? 0) + 1;
    return by;
  }, [queue]);

  const priority = queue.filter((c) => priorityOf(c) !== null || c.status === "SUBMITTED").slice(0, 6);
  const max = Math.max(1, ...BREAKDOWN.map((s) => counts[s] ?? 0));
  const today = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  return (
    <div>
      <PageHeader title="Dashboard" subtitle={`Here's your case overview for today — ${today}`} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="Assigned Cases" value={queue.length} />
        <StatTile label="Clarifications Pending" value={0} accent="await" />
        <StatTile label="Resolved This Month" value={state.cases.filter((c) => c.status === "CLOSED").length} accent="approve" />
        <StatTile label="SLA Breaches" value={0} accent="reject" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-sm font-bold text-ink">Case Status Breakdown</h2>
          <p className="text-xs text-ink-hint">All {queue.length} assigned cases by status</p>
          <div className="mt-6 flex h-48 items-end justify-around gap-3">
            {BREAKDOWN.map((s) => (
              <div key={s} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex w-full flex-1 items-end">
                  <div className="w-full rounded-t bg-navy/70" style={{ height: `${((counts[s] ?? 0) / max) * 100}%`, minHeight: (counts[s] ?? 0) ? "6px" : "0" }} />
                </div>
                <span className="text-center text-[10px] leading-tight text-ink-hint">{CASE_STATUS_META[s].label}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-ink">Priority Actions</h2>
              <p className="text-xs text-ink-hint">Requires your immediate attention</p>
            </div>
            <Link href="/district-officer/cases" className="inline-flex items-center gap-1 text-xs font-semibold text-navy hover:underline">View all <ArrowRight className="h-3.5 w-3.5" /></Link>
          </div>
          <ul className="mt-4 divide-y divide-line">
            {priority.length === 0 && <li className="py-6 text-center text-sm text-ink-hint">No priority cases right now.</li>}
            {priority.map((c) => (
              <li key={c.id} className="flex items-center justify-between gap-3 py-3">
                <Link href={`/district-officer/cases/${c.id}`} className="min-w-0">
                  <p className="truncate font-mono text-xs font-semibold text-navy hover:underline">{c.refNo}</p>
                  <p className="truncate text-xs text-ink-muted">{c.type} · {c.category}</p>
                </Link>
                <StatusPill status={c.status} />
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
