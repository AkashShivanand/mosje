import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/store/app-context";
import { ColorModeProvider, ZoneSwitcher } from "@mosje/design-system";
import { colorModeInitScript } from "@mosje/design-system/color-mode";

// smile-admin's GoI navy maps to the "blue-dark" color mode.
const DEFAULT_MODE = "blue-dark";

const noto = Noto_Sans({
  subsets: ["latin", "devanagari"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SMILE Beggary Rehabilitation Portal | MoSJE",
  description:
    "Single Access Mechanism for Identification, Mobilisation, Shelter & Rehabilitation of Persons Engaged in the Act of Beggary — Ministry of Social Justice & Empowerment, Government of India.",
  applicationName: "SMILE Admin · Samavesh",
  authors: [{ name: "Ministry of Social Justice & Empowerment" }],
  icons: [
    {
      url:
        "data:image/svg+xml;utf8," +
        encodeURIComponent(
          `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='6' fill='%23003366'/><text x='16' y='21' text-anchor='middle' font-family='Inter,sans-serif' font-size='12' font-weight='800' fill='%23ffffff'>स</text></svg>`
        ),
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={noto.variable} data-color-mode={DEFAULT_MODE}>
      <head>
        <script
          dangerouslySetInnerHTML={{ __html: colorModeInitScript(DEFAULT_MODE) }}
        />
      </head>
      <body>
        <ColorModeProvider initialMode={DEFAULT_MODE}>
          <AppProvider>{children}</AppProvider>
          <ZoneSwitcher />
        </ColorModeProvider>
      </body>
    </html>
  );
}
