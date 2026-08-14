"use client";

import { ROLES } from "@/lib/e-anudaan/roles";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { forwardedFor } from "@/lib/e-anudaan/selectors";
import { WorklistTable } from "@/components/e-anudaan/worklist-table";

export default function PdForwardedPage() {
  const { state } = useEAnudaan();
  const role = state.session ? ROLES[state.session] : null;
  if (!role) return null;
  const rows = forwardedFor(state, role.id);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-ink">Forwarded Applications</h1>
        <p className="mt-1 text-sm text-ink-muted">Forwarded Queue — applications you have moved up the chain.</p>
      </div>
      <WorklistTable
        rows={rows}
        variant="forwarded"
        caption="Forwarded Applications"
      />
    </div>
  );
}
