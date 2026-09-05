import * as React from "react";
import type { Metadata } from "next";
import { Callout, DoDont, FoundationDocPage } from "@/components/design-system/docs-kit/index";
import { TypeLab, TokenReference } from "./type-lab";
import { ROLES, TIERS, TIER_WHY, STANDARDS, SURFACES } from "./typography-data";
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

// DS Audit: FoundationDocPage ✅ existing · Callout ✅ existing · DoDont ✅ existing ·
// TypeLab / TokenReference ✅ existing (local, page-specific client islands).
// Every role, size, leading and reason on this page is read from typography-data.ts, which
// is generated from the token source; the standards list is authored in typography-content.json.

/** The ramp is every distinct size any role renders at, on either surface — counted, not stated. */
const RAMP_STEPS = new Set(ROLES.flatMap((r) => [...r.size.website, ...r.size.portal]));
const FLOOR = Math.min(...RAMP_STEPS);
const CEILING = Math.max(...RAMP_STEPS);

export const metadata: Metadata = {
  title: "Typography",
  description:
    "SAMAVESH typography — one 21-role scale rendered on two surfaces (Website, Portal), fluid across every viewport, and drawn for both English and हिन्दी.",
};

const HINDI_SAMPLE =
  "सामाजिक न्याय और अधिकारिता मंत्रालय देश के वंचित और कमज़ोर वर्गों के कल्याण के लिए अनेक योजनाएँ संचालित करता है। आवेदक अपने सभी आवश्यक दस्तावेज़ों के साथ ऑनलाइन आवेदन जमा कर सकते हैं।";

