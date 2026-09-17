import type { Metadata } from "next";
import { DarpanStartView } from "@/components/e-anudaan/darpan-sign-in";

export const metadata: Metadata = { title: "Connecting to NGO-DARPAN | E-Anudaan" };

/** Where the "Sign in with NGO-DARPAN" card leads: records the request, then hands off. */
export default function DarpanStartPage() {
  return <DarpanStartView />;
}
