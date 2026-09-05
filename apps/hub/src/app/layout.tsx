import type { Metadata } from "next";
import { Noto_Sans, Noto_Sans_Display } from "next/font/google";
import { ColorModeProvider, UX4GAccessibilityWidget } from "@mosje/design-system";
import { DataModeProvider } from "@/lib/data-mode/context";
import { NotInEmbed } from "@/components/conditional-embed-chrome";
import { colorModeInitScript } from "@mosje/design-system/color-mode";
import { ConditionalChatbot } from "@/components/conditional-chatbot";
import { ConditionalDemoDock } from "@/components/conditional-demo-dock";
import { resolveChatbotPaths } from "@/lib/chatbot/resolve";
import { resolveDemoToolsEnabled } from "@/lib/demo-tools/resolve";
import { resolveRegistry } from "@/lib/registry/resolve";
import { SITE_NAME, siteOrigin } from "@/lib/seo/site";
import "./globals.css";
// Material Symbols Rounded — the SAMAVESH icon system. Loaded ONCE here because
// the hub is now the single app hosting every natively-mounted portal.
import "@mosje/design-system/icons.css";

/**
 * `devanagari` is in the subset list because the estate ships Hindi and nothing was loading it.
 *
 * The previous `subsets: ["latin"]` contains no Devanagari glyphs, so every Hindi string — the
 * `lang="hi"` samples on the typography page, and any Hindi content — rendered in whatever face
 * the device happened to have. A different typeface per visitor, on a Government of India
 * property where Noto Sans is a DBIM requirement.
 *
 * Noto Sans is a superfamily and carries Devanagari itself, so this needs no second family:
 * next/font emits one @font-face per subset with a `unicode-range`, which means the Devanagari
 * file is fetched ONLY by pages that actually contain Devanagari characters. English-only pages
 * download exactly what they did before.
 */
const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

/**
 * The Devanagari subset is a SECOND loader, and the reason is one attribute: `preload`.
 *
 * With `subsets: ["latin", "devanagari"]` on one loader, next/font emits a preload link for
 * EVERY listed subset, and a `<link rel="preload">` is fetched unconditionally — it does not
 * consult the `unicode-range` that would otherwise defer the file until Devanagari appears.
 * Measured 2026-09-04: the 99 KB Devanagari file was the largest asset preloaded on every
 * English-only page, two-thirds of the 148 KB preload set, on a service designed for
 * low-bandwidth audiences. The comment above it said the opposite.
 *
 * Split, the Latin face keeps its preload and the Devanagari face lazy-loads through its
 * unicode-range: a Hindi page fetches it on first paint of Hindi text (one round trip,
 * swapped in over the metric-matched fallback, so no layout shift), an English page never
 * does. Both variables go into the family stack in globals.css, Latin first, so a glyph the
 * Latin face lacks falls to the Devanagari face and a glyph both lack falls to the system.
 */
