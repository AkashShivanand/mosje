import type { Metadata } from "next";
import * as React from "react";
import { Callout, CodeBlock, ComponentDocPage, type A11yItem } from "@/components/design-system/docs-kit";
import { DecisionSpecimen } from "../specimens";

export const metadata: Metadata = {
  title: "Decision Screen — Design System",
  description: "A record beside the verdict panel: the officer's decision surface.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    description:
      "The verdicts are a fieldset with a legend, and the panel is a section labelled by its own heading.",
    status: "verified",
    evidence: "RadioGroup supplies fieldset+legend; the panel is section[aria-labelledby] with an id from useId.",
  },
  {
    criterion: "3.3.4 Error Prevention (Legal)",
    level: "AA",
    description:
      "A decision that cannot be unmade says so on the option, above the submit — not in a confirmation dialogue after the officer has decided.",
    status: "verified",
    evidence: "irreversibleNote renders as an Alert between the chosen option and the action row; the component offers no path to defer it to a dialogue.",
  },
  {
    criterion: "3.3.1 Error Identification",
    level: "A",
    description:
      "Validation failures render an ErrorSummary inside the panel at heading level 3, so it fits the page outline rather than claiming to be a page-level heading.",
    status: "verified",
    evidence: "ErrorSummary is passed headingLevel={3}.",
  },
  {
    criterion: "2.4.11 Focus Not Obscured",
    level: "AA",
    description:
      "The panel scrolls with the record rather than floating, so nothing overlays a focused control.",
    status: "verified",
    evidence: "The layout is a CSS grid with no fixed or sticky positioning anywhere in .sa-decision.",
  },
];

export default function DecisionScreenPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Decision Screen"
      status="Beta"
      summary={"One record, and a decision to record against it. Both on screen at once, because an officer choosing \"Return for correction\" must be able to see the field they are returning it for."}
      figma={{
        absent:
          "Absent. The handoff draws the citizen intake journey in depth and almost none of the officer half — no list screen, no decision screen, and no admin screen beyond the admin login.",
      }}
      specimen={<DecisionSpecimen />}
      propsFrom="DecisionScreenProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "An officer approving, returning or rejecting an application.",
          "Any surface where the reader changes a record's state and must see the record while doing it.",
        ],
        avoid: [
          "A reader who can only look — that is Record Screen.",
          "Editing the record's own fields — that is Form Screen.",
          "A bulk verdict across many rows — that is Worklist Screen's bulk actions.",
        ],
      }}
      related={[
        { label: "Record Screen", href: "/design-system/components/templates/record-screen", reason: "the body it embeds" },
        { label: "Worklist Screen", href: "/design-system/components/templates/worklist-screen", reason: "where officers arrive from" },
        { label: "Approval Timeline", href: "/design-system/components/data-display/approval-timeline", reason: "what the decision writes to" },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-side">
            <h2 id="cdp-side" className="cdp__h2">Side by Side, Scrolling Together</h2>
            <p>
              Putting the verdict behind a modal or a side sheet means an officer choosing
              &ldquo;Return for correction&rdquo; cannot see the field they are returning it for.
              Below 1024px the panel follows the record rather than floating over it, for the same
              reason.
            </p>
          </section>

          <section className="cdp__section" aria-labelledby="cdp-omit">
            <h2 id="cdp-omit" className="cdp__h2">Omit a Verdict This Role May Not Record</h2>
            <Callout type="warning" title="Never a disabled Approve">
              A greyed-out verdict announces as present-but-unavailable and explains nothing.
              Filter <code>options</code> by role before passing it.
            </Callout>
          </section>
        </>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">Example</h2>
          <CodeBlock>{`<DecisionScreen
  title={application.project}
  meta={\`Application \${application.id} · \${application.organisation}\`}
  status={<Badge status="info">Awaiting Decision</Badge>}
  legend="What is your decision on this application?"
  options={VERDICTS.filter((v) => role.may.includes(v.id))}
  value={verdict}
  onChange={setVerdict}
  record={<ApplicationSummary application={application} />}
  remarks={<FormField label="Remarks">{(p) => <Textarea {...p} rows={3} />}</FormField>}
  errors={submitted ? validate({ verdict, remarks }) : undefined}
  onSubmit={record}
/>`}</CodeBlock>
        </section>
      }
    />
  );
}
