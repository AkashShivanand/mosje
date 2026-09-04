"use client";

/**
 * My Bank Accounts — the applicant's saved accounts, and the account each project is paid into.
 *
 * DS Audit: Button ✅ existing · FormField ✅ · Input ✅ · Select ✅ · Textarea ✅ · Icon ✅ ·
 * Badge ✅ · useToast ✅ — nothing new.
 *
 * Both editors are INLINE panels, not modals — that is how the live screen behaves: "+ Add
 * account" opens a bordered "Add a bank account" panel above the table, and "Request change"
 * expands inside the project row. Copy is verbatim from the walkthrough (2026-08-22).
 */

import * as React from "react";
import { Button, FormField, Icon, Input, Select, Textarea, useToast } from "@mosje/design-system";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { ngoApplications } from "@/lib/e-anudaan/selectors";

interface SavedAccount {
  id: string;
  bank: string;
  accountMasked: string;
  ifsc: string;
  branch: string;
}

const mask = (accountNo: string) => `••••••••••${accountNo.slice(-4) || "0000"}`;

export default function BankAccountsPage() {
  const { state } = useEAnudaan();
  const { toast } = useToast();
  const ngo = state.ngos[0];

  /** One row per distinct institution — the live "Project bank accounts" table. */
  const projects = React.useMemo(() => {
    if (!ngo) return [];
    const seen = new Map<string, { id: string; label: string }>();
    for (const a of ngoApplications(state, ngo.id)) {
      if (!seen.has(a.institutionId)) {
        seen.set(a.institutionId, {
          id: a.institutionId,
          label: a.projectLabel.split(" — ")[0] ?? a.projectLabel,
        });
      }
    }
    return [...seen.values()];
  }, [state, ngo]);

  const [accounts, setAccounts] = React.useState<SavedAccount[]>([
    { id: "acc-1", bank: "State Bank of India", accountMasked: "••••••••••4417", ifsc: "SBIN0001234", branch: "Pune Camp" },
  ]);
  const [paidInto, setPaidInto] = React.useState<Record<string, string>>({});

  const [adding, setAdding] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [form, setForm] = React.useState({ bank: "", branch: "", accountNo: "", ifsc: "" });

  const [changingProject, setChangingProject] = React.useState<string | null>(null);
  const [changeAccount, setChangeAccount] = React.useState("");
  const [changeReason, setChangeReason] = React.useState("");

  const openAdd = () => {
    setForm({ bank: "", branch: "", accountNo: "", ifsc: "" });
    setEditingId(null);
    setAdding(true);
  };

  const openEdit = (acc: SavedAccount) => {
    setForm({ bank: acc.bank, branch: acc.branch, accountNo: "", ifsc: acc.ifsc });
    setEditingId(acc.id);
    setAdding(true);
  };

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.bank.trim() || !form.accountNo.trim() || !form.ifsc.trim()) return;
    if (editingId) {
      setAccounts((prev) =>
        prev.map((a) =>
          a.id === editingId
            ? { ...a, bank: form.bank, branch: form.branch || a.branch, ifsc: form.ifsc.toUpperCase(), accountMasked: mask(form.accountNo) }
            : a,
        ),
      );
      toast("Bank account updated.", "success");
    } else {
      setAccounts((prev) => [
        ...prev,
        {
          id: `acc-${prev.length + 1}`,
          bank: form.bank,
          branch: form.branch || "—",
          ifsc: form.ifsc.toUpperCase(),
          accountMasked: mask(form.accountNo),
        },
      ]);
      toast("Bank account saved.", "success");
    }
    setAdding(false);
    setEditingId(null);
  };

  const remove = (acc: SavedAccount) => {
    setAccounts((prev) => prev.filter((a) => a.id !== acc.id));
    toast(`Account ${acc.accountMasked} removed.`, "info");
  };

  const submitChange = (projectId: string) => {
    if (!changeAccount || !changeReason.trim()) return;
    setPaidInto((p) => ({ ...p, [projectId]: changeAccount }));
    setChangingProject(null);
    setChangeAccount("");
    setChangeReason("");
    toast("Change request submitted for the Ministry's approval.", "success");
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-headline-1 text-ink">My Bank Accounts</h1>
          <p className="mt-1 text-body-2 text-ink-muted">
            Accounts you save here can be selected when applying.{" "}
            <strong>Each project must use a separate account.</strong>
          </p>
        </div>
        <Button appearance="outlined" onClick={openAdd}>
          <Icon name="add" size={16} aria-hidden /> Add account
        </Button>
      </header>

      {adding && (
        <section className="space-y-4 rounded-xl border border-line bg-surface p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <h2 className="text-title-2 text-ink">
              {editingId ? "Edit bank account" : "Add a bank account"}
            </h2>
            <Button appearance="text" size="sm" onClick={() => setAdding(false)}>
              Cancel
            </Button>
          </div>
          <form onSubmit={save} className="grid gap-4 sm:grid-cols-2">
            <FormField label="Bank name" id="bank-name" required>
              {(control) => (
                <Input
                  {...control}
                  value={form.bank}
                  placeholder="e.g. State Bank of India"
                  onChange={(e) => setForm({ ...form, bank: e.target.value })}
                />
              )}
            </FormField>
            <FormField label="Branch (optional)" id="bank-branch">
              {(control) => (
                <Input
                  {...control}
                  value={form.branch}
                  placeholder="Branch name (max 200 characters)"
                  maxLength={200}
                  onChange={(e) => setForm({ ...form, branch: e.target.value })}
                />
              )}
            </FormField>
            <FormField label="Account number" id="bank-account" required>
              {(control) => (
                <Input
                  {...control}
                  value={form.accountNo}
                  placeholder="6–20 digits"
                  inputMode="numeric"
                  onChange={(e) => setForm({ ...form, accountNo: e.target.value.replace(/\D/g, "").slice(0, 20) })}
                />
              )}
            </FormField>
            <FormField label="IFSC code" id="bank-ifsc" required>
              {(control) => (
                <Input
                  {...control}
                  value={form.ifsc}
                  placeholder="e.g. SBIN0001234"
                  onChange={(e) => setForm({ ...form, ifsc: e.target.value.toUpperCase().slice(0, 11) })}
                />
              )}
            </FormField>
            <div className="sm:col-span-2">
              <Button type="submit">Save account</Button>
            </div>
          </form>
          <p className="text-body-2 text-ink-muted">
            Each project must have its own account — an account already used by another project or
            agency is rejected.
          </p>
        </section>
      )}

      <section className="rounded-xl border border-line bg-surface p-5">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[36rem] text-body-2">
            <caption className="sr-only">Saved bank accounts</caption>
            <thead>
              <tr className="border-b border-line text-left text-label-3 uppercase text-ink-muted">
                <th scope="col" className="pb-2 pr-3 font-medium">Bank</th>
                <th scope="col" className="pb-2 pr-3 font-medium">Account</th>
                <th scope="col" className="pb-2 pr-3 font-medium">IFSC</th>
                <th scope="col" className="pb-2 pr-3 font-medium">Branch</th>
                <th scope="col" className="pb-2 font-medium"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((a) => (
                <tr key={a.id} className="border-b border-line">
                  <td className="py-2 pr-3 text-ink">{a.bank}</td>
                  <td className="py-2 pr-3 font-mono text-ink">{a.accountMasked}</td>
                  <td className="py-2 pr-3 font-mono text-ink">{a.ifsc}</td>
                  <td className="py-2 pr-3 text-ink">{a.branch}</td>
                  <td className="py-2">
                    <div className="flex gap-1">
                      <Button appearance="text" size="sm" onClick={() => openEdit(a)}>
                        Edit
                      </Button>
                      <Button appearance="text" size="sm" onClick={() => remove(a)}>
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {accounts.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-4 text-center text-ink-muted">
                    No accounts saved yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-3 rounded-xl border border-line bg-surface p-5">
        <div>
          <h2 className="text-title-2 text-ink">Project bank accounts</h2>
          <p className="mt-1 text-body-2 text-ink-muted">
            Each project is paid into its own account, and every instalment goes there. Changing one
            needs the Ministry&apos;s approval — it is not something a renewal application can do on
            its own.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[32rem] text-body-2">
            <caption className="sr-only">Account each project is paid into</caption>
            <thead>
              <tr className="border-b border-line text-left text-label-3 uppercase text-ink-muted">
                <th scope="col" className="pb-2 pr-3 font-medium">Project</th>
                <th scope="col" className="pb-2 pr-3 font-medium">Paid into</th>
                <th scope="col" className="pb-2 font-medium"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <React.Fragment key={p.id}>
                  <tr className="border-b border-line align-top">
                    <td className="py-2 pr-3">
                      <span className="block font-mono text-ink">{p.id}</span>
                      <span className="block text-body-3 text-ink-muted">{p.label}</span>
                    </td>
                    <td className="py-2 pr-3 text-ink">
                      {paidInto[p.id]
                        ? accounts.find((a) => a.id === paidInto[p.id])?.accountMasked ?? "Not recorded"
                        : "Not recorded"}
                    </td>
                    <td className="py-2">
                      <Button
                        appearance="text"
                        size="sm"
                        onClick={() => {
                          setChangingProject(changingProject === p.id ? null : p.id);
                          setChangeAccount("");
                          setChangeReason("");
                        }}
                      >
                        Request change
                      </Button>
                    </td>
                  </tr>
                  {changingProject === p.id && (
                    <tr className="border-b border-line bg-surface-muted">
                      <td colSpan={3} className="p-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <FormField label="Account to pay into" id={`acct-${p.id}`} required>
                            {(control) => (
                              <Select
                                {...control}
                                value={changeAccount}
                                onChange={(e) => setChangeAccount(e.target.value)}
                              >
                                <option value="">Select one of your saved accounts…</option>
                                {accounts.map((a) => (
                                  <option key={a.id} value={a.id}>
                                    {a.bank} · {a.accountMasked} · {a.ifsc}
                                  </option>
                                ))}
                              </Select>
                            )}
                          </FormField>
                          <FormField label="Reason for the change" id={`reason-${p.id}`} required>
                            {(control) => (
                              <Textarea
                                {...control}
                                rows={2}
                                value={changeReason}
                                placeholder="e.g. the branch has been merged and the old account is closed"
                                onChange={(e) => setChangeReason(e.target.value)}
                              />
                            )}
                          </FormField>
                          <div className="sm:col-span-2">
                            <Button
                              onClick={() => submitChange(p.id)}
                              disabled={!changeAccount || !changeReason.trim()}
                            >
                              Submit for approval
                            </Button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
