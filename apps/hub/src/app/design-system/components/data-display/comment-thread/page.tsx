import type { Metadata } from "next";
import * as React from "react";
import { CodeBlock, ComponentDocPage, type A11yItem } from "@/components/design-system/docs-kit";
import { ThreadPlayground } from "./thread-playground";

export const metadata: Metadata = {
  title: "Comment Thread — Design System",
  description:
    "The remarks officers leave on a case — Event List plus a composer, read oldest first, with no edit control because a remark that can change after another officer has acted on it is not a record.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "3.3.2 Labels or Instructions",
    level: "A",
    status: "verified",
    evidence:
      "Read from the rendered DOM on this page: the textarea has a <label> bound by htmlFor/id, and when the character count is showing it is referenced by aria-describedby.",
    description: "The composer is labelled, and its limit is announced when it matters.",
  },
  {
    criterion: "4.1.3 Status Messages",
    level: "AA",
    status: "verified",
    evidence:
      'Read from the DOM: the remaining-characters line is aria-live="polite" and is empty until 80% of the limit, so it announces only when it starts to matter rather than on every keystroke.',
    description: "The character count is announced without interrupting typing.",
  },
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    status: "verified",
    evidence:
      "Remarks render through EventList as <li> in a named <ol>, each with a <time>; the composer is a <form> following the list rather than interleaved with it.",
    description: "The conversation and the composer are separate, ordered structures.",
  },
];

export default function CommentThreadPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Comment Thread"
      status="Stable"
      summary="The remarks officers leave on a case. It is Event List plus a composer, so a remark and an audit entry render identically and a reader moving between the two screens is not learning a second layout."
      figma={{ absent: "No master, deliberately — this is Event List's row plus a composer, and a second row style for it is how one object acquires two vocabularies. The decision is recorded on Event List's component record in the SAMAVESH library." }}
      specimen={<ThreadPlayground />}
      propsFrom="CommentThreadProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "A case carries a conversation between officers, or between an officer and an applicant.",
          "A clarification has to be asked for and answered on the record.",
        ],
        avoid: [
          "A public comment section. Nothing on this estate has one, and a thread with no moderation on a government page is a different product.",
          "A single field for one note. That is a Textarea on the form that submits it.",
        ],
      }}
      related={[
        { label: "Event List", href: "/design-system/components/data-display/event-list", reason: "the same rows without a composer" },
        { label: "Textarea", href: "/design-system/components/forms/textarea", reason: "for a single note on a form" },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-order">
            <h2 id="cdp-order" className="cdp__h2">Oldest First</h2>
            <p>
              A thread is a conversation and is read downward. A log is newest-first, because
              nobody reads an audit trail from the beginning. Getting this backwards is the most
              common defect in the pattern, and it is invisible until someone tries to follow the
              exchange.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-edit">
            <h2 id="cdp-edit" className="cdp__h2">There Is No Edit Control</h2>
            <p>
              And there will not be one. On a departmental record, a remark that can change after
              another officer has acted on it is not a record. A correction is a new remark, which
              leaves both the original and the correction on the case where an auditor can see
              them.
            </p>
            <CodeBlock>{`import { CommentThread } from "@mosje/design-system";

<CommentThread
  label="Remarks on this application"
  comments={remarks}          // oldest first
  onSubmit={(text) => recordRemark(text)}
  maxLength={1000}
/>`}</CodeBlock>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-closed">
            <h2 id="cdp-closed" className="cdp__h2">A Closed Thread Says So</h2>
            <p>
              <code>closedReason</code> replaces the composer with the reason. Hiding the box
              silently is how a reader concludes the page failed to load — and on a decided case
              the reason is exactly what they need to know.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-count">
            <h2 id="cdp-count" className="cdp__h2">The Counter Waits Until It Matters</h2>
            <p>
              The remaining-characters line is empty until four-fifths of the limit is used. From
              the first keystroke it is a number nobody needs and everybody reads, and on a live
              region it would announce on every character typed.
            </p>
          </section>
        </>
      }
    />
  );
}
