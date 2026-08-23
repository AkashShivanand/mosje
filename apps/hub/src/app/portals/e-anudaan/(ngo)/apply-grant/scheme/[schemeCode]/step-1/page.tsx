"use client";

import { useParams } from "next/navigation";
import { GrantWizard } from "@/components/e-anudaan/grant-wizard";

/** The scheme's early steps. The live portal keeps all of them on this one URL. */
export default function ApplyGrantStep1Page() {
  const params = useParams<{ schemeCode: string }>();
  return <GrantWizard schemeCode={params.schemeCode} phase="form" />;
}
