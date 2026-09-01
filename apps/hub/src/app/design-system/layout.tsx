import type { Metadata } from "next";
import { DocsLayout } from "@/components/design-system/docs-layout/docs-layout";
import "./design-system.css";

const DS_DESCRIPTION =
  "The shared visual and interaction language for the MoSJE digital estate — 13 websites and 20 portals across 33+ organisations.";

export const metadata: Metadata = {
  title: { template: "%s — SAMAVESH Design System", default: "SAMAVESH Design System" },
  description: DS_DESCRIPTION,
  /**
   * The docs zone already ships its own `opengraph-image.png` and
   * `twitter-image.png` beside this file, so the card art is settled; what was
   * missing was the text half — site name, type and locale — which unfurlers
   * show beneath the picture.
   */
  openGraph: {
    type: "website",
    siteName: "SAMAVESH Design System",
    locale: "en_IN",
    title: "SAMAVESH Design System",
    description: DS_DESCRIPTION,
  },
  twitter: { card: "summary_large_image" },
};

// The docs zone's <html> carried only lang="en" + suppressHydrationWarning — no
// design-carrying data-* attributes (verified against the pre-migration ref) — so
// no wrapper attrs are needed here; the hub root layout already owns lang,
// suppressHydrationWarning, ColorModeProvider, UX4GAccessibilityWidget,
// AppSwitcher, the Noto Sans font, and the no-flash init scripts.
export default function DesignSystemLayout({ children }: { children: React.ReactNode }) {
  return <DocsLayout>{children}</DocsLayout>;
}
