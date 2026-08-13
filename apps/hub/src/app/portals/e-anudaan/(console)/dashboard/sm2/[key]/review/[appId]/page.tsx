"use client";

import { useParams } from "next/navigation";
import { ReviewShell } from "@/components/e-anudaan/review-shell";

/**
 * The officer review screen. Path shape is the live portal's:
 * /dashboard/sm2/<key>/review/:id — where <key> is the grade for PD, `jspd` for PD:JS,
 * and `ifd<grade>` for the Integrated Finance Division.
 */
export default function ReviewPage() {
  const params = useParams<{ appId: string }>();
  return <ReviewShell appId={decodeURIComponent(params.appId)} />;
}