const notoSansDevanagari = Noto_Sans({
  variable: "--font-noto-devanagari",
  subsets: ["devanagari"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: false,
});

/**
 * The OPTICAL DISPLAY CUT, for the 40–80px Display ramp.
 *
 * Noto Sans ships two cuts of the same design. The text cut is drawn for reading at 12–24px —
 * open apertures, generous spacing, sturdy joins. At 80px those same choices read as loose and
 * slightly clumsy. The Display cut tightens spacing and refines the letterforms for exactly that
 * size range. It is what `font.family.display` has always named; nothing had ever loaded it, so
 * the token silently fell through to the text cut.
 *
 * Weight 500 only — every Display/* text style is Medium, so loading the other weights would
 * ship files nothing renders. Add a weight here the moment the ramp uses one.
 *
 * NOTE: this cut covers Latin only. `Noto Sans Display` has no Devanagari subset and
 * `Noto Sans Devanagari` has no Display cut — the pairing does not exist in Noto. Hindi display
 * headings therefore fall through the stack to Noto Sans, which is correct: the alternative
 * would be no Devanagari glyphs at all.
 */
const notoSansDisplay = Noto_Sans_Display({
  variable: "--font-noto-display",
  subsets: ["latin"],
  weight: ["500"],
  display: "swap",
});

/**
 * `metadataBase` is the load-bearing line here, and it was missing.
 *
 * Open Graph and Twitter cards are fetched by a machine that has no page
 * context, so every url in them must be absolute. Without a base Next resolves
 * relative image paths against `http://localhost:3000` — a host no unfurler can
 * reach — and warns at build time. Setting it once at the root fixes it for
 * every route in the estate, including `opengraph-image.tsx` beside this file.
 *
 * The `openGraph`/`twitter` blocks below are DEFAULTS. A nested layout or page
 * that exports its own replaces the whole block rather than merging into it, so
 * a section that overrides one restates the fields it still wants — see
 * `website/layout.tsx`.
 *
 * Deliberately absent: `alternates.canonical` and `openGraph.url`. Both would be
 * inherited verbatim by every page below, so a single root value would have ~200
 * pages all claiming to be the homepage. They belong on individual routes.
 *
 * Deliberately absent: a `title.template`. Titles across the estate already end
 * in their own suffix ("Schemes & Services | DoSJE"), so a template would
 * produce "Schemes & Services | DoSJE · MoSJE" on every page.
 */
export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin()),
  title: "MoSJE Digital Estate",
  description:
    "Ministry of Social Justice and Empowerment — unified digital estate gateway.",
  applicationName: "SAMAVESH",
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_IN",
    title: "MoSJE Digital Estate",
    description:
      "Ministry of Social Justice and Empowerment — unified digital estate gateway.",
  },
  twitter: {
    // The estate's card is a 1200×630 landscape image, so the large summary is
    // the correct variant; the default `summary` would letterbox it into a
    // thumbnail.
    card: "summary_large_image",
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // The dock's destination list is the estate registry, so it has to honour
  // what an admin has hidden or reordered. Resolved here rather than inside the
  // dock because the dock is a client component and the settings store is
  // server-only. The read is cache-tagged, so this does not make the layout —
  // and with it every route in the estate — render per request.
  const apps = await resolveRegistry();
  // Which surfaces show the assistant. Resolved here, beside the registry it is
  // keyed against, and cache-tagged for the same reason — this layout is above
  // every route in the estate, so an uncached read would make all of them
  // dynamic. Only the enabled paths travel to the client.
  const chatbotPaths = await resolveChatbotPaths(apps);
  // Whether the demo dock renders at all. Cache-tagged like the two above, for
  // the same reason: this layout is above every route in the estate.
  const demoToolsEnabled = await resolveDemoToolsEnabled();

  return (
    <html
      lang="en-IN"
      className={`${notoSans.variable} ${notoSansDevanagari.variable} ${notoSansDisplay.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: colorModeInitScript() }} />
      </head>
      {/* suppressHydrationWarning: browser extensions (e.g. Grammarly) inject
          attributes onto <body> before React hydrates — benign, React-recommended. */}
      <body className="min-h-full font-sans bg-surface-muted text-ink" suppressHydrationWarning>
        <ColorModeProvider>
          {/* Which figures the dashboards show — live, illustrative, or both.
              Client-side and cookie-backed, exactly like the colour mode above
              it, so reading it never opts a static route into dynamic
              rendering. See lib/data-mode/context.tsx. */}
          <DataModeProvider>
          {children}
          {/*
            NONE OF THIS INSIDE AN EMBED. `/embed/*` renders inside somebody
            else's page, which has its own accessibility controls and its own
            chrome — a second widget, a second chat launcher and a demo rail
            arriving in the middle of their article are copies of things the
            reader already has. See `NotInEmbed`, where the accessibility
            decision in particular is written down.
          */}
          <NotInEmbed>
            <UX4GAccessibilityWidget />
            {/* Ordered deliberately: the accessibility widget owns the
                bottom-right corner when it is visible, and the chatbot measures
                around it rather than the other way round. */}
            <ConditionalChatbot enabledPaths={chatbotPaths} />
            <ConditionalDemoDock apps={apps} enabled={demoToolsEnabled} />
          </NotInEmbed>
          </DataModeProvider>
        </ColorModeProvider>
      </body>
    </html>
  );
}
