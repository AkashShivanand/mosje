"use client";

import { ROLES, reviewKeyOf } from "@/lib/e-anudaan/roles";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { formatGrant, sanctionedApps } from "@/lib/e-anudaan/selectors";
import { ApplicationList } from "@/components/e-anudaan/application-list";

/**
 * Sanctioned Applications — the Sanction Register. Each row opens the file read-only on the
 * officer's own review screen and its payment status; the register used to end in "—" on every
 * row, so a sanctioned file could not be opened from it (inventory §17).
 */
export default function PdSanctionedPage() {
  const { state } = useEAnudaan();
  const role = state.session ? ROLES[state.session] : null;
  const key = role ? reviewKeyOf(role) : null;
  const rows = sanctionedApps(state);
  const total = rows.reduce((s, a) => s + (a.sanction?.total ?? 0), 0);

  return (
    <ApplicationList
      variant="sanctioned"
      title="Sanctioned Applications"
      description={`${rows.length} sanction orders issued, for ${formatGrant(total)} in all.`}
      rows={rows}
      reviewBase={key ? `/portals/e-anudaan/dashboard/sm2/${key}/review` : undefined}
      paymentBase={role?.caps.includes("review") ? "/portals/e-anudaan/finance/payment-status" : undefined}
      exportable
    />
  );
}
