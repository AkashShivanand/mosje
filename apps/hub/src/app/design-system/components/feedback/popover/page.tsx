import type { Metadata } from "next";
import * as React from "react";

import {
  CodeBlock,
  ComponentDocPage,
  type A11yItem,
} from "@/components/design-system/docs-kit";

import { PopoverPlayground } from "./popover-playground";

export const metadata: Metadata = {
  title: "Popover — Design System",
  description:
    "A non-modal dialog anchored to a trigger, holding content the reader can interact with. Escape closes it and returns focus; Tab out closes it without trapping.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "2.1.2 No Keyboard Trap",
    level: "A",
    status: "verified",
    evidence:
      "Tabbing past the last control in the panel fires the panel's onBlur with a relatedTarget outside it, which closes the panel and lets focus continue into the page. Verified by keyboard in Storybook on the WithControls story: Tab from the Apply button reaches the next control on the page, not the first control in the panel.",
    description:
      "The panel is non-modal and must not trap. Tab past its last control closes it and focus carries on into the page.",
  },
  {
    criterion: "2.4.3 Focus Order",
    level: "A",
    status: "verified",
    evidence:
      "Escape calls closeAndRestore, which returns focus to the trigger element via the merged ref. Verified by keyboard: open, Tab twice into the panel, press Escape, and focus is on the trigger button rather than at the top of the document.",
    description:
      "Escape returns focus to the trigger, so a keyboard user is never dropped at the top of the document.",
  },
  {
    criterion: "4.1.2 Name, Role, Value",
    level: "A",
    status: "verified",
    evidence:
      'The panel carries role="dialog" with aria-label from the required `label` prop and aria-modal={false}; the trigger carries aria-haspopup="dialog", aria-expanded reflecting state, and aria-controls while open. Read from the rendered DOM in the accessibility tree.',
    description:
      "The trigger reports the panel's state; the panel is a named dialog. `label` is required precisely so no panel can ship unnamed.",
  },
  {
    criterion: "2.1.1 Keyboard",
    level: "A",
    status: "verified",
    evidence:
      "Opening is bound to the trigger's onClick, which a native button fires on both Enter and Space; no pointer-only handler participates. Verified in Storybook with Enter and with Space.",
    description:
      "The panel opens from the keyboard by the same key that activates any button, and every control inside is reachable.",
  },
  {
    criterion: "1.4.10 Reflow",
    level: "AA",
    status: "verified",
    evidence:
      "max-width is min(22rem, 100vw − 32px) and the placement engine clamps both axes to an 8px viewport margin. Verified at 320px width in the browser: the panel stays fully on screen and wraps rather than causing horizontal scroll.",
    description:
      "The panel is capped against the viewport and clamped on both axes, so it cannot cause horizontal scrolling at 320px.",
  },
];

