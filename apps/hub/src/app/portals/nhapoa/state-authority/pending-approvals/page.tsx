"use client";

import * as React from "react";
import { Icon, Modal } from "@mosje/design-system";
import { PageHeader, SearchInput, Button, Card, Field, Textarea, TextInput, StatusPill } from "@/components/nhapoa/ui";
import { SlaPill, PriorityBadge } from "@/components/nhapoa/case-views";
import { useNhapoa } from "@/lib/nhapoa/store/store";
import { fmtDate, fmtINR, priorityOf } from "@/lib/nhapoa/case-helpers";
import { cn } from "@/lib/nhapoa/utils";
import type { Case } from "@/lib/nhapoa/store/types";

type Tab = "all" | "urgent" | "escalated";

export default function PendingApprovalsPage() {
  const { state, transitionCase } = useNhapoa();
  const pending = state.cases.filter((c) => c.status === "PENDING_APPROVAL");
  const [tab, setTab] = React.useState<Tab>("all");
  const [q, setQ] = React.useState("");
  const [review, setReview] = React.useState<Case | null>(null);
  const [decision, setDecision] = React.useState<"approve" | "sendback" | null>(null);
  const [note, setNote] = React.useState("");
  const [amount, setAmount] = React.useState("");

  const filtered = pending
    .filter((c) => (tab === "all" ? true : tab === "urgent" ? priorityOf(c) === "Urgent" : priorityOf(c) === "Escalated"))
    .filter((c) => !q.trim() || c.refNo.toLowerCase().includes(q.toLowerCase()) || c.complainant.name.toLowerCase().includes(q.toLowerCase()) || c.category.toLowerCase().includes(q.toLowerCase()));

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "all", label: "All", count: pending.length },
    { key: "urgent", label: "Urgent", count: pending.filter((c) => priorityOf(c) === "Urgent").length },
    { key: "escalated", label: "Escalated", count: pending.filter((c) => priorityOf(c) === "Escalated").length },
  ];

  function openReview(c: Case) {
    setReview(c);
    setDecision(null);
    setNote("");
    setAmount(c.reliefAmount ? String(c.reliefAmount) : "");
  }

  function submitDecision() {
    if (!review || !decision) return;
    if (decision === "approve") {
      transitionCase(review.id, "APPROVED", note || `Approved${amount ? ` · relief ₹${Number(amount).toLocaleString("en-IN")}` : ""}`, "state-authority");
    } else {
      transitionCase(review.id, "SENT_BACK", note || "Returned for revised investigation", "state-authority");
    }
    setReview(null);
  }

  return (
    <div>
      <PageHeader
        title="Pending Approvals"
        subtitle={`${pending.length} case${pending.length === 1 ? "" : "s"} submitted by DM/DC Offices awaiting your decision`}
        action={<Button variant="outline"><Icon name="download" size={16} /> Export</Button>}
      />

      <SearchInput placeholder="Search by ID, citizen name, category…" value={q} onChange={(e) => setQ(e.target.value)} className="mb-4 max-w-2xl" />

      <div className="mb-5 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button key={t.key} type="button" onClick={() => setTab(t.key)} className={cn("rounded-lg border px-4 py-2 text-label-1 font-semibold transition-colors", tab === t.key ? "border-navy bg-navy text-white" : "border-line text-ink-muted hover:bg-black/5")}>
            {t.label} ({t.count})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <Card className="px-6 py-16 text-center text-body-2 text-ink-muted">No pending approvals.</Card>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-line bg-white shadow-card">
          <table className="w-full min-w-[820px] text-left text-body-2">
            <thead>
              <tr className="border-b border-line text-label-3 uppercase text-ink-hint">
                <th className="px-5 py-3.5 font-semibold">Grievance ID</th>
                <th className="px-5 py-3.5 font-semibold">Citizen / Role</th>
                <th className="px-5 py-3.5 font-semibold">Category</th>
                <th className="px-5 py-3.5 font-semibold">DM/DC Office</th>
                <th className="px-5 py-3.5 font-semibold">Submitted</th>
                <th className="px-5 py-3.5 font-semibold">SLA</th>
                <th className="px-5 py-3.5 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-surface-muted/60">
                  <td className="px-5 py-4 align-top"><span className="font-mono text-body-3 font-semibold text-navy">{c.refNo}</span><PriorityBadge case={c} /></td>
                  <td className="px-5 py-4 align-top"><div className="font-medium text-ink">{c.complainant.name}</div><div className="text-body-3 text-ink-hint">{c.complainantRole}</div></td>
                  <td className="px-5 py-4 align-top max-w-[200px]"><span className="line-clamp-2 text-ink">{c.category}</span></td>
                  <td className="px-5 py-4 align-top text-ink-muted">{c.district}</td>
                  <td className="px-5 py-4 align-top text-ink-muted">{fmtDate(c.createdAt)}</td>
                  <td className="px-5 py-4 align-top"><SlaPill case={c} /></td>
                  <td className="px-5 py-4 align-top text-right"><Button onClick={() => openReview(c)}>Review</Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Decision modal */}
      <Modal
        open={!!review}
        onClose={() => setReview(null)}
        size="md"
        title={review ? `Review ${review.refNo}` : ""}
        footer={
          <div className="flex w-full items-center justify-between gap-2">
            <Button variant="outline" onClick={() => setReview(null)}>Cancel</Button>
            <div className="flex gap-2">
              <Button variant="danger" onClick={() => { setDecision("sendback"); }}><Icon name="undo" size={16} /> Send Back</Button>
              <Button onClick={() => { setDecision("approve"); }}><Icon name="check_circle" size={16} /> Approve</Button>
            </div>
          </div>
        }
      >
        {review && (
          <div className="space-y-5 text-body-2">
            <div className="grid grid-cols-2 gap-4">
              <Info label="Citizen" value={`${review.complainant.name} (${review.complainantRole})`} />
              <Info label="Category" value={review.category} />
              <Info label="DM/DC Office" value={review.district} />
              <Info label="Status" value={<StatusPill status={review.status} />} />
            </div>
            {review.details && <Info label="Description" value={review.details} />}
            <Field label="Sanctioned relief amount (₹)"><TextInput inputMode="numeric" value={amount} onChange={(e) => setAmount(e.target.value.replace(/\D/g, ""))} placeholder="e.g. 425000" /></Field>
            <Field label="Decision note"><Textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Reason / remarks for the audit log" /></Field>
            {decision && (
              <div className="flex items-center justify-between rounded-lg bg-surface-muted px-4 py-3">
                <span className="text-body-2">
                  {decision === "approve"
                    ? <>Approve and forward to <span className="font-semibold text-ink">Finance Officer</span> ({fmtINR(Number(amount) || undefined)})?</>
                    : <>Send back to <span className="font-semibold text-ink">DM/DC Office</span> for rework?</>}
                </span>
                <Button onClick={submitDecision}>Confirm</Button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

function Info({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div className="text-body-3 text-ink-hint">{label}</div>
      <div className="mt-0.5 text-ink">{value}</div>
    </div>
  );
}
