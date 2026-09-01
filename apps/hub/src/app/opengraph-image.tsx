/**
 * The estate's social card — the picture that appears when ANY url on this
 * deployment is pasted into WhatsApp, Slack, Teams, X or LinkedIn.
 *
 * It sits at the root of the app directory deliberately: Next's metadata file
 * convention makes a card at a segment the default for every route beneath it,
 * so this one image covers the website, the portals, the reports and the gate
 * without 200 pages each declaring one. The design system keeps its own
 * `opengraph-image.png` beside its layout and therefore overrides this.
 *
 * Drawn rather than committed as a PNG so the palette follows the token
 * contract. `satori` (what `next/og` renders with) resolves no CSS custom
 * properties, so the colours arrive as the build-time literals exported by
 * `@mosje/design-system` — the generated mirror of `tokens.css`, not a second
 * hand-maintained copy that can drift from it.
 *
 * The SAMAVESH roundel is a raster and is colocated under `_og/` rather than
 * read out of `public/`: `new URL(…, import.meta.url)` is traced into the
 * serverless bundle, and `public/` is not. It already carries the National
 * Emblem at its crown, which is why the emblem is not composited separately —
 * the 200 KB emblem SVG would be a heavy, risky rasterise for a mark that is
 * already in the picture.
 */
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { colors } from "@mosje/design-system";
import { OG_CARD_ALT, OG_CARD_SIZE } from "@/lib/seo/card";

// Re-exported from the shared descriptor rather than typed here, so the alt
// text an unfurler reads and the alt text `socialCard()` writes cannot drift.
export const alt = OG_CARD_ALT;
export const size = OG_CARD_SIZE;
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const roundel = await readFile(new URL("./_og/samavesh-logo.png", import.meta.url));
  const roundelSrc = `data:image/png;base64,${roundel.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: colors.surface,
          // Noto Sans is what `next/og` renders with by default, which happens
          // to be the estate's own face — so no font file is shipped here.
          fontFamily: "Noto Sans",
        }}
      >
        {/* The one band of colour. A single primary rule, not a tricolour
            stripe — that motif is off-limits in UI chrome (CLAUDE.md). */}
        <div style={{ display: "flex", height: 12, backgroundColor: colors.primary }} />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            flex: 1,
            padding: "0 80px",
          }}
        >
          {/* A plain <img>, not next/image: satori has no optimiser and no
              layout pass — inside an ImageResponse there is nothing for
              next/image to do. */}
          <img src={roundelSrc} alt="" width={132} height={132} />

          <div
            style={{
              display: "flex",
              marginTop: 36,
              fontSize: 24,
              fontWeight: 600,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: colors.inkMuted,
            }}
          >
            Government of India
          </div>

          <div
            style={{
              display: "flex",
              marginTop: 12,
              fontSize: 62,
              fontWeight: 700,
              lineHeight: 1.1,
              color: colors.navy,
            }}
          >
            Ministry of Social Justice &amp; Empowerment
          </div>

          <div
            style={{
              display: "flex",
              marginTop: 22,
              fontSize: 28,
              lineHeight: 1.4,
              color: colors.inkMuted,
            }}
          >
            One unified website and 20 workflow portals across 33+ organisations.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
