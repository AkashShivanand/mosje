import type { Metadata } from "next";
import "./e-anudaan.css";
import { ToastProvider } from "@mosje/design-system";
import { EAnudaanProvider } from "@/lib/e-anudaan/store/store";

export const metadata: Metadata = {
  title: "E-Anudaan — Grant-in-Aid Management | SAMAVESH · MoSJE",
  description:
    "E-Anudaan — Grant-in-Aid Management Portal. NGOs apply for grant-in-aid under SHRESHTA, AVYAY, NAPDDR and SMILE; applications climb the Programme Division and Integrated Finance Division approval chains to sanction. SAMAVESH (Single Access Mechanism for All Verticals of Empowerment & Social Harmony), Ministry of Social Justice & Empowerment, Government of India.",
  applicationName: "E-Anudaan · Samavesh",
};

// data-portal="e-anudaan" binds this subtree to the portal's Tailwind palette. The hub runs a
// single Tailwind build, so the utility names are global but the values are per-portal custom
// properties scoped by this attribute — see e-anudaan.css.
//
// data-surface="portal" applies the DS portal type scale (tokens.css), as every portal does.
export default function EAnudaanLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-portal="e-anudaan" data-surface="portal">
      <ToastProvider>
        <EAnudaanProvider>{children}</EAnudaanProvider>
      </ToastProvider>
    </div>
  );
}
