import type { Metadata } from "next";
import * as React from "react";

import {
  CodeBlock,
  ComponentDocPage,
  type A11yItem,
  type PropDef,
} from "@/components/design-system/docs-kit";
import { VerticalTimeline, VerticalTimelineItem } from "@mosje/design-system";

export const metadata: Metadata = {
  title: "Vertical Timeline — Design System",
  description:
    "A dated sequence of entries down a single rail, for a scheme's history, a milestone list or a chronology of amendments.",
};

/*
 * `VerticalTimelineProps` does not exist: the container is a plain forwardRef
 * over React.HTMLAttributes<HTMLDivElement>, so there is no interface for the
 * extractor to read. `VerticalTimelineItemProps` does, and it comes from
 * `propsFrom`.
 */
const CONTAINER: PropDef[] = [
  {
    name: "VerticalTimeline children",
    type: "React.ReactNode",
    required: true,
    description:
      "VerticalTimelineItem elements, in the order they should read. The container draws the rail and holds no state.",
  },
  {
    name: "VerticalTimeline className",
    type: "string",
    description: "Merged onto the container. Every native div attribute passes through alongside it.",
  },
];

const A11Y: A11yItem[] = [
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    status: "partial",
    description:
      "Each entry's title renders as an <h3> with its date beside it and its content below, so the grouping survives without the rail. The sequence itself is carried by document order rather than by an ordered list, so a screen reader is not told “item 2 of 5”.",
    evidence: "vertical-timeline.tsx renders each item as a div with an h3 title; the container is a div, not an <ol>.",
  },
  {
    criterion: "2.4.6 Headings and Labels",
    level: "AA",
    status: "partial",
    description:
      "Every entry title is an <h3>, fixed. That is correct under an <h2> section heading and wrong under an <h1> or an <h4>, and the level cannot be changed through a prop — check the surrounding outline before using it.",
    evidence: "vertical-timeline.tsx hard-codes h3 for the item title.",
  },
  {
    criterion: "1.1.1 Non-text Content",
    level: "A",
    status: "verified",
    description: "The rail and its markers are drawn in CSS and carry no content, so nothing is conveyed by the line alone.",
    evidence: "vertical-timeline.css draws the marker; the marker element holds no text.",
  },
  {
    criterion: "1.4.4 Resize Text",
    level: "AA",
    status: "untested",
    description:
      "The rail runs beside a single content column and no measurement of the layout at 200% text size has been recorded.",
  },
];

export default function VerticalTimelinePage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Vertical Timeline"
      status="New"
      summary="Lists dated entries down a single rail, each with a title and free content. It is the estate's pattern for a scheme's history, its amendments and its milestones."
      figma={{ absent: "Not yet published in the Figma library." }}
      specimen={
        <VerticalTimeline>
          <VerticalTimelineItem title="Scheme Inception" date="2021">
            <p>Approved by the Union Cabinet and notified in the Gazette.</p>
          </VerticalTimelineItem>
          <VerticalTimelineItem title="First Revision" date="2023">
            <p>The Adarsh Gram component absorbed the earlier village development programme.</p>
          </VerticalTimelineItem>
          <VerticalTimelineItem title="Coverage Extended" date="2024">
            <p>Extended to twelve additional districts on the recommendation of the State committees.</p>
          </VerticalTimelineItem>
        </VerticalTimeline>
      }
      propsFrom="VerticalTimelineItemProps"
      props={CONTAINER}
      a11y={A11Y}
      whenToUse={{
        use: [
          "A scheme, an organisation or a policy has a history worth stating, and each entry has a date and a short account.",
          "The entries are milestones rather than steps somebody is working through.",
          "The content of an entry is free — a paragraph, a link to a notification, a figure.",
        ],
        avoid: [
          "The entries are the approval chain of one application — use the Approval Timeline, which names the actor and role at each step.",
          "The reader is working through the steps — use a Stepper, which shows what is ahead as well as what is behind.",
          "Each entry is several paragraphs. A timeline entry is a summary; put the full account on its own page and link to it.",
          "The entries carry no dates. Without them this is a headed list, and an Accordion or a set of Cards reads better.",
        ],
      }}
      related={[
        { label: "Approval Timeline", href: "/design-system/components/data-display/approval-timeline", reason: "for one record's approval chain" },
        { label: "Stepper", href: "/design-system/components/feedback/stepper", reason: "for steps a reader is working through" },
        { label: "Accordion", href: "/design-system/components/data-display/accordion", reason: "when the entries have no dates" },
        { label: "Card", href: "/design-system/components/data-display/card", reason: "when each entry deserves its own surface" },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-order">
            <h2 id="cdp-order" className="cdp__h2">
              Choose an Order and Keep It
            </h2>
            <p>
              Entries render in the order they are written; the component does not sort. Either
              direction is defensible — oldest first reads as a history, newest first as a news feed —
              but the choice must be the same everywhere the same kind of record appears on the estate,
              or a reader comparing two schemes reads one of them backwards.
            </p>
            <p>
              <code>date</code> takes a node rather than a string, so a year, a month and year, or a
              range all fit. Write it the way the department writes it, and write it the same way in
              every entry of one timeline.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-content">
            <h2 id="cdp-content" className="cdp__h2">
              Keep the Entries Short
            </h2>
            <p>
              An entry is a summary of what happened, not the account of it. Where an entry needs
              several paragraphs, the timeline is being used as a page layout: put the account on its
              own page and let the entry link to it. The value of a timeline is that a reader takes in
              the whole sequence at once, and that is lost as soon as one entry fills the screen.
            </p>
            <p>
              The entry title renders as an <code>h3</code>. Put the timeline under an{" "}
              <code>h2</code> section heading so the document outline stays in order — the level is
              fixed and cannot be passed in.
            </p>
          </section>
        </>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            Example
          </h2>
          <CodeBlock>{`import { VerticalTimeline, VerticalTimelineItem } from "@mosje/design-system";

<VerticalTimeline>
  <VerticalTimelineItem title="Scheme Inception" date="2021">
    <p>Approved by the Union Cabinet and notified in the Gazette.</p>
  </VerticalTimelineItem>
  <VerticalTimelineItem title="First Revision" date="2023">
    <p>The Adarsh Gram component absorbed the earlier village development programme.</p>
  </VerticalTimelineItem>
</VerticalTimeline>`}</CodeBlock>
          <p>
            Both parts forward their refs and pass native <code>div</code> attributes through, so an
            entry can carry an <code>id</code> for a deep link without a wrapper element.
          </p>
        </section>
      }
      accessibility={
        <section className="cdp__section" aria-labelledby="cdp-sr">
          <h2 id="cdp-sr" className="cdp__h2">
            What a Screen Reader Gets
          </h2>
          <p>
            Each entry as a third-level heading with its date beside it, then its content, in the order
            written. The rail is drawn in CSS and holds no text, so nothing is lost when it is not seen.
          </p>
          <p>
            The container is a <code>div</code> rather than an <code>ol</code>, so a screen reader is
            not told how many entries there are or which one it is on. Where the count is part of the
            reading — a numbered set of amendments — state it in the section heading above the
            timeline rather than relying on the markup to imply it.
          </p>
        </section>
      }
    />
  );
}
