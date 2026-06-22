import type { Metadata } from "next";
import Script from "next/script";
import { Noto_Sans } from "next/font/google";
import { AppSwitcher, ColorModeProvider, DemoFab } from "@mosje/design-system";

const PM_AJAY_DEMO_ACCOUNTS = [
  { role: "Joint Secretary", id: "JS001", password: "Password@123" },
  { role: "District Secretary", id: "DS002", password: "Password@123" },
  { role: "State Officer", id: "SO003", password: "Password@123" },
  { role: "District Officer", id: "DO005", password: "Password@123" },
];
import { colorModeInitScript } from "@mosje/design-system/color-mode";
import { AuthProvider } from "@/store/auth-context";
import "./globals.css";

const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin", "latin-ext", "devanagari"],
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <ColorModeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
          <AppSwitcher devMode={process.env.NODE_ENV === "development"} />
          <DemoFab accounts={PM_AJAY_DEMO_ACCOUNTS} devMode={process.env.NODE_ENV === "development"} idLabel="Employee ID" />
        </ColorModeProvider>
        {/* Material Symbols Rounded — loaded after interaction so it never blocks first paint (PERF-001) */}
        <Script
          id="material-symbols"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `var l=document.createElement('link');l.rel='stylesheet';l.href='https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,400,0,0&display=swap';document.head.appendChild(l);`,
          }}
        />
      </body>
    </html>
  );
}
