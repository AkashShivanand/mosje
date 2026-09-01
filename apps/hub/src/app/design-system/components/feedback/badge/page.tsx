import type { Metadata } from "next";
import * as React from "react";

import {
  CodeBlock,
  ComponentDocPage,
  type A11yItem,
  type PropDef,
} from "@/components/design-system/docs-kit";

import { BadgePlayground } from "./badge-playground";

export const metadata: Metadata = {
  title: "Badge — Design System",
  description:
    "A small pill that annotates something with a status, a count or a category. It carries colour meaning and is never interactive.",
};

/*
 * Read off `BadgeProps` in packages/design-system/components/feedback/badge.tsx.
 * The interface extends `React.HTMLAttributes<HTMLSpanElement>`, so every
 * standard span attribute — including `aria-label` — passes through and is not
 * listed individually.
 *
 * Corrected 2026-09-02: the previous table listed five statuses and omitted
 * `info`, and carried none of `emphasis`, `dot` or `pulse`.
 */
const PROPS: PropDef[] = [
  {
    name: "children",
    type: "React.ReactNode",
    required: true,
    description:
      "The label. This is the meaning — a badge whose text does not say the state is unreadable to anyone who cannot see its colour.",
  },
  {
    name: "status",
    type: '"primary" | "info" | "success" | "danger" | "warning" | "neutral"',
    default: '"neutral"',
    description:
      "The semantic colour role, driving the background and the text. Six roles, not five: `info` is its own role and is not a synonym for `primary`.",
  },
  {
    name: "size",
    type: '"sm" | "lg"',
    default: '"sm"',
    description: "`sm` for an inline annotation or a table cell; `lg` for a standalone status beside a heading.",
  },
  {
    name: "emphasis",
    type: '"subtle" | "solid"',
    default: '"subtle"',
    description:
      "Fill strength. `subtle` is a tonal wash of the status colour; `solid` fills with the source colour. Use `solid` sparingly — a row of solid badges in a table reads as a row of buttons.",
  },
  {
    name: "dot",
    type: "boolean",
    default: "false",
    description:
      "Show a leading status dot. The dot is decorative and hidden from assistive technology; it reinforces the label and never replaces it.",
  },
  {
    name: "pulse",
    type: "boolean",
    default: "false",
    description:
      "Animate the leading dot. Implies `dot`. Reserve it for a state that is genuinely live, such as a case currently under scrutiny.",
  },
  {
    name: "className",
    type: "string",
    default: "undefined",
    description: "Merged onto the root span.",
  },
];

const A11Y: A11yItem[] = [
  {
    criterion: "1.4.1 Use of Colour",
    level: "A",
    description:
      "The visible label carries the state. A green pill and a red pill are the same object to a colour-blind reader and to a screen reader, so “Approved” and “Rejected” have to be written.",
  },
  {
    criterion: "1.4.3 Contrast (Minimum)",
    level: "AA",
    description:
      "Each status pairs a tonal background with ink from the same token family, so the pair moves together across brand modes rather than one being fixed against the other.",
  },
  {
    criterion: "1.1.1 Non-text Content",
    level: "A",
    description:
      'The leading dot is aria-hidden="true". It is a second rendering of the status the label already states.',
  },
  {
    criterion: "4.1.2 Name, Role, Value",
    level: "A",
    description:
      "A badge is a label, not a control: it renders a plain span with no role, no tab stop and no handler. Anything clickable is a Button or a Chip.",
  },
  {
    criterion: "2.2.2 Pause, Stop, Hide",
    level: "A",
    description:
      "`pulse` animates a 4px dot. Keep it to a state that is genuinely live and to one badge in a view; a table of pulsing dots is movement a reader cannot switch off.",
  },
];

export default function BadgePage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Badge"
      status="Stable"
      summary="A compact pill that annotates something with a status, a count or a category. It carries colour meaning through a tonal background and readable text, and it is never a button or a link."
      figma={{ node: "badges" }}
      specimen={<BadgePlayground />}
      props={PROPS}
      a11y={A11Y}
      whenToUse={{
        use: [
          "A record carries a state the reader scans for — Approved, Pending, Rejected, Under Review.",
          "A count needs to sit beside the thing it counts, such as unread notices on a tab.",
          "A row or card needs a category tag that is read rather than acted on.",
        ],
        avoid: [
          "The pill is meant to be pressed — use a Chip for a removable or selectable token, or a Button for an action.",
          "The message is a sentence about the page rather than a label on an object — use an Alert.",
          "The state needs explaining as well as naming — put it in the row's own text; a pill has room for two words.",
        ],
      }}
      related={[
        {
          label: "Chip",
          href: "/design-system/components/forms/chip",
          reason: "when the token is selectable or removable",
        },
        {
          label: "Alert",
          href: "/design-system/components/feedback/alert",
          reason: "when the status is a message about the page, not a label on a record",
        },
        {
          label: "SLA Progress Indicator",
          href: "/design-system/components/feedback/sla-progress",
          reason: "for a status that is a time remaining against a guarantee",
        },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-roles">
            <h2 id="cdp-roles" className="cdp__h2">
              Six Roles, Two Sizes, Two Fills
            </h2>
            <p>
              <code>neutral</code> is the default and the right answer for a category tag that
              carries no judgement. <code>success</code>, <code>warning</code> and{" "}
              <code>danger</code> carry outcome. <code>primary</code> and <code>info</code> are
              separate roles rather than one with two names, so a portal can distinguish a branded
              label from an informational one.
            </p>
            <p>
              <code>sm</code> is the default and belongs in a table cell or beside body text;{" "}
              <code>lg</code> stands alone next to a heading. <code>subtle</code> is the default
              fill and the one that survives repetition down a column.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-writing">
            <h2 id="cdp-writing" className="cdp__h2">
              Writing the Label
            </h2>
            <p>
              One or two words, in Title Case, naming the state as the department names it —
              “Approved”, “Under Review”, “Returned for Correction”. Not a sentence, and not a bare
              number where the number could mean anything.
            </p>
          </section>
        </>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            Example
          </h2>
          <CodeBlock>{`import { Badge } from "@mosje/design-system";

<Badge status="success">Approved</Badge>
<Badge status="warning">Pending</Badge>
<Badge status="danger">Rejected</Badge>`}</CodeBlock>
          <p>
            The dot and the pulse are additions to the label, never substitutes for it. A live case
            still says what state it is in.
          </p>
          <CodeBlock>{`<Badge status="info" dot>Queued</Badge>
<Badge status="primary" size="lg" emphasis="solid" pulse>
  Under Scrutiny
</Badge>`}</CodeBlock>
        </section>
      }
      accessibility={
        <section className="cdp__section" aria-labelledby="cdp-naming">
          <h2 id="cdp-naming" className="cdp__h2">
            Naming a Badge That Has Little Text
          </h2>
          <p>
            Where a badge carries a bare count, the number alone is announced without saying what it
            counts. Pass an <code>aria-label</code> through the span passthrough so the
            accessibility tree gets the whole fact.
          </p>
          <CodeBlock>{`<Badge status="danger" aria-label="12 applications rejected">12</Badge>`}</CodeBlock>
          <p>
            A badge has no tab stop, so it is never reached by keyboard and never receives focus.
            That is deliberate: it is content, and putting a handler on it would create a control
            with no role, no name and no focus ring.
          </p>
        </section>
      }
    />
  );
}
