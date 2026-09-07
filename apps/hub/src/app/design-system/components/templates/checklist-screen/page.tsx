import type { Metadata } from "next";
import * as React from "react";
import { CodeBlock, ComponentDocPage, type A11yItem } from "@/components/design-system/docs-kit";
import { ChecklistSpecimen } from "../specimens";

export const metadata: Metadata = {
  title: "Checklist Screen — Design System",
  description: "A required set of documents, grouped, each with its own upload state and findings.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "1.4.1 Use of Colour",
    level: "A",
    description:
      "Every state carries an icon and a worded Badge, never a colour alone.",
    status: "verified",
    evidence: "STATE_BADGE supplies a word for all four states and STATE_ICON a distinct glyph; the CSS tints the icon in addition to, never instead of, those.",
  },
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    description:
      "Each group is a section labelled by its own heading, and its requirements are a real list, so a screen reader says how many there are.",
    status: "verified",
    evidence: "ChecklistGroupBlock renders section[aria-labelledby] over a ul, with the heading id from useId.",
  },
  {
    criterion: "4.1.3 Status Messages",
    level: "AA",
    description:
      "The progress line is a polite live region, so an accepted document is announced rather than changing silently.",
    status: "verified",
    evidence: "The count paragraph carries aria-live=\"polite\".",
  },
  {
    criterion: "3.3.3 Error Suggestion",
    level: "AA",
    description:
      "A rejection states what was wrong and what to do, in full, not behind a disclosure.",
    status: "partial",
    evidence: "The template renders every finding unconditionally and never truncates. Whether the findings themselves are actionable is the caller's; the template cannot enforce that.",
  },
];

export default function ChecklistScreenPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Checklist Screen"
      status="Beta"
      summary={"A required set of artefacts, each with its own verdict. Four states per row, because a file that has left the citizen's machine is not yet a document the department has accepted."}
      figma={{
        absent:
          "Drawn as five document-upload wizard steps across the three schemes, with no per-item verdict and no findings. The four states here are the estate's answer, taken from FileList's existing scanning/failed vocabulary.",
      }}
      specimen={<ChecklistSpecimen />}
      propsFrom="ChecklistScreenProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "A statutory document checklist on an application.",
          "Any set where each item carries its own state — attached, being checked, not accepted.",
        ],
        avoid: [
          "A flat set of attachments with one shared state — that is FileList inside a Form Screen.",
          "A gallery of media the reader manages — that is Gallery Screen.",
        ],
      }}
      related={[
        { label: "File List", href: "/design-system/components/data-display/file-list", reason: "the flat alternative" },
        { label: "Media Upload", href: "/design-system/components/forms/media-upload", reason: "the dropzone for the upload slot" },
        { label: "Wizard Screen", href: "/design-system/components/templates/wizard-screen", reason: "where this usually sits as a step" },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-four">
            <h2 id="cdp-four" className="cdp__h2">Four States, and the Middle Two Are the Point</h2>
            <p>
              A departmental upload is received, then scanned, then checked by a person.
              &ldquo;Attached&rdquo; said the instant a file leaves the citizen&rsquo;s machine is
              a claim the department has not yet made — and a file that appears attached and is
              rejected an hour later is worse than one that says it is being checked.
            </p>
            <p>
              The progress line counts what is <strong>required and accepted</strong>. A citizen
              who has attached six optional documents and none of the four mandatory ones has
              attached nothing that lets them submit.
            </p>
          </section>

          <section className="cdp__section" aria-labelledby="cdp-findings">
            <h2 id="cdp-findings" className="cdp__h2">Findings Are Shown, Not Hidden</h2>
            <p>
              A rejection the citizen has to go looking for is a rejection they will not correct.
              Findings render in full, under the row they belong to, with no &ldquo;show
              more&rdquo;.
            </p>
          </section>
        </>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">As a Wizard Step</h2>
          <CodeBlock>{`<ChecklistScreen
  headingLevel={2}
  eyebrow="AVYAY · STEP 5 OF 7"
  title="Upload Documents"
  upload={<MediaUpload … />}
  groups={requirements}
  footer={<WizardActions onBack={back} onNext={next} />}
/>`}</CodeBlock>
          <p>
            It takes a <code>footer</code> slot rather than owning a Continue button, because when
            it is a wizard step the wizard already has one and two would be two.
          </p>
        </section>
      }
    />
  );
}
