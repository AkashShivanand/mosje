import type { Metadata } from "next";
import { ColorModeProvider, colorModeInitScript } from "@mosje/design-system";
import { AppSwitcher } from "@mosje/design-system";
import { DocsLayout } from "@/components/docs-layout/docs-layout";
import { themeInitScript } from "@/lib/theme";
import "./globals.css";

export const metadata: Metadata = {
  title: { template: "%s — SAMAVESH Design System", default: "SAMAVESH Design System" },
  description:
    "The shared visual and interaction language for the MoSJE digital estate — 13 websites and 20 portals across 33+ organisations.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* No-flash: set the correct appearance + brand axis before first paint. */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript() }} />
        <script dangerouslySetInnerHTML={{ __html: colorModeInitScript() }} />
      </head>
      <body>
        <ColorModeProvider initialMode="blue-light">
          <DocsLayout>{children}</DocsLayout>
          <AppSwitcher devMode={process.env.NODE_ENV === "development"} />
        </ColorModeProvider>
      </body>
    </html>
  );
}
