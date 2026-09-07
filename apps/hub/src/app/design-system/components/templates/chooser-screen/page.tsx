import type { Metadata } from "next";
import * as React from "react";
import { Callout, CodeBlock, ComponentDocPage, type A11yItem } from "@/components/design-system/docs-kit";
import { ChooserSpecimen } from "../specimens";

export const metadata: Metadata = {
  title: "Chooser Screen — Design System",
  description: "A finite set of mutually exclusive options, rendered as radio cards with a single Continue.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    description:
      "The options are a real fieldset with a legend, so the question is announced before the choices. Inherited from RadioGroup, which exists precisely because a bare radio labels itself and never the question it answers.",
    status: "verified",
    evidence: "ChooserScreen renders RadioGroup, whose GroupShell emits fieldset+legend and makes `legend` a required prop.",
  },
  {
    criterion: "3.3.1 Error Identification",
    level: "A",
    description:
      "Continue is never disabled while nothing is chosen. Pressing it surfaces the error on the group, which is announced after the options.",
    status: "verified",
    evidence: "The Continue button carries no disabled binding; `error` is forwarded to RadioGroup, which links it through aria-describedby.",
  },
  {
    criterion: "2.1.1 Keyboard",
    level: "A",
    description:
      "Arrow keys move between options and Space selects, because they are native radio inputs rather than clickable cards.",
    status: "verified",
    evidence: "Inherited from RadioGroup's native input elements; no custom key handling is added here.",
  },
  {
    criterion: "2.5.8 Target Size (Minimum)",
    level: "AA",
    description:
      "Each card is the label of its radio, so the whole card is the target.",
    status: "untested",
    evidence: "Not measured in a browser for this template. RadioGroup's card variant sizes the label to the card, but the rendered height has not been asserted here.",
  },
];

export default function ChooserScreenPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Chooser Screen"
      status="Beta"
      summary={"A finite set of mutually exclusive options, and one Continue. The handoff draws this screen three different ways under one name; this is the one built from components."}
      figma={{
        absent:
          "Drawn three times under one name (e-anudaan-select-scheme). AVYAY and NAPDDR place an 800px column with a 170px gutter and use radio-card instances; SHRESHTA runs 1068 full-bleed, shifts the column 24px, hand-builds four frames with no component, and shrinks the CTA from 223 to 105. This ships the first.",
      }}
      specimen={<ChooserSpecimen />}
      propsFrom="ChooserScreenProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "Choosing a scheme, an application type, a financial year — anything finite, known and mutually exclusive.",
          "The first step of a wizard, where the choice decides which steps follow.",
        ],
        avoid: [
          "A set the reader narrows rather than picks from — that is Worklist Screen.",
          "A set they browse and open — that is Catalogue Screen.",
          "More than about eight options; past that it is a list with a filter, not a chooser.",
        ],
      }}
      related={[
        { label: "Selection Card", href: "/design-system/components/forms/selection-card", reason: "the option card" },
        { label: "Wizard Screen", href: "/design-system/components/templates/wizard-screen", reason: "what usually follows" },
        { label: "Form Screen", href: "/design-system/components/templates/form-screen", reason: "when the choice is one field among many" },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-one-design">
            <h2 id="cdp-one-design" className="cdp__h2">One Design, Not Three</h2>
            <p>
              The handoff draws <code>e-anudaan-select-scheme</code> three times, once per scheme,
              and no two agree. AVYAY and NAPDDR sit in an 800px column with a 170px gutter and use{" "}
              <code>radio-card</code> instances. SHRESHTA runs 1068 full-bleed, shifts its column
              24px, hand-builds four frames with no component at all, and draws the CTA at 105px
              against the other two at 223.
            </p>
            <p>
              A citizen applying to two schemes would meet two different screens for the same act.
              This template ships the AVYAY geometry, which is the one built from components.
            </p>
          </section>

          <section className="cdp__section" aria-labelledby="cdp-omit">
            <h2 id="cdp-omit" className="cdp__h2">Omit, or Explain — Never Grey Out Silently</h2>
            <p>
              An option this reader may <em>never</em> pick is left out of the array. An option
              that is genuinely theirs and temporarily closed is passed with{" "}
              <code>unavailableReason</code>, because the reason is the answer they came for.
            </p>
            <Callout type="warning" title="Continue is not disabled">
              A dead Continue explains nothing. Pressing it and being told which question is
              unanswered is how every other required field on this estate behaves, and it is what
              WCAG 2.2 §3.3.1 asks for.
            </Callout>
          </section>
        </>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">Example</h2>
          <CodeBlock>{`<ChooserScreen
  eyebrow="E-ANUDAAN"
  title="Select a Scheme"
  legend="Which scheme are you applying under?"
  options={schemes
    .filter((s) => s.visibleTo.includes(role))
    .map((s) => ({
      id: s.id,
      label: s.name,
      description: s.summary,
      meta: \`\${s.steps} steps\`,
      unavailableReason: s.closed ? \`Applications for \${s.fy} have closed.\` : undefined,
    }))}
  value={searchParams.get("scheme") ?? undefined}
  onChange={(id) => router.replace(\`?scheme=\${id}\`)}
  onContinue={continueToStep2}
  loading={isLoading}
  error={error}
  onRetry={refetch}
/>`}</CodeBlock>
          <p>
            Drive <code>value</code> from the URL. A chooser whose answer lives in{" "}
            <code>useState</code> loses the reader&rsquo;s choice on a refresh, which on a slow
            connection is the common case rather than the exception.
          </p>
        </section>
      }
    />
  );
}
