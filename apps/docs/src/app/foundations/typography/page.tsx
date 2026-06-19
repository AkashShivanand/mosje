import type { Metadata } from "next";
import { buttonClasses } from "@mosje/design-system";
import { TypeSpecimen, TokenTable, DoDont, Callout } from "@/components/docs-kit/index";
import { figmaUrl, FIGMA_NODES } from "@/lib/figma";

export const metadata: Metadata = {
  title: "Typography",
  description:
    "How SAMAVESH handles type across English and हिन्दी — the dual-typeface system, the responsive role scale, line-height rules for Devanagari, and the developer token reference.",
};

const RESPONSIVE_ROLES = [
  { role: "display1",  mobile: "40px", tablet: "48px", desktop: "56px", lhM: "48px", lhT: "56px", lhD: "64px", usage: "Hero headings, landing banners." },
  { role: "display2",  mobile: "32px", tablet: "40px", desktop: "48px", lhM: "40px", lhT: "48px", lhD: "56px", usage: "Section heroes, large promotional heads." },
  { role: "display3",  mobile: "28px", tablet: "32px", desktop: "40px", lhM: "36px", lhT: "40px", lhD: "48px", usage: "Feature titles on editorial pages." },
  { role: "display4",  mobile: "24px", tablet: "28px", desktop: "32px", lhM: "32px", lhT: "36px", lhD: "40px", usage: "Large content headings." },
  { role: "display5",  mobile: "22px", tablet: "24px", desktop: "28px", lhM: "28px", lhT: "32px", lhD: "36px", usage: "Prominent page-level labels." },
  { role: "display6",  mobile: "20px", tablet: "22px", desktop: "24px", lhM: "28px", lhT: "28px", lhD: "32px", usage: "Medium display, portal section titles." },
  { role: "headline1", mobile: "24px", tablet: "28px", desktop: "32px", lhM: "32px", lhT: "36px", lhD: "40px", usage: "Primary page headings (h1 on content pages)." },
  { role: "headline2", mobile: "20px", tablet: "24px", desktop: "28px", lhM: "28px", lhT: "32px", lhD: "36px", usage: "Section headings (h2)." },
  { role: "headline3", mobile: "18px", tablet: "20px", desktop: "24px", lhM: "24px", lhT: "28px", lhD: "32px", usage: "Sub-section headings (h3), card titles." },
  { role: "headline4", mobile: "16px", tablet: "18px", desktop: "20px", lhM: "24px", lhT: "24px", lhD: "28px", usage: "Minor headings (h4), panel titles." },
  { role: "headline5", mobile: "15px", tablet: "16px", desktop: "18px", lhM: "20px", lhT: "24px", lhD: "24px", usage: "Small headings (h5), widget titles." },
  { role: "headline6", mobile: "14px", tablet: "15px", desktop: "16px", lhM: "20px", lhT: "20px", lhD: "24px", usage: "Fine headings (h6), tightly nested sections." },
  { role: "title1",    mobile: "16px", tablet: "18px", desktop: "20px", lhM: "24px", lhT: "24px", lhD: "28px", usage: "Dashboard panel headers, nav section labels." },
  { role: "title2",    mobile: "15px", tablet: "16px", desktop: "18px", lhM: "20px", lhT: "24px", lhD: "24px", usage: "List headers, compact section titles." },
  { role: "title3",    mobile: "14px", tablet: "15px", desktop: "16px", lhM: "20px", lhT: "20px", lhD: "24px", usage: "Sidebar titles, tertiary section labels." },
  { role: "body1",     mobile: "14px", tablet: "15px", desktop: "16px", lhM: "20px", lhT: "24px", lhD: "24px", usage: "Default body copy for paragraphs." },
  { role: "body2",     mobile: "13px", tablet: "14px", desktop: "14px", lhM: "20px", lhT: "20px", lhD: "20px", usage: "Secondary info, helper text, table cells." },
  { role: "body3",     mobile: "13px", tablet: "14px", desktop: "13px", lhM: "20px", lhT: "20px", lhD: "20px", usage: "Captions, timestamps, fine print." },
];

