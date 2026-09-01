import type { Metadata } from "next";
import * as React from "react";

import {
  Callout,
  CodeBlock,
  ComponentDocPage,
  DoDont,
  TokenTable,
  type A11yItem,
} from "@/components/design-system/docs-kit";
import { Divider } from "@mosje/design-system";

import { DividerSpecimen, DividerToneSpecimen } from "./divider-specimen";

export const metadata: Metadata = {
  title: "Divider — Design System",
  description:
    "The estate's thin rule — a 1px hairline between sections, or between controls in a row. Six variants: Orientation × Tone.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "Decorative by default — aria-hidden, no role",
    level: "A",
    description:
      "A rule between toolbar controls is presentation. Announcing “separator” between every pair of buttons in the accessibility bar is noise, so the default is hidden from assistive technology.",
    status: "verified",
    evidence: "Renders <span aria-hidden=\"true\"> when decorative.",
  },
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    description:
      "`decorative={false}` renders a real `<hr>` for a genuine thematic break. `<hr>` already carries role=\"separator\", so no role override is needed; a vertical one adds `aria-orientation`.",
    status: "verified",
  },
  {
    criterion: "1.4.1 Use of Colour",
    level: "A",
    description:
      "A rule is a visual cue and never the only signal. If the separation carries meaning — a new section, a changed state — it must also be conveyed by a heading, a label or the structure.",
  },
  {
    criterion: "1.4.11 Non-text Contrast",
    level: "AA",
    description:
      "This criterion applies to elements needed to understand content. A decorative hairline is exempt, which is exactly why `inverse-subtle` at 40% opacity is legitimate rather than a contrast failure.",
  },
];

