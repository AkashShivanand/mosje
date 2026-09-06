"use client";

import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { rejectedFor } from "@/lib/e-anudaan/selectors";
import { ApplicationList } from "@/components/e-anudaan/application-list";

export default function PdRejectedPage() {
  const { state } = useEAnudaan();
  return (
    <ApplicationList
      variant="rejected"
      title="Returned to State GIA"
      description="Applications rejected or returned for reconsideration."
      rows={rejectedFor(state)}
    />
  );
}
