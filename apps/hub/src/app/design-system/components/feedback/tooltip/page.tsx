import type { Metadata } from "next";
import * as React from "react";

import {
  CodeBlock,
  ComponentDocPage,
  type A11yItem,
  type PropDef,
} from "@/components/design-system/docs-kit";

import { TooltipPlayground } from "./tooltip-playground";

export const metadata: Metadata = {
  title: "Tooltip — Design System",
  description:
    "A hint bubble on hover and focus, meeting WCAG 1.4.13: dismissible with Escape, hoverable, and persistent until the reader leaves it.",
};

/*
 * Read off `TooltipProps` in
 * packages/design-system/components/feedback/tooltip.tsx. `TooltipProps` is a
 * standalone interface — it does not extend HTMLAttributes, so there is no rest
 * spread onto the bubble.
 */
const PROPS: PropDef[] = [
  {
    name: "content",
    type: "React.ReactNode",
    required: true,
    description:
      "The hint. A few words: this is a supplement to something already on the page, not a place to put documentation.",
  },
  {
    name: "children",
    type: "React.ReactElement",
    required: true,
    description:
      "The trigger. Exactly one element that can hold a ref and receive mouse and focus handlers — a button, a link, or a design-system component that forwards its ref. Plain text has no focus, so a tooltip on it opens only for a pointer.",
  },
  {
    name: "side",
    type: '"top" | "bottom" | "left" | "right"',
    default: '"top"',
    description:
      "The preferred side. It flips to the opposite side when the preferred one would overflow the viewport, and is clamped on the cross axis so the bubble stays on screen.",
  },
  {
    name: "sideOffset",
    type: "number",
    default: "6",
    description: "Gap in pixels between the trigger and the bubble.",
  },
  {
    name: "delay",
    type: "number",
    default: "200",
    description:
      "Delay before opening on hover, in milliseconds. Focus always opens immediately — a keyboard user has already committed to the control, so making them wait serves nothing.",
  },
  {
    name: "disabled",
    type: "boolean",
    default: "false",
    description: "Suppress the tooltip without unmounting the trigger, so the control keeps its own state.",
  },
  {
    name: "duplicatesTriggerName",
    type: "boolean",
    default: "false",
    description:
      "Set it when the bubble repeats the trigger's own accessible name — the truncated-label case. It drops aria-describedby and hides the bubble from assistive technology, so the label is not announced twice.",
  },
  {
    name: "className",
    type: "string",
    default: "undefined",
    description: "Merged onto the bubble, which renders in a portal on document.body.",
  },
];

const A11Y: A11yItem[] = [
  {
    criterion: "1.4.13 Content on Hover or Focus",
    level: "AA",
    description:
      "All three parts are met: Escape closes the bubble without moving focus (dismissible); the bubble stays open while the pointer is over it (hoverable); and it never times out on its own (persistent).",
  },
  {
    criterion: "2.1.1 Keyboard",
    level: "A",
    description:
      "Focus opens the tooltip immediately and blur closes it, so a keyboard user reaches the hint by the same Tab that reaches the control.",
  },
  {
    criterion: "4.1.2 Name, Role, Value",
    level: "A",
    description:
      'The bubble carries role="tooltip" and the trigger gains aria-describedby only while it is open — describedby rather than labelledby, because a hint supplements the control\'s name and must not replace it.',
  },
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    description:
      "`duplicatesTriggerName` removes both the role and the association when the bubble only repeats a name a screen reader can already read in full, so a truncated tab label is not announced twice.",
  },
];

