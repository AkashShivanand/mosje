"use client";

import { Button, Icon } from "@mosje/design-system";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { ngoApplications } from "@/lib/e-anudaan/selectors";

/** Copy and the "one account per project" rule are verbatim from the live screen (§6). */
export default function BankAccountsPage() {
  const { state } = useEAnudaan();
  const ngo = state.ngos[0];
  const projects = ngo ? ngoApplications(state, ngo.id).slice(0, 3) : [];

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
        <Button appearance="outlined"><Icon name="add" size={16} aria-hidden /> Add account</Button>
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
            <tr className="border-b border-line">
              <td className="py-2 pr-3 text-ink">State Bank of India</td>
              <td className="py-2 pr-3 font-mono text-ink">••••••••••3213</td>
              <td className="py-2 pr-3 text-ink">SBIN0001234</td>
              <td className="py-2 text-ink">Pune Camp</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="rounded-xl border border-line bg-surface p-5">
        <h2 className="text-base font-semibold text-ink">Project bank accounts</h2>
        <ul className="mt-4 divide-y divide-line">
          {projects.map((p) => (
            <li key={p.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
              <span className="text-sm text-ink">{p.projectLabel}</span>
              <span className="text-sm text-ink-muted">SBI ••••3213</span>
              <Button appearance="outlined" size="sm">Request change</Button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
