"use client";

import * as React from "react";
import { Icon, Modal } from "@mosje/design-system";
import { PageHeader, SearchInput, Button, Field, TextInput } from "@/components/nhapoa/ui";
import { Checkbox } from "@mosje/design-system";
import { useNhapoa } from "@/lib/nhapoa/store/store";
import { fmtINR } from "@/lib/nhapoa/case-helpers";

export default function CategoriesPage() {
  const { state, addCategory, toggleCategory } = useNhapoa();
  const [q, setQ] = React.useState("");
  const [showDeactivated, setShowDeactivated] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [sla, setSla] = React.useState("30");
  const [ceiling, setCeiling] = React.useState("");

  const rows = state.categories
    .filter((c) => showDeactivated || c.active)
    .filter((c) => !q.trim() || c.name.toLowerCase().includes(q.toLowerCase()));

  function submit() {
    if (!name) return;
    addCategory(name, Number(sla) || 30, Number(ceiling) || 0);
    setOpen(false); setName(""); setSla("30"); setCeiling("");
  }

  return (
    <div>
      <PageHeader
        title="Grievance Categories"
        subtitle="Configure the nature options on the citizen wizard and the SLA window for each category"
        action={<Button onClick={() => setOpen(true)}><Icon name="add" size={16} /> Add Category</Button>}
      />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <SearchInput placeholder="Search by label…" value={q} onChange={(e) => setQ(e.target.value)} className="max-w-md flex-1" />
        <Checkbox label="Show deactivated" checked={showDeactivated} onChange={(e) => setShowDeactivated(e.target.checked)} />
      </div>
      <p className="mb-3 text-body-3 text-ink-hint">{state.categories.filter((c) => c.active).length} active categories</p>

      <div className="overflow-x-auto rounded-2xl border border-line bg-white shadow-card">
        <table className="w-full min-w-[720px] text-left text-body-2">
          <thead>
            <tr className="border-b border-line text-label-3 uppercase text-ink-hint">
              <th className="px-5 py-3.5 font-semibold">Label</th>
              <th className="px-5 py-3.5 font-semibold">SLA (days)</th>
              <th className="px-5 py-3.5 font-semibold">Amount ceiling</th>
              <th className="px-5 py-3.5 font-semibold">Status</th>
              <th className="px-5 py-3.5 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map((c) => (
              <tr key={c.id} className="hover:bg-surface-muted/60">
                <td className="px-5 py-4 max-w-[360px]"><span className="line-clamp-2 text-ink">{c.name}</span></td>
                <td className="px-5 py-4 text-ink-muted">{c.slaDays}d</td>
                <td className="px-5 py-4 text-ink">{fmtINR(c.amountCeiling)}</td>
                <td className="px-5 py-4">
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-label-2 font-semibold ${c.active ? "bg-approve-bg text-approve-fg" : "bg-slate-100 text-slate-500"}`}>{c.active ? "Active" : "Deactivated"}</span>
                </td>
                <td className="px-5 py-4 text-right">
                  <button type="button" onClick={() => toggleCategory(c.id)} className="rounded-lg border border-line px-3 py-1.5 text-label-2 font-semibold text-navy hover:bg-navy/5">{c.active ? "Deactivate" : "Reactivate"}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        size="sm"
        title="Add Category"
        footer={<div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={submit} disabled={!name}>Add Category</Button></div>}
      >
        <div className="space-y-4">
          <Field label="Category label" required><TextInput value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Interfering with rights over water" /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="SLA (days)"><TextInput inputMode="numeric" value={sla} onChange={(e) => setSla(e.target.value.replace(/\D/g, ""))} /></Field>
            <Field label="Amount ceiling (₹)"><TextInput inputMode="numeric" value={ceiling} onChange={(e) => setCeiling(e.target.value.replace(/\D/g, ""))} placeholder="e.g. 425000" /></Field>
          </div>
          <p className="rounded-lg bg-surface-muted px-3 py-2 text-body-3 text-ink-muted">New active categories appear immediately in the citizen Register-Grievance wizard.</p>
        </div>
      </Modal>
    </div>
  );
}
