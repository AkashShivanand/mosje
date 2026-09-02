import type { Metadata } from "next";
import * as React from "react";

import {
  CodeBlock,
  ComponentDocPage,
  type A11yItem,
  type PropDef,
} from "@/components/design-system/docs-kit";
import { ApprovalTimeline } from "@mosje/design-system";

export const metadata: Metadata = {
  title: "Approval Timeline — Design System",
  description:
    "The full history of a multi-tier approval chain: who acted, in what role, when, and what they said when returning something for correction.",
};

/*
 * `ApprovalTimelineEvent` is the shape the `events` prop is built from, and it
 * is where the decisions on this page live. The extractor reads interfaces, not
 * the members of the types they reference, so it is documented by hand.
 */
const EVENT: PropDef[] = [
  {
    name: "ApprovalTimelineEvent.at",
    type: "string",
    required: true,
    description:
      "ISO timestamp. It is rendered through en-IN formatting to a date and time; an unparseable value is printed as given rather than swallowed.",
  },
  {
    name: "ApprovalTimelineEvent.actorDisplayName",
    type: "string",
    required: true,
    description: "Who acted. A person, or the system that recorded the step.",
  },
  {
    name: "ApprovalTimelineEvent.actorRoleLabel",
    type: "string",
    required: true,
    description:
      "The role they acted in, in the department's own words — “District Nodal Officer”, not a system code. On an audit trail the role carries more than the name.",
  },
  {
    name: "ApprovalTimelineEvent.action",
    type: '"SUBMITTED" | "RESUBMITTED" | "APPROVED" | "RETURNED"',
    required: true,
    description:
      "What happened. Each renders its own words — “Returned for correction”, “Resubmitted after correction” — so the record reads the same wherever it appears.",
  },
  {
    name: "ApprovalTimelineEvent.remarks",
    type: "string",
    description:
      "Shown as a quoted note. Required in practice on a RETURNED step: a return with no stated reason leaves the applicant with nothing to correct.",
  },
];

const A11Y: A11yItem[] = [
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    status: "verified",
    description:
      "Each step's actor, role, action and timestamp are real text in reading order, so the sequence and the relationship between a step and its remark survive without the drawn rail.",
    evidence: "approval-timeline.tsx renders each event as a labelled block; the rail markers carry aria-hidden.",
  },
  {
    criterion: "1.1.1 Non-text Content",
    level: "A",
    status: "verified",
    description:
      'The rail markers are decoration and carry aria-hidden="true". Nothing in the record is conveyed by the dot alone.',
    evidence: "approval-timeline.tsx lines 75 and 93.",
  },
  {
    criterion: "1.4.1 Use of Color",
    level: "A",
    status: "verified",
    description:
      "A returned step is distinguished by its words as well as its colour — the action label is printed in full beside every marker.",
    evidence: "ACTION_LABEL in approval-timeline.tsx maps every action to a sentence that is always rendered.",
  },
  {
    criterion: "1.3.2 Meaningful Sequence",
    level: "A",
    status: "partial",
    description:
      "Events are rendered in the order given and the component expects them oldest-first, but it does not sort them — a caller that passes them newest-first produces a record that reads backwards with nothing saying so.",
  },
  {
    criterion: "1.4.4 Resize Text",
    level: "AA",
    status: "untested",
    description:
      "The rail is drawn beside the content column and no measurement of the layout at 200% text size has been recorded.",
  },
];

