"use client";

import * as React from "react";
import { Download, Plus, CheckCircle2 } from "lucide-react";
import { Modal } from "@mosje/design-system";
import { PageHeader, StatTile, Card, Button, Field, Select, TextInput } from "@/components/nhapoa/ui";
import { useNhapoa } from "@/lib/nhapoa/store/store";
import { fmtINR } from "@/lib/nhapoa/case-helpers";
import { STATES, SCHEMES } from "@/lib/nhapoa/store/seed";

export default function FundAllocationPage() {
  const { state, addAllocation } = useNhapoa();
  const [open, setOpen] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const [aState, setAState] = React.useState("");
  const [scheme, setScheme] = React.useState("");
  const [amount, setAmount] = React.useState("");

  const sanctioned = state.allocations.reduce((s, a) => s + a.amount, 0);
  const disbursed = state.disbursements.reduce((s, d) => s + d.amount, 0);
  const remaining = Math.max(0, sanctioned - disbursed);
  const rate = sanctioned ? Math.round((disbursed / sanctioned) * 100) : 0;

  const byState = React.useMemo(() => {
    const alloc: Record<string, number> = {};
    for (const a of state.allocations) alloc[a.state] = (alloc[a.state] ?? 0) + a.amount;
    const caseState = new Map(state.cases.map((c) => [c.id, c.state]));
    const disb: Record<string, number> = {};
    for (const d of state.disbursements) { const st = caseState.get(d.caseId) ?? "—"; disb[st] = (disb[st] ?? 0) + d.amount; }
    return Object.keys(alloc).map((st) => ({ st, alloc: alloc[st], disb: disb[st] ?? 0 }));
  }, [state.allocations, state.disbursements, state.cases]);

  function submit() {
    if (!aState || !scheme || !amount) return;
    addAllocation({ state: aState, scheme, amount: Number(amount) });
    setDone(true);
  }

  function reset() {
    setOpen(false); setDone(false); setAState(""); setScheme(""); setAmount("");
  }

  return (
    <div>
      <PageHeader
        title="Fund Allocation Dashboard"
        subtitle="SAMBAL budget allocation and utilization"
        action={<div className="flex gap-2"><Button variant="outline"><Download className="h-4 w-4" /> Export</Button><Button onClick={() => setOpen(true)}><Plus className="h-4 w-4" /> New Allocation</Button></div>}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="Total Budget Allocated" value={fmtINR(sanctioned)} />
        <StatTile label="Total Disbursed" value={fmtINR(disbursed)} accent="approve" />
        <StatTile label="Remaining Balance" value={fmtINR(remaining)} accent="await" />
        <StatTile label="National Utilization Rate" value={`${rate}%`} />
      </div>

      <Card className="mt-6 p-6">
        <h2 className="text-sm font-bold text-ink">State-wise Fund Summary</h2>
        <p className="text-xs text-ink-hint">Allocation vs disbursement reconciliation</p>
        {byState.length === 0 ? (
          <p className="mt-6 rounded-lg bg-surface-muted px-4 py-8 text-center text-sm text-ink-hint">No allocations yet. Create one to begin.</p>
        ) : (
          <table className="mt-4 w-full text-left text-sm">
            <thead><tr className="border-b border-line text-xs uppercase tracking-wide text-ink-hint"><th className="py-2.5 font-semibold">State</th><th className="py-2.5 text-right font-semibold">Allocated</th><th className="py-2.5 text-right font-semibold">Disbursed</th><th className="py-2.5 text-right font-semibold">Utilisation</th></tr></thead>
            <tbody className="divide-y divide-line">
              {byState.map((r) => (
                <tr key={r.st}>
                  <td className="py-3 text-ink">{r.st}</td>
                  <td className="py-3 text-right text-ink">{fmtINR(r.alloc)}</td>
                  <td className="py-3 text-right text-ink">{fmtINR(r.disb)}</td>
                  <td className="py-3 text-right font-semibold text-navy">{r.alloc ? Math.round((r.disb / r.alloc) * 100) : 0}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      <Modal
        open={open}
        onClose={reset}
        size="sm"
        title={done ? "Allocation created" : "New Fund Allocation"}
        footer={done ? <Button onClick={reset}>Done</Button> : (
          <div className="flex justify-end gap-2"><Button variant="outline" onClick={reset}>Cancel</Button><Button onClick={submit} disabled={!aState || !scheme || !amount}>Allocate</Button></div>
        )}
      >
        {done ? (
          <div className="py-4 text-center"><CheckCircle2 className="mx-auto h-12 w-12 text-approve" /><p className="mt-3 text-sm text-ink-muted">{fmtINR(Number(amount))} allocated to <span className="font-semibold text-ink">{aState}</span> for {scheme}.</p></div>
        ) : (
          <div className="space-y-4">
            <Field label="State" required><Select options={STATES} placeholder="Select State" value={aState} onChange={(e) => setAState(e.target.value)} /></Field>
            <Field label="Scheme" required><Select options={SCHEMES} placeholder="Select Scheme" value={scheme} onChange={(e) => setScheme(e.target.value)} /></Field>
            <Field label="Allocation Amount (₹)" required><TextInput inputMode="numeric" value={amount} onChange={(e) => setAmount(e.target.value.replace(/\D/g, ""))} placeholder="e.g. 25000000" /></Field>
          </div>
        )}
      </Modal>
    </div>
  );
}
