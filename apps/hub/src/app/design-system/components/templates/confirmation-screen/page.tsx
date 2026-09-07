import type { Metadata } from "next";
import * as React from "react";
import { Callout, CodeBlock, ComponentDocPage, type A11yItem } from "@/components/design-system/docs-kit";
import { ConfirmationSpecimen } from "../specimens";

export const metadata: Metadata = {
  title: "Confirmation Screen — Design System",
  description: "The post-submit receipt: a reference number, what happens next, and how to keep a copy.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "4.1.3 Status Messages",
    level: "AA",
    description:
      "The reference panel is a status region, so a client-routed submit is announced rather than leaving a screen-reader user on the button they pressed.",
    status: "verified",
    evidence: "The panel carries role=\"status\"; without it a route change with no reload produces no announcement.",
  },
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    description:
      "The facts are a definition list and the next steps are a real ordered list, because they genuinely are a sequence.",
    status: "verified",
    evidence: "Facts render as dl/dt/dd; nextSteps renders an ol.",
  },
  {
    criterion: "1.4.5 Images of Text",
    level: "AA",
    description:
      "The reference is selectable text, never an image or a barcode alone.",
    status: "verified",
    evidence: "Rendered as a paragraph with user-select: all; no image path exists in the component.",
  },
];

export default function ConfirmationScreenPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Confirmation Screen"
      status="Beta"
      summary={"Committed, with a reference number. The number is the screen: largest type on the page, selectable, above the fold."}
      figma={{
        absent:
          "Absent from every source. The handoff's citizen journey ends at submit, so a citizen who applies has nothing to quote at a counter and no way to prove they applied — post-submit confirmation is listed among the archetypes absent entirely.",
      }}
      specimen={<ConfirmationSpecimen />}
      propsFrom="ConfirmationScreenProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "Immediately after any submit that produces a reference number.",
          "After a payment, a registration, a grievance — anything the citizen may later need to prove.",
        ],
        avoid: [
          "A submit still in flight — you are still on the screen before this one.",
          "A confirmation with no reference; if the register issues none, say what the citizen should keep instead.",
        ],
      }}
      related={[
        { label: "Review Screen", href: "/design-system/components/templates/review-screen", reason: "what precedes it" },
        { label: "Record Screen", href: "/design-system/components/templates/record-screen", reason: "where the citizen tracks it afterwards" },
        { label: "Empty State", href: "/design-system/components/feedback/empty-state", reason: "the visual family it borrows from" },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-why">
            <h2 id="cdp-why" className="cdp__h2">The Journey Ended With No Receipt</h2>
            <p>
              This template exists because no source draws it. The handoff&rsquo;s citizen journey
              stops at submit and returns to the dashboard, which means a citizen who has just
              applied for a grant has no reference to quote, nothing to photograph, and no way to
              show a common service centre operator that the application went through.
            </p>
          </section>

          <section className="cdp__section" aria-labelledby="cdp-no-states">
            <h2 id="cdp-no-states" className="cdp__h2">It Has No Data States, Deliberately</h2>
            <p>
              Every other template resolves a reading. This one renders a fact the caller already
              holds, because a confirmation that could be &ldquo;loading&rdquo; is a confirmation
              the citizen cannot trust.
            </p>
            <Callout type="info" title="Size the reference for a phone camera">
              It is set larger than the page title and sits directly under the heading, so a
              citizen photographing this screen at a service centre captures the number without
              scrolling.
            </Callout>
          </section>
        </>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">Example</h2>
          <CodeBlock>{`<ConfirmationScreen
  eyebrow="AVYAY"
  reference={receipt.reference}
  submittedAt={formatDateTime(receipt.at)}
  facts={[
    { label: "Scheme", value: receipt.scheme },
    { label: "Amount Requested", value: money(receipt.amount) },
  ]}
  nextSteps={SCHEME_PROCESS[receipt.scheme]}
  actions={<Button onClick={downloadReceipt}>Download Receipt</Button>}
  support={helpdeskLine}
/>`}</CodeBlock>
          <p>
            Omit <code>nextSteps</code> where the department publishes no process. An invented
            timeline is a promise the department has not made.
          </p>
        </section>
      }
    />
  );
}
