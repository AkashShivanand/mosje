"use client";

import { useParams } from "next/navigation";
import { GrantWizard } from "@/components/e-anudaan/grant-wizard";

/** The document-upload step. The live portal moves to `step-2` for it. */
export default function ApplyGrantStep2Page() {
  const params = useParams<{ schemeCode: string }>();
  return <GrantWizard schemeCode={params.schemeCode} phase="documents" />;
}
