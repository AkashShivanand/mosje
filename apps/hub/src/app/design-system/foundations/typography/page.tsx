import * as React from "react";
import type { Metadata } from "next";
import { buttonClasses } from "@mosje/design-system";
import { DoDont, Callout, A11yChecklist } from "@/components/design-system/docs-kit/index";
import { figmaUrl, FIGMA_NODES } from "@/lib/design-system/figma";
import { TypeLab } from "./type-lab";
import { LEGACY_ALIASES, STANDARDS } from "./typography-data";
import "./typography.css";

/**
 * Wrap every Devanagari run in `<span lang="hi">`.
 *
 * The page states the rule "mark every Hindi string with lang" and then fails it
 * in its own copy — caught by an audit of this page against its own guidance.
 * Doing it here rather than hand-tagging one string means any rule text added to
 * STANDARDS later is marked automatically, and the Devanagari face and the screen
 * reader's voice switch follow from the same source.
 */
function markDevanagari(text: string): React.ReactNode[] {
  return text.split(/([ऀ-ॿ][ऀ-ॿ\s]*)/g).filter(Boolean).map((part, i) =>
    /[ऀ-ॿ]/.test(part)
      ? <span key={i} lang="hi">{part}</span>
      : <React.Fragment key={i}>{part}</React.Fragment>,
  );
}

