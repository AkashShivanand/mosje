import * as React from "react";
import type { Metadata } from "next";
import { buttonClasses } from "@mosje/design-system";
import { DoDont, Callout, A11yChecklist } from "@/components/design-system/docs-kit/index";
import { figmaUrl, FIGMA_NODES } from "@/lib/design-system/figma";
import { TypeLab } from "./type-lab";
import { ROLES, TIERS, TIER_WHY, STANDARDS } from "./typography-data";
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
          <ul style={{ marginTop: "var(--sa-stack-12)" }}>
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
        <div className="ty-indic-compare">
          {[
            { ok: false, label: "✕ Line height 1.5 — too tight", lh: 1.5, color: "danger" },
            { ok: true, label: "✓ Line height 1.7 — correct", lh: 1.7, color: "success" },
          ].map((c) => (
            <div key={c.label} style={{ border: `1px solid var(--sa-color-status-${c.color})`, borderRadius: "var(--sa-shape-8)", overflow: "hidden" }}>
              <div style={{ padding: "var(--sa-padding-12) var(--sa-padding-16)", background: `var(--sa-color-status-${c.color}Tonal)`, color: `var(--sa-color-status-${c.color})`, fontSize: "var(--sa-type-body-2-size)", fontWeight: 700, borderBottom: `1px solid var(--sa-color-status-${c.color})` }}>
                {c.label}
              </div>
              <p lang="hi" style={{ padding: "var(--sa-padding-20)", margin: 0, fontFamily: "var(--sa-font-devanagari)", fontSize: "var(--sa-type-body-1-size)", lineHeight: c.lh, color: "var(--sa-color-text-default)" }}>
                सामाजिक न्याय और अधिकारिता मंत्रालय देश के वंचित और कमज़ोर वर्गों के कल्याण के लिए अनेक योजनाएँ
                संचालित करता है। आवेदक अपने सभी आवश्यक दस्तावेज़ों के साथ ऑनलाइन आवेदन जमा कर सकते हैं।
              </p>
            </div>
          ))}
        </div>
        <Callout type="tip" title="Rule of thumb">
          When a block can hold Hindi, give it the Indic line height. The <code>--sa-type-body-*-lh</code> tokens
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
                <code style={{ fontFamily: "var(--sa-font-mono)", fontSize: "var(--sa-type-body-3-size)", color: "var(--sa-color-text-default)", textAlign: "left", whiteSpace: "pre" }}>
{`.lead {
  font-size:   var(--sa-type-body-1-size);
  line-height: var(--sa-type-body-1-lh);
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
                <code style={{ fontFamily: "var(--sa-font-mono)", fontSize: "var(--sa-type-body-3-size)", color: "var(--sa-color-text-default)", textAlign: "left", whiteSpace: "pre" }}>
{`.lead {
  font-size: var(--sa-type-body-1-size);
  line-height: var(--sa-type-body-1-lh);
  /* breaks on mobile + portal */
}`}
                </code>
              ),
            },
          ]}
        />
      </section>

      {/* ── 7b. Why these values — the reasoning, from the token source ──── */}
      <section className="docs-section" aria-labelledby="why-these-values">
        <span className="docs-section__label">Reasoning</span>
        <h2 id="why-these-values" className="docs-section__heading">Why these values</h2>
        <div className="docs-section__body">
          <p>
            A value with no reason is a value the next person changes. Every number on this page is carried with
            the reason it is that number &mdash; the standard, the ratio or the measurement behind it &mdash; and the
            same text sits in each <code>type/*</code> variable&rsquo;s description in the Figma library and in the
            token source, so the library and the code cannot disagree about why.
          </p>
          <ul className="ty-why">
            <li><strong>The ramp is 16 steps</strong> &mdash; 12 &middot; 14 &middot; 16 &middot; 18 &middot; 20 &middot; 22 &middot; 24 &middot; 28 &middot; 32 &middot; 36 &middot; 40 &middot; 48 &middot; 56 &middot; 64 &middot; 72 &middot; 80. Steps of 2 up to 24, then 4, then 8: small text needs fine steps to separate a label from a caption, display text needs coarse ones to read as different at all. 36 is there because DBIM &sect;4 names it as the desktop H1; 13 and 15 are not, because a size one pixel from its neighbour is a size nobody can defend.</li>
            <li><strong>The floor is 12px</strong> (UX4G 3.0 &sect;2, &ldquo;minimum usable size&rdquo;). Nothing on the estate renders below it; label-3 moved up from 11 on 2026-09-04.</li>
            <li><strong>Every line height is on the 4px grid</strong>, so stacked text lines up with the spacing ladder. Body is 1.5 on both surfaces (WCAG 1.4.8, DBIM &sect;4 iii); headline leading rises as size falls, 1.20 to 1.50, so a smaller heading is never set tighter than the one above it; display runs 1.10 to 1.20 by recorded exception, because 1.2 at 80px opens a two-line hero into separate lines.</li>
            <li><strong>Weights:</strong> Display 500 on the Display cut, Headline and Title 600, Body 400, Label 500. Headings stop at semibold because 700 closes Noto Sans&rsquo;s counters at these sizes; 800 and 900 do not exist because they are not loaded and the browser would synthesise them.</li>
            <li><strong>Tracking</strong> is negative on Display from one em rule per rung (&minus;0.015em at display-1 and -2, &minus;0.01em at -3 and -4, &minus;0.005em at -5), zero everywhere else, and +0.06em on the one uppercase role, label-3.</li>
            <li><strong>Two surfaces, one core.</strong> Website and Portal differ only in Display and Headline; Title, Body and Label are identical, so a card, a form and a table read the same wherever they sit.</li>
            <li><strong>Where a standard was departed from</strong> &mdash; headline sizes one step above DBIM&rsquo;s 36/24/20, display leading below 1.2, no 18px body &mdash; the reason is a row in the deviation register, not a memory.</li>
          </ul>
          <div className="ty-tiers">
            {TIERS.map((t) => (
              <article key={t.key} className="ty-tier">
                <h3 className="ty-tier__name">{t.label}</h3>
                <p className="ty-tier__why">{TIER_WHY[t.key]}</p>
                <dl className="ty-tier__roles">
                  {ROLES.filter((r) => r.tier === t.key).map((r) => (
                    <React.Fragment key={r.role}>
                      <dt><code>{r.role}</code></dt>
                      <dd>{r.why.replace(/\s*Raw type step\..*$/, "")}</dd>
                    </React.Fragment>
                  ))}
                </dl>
              </article>
            ))}
          </div>
        </div>
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
        <Callout type="info" title="Where UX4G and DBIM disagree, SAMAVESH follows DBIM">
          UX4G&rsquo;s typography page recommends <strong>justified alignment</strong> for column layouts. DBIM 4.1.1
          requires body text to be left-aligned, and justified text on the web opens uneven word spacing that is
          measurably harder for dyslexic readers. SAMAVESH is left-aligned throughout and treats that UX4G line as
          superseded rather than silently reproducing it — flagged for the next UX4G clarification round.
        </Callout>
      </section>

      {/* ── 9. The retired alias family — history, not a live hazard ─ */}
      <section className="docs-section" aria-labelledby="legacy-aliases">
        <span className="docs-section__label">History</span>
        <h2 id="legacy-aliases" className="docs-section__heading">The alias family that lied, and why it is gone</h2>
        <div className="docs-section__body">
          <p>
            Until August 2026 a third family of type variable existed alongside the canonical roles: a hyphenated{" "}
            <code>--ds-text-*</code> set kept for backwards compatibility. It was mapped to whichever role reproduced each
            alias&rsquo;s <em>historical rendered value</em>, so two of its names pointed somewhere other than they read —{" "}
            <code>--ds-text-title-1</code> was the <strong>headline-2</strong> role at 24&nbsp;→&nbsp;32px, not Title&nbsp;1
            at 18&nbsp;→&nbsp;22px, and <code>--ds-text-title-2</code> was Title&nbsp;1.
          </p>
          <p>
            Reading those names instead of their resolved values caused <strong>four separate production bugs</strong>:{" "}
            <code>CardTitle</code> painting at 32–40px, an <code>h2</code> rendering smaller than its <code>h3</code>,
            twelve pages setting a 40px lead against a 24px line-height, and a stale 22px fallback for a token that
            resolved to 32px.
          </p>
        </div>
        <Callout type="tip" title="Retired — there is nothing to avoid any more">
          The whole legacy layer was deleted from the build, and the canonical family now ships as{" "}
          <code>--sa-type-&lt;role&gt;-size</code>. If you are reading code from before that change and see a{" "}
          <code>--ds-</code> name, check its resolved value rather than its name — and then migrate it. Nothing in the
          current stylesheet declares one.
        </Callout>
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
            { criterion: "Contrast (minimum) — 4.5:1 for body, 3:1 for large text", level: "AA", description: "label-3 at 12px is the smallest permitted text. At that size treat 4.5:1 as a floor and prefer 7:1." },
            { criterion: "Text spacing — survives increased line height and letter spacing", level: "AA", description: "Roles ship their own -lh and -tracking, so user stylesheets layer on top without clipping." },
            { criterion: "Info and relationships — hierarchy comes from heading order, not size", level: "A", description: "Anything communicated by making text bigger must also exist in words, structure or state. Screen readers do not announce font size." },
            { criterion: "Language of parts — lang=\"hi\" on every Devanagari string", level: "AA", description: "Screen readers switch voice on it, and the Devanagari face is applied from it." },
          ]}
        />
        <div className="docs-section__body">
          <p>
            Three further rules come from UX4G&rsquo;s own typography guidance and are honoured here rather than restated
            as WCAG criteria: sizes ship in <strong>rem</strong> so a raised browser default font size enlarges text
            without zooming; <strong>Dynamic Type</strong> (iOS) and <strong>Font Scaling</strong> (Android) are respected
            wherever the estate renders inside a native shell; and hierarchy lives in <strong>semantic markup</strong> —
            a visually large paragraph is not a heading and will not be announced as one.
          </p>
        </div>
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
            Reconciled on <strong>11 August 2026</strong>: <strong>126 of 126</strong> checks agree across the DTCG
            source, the generated CSS and this page, and <strong>378 of 378</strong> Figma role variables match the
            source in all six modes. The written contract lives in <code>packages/design-system/design.md</code>,
            sections D, E and F; the national guidance it implements is at <code>doc.ux4g.gov.in/tokens/typography</code>.
          </p>
          <Callout type="tip" title="One set of text styles serves both surfaces">
            The 24 published styles are bound to Type-collection variables, so they re-resolve from the{" "}
            <strong>Type mode of the enclosing frame</strong> — <code>Display/display-1</code> renders 80/88 on
            Website&nbsp;·&nbsp;Desktop and 56/64 on Portal&nbsp;·&nbsp;Desktop from the same style. There is deliberately
            no surface-prefixed duplicate set: a hardcoded copy would freeze one breakpoint and stop tracking the tokens.
          </Callout>
        </div>
      </section>
    </article>
  );
}
