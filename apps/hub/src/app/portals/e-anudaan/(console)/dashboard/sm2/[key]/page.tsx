"use client";

import { useParams } from "next/navigation";
import { PageHeader } from "@mosje/design-system";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { roleForSchemeKey, worklistFor } from "@/lib/e-anudaan/selectors";
import { holderLabel } from "@/lib/e-anudaan/workflow";
import { WorklistTable } from "@/components/e-anudaan/worklist-table";

/**
 * Scheme worklist — `/dashboard/sm2/ifd<grade>` on the live portal, where each IFD grade gets
 * its OWN list (unlike the PD grades, which share one Application Explorer).
 *
 * Titled "SHRESHTA Mode 2", as its menu item is; the grade the list belongs to is the meta line.
 */
export default function SchemeWorklistPage() {
  const params = useParams<{ key: string }>();
  const { state } = useEAnudaan();
  const role = roleForSchemeKey(params.key);
  if (!role || !role.division || !role.grade) return null;

  const rows = worklistFor(state, role.id);
  const seat = holderLabel({ kind: "chain", division: role.division, grade: role.grade }).replace(/^With /, "");

  return (
    <div className="space-y-5">
      <PageHeader eyebrow="E-ANUDAAN" title="SHRESHTA Mode 2" meta={`Applications awaiting action by ${seat}`} />
      <WorklistTable
        rows={rows}
        variant="queue"
        reviewBase={`/portals/e-anudaan/dashboard/sm2/${params.key}/review`}
        caption={`SHRESHTA Mode 2 applications awaiting action by ${seat}`}
      />
    </div>
  );
}