export default function ApprovalTimelinePage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Approval Timeline"
      status="Beta"
      summary="Renders the whole history of a multi-tier approval chain — who acted, in what role, when, and what they said when returning something. It is built for workflows where the audit trail matters as much as the outcome."
      figma={{ absent: "Not yet published in the Figma library." }}
      specimen={
        <ApprovalTimeline
          events={[
            {
              at: "2026-08-12T10:00:00Z",
              actorDisplayName: "Citizen Portal",
              actorRoleLabel: "Applicant",
              action: "SUBMITTED",
            },
            {
              at: "2026-08-14T09:15:00Z",
              actorDisplayName: "S. Ramesh",
              actorRoleLabel: "District Nodal Officer",
              action: "RETURNED",
              remarks: "Income certificate is dated more than six months before the application.",
            },
            {
              at: "2026-08-15T11:40:00Z",
              actorDisplayName: "Citizen Portal",
              actorRoleLabel: "Applicant",
              action: "RESUBMITTED",
            },
            {
              at: "2026-08-16T14:30:00Z",
              actorDisplayName: "Dr. R. Sharma",
              actorRoleLabel: "District Nodal Officer",
              action: "APPROVED",
            },
          ]}
          pendingLabel="Awaiting State disbursal"
        />
      }
      propsFrom="ApprovalTimelineProps"
      props={EVENT}
      a11y={A11Y}
      whenToUse={{
        use: [
          "An application passes through named officers at more than one tier, and the applicant or an officer needs to see the whole chain.",
          "A record was returned and resubmitted, and both must remain visible — the outcome alone is not the history.",
          "A step is still outstanding and the reader should see what it is waiting on; pendingLabel names it.",
        ],
        avoid: [
          "The reader only needs the current status — a Badge states it in one word and takes one line.",
          "The events are a scheme's own history rather than one record's approval chain — use the Vertical Timeline, which takes free content per entry.",
          "The steps are a form the reader is filling in — use a Stepper, which shows what is ahead as well as what is behind.",
          "The reading is how many records sit at each stage across the whole scheme — use a Funnel Chart.",
        ],
      }}
      related={[
        { label: "Vertical Timeline", href: "/design-system/components/data-display/vertical-timeline", reason: "for a history with free content per entry" },
        { label: "Stepper", href: "/design-system/components/feedback/stepper", reason: "for the steps of a form rather than a record" },
        { label: "Badge", href: "/design-system/components/feedback/badge", reason: "when only the current status is needed" },
        { label: "Funnel Chart", href: "/design-system/components/data-display/funnel-chart", reason: "for the same stages across many records" },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-record">
            <h2 id="cdp-record" className="cdp__h2">
              Show the Whole Chain, Including What Went Back
            </h2>
            <p>
              A returned-then-resubmitted record must show both, not just its eventual approval. That
              is the reason this component exists rather than a status badge: on a government workflow
              the audit trail is part of the record, and a chain that quietly drops its returns
              misrepresents how long a decision took and why.
            </p>
            <p>
              A <strong>RETURNED</strong> step without <code>remarks</code> tells an applicant that
              something was wrong and not what. Treat the remark as required there, whatever the type
              says.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-pending">
            <h2 id="cdp-pending" className="cdp__h2">
              Order and the Pending Step
            </h2>
            <p>
              Events are rendered in the order given, and the component expects them{" "}
              <strong>oldest first</strong>. It does not sort, so a caller passing them the other way
              round produces a record that reads backwards with nothing on the page saying so — sort
              at the source.
            </p>
            <p>
              <code>pendingLabel</code> adds a trailing step for what has not happened yet, named as
              the department names it: &ldquo;Awaiting State disbursal&rdquo;. Leave it off where the
              chain is complete; an empty pending step reads as a stall.
            </p>
          </section>
        </>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            Example
          </h2>
          <CodeBlock>{`import { ApprovalTimeline } from "@mosje/design-system";

<ApprovalTimeline
  pendingLabel="Awaiting State disbursal"
  events={[
    { at: "2026-08-12T10:00:00Z", actorDisplayName: "Citizen Portal", actorRoleLabel: "Applicant", action: "SUBMITTED" },
    {
      at: "2026-08-14T09:15:00Z",
      actorDisplayName: "S. Ramesh",
      actorRoleLabel: "District Nodal Officer",
      action: "RETURNED",
      remarks: "Income certificate is dated more than six months before the application.",
    },
    { at: "2026-08-15T11:40:00Z", actorDisplayName: "Citizen Portal", actorRoleLabel: "Applicant", action: "RESUBMITTED" },
    { at: "2026-08-16T14:30:00Z", actorDisplayName: "Dr. R. Sharma", actorRoleLabel: "District Nodal Officer", action: "APPROVED" },
  ]}
/>`}</CodeBlock>
          <p>
            Timestamps are formatted through <code>en-IN</code> to a date and time. A value the browser
            cannot parse is printed exactly as it was given rather than rendered as
            &ldquo;Invalid Date&rdquo;, so a malformed record is visible instead of silently wrong.
          </p>
        </section>
      }
      accessibility={
        <section className="cdp__section" aria-labelledby="cdp-sr">
          <h2 id="cdp-sr" className="cdp__h2">
            What a Screen Reader Gets
          </h2>
          <p>
            Every step as text, in order: the actor, the role, what they did, when, and the remark
            where there is one. The rail and its markers are decoration and are hidden, because the
            sequence is carried by document order rather than by the line drawn beside it.
          </p>
          <p>
            Nothing here is focusable. Where a step carries an action — a link to the returned document,
            say — that control is a real link or button inside the step&apos;s content and takes its own
            tab stop.
          </p>
        </section>
      }
    />
  );
}
