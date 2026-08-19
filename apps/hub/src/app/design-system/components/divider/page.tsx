import * as React from "react";
import type { Metadata } from "next";
import {
  PropsTable,
  TokenTable,
  DoDont,
  A11yChecklist,
  Callout,
  TerminalCode,
} from "@/components/design-system/docs-kit/index";
import { Divider } from "@mosje/design-system";

export const metadata: Metadata = {
  title: "Divider",
  description:
    "The estate's thin rule — a 1px hairline between sections, or between controls in a row. Six variants: Orientation × Tone.",
};

const sectionStyle: React.CSSProperties = { marginBottom: "var(--sa-section-m)" };
const h2Style: React.CSSProperties = {
  fontSize: "var(--sa-type-headline-2-size)",
  fontWeight: 600,
  marginBottom: "var(--sa-stack-m)",
  scrollMarginTop: "var(--sa-section-m)",
};
const leadStyle: React.CSSProperties = {
  fontSize: "var(--sa-type-body-1-size)",
  color: "var(--sa-text-neutral-subtle)",
  lineHeight: "var(--sa-type-body-1-lh)",
  maxWidth: "64ch",
  marginBottom: "var(--sa-stack-m)",
};
const previewLabel: React.CSSProperties = {
  fontSize: "var(--sa-type-label-2-size)",
  fontWeight: 600,
  color: "var(--sa-text-neutral-subtle)",
  marginBottom: "var(--sa-stack-xs)",
};
const panel: React.CSSProperties = {
  background: "var(--sa-bg-neutral-subtler)",
  borderRadius: "var(--sa-shape-md)",
  padding: "var(--sa-padding-l)",
  marginBottom: "var(--sa-stack-m)",
};
const brandPanel: React.CSSProperties = {
  ...panel,
  background: "var(--sa-bg-brand-primary-bolder)",
  color: "var(--sa-text-neutral-inverse)",
};

const USAGE = `import { Divider } from "@mosje/design-system";

// A rule between sections — stretches to the container.
<Divider />

// A rule between controls in a row — stretches to the tallest sibling.
<Divider orientation="vertical" />

// On a brand surface, between controls.
<Divider orientation="vertical" tone="inverse-subtle" />

// A genuine thematic break — renders a real <hr>, announced.
<Divider decorative={false} />`;

