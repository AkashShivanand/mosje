import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
import "./globals.css";
import { AppSwitcher, ColorModeProvider } from "@mosje/design-system";

const noto = Noto_Sans({
  subsets: ["latin", "devanagari"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SCW · Senior Citizens Welfare | SAMAVESH · MoSJE",
  description:
    "Senior Citizens Welfare portal — SAMAVESH (Single Access Mechanism for All Verticals of Empowerment & Social Harmony), Ministry of Social Justice & Empowerment, Government of India.",
  applicationName: "SCW · Samavesh",
  icons: [
    {
      url:
        "data:image/svg+xml;utf8," +
        encodeURIComponent(
          `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='6' fill='%2313366b'/><text x='16' y='21' text-anchor='middle' font-family='sans-serif' font-size='13' font-weight='800' fill='%23ffffff'>स</text></svg>`
        ),
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={noto.variable}>
      <body>
        <ColorModeProvider>
          {children}
          <AppSwitcher devMode={process.env.NODE_ENV === "development"} />
        </ColorModeProvider>
      </body>
    </html>
  );
}
