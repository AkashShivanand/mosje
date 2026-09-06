import type { Metadata } from "next";
import * as React from "react";

import {
  CodeBlock,
  ComponentDocPage,
  type A11yItem,
} from "@/components/design-system/docs-kit";

import { TimeSlotPlayground } from "./time-slot-playground";

export const metadata: Metadata = {
  title: "Time Slot — Design System",
  description:
    "A grid of bookable windows, built from real radio inputs so the keyboard model, the single-choice constraint and form submission are the browser's own.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    status: "verified",
    evidence:
      "The set is a <fieldset> with a <legend>, and every slot is an <input type=\"radio\"> sharing one name. Read from the rendered DOM: the group is announced with its legend and each slot with its position in the set.",
    description:
      "The grid is a real radio group, so it is announced as one choice among many rather than as loose buttons.",
  },
  {
    criterion: "2.1.1 Keyboard",
    level: "A",
    status: "verified",
    evidence:
      "The arrow keys move between slots and select as they go — the browser's own radio-group behaviour, not code here. Measured with real key presses: ArrowRight moved the selection from 10:00 to 11:00, stepping over the full 10:30 slot.",
    description:
      "Arrow keys move and select; unavailable slots are stepped over.",
  },
  {
    criterion: "2.5.8 Target Size (Minimum)",
    level: "AA",
    status: "verified",
    evidence:
      "Each slot binds --sa-control-height-lg (3rem = 48px) as a min-height and fills its grid column. Measured with getBoundingClientRect on this page: slots exceed 48px on both axes, against the 24×24 minimum.",
    description:
      "Slots are 48px tall — a citizen taps these on a phone, often outdoors, so 24 is the floor rather than the goal.",
  },
  {
    criterion: "1.4.1 Use of Color",
    level: "A",
    status: "verified",
    evidence:
      "A chosen slot carries a heavier border and a semibold label as well as its fill, and an unavailable one carries a dashed border and the word 'Full' or a reason. Read from computed styles: border-style and font-weight both differ, not only background-color.",
    description:
      "Chosen and unavailable are each marked by shape and by words, not by colour alone.",
  },
];

export default function TimeSlotPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Time Slot"
      status="Stable"
      summary="A grid of bookable windows — the shape behind a daily programme, an event, and any appointment a citizen has to choose. It is a radio group built from real radios, so the keyboard model and the single-choice constraint are the browser's."
      figma={{ absent: "Master pending in the SAMAVESH library — tracked on the component record." }}
      specimen={<TimeSlotPlayground />}
      propsFrom="TimeSlotProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "A citizen books an appointment, a visit or a counselling session at a stated time.",
          "A day's programme is offered as windows the reader picks from.",
          "Capacity is published and the reader should see what is left before choosing.",
        ],
        avoid: [
          "The reader types an arbitrary time — that is a time field, not a grid of offers.",
          "There are two options. Two windows are a Radio group with plain labels.",
          "The windows run to dozens across many days — page or filter by day first, or the grid becomes a wall.",
        ],
      }}
      related={[
        {
          label: "Radio",
          href: "/design-system/components/forms/radio",
          reason: "for a small set of named choices with no grid",
        },
        {
          label: "Date Picker",
          href: "/design-system/components/forms/date-picker",
          reason: "for choosing the day these windows belong to",
        },
        {
          label: "Empty State",
          href: "/design-system/components/feedback/empty-state",
          reason: "for a day with no windows on offer at all",
        },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-radios">
            <h2 id="cdp-radios" className="cdp__h2">
              Built From Real Radios
            </h2>
            <p>
              Each slot is an <code>&lt;input type=&quot;radio&quot;&gt;</code> visually replaced by
              its label. That gives the arrow keys, the single-choice constraint, submission with
              the form and the &ldquo;3 of 12&rdquo; announcement without any of it being written
              here. A grid of buttons carrying a <code>selected</code> class has none of it, and
              every one of those behaviours then has to be rebuilt and kept working.
            </p>
            <p>
              The input is hidden by opacity, never by <code>display: none</code> — which would
              remove it from the tab order and from the accessibility tree and leave a grid nobody
              can operate.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-full">
            <h2 id="cdp-full" className="cdp__h2">
              A Full Slot Stays on the Page
            </h2>
            <p>
              &ldquo;10:30 is taken&rdquo; and &ldquo;there is no 10:30&rdquo; are different facts,
              and a citizen deciding when to travel needs the first one. A full slot renders with a
              dashed edge and the word describing why, rather than disappearing and leaving the
              reader to notice a gap.
            </p>
            <p>
              Set <code>remaining: 0</code> for full, or <code>disabled</code> with an{" "}
              <code>unavailableReason</code> for anything else — a holiday, a closed centre. Omit{" "}
              <code>remaining</code> entirely where the centre does not publish places left:
              inventing &ldquo;6 left&rdquo; would put a number on a government page with no source
              behind it.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-disabled">
            <h2 id="cdp-disabled" className="cdp__h2">
              Why This Uses <code>disabled</code> and Menu Does Not
            </h2>
            <p>
              <code>Menu</code> deliberately avoids the native <code>disabled</code> attribute,
              because it removes an item from the accessibility tree and a screen-reader user then
              never learns the action exists. This component does the opposite, for a reason that
              only applies here: <strong>a radio group selects on arrow</strong>. An{" "}
              <code>aria-disabled</code> slot would be chosen the moment an arrow key landed on it,
              which is worse than being skipped. <code>disabled</code> is what makes the arrow keys
              step over it, and the slot&apos;s label — including its reason — stays on the page and
              in the accessibility tree either way.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-grid">
            <h2 id="cdp-grid" className="cdp__h2">
              The Grid Reflows Itself
            </h2>
            <p>
              Columns are <code>auto-fill</code> at a minimum of 7.5rem, so the grid goes from six
              across on a desktop to two on a phone with no breakpoint of its own. Slots are 48px
              tall because a citizen taps these on a phone, often outdoors — WCAG 2.2 §2.5.8&apos;s
              24×24 is the floor, not the goal.
            </p>
          </section>
        </>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            Example
          </h2>
          <CodeBlock>{`import { TimeSlot } from "@mosje/design-system";

<TimeSlot
  label="Appointment time"
  description="Choose a window. You may reschedule once, up to 24 hours before."
  name="appointment"
  value={slot}
  onChange={setSlot}
  groups={[
    {
      label: "Morning",
      slots: [
        { id: "0930", label: "09:30 – 10:00", remaining: 4 },
        { id: "1000", label: "10:00 – 10:30", remaining: 1 },
        { id: "1030", label: "10:30 – 11:00", remaining: 0 },
      ],
    },
  ]}
/>`}</CodeBlock>
          <p>
            <code>name</code> is the form field name. Set it where the choice submits with a form —
            the component generates one otherwise, which is fine for a client-side booking and wrong
            for a server-rendered post.
          </p>
        </section>
      }
      accessibility={
        <section className="cdp__section" aria-labelledby="cdp-named">
          <h2 id="cdp-named" className="cdp__h2">
            The Set Needs a Name
          </h2>
          <p>
            <code>label</code> is required and becomes the fieldset&apos;s legend. A grid of times
            with no name tells a screen-reader user twenty numbers and not what they are for — and
            on a page that also offers a date and a centre, &ldquo;10:00 to 10:30, radio button, 2
            of 5&rdquo; is not enough to answer with.
          </p>
        </section>
      }
    />
  );
}
