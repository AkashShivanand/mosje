import type { Metadata } from "next";
import * as React from "react";

import {
  CodeBlock,
  ComponentDocPage,
  type A11yItem,
} from "@/components/design-system/docs-kit";
import { SlaProgressIndicator } from "@mosje/design-system";

/*
 * NOTE FOR MAINTAINERS: this route and `feedback/sla-progress` both document the
 * same component. `feedback/sla-progress` is the canonical page - states,
 * thresholds, units and UX4G parity live there. This one is kept for the routes
 * that already link to it and covers the variant choice.
 */

export const metadata: Metadata = {
  title: "SLA Progress Indicator — Variants — Design System",
  description:
    "The three shapes an SLA guarantee takes: a linear row, a circular dashboard tile, and a badge for a table cell.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "4.1.2 Name, Role, Value",
    level: "A",
    description:
      'All three variants carry role="progressbar" with aria-valuenow, aria-valuemin, aria-valuemax and aria-labelledby pointing at the label — the badge included, which is why it is a progressbar rather than a coloured pill.',
  },
  {
    criterion: "1.4.1 Use of Colour",
    level: "A",
    description:
      "Every variant prints the summary as text beside the shape, so the state survives without hue. The badge's dot and the ring's fill reinforce that text; they never carry it alone.",
  },
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    description:
      "aria-valuetext carries the whole sentence rather than a percentage, so the circular variant's large number and the badge's short summary reach a screen reader as the same fact.",
  },
  {
    criterion: "1.1.1 Non-text Content",
    level: "A",
    description:
      'The ring SVG, the badge dot and the divider are aria-hidden and focusable="false", so the shape is never announced separately from the value it draws.',
  },
];

export default function SlaProgressIndicatorPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="SLA Progress Indicator — Variants"
      status="Stable"
      summary="The three shapes a service guarantee takes on screen: a linear row for a case or a queue, a circular tile for a dashboard, and a badge for a table cell. All three are the same component and the same arithmetic."
      figma={{ absent: "Not yet published in the Figma library." }}
      specimen={
        <div className="cdp__specimen-stack">
          <SlaProgressIndicator
            label="Application Review — NH/2026/0041"
            total={30}
            elapsed={18}
            description="Held by the District Social Welfare Officer"
          />
          <div className="cdp__specimen-row">
            <SlaProgressIndicator label="Income Certificate" total={21} elapsed={13} variant="circular" />
            <SlaProgressIndicator label="Grievance #4471" total={30} elapsed={34} variant="circular" />
          </div>
          <div className="cdp__specimen-row">
            <SlaProgressIndicator label="NH/2026/0042" total={30} elapsed={26} variant="badge" />
            <SlaProgressIndicator label="NH/2026/0044" total={30} elapsed={11} variant="badge" completed />
          </div>
        </div>
      }
      propsFrom="SlaProgressIndicatorProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "A case row or a queue needs the guarantee spelled out — use the linear variant, which has room for a description and an action.",
          "A dashboard tile reports one guarantee and the headline is the number of units left — use the circular variant.",
          "A table column must carry the standing of every row — use the badge variant, which fits a cell.",
        ],
        avoid: [
          "The measure is a proportion of work completed rather than a statutory promise — use Progress.",
          "The cell only needs a category such as Approved or Pending — use a Badge, which carries no arithmetic.",
          "Two variants would appear for the same case in one view. Pick the one the surface calls for; showing both says the same thing twice.",
        ],
      }}
      related={[
        {
          label: "SLA Progress Indicator",
          href: "/design-system/components/feedback/sla-progress",
          reason: "the canonical page — states, thresholds, units and UX4G parity",
        },
        {
          label: "Progress",
          href: "/design-system/components/data-display/progress",
          reason: "for a proportion of work rather than a guarantee",
        },
        {
          label: "Badge",
          href: "/design-system/components/feedback/badge",
          reason: "when the cell needs a category and no time",
        },
      ]}
      design={
        <section className="cdp__section" aria-labelledby="cdp-pick">
          <h2 id="cdp-pick" className="cdp__h2">
            Picking a Variant
          </h2>
          <ul>
            <li>
              <strong>Linear</strong> — the default. A label and the summary on one line, a bar
              beneath, then an optional description and action. It is the only variant with room to
              say why a clock is paused or who is holding the case.
            </li>
            <li>
              <strong>Circular</strong> — a ring with the units remaining in the middle, the label
              beneath and the summary under that. Built for a tile where the number is the headline;
              a paused clock shows a pause mark instead of a number.
            </li>
            <li>
              <strong>Badge</strong> — a dot, the label, a divider and the summary, on one line. It
              is the only shape that fits a table cell, and it drops the description and the action
              because a cell has room for neither.
            </li>
          </ul>
          <p>
            All three derive their state from the same fraction, so a queue rendered as badges and a
            dashboard rendered as rings cannot disagree about the same case.
          </p>
        </section>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            Example
          </h2>
          <CodeBlock>{`import { SlaProgressIndicator } from "@mosje/design-system";

<SlaProgressIndicator
  label="Application Review — NH/2026/0041"
  total={30}
  elapsed={18}
  description="Held by the District Social Welfare Officer"
  action={<Link href="/cases/NH-2026-0041">View</Link>}
/>`}</CodeBlock>
          <p>
            In a table, the badge variant goes in the cell and the label is the case number, so the
            accessible name distinguishes every row.
          </p>
          <CodeBlock>{`<td>
  <SlaProgressIndicator
    variant="badge"
    label={row.reference}
    total={row.allowedDays}
    elapsed={row.elapsedDays}
  />
</td>`}</CodeBlock>
        </section>
      }
      accessibility={
        <section className="cdp__section" aria-labelledby="cdp-variant-a11y">
          <h2 id="cdp-variant-a11y" className="cdp__h2">
            The Variants Are Equal to Assistive Technology
          </h2>
          <p>
            The three shapes differ visually and not semantically. Each puts the same set of ARIA
            attributes on the element that draws the value — the ring wrapper, the badge span, the
            track — so a screen-reader user hears the same name and the same value sentence whichever
            one a page chose.
          </p>
          <p>
            That is why the badge is a progressbar and not a styled pill. A table column of badges is
            navigable by value, and a reader is told “eighteen of thirty days used” rather than being
            handed a colour.
          </p>
          <p>
            The circular variant&apos;s large number is <code>aria-hidden</code>, because it is a
            fragment of the sentence <code>aria-valuetext</code> already carries in full. Announcing
            both would read the number twice with no unit the second time.
          </p>
        </section>
      }
    />
  );
}