// DS Audit: Callout ✅ existing · DoDont ✅ existing · A11yChecklist ✅ existing ·
// buttonClasses ✅ existing · TypeLab ✅ existing (local, page-specific) ·
// alias table → reuses the existing .token-table style layer with semantic <table>
// markup rather than adding a one-off component; a 5-column comparison table is
// specific to this page and has no second consumer to justify a DS export.

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
            <strong>Noto Sans Devanagari</strong>{" "}for <span lang="hi">हिन्दी</span>. Both come from Google&rsquo;s Noto family, so they
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
              <p lang="hi" style={{ padding: "var(--ds-spacing-xl)", margin: 0, fontFamily: "var(--sa-font-devanagari)", fontSize: "16px", lineHeight: c.lh, color: "var(--ds-ink)" }}>
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

      {/* ── 8. Standards — UX4G's five categories, sourced ──────── */}
      <section className="docs-section" aria-labelledby="standards">
        <span className="docs-section__label">Standards</span>
        <h2 id="standards" className="docs-section__heading">The rules, and where each one comes from</h2>
        <div className="docs-section__body">
          <p>
            These are grouped the way UX4G groups typography guidance — consistency, hierarchy, spacing, colour and
            responsiveness — but each rule is stated concretely and tagged with its source, so a reviewer can audit it
            rather than take it on trust. Rules marked <strong>DBIM</strong> come from the Digital Brand Identity Manual;{" "}
            <strong>GIGW</strong> from the Guidelines for Indian Government Websites 3.0.
          </p>
        </div>

        {STANDARDS.map((group) => (
          <div key={group.title} className="ty-std">
            <h3 className="ty-std__title">{group.title}</h3>
            <ul className="ty-std__list">
              {group.rules.map((r) => (
                <li key={r.rule} className="ty-std__item">
                  <span className="ty-std__rule">{markDevanagari(r.rule)}</span>
                  <span className="ty-std__src">{r.src}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <Callout type="warning" title="Two of these are open MoSJE audit findings">
          The DBIM audit of the legacy estate flagged <strong>body text alignment</strong> and{" "}
          <strong>ALL-CAPS paragraphs</strong> as failing. SAMAVESH must fix them, not reproduce them — which is why they
          are stated here as rules rather than left implicit.
        </Callout>
      </section>

      {/* ── 9. Legacy aliases — the trap that has caused four bugs ─ */}
      <section className="docs-section" aria-labelledby="legacy-aliases">
        <span className="docs-section__label">Legacy</span>
        <h2 id="legacy-aliases" className="docs-section__heading">Two aliases don&rsquo;t mean what they&rsquo;re called</h2>
        <div className="docs-section__body">
          <p>
            Three families of type variable exist in CSS. The canonical{" "}
            <code>--ds-type-&lt;role&gt;-size</code> family and the unhyphenated{" "}
            <code>--ds-text-title1</code> family both map 1:1 to the role they name. The third —
            the <strong>hyphenated</strong> <code>--ds-text-title-1</code> family — is named for the
            pre-Portal-DS scale, and two of its entries resolve to a different role than their name suggests.
          </p>
        </div>
        <Callout type="danger" title="Read the resolved value, not the name">
          <code>--ds-text-title-1</code> is the <strong>headline-2</strong>{" "}role (24&nbsp;→&nbsp;32px), not Title&nbsp;1
          (18&nbsp;→&nbsp;22px). Misreading it has produced four separate production bugs: <code>CardTitle</code> painting at
          32–40px, an <code>h2</code> rendering smaller than its <code>h3</code>, twelve pages setting a 40px lead against a
          24px line-height, and a stale 22px fallback for a token that resolves to 32px. In new code, always write{" "}
          <code>--ds-type-&lt;role&gt;-size</code>.
        </Callout>
        <div style={{ overflowX: "auto" }}>
          <table className="token-table">
            <caption className="ty-visually-hidden">
              Legacy hyphenated type aliases and the roles they actually resolve to
            </caption>
            <thead>
              <tr>
                <th scope="col">Legacy alias</th>
                <th scope="col">Actually resolves to</th>
                <th scope="col">Rendered size</th>
                <th scope="col">Its name implies</th>
                <th scope="col">Verdict</th>
              </tr>
            </thead>
            <tbody>
              {LEGACY_ALIASES.map((a) => (
                <tr key={a.alias}>
                  <th scope="row"><code>{a.alias}</code></th>
                  <td><code>{a.resolvesTo}</code></td>
                  <td>{a.rendered}</td>
                  <td>{a.implies}</td>
                  <td>
                    <strong style={{ color: a.misleading ? "var(--ds-danger)" : "var(--ds-ink-muted)" }}>
                      {a.misleading ? "Misleading" : "Safe"}
                    </strong>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="docs-section__body">
          <p>
            There is no <code>--ds-text-title-3</code> and no <code>--ds-text-label-2</code> in the hyphenated family —
            for those roles the canonical <code>--ds-type-*</code> name is the only option. The mapping above is frozen in{" "}
            <code>packages/tokens/test/legacy-snapshot.json</code> and asserted on every build, so re-pointing an alias at
            its same-named role would silently resize every legacy callsite in the estate.
          </p>
        </div>
      </section>

      {/* ── 9. Accessibility ────────────────────────────────────── */}
      <section className="docs-section" aria-labelledby="a11y">
        <span className="docs-section__label">Accessibility</span>
        <h2 id="a11y" className="docs-section__heading">Non-negotiable, because these are government services</h2>
        <div className="docs-section__body">
          <p>
            Target: <strong>WCAG 2.1 AA and GIGW 3.0</strong>. Typography carries more of that burden than any other
            foundation — most accessibility failures on a content site are text failures.
          </p>
        </div>
        <A11yChecklist
          items={[
            { criterion: "Resize text — 200% zoom with no loss of content or function", level: "AA", description: "Fluid clamp() already holds sizes steady above 1280px, so browser zoom is the case that actually needs testing." },
            { criterion: "Reflow — usable at a 320px equivalent without two-dimensional scrolling", level: "AA", description: "The 360px anchor is the min of every role; below it, values hold flat rather than shrinking further." },
            { criterion: "Contrast (minimum) — 4.5:1 for body, 3:1 for large text", level: "AA", description: "label-3 at 11px is the smallest permitted text. At that size treat 4.5:1 as a floor and prefer 7:1." },
            { criterion: "Text spacing — survives increased line height and letter spacing", level: "AA", description: "Roles ship their own -lh and -tracking, so user stylesheets layer on top without clipping." },
            { criterion: "Info and relationships — hierarchy comes from heading order, not size", level: "A", description: "Anything communicated by making text bigger must also exist in words, structure or state. Screen readers do not announce font size." },
            { criterion: "Language of parts — lang=\"hi\" on every Devanagari string", level: "AA", description: "Screen readers switch voice on it, and the Devanagari face is applied from it." },
          ]}
        />
        <Callout type="warning" title="The 16px input floor">
          Below 768px, text-entry controls take a hard 16px floor whatever the role says. iOS Safari zooms into any
          focused control under 16px and does not zoom back out, which strands the user mid-form. This is a GIGW-relevant
          usability rule rather than a WCAG success criterion, so it is stated here rather than in the checklist above.
        </Callout>
      </section>

      {/* ── 10. Provenance ──────────────────────────────────────── */}
      <section className="docs-section" aria-labelledby="provenance">
        <span className="docs-section__label">Provenance</span>
        <h2 id="provenance" className="docs-section__heading">Where these numbers come from</h2>
        <div className="docs-section__body">
          <p>
            The source of truth is <code>packages/tokens/src/primitive.json</code> (<code>font.role.*</code> and{" "}
            <code>font.tracking.*</code>). Style Dictionary generates{" "}
            <code>packages/design-system/tokens.css</code>, and the same values are projected into the SAMAVESH Figma
            library&rsquo;s <strong>Type</strong> collection — 109 variables across six{" "}
            <code>Website|Portal × Desktop|Tablet|Mobile</code> modes, plus 24 published text styles.
          </p>
          <p>
            Reconciled across source, generated CSS, the Figma library and this page on <strong>11 August 2026</strong>:{" "}
            <strong>126 of 126 value checks agree</strong>. The written contract lives in{" "}
            <code>packages/design-system/design.md</code>, sections D, E and F.
          </p>
        </div>
      </section>
    </article>
  );
}
