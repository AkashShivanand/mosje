import type { Metadata } from "next";
import * as React from "react";

import {
  CodeBlock,
  ComponentDocPage,
  type A11yItem,
} from "@/components/design-system/docs-kit";

import { AlertPlayground } from "./alert-playground";

export const metadata: Metadata = {
  title: "Alert — Design System",
  description:
    "A standing message about the state of the page or the task: a status colour, an icon, a title and a sentence. It stays until the condition changes or the reader dismisses it.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "4.1.2 Name, Role, Value",
    level: "A",
    description:
      'The root carries role="alert", so assistive technology is told what the region is and announces its content when it is inserted into the page.',
  },
  {
    criterion: "1.4.1 Use of Colour",
    level: "A",
    description:
      "The status is carried by the icon and by the wording of the message, not by the tint alone. An alert whose text does not say what happened fails this whatever colour it is.",
  },
  {
    criterion: "1.1.1 Non-text Content",
    level: "A",
    description:
      'The status icon is aria-hidden="true" — it repeats the message rather than adding to it, so announcing it would say the same thing twice.',
  },
  {
    criterion: "2.5.8 Target Size (Minimum)",
    level: "AA",
    description:
      'The dismiss control is a real button carrying aria-label="Dismiss", so it is reachable by keyboard and named without depending on the glyph.',
  },
  {
    criterion: "1.4.3 Contrast (Minimum)",
    level: "AA",
    description:
      "Text and controls resolve through the status token families, so the tint and its ink move together across brand modes rather than one being fixed against the other.",
  },
];

export default function AlertPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Alert"
      status="Stable"
      summary="A standing message about the state of the page or the task, placed where the reader will meet it: a status colour, an icon, an optional title, and a sentence. It stays until the condition changes or the reader puts it away."
      figma={{ node: "alerts" }}
      specimen={<AlertPlayground />}
      propsFrom="AlertProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "A condition applies to the whole page or to the section beneath it — a service is degraded, a form was rejected, a deadline is near.",
          "The reader must see the message before acting, and it must still be there when they come back to the page.",
          "The message needs one control to resolve it, such as “Retry” or “Review the errors”.",
        ],
        avoid: [
          "The message reports the outcome of something the reader just did and needs no action — use a Toast, which leaves on its own instead of permanently shifting the layout.",
          "The message is an invitation rather than a condition — use an Action Banner, which is a call to action, not a status.",
          "The message belongs to one field — put it under that field through Form Field, so it sits where the correction is made.",
          "There is nothing wrong at all and the region is simply empty — use an Empty State.",
        ],
      }}
      related={[
        {
          label: "Toast",
          href: "/design-system/components/feedback/toast",
          reason: "for transient confirmation that needs no action",
        },
        {
          label: "Action Banner",
          href: "/design-system/components/feedback/action-banner",
          reason: "for an invitation rather than a condition",
        },
        {
          label: "Callout",
          href: "/design-system/components/feedback/empty-state",
          reason: "when the region has nothing to show rather than something to report",
        },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-statuses">
            <h2 id="cdp-statuses" className="cdp__h2">
              The Four Statuses
            </h2>
            <ul>
              <li>
                <strong>Info</strong> — the default. General information about the page or the
                service, where nothing has gone wrong.
              </li>
              <li>
                <strong>Success</strong> — a prominent, lasting confirmation. Anything transient
                belongs in a Toast.
              </li>
              <li>
                <strong>Warning</strong> — a consequence the reader should know about before they
                continue.
              </li>
              <li>
                <strong>Error</strong> — a failure that blocks the task, stated with what to do
                next.
              </li>
            </ul>
            <p>
              Map system states to these four consistently across a portal. An estate where one
              screen calls a rejection a warning and the next calls it an error has taught its
              readers to ignore both.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-anatomy">
            <h2 id="cdp-anatomy" className="cdp__h2">
              Anatomy
            </h2>
            <p>
              A tinted surface with a status-coloured left border, a leading icon, then the title,
              the body, an optional inline action, an optional timestamp at the top right, and an
              optional dismiss control at the far right.
            </p>
            <p>
              Use them sparingly. Three alerts stacked at the top of a page is not three times the
              attention; it is a reader who has learned that this estate puts a coloured box above
              everything.
            </p>
          </section>
        </>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            Example
          </h2>
          <CodeBlock>{`import { Alert } from "@mosje/design-system";

<Alert status="warning" title="Maintenance Scheduled" timestamp="Just now">
  This service will be unavailable on Saturday between 12.00 a.m. and 3.00 a.m.
</Alert>`}</CodeBlock>
          <p>
            A dismissible alert is controlled by the consumer — the component renders the button and
            calls back; it holds no visibility state of its own.
          </p>
          <CodeBlock>{`const [shown, setShown] = React.useState(true);

{shown ? (
  <Alert status="error" title="Application Not Submitted" dismissible onDismiss={() => setShown(false)}>
    Three fields could not be validated. Review the highlighted rows and submit again.
  </Alert>
) : null}`}</CodeBlock>
        </section>
      }
      accessibility={
        <section className="cdp__section" aria-labelledby="cdp-announce">
          <h2 id="cdp-announce" className="cdp__h2">
            How It Is Announced
          </h2>
          <p>
            <code>role=&quot;alert&quot;</code> is an assertive live region. A screen reader
            announces the alert as soon as it is inserted into the page, interrupting whatever it
            was reading.
          </p>
          <p>
            That is right for a message that appears in response to something — a failed submission,
            a service going down mid-task. It is heavy-handed for a message that was in the page
            when it loaded, which a reader reaches in the ordinary course of reading. The role is
            always on, so keep alerts that are present on first render short, and prefer inserting
            an alert at the moment the condition arises rather than rendering one permanently.
          </p>
          <p>
            The status is never carried by colour alone. The icon distinguishes the four states
            visually, and the wording has to distinguish them in the accessibility tree: “Application
            rejected” tells a screen-reader user what a red border cannot.
          </p>
        </section>
      }
    />
  );
}
