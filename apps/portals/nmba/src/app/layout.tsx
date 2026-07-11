import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import "@mosje/design-system/icons.css";
import { ToastProvider } from "@/components/toast";
import {
  AppSwitcher,
  ColorModeProvider,
  UX4GAccessibilityWidget,
  COLOR_MODE_COOKIE,
  normalizeColorMode,
} from "@mosje/design-system";

const notoSans = Noto_Sans({
  subsets: ["latin", "devanagari"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-noto",
});

// This portal follows the SAMAVESH Figma, which uses the deep-navy primary —
// that is the DS `blue-dark` colour mode (swatch #003366). We default the brand
// axis to it (the colour-mode switcher still lets users change + persist). No
// hardcoded colours: the navy comes entirely from the DS
// `[data-color-mode="blue-dark"]` token block.
const PORTAL_DEFAULT_MODE = "blue-dark";

/** No-flash: set the mode attribute before paint and persist the portal default. */
const colorModeInit = `(function(){try{var c=${JSON.stringify(
  COLOR_MODE_COOKIE,
)};var m=document.cookie.match(new RegExp("(?:^|; )"+c+"=([^;]+)"));var v=m?decodeURIComponent(m[1]):${JSON.stringify(
  PORTAL_DEFAULT_MODE,
)};if(!m){document.cookie=c+"="+v+"; path=/; max-age=31536000; samesite=lax";}document.documentElement.setAttribute("data-color-mode",v);}catch(e){}})();`;

export const metadata: Metadata = {
  title: "Nasha Mukt Bharat Abhiyaan | Ministry of Social Justice & Empowerment",
  description:
    "Nasha Mukt Bharat Abhiyaan (NMBA) — de-addiction awareness campaign by the Ministry of Social Justice & Empowerment, Government of India.",
  icons: { icon: "/portals/nmba/brand/national-emblem.svg" },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const stored = cookieStore.get(COLOR_MODE_COOKIE)?.value;
  const mode = stored ? normalizeColorMode(stored) : PORTAL_DEFAULT_MODE;

  return (
    <html lang="en" data-color-mode={mode} data-surface="portal">
      <head>
        <script dangerouslySetInnerHTML={{ __html: colorModeInit }} />
      </head>
      <body className={`${notoSans.variable} font-sans`}>
        <ColorModeProvider initialMode={mode}>
          <ToastProvider>{children}</ToastProvider>
          <UX4GAccessibilityWidget />
          <AppSwitcher devMode={process.env.NODE_ENV === "development"} />
        </ColorModeProvider>
      </body>
    </html>
  );
}
