import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
import { UX4GAccessibilityWidget, AppSwitcher, ColorModeProvider } from "@mosje/design-system";
import { colorModeInitScript } from "@mosje/design-system/color-mode";
import "./globals.css";

// dosje.gov.in uses Noto Sans throughout (DBIM-compliant gov typeface)
const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ministry of Social Justice and Empowerment",
  description:
    "Department of Social Justice & Empowerment (DoSJE), Ministry of Social Justice & Empowerment, Government of India.",
  icons: {
    icon: "/seo/favicon.png",
    apple: "/seo/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-US" className={`${notoSans.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        {/* No-flash: set data-color-mode from the cookie before first paint.
            Keeps every route statically generable (no cookies() in this layout). */}
        <script dangerouslySetInnerHTML={{ __html: colorModeInitScript() }} />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <ColorModeProvider>
          {children}
          <UX4GAccessibilityWidget />
          <AppSwitcher devMode={process.env.NODE_ENV === "development"} />
        </ColorModeProvider>
      </body>
    </html>
  );
}