const FIXED_ROLES = [
  { role: "label1", size: "14px", lh: "20px", usage: "Form labels, larger UI labels." },
  { role: "label2", size: "12px", lh: "16px", usage: "Compact labels, tag text." },
  { role: "label3", size: "11px", lh: "16px", usage: "Uppercase UI micro-labels (weight 700)." },
];

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
            typefaces, a responsive role scale with 21 named roles, and
            Indic-aware line heights so the same content reads clearly in
            both scripts at every screen size.
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
              are denser and carry more ink per character than Latin letters.
            </li>
            <li>
              <strong>Different ascenders and descenders.</strong> Devanagari
              hangs its characters from a top line (the शिरोरेखा) and stacks
              vowel signs and conjuncts above and below — the vertical space
              a character occupies is quite different from Latin.
            </li>
            <li>
              <strong>Different line-height needs.</strong> Because Devanagari
              reaches further up and down, Hindi text needs more room between
              lines. (See section 4.)
            </li>
          </ul>
        </div>

        <Callout type="info" title="In plain terms">
          One font family, two scripts, each drawn for its own letters. The
          two always sit side by side at the same point size — we change the
          line height, never the typeface logic.
        </Callout>
      </section>

      {/* ── 2. Responsive type system ───────────────────────────────── */}
      <section className="docs-section" aria-labelledby="responsive-type-system">
        <span className="docs-section__label">System</span>
        <h2 id="responsive-type-system" className="docs-section__heading">
          Responsive type system
        </h2>
        <div className="docs-section__body">
          <p>
            The SAMAVESH type scale is <strong>mobile-first and responsive</strong>.
            Every role ships three values — mobile base, tablet (768 px), and
            desktop (1024 px) — that are automatically applied via{" "}
            <code>@media</code> overrides. You reference a single CSS variable;
            the browser picks the right size for the viewport.
          </p>
          <p style={{ marginTop: "var(--ds-spacing-lg)" }}>
            The canonical token pattern is:
          </p>
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
            <code style={{ fontFamily: "ui-monospace, monospace" }}>{`--ds-type-ROLE-size   /* font-size, responds to breakpoints */
--ds-type-ROLE-lh     /* line-height, responds to breakpoints */

/* Examples */
--ds-type-body1-size  /* 14px mobile → 15px tablet → 16px desktop */
--ds-type-headline1-size  /* 24px → 28px → 32px */
--ds-type-label1-size     /* 14px, fixed — labels do not respond */`}</code>
          </pre>
          <p style={{ marginTop: "var(--ds-spacing-lg)" }}>
            The <code>--ds-text-*</code> and <code>--ds-leading-*</code> names
            from earlier SAMAVESH versions still work — they forward to the
            responsive variables. For new code, use{" "}
            <code>--ds-type-ROLE-size/lh</code> directly.
          </p>
        </div>

        <div
          style={{
            marginTop: "var(--ds-spacing-xl)",
            padding: "var(--ds-spacing-xl)",
            background: "var(--ds-surface-muted)",
            borderRadius: "var(--ds-radius-md)",
            border: "1px solid var(--ds-border)",
          }}
        >
          <p
            style={{
              fontSize: "var(--ds-text-body-2)",
              fontWeight: 600,
              color: "var(--ds-ink-muted)",
              marginBottom: "var(--ds-spacing-md)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            How the system works
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "var(--ds-spacing-lg)",
            }}
          >
            {[
              { label: "Mobile", bp: "< 768 px", note: "$value in primitive.json" },
              { label: "Tablet", bp: "≥ 768 px", note: "$extensions.responsive.md" },
              { label: "Desktop", bp: "≥ 1024 px", note: "$extensions.responsive.lg" },
            ].map(({ label, bp, note }) => (
              <div
                key={label}
                style={{
                  background: "var(--ds-surface)",
                  borderRadius: "var(--ds-radius-sm)",
                  padding: "var(--ds-spacing-lg)",
                  border: "1px solid var(--ds-border)",
                }}
              >
                <p style={{ fontWeight: 600, color: "var(--ds-ink)", margin: 0, fontSize: "var(--ds-text-body-1)" }}>{label}</p>
                <p style={{ color: "var(--ds-primary)", fontSize: "var(--ds-text-label-1)", margin: "var(--ds-spacing-xs) 0 0", fontFamily: "ui-monospace, monospace" }}>{bp}</p>
                <p style={{ color: "var(--ds-ink-muted)", fontSize: "var(--ds-text-label-1)", margin: "var(--ds-spacing-xs) 0 0" }}>{note}</p>
              </div>
            ))}
          </div>
        </div>

        <Callout type="tip" title="Labels are fixed">
          <code>label1</code>, <code>label2</code>, and <code>label3</code> are
          intentionally fixed across all breakpoints — UI control labels should
          not shift size when the viewport changes.
        </Callout>
      </section>

      {/* ── 3. Type scale ───────────────────────────────────────────── */}
      <section className="docs-section" aria-labelledby="type-scale">
        <span className="docs-section__label">Scale</span>
        <h2 id="type-scale" className="docs-section__heading">
          Type scale
        </h2>
        <div className="docs-section__body">
          <p>
            Specimens below show each role at its desktop size. The
            &ldquo;range&rdquo; in the meta (e.g. <em>40px → 48px → 56px</em>)
            shows mobile → tablet → desktop values. English appears on the first
            line, हिन्दी on the second.
          </p>
        </div>

        <TypeSpecimen
          role="display1"
          size="56px"
          weight="500"
          leading="64px"
          range="40px → 48px → 56px"
          sample="Digital India, Inclusive India"
          sampleHi="डिजिटल भारत, समावेशी भारत"
        />
        <TypeSpecimen
          role="headline1"
          size="32px"
          weight="600"
          leading="40px"
          range="24px → 28px → 32px"
          sample="Ministry of Social Justice & Empowerment"
          sampleHi="सामाजिक न्याय और अधिकारिता मंत्रालय"
        />
        <TypeSpecimen
          role="headline2"
          size="28px"
          weight="600"
          leading="36px"
          range="20px → 24px → 28px"
          sample="PM-AJAY Scheme Dashboard"
          sampleHi="पीएम-अजय योजना डैशबोर्ड"
        />
        <TypeSpecimen
          role="title1"
          size="20px"
          weight="600"
          leading="28px"
          range="16px → 18px → 20px"
          sample="Section heading and panel title"
          sampleHi="अनुभाग शीर्षक और पैनल शीर्षक"
        />
        <TypeSpecimen
          role="body1"
          size="16px"
          weight="400"
          leading="24px"
          range="14px → 15px → 16px"
          sample="Submit your application along with all required documents."
          sampleHi="सभी आवश्यक दस्तावेज़ों के साथ अपना आवेदन जमा करें।"
        />
        <TypeSpecimen
          role="body2"
          size="14px"
          weight="400"
          leading="20px"
          range="13px → 14px → 14px"
          sample="Secondary information, helper text, and table cell content."
          sampleHi="द्वितीयक जानकारी, सहायक पाठ और तालिका सामग्री।"
        />
        <TypeSpecimen
          role="body3"
          size="13px"
          weight="400"
          leading="20px"
          range="13px → 14px → 13px"
          sample="Captions, timestamps, and fine print."
          sampleHi="कैप्शन, समय-चिह्न और फ़ील्ड लेबल।"
        />
        <TypeSpecimen
          role="label1"
          size="14px"
          weight="600"
          leading="20px"
          sample="Form label · fixed across all breakpoints"
          sampleHi="फ़ॉर्म लेबल · सभी स्क्रीन पर स्थिर"
        />
        <TypeSpecimen
          role="label3"
          size="11px"
          weight="700"
          leading="16px"
          sample="STATUS · UPLOADED · VERIFIED"
          sampleHi="स्थिति · अपलोड · सत्यापित"
        />
      </section>

      {/* ── 4. Line height for Indic scripts ────────────────────────── */}
      <section className="docs-section" aria-labelledby="indic-line-height">
        <span className="docs-section__label">Indic scripts</span>
        <h2 id="indic-line-height" className="docs-section__heading">
          Line height for Indic scripts
        </h2>
        <div className="docs-section__body">
          <p>
            Devanagari characters extend further than Latin letters — they need
            more breathing room between lines. Set Hindi too tight and headline
            strokes crowd the vowel marks of the next line, which slows reading.
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
          When a block can hold Hindi, give it the Indic line height. The{" "}
          <code>--ds-type-body*-lh</code> tokens already bake this in — if you
          use them, you get the right spacing for free.
        </Callout>
      </section>

      {/* ── 5. Token reference ──────────────────────────────────────── */}
      <section className="docs-section" aria-labelledby="token-reference">
        <span className="docs-section__label">Developer</span>
        <h2 id="token-reference" className="docs-section__heading">
          Token reference
        </h2>
        <div className="docs-section__body">
          <p>
            All type roles are exposed as CSS custom properties. Use{" "}
            <code>--ds-type-ROLE-size</code> and{" "}
            <code>--ds-type-ROLE-lh</code> — these are the canonical names and
            are responsive. Never hardcode a pixel value.
          </p>
        </div>

        {/* Responsive roles */}
        <h3
          id="token-reference-responsive"
          style={{
            fontSize: "var(--ds-text-headline)",
            fontWeight: 600,
            marginTop: "var(--ds-spacing-2xl)",
            marginBottom: "var(--ds-spacing-sm)",
            scrollMarginTop: "calc(56px + var(--ds-spacing-2xl))",
          }}
        >
          Responsive roles — <code>--ds-type-ROLE-size/lh</code>
        </h3>
        <p
          style={{
            fontSize: "var(--ds-text-body-2)",
            color: "var(--ds-ink-muted)",
            marginBottom: "var(--ds-spacing-lg)",
          }}
        >
          Mobile-first values. The CSS custom property auto-responds at 768 px
          (tablet) and 1024 px (desktop) via <code>@media</code> overrides.
        </p>
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "var(--ds-text-body-2)",
              fontFamily: "ui-monospace, monospace",
            }}
          >
            <thead>
              <tr style={{ borderBottom: "2px solid var(--ds-border-strong)" }}>
                <th style={{ textAlign: "left", padding: "var(--ds-spacing-sm) var(--ds-spacing-md)", fontFamily: "var(--ds-font-sans)", color: "var(--ds-ink-muted)", fontWeight: 600 }}>Role</th>
                <th style={{ textAlign: "left", padding: "var(--ds-spacing-sm) var(--ds-spacing-md)", fontFamily: "var(--ds-font-sans)", color: "var(--ds-ink-muted)", fontWeight: 600 }}>Mobile size / lh</th>
                <th style={{ textAlign: "left", padding: "var(--ds-spacing-sm) var(--ds-spacing-md)", fontFamily: "var(--ds-font-sans)", color: "var(--ds-ink-muted)", fontWeight: 600 }}>Tablet size / lh</th>
                <th style={{ textAlign: "left", padding: "var(--ds-spacing-sm) var(--ds-spacing-md)", fontFamily: "var(--ds-font-sans)", color: "var(--ds-ink-muted)", fontWeight: 600 }}>Desktop size / lh</th>
                <th style={{ textAlign: "left", padding: "var(--ds-spacing-sm) var(--ds-spacing-md)", fontFamily: "var(--ds-font-sans)", color: "var(--ds-ink-muted)", fontWeight: 600 }}>Typical use</th>
              </tr>
            </thead>
            <tbody>
              {RESPONSIVE_ROLES.map(({ role, mobile, tablet, desktop, lhM, lhT, lhD, usage }) => (
                <tr key={role} style={{ borderBottom: "1px solid var(--ds-border)" }}>
                  <td style={{ padding: "var(--ds-spacing-sm) var(--ds-spacing-md)", color: "var(--ds-primary)", whiteSpace: "nowrap" }}>
                    --ds-type-{role}-size/lh
                  </td>
                  <td style={{ padding: "var(--ds-spacing-sm) var(--ds-spacing-md)", color: "var(--ds-ink)", whiteSpace: "nowrap" }}>{mobile} / {lhM}</td>
                  <td style={{ padding: "var(--ds-spacing-sm) var(--ds-spacing-md)", color: "var(--ds-ink)", whiteSpace: "nowrap" }}>{tablet} / {lhT}</td>
                  <td style={{ padding: "var(--ds-spacing-sm) var(--ds-spacing-md)", color: "var(--ds-ink)", whiteSpace: "nowrap" }}>{desktop} / {lhD}</td>
                  <td style={{ padding: "var(--ds-spacing-sm) var(--ds-spacing-md)", color: "var(--ds-ink-muted)", fontFamily: "var(--ds-font-sans)" }}>{usage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Fixed label roles */}
        <h3
          id="token-reference-labels"
          style={{
            fontSize: "var(--ds-text-headline)",
            fontWeight: 600,
            marginTop: "var(--ds-spacing-2xl)",
            marginBottom: "var(--ds-spacing-sm)",
            scrollMarginTop: "calc(56px + var(--ds-spacing-2xl))",
          }}
        >
          Fixed label roles
        </h3>
        <TokenTable
          tokens={FIXED_ROLES.map(({ role, size, lh, usage }) => ({
            token: `--ds-type-${role}-size / --ds-type-${role}-lh`,
            value: `${size} / ${lh}`,
            description: `Fixed (no responsive override). ${usage}`,
          }))}
        />

        {/* Legacy aliases */}
        <h3
          id="token-reference-legacy"
          style={{
            fontSize: "var(--ds-text-headline)",
            fontWeight: 600,
            marginTop: "var(--ds-spacing-2xl)",
            marginBottom: "var(--ds-spacing-sm)",
            scrollMarginTop: "calc(56px + var(--ds-spacing-2xl))",
          }}
        >
          Legacy aliases — <code>--ds-text-*</code> / <code>--ds-leading-*</code>
        </h3>
        <div className="docs-section__body">
          <p>
            These names from prior SAMAVESH versions still work and are now
            responsive — they forward to the canonical{" "}
            <code>--ds-type-*</code> variables. Existing code does not need to
            change. For new code, prefer the explicit role names.
          </p>
        </div>
        <TokenTable
          tokens={[
            { token: "--ds-text-display / --ds-leading-display", value: "→ display1", description: "Maps to --ds-type-display1-size/lh (40 → 48 → 56px)." },
            { token: "--ds-text-headline / --ds-leading-headline", value: "→ headline1", description: "Maps to --ds-type-headline1-size/lh (24 → 28 → 32px)." },
            { token: "--ds-text-title-1 / --ds-leading-title-1", value: "→ headline2", description: "Maps to --ds-type-headline2-size/lh (20 → 24 → 28px)." },
            { token: "--ds-text-title-2 / --ds-leading-title-2", value: "→ title1", description: "Maps to --ds-type-title1-size/lh (16 → 18 → 20px)." },
            { token: "--ds-text-body-1 / --ds-leading-body-1", value: "→ body1", description: "Maps to --ds-type-body1-size/lh (14 → 15 → 16px)." },
            { token: "--ds-text-body-2 / --ds-leading-body-2", value: "→ body2", description: "Maps to --ds-type-body2-size/lh (13 → 14 → 14px)." },
            { token: "--ds-text-body-3 / --ds-leading-body-3", value: "→ body3", description: "Maps to --ds-type-body3-size/lh (13 → 14 → 13px)." },
            { token: "--ds-text-label-1 / --ds-leading-label-1", value: "→ label1", description: "Maps to --ds-type-label1-size/lh (14px, fixed)." },
            { token: "--ds-text-label-3 / --ds-leading-label-3", value: "→ label3", description: "Maps to --ds-type-label3-size/lh (11px, fixed)." },
          ]}
        />

        {/* Font families */}
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

      {/* ── 6. Loading fonts ────────────────────────────────────────── */}
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={\`\${notoSans.variable} \${notoSansDevanagari.variable}\`}>
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

        <Callout type="warning" title="Government context">
          Many citizens reach these portals on low-bandwidth connections. Keep{" "}
          <code>display: &quot;swap&quot;</code> so text is visible immediately,
          and limit weights to the four the scale actually uses (400 / 500 / 600 / 700).
        </Callout>
      </section>

      {/* ── 7. Do / Don't ───────────────────────────────────────────── */}
      <section className="docs-section" aria-labelledby="do-dont">
        <span className="docs-section__label">Guidance</span>
        <h2 id="do-dont" className="docs-section__heading">
          Do &amp; Don&rsquo;t
        </h2>
        <div className="docs-section__body">
          <p>
            Type roles are a contract. Use the tokens and the whole estate
            stays consistent, responsive, and Indic-ready; hardcode pixels
            and pages drift apart.
          </p>
        </div>

        <DoDont
          cards={[
            {
              type: "do",
              label:
                "Use the canonical type tokens. Reach for a role (body1, headline1, …) and pair --ds-type-ROLE-size with --ds-type-ROLE-lh so size, line height, and responsiveness travel together.",
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
  font-size: var(--ds-type-body1-size);
  line-height: var(--ds-type-body1-lh);
  /* auto-responds: 14→15→16px */
}`}
                </code>
              ),
            },
            {
              type: "dont",
              label:
                "Don't hardcode font-size in px. Raw values break the responsive scale, drift between pages, and almost always pair Hindi with a Latin-tight line height that crowds the script.",
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
  /* breaks on mobile */
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
