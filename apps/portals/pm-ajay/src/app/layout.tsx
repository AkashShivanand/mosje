import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
import { AppSwitcher, ColorModeProvider } from "@mosje/design-system";
import { colorModeInitScript } from "@mosje/design-system/color-mode";
import { AuthProvider } from "@/store/auth-context";
import "./globals.css";

const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "PM-AJAY · MoSJE Dashboard",
  description:
    "PM-AJAY (Pradhan Mantri Anusuchit Jaati Abhyuday Yojana) management information system — financial, scheme and governance dashboards for the Ministry of Social Justice & Empowerment, Government of India.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={notoSans.variable}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: colorModeInitScript() }} />
        {/* Material Symbols Rounded — icon font */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,400,0,0&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ColorModeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
          <AppSwitcher devMode={process.env.NODE_ENV === "development"} />
        </ColorModeProvider>
      </body>
    </html>
  );
}
