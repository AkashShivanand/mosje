import type { Metadata } from "next";

import { TranslationProvider } from "@/components/i18n/translation-provider";
import { OG_CARD_IMAGE } from "@/lib/seo/card";
import { DbimHeader } from "@/components/website-dbim/chrome/Header";
import { DbimFooter } from "@/components/website-dbim/chrome/Footer";
import { DbimCookieConsent } from "@/components/website-dbim/chrome/CookieConsent";
import { DbimScrollToTop } from "@/components/website-dbim/chrome/ScrollToTop";
import "@/components/website-dbim/dbim.css";

const DESCRIPTION =
  "Department of Social Justice & Empowerment (DoSJE), Ministry of Social Justice & Empowerment, Government of India.";

export const metadata: Metadata = {
  title: "Department of Social Justice and Empowerment",
  description: DESCRIPTION,
  icons: { icon: "/website/seo/favicon.png", apple: "/website/seo/favicon.png" },
  openGraph: {
    type: "website",
    siteName: "Department of Social Justice & Empowerment",
    locale: "en_IN",
    title: "Department of Social Justice and Empowerment",
    description: DESCRIPTION,
    images: [OG_CARD_IMAGE],
  },
  twitter: { card: "summary_large_image" },
  /* A comparison design, reached at the /website addresses through the demo rail's
     Website tab (lib/website-design/constants.ts). Its own /website-dbim addresses
     are copies and are never indexed. */
  robots: { index: false, follow: false },
};

/**
 * The DBIM design of the website: a clone of the Department's DBIM 3.0 reference
 * build (master-socialjustice.digifootprint.gov.in), which the DBIM review team named
 * as the target on 25 Sep 2026, carrying the Department's own content.
 *
 * `data-brand="dbim"` re-binds every `--sa-*` colour to DBIM Colour Group 5 — the
 * group the reference uses (`html.group5`): #162F6A · #214AAB · #5279D7 · #A3BBF3 ·
 * #D2DFFF, ink #150202. So every colour in this tree is a token and none is typed.
 * `data-design="dbim"` scopes this design's stylesheet (dbim.css) to this subtree.
 *
 * Nested under the hub root, which owns <html>/<body>, Noto Sans, the UX4G
 * accessibility widget and the demo rail.
 */
export default function DbimWebsiteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <TranslationProvider>
      <div data-site="dbim" data-design="dbim" data-brand="dbim" className="db-root">
        <DbimHeader />
        <main id="maincontent" className="db-main" tabIndex={-1}>
          {children}
        </main>
        <DbimFooter />
        <DbimScrollToTop />
        <DbimCookieConsent />
      </div>
    </TranslationProvider>
  );
}
