"use client";

import * as React from "react";
import { Button, FormField, Icon, Input, Modal, useToast } from "@mosje/design-system";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { ngoApplications } from "@/lib/e-anudaan/selectors";

/** Copy and the "one account per project" rule are verbatim from the live screen (§6). */
export default function BankAccountsPage() {
  const { state } = useEAnudaan();
  const { toast } = useToast();
  const ngo = state.ngos[0];
  const projects = ngo ? ngoApplications(state, ngo.id).slice(0, 3) : [];

  const [isOpen, setIsOpen] = React.useState(false);
  const [bankName, setBankName] = React.useState("");
  const [accountNo, setAccountNo] = React.useState("");
  const [ifsc, setIfsc] = React.useState("");
  const [branch, setBranch] = React.useState("");
  const [accountsList, setAccountsList] = React.useState([
    { bank: "State Bank of India", accountMasked: "••••••••••3213", ifsc: "SBIN0001234", branch: "Pune Camp" },
  ]);

  const handleAddAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bankName || !accountNo || !ifsc) return;
    const last4 = accountNo.slice(-4) || "9999";
    setAccountsList((prev) => [
      ...prev,
      {
        bank: bankName,
        accountMasked: `••••••••••${last4}`,
        ifsc: ifsc.toUpperCase(),
        branch: branch || "Main Branch",
      },
    ]);
    setIsOpen(false);
    setBankName("");
    setAccountNo("");
    setIfsc("");
    setBranch("");
    toast(`Bank Account ending in ${last4} added for PFMS verification.`, "success");
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink">My Bank Accounts</h1>
          <p className="mt-1 text-sm text-ink-muted">
            Accounts you save here can be selected when applying.{" "}
            <strong>Each project must use a separate account.</strong>
          </p>
        </div>
        <Button appearance="outlined" onClick={() => setIsOpen(true)}>
          <Icon name="add" size={16} aria-hidden /> Add account
        </Button>
      </div>

      <section className="rounded-xl border border-line bg-surface p-5">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-ink-muted">
              <th className="pb-2 pr-3 font-medium">Bank</th>
              <th className="pb-2 pr-3 font-medium">Account</th>
              <th className="pb-2 pr-3 font-medium">IFSC</th>
              <th className="pb-2 font-medium">Branch</th>
            </tr>
          </thead>
          <tbody>
            {accountsList.map((acc, i) => (
              <tr key={i} className="border-b border-line">
                <td className="py-2.5 pr-3 text-ink font-medium">{acc.bank}</td>
                <td className="py-2.5 pr-3 font-mono text-ink">{acc.accountMasked}</td>
                <td className="py-2.5 pr-3 text-ink">{acc.ifsc}</td>
                <td className="py-2.5 text-ink-muted">{acc.branch}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="rounded-xl border border-line bg-surface p-5">
        <h2 className="text-base font-semibold text-ink">Project bank accounts</h2>
        <ul className="mt-4 divide-y divide-line">
          {projects.map((p) => (
            <li key={p.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
              <span className="text-sm text-ink font-medium">{p.projectLabel}</span>
              <span className="text-sm text-ink-muted">SBI ••••3213</span>
              <Button appearance="outlined" size="sm">Request change</Button>
            </li>
          ))}
        </ul>
      </section>

      <Modal open={isOpen} onClose={() => setIsOpen(false)} title="Add Bank Account">
        <form onSubmit={handleAddAccount} className="space-y-4 pt-2">
          <p className="text-xs text-ink-muted">
            Enter account details as registered on PFMS. Accounts are validated before grant disbursement.
          </p>

          <FormField label="Bank Name" required id="bank-name">
            {(control) => (
              <Input
                {...control}
                placeholder="e.g. State Bank of India"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                required
              />
            )}
          </FormField>

          <FormField label="Account Number" required id="account-no">
            {(control) => (
              <Input
                {...control}
                placeholder="Enter bank account number"
                value={accountNo}
                onChange={(e) => setAccountNo(e.target.value)}
                required
              />
            )}
          </FormField>

          <FormField label="IFSC Code" required id="ifsc-code">
            {(control) => (
              <Input
                {...control}
                placeholder="e.g. SBIN0001234"
                value={ifsc}
                onChange={(e) => setIfsc(e.target.value)}
                required
              />
            )}
          </FormField>

          <FormField label="Branch Name" id="branch-name">
            {(control) => (
              <Input
                {...control}
                placeholder="e.g. Pune Main Branch"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
              />
            )}
          </FormField>

          <div className="mt-6 flex justify-end gap-2">
            <Button appearance="outlined" type="button" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button appearance="filled" type="submit">
              Save Account
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

