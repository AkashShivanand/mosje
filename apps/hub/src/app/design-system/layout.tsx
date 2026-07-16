import type { Metadata } from "next";
import { DocsLayout } from "@/components/design-system/docs-layout/docs-layout";
import "./design-system.css";

export const metadata: Metadata = {
  title: { template: "%s — SAMAVESH Design System", default: "SAMAVESH Design System" },
  description:
    "The shared visual and interaction language for the MoSJE digital estate — 13 websites and 20 portals across 33+ organisations.",
};

// The docs zone's <html> carried only lang="en" + suppressHydrationWarning — no
// design-carrying data-* attributes (verified against the pre-migration ref) — so
// no wrapper attrs are needed here; the hub root layout already owns lang,
// suppressHydrationWarning, ColorModeProvider, UX4GAccessibilityWidget,
// AppSwitcher, the Noto Sans font, and the no-flash init scripts.
export default function DesignSystemLayout({ children }: { children: React.ReactNode }) {
  return <DocsLayout>{children}</DocsLayout>;
}
