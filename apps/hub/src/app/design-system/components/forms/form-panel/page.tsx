import type { Metadata } from "next";
import * as React from "react";

import {
  Callout,
  CodeBlock,
  ComponentDocPage,
  MatrixTable,
  type A11yItem,
} from "@/components/design-system/docs-kit";

import { FormPanelPlayground } from "./form-panel-playground";

export const metadata: Metadata = {
  title: "Form Panel — Design System",
  description:
    "The one card a form or a wizard step lives in: a head band with the step title, the sub-sections, and an action band.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    description:
      "A real `<section>` labelled by its own heading through `aria-labelledby`, so a step is announced as a named region, and each sub-section inside is a region labelled by its own heading.",
    status: "verified",
    evidence:
      "Measured with Playwright against this page's specimen on the running hub, 14 Sep 2026: the panel is a SECTION whose aria-labelledby resolves to its title; both sub-sections are sections whose aria-labelledby resolves to a heading inside them.",
  },
  {
    criterion: "2.4.6 Headings and Labels",
    level: "AA",
    description:
      "The title is a real heading at the level the page chooses through `as`, and the sub-sections sit one level below it, so no level is skipped.",
    status: "verified",
    evidence:
      "Measured with Playwright against this page's specimen on the running hub, 14 Sep 2026: with as={3} the title renders as H3 and the two sub-sections given as={4} render H4.",
  },
  {
    criterion: "1.4.10 Reflow",
    level: "AA",
    description:
      "Below 768px the three bands tighten to 16 of padding and the field grids inside collapse to one column, so a step reflows to 320px without scrolling sideways.",
    status: "verified",
    evidence:
      "Measured with Playwright against this page's specimen on the running hub, 14 Sep 2026: at a 320px viewport the panel's scrollWidth equals its clientWidth and the field grid resolves to one column.",
  },
  {
    criterion: "1.4.3 Contrast (Minimum)",
    level: "AA",
    description:
      "The description, the lightest text on the panel, is `text/neutral/subtle` on the head band's `bg/neutral/subtler`.",
    status: "verified",
    evidence:
      "Measured with Playwright against this page's specimen on the running hub, 14 Sep 2026: computed colours give 9.56:1 against the 4.5:1 minimum.",
  },
];

