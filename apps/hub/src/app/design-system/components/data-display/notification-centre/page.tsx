import type { Metadata } from "next";
import * as React from "react";
import { CodeBlock, ComponentDocPage, type A11yItem } from "@/components/design-system/docs-kit";
import { NoticePlayground } from "./notice-playground";

export const metadata: Metadata = {
  title: "Notification Centre — Design System",
  description:
    "The panel behind the bell — what needs the reader's action and what has happened since they last looked, rendered as Event List so a notification and the same entry in the audit log read identically.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "4.1.3 Status Messages",
    level: "AA",
    status: "verified",
    evidence:
      'Read from the rendered DOM on this page: the unread count is role="status" aria-live="polite", so a screen-reader user is told the number changed without being interrupted mid-task.',
    description: "The unread count is announced politely when it changes.",
  },
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    status: "verified",
    evidence:
      "Read from the DOM: the panel is a <section> named by its own <h2> through aria-labelledby, and each day is a <section> with a heading above a named <ol>.",
    description: "The panel and its day groups are real, named regions.",
  },
  {
    criterion: "1.4.1 Use of Colour",
    level: "A",
    status: "verified",
    evidence:
      'Inherited from Event List and read from the DOM here: an unread entry renders a visually hidden "Unread: " and the coloured dot is aria-hidden.',
    description: "Unread is a word before it is a colour.",
  },
];

export default function NotificationCentrePage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Notification Centre"
      status="Stable"
      summary="The panel behind the bell — what needs the reader's action, then what has happened since they last looked. It renders Event List, so a notification and the same entry on the case itself read identically."
      figma={{ absent: "No master, deliberately — this is Event List's row grouped by day, and a second row style for it is how one object acquires two vocabularies. The decision is recorded on Event List's component record in the SAMAVESH library." }}
      specimen={<NoticePlayground />}
      propsFrom="NotificationCentreProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "A portal has a bell, or a notifications page, and needs its contents.",
          "An officer has to be told about work that arrived while they were elsewhere.",
        ],
        avoid: [
          "As a floating widget of its own. The bottom-right corner and the right wall are both spoken for; the panel is placed by whatever opens it.",
          "For a message that must be acted on before the page can continue — that is a Modal.",
          "For the history of one case. That is Event List on the case itself.",
        ],
      }}
      related={[
        { label: "Notification Bell", href: "/design-system/components/navigation/notification-bell", reason: "the masthead control that opens it" },
        { label: "Event List", href: "/design-system/components/data-display/event-list", reason: "the rows this is built from" },
        { label: "Popover", href: "/design-system/components/feedback/popover", reason: "what usually opens it from a masthead bell" },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-same">
            <h2 id="cdp-same" className="cdp__h2">The Same Sentence in Both Places</h2>
            <p>
              A notification reads &ldquo;Returned for correction — Application
              2026/PMS/01284&rdquo;, and so does the entry on the case. That is the point of
              composing it from Event List: an officer who acts on the panel recognises what they
              saw when they arrive at the case, rather than matching two differently-worded
              summaries of one event.
            </p>
            <CodeBlock>{`import { NotificationCentre } from "@mosje/design-system";

<NotificationCentre
  notifications={notices}       // newest first, the EventItem shape
  onMarkAllRead={markAllRead}
/>`}</CodeBlock>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-action">
            <h2 id="cdp-action" className="cdp__h2">Action Before News</h2>
            <p>
              An entry with <code>actionRequired</code> — a deficiency to answer, a document to upload —
              is lifted into an Action Needed section at the top. It is never cut by{" "}
              <code>limit</code>, and marking updates as read does not clear it: it leaves when the
              record no longer needs the action. Derive the flag from the live record, never store it.
              An officer&rsquo;s work queue is not an action here; it already has a count on the
              dashboard. What counts as a notification is set out in{" "}
              <code>docs/specs/notification-object.md</code>.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-mark">
            <h2 id="cdp-mark" className="cdp__h2">Mark Updates as Read Appears Only When It Can Do Something</h2>
            <p>
              A control that is present all the time and does nothing most of the time teaches
              people to ignore it — and then it is ignored on the day it matters. It is rendered
              only while an update is unread, and its label says it marks updates, because it does
              not touch what needs action.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-count">
            <h2 id="cdp-count" className="cdp__h2">One Count, Everywhere</h2>
            <p>
              <code>notificationCount(items)</code> — action-required entries plus unread updates — is
              exported beside the component. The masthead bell&rsquo;s badge, a page&rsquo;s status
              line and any dashboard tile call it, so no two surfaces can print different numbers
              for one feed.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-place">
            <h2 id="cdp-place" className="cdp__h2">It Does Not Place Itself</h2>
            <p>
              There is no floating variant. The bottom-right corner belongs to the accessibility
              widget and the chatbot, and the right wall to the demo dock and the website&rsquo;s
              Important Links. Whatever opens this panel decides where it sits — a Popover under a
              masthead bell, or a page of its own.
            </p>
          </section>
        </>
      }
    />
  );
}
