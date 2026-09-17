import type { Metadata } from "next";
import { DarpanConsentView } from "@/components/e-anudaan/darpan-sign-in";

export const metadata: Metadata = {
  title: "NGO-DARPAN Consent (Prototype Stand-In) | E-Anudaan",
  robots: { index: false, follow: false },
};

/** The provider's consent step, simulated. See `DarpanConsentView`. */
export default function DarpanConsentPage() {
  return <DarpanConsentView />;
}