export default function TooltipPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Tooltip"
      status="Stable"
      summary="A hint bubble shown on hover and on focus. It renders through a portal so no ancestor's overflow can clip it, flips when it would leave the viewport, and meets WCAG 1.4.13 without configuration."
      figma={{ absent: "Not yet published in the Figma library." }}
      specimen={<TooltipPlayground />}
      props={PROPS}
      a11y={A11Y}
      whenToUse={{
        use: [
          "An icon-only control needs its name shown to a sighted reader, and the icon alone is ambiguous.",
          "A short clarification supplements something already stated on the page — an abbreviation, a unit, a column heading.",
          "A label has been visually truncated by CSS and the full string is worth showing on approach.",
        ],
        avoid: [
          "The information is required to complete a task — put it in visible text; a tooltip is unavailable on touch and invisible in print.",
          "The bubble would contain a link or a button — nothing inside a tooltip is reachable, so use a Modal or put the control on the page.",
          "The text is a persistent instruction for a form control — use the helper text on Form Field, which is always visible.",
          "The hint is longer than about a dozen words. That is documentation, and it belongs on the page.",
        ],
      }}
      related={[
        {
          label: "Form Field",
          href: "/design-system/components/forms/form-field",
          reason: "for helper text that must always be visible",
        },
        {
          label: "Label",
          href: "/design-system/components/forms/label",
          reason: "for the persistent name of a control",
        },
        {
          label: "Modal",
          href: "/design-system/components/feedback/modal",
          reason: "when the content needs controls the reader can reach",
        },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-placement">
            <h2 id="cdp-placement" className="cdp__h2">
              Placement
            </h2>
            <p>
              <code>side</code> is a preference, not an instruction. The component measures the
              trigger and the bubble after mounting it, and flips to the opposite side when the
              preferred one would overflow. It then clamps the bubble on the cross axis so a
              tooltip near a corner stays fully on screen.
            </p>
            <p>
              The bubble renders in a portal with fixed positioning, which is what lets it escape
              the <code>overflow: hidden</code> on every data table and card in the estate. It is
              measured before it is painted, so it never appears at the top-left corner first and
              jump to its real position.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-touch">
            <h2 id="cdp-touch" className="cdp__h2">
              A Tooltip Is Never the Only Copy
            </h2>
            <p>
              There is no hover on a touch screen and no focus without a keyboard. Anything a
              citizen needs in order to finish what they came to do must be visible on the page.
              This component is for the second reading of something, never the first.
            </p>
          </section>
        </>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            Example
          </h2>
          <CodeBlock>{`import { Tooltip, Button, Icon } from "@mosje/design-system";

<Tooltip content="Download this notice as a PDF" side="right">
  <Button appearance="text" aria-label="Download notice">
    <Icon name="download" size={20} />
  </Button>
</Tooltip>`}</CodeBlock>
          <p>
            Where the bubble only repeats a label CSS has clipped, set{" "}
            <code>duplicatesTriggerName</code> — otherwise the same words are announced twice.
          </p>
          <CodeBlock>{`<Tooltip content={tab.label} duplicatesTriggerName>
  <button role="tab" className="truncate">{tab.label}</button>
</Tooltip>`}</CodeBlock>
          <p>
            The trigger is cloned, so its ref is <em>merged</em> rather than replaced and any
            handlers it already carries are called before the tooltip&apos;s own. A trigger whose
            ref is load-bearing — a tab that moves focus, for instance — keeps working.
          </p>
        </section>
      }
      accessibility={
        <>
          <section className="cdp__section" aria-labelledby="cdp-1413">
            <h2 id="cdp-1413" className="cdp__h2">
              WCAG 1.4.13, Part by Part
            </h2>
            <ul>
              <li>
                <strong>Dismissible</strong> — Escape closes the bubble and leaves focus on the
                trigger, so a reader who is zoomed in and finds the bubble covering what they were
                reading can clear it without losing their place.
              </li>
              <li>
                <strong>Hoverable</strong> — the bubble keeps itself open while the pointer is over
                it, so its text can be read by someone at high magnification who has to travel onto
                it.
              </li>
              <li>
                <strong>Persistent</strong> — it closes on blur, on pointer-leave, or on Escape, and
                never on a timer.
              </li>
            </ul>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-describedby">
            <h2 id="cdp-describedby" className="cdp__h2">
              Described, Not Named
            </h2>
            <p>
              While the tooltip is open the trigger carries{" "}
              <code>aria-describedby</code> pointing at the bubble, and the bubble carries{" "}
              <code>role=&quot;tooltip&quot;</code>. Description rather than label is the correct
              relationship: the control keeps its own accessible name and the hint is read after it.
            </p>
            <p>
              The exception is the truncated label, where the bubble adds nothing a screen reader
              could not already read. <code>duplicatesTriggerName</code> then removes the role and
              the association entirely, because “Application Details, tab, Application Details” is a
              worse outcome than the visual clipping the tooltip was added to solve.
            </p>
          </section>
        </>
      }
    />
  );
}
