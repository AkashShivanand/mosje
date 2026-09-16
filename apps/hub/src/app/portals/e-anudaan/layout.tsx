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
//
// KNOWN CONSOLE ERROR, not ours: "A tree hydrated but some attributes … didn't match", with the diff
// `- style={{zoom:"1"}}` on this div. The UX4G accessibility widget (cdn.ux4g.gov.in, loaded by the
// root layout) writes `style.zoom` onto the page's content wrapper when it initialises; when its
// script lands before React hydrates, React sees an attribute the server never sent. It is timing-
// dependent (8 of 174 and 40 of 184 page loads in two walks of every role's routes, 16 Sep 2026;
// 0 of 121 with the widget's script blocked), changes nothing on screen, and is the only hydration
// mismatch left on E-Anudaan. It is deliberately NOT silenced with
// `suppressHydrationWarning`, which would also hide a real mismatch on this element.
export default function EAnudaanLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-portal="e-anudaan" data-surface="portal">
      <ToastProvider>
        <EAnudaanProvider>{children}</EAnudaanProvider>
      </ToastProvider>
    </div>
  );
}
