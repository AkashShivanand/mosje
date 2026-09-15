"use client";

import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { rejectedFor } from "@/lib/e-anudaan/selectors";
import { ApplicationList } from "@/components/e-anudaan/application-list";

/** Finance Rejected — the Integrated Finance Division's decisions only, never the Programme Division's. */
export default function FinanceRejectedPage() {
  const { state } = useEAnudaan();
  return (
    <ApplicationList
      variant="rejected"
      title="Finance Rejected"
      description="Applications rejected by the Integrated Finance Division."
      rows={rejectedFor(state, "finance")}
    />
  );
}
