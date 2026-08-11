import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
import { ColorModeProvider, UX4GAccessibilityWidget } from "@mosje/design-system";
import { colorModeInitScript } from "@mosje/design-system/color-mode";
import { ConditionalDemoDock } from "@/components/conditional-demo-dock";
import { resolveRegistry } from "@/lib/registry/resolve";
import "./globals.css";
// Material Symbols Rounded — the SAMAVESH icon system. Loaded ONCE here because
// the hub is now the single app hosting every natively-mounted portal.
import "@mosje/design-system/icons.css";

const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "MoSJE Digital Estate",
  description:
    "Ministry of Social Justice and Empowerment — unified digital estate gateway.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // The dock's destination list is the estate registry, so it has to honour
  // what an admin has hidden or reordered. Resolved here rather than inside the
  // dock because the dock is a client component and the settings store is
  // server-only. The read is cache-tagged, so this does not make the layout —
  // and with it every route in the estate — render per request.
  const apps = await resolveRegistry();

  return (
    <html lang="en-IN" className={`${notoSans.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: colorModeInitScript() }} />
      </head>
      {/* suppressHydrationWarning: browser extensions (e.g. Grammarly) inject
          attributes onto <body> before React hydrates — benign, React-recommended. */}
      <body className="min-h-full font-sans bg-surface-muted text-ink" suppressHydrationWarning>
        <ColorModeProvider>
          {children}
          <UX4GAccessibilityWidget />
          <ConditionalDemoDock apps={apps} />
        </ColorModeProvider>
      </body>
    </html>
  );
}
