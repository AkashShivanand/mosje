"use client";

import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { rejectedFor } from "@/lib/e-anudaan/selectors";
import { ApplicationList } from "@/components/e-anudaan/application-list";

/**
 * Rejected Applications — the Programme Division's decisions only.
 *
 * Titled after its menu item. The live page reads "Returned to State GIA", which named neither
 * the menu item that opens it nor what it lists (screen QA, 13 Sep 2026).
 */
export default function PdRejectedPage() {
  const { state } = useEAnudaan();
  return (
    <ApplicationList
      variant="rejected"
      title="Rejected Applications"
      description="Applications rejected by the Programme Division."
      rows={rejectedFor(state, "pd")}
    />
  );
}
