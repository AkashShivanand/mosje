import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
import "./globals.css";
import "@mosje/design-system/icons.css";
import { AppSwitcher, ColorModeProvider, ToastProvider, UX4GAccessibilityWidget } from "@mosje/design-system";
import { TgProvider } from "@/lib/store/store";

const noto = Noto_Sans({
  subsets: ["latin", "devanagari"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto",
  display: "swap",
});

export const metadata: Metadata = {
  title: "National Portal for Transgender Persons | SAMAVESH · MoSJE",
  description:
    "National Portal for Transgender Persons — apply for and track your Transgender Identity Certificate and access welfare (scholarships, skill training, Garima Greh, medical support). SAMAVESH (Single Access Mechanism for All Verticals of Empowerment & Social Harmony), Ministry of Social Justice & Empowerment, Government of India.",
  applicationName: "TG · Samavesh",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={noto.variable} data-surface="portal">
      <body>
        <ColorModeProvider>
          <ToastProvider>
            <TgProvider>{children}</TgProvider>
          </ToastProvider>
          <UX4GAccessibilityWidget />
          <AppSwitcher devMode={process.env.NODE_ENV === "development"} />
        </ColorModeProvider>
      </body>
    </html>
  );
}
