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
 * It lists every file with the seat, of every scheme — AVYAY and NAPDDR as well as SHRESHTA — so
 * the title "SHRESHTA Mode 2" mislabelled it (inventory §15, §23). It is titled for what it holds,
 * as its menu item now is.
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
      <PageHeader title="My Worklist" meta={`Applications of every scheme awaiting action by ${seat}.`} />
      <WorklistTable
        rows={rows}
        variant="queue"
        reviewBase={`/portals/e-anudaan/dashboard/sm2/${params.key}/review`}
        caption={`Applications awaiting action by ${seat}`}
      />
    </div>
  );
}
