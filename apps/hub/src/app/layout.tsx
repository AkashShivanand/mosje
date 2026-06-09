import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
import { ColorModeProvider } from "@mosje/design-system";
import { colorModeInitScript } from "@mosje/design-system/color-mode";
import "./globals.css";

const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "MoSJE Digital Estate",
  description:
    "Ministry of Social Justice and Empowerment — unified digital estate gateway.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${notoSans.variable} h-full antialiased`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: colorModeInitScript() }} />
      </head>
      <body className="min-h-full font-sans bg-surface-muted text-ink">
        <ColorModeProvider>{children}</ColorModeProvider>
      </body>
    </html>
  );
}
