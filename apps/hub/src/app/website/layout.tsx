import type { Metadata } from "next";

import { TranslationProvider } from "@/components/i18n/translation-provider";
import { resolveSamaveshBannerPlacement } from "@/lib/samavesh-banner/resolve";
import { SamaveshBannerProvider } from "@/lib/samavesh-banner/context";
import { OG_CARD_IMAGE } from "@/lib/seo/card";
import "./website.css";

const WEBSITE_DESCRIPTION =
  "Department of Social Justice & Empowerment (DoSJE), Ministry of Social Justice & Empowerment, Government of India.";

export const metadata: Metadata = {
  title: "Ministry of Social Justice and Empowerment",
  description: WEBSITE_DESCRIPTION,
  icons: {
    icon: "/website/seo/favicon.png",
    apple: "/website/seo/favicon.png",
  },
  /**
   * The website says the DEPARTMENT is the source, not "the digital estate".
   * A shared link to a scheme page should read as coming from DoSJE — that is
   * the name a citizen recognises, and the one that carries authority.
   *
   * This replaces the root block wholesale — Next does not merge `openGraph`
   * key-by-key across layouts — which is why `type`, `locale` and the image are
   * all restated rather than inherited. Drop `images` and the ~200 website
   * pages beneath here unfurl with no picture at all.
   */
  openGraph: {
    type: "website",
    siteName: "Department of Social Justice & Empowerment",
    locale: "en_IN",
    title: "Ministry of Social Justice and Empowerment",
    description: WEBSITE_DESCRIPTION,
    images: [OG_CARD_IMAGE],
  },
  twitter: { card: "summary_large_image" },
};

/**
 * The website mounts natively in the hub, so this is a NESTED layout: the hub's
 * root layout owns <html>/<body>, the Noto Sans font, ColorModeProvider, the
 * accessibility widget, the AppSwitcher and icons.css.
 *
 * The original <html> carried only `lang`/`suppressHydrationWarning` and
 * `h-full antialiased` + the font variable (all of which the hub root already
 * sets) — verified against the last commit that held the pre-migration layout.
 * It carried NO design-semantic data-* attributes, and deliberately gets no
 * `data-surface="portal"`: this is the website, not a portal.
 *
 * `data-site="website"` is what binds the website's palette, radius scale and
 * base rules to this subtree — see website.css.
 *
 * The wrapper reproduces the old `<body className="min-h-full flex flex-col">`.
 * `min-h-screen` rather than `min-h-full`: a percentage min-height resolves
 * against the parent's height, and the hub's <body> has `height: auto` (only
 * min-height is set), so `min-h-full` here would collapse to 0 and the footer
 * would ride up on short pages. The background/text colours come from
 * website.css, which the original applied via `body { @apply bg-background
 * text-foreground }`.
 */
export default async function WebsiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const placement = await resolveSamaveshBannerPlacement();

  return (
    /* TranslationProvider wraps the whole site, not just the masthead: `lang` and
       `dir` belong on <html>, and a reader who switches language expects it to
       hold as they move between pages. It renders English until something asks
       for a translation, so pages that have not adopted <T> are unaffected. */
    <TranslationProvider>
      <SamaveshBannerProvider placement={placement}>
        <div data-site="website" className="flex min-h-screen flex-col">
          {children}
        </div>
      </SamaveshBannerProvider>
    </TranslationProvider>
  );
}
