"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Icon } from "@mosje/design-system";

/** Post-submission confirmation. The live route exists in the bundle but was never reached. */
export default function ApplySuccessPage() {
  const params = useParams<{ schemeCode: string }>();
  return (
    <div className="mx-auto max-w-xl space-y-5 text-center">
      <Icon name="check_circle" size={64} className="text-success" aria-hidden />
      <h1 className="text-2xl font-bold text-ink">Application submitted</h1>
      <p className="text-sm text-ink-muted">
        Your {params.schemeCode} application has been submitted and is now with the Ministry for
        review. You can track its progress from My Applications.
      </p>
      <Link
        href="/portals/e-anudaan/ngo/my-applications"
        className="inline-flex items-center gap-2 rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
      >
        Go to My Applications
      </Link>
    </div>
  );
}
