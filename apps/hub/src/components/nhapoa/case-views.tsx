"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/nhapoa/utils";
import { StatusPill } from "./ui";
import { slaDaysLeft, slaTone, slaLabel, priorityOf, fmtDate } from "@/lib/nhapoa/case-helpers";
import type { Case } from "@/lib/nhapoa/store/types";
import { Icon } from "@mosje/design-system";

const SLA_TONE_CLASS = {
  approve: "bg-approve-bg text-approve-fg",
  await: "bg-await-bg text-await-fg",
  reject: "bg-reject-bg text-reject-fg",
} as const;

export function SlaPill({ case: c }: { case: Case }) {
  const left = slaDaysLeft(c);
  return <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-label-2 font-semibold", SLA_TONE_CLASS[slaTone(left)])}>{slaLabel(left)}</span>;
}

export function PriorityBadge({ case: c }: { case: Case }) {
  const p = priorityOf(c);
  if (!p) return null;
  return p === "Urgent" ? (
    <span className="mt-1 inline-flex items-center gap-1 rounded bg-reject-bg px-1.5 py-0.5 text-label-3 uppercase text-reject-fg"><Icon name="error" size={12} /> Urgent</span>
  ) : (
    <span className="mt-1 inline-flex items-center gap-1 rounded bg-await-bg px-1.5 py-0.5 text-label-3 uppercase text-await-fg"><Icon name="warning" size={12} /> Escalated</span>
  );
}

/** Read-only case list (no row navigation) for approved / sent-back / all-cases views. */
export function SimpleCaseTable({
  cases,
  dateLabel = "Submitted",
  emptyLabel = "No cases here yet.",
}: {
  cases: Case[];
  dateLabel?: string;
  emptyLabel?: string;
}) {
  if (cases.length === 0) return <div className="rounded-2xl border border-dashed border-line bg-white/60 px-6 py-16 text-center text-body-2 text-ink-hint">{emptyLabel}</div>;
  return (
    <div className="overflow-x-auto rounded-2xl border border-line bg-white shadow-card">
      <table className="w-full min-w-[720px] text-left text-body-2">
        <thead>
          <tr className="border-b border-line text-label-3 uppercase text-ink-hint">
            <th scope="col" className="px-5 py-3.5 font-semibold">Grievance ID</th>
            <th scope="col" className="px-5 py-3.5 font-semibold">Citizen</th>
            <th scope="col" className="px-5 py-3.5 font-semibold">Category</th>
            <th scope="col" className="px-5 py-3.5 font-semibold">{dateLabel}</th>
            <th scope="col" className="px-5 py-3.5 font-semibold">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {cases.map((c) => (
            <tr key={c.id} className="hover:bg-surface-muted/60">
              <td className="px-5 py-4 font-mono text-body-3 font-semibold text-navy">{c.refNo}</td>
              <td className="px-5 py-4 text-ink">{c.complainant.name}</td>
              <td className="px-5 py-4 max-w-[220px]"><span className="line-clamp-2 text-ink">{c.category}</span></td>
              <td className="px-5 py-4 text-ink-muted">{fmtDate(c.timeline[c.timeline.length - 1]?.at ?? c.createdAt)}</td>
              <td className="px-5 py-4"><StatusPill status={c.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Case list table used by DO/SHO, State Authority, etc. Rows link to a detail base. */
export function CaseTable({ cases, detailBase }: { cases: Case[]; detailBase: string }) {
  if (cases.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-white/60 px-6 py-16 text-center">
        <div className="text-title-3 text-ink">No cases here</div>
        <div className="mt-1 text-body-3 text-ink-hint">Cases will appear as they reach this stage.</div>
      </div>
    );
  }
  return (
    <div className="overflow-x-auto rounded-2xl border border-line bg-white shadow-card">
      <table className="w-full min-w-[760px] text-left text-body-2">
        <thead>
          <tr className="border-b border-line text-label-3 uppercase text-ink-hint">
            <th scope="col" className="px-5 py-3.5 font-semibold">Grievance ID</th>
            <th scope="col" className="px-5 py-3.5 font-semibold">Citizen / Role</th>
            <th scope="col" className="px-5 py-3.5 font-semibold">Category</th>
            <th scope="col" className="px-5 py-3.5 font-semibold">Submitted</th>
            <th scope="col" className="px-5 py-3.5 font-semibold">SLA</th>
            <th scope="col" className="px-5 py-3.5 font-semibold">Status</th>
            <th scope="col" className="px-5 py-3.5 text-right font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {cases.map((c) => (
            <tr key={c.id} className="hover:bg-surface-muted/60">
              <td className="px-5 py-4 align-top">
                <Link href={`${detailBase}/${c.id}`} className="font-mono text-body-3 font-semibold text-navy hover:underline">{c.refNo}</Link>
                <PriorityBadge case={c} />
              </td>
              <td className="px-5 py-4 align-top">
                <div className="font-medium text-ink">{c.complainant.name}</div>
                <div className="text-body-3 text-ink-hint">{c.complainantRole}</div>
              </td>
              <td className="px-5 py-4 align-top max-w-[220px]"><span className="line-clamp-2 text-ink">{c.category}</span></td>
              <td className="px-5 py-4 align-top text-ink-muted">{fmtDate(c.createdAt)}</td>
              <td className="px-5 py-4 align-top"><SlaPill case={c} /></td>
              <td className="px-5 py-4 align-top"><StatusPill status={c.status} /></td>
              <td className="px-5 py-4 align-top">
                <div className="flex items-center justify-end gap-2">
                  <Link href={`${detailBase}/${c.id}`} className="rounded-lg border border-line px-3 py-1.5 text-label-2 font-semibold text-navy hover:bg-navy/5">View</Link>
                  <button type="button" aria-label="Download case" className="grid h-8 w-8 place-items-center rounded-lg border border-line text-ink-hint hover:bg-black/5"><Icon name="download" size={16} /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
