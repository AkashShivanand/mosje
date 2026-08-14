"use client";

import { useParams } from "next/navigation";
import { ReviewShell } from "@/components/e-anudaan/review-shell";

/** The PD's decision screen — the same ReviewShell, with sanction/return in its action bar. */
export default function ProgrammeDirectorReviewPage() {
  const params = useParams<{ appId: string }>();
  return <ReviewShell appId={decodeURIComponent(params.appId)} />;
}
