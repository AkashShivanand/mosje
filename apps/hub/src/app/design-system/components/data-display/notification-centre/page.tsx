import type { Metadata } from "next";
import * as React from "react";
import { CodeBlock, ComponentDocPage, type A11yItem } from "@/components/design-system/docs-kit";
import { NoticePlayground } from "./notice-playground";

export const metadata: Metadata = {
  title: "Notification Centre — Design System",
  description:
    "The panel behind the bell — what has happened that this officer has not seen, rendered as Event List grouped by day so a notification and the same entry in the audit log read identically.",
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
      summary="The panel behind the bell — what has happened that this officer has not seen. It renders Event List grouped by day, so a notification and the same entry on the case itself read identically."
      figma={{ absent: "Master pending in the SAMAVESH library — tracked on the component record." }}
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
          <section className="cdp__section" aria-labelledby="cdp-mark">
            <h2 id="cdp-mark" className="cdp__h2">Mark All As Read Appears Only When It Can Do Something</h2>
            <p>
              A control that is present all the time and does nothing most of the time teaches
              people to ignore it — and then it is ignored on the day it matters. It is rendered
              only while something is unread.
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
