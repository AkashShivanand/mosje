import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/toast";
import { DemoFab } from "@/components/demo-fab";
import { AppSwitcher, ColorModeProvider } from "@mosje/design-system";

const notoSans = Noto_Sans({
  subsets: ["latin", "devanagari"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-noto",
});

export const metadata: Metadata = {
  title: "Nasha Mukt Bharat Abhiyaan | Ministry of Social Justice & Empowerment",
  description:
    "Nasha Mukt Bharat Abhiyaan (NMBA) — de-addiction awareness campaign by the Ministry of Social Justice & Empowerment, Government of India.",
  icons: { icon: "/portals/nmba/brand/national-emblem.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${notoSans.variable} font-sans`}>
        <ColorModeProvider>
          <ToastProvider>{children}</ToastProvider>
          <AppSwitcher devMode={process.env.NODE_ENV === "development"} />
          <DemoFab devMode={process.env.NODE_ENV === "development"} />
        </ColorModeProvider>
      </body>
    </html>
  );
}
