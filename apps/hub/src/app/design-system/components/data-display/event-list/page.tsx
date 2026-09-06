import type { Metadata } from "next";
import * as React from "react";
import { CodeBlock, ComponentDocPage, type A11yItem } from "@/components/design-system/docs-kit";
import { EventPlayground } from "./event-playground";

export const metadata: Metadata = {
  title: "Event List — Design System",
  description:
    "A dated, attributed record of things that happened — the activity log and the audit trail, and the base the comment thread and the notification centre are composed from.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    status: "verified",
    evidence:
      "Read from the rendered DOM on this page: entries are <li> inside an <ol> named by `label`, each timestamp is a <time> carrying the machine-readable dateTime, and a day group is a <section> with its own heading.",
    description: "The order and the grouping are in the markup, not only in the layout.",
  },
  {
    criterion: "1.4.1 Use of Colour",
    level: "A",
    status: "verified",
    evidence:
      'Read from the DOM: an unread entry renders a visually hidden "Unread: " before its text, and the coloured dot is aria-hidden. Tone tints the icon only; the action word is always present.',
    description: "Nothing is signalled by colour alone.",
  },
  {
    criterion: "4.1.2 Name, Role, Value",
    level: "A",
    status: "verified",
    evidence:
      "Read from the accessibility tree: the list is a list named by `label`; where a day grouping is on, each list's name is suffixed with the day so two lists on one page are distinguishable.",
    description: "Every list is named, including the per-day lists.",
  },
];

export default function EventListPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Event List"
      status="Stable"
      summary="A dated, attributed record of things that happened. Used directly it is the activity log and the audit trail; Comment Thread and Notification Centre are composed from it, so all three read the same."
      figma={{ absent: "Master pending in the SAMAVESH library — tracked on the component record." }}
      specimen={<EventPlayground />}
      propsFrom="EventListProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "The screen answers &ldquo;what has happened to this?&rdquo; — an audit log, a case history, a recent-activity panel.",
          "Several surfaces show the same events and should show them identically.",
        ],
        avoid: [
          "The events are an approval chain with a fixed vocabulary of steps — that is Approval Timeline, which knows what Submitted and Returned mean and draws the chain between them.",
          "The list is of things rather than of events. A list of applications is a List or a Data Table.",
        ],
      }}
      related={[
        { label: "Approval Timeline", href: "/design-system/components/data-display/approval-timeline", reason: "for a fixed approval chain" },
        { label: "Comment Thread", href: "/design-system/components/data-display/comment-thread", reason: "this plus a composer" },
        { label: "Notification Centre", href: "/design-system/components/data-display/notification-centre", reason: "this grouped by day, behind the bell" },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-one">
            <h2 id="cdp-one" className="cdp__h2">One Object, Three Views</h2>
            <p>
              A comment, an audit entry and a notification are the same thing:{" "}
              <em>someone did something to something, at a time, and may have said why</em>.
              Building three components produces three vocabularies for one object, and then a
              portal&rsquo;s audit log and its notification panel disagree about what an actor is.
              This is the one shape; the other two compose it.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-sort">
            <h2 id="cdp-sort" className="cdp__h2">It Does Not Sort</h2>
            <p>
              The order it is handed is the order it renders. A log is newest-first because nobody
              reads an audit trail from the beginning; a thread is oldest-first because it is a
              conversation. The caller knows which; the component does not, and guessing would make
              one of the two wrong.
            </p>
            <CodeBlock>{`import { EventList } from "@mosje/design-system";

<EventList
  label="Case history"
  events={[
    {
      id: "3",
      at: "2026-09-02T11:05:00+05:30",
      actor: "R. Krishnan",
      actorRole: "District Nodal Officer",
      action: "Returned for correction",
      subject: "Application 2026/PMS/01284",
      tone: "warning",
      note: "A certificate issued by the tehsildar is required.",
    },
  ]}
/>`}</CodeBlock>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-note">
            <h2 id="cdp-note" className="cdp__h2">A Note Is Never Truncated</h2>
            <p>
              On a departmental record, the reason an application was returned is the most
              important text on the screen. It is quoted against a rule and wraps as far as it
              needs to; an ellipsis in the middle of it is a defect, not a layout choice.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-system">
            <h2 id="cdp-system" className="cdp__h2">A System Action Says &ldquo;System&rdquo;</h2>
            <p>
              An entry with no actor renders the word rather than an empty column. On an audit
              trail a blank reads as missing data, which is the worst thing it could read as — the
              whole point of the surface is that nothing is missing from it.
            </p>
          </section>
        </>
      }
    />
  );
}
