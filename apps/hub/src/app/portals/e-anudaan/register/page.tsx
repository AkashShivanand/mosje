import type { Metadata } from "next";
import { DarpanRegisterView } from "@/components/e-anudaan/darpan-sign-in";

export const metadata: Metadata = { title: "Register Your Organisation | E-Anudaan" };

/** Registration for an organisation NGO-DARPAN knows and e-Anudaan does not. */
export default function EAnudaanRegisterPage() {
  return <DarpanRegisterView />;
}
