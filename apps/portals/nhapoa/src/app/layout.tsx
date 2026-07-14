import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
import "./globals.css";
import "@mosje/design-system/icons.css";
import { AppSwitcher, ColorModeProvider, UX4GAccessibilityWidget } from "@mosje/design-system";
import { NhapoaProvider } from "@/lib/store/store";
import { AnnouncementBanner } from "@/components/announcement-banner";

const noto = Noto_Sans({
  subsets: ["latin", "devanagari"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SAMBAL · National Helpline Against Atrocities | SAMAVESH · MoSJE",
  description:
    "SAMBAL (संबल) — the National Helpline Against Atrocities (formerly NHAA). Grievance redressal, rescue and relief under the PoA Act. SAMAVESH, Ministry of Social Justice & Empowerment, Government of India.",
  applicationName: "SAMBAL · Samavesh",
  icons: [
    {
      url:
        "data:image/svg+xml;utf8," +
        encodeURIComponent(
          `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='6' fill='%2313366b'/><text x='16' y='21' text-anchor='middle' font-family='sans-serif' font-size='11' font-weight='800' fill='%23ffffff'>SB</text></svg>`,
        ),
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={noto.variable} data-surface="portal">
      <body>
        <ColorModeProvider>
          <NhapoaProvider>
            <AnnouncementBanner />
            {children}
            <UX4GAccessibilityWidget />
            <AppSwitcher devMode={process.env.NODE_ENV === "development"} />
          </NhapoaProvider>
        </ColorModeProvider>
      </body>
    </html>
  );
}
