import type { Metadata } from "next";
import { buttonClasses } from "@mosje/design-system";
import { TypeSpecimen, TokenTable, DoDont, Callout } from "@/components/docs-kit/index";
import { figmaUrl, FIGMA_NODES } from "@/lib/figma";

export const metadata: Metadata = {
  title: "Typography",
  description:
    "How SAMAVESH handles type across English and हिन्दी — the dual-typeface system, the type scale, line-height rules for Devanagari, and the developer token reference.",
};

export default function TypographyPage() {
  return (
    <article className="ds-prose">
      {/* ── Page header ─────────────────────────────────────────────── */}
      <header className="docs-page-header">
        <div className="docs-page-header__text">
          <h1 className="docs-page-header__title">Typography</h1>
          <p className="docs-page-header__desc">
            Every MoSJE property serves citizens in English and हिन्दी, so type
            is never an afterthought. SAMAVESH uses two carefully paired
            typefaces, a single shared scale, and Indic-aware line heights so
            the same content reads clearly in both scripts.
          </p>
          <div className="docs-page-header__actions">
            <a className={buttonClasses("primary", "outlined", "md")} href={figmaUrl(FIGMA_NODES.typography)} target="_blank" rel="noopener noreferrer">
              Open type styles in Figma <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </header>

      {/* ── 1. Why two typefaces ────────────────────────────────────── */}
      <section className="docs-section" aria-labelledby="why-two-typefaces">
        <span className="docs-section__label">Foundations</span>
        <h2 id="why-two-typefaces" className="docs-section__heading">
          Why two typefaces
        </h2>
        <div className="docs-section__body">
          <p>
            SAMAVESH uses <strong>Noto Sans</strong> for Latin / English text
            and <strong>Noto Sans Devanagari</strong> for हिन्दी. Both come from
            Google&rsquo;s Noto family, so they share the same overall character
            and tone — but each one is drawn specifically for the script it
            serves.
          </p>
          <p style={{ marginTop: "var(--ds-spacing-lg)" }}>
            It is tempting to think we could simply take the Latin font and
            shrink or stretch it for Hindi. We don&rsquo;t, and here is why:
          </p>
          <ul style={{ marginTop: "var(--ds-spacing-md)" }}>
            <li>
              <strong>Different visual weight.</strong> Devanagari letterforms
              are denser and carry more ink per character than Latin letters. A
              Latin font scaled down for Hindi would look thin and hard to read;
              the dedicated Devanagari font keeps strokes balanced.
            </li>
            <li>
              <strong>Different ascenders and descenders.</strong> Latin letters
              extend mostly above and below a simple baseline. Devanagari hangs
              its characters from a top line (the शिरोरेखा / headline stroke) and
              stacks vowel signs and conjuncts above and below — so the vertical
              space a character actually occupies is quite different.
            </li>
            <li>
              <strong>Different line-height needs.</strong> Because Devanagari
              reaches further up and down, lines of Hindi text need more breathing
              room between them than the equivalent English would. (See section 3.)
            </li>
          </ul>
          <p style={{ marginTop: "var(--ds-spacing-lg)" }}>
            Using a purpose-built font for each script means हिन्दी never looks
            like a squeezed afterthought — it gets the same care and legibility
            as English.
          </p>
        </div>

        <Callout type="info" title="In plain terms">
          One font family, two scripts, each drawn for its own letters. The two
          always sit side by side at the same point size — we change the line
          height, never the typeface logic.
        </Callout>
      </section>

      {/* ── 2. Type scale ───────────────────────────────────────────── */}
      <section className="docs-section" aria-labelledby="type-scale">
        <span className="docs-section__label">Scale</span>
        <h2 id="type-scale" className="docs-section__heading">
          Type scale
        </h2>
        <div className="docs-section__body">
          <p>
            One scale drives every site and portal. Each role below shows the
            same content in English (top) and हिन्दी (bottom) so you can see how
            the pairing behaves at each size. Always reach for a role token, not
            a raw pixel value.
          </p>
        </div>

        <TypeSpecimen
          role="Display"
          size="48px"
          weight="500"
          leading="56px"
          sample="Digital India, Inclusive India"
          sampleHi="डिजिटल भारत, समावेशी भारत"
        />
        <TypeSpecimen
          role="Title 1"
          size="22px"
          weight="600"
          leading="28px"
          sample="Ministry of Social Justice & Empowerment"
          sampleHi="सामाजिक न्याय और अधिकारिता मंत्रालय"
        />
        <TypeSpecimen
          role="Headline"
          size="20px"
          weight="600"
          leading="24px"
          sample="PM-AJAY Scheme Dashboard"
          sampleHi="पीएम-अजय योजना डैशबोर्ड"
        />
        <TypeSpecimen
          role="Body 1"
          size="16px"
          weight="400"
          leading="24px"
          sample="Submit your application along with all required documents."
          sampleHi="सभी आवश्यक दस्तावेज़ों के साथ अपना आवेदन जमा करें।"
        />
        <TypeSpecimen
          role="Body 2"
          size="14px"
          weight="400"
          leading="20px"
          sample="Secondary information, helper text, and table cell content."
          sampleHi="द्वितीयक जानकारी, सहायक पाठ और तालिका सामग्री।"
        />
        <TypeSpecimen
          role="Body 3"
          size="12px"
          weight="400"
          leading="16px"
          sample="Captions, timestamps, and field labels."
          sampleHi="कैप्शन, समय-चिह्न और फ़ील्ड लेबल।"
        />
        <TypeSpecimen
          role="Label 3"
          size="11px"
          weight="700"
          leading="16px"
          sample="STATUS · UPLOADED · VERIFIED"
          sampleHi="स्थिति · अपलोड · सत्यापित"
        />
      </section>

      {/* ── 3. Line height for Indic scripts ────────────────────────── */}
      <section className="docs-section" aria-labelledby="indic-line-height">
        <span className="docs-section__label">Indic scripts</span>
        <h2 id="indic-line-height" className="docs-section__heading">
          Line height for Indic scripts
        </h2>
        <div className="docs-section__body">
          <p>
            Devanagari characters have tops and bottoms that extend further than
            Latin letters — they need more breathing room between lines. Set Hindi
            too tight and the headline strokes of one line start to crowd the vowel
            marks of the next, which makes the text feel cramped and slows reading.
          </p>
          <p style={{ marginTop: "var(--ds-spacing-lg)" }}>
            SAMAVESH targets a line height of about <strong>1.7</strong> for body
            Devanagari, versus the ~1.5 that works fine for Latin. The two columns
            below use the <em>same</em> font size — only the line height changes.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "var(--ds-spacing-xl)",
            marginTop: "var(--ds-spacing-xl)",
          }}
        >
          {/* Bad — 1.5 */}
          <div
            style={{
              border: "1px solid var(--ds-danger)",
              borderRadius: "var(--ds-radius-md)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "var(--ds-spacing-md) var(--ds-spacing-lg)",
                background: "var(--ds-danger-tonal)",
                color: "var(--ds-danger)",
                fontSize: "var(--ds-text-body-2)",
                fontWeight: 700,
                borderBottom: "1px solid var(--ds-danger)",
              }}
            >
              ✕ Line height 1.5 — too tight
            </div>
            <p
              lang="hi"
              style={{
                padding: "var(--ds-spacing-xl)",
                margin: 0,
                fontFamily: "var(--sa-font-family-devanagari)",
                fontSize: "16px",
                lineHeight: 1.5,
                color: "var(--ds-ink)",
              }}
            >
              सामाजिक न्याय और अधिकारिता मंत्रालय देश के वंचित और कमज़ोर वर्गों के
              कल्याण के लिए अनेक योजनाएँ संचालित करता है। आवेदक अपने सभी आवश्यक
              दस्तावेज़ों के साथ ऑनलाइन आवेदन जमा कर सकते हैं।
            </p>
          </div>

          {/* Good — 1.7 */}
          <div
            style={{
              border: "1px solid var(--ds-success)",
              borderRadius: "var(--ds-radius-md)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "var(--ds-spacing-md) var(--ds-spacing-lg)",
                background: "var(--ds-success-tonal)",
                color: "var(--ds-success)",
                fontSize: "var(--ds-text-body-2)",
                fontWeight: 700,
                borderBottom: "1px solid var(--ds-success)",
              }}
            >
              ✓ Line height 1.7 — correct
            </div>
            <p
              lang="hi"
              style={{
                padding: "var(--ds-spacing-xl)",
                margin: 0,
                fontFamily: "var(--sa-font-family-devanagari)",
                fontSize: "16px",
                lineHeight: 1.7,
                color: "var(--ds-ink)",
              }}
            >
              सामाजिक न्याय और अधिकारिता मंत्रालय देश के वंचित और कमज़ोर वर्गों के
              कल्याण के लिए अनेक योजनाएँ संचालित करता है। आवेदक अपने सभी आवश्यक
              दस्तावेज़ों के साथ ऑनलाइन आवेदन जमा कर सकते हैं।
            </p>
          </div>
        </div>

        <Callout type="tip" title="Rule of thumb">
          When a block can hold Hindi, give it the Indic line height. The
          <code> --ds-leading-*</code> body tokens already bake this in — if you
          use them, you get the right spacing for free.
        </Callout>
      </section>

      {/* ── 4. Token reference (developer) ──────────────────────────── */}
      <section className="docs-section" aria-labelledby="token-reference">
        <span className="docs-section__label">Developer</span>
        <h2 id="token-reference" className="docs-section__heading">
          Token reference
        </h2>
        <div className="docs-section__body">
          <p>
            All sizes and line heights are exposed as CSS custom properties.
            Reference these — never hardcode a pixel value.
          </p>
        </div>

        <h3
          id="token-reference-sizes"
          style={{
            fontSize: "var(--ds-text-headline)",
            fontWeight: 600,
            marginTop: "var(--ds-spacing-2xl)",
            marginBottom: "var(--ds-spacing-sm)",
            scrollMarginTop: "calc(56px + var(--ds-spacing-2xl))",
          }}
        >
          Font sizes — <code>--ds-text-*</code>
        </h3>
        <TokenTable
          tokens={[
            { token: "--ds-text-display", value: "48px", description: "Display — hero headings, landing banners." },
            { token: "--ds-text-title-1", value: "22px", description: "Title 1 — page titles, primary section headings." },
            { token: "--ds-text-title-2", value: "16px", description: "Title 2 — secondary section headings." },
            { token: "--ds-text-headline", value: "20px", description: "Headline — card titles, dashboard panel headers." },
            { token: "--ds-text-body-1", value: "16px", description: "Body 1 — default reading size for paragraphs." },
            { token: "--ds-text-body-2", value: "14px", description: "Body 2 — secondary info, helper text, table cells." },
            { token: "--ds-text-body-3", value: "12px", description: "Body 3 — captions, timestamps, fine print." },
            { token: "--ds-text-label-1", value: "14px", description: "Label 1 — form labels, larger UI labels." },
            { token: "--ds-text-label-3", value: "11px", description: "Label 3 — uppercase UI micro-labels (weight 700)." },
          ]}
        />

        <h3
          id="token-reference-leading"
          style={{
            fontSize: "var(--ds-text-headline)",
            fontWeight: 600,
            marginTop: "var(--ds-spacing-2xl)",
            marginBottom: "var(--ds-spacing-sm)",
            scrollMarginTop: "calc(56px + var(--ds-spacing-2xl))",
          }}
        >
          Line heights — <code>--ds-leading-*</code>
        </h3>
        <TokenTable
          tokens={[
            { token: "--ds-leading-display", value: "56px", description: "Pairs with Display (48px)." },
            { token: "--ds-leading-title-1", value: "28px", description: "Pairs with Title 1 (22px)." },
            { token: "--ds-leading-title-2", value: "24px", description: "Pairs with Title 2 (18px)." },
            { token: "--ds-leading-headline", value: "24px", description: "Pairs with Headline (20px)." },
            { token: "--ds-leading-body-1", value: "24px", description: "Pairs with Body 1 (16px) — generous enough for हिन्दी." },
            { token: "--ds-leading-body-2", value: "20px", description: "Pairs with Body 2 (14px)." },
            { token: "--ds-leading-body-3", value: "16px", description: "Pairs with Body 3 (12px)." },
            { token: "--ds-leading-label-1", value: "20px", description: "Pairs with Label 1 (14px)." },
            { token: "--ds-leading-label-3", value: "16px", description: "Pairs with Label 3 (11px)." },
          ]}
        />

        <h3
          id="token-reference-family"
          style={{
            fontSize: "var(--ds-text-headline)",
            fontWeight: 600,
            marginTop: "var(--ds-spacing-2xl)",
            marginBottom: "var(--ds-spacing-sm)",
            scrollMarginTop: "calc(56px + var(--ds-spacing-2xl))",
          }}
        >
          Font families
        </h3>
        <TokenTable
          tokens={[
            {
              token: "--ds-font-sans",
              value: '"Noto Sans", ui-sans-serif, system-ui, sans-serif',
              description: "Default / Latin family for all English text.",
            },
            {
              token: "--sa-font-family-devanagari",
              value: '"Noto Sans Devanagari", "Noto Sans", ui-sans-serif, sans-serif',
              description: "Devanagari family for हिन्दी text.",
            },
          ]}
        />
      </section>

      {/* ── 5. Loading fonts ────────────────────────────────────────── */}
      <section className="docs-section" aria-labelledby="loading-fonts">
        <span className="docs-section__label">Developer</span>
        <h2 id="loading-fonts" className="docs-section__heading">
          Loading fonts
        </h2>
        <div className="docs-section__body">
          <p>
            In Next.js, load both Noto families through <code>next/font/google</code>.
            This self-hosts the files, avoids layout shift, and lets you expose each
            family as a CSS variable that maps onto the design tokens.
          </p>
        </div>

        <pre
          style={{
            marginTop: "var(--ds-spacing-xl)",
            padding: "var(--ds-spacing-xl)",
            background: "var(--ds-surface-muted)",
            border: "1px solid var(--ds-border)",
            borderRadius: "var(--ds-radius-md)",
            overflowX: "auto",
            fontSize: "var(--ds-text-body-2)",
            lineHeight: 1.6,
          }}
        >
          <code style={{ fontFamily: "ui-monospace, monospace" }}>{`// app/layout.tsx
import { Noto_Sans, Noto_Sans_Devanagari } from "next/font/google";

const notoSans = Noto_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-sans",
  display: "swap",
});

const notoSansDevanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-sans-devanagari",
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={\`\${notoSans.variable} \${notoSansDevanagari.variable}\`}
    >
      <body>{children}</body>
    </html>
  );
}`}</code>
        </pre>

        <div className="docs-section__body" style={{ marginTop: "var(--ds-spacing-xl)" }}>
          <p>
            Then point the design tokens at the loaded variables in your global
            CSS so every component picks them up automatically:
          </p>
        </div>

        <pre
          style={{
            marginTop: "var(--ds-spacing-md)",
            padding: "var(--ds-spacing-xl)",
            background: "var(--ds-surface-muted)",
            border: "1px solid var(--ds-border)",
            borderRadius: "var(--ds-radius-md)",
            overflowX: "auto",
            fontSize: "var(--ds-text-body-2)",
            lineHeight: 1.6,
          }}
        >
          <code style={{ fontFamily: "ui-monospace, monospace" }}>{`/* globals.css */
:root {
  --sa-font-family-latin:
    var(--font-noto-sans), ui-sans-serif, system-ui, sans-serif;
  --sa-font-family-devanagari:
    var(--font-noto-sans-devanagari), "Noto Sans", ui-sans-serif, sans-serif;
}`}</code>
        </pre>

        <div className="docs-section__body" style={{ marginTop: "var(--ds-spacing-xl)" }}>
          <p>
            <strong>System-font fallback chain.</strong> Each family ends in a
            generic fallback so text still renders sensibly before (or if) the web
            fonts fail to load:
          </p>
          <ul style={{ marginTop: "var(--ds-spacing-md)" }}>
            <li>
              <strong>Latin:</strong> <code>&quot;Noto Sans&quot;</code> →{" "}
              <code>ui-sans-serif</code> → <code>system-ui</code> →{" "}
              <code>sans-serif</code>. The OS&rsquo;s native UI font (San Francisco
              on macOS / iOS, Segoe UI on Windows, Roboto on Android) stands in
              until Noto Sans arrives.
            </li>
            <li>
              <strong>Devanagari:</strong> <code>&quot;Noto Sans Devanagari&quot;</code>{" "}
              → <code>&quot;Noto Sans&quot;</code> → <code>ui-sans-serif</code> →{" "}
              <code>sans-serif</code>. Most platforms ship a built-in Devanagari
              face, so हिन्दी stays readable even on a slow first paint.
            </li>
          </ul>
        </div>

        <Callout type="warning" title="Government context">
          Many citizens reach these portals on low-bandwidth connections. Keep
          <code> display: &quot;swap&quot;</code> so text is visible immediately,
          and limit weights to the four the scale actually uses (400 / 500 / 600 / 700).
        </Callout>
      </section>

      {/* ── 6. Do / Don't ───────────────────────────────────────────── */}
      <section className="docs-section" aria-labelledby="do-dont">
        <span className="docs-section__label">Guidance</span>
        <h2 id="do-dont" className="docs-section__heading">
          Do &amp; Don&rsquo;t
        </h2>
        <div className="docs-section__body">
          <p>
            Type roles are a contract. Use the tokens and the whole estate stays
            consistent and Indic-ready; hardcode pixels and pages drift apart.
          </p>
        </div>

        <DoDont
          cards={[
            {
              type: "do",
              label:
                "Use the type tokens. Reach for a role (Body 1, Headline, …) and apply --ds-text-* and --ds-leading-* together so size and line height stay paired and Hindi gets the right spacing.",
              preview: (
                <code
                  style={{
                    fontFamily: "ui-monospace, monospace",
                    fontSize: "12px",
                    color: "var(--ds-ink)",
                    textAlign: "left",
                    whiteSpace: "pre",
                  }}
                >
{`.lead {
  font-size: var(--ds-text-body-1);
  line-height: var(--ds-leading-body-1);
}`}
                </code>
              ),
            },
            {
              type: "dont",
              label:
                "Don't set font-size directly in px. Raw values break the scale, drift between pages, and almost always pair Hindi with a Latin-tight line height that crowds the script.",
              preview: (
                <code
                  style={{
                    fontFamily: "ui-monospace, monospace",
                    fontSize: "12px",
                    color: "var(--ds-ink)",
                    textAlign: "left",
                    whiteSpace: "pre",
                  }}
                >
{`.lead {
  font-size: 16px;
  line-height: 1.4;
}`}
                </code>
              ),
            },
          ]}
        />
      </section>
    </article>
  );
}