export default function DividerPage(): React.JSX.Element {
  return (
    <>
      <header style={{ marginBottom: "var(--sa-section-m)" }}>
        <h1 style={{ fontSize: "var(--sa-type-display-1-size)", fontWeight: 500, lineHeight: 1.1 }}>Divider</h1>
        <p style={{ fontSize: "var(--sa-type-headline-2-size)", fontWeight: 400, color: "var(--sa-color-text-default)", maxWidth: "62ch", lineHeight: 1.5, marginTop: "var(--sa-stack-s)" }}>
          The estate&apos;s thin rule — a 1px hairline between sections, or between controls in a
          row. Six variants: Orientation × Tone.
        </p>
      </header>

      {/* ── Why ── */}
      <section style={sectionStyle}>
        <h2 id="why" style={h2Style}>Why it exists</h2>
        <p style={leadStyle}>
          The SAMAVESH Figma library has had a <code>Divider</code> master since the
          AccessibilityBar was built. The design system had <strong>no code counterpart at
          all</strong> until 2026-08-18, so every consumer hand-rolled its own rule — the bar with
          a styled <code>&lt;span&gt;</code>, others with a bordered <code>&lt;div&gt;</code>.
        </p>
        <Callout type="warning" title="That is how one hairline becomes five">
          A census of the estate on 2026-08-18 found <strong>23 hand-rolled 1px rules</strong> in{" "}
          <strong>five different colours</strong> — <code>#e2e8f0</code> (Tailwind slate-200, 9
          sites), <code>#dcdee1</code> (the actual token, 3), <code>#e5e7eb</code> (Tailwind
          gray-200, 1), and white at 20 / 25 / 30 / 40 % on brand surfaces (8). None of the greys
          were a deliberate decision; they were whatever the nearest utility class happened to be.
          <strong> If you are about to write <code>border-top: 1px solid …</code>, use this
          component instead.</strong>
        </Callout>
      </section>

      {/* ── Orientation ── */}
      <section style={sectionStyle}>
        <h2 id="orientation" style={h2Style}>Orientation</h2>
        <p style={leadStyle}>
          <code>horizontal</code> (the default) separates stacked sections. <code>vertical</code>{" "}
          separates controls inside a row — a toolbar, a meta line, a button group.
        </p>
        <div style={panel}>
          <p style={previewLabel}>horizontal — fills its container</p>
          <Divider />
          <p style={{ ...previewLabel, marginTop: "var(--sa-stack-l)" }}>vertical — stretches to the tallest sibling</p>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--sa-inline-m)", height: "40px" }}>
            <span>Before</span>
            <Divider orientation="vertical" />
            <span>After</span>
          </div>
        </div>
        <Callout type="info" title="Vertical stretches via align-self, not height: 100%">
          <code>height: 100%</code> resolves against a parent with no explicit height and collapses
          to nothing — the classic &ldquo;my divider disappeared&rdquo;. The component uses{" "}
          <code>align-self: stretch</code>, which in a flex row matches the tallest sibling.
        </Callout>
      </section>

      {/* ── Tone ── */}
      <section style={sectionStyle}>
        <h2 id="tone" style={h2Style}>Tone follows the surface, not the taste</h2>
        <p style={leadStyle}>
          Three tones, and the choice is decided by what the rule sits on and what it separates —
          not by preference.
        </p>
        <div style={panel}>
          <p style={previewLabel}>default — on a light surface</p>
          <Divider tone="default" />
        </div>
        <div style={brandPanel}>
          <p style={{ ...previewLabel, color: "var(--sa-text-neutral-inverse)" }}>inverse — sections on a dark surface</p>
          <Divider tone="inverse" />
          <p style={{ ...previewLabel, color: "var(--sa-text-neutral-inverse)", marginTop: "var(--sa-stack-l)" }}>inverse-subtle — between controls</p>
          <Divider tone="inverse-subtle" />
        </div>
        <Callout type="info" title="Why there are two inverse tones">
          At full strength a white rule <em>competes with</em> the controls it separates — on a
          dense toolbar it reads as loudly as the buttons. <code>inverse-subtle</code> (white @ 40 %)
          steps back so the controls stay the subject. That is why the AccessibilityBar uses the
          subtle one between its groups, and why <code>inverse</code> is reserved for separating
          whole sections on a dark panel.
        </Callout>
      </section>

      {/* ── Length ── */}
      <section style={sectionStyle}>
        <h2 id="length" style={h2Style}>Leave the length alone</h2>
        <p style={leadStyle}>
          <code>length</code> exists, and it is usually the wrong thing to set. Omit it and the rule
          stretches, which is what a layout wants almost every time.
        </p>
        <div style={brandPanel}>
          <p style={{ ...previewLabel, color: "var(--sa-text-neutral-inverse)" }}>
            an explicit length — what the AccessibilityBar passes
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--sa-inline-m)", height: "46px" }}>
            <span style={{ fontSize: "var(--sa-type-label-2-size)" }}>Skip to Main Content</span>
            <Divider orientation="vertical" tone="inverse-subtle" length={20} />
            <span style={{ fontSize: "var(--sa-type-label-2-size)" }}>A− A A+</span>
            <Divider orientation="vertical" tone="inverse-subtle" length={20} />
            <span style={{ fontSize: "var(--sa-type-label-2-size)" }}>English</span>
          </div>
        </div>
        <Callout type="info" title="The Figma 20px is a specimen, not a default">
          The master draws its rules at 20px because that is the height of the glyph beside them in
          the bar. Read as a default it would make every rule in the estate 20px long. The bar
          passes <code>length={20}</code> deliberately; nothing else should need to.
        </Callout>
      </section>

      {/* ── Accessibility ── */}
      <section style={sectionStyle}>
        <h2 id="accessibility" style={h2Style}>Accessibility</h2>
        <p style={leadStyle}>
          <code>decorative</code> decides whether assistive technology hears the rule, and the
          default is deliberate.
        </p>
        <A11yChecklist
          items={[
            {
              criterion: "Decorative by default — aria-hidden, no role",
              level: "A",
              description:
                "A rule between toolbar controls is presentation. Announcing “separator” between every pair of buttons in the accessibility bar is noise, so the default is hidden from assistive technology.",
            },
            {
              criterion: "decorative={false} renders a real <hr>",
              level: "A",
              description:
                "For a genuine thematic break between sections. <hr> already carries role=\"separator\", so no role override is needed; a vertical one adds aria-orientation.",
            },
            {
              criterion: "Never the only signal",
              level: "A",
              description:
                "WCAG 1.4.1 — a rule is a visual cue. If the separation carries meaning (a new section, a changed state), it must also be conveyed by a heading, a label or structure.",
            },
            {
              criterion: "Contrast is not required of a decorative rule",
              level: "AA",
              description:
                "WCAG 1.4.11 applies to elements needed to understand content. A decorative hairline is exempt — which is exactly why inverse-subtle at 40% is legitimate rather than a contrast failure.",
            },
          ]}
        />
      </section>

      {/* ── Do / Don't ── */}
      <section style={sectionStyle}>
        <h2 id="guidelines" style={h2Style}>Do &amp; Don&apos;t</h2>
        <DoDont
          cards={[
            {
              type: "do",
              label: "Use a rule to separate things that are genuinely distinct.",
              preview: (
                <div style={{ width: "100%" }}>
                  <p style={{ fontSize: "var(--sa-type-body-3-size)" }}>Applicant details</p>
                  <Divider />
                  <p style={{ fontSize: "var(--sa-type-body-3-size)", marginTop: "var(--sa-stack-s)" }}>Bank details</p>
                </div>
              ),
            },
            {
              type: "dont",
              label:
                "Don't use a Divider to create space — that is stack/* or inline/*. A rule is a semantic separation, not padding.",
              preview: (
                <div style={{ width: "100%" }}>
                  <p style={{ fontSize: "var(--sa-type-body-3-size)" }}>Heading</p>
                  <Divider />
                  <Divider />
                  <p style={{ fontSize: "var(--sa-type-body-3-size)", marginTop: "var(--sa-stack-s)" }}>Body</p>
                </div>
              ),
            },
            {
              type: "dont",
              label:
                "Don't rule between every row of a list. A list already reads as a list; rules between rows add noise the eye has to filter out.",
              preview: (
                <div style={{ width: "100%", fontSize: "var(--sa-type-body-3-size)" }}>
                  <p>Item one</p>
                  <Divider />
                  <p>Item two</p>
                  <Divider />
                  <p>Item three</p>
                </div>
              ),
            },
          ]}
        />
      </section>

      {/* ── Tokens ── */}
      <section style={sectionStyle}>
        <h2 id="tokens" style={h2Style}>Token map</h2>
        <p style={leadStyle}>
          Only the <strong>thickness</strong> is component-scoped. The tones bind straight to{" "}
          <code>border/neutral/*</code>, because a rule&apos;s colour is a shared semantic and not
          this component&apos;s private business.
        </p>
        <TokenTable
          tokens={[
            { token: "--sa-cmp-divider-width", value: "1px", description: "The hairline. Aliases ref/border-width/hairline; Figma calls the same primitive by that name." },
            { token: "--sa-border-neutral-subtle", value: "tone=\"default\"", description: "#dcdee1 — the rule on a light surface.", isColor: true },
            { token: "--sa-border-neutral-inverse-default", value: "tone=\"inverse\"", description: "White — sections on a dark or brand surface.", isColor: true },
            { token: "--sa-border-neutral-inverse-subtle", value: "tone=\"inverse-subtle\"", description: "White @ 40% — between controls on a brand surface. Pre-composited, so no consumer hand-rolls an opacity.", isColor: true },
          ]}
        />
        <Callout type="info" title="Two of these were library-only until this component existed">
          <code>border/neutral/inverse</code> and <code>border/neutral/inverse-subtle</code> lived in
          Figma and had no name in code, which is precisely why the AccessibilityBar hand-rolled a
          white <code>rgba()</code>. Both were authored in code and{" "}
          <strong>renamed in place in Figma</strong> to the nested form
          (<code>inverse/default</code>, <code>inverse/subtle</code>) — a hyphen inside a segment
          breaks the token grammar&apos;s flattening rule, and the library already nested{" "}
          <code>bolder/default</code> and <code>bolder/hover</code> that way.
        </Callout>
      </section>

      {/* ── Migration ── */}
      <section style={sectionStyle}>
        <h2 id="migration" style={h2Style}>Migration status</h2>
        <p style={leadStyle}>
          13 of the estate&apos;s 23 hand-rolled rules were converted on 2026-08-18. The rest are
          listed here rather than quietly converted, because each would have changed a pixel.
        </p>
        <TokenTable
          tokens={[
            { token: "Converted — 13 sites", value: "neutral greys → tone=\"default\"", description: "bg-line, bg-stroke-200, bg-gray-200, bg-border and one raw --sa-border-neutral-subtle. Normalises #e2e8f0 / #e5e7eb onto the #dcdee1 token — two near-identical pale greys, and the Tailwind defaults had no business in a government design system." },
            { token: "Converted — 1 site", value: "white @ 40% → tone=\"inverse-subtle\"", description: "SamaveshBanner. An exact match; nothing moved." },
            { token: "Open — 8 sites", value: "white @ 20 / 25 / 30 %", description: "Brand-surface rules at three opacities Divider does not model. Forcing them to 40% would visibly change their prominence, so they need a decision: standardise on inverse-subtle, or add tones. portal-login-shell (4), smile-admin auth layout (2), scw gov-chrome (1), nhapoa citizen-shell (1)." },
            { token: "Not a divider — 1 site", value: "secondaryScale-400 accent", description: "portal-login-shell's 56px saffron flourish under the heading. A decorative accent, not a separator — deliberately left alone." },
          ]}
        />
      </section>

      {/* ── API ── */}
      <section style={sectionStyle}>
        <h2 id="api" style={h2Style}>API</h2>
        <TerminalCode title="tsx" codeText={USAGE}>
          <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>{USAGE}</pre>
        </TerminalCode>
        <PropsTable
          props={[
            { name: "orientation", type: '"horizontal" | "vertical"', default: '"horizontal"', description: "Mirrors the Figma Orientation axis." },
            { name: "tone", type: '"default" | "inverse" | "inverse-subtle"', default: '"default"', description: "Mirrors the Figma Tone axis. Decided by the surface, not by preference." },
            { name: "length", type: "string | number", description: "Length along the rule's own axis. Omit to stretch — that is almost always what you want." },
            { name: "decorative", type: "boolean", default: "true", description: "true hides it from assistive technology (correct between controls). false renders a real <hr> for a genuine thematic break." },
            { name: "className", type: "string", description: "Merged onto the root — for layout only (margins, flex-1), not for re-colouring the rule." },
          ]}
        />
      </section>
    </>
  );
}
