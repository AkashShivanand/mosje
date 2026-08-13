"use client";

import { useParams } from "next/navigation";
import { GrantWizard } from "@/components/e-anudaan/grant-wizard";

/** All six wizard steps live under this one URL — the live portal's actual behaviour. */
export default function ApplyGrantWizardPage() {
  const params = useParams<{ schemeCode: string }>();
  return <GrantWizard schemeCode={params.schemeCode} />;
}
