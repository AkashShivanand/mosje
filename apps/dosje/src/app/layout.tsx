import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
import { AccessibilityWidget } from "@mosje/design-system";
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
    <html lang="en-US" className={`${notoSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        {children}
        <AccessibilityWidget />
      </body>
    </html>
  );
}