export default function PopoverPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Popover"
      status="Stable"
      summary="A dismissible panel anchored to a trigger, holding content the reader can interact with. Unlike a tooltip it takes focus, so the controls inside it can actually be reached; unlike a modal it leaves the page operable behind it."
      figma={{ node: "popover" }}
      specimen={<PopoverPlayground />}
      propsFrom="PopoverProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "A control needs its own small set of options — a filter, a sort, a row's actions.",
          "A field's guidance is longer than a hint and contains a link the reader must be able to follow.",
          "A secondary task can be completed without leaving the page, and the page behind should stay readable.",
        ],
        avoid: [
          "The content is a plain description of the trigger with no controls in it — that is a Tooltip, which opens on hover and costs the reader nothing.",
          "The reader must answer before anything else can happen — that is a Modal, which owns the screen deliberately.",
          "The panel would hold a whole form or a record — that is a Side Sheet, which has room and its own scroll.",
          "The trigger is not focusable. A popover on plain text can never be opened from a keyboard.",
        ],
      }}
      related={[
        {
          label: "Tooltip",
          href: "/design-system/components/feedback/tooltip",
          reason: "for a description with no controls in it",
        },
        {
          label: "Modal",
          href: "/design-system/components/feedback/modal",
          reason: "when the reader must answer before continuing",
        },
        {
          label: "Side Sheet",
          href: "/design-system/components/feedback/side-sheet",
          reason: "when the content is a form or a full record",
        },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-not-tooltip">
            <h2 id="cdp-not-tooltip" className="cdp__h2">
              Why This Is Not a Tooltip
            </h2>
            <p>
              The difference is structural, not stylistic. A tooltip opens on hover, holds no
              controls, and is announced as a description of the thing that opened it. A popover
              opens on click, takes focus, and is a dialog. Content that opens on hover cannot be
              tabbed into, so a link or a button inside a tooltip is unreachable for anyone using a
              keyboard and invisible to anyone on a touch screen — which is how most citizens reach
              these portals.
            </p>
            <p>
              If the panel contains something the reader can act on, it is a popover. If it only
              tells them what the control is, it is a tooltip.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-placement">
            <h2 id="cdp-placement" className="cdp__h2">
              Placement
            </h2>
            <p>
              <code>side</code> and <code>align</code> are preferences. The panel is measured after
              it mounts, flipped to the opposite side when the preferred one would overflow, and
              clamped on both axes against an 8px viewport margin. It is measured before it is
              painted, so it never appears in the corner first and then jumps.
            </p>
            <p>
              <code>align</code> defaults to <code>start</code> rather than centre. A panel whose
              leading edge lines up with its trigger reads as belonging to it; one centred under a
              wide button reads as belonging to the page.
            </p>
            <p>
              The placement engine is shared with Tooltip and lives in{" "}
              <code>foundations/anchor.ts</code>. One implementation is the point: five copies of
              this arithmetic would be five places for a panel to open off-screen on a phone, and
              only one of them would ever be fixed.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-edge">
            <h2 id="cdp-edge" className="cdp__h2">
              The Panel&apos;s Edge
            </h2>
            <p>
              The panel sits on the same white as the page, so its edge is carried by a hairline
              border plus elevation. That border measures <strong>1.35:1</strong> against the page
              (<code>--sa-border-neutral-subtle</code> on <code>--sa-bg-neutral-base</code>), which
              is below the 3:1 in WCAG 1.4.11 — and 1.4.11 is <em>not</em> the criterion that
              governs it. 1.4.11 covers the visual information needed to identify a user interface
              component and its state. The controls inside the panel are that; the panel is a
              surface they sit on, and each control carries its own conformance. Material 3,
              Carbon, Polaris and Atlassian all ship this surface the same way.
            </p>
            <p>
              The measurement is recorded rather than ticked because calling it a failure would
              sit it beside real failures and devalue both. What the border does have to survive
              is Windows High Contrast, which discards <code>box-shadow</code>: it is a solid
              border rather than a shadow alone, so the panel keeps a definite edge in
              forced-colors mode when the elevation is gone.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-width">
            <h2 id="cdp-width" className="cdp__h2">
              Width
            </h2>
            <p>
              The panel hugs its content between a 12rem floor and a 22rem ceiling, so a two-word
              menu is not stretched and a paragraph is not reduced to a column. Set{" "}
              <code>matchTriggerWidth</code> only when the panel belongs to a single field — a
              picker under an input reads as part of it. A panel of arbitrary content should size
              to what it holds.
            </p>
          </section>
        </>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            Example
          </h2>
          <CodeBlock>{`import { Popover, Button } from "@mosje/design-system";

<Popover
  label="Processing time"
  content="Counted in working days, excluding gazetted holidays."
>
  <Button appearance="outlined">Processing time</Button>
</Popover>`}</CodeBlock>
          <p>
            Pass a function when the panel has its own confirm or cancel — it receives{" "}
            <code>close</code>, which shuts the panel and returns focus to the trigger.
          </p>
          <CodeBlock>{`<Popover
  label="Filter applications"
  content={({ close }) => (
    <>
      <Select label="Status" options={STATUSES} />
      <Button onClick={close}>Apply</Button>
    </>
  )}
>
  <Button appearance="outlined">Filter</Button>
</Popover>`}</CodeBlock>
          <p>
            Pass <code>open</code> and <code>onOpenChange</code> to drive it from outside — for
            instance to close every row&apos;s panel when a table reloads.
          </p>
          <p>
            The trigger is cloned, so its ref is <em>merged</em> rather than replaced and any
            <code>onClick</code> it already carries runs first. A trigger that calls{" "}
            <code>preventDefault</code> stops the panel from opening, which is how a guard on a
            disabled row is written.
          </p>
        </section>
      }
      accessibility={
        <>
          <section className="cdp__section" aria-labelledby="cdp-nonmodal">
            <h2 id="cdp-nonmodal" className="cdp__h2">
              Non-modal, and Why That Decides the Keyboard Model
            </h2>
            <p>
              A modal traps focus because nothing behind it may be used. A popover must not, because
              everything behind it may. That single decision produces the rest of the behaviour:
              Tab past the last control leaves the panel and closes it, Escape closes and returns
              focus to the trigger, and pointing at something else on the page closes it without
              moving focus — because focus already belongs to whatever was clicked.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-named">
            <h2 id="cdp-named" className="cdp__h2">
              The Label Is Required
            </h2>
            <p>
              <code>label</code> is not optional. A dialog with no accessible name is announced as
              &ldquo;dialog&rdquo; and tells a screen-reader user nothing about what has just
              opened or why focus has moved. Making it a required prop means no panel can reach a
              citizen unnamed.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-touch">
            <h2 id="cdp-touch" className="cdp__h2">
              Touch
            </h2>
            <p>
              Because it opens on click rather than hover, this component works on a touch screen,
              which is the other half of why a tooltip cannot be used for content with controls in
              it. The panel closes on a pointer-down anywhere outside itself and its trigger.
            </p>
          </section>
        </>
      }
    />
  );
}
