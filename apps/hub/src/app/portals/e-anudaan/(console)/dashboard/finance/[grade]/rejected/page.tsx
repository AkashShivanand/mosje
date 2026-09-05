"use client";

import { ROLES } from "@/lib/e-anudaan/roles";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { rejectedFor } from "@/lib/e-anudaan/selectors";
import { WorklistTable } from "@/components/e-anudaan/worklist-table";

export default function FinanceRejectedPage() {
  const { state } = useEAnudaan();
  const role = state.session ? ROLES[state.session] : null;
  if (!role) return null;
  const rows = rejectedFor(state);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-headline-1 text-ink">Finance Rejected</h1>
        <p className="mt-1 text-body-2 text-ink-muted">Applications rejected or returned by the Integrated Finance Division.</p>
      </div>
      <WorklistTable
        rows={rows}
        variant="rejected"
        caption="Finance Rejected"
      />
    </div>
  );
}