export default function FormPanelPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Form Panel"
      status="New"
      summary="The one card a form or a wizard step lives in. A tinted head band carries the step title and one line of description, the body holds the sub-sections 32 apart, and a tinted action band carries Back or Cancel and the primary action. The step is the card; the sub-sections inside it are not."
      figma={{
        absent:
          "Drawn in the portal handoff file across five portals; not yet published in the SAMAVESH library.",
      }}
      specimen={<FormPanelPlayground />}
      propsFrom="FormPanelProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "A single-screen form — an organisation profile, a correspondence address — that needs one titled surface and one set of actions.",
          "A custom step layout that cannot use Wizard, where the panel must still match every other step on the estate.",
          "A review step's summary, with Submit Application in the action band.",
        ],
        avoid: [
          "A multi-step form — Wizard already renders this panel for the current step, with the stepper, focus handling and the action band.",
          "A sub-section inside a step — use Form Section or Form Card. A card inside the panel is the drift this component was written to stop.",
          "A surface that is not a form — use Card.",
        ],
      }}
      related={[
        {
          label: "Wizard",
          href: "/design-system/components/forms/wizard",
          reason: "renders this panel for every step",
        },
        {
          label: "Form Section",
          href: "/design-system/components/forms/form-section",
          reason: "the sub-sections the body holds",
        },
        {
          label: "Form Inset",
          href: "/design-system/components/forms/form-inset",
          reason: "one entry of a repeatable group inside a sub-section",
        },
        {
          label: "Document Tile",
          href: "/design-system/components/forms/document-tile",
          reason: "the documents on an upload or review step",
        },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-anatomy">
            <h2 id="cdp-anatomy" className="cdp__h2">
              Anatomy
            </h2>
            <p>
              Three bands inside one card with a 20 radius, clipped so the tinted bands meet the corners. The
              values below are the SAMAVESH tokens the handoff&rsquo;s drawing maps to.
            </p>
            <MatrixTable
              caption="Form Panel bands and the tokens they bind"
              columns={["Band", "Surface", "Padding", "Content"]}
              rows={[
                [
                  "Head",
                  "bg/neutral/subtler, bottom hairline border/neutral/subtle",
                  "padding/24",
                  "Title in Body 1 semibold; description in Body 2, text/neutral/subtle; optional action at the right",
                ],
                ["Body", "bg/neutral/base", "padding/24", "Sub-sections, stack/32 apart"],
                [
                  "Action band",
                  "bg/neutral/subtler, top hairline border/neutral/subtle",
                  "padding/24",
                  "Back or Cancel at the start; Save and Continue or Submit Application at the end",
                ],
              ]}
            />
          </section>

          <section className="cdp__section" aria-labelledby="cdp-grammar">
            <h2 id="cdp-grammar" className="cdp__h2">
              One Panel per Step
            </h2>
            <p>
              Every multi-step form in the handoff draws the same page: the stepper on the page ground with no
              box around it, then one panel for the current step. Sections inside the step are separated by an
              uppercase label and a hairline rule, not by cards of their own.
            </p>
            <Callout type="warning" title="Do Not Put a Card Inside the Panel">
              A card per sub-section produces a stack of boxes inside a box, pushes the actions below the last
              card, and reads as several forms rather than one step. E-Anudaan&rsquo;s application form grew
              exactly that before this component existed.
            </Callout>
            <p>
              The action band changes with the step&rsquo;s position. The first step shows Cancel where a
              later step shows Back, so the leading control always goes somewhere. The final step replaces
              Save and Continue with Submit Application.
            </p>
          </section>

          <section className="cdp__section" aria-labelledby="cdp-untitled">
            <h2 id="cdp-untitled" className="cdp__h2">
              A Panel Without a Head Band
            </h2>
            <p>
              <code>title</code> is optional. With no title the head band is not drawn at all, and{" "}
              <code>description</code> and <code>actions</code> go with it. That is for one case: a
              single-screen form whose page header directly above already names the form. Form Screen renders
              its panel this way — the page title, then one panel holding the sections and the action band —
              because a head band repeating the page title says the same thing twice.
            </p>
            <p>
              A wizard step always keeps its head band. The stepper names the stage; the band names the step,
              and the two are often different.
            </p>
          </section>

          <section className="cdp__section" aria-labelledby="cdp-unmatched">
            <h2 id="cdp-unmatched" className="cdp__h2">
              The One Value Not Reproduced
            </h2>
            <p>
              The handoff tints the head band and the action band two shades apart. SAMAVESH&rsquo;s neutral
              ramp has no rung between white and <code>bg/neutral/subtler</code>, so both bands take that
              token. The difference is recorded in the form-wizard visual language rather than approximated
              with a literal.
            </p>
          </section>
        </>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            Example
          </h2>
          <CodeBlock>{`import { Button, FormField, FormPanel, FormSection, Input } from "@mosje/design-system";

<FormPanel
  title="Organisation Contact Details"
  description="These details are used for all correspondence about your applications."
  footer={
    <>
      <Button appearance="outlined" onClick={cancel}>Cancel</Button>
      <Button onClick={save}>Save Changes</Button>
    </>
  }
>
  <FormSection title="Correspondence Address">
    <FormField label="District" required>
      {(control) => <Input {...control} />}
    </FormField>
    …
  </FormSection>
  <FormSection title="Contact Person">…</FormSection>
</FormPanel>`}</CodeBlock>
          <p>
            Inside a Wizard, do not render this component yourself: pass <code>title</code>,{" "}
            <code>description</code> and <code>headerActions</code> to the Wizard, which draws the panel and
            its action band.
          </p>
        </section>
      }
      accessibility={
        <section className="cdp__section" aria-labelledby="cdp-a11y-notes">
          <h2 id="cdp-a11y-notes" className="cdp__h2">
            Notes
          </h2>
          <p>
            With no title the panel is not labelled, so it is not announced as a named region; its
            sub-sections still are. Where a title is given, it is an <code>&lt;h2&gt;</code> by default, under
            the page&rsquo;s own <code>&lt;h1&gt;</code>. Sub-sections inside default to{" "}
            <code>&lt;h3&gt;</code>. Where the panel sits inside something that already owns the{" "}
            <code>&lt;h2&gt;</code>, pass <code>as={"{3}"}</code> here and <code>as={"{4}"}</code> on each
            sub-section, so no level is skipped.
          </p>
          <p>
            The action band follows the body in the document, so Back and Continue are reached after the last
            field rather than before the first. On pages that load the UX4G accessibility widget, its positive{" "}
            <code>tabindex</code> values interrupt that sequence — a known issue recorded in the changelog for
            v0.128.0, not something the panel can correct.
          </p>
          <p>
            Buttons in the action band should carry <code>type=&quot;button&quot;</code> unless they submit
            the enclosing form, so that pressing Enter in a field does not trigger Back.
          </p>
        </section>
      }
    />
  );
}