export default function TypographyPage(): React.JSX.Element {
  return (
    <FoundationDocPage
      name="Typography"
      status="Stable"
      since="0.49.0"
      summary="Every MoSJE property serves citizens in English and हिन्दी, so type is never an afterthought. SAMAVESH pairs two Noto typefaces and a single 21-role scale that renders on two surfaces — an expressive Website and a dense Portal — flowing fluidly from phone to desktop, on a strict 4px rhythm."
      figma={{ node: "typography" }}
      glance={[
        { value: ROLES.length, label: "roles", note: "one vocabulary, Display to Label, on both surfaces" },
        { value: SURFACES.length, label: "surfaces", note: "Website and Portal — only Display and Headline differ" },
        { value: TIERS.length, label: "tiers", note: TIERS.map((t) => t.key).join(" · ") },
        { value: RAMP_STEPS.size, label: "ramp steps", note: `${FLOOR} to ${CEILING}px — steps of 2 to 24, then 4, then 8` },
        { value: `${FLOOR}px`, label: "floor", note: "UX4G 3.0 §2 — nothing on the estate renders below it" },
        { value: 24, label: "text styles", note: "bound to 109 Type variables across six Figma modes" },
      ]}
      sections={[
        {
          id: "why-two-typefaces",
          keyword: "TYPEFACES",
          title: "Two Typefaces, One Family, Each Drawn for Its Script",
          content: (
            <>
              <p>
                SAMAVESH uses <strong>Noto Sans</strong> for Latin / English text and{" "}
                <strong>Noto Sans Devanagari</strong>{" "}for <span lang="hi">हिन्दी</span>. Both come from Google&rsquo;s Noto family, so they
                share the same overall character and tone — but each one is drawn specifically for the script it serves.
              </p>
              <ul>
                <li><strong>Different visual weight.</strong> Devanagari letterforms are denser and carry more ink per character than Latin letters.</li>
                <li><strong>Different vertical space.</strong> Devanagari hangs from a top line (the <span lang="hi">शिरोरेखा</span>) and stacks vowel signs and conjuncts above and below.</li>
                <li><strong>Different line-height needs.</strong> Because Devanagari reaches further up and down, Hindi text needs more room between lines (see below).</li>
              </ul>
              <Callout type="info" title="In plain terms">
                One font family, two scripts, each drawn for its own letters. The two always sit at the same point
                size — we change the line height, never the typeface logic.
              </Callout>
            </>
          ),
        },
        {
          id: "the-scale",
          keyword: "SCALE",
          title: "One Scale, Live on Two Surfaces, and Fluid Between Them",
          description:
            "Every role below renders through its real token, so what you see is what ships. Toggle the surface to re-resolve the whole ramp, drag the viewport to watch a role interpolate, and compare the two surfaces side by side.",
          content: <TypeLab />,
        },
        {
          id: "indic-line-height",
          keyword: "INDIC",
          title: "Devanagari Needs More Room Between Lines",
          description:
            "Devanagari hangs from a headline stroke and stacks vowel signs above and below it, so it needs more room between lines than Latin at the same size. Set Hindi too tight and the marks of one line crowd the next, which slows reading. Every role therefore carries a second line height for Hindi: the role's Latin leading plus a fifth of its size, rounded up to the 4px grid — body-1 is 16/24 in English and 16/28 in Hindi; headline-1 is 40/48 and 40/56. The offset is fixed, so a Hindi heading keeps the shape of a heading instead of taking a paragraph's leading. The two columns below use the same font size — only the line height changes.",
          content: (
            <>
              <div className="ty-indic-compare">
                {[
                  { tone: "danger", label: "✕ Latin leading (16/24) — too tight", lh: "var(--sa-type-body-1-lh)" },
                  { tone: "success", label: "✓ Devanagari leading (16/28) — correct", lh: "var(--sa-type-body-1-lhDevanagari)" },
                ].map((c) => (
                  <div key={c.label} className="ty-indic-card" data-tone={c.tone}>
                    <div className="ty-indic-card__head">{c.label}</div>
                    {/* The line height IS the specimen — the one value each card exists to show. */}
                    <p lang="hi" className="ty-indic-card__text" style={{ lineHeight: c.lh }}>
                      {HINDI_SAMPLE}
                    </p>
                  </div>
                ))}
              </div>
              <Callout type="tip" title="Bind the role's Hindi leading, never a ratio">
                A Hindi block is <code>&lt;Text lang=&quot;hi&quot;&gt;</code> or <code>&lt;Heading lang=&quot;hi&quot;&gt;</code>: the
                primitive switches the face and takes the role&rsquo;s <code>--sa-type-&lt;role&gt;-lhDevanagari</code>. An inline
                Hindi word inside an English line keeps the line&rsquo;s own leading. In Figma, bind a Hindi text node&rsquo;s line
                height to <code>type/&lt;role&gt;/lhDevanagari</code> at the same size as its Latin role.
              </Callout>
            </>
          ),
        },
        {
          id: "do-dont",
          keyword: "GUIDANCE",
          title: "A Role Token Is a Contract",
          description:
            "Type roles are a contract. Use the tokens and the whole estate stays consistent, fluid, and Indic-ready; hardcode pixels and pages drift apart.",
          content: (
            <DoDont
              cards={[
                {
                  type: "do",
                  label: "Use a role token and pair size with its line-height so size, leading, and fluid scaling travel together. Set data-surface on portal roots.",
                  preview: (
                    <code className="ty-code">
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
                    <code className="ty-code">
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
          ),
        },
        {
          id: "why-these-values",
          keyword: "REASONING",
          title: "Every Number Carries Its Reason",
          description:
            "A value with no reason is a value the next person changes. Every number on this page is carried with the reason it is that number — the standard, the ratio or the measurement behind it — and the same text sits in each type/* variable’s description in the Figma library and in the token source, so the library and the code cannot disagree about why.",
          content: (
            <>
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
            </>
          ),
        },
        {
          id: "standards",
          keyword: "STANDARDS",
          title: "The Rules, and Where Each One Comes From",
          description:
            "These are grouped the way UX4G groups typography guidance — consistency, hierarchy, spacing, colour and responsiveness — but each rule is stated concretely and tagged with its source, so a reviewer can audit it rather than take it on trust. Rules marked DBIM come from the Digital Brand Identity Manual; GIGW from the Guidelines for Indian Government Websites 3.0.",
          content: (
            <>
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
            </>
          ),
        },
        {
          id: "legacy-aliases",
          keyword: "HISTORY",
          title: "The Alias Family That Lied, and Why It Is Gone",
          content: (
            <>
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
              <Callout type="tip" title="Retired — there is nothing to avoid any more">
                The whole legacy layer was deleted from the build, and the canonical family now ships as{" "}
                <code>--sa-type-&lt;role&gt;-size</code>. If you are reading code from before that change and see a{" "}
                <code>--ds-</code> name, check its resolved value rather than its name — and then migrate it. Nothing in the
                current stylesheet declares one.
              </Callout>
            </>
          ),
        },
      ]}
      tokens={[]}
      tokensIntro="Every role ships four fluid properties — size, line height, letter spacing and paragraph spacing — as --sa-type-<role>-<property>, alongside the weights and the two families. The 21 roles are generated into typography-data.ts from font.role.* in the token source and rendered live on the Overview; the same rows are listed here, both surfaces side by side. Click any token to copy it."
      tokensExtra={
        <>
          <TokenReference />
          <div className="ty-provenance">
            <h3 id="provenance">Where these numbers come from</h3>
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
        </>
      }
      a11y={[
        { criterion: "Resize text — 200% zoom with no loss of content or function", level: "AA", status: "verified", evidence: "packages/tokens/test — every size bound is on the 15-step ramp, no role renders below the 12px floor on either surface, and every line height is on the 4px grid at both ends of the clamp; sizes are rem-based so browser zoom scales them.", description: "Fluid clamp() already holds sizes steady above 1280px, so browser zoom is the case that actually needs testing." },
        { criterion: "Reflow — usable at a 320px equivalent without two-dimensional scrolling", level: "AA", description: "The 360px anchor is the min of every role; below it, values hold flat rather than shrinking further." },
        { criterion: "Contrast (minimum) — 4.5:1 for body, 3:1 for large text", level: "AA", status: "verified", evidence: "packages/tokens/test — every text role token is measured against its surface in every brand; text/link/brand/default moved to ramp 600 when 500 measured 4.07:1 on the muted surface.", description: "label-3 at 12px is the smallest permitted text. At that size treat 4.5:1 as a floor and prefer 7:1." },
        { criterion: "Text spacing — survives increased line height and letter spacing", level: "AA", description: "Roles ship their own -lh and -tracking, so user stylesheets layer on top without clipping." },
        { criterion: "Info and relationships — hierarchy comes from heading order, not size", level: "A", description: "Anything communicated by making text bigger must also exist in words, structure or state. Screen readers do not announce font size." },
        { criterion: "Language of parts — lang=\"hi\" on every Devanagari string", level: "AA", description: "Screen readers switch voice on it, and the Devanagari face is applied from it." },
      ]}
      standards={[
        {
          clause: "DBIM 3.0 §4 — desktop",
          says: "Desktop heading sizes: H1 36 · H2 24 · H3 20 px",
          does: "headline-1 40 · headline-2 32 · headline-3 28 (website); 32 · 28 · 24 (portal)",
          why: "DBIM's three sizes are a minimum hierarchy for a content page, published as an illustration (\"the most common font sizes used\"), not an exclusive list. A 36 → 24 jump leaves no room for the two intermediate heading levels a long government page needs (an h2 and an h3 that are visibly different from each other and from the page title), and 20px for an h3 sits below the estate's 22px card title. The estate keeps DBIM's three sizes on the ramp — 36 is display-2's phone bound and the DBIM H1 is one step from headline-1 — and adds the steps a six-level outline needs. The portal ramp's 32 · 28 · 24 is one step from DBIM's ladder at every level. Decided 2026-09-04.",
        },
        {
          clause: "DBIM 3.0 §4 — mobile",
          says: "Mobile heading sizes: H1 24 · H2 20 · H3 16 px",
          does: "headline-1 28 · headline-2 24 · headline-3 22 (website, at 360px); 24 · 20 · 18 (portal)",
          why: "The portal ramp is DBIM's mobile ladder at H1 and H2 and one step above it at H3, because 16px is the body size and an h3 the same size as its paragraph is a heading in weight only. The website keeps one step more at each level for the same reason DBIM's own §7 gives — \"text should remain legible on smaller screens by adjusting font sizes\" — and reaches DBIM's 24 at display-6. Decided 2026-09-04.",
        },
        {
          clause: "DBIM 3.0 §4 iii",
          says: "Line height 1.2 to 1.5 × the type size",
          does: "Display roles 1.10–1.20 (website) and 1.14–1.33 (portal); everything else 1.20–1.50",
          why: "Followed for every reading and structural role — headline, title, body and label are all inside the band, asserted by packages/tokens/test/type-scale.test.mjs. Display is the recorded exception: at 40–80px on the Display cut, 1.2 leading opens a two-line hero into a stack of separate lines, and every mature scale sets large display type tighter (Material 3 display-large 57/64 = 1.12; Apple Large Title 34/41 = 1.21; GOV.UK 48/50 = 1.04). The display ramp still rises monotonically from 1.10 at 80px to 1.20 at 40px, so the smallest display size meets the band exactly. Decided 2026-09-04.",
        },
        {
          clause: "UX4G 3.0 §2 — minimum",
          says: "Body/XS at 12px is \"the minimum usable size\"",
          does: "Adopted: nothing renders below 12px; label-3 moved from 11 to 12",
          why: "Not a deviation — recorded because the estate's own contract said 11px until this date and shipped 9 and 10. type-scale.test.mjs asserts the floor on every role; the type gate reports any literal below it. Decided 2026-09-04.",
        },
        {
          clause: "UX4G 3.0 §2 — Body/L",
          says: "An 18px reading size for long-form instructions",
          does: "No 18px body role; long-form reading is body-1 at 16/24 with the measure capped at 36rem (≈68 characters)",
          why: "18px body inside a 16px system creates a second reading size that pages mix freely (the audit found the stock 18px utility on 40 lead paragraphs beside 16px bodies). Reading comfort comes from the measure and the 1.5 leading, both of which body-1 has; 18 stays on the ramp for title-1's phone bound and headline-5's portal size. Decided 2026-09-04.",
        },
        {
          clause: "UX4G 3.0 §2 — alignment",
          says: "Justified alignment in column layouts is recommended",
          does: "Left-aligned throughout",
          why: "DBIM 4.1.1 requires left alignment and justification measurably harms dyslexic readers. Pre-existing decision, restated here so the register is complete. Decided 2026-08.",
        },
      ]}
      accessibility={
        <section className="fdp__section" aria-labelledby="ty-a11y-h">
          <header className="fdp__section-head">
            <p className="fdp__section-eyebrow">A11Y / TYPE</p>
            <h2 id="ty-a11y-h" className="fdp__h2">
              Non-Negotiable, Because These Are Government Services
            </h2>
            <p className="fdp__section-desc">
              Target: WCAG 2.1 AA and GIGW 3.0. Typography carries more of that burden than any other foundation — most
              accessibility failures on a content site are text failures.
            </p>
          </header>
          <div className="fdp__section-body">
            <p>
              Three further rules come from UX4G&rsquo;s own typography guidance and are honoured here rather than restated
              as WCAG criteria: sizes ship in <strong>rem</strong> so a raised browser default font size enlarges text
              without zooming; <strong>Dynamic Type</strong> (iOS) and <strong>Font Scaling</strong> (Android) are respected
              wherever the estate renders inside a native shell; and hierarchy lives in <strong>semantic markup</strong> —
              a visually large paragraph is not a heading and will not be announced as one.
            </p>
          </div>
        </section>
      }
      related={[
        { label: "Color", href: "/design-system/foundations/color", reason: "the ink every role is measured against, on white and on the page ground" },
        { label: "Spacing", href: "/design-system/foundations/spacing", reason: "the 4px grid every line height lands on" },
        { label: "Layout Grid", href: "/design-system/foundations/layout-grid", reason: "the measure that makes 16px body comfortable for long reading" },
      ]}
    />
  );
}
