import type { Metadata } from "next";
import { AppSwitcher } from "@mosje/design-system";
import { AuthProvider } from "@/store/auth-context";
import "./globals.css";

export const metadata: Metadata = {
  title: "PM-AJAY · MoSJE Dashboard",
  description:
    "PM-AJAY (Pradhan Mantri Anusuchit Jaati Abhyuday Yojana) management information system — financial, scheme and governance dashboards for the Ministry of Social Justice & Empowerment, Government of India.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect for Google Fonts to reduce latency */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Noto Sans — primary typeface (DBIM / GIGW standard)
            eslint-disable-next-line @next/next/no-page-custom-font */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
        {/* Material Symbols Rounded — icon font */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,400,0,0&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
        <AppSwitcher devMode={process.env.NODE_ENV === "development"} />
      </body>
    </html>
  );
}
