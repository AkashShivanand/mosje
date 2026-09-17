import type { Metadata } from "next";
import { DarpanReturnView } from "@/components/e-anudaan/darpan-sign-in";

export const metadata: Metadata = { title: "Sign In with NGO-DARPAN | E-Anudaan" };

/** Where NGO-DARPAN sends the applicant back. Every return state is drawn by `DarpanReturnView`. */
export default function DarpanReturnPage() {
  return <DarpanReturnView />;
}
