"use client";

import { useParams } from "next/navigation";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { roleForSchemeKey, worklistFor } from "@/lib/e-anudaan/selectors";
import { WorklistTable } from "@/components/e-anudaan/worklist-table";

/**
 * Scheme worklist — `/dashboard/sm2/ifd<grade>` on the live portal, where each IFD grade gets
 * its OWN list (unlike the PD grades, which share one Application Explorer).
 */
export default function SchemeWorklistPage() {
  const params = useParams<{ key: string }>();
  const { state } = useEAnudaan();
  const role = roleForSchemeKey(params.key);
  if (!role) return null;

  const rows = worklistFor(state, role.id);
  const title =
    role.division === "finance"
      ? `SHRESHTA Mode-2 — ${role.grade === "js" ? "JS-IFD" : `IFD-${role.grade?.toUpperCase()}`}`
      : `SHRESHTA Mode-2 — ${role.grade?.toUpperCase()}`;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-ink">{title}</h1>
        <p className="mt-1 text-sm text-ink-muted">Applications</p>
      </div>
      <WorklistTable
        rows={rows}
        variant="queue"
        reviewBase={`/portals/e-anudaan/dashboard/sm2/${params.key}/review`}
        caption={title}
      />
    </div>
  );
}
