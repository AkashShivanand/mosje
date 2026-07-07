import type { Metadata } from "next";
import { buttonClasses } from "@mosje/design-system";
import { DoDont, Callout } from "@/components/docs-kit/index";
import { figmaUrl, FIGMA_NODES } from "@/lib/figma";
import { TypeLab } from "./type-lab";
import "./typography.css";

export const metadata: Metadata = {
  title: "Typography",
  description:
    "SAMAVESH typography — one 21-role scale rendered on two surfaces (Website, Portal), fluid across every viewport, and drawn for both English and हिन्दी.",
};

export default function TypographyPage(): React.JSX.Element {
  return (
    <article className="ds-prose">
      {/* ── Page header ─────────────────────────────────────────── */}
      <header className="docs-page-header">
        <div className="docs-page-header__text">
          <h1 className="docs-page-header__title">Typography</h1>
          <p className="docs-page-header__desc">
            Every MoSJE property serves citizens in English and हिन्दी, so type is never an afterthought.
            SAMAVESH pairs two Noto typefaces and a single <strong>21-role scale</strong> that renders on two
            surfaces — an expressive <strong>Website</strong> and a dense <strong>Portal</strong> — flowing
            fluidly from phone to desktop, on a strict 4px rhythm.
          </p>
          <div className="docs-page-header__actions">
            <a
              className={buttonClasses("primary", "outlined", "md")}
              href={figmaUrl(FIGMA_NODES.typography)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open type styles in Figma <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </header>

      {/* ── 1. Why two typefaces ────────────────────────────────── */}
      <section className="docs-section" aria-labelledby="why-two-typefaces">
        <span className="docs-section__label">Foundations</span>
        <h2 id="why-two-typefaces" className="docs-section__heading">Why two typefaces</h2>
        <div className="docs-section__body">
          <p>
            SAMAVESH uses <strong>Noto Sans</strong> for Latin / English text and{" "}
            <strong>Noto Sans Devanagari</strong> for हिन्दी. Both come from Google&rsquo;s Noto family, so they
            share the same overall character and tone — but each one is drawn specifically for the script it serves.
          </p>
          <ul style={{ marginTop: "var(--ds-spacing-md)" }}>
            <li><strong>Different visual weight.</strong> Devanagari letterforms are denser and carry more ink per character than Latin letters.</li>
            <li><strong>Different vertical space.</strong> Devanagari hangs from a top line (the शिरोरेखा) and stacks vowel signs and conjuncts above and below.</li>
            <li><strong>Different line-height needs.</strong> Because Devanagari reaches further up and down, Hindi text needs more room between lines (see below).</li>
          </ul>
        </div>
        <Callout type="info" title="In plain terms">
          One font family, two scripts, each drawn for its own letters. The two always sit at the same point
          size — we change the line height, never the typeface logic.
        </Callout>
      </section>

      {/* ── 2–5. The interactive type lab (scale · fluid · surfaces · tokens) ── */}
      <TypeLab />

      {/* ── 6. Line height for Indic scripts ────────────────────── */}
      <section className="docs-section" aria-labelledby="indic-line-height">
        <span className="docs-section__label">Indic scripts</span>
        <h2 id="indic-line-height" className="docs-section__heading">Line height for Indic scripts</h2>
        <div className="docs-section__body">
          <p>
            Devanagari characters extend further than Latin letters — they need more breathing room between lines.
            Set Hindi too tight and headline strokes crowd the vowel marks of the next line, which slows reading.
            SAMAVESH targets a line height of about <strong>1.7</strong> for body Devanagari, versus the ~1.5 that
            works for Latin. The two columns below use the <em>same</em> font size — only the line height changes.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "var(--ds-spacing-xl)", marginTop: "var(--ds-spacing-xl)" }}>
          {[
            { ok: false, label: "✕ Line height 1.5 — too tight", lh: 1.5, color: "danger" },
            { ok: true, label: "✓ Line height 1.7 — correct", lh: 1.7, color: "success" },
          ].map((c) => (
            <div key={c.label} style={{ border: `1px solid var(--ds-${c.color})`, borderRadius: "var(--ds-radius-md)", overflow: "hidden" }}>
              <div style={{ padding: "var(--ds-spacing-md) var(--ds-spacing-lg)", background: `var(--ds-${c.color}-tonal)`, color: `var(--ds-${c.color})`, fontSize: "var(--ds-text-body-2)", fontWeight: 700, borderBottom: `1px solid var(--ds-${c.color})` }}>
                {c.label}
              </div>
              <p lang="hi" style={{ padding: "var(--ds-spacing-xl)", margin: 0, fontFamily: "var(--sa-font-family-devanagari)", fontSize: "16px", lineHeight: c.lh, color: "var(--ds-ink)" }}>
                सामाजिक न्याय और अधिकारिता मंत्रालय देश के वंचित और कमज़ोर वर्गों के कल्याण के लिए अनेक योजनाएँ
                संचालित करता है। आवेदक अपने सभी आवश्यक दस्तावेज़ों के साथ ऑनलाइन आवेदन जमा कर सकते हैं।
              </p>
            </div>
          ))}
        </div>
        <Callout type="tip" title="Rule of thumb">
          When a block can hold Hindi, give it the Indic line height. The <code>--ds-type-body-*-lh</code> tokens
          already bake this in — use them and you get the right spacing for free.
        </Callout>
      </section>

      {/* ── 7. Do / Don't ───────────────────────────────────────── */}
      <section className="docs-section" aria-labelledby="do-dont">
        <span className="docs-section__label">Guidance</span>
        <h2 id="do-dont" className="docs-section__heading">Do &amp; Don&rsquo;t</h2>
        <div className="docs-section__body">
          <p>Type roles are a contract. Use the tokens and the whole estate stays consistent, fluid, and Indic-ready; hardcode pixels and pages drift apart.</p>
        </div>
        <DoDont
          cards={[
            {
              type: "do",
              label: "Use a role token and pair size with its line-height so size, leading, and fluid scaling travel together. Set data-surface on portal roots.",
              preview: (
                <code style={{ fontFamily: "var(--ds-font-mono)", fontSize: "12px", color: "var(--ds-ink)", textAlign: "left", whiteSpace: "pre" }}>
{`.lead {
  font-size:   var(--ds-type-body-1-size);
  line-height: var(--ds-type-body-1-lh);
}
/* portal shell */
<html data-surface="portal">`}
                </code>
              ),
            },
            {
              type: "dont",
              label: "Don't hardcode font-size in px. Raw values break the fluid scale, ignore the surface, and usually pair Hindi with a Latin-tight line height.",
              preview: (
                <code style={{ fontFamily: "var(--ds-font-mono)", fontSize: "12px", color: "var(--ds-ink)", textAlign: "left", whiteSpace: "pre" }}>
{`.lead {
  font-size: 16px;
  line-height: 1.4;
  /* breaks on mobile + portal */
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
