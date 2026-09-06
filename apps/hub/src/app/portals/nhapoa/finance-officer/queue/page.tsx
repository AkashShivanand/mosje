"use client";

import * as React from "react";
import { Icon, Modal , Select, Card} from "@mosje/design-system";
import { PortalPageHeader, SearchInput, Button, Field, TextInput } from "@/components/nhapoa/ui";
import { useNhapoa } from "@/lib/nhapoa/store/store";
import { fmtDate, fmtINR } from "@/lib/nhapoa/case-helpers";
import type { Case } from "@/lib/nhapoa/store/types";

const MODES = ["DBT / NEFT", "RTGS", "Account Payee Cheque"] as const;

export default function DisbursementQueuePage() {
  const { state, disburseCase } = useNhapoa();
  const queue = state.cases.filter((c) => c.status === "APPROVED");
  const [q, setQ] = React.useState("");
  const [proc, setProc] = React.useState<Case | null>(null);
  const [amount, setAmount] = React.useState("");
  const [mode, setMode] = React.useState<string>(MODES[0]);
  const [beneficiary, setBeneficiary] = React.useState("");
  const [done, setDone] = React.useState<{ ref: string; txn: string } | null>(null);

  const filtered = queue.filter((c) => !q.trim() || c.refNo.toLowerCase().includes(q.toLowerCase()) || c.complainant.name.toLowerCase().includes(q.toLowerCase()) || c.category.toLowerCase().includes(q.toLowerCase()));

  function openProcess(c: Case) {
    setProc(c);
    setDone(null);
    setAmount(c.reliefAmount ? String(c.reliefAmount) : "");
    setMode(MODES[0]);
    setBeneficiary(c.victim?.name || c.complainant.name);
  }

  function disburse() {
    if (!proc) return;
    const amt = Number(amount) || proc.reliefAmount || 0;
    const d = disburseCase(proc.id, amt, mode, beneficiary);
    if (d) setDone({ ref: proc.refNo, txn: d.txnRef });
  }

  return (
    <div>
      <PortalPageHeader
        title="Disbursement Queue"
        meta={`${queue.length} state-approved case${queue.length === 1 ? "" : "s"} ready for sanction`}
        actions={<Button variant="outline"><Icon name="download" size={16} /> Export</Button>}
      />

      <SearchInput placeholder="Search by ID, citizen name, category…" value={q} onChange={(e) => setQ(e.target.value)} className="mb-4 max-w-2xl" />

      <div className="mb-5 flex flex-wrap gap-2">
        <span className="rounded-lg border border-navy bg-navy px-4 py-2 text-label-1 font-semibold text-white">All ({queue.length})</span>
        <span className="rounded-lg border border-line px-4 py-2 text-label-1 font-semibold text-ink-muted">Ready ({queue.length})</span>
        <span className="rounded-lg border border-line px-4 py-2 text-label-1 font-semibold text-ink-muted">On Hold (0)</span>
      </div>

      {filtered.length === 0 ? (
        <Card className="px-6 py-16 text-center text-body-2 text-ink-muted">No cases awaiting disbursement.</Card>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-line bg-white shadow-card">
          <table className="w-full min-w-[800px] text-left text-body-2">
            <thead>
              <tr className="border-b border-line text-label-3 uppercase text-ink-hint">
                <th className="px-5 py-3.5 font-semibold">Grievance ID</th>
                <th className="px-5 py-3.5 font-semibold">Citizen / Role</th>
                <th className="px-5 py-3.5 font-semibold">Category</th>
                <th className="px-5 py-3.5 font-semibold">State Approved</th>
                <th className="px-5 py-3.5 font-semibold">Sanction Amount</th>
                <th className="px-5 py-3.5 font-semibold">Status</th>
                <th className="px-5 py-3.5 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-surface-muted/60">
                  <td className="px-5 py-4 font-mono text-body-3 font-semibold text-navy">{c.refNo}</td>
                  <td className="px-5 py-4"><div className="font-medium text-ink">{c.complainant.name}</div><div className="text-body-3 text-ink-hint">{c.complainantRole}</div></td>
                  <td className="px-5 py-4 max-w-[200px]"><span className="line-clamp-2 text-ink">{c.category}</span></td>
                  <td className="px-5 py-4 text-ink-muted">{fmtDate(c.timeline.find((t) => t.status === "APPROVED")?.at ?? c.createdAt)}</td>
                  <td className="px-5 py-4 font-semibold text-ink">{fmtINR(c.reliefAmount)}</td>
                  <td className="px-5 py-4"><span className="inline-flex rounded-full bg-approve-bg px-2.5 py-0.5 text-label-2 font-semibold text-approve-fg">Ready</span></td>
                  <td className="px-5 py-4 text-right"><Button onClick={() => openProcess(c)}><Icon name="account_balance_wallet" size={16} /> Process</Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={!!proc}
        onClose={() => setProc(null)}
        size="md"
        title={done ? "Disbursement complete" : proc ? `Process disbursement · ${proc.refNo}` : ""}
        footer={
          done ? (
            <Button onClick={() => setProc(null)}>Done</Button>
          ) : (
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setProc(null)}>Cancel</Button>
              <Button onClick={disburse} disabled={!amount || !beneficiary}><Icon name="check_circle" size={16} /> Confirm Disbursement</Button>
            </div>
          )
        }
      >
        {done ? (
          <div className="py-4 text-center">
            <Icon name="check_circle" size={48} className="mx-auto text-approve" />
            <p className="mt-3 text-body-2 text-ink-muted">Relief disbursed for <span className="font-mono font-semibold text-ink">{done.ref}</span>. The case is now closed.</p>
            <p className="mt-3 rounded-lg bg-surface-muted px-4 py-2 font-mono text-title-3 text-navy">Txn: {done.txn}</p>
          </div>
        ) : proc ? (
          <div className="space-y-4 text-body-2">
            <div className="rounded-lg bg-surface-muted px-4 py-3">
              <p className="text-ink">{proc.category}</p>
              <p className="mt-0.5 text-body-3 text-ink-hint">{proc.complainant.name} · {proc.district}, {proc.state}</p>
            </div>
            <Field label="Beneficiary" required><TextInput value={beneficiary} onChange={(e) => setBeneficiary(e.target.value)} placeholder="Beneficiary name" /></Field>
            <Field label="Sanction Amount (₹)" required><TextInput inputMode="numeric" value={amount} onChange={(e) => setAmount(e.target.value.replace(/\D/g, ""))} placeholder="e.g. 425000" /></Field>
            <Field label="Disbursement Mode"><Select options={[...MODES].map((value) => ({ value, label: value }))} value={mode} onChange={(e) => setMode(e.target.value)} /></Field>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
