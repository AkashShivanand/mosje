import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
import { ColorModeProvider, UX4GAccessibilityWidget } from "@mosje/design-system";
import { colorModeInitScript } from "@mosje/design-system/color-mode";
import { ConditionalAppSwitcher } from "@/components/conditional-app-switcher";
import { themeInitScript } from "@/lib/theme";
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${notoSans.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: colorModeInitScript() }} />
        <script dangerouslySetInnerHTML={{ __html: themeInitScript() }} />
      </head>
      {/* suppressHydrationWarning: browser extensions (e.g. Grammarly) inject
          attributes onto <body> before React hydrates — benign, React-recommended. */}
      <body className="min-h-full font-sans bg-surface-muted text-ink" suppressHydrationWarning>
        <ColorModeProvider>
          {children}
          <UX4GAccessibilityWidget />
          <ConditionalAppSwitcher />
        </ColorModeProvider>
      </body>
    </html>
  );
}
