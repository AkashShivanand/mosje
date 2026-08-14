"use client";

import { ROLES } from "@/lib/e-anudaan/roles";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { sanctionedApps } from "@/lib/e-anudaan/selectors";
import { WorklistTable } from "@/components/e-anudaan/worklist-table";

export default function PdSanctionedPage() {
  const { state } = useEAnudaan();
  const role = state.session ? ROLES[state.session] : null;
  if (!role) return null;
  const rows = sanctionedApps(state);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-ink">Sanctioned Applications</h1>
        <p className="mt-1 text-sm text-ink-muted">Sanction Register — every application with a sanction order.</p>
      </div>
      <WorklistTable
        rows={rows}
        variant="sanctioned"
        caption="Sanctioned Applications"
      />
    </div>
  );
}