export default function DividerPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Divider"
      status="Stable"
      summary="The estate's thin rule — a 1px hairline between sections, or between controls in a row. It is the code counterpart of the SAMAVESH Figma master, whose Orientation and Tone axes make six variants."
      figma={{ node: "divider" }}
      specimen={<DividerSpecimen />}
      propsFrom="DividerProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "Separating two things that are genuinely distinct — applicant details from bank details.",
          "Between controls inside a row: a toolbar, a meta line, a button group.",
          "As a real thematic break between sections, with `decorative={false}`.",
        ],
        avoid: [
          "Creating space — that is the `stack/*` and `inline/*` scales. A rule is a semantic separation, not padding.",
          "Ruling between every row of a list — a list already reads as a list, and rules between rows add noise the eye has to filter out.",
          "A decorative flourish under a heading — that is an accent, not a separator, and it should not be this component.",
        ],
      }}
      related={[
        {
          label: "Section Title",
          href: "/design-system/components/layout/section",
          reason: "when the separation is really a new section with a heading",
        },
        {
          label: "Band",
          href: "/design-system/components/layout/band",
          reason: "when the sections should be separated by a tone change instead",
        },
        {
          label: "Accessibility Bar",
          href: "/design-system/components/utilities/accessibility-bar",
          reason: "the estate's densest use of the vertical rule",
        },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-why">
            <h2 id="cdp-why" className="cdp__h2">
              Why It Exists
            </h2>
            <p>
              The SAMAVESH Figma library has had a <code>Divider</code> master since the
              accessibility bar was built. The design system had <strong>no code counterpart at
              all</strong> until 18 August 2026, so every consumer hand-rolled its own rule — the
              bar with a styled <code>&lt;span&gt;</code>, others with a bordered{" "}
              <code>&lt;div&gt;</code>.
            </p>
            <Callout type="warning" title="That is how one hairline becomes five">
              A census of the estate on 18 August 2026 found <strong>23 hand-rolled 1px rules
              </strong> in <strong>five different colours</strong> — <code>#e2e8f0</code>{" "}
              (Tailwind slate-200, 9 sites), <code>#dcdee1</code> (the actual token, 3),{" "}
              <code>#e5e7eb</code> (Tailwind gray-200, 1), and white at 20, 25, 30 and 40% on
              brand surfaces (8). None of the greys was a deliberate decision; they were whatever
              the nearest utility class happened to be.{" "}
              <strong>
                If you are about to write <code>border-top: 1px solid …</code>, use this component
                instead.
              </strong>
            </Callout>
          </section>

          <section className="cdp__section" aria-labelledby="cdp-orientation">
            <h2 id="cdp-orientation" className="cdp__h2">
              Orientation
            </h2>
            <p>
              <code>horizontal</code> (the default) separates stacked sections.{" "}
              <code>vertical</code> separates controls inside a row.
            </p>
            <Callout type="warning" title="A vertical rule needs a row with a resolvable height">
              This is the &ldquo;my divider disappeared&rdquo; case, and it is worth being precise
              about. The component carries both <code>height: 100%</code> and{" "}
              <code>align-self: stretch</code>. A definite cross size disables the stretch, so the
              percentage is what decides — and a percentage against an auto-height flex parent
              collapses to nothing. Give the row a height (the specimen above uses 40px), or pass{" "}
              <code>length</code>. Measured 2 September 2026: in a row with no height, the rule
              renders at 0.
            </Callout>
          </section>

          <section className="cdp__section" aria-labelledby="cdp-tone">
            <h2 id="cdp-tone" className="cdp__h2">
              Tone Follows the Surface, Not the Taste
            </h2>
            <p>
              Three tones, and the choice is decided by what the rule sits on and what it
              separates.
            </p>
            <DividerToneSpecimen />
            <Callout type="info" title="Why there are two inverse tones">
              At full strength a white rule <em>competes with</em> the controls it separates — on
              a dense toolbar it reads as loudly as the buttons. <code>inverse-subtle</code>{" "}
              (white at 40%) steps back so the controls stay the subject. That is why the
              accessibility bar uses the subtle one between its groups, and why{" "}
              <code>inverse</code> is reserved for separating whole sections on a dark panel.
            </Callout>
          </section>

          <section className="cdp__section" aria-labelledby="cdp-length">
            <h2 id="cdp-length" className="cdp__h2">
              Leave the Length Alone
            </h2>
            <p>
              <code>length</code> exists, and it is usually the wrong thing to set. Omit it and
              the rule stretches, which is what a layout wants almost every time.
            </p>
            <Callout type="info" title="The Figma 20px is a specimen, not a default">
              The master draws its rules at 20px because that is the height of the glyph beside
              them in the accessibility bar. Read as a default it would make every rule in the
              estate 20px long. The bar passes <code>length=&#123;20&#125;</code> deliberately;
              nothing else should need to.
            </Callout>
            <p>
              There is a second reason to leave it alone.{" "}
              <code>align-self: stretch</code> is right for a rule with no length — it matches
              the tallest sibling. With an explicit length it is actively wrong: a flex item with
              a definite cross size treats <code>stretch</code> as <code>flex-start</code>, so the
              rule pins to the top of the row instead of centring. That is how the bar&apos;s
              three separators came to sit at y=7 in a 46px bar, where they should sit at 13,
              while every control around them was centred. The component compensates by centring
              a rule that has been given a length.
            </p>
          </section>

          <section className="cdp__section" aria-labelledby="cdp-dodont">
            <h2 id="cdp-dodont" className="cdp__h2">
              Do and Don&apos;t
            </h2>
            <DoDont
              cards={[
                {
                  type: "do",
                  label: "Use a rule to separate things that are genuinely distinct.",
                  preview: (
                    <div>
                      <p>Applicant details</p>
                      <Divider />
                      <p>Bank details</p>
                    </div>
                  ),
                },
                {
                  type: "dont",
                  label:
                    "Don't use a Divider to create space — that is stack/* or inline/*. A rule is a semantic separation, not padding.",
                  preview: (
                    <div>
                      <p>Heading</p>
                      <Divider />
                      <Divider />
                      <p>Body</p>
                    </div>
                  ),
                },
                {
                  type: "dont",
                  label:
                    "Don't rule between every row of a list. A list already reads as a list; rules between rows add noise the eye has to filter out.",
                  preview: (
                    <div>
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
        </>
      }
      code={
        <>
          <section className="cdp__section" aria-labelledby="cdp-example">
            <h2 id="cdp-example" className="cdp__h2">
              Example
            </h2>
            <CodeBlock>{`import { Divider } from "@mosje/design-system";

// A rule between sections — stretches to the container.
<Divider />

// A rule between controls in a row — stretches to the tallest sibling.
<Divider orientation="vertical" />

// On a brand surface, between controls.
<Divider orientation="vertical" tone="inverse-subtle" />

// A genuine thematic break — renders a real <hr>, announced.
<Divider decorative={false} />`}</CodeBlock>
          </section>

          <section className="cdp__section" aria-labelledby="cdp-tokens">
            <h2 id="cdp-tokens" className="cdp__h2">
              Token Map
            </h2>
            <p>
              Only the <strong>thickness</strong> is component-scoped. The tones bind straight to{" "}
              <code>border/neutral/*</code>, because a rule&apos;s colour is a shared semantic and
              not this component&apos;s private business.
            </p>
            <TokenTable
              tokens={[
                {
                  token: "--sa-cmp-divider-width",
                  value: "1px",
                  description:
                    "The hairline. Aliases ref/border-width/hairline; Figma calls the same primitive by that name.",
                },
                {
                  token: "--sa-border-neutral-subtle",
                  value: 'tone="default"',
                  description: "#dcdee1 — the rule on a light surface.",
                  isColor: true,
                },
                {
                  token: "--sa-border-neutral-inverse-default",
                  value: 'tone="inverse"',
                  description: "White — sections on a dark or brand surface.",
                  isColor: true,
                },
                {
                  token: "--sa-border-neutral-inverse-subtle",
                  value: 'tone="inverse-subtle"',
                  description:
                    "White at 40% — between controls on a brand surface. Pre-composited, so no consumer hand-rolls an opacity.",
                  isColor: true,
                },
              ]}
            />
            <Callout type="info" title="Two of these were library-only until this component existed">
              <code>border/neutral/inverse</code> and <code>border/neutral/inverse-subtle</code>{" "}
              lived in Figma and had no name in code, which is precisely why the accessibility bar
              hand-rolled a white <code>rgba()</code>. Both were authored in code and{" "}
              <strong>renamed in place in Figma</strong> to the nested form (
              <code>inverse/default</code>, <code>inverse/subtle</code>) — a hyphen inside a
              segment breaks the token grammar&apos;s flattening rule, and the library already
              nested <code>bolder/default</code> and <code>bolder/hover</code> that way.
            </Callout>
          </section>

          <section className="cdp__section" aria-labelledby="cdp-migration">
            <h2 id="cdp-migration" className="cdp__h2">
              Migration Status
            </h2>
            <p>
              All 22 of the estate&apos;s hand-rolled separator rules now render this component —
              14 on 18 August 2026, the last 8 on 19 August. The 23rd is not a divider at all.
            </p>
            <TokenTable
              tokens={[
                {
                  token: "Converted — 13 sites",
                  value: 'neutral greys → tone="default"',
                  description:
                    "bg-line, bg-stroke-200, bg-gray-200, bg-border and one raw --sa-border-neutral-subtle. Normalises #e2e8f0 and #e5e7eb onto the #dcdee1 token — two near-identical pale greys, and the Tailwind defaults had no business in a government design system.",
                },
                {
                  token: "Converted — 1 site",
                  value: 'white @ 40% → tone="inverse-subtle"',
                  description: "SamaveshBanner. An exact match; nothing moved.",
                },
                {
                  token: "Converted — 8 sites",
                  value: 'white @ 20 / 25 / 30% → tone="inverse-subtle"',
                  description:
                    "Standardised 19 August 2026 as a design decision. These were brand-surface rules at three different opacities, none of them chosen. They now all render the one tone the system defines for a rule between controls on a brand surface, which makes them slightly more present. portal-login-shell (4), smile-admin auth layout (2), scw gov-chrome (1), nhapoa citizen-shell (1).",
                },
                {
                  token: "Not a divider — 1 site",
                  value: "secondaryScale-400 accent",
                  description:
                    "portal-login-shell's 56px saffron flourish under the heading. A decorative accent, not a separator — deliberately left alone.",
                },
              ]}
            />
          </section>
        </>
      }
      accessibility={
        <section className="cdp__section" aria-labelledby="cdp-decorative">
          <h2 id="cdp-decorative" className="cdp__h2">
            Decorative Is the Default, and That Is a Decision
          </h2>
          <p>
            A horizontal rule that separates <em>sections</em> is a real thematic break and should
            be announced, so <code>decorative=&#123;false&#125;</code> renders an{" "}
            <code>&lt;hr&gt;</code>. But the common case on this estate is a rule <em>inside</em> a
            row — between the controls of a toolbar — which is presentation, not structure.
            Announcing &ldquo;separator&rdquo; between every pair of buttons in the accessibility
            bar is noise, so the default is <code>aria-hidden</code> and no role.
          </p>
          <p>
            Choose by asking what the rule separates. Two sections of a page: not decorative. Two
            controls in a group: decorative.
          </p>
        </section>
      }
    />
  );
}
