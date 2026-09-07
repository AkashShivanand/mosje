import type { Metadata } from "next";
import * as React from "react";
import { Callout, CodeBlock, ComponentDocPage, type A11yItem } from "@/components/design-system/docs-kit";
import { InboxSpecimen } from "../specimens";

export const metadata: Metadata = {
  title: "Inbox Screen — Design System",
  description: "A grouped, filterable list of dated events — notifications, audit entries, activity.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "1.4.1 Use of Colour",
    level: "A",
    description:
      "Unread carries a word in the accessibility tree, and its visible cue is the presence of a mark rather than a hue: an unread row has a dot and a read row has none.",
    status: "verified",
    evidence: "EventList emits a visually-hidden `Unread: ` before the entry and an aria-hidden dot beside it — checked in the browser, where the dot itself is empty and carries no accessible name of its own. The distinction a sighted reader makes is presence versus absence, which is not a colour distinction.",
  },
  {
    criterion: "4.1.3 Status Messages",
    level: "AA",
    description:
      "The unread count is a polite live region, so marking everything read is announced.",
    status: "verified",
    evidence: "The count paragraph carries aria-live=\"polite\".",
  },
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    description:
      "Timestamps render inside a <time> element, so the machine-readable form survives.",
    status: "verified",
    evidence: "Inherited from EventList, whose EventItem.at is an ISO string rendered in a time element.",
  },
];

export default function InboxScreenPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Inbox Screen"
      status="Beta"
      summary={"Many records, each a dated attributed event. A notification, a comment and an audit entry are one object with three views."}
      figma={{
        absent:
          "Absent. Notifications is among the archetypes the handoff does not draw at all.",
      }}
      specimen={<InboxSpecimen />}
      propsFrom="InboxScreenProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "Notifications, an audit log, a record's activity feed.",
          "Anything whose unit is an event: dated, attributed, already happened.",
        ],
        avoid: [
          "Objects with a current state the reader changes — that is Worklist Screen.",
          "A single record's history tab — that is EventList on its own inside Record Screen.",
        ],
      }}
      related={[
        { label: "Event List", href: "/design-system/components/data-display/event-list", reason: "the primitive it renders" },
        { label: "Notification Centre", href: "/design-system/components/data-display/notification-centre", reason: "the compact panel form" },
        { label: "Worklist Screen", href: "/design-system/components/templates/worklist-screen", reason: "when the unit is an object" },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-one">
            <h2 id="cdp-one" className="cdp__h2">One Primitive, Three Views</h2>
            <p>
              A notification, a comment and an audit entry share a shape — when, who, what, about
              what. The estate renders all three through <code>EventList</code> rather than three
              near-identical components that drift apart. What differs is grouping, filtering and
              whether anything is read.
            </p>
          </section>

          <section className="cdp__section" aria-labelledby="cdp-mark">
            <h2 id="cdp-mark" className="cdp__h2">Mark-All Appears Only When There Is Something to Mark</h2>
            <p>
              A permanently visible button that does nothing on most visits teaches the reader to
              stop seeing it, so the control is offered only while the unread count is above zero.
            </p>
            <Callout type="info" title="The template does not sort">
              Pass events newest first. The order is the caller&rsquo;s claim, exactly as it is on
              EventList.
            </Callout>
          </section>
        </>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">Example</h2>
          <CodeBlock>{`<InboxScreen
  title="Notifications"
  label="Notifications"
  events={notifications}
  grouping="day"
  onMarkAllRead={markAllRead}
  page={page}
  totalPages={pages}
  hrefForPage={(n) => \`?page=\${n}\`}
  loading={isLoading}
  error={error}
  onRetry={refetch}
/>`}</CodeBlock>
        </section>
      }
    />
  );
}
