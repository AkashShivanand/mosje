"use client";

import { useParams } from "next/navigation";
import { GrantWizard } from "@/components/e-anudaan/grant-wizard";

/** Review & Submit. The live portal moves to `review` for the read-back. */
export default function ApplyGrantReviewPage() {
  const params = useParams<{ schemeCode: string }>();
  return <GrantWizard schemeCode={params.schemeCode} phase="review" />;
}
