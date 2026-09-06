import type { Metadata } from "next";
import * as React from "react";

import {
  CodeBlock,
  ComponentDocPage,
  type A11yItem,
} from "@/components/design-system/docs-kit";

import { TimePickerPlayground } from "./time-picker-playground";

export const metadata: Metadata = {
  title: "Time Picker — Design System",
  description:
    "A typed 24-hour time field with a list of times as the second way in, rejecting input type=time because its 12- or 24-hour display belongs to the browser.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "4.1.2 Name, Role, Value",
    level: "A",
    status: "verified",
    evidence:
      'Read from the rendered DOM: the input carries role="combobox", aria-haspopup="listbox", aria-expanded reflecting state, aria-controls while open, and aria-activedescendant naming the option the arrows are on. The list is a <ul role="listbox"> of <li role="option"> with aria-selected on the field\'s current value.',
    description:
      "The field is a combobox that reports which option is active without moving focus.",
  },
  {
    criterion: "2.1.1 Keyboard",
    level: "A",
    status: "verified",
    evidence:
      "Measured with real key presses: ArrowDown on the closed field opened the list, further arrows moved the active option, Home and End reached the ends, Enter committed the active time into the field, and Escape closed the list leaving the typed text untouched.",
    description:
      "The whole control is operable from the keyboard, and typing keeps working while the list is open.",
  },
  {
    criterion: "2.4.3 Focus Order",
    level: "A",
    status: "verified",
    evidence:
      "Focus never leaves the input — the list is presentational and takes no tabIndex. Confirmed by reading document.activeElement while the list was open and after Escape: the input in both cases.",
    description:
      "Focus stays in the field throughout, so closing the list cannot strand a keyboard reader.",
  },
  {
    criterion: "3.3.2 Labels or Instructions",
    level: "A",
    status: "verified",
    evidence:
      "`label` is required and rendered as a real <label for>; the hint is associated by aria-describedby. Read from the DOM: the input's accessible name is the label and its description is the hint.",
    description:
      "The field always has a visible label, and the expected format is stated rather than implied.",
  },
];

export default function TimePickerPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Time Picker"
      status="Stable"
      summary="A typed 24-hour time field, with a list of times as the second way in. The value is always HH:MM, and the format is stated rather than left to the browser."
      figma={{ absent: "Master pending in the SAMAVESH library — tracked on the component record." }}
      specimen={<TimePickerPlayground />}
      propsFrom="TimePickerProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "A citizen or an officer records a time — when an incident occurred, when a visit is booked, when a centre closes.",
          "Any minute may be entered, and a list of common times would only be a shortcut.",
          "The value has to be stored and compared, so it must be canonical rather than however the browser rendered it.",
        ],
        avoid: [
          "The times are a fixed, bookable set with capacity — use Time Slot, which is a radio group and shows what is left.",
          "The value is a duration rather than a time of day — that is a number field with a unit.",
          "Only the hour matters — offer hours as a Select; a minute field the reader must fill with 00 is a field asking for nothing.",
        ],
      }}
      related={[
        {
          label: "Time Slot",
          href: "/design-system/components/forms/time-slot",
          reason: "when the times are a fixed set with capacity",
        },
        {
          label: "Date Picker",
          href: "/design-system/components/forms/date-picker",
          reason: "for the day this time belongs to, on the same reasoning",
        },
        {
          label: "Combobox",
          href: "/design-system/components/forms/combobox",
          reason: "when the value must be one of a list rather than anything typed",
        },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-native">
            <h2 id="cdp-native" className="cdp__h2">
              Why Not <code>&lt;input type=&quot;time&quot;&gt;</code>
            </h2>
            <p>
              For the same reason <a href="/design-system/components/forms/date-picker">Date Picker</a>{" "}
              rejects <code>&lt;input type=&quot;date&quot;&gt;</code>. The native control&apos;s
              rendering — and critically, whether it shows a 12-hour or a 24-hour clock — belongs to
              the browser and the operating system. The same government form would show
              &ldquo;2:00 PM&rdquo; to one citizen and &ldquo;14:00&rdquo; to the next, with no way
              to correct it.
            </p>
            <p>
              Every published departmental schedule on this estate is written in 24-hour form, and a
              form that cannot state its own time format will collect wrong times. So the field is
              canonical: the value is always <code>HH:MM</code>, and the hint says so.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-forgiving">
            <h2 id="cdp-forgiving" className="cdp__h2">
              Strict About the Value, Forgiving About the Typing
            </h2>
            <p>
              Every unambiguous form commits as <code>09:05</code> on blur —{" "}
              <code>9:05</code>, <code>09.05</code>, <code>0905</code>. Committing on blur rather
              than on keystroke is what makes that safe: a half-typed time is never read as a wrong
              one, and the citizen is not punished for punctuation.
            </p>
            <p>
              <strong><code>9:5</code> is refused, not guessed.</strong> It could mean 09:05 or
              09:50, and a form that quietly picks one records the wrong time without telling
              anybody — which is worse than asking again. Being forgiving about punctuation and
              strict about ambiguity are different things, and only the first is a kindness.
            </p>
            <p>
              Text that is not a time puts the last good value back rather than leaving characters
              in the field that will fail on submit. An empty field clears the value.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-bounds">
            <h2 id="cdp-bounds" className="cdp__h2">
              Bounds Govern the List, Not the Field
            </h2>
            <p>
              <code>min</code> and <code>max</code> decide which times the list offers. The field
              still accepts any minute, deliberately: a citizen reporting when something happened is
              not choosing from an offer, and refusing 03:14 because the office opens at 09:30 would
              make the form unable to record the thing it was asked to record. Where the time really
              must be within bounds, validate on submit and say so.
            </p>
          </section>
        </>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            Example
          </h2>
          <CodeBlock>{`import { TimePicker } from "@mosje/design-system";

<TimePicker
  label="Appointment time"
  hint="24-hour clock, as hh:mm — for example 14:30."
  min="09:30"
  max="17:30"
  step={15}
  value={time}
  onChange={setTime}
/>`}</CodeBlock>
          <p>
            <code>step</code> governs the shortcut only — fifteen-minute options in the list, any
            minute in the field. The value handed to <code>onChange</code> is always canonical{" "}
            <code>HH:MM</code>, or an empty string when the field is cleared.
          </p>
        </section>
      }
      accessibility={
        <>
          <section className="cdp__section" aria-labelledby="cdp-focus">
            <h2 id="cdp-focus" className="cdp__h2">
              Focus Never Leaves the Field
            </h2>
            <p>
              The list is presentational: it takes no <code>tabIndex</code> and never receives
              focus. The arrows move an <code>aria-activedescendant</code> marker while the input
              keeps focus, which is what lets a citizen keep typing while the list is open — the
              point of a field whose list is only a shortcut.
            </p>
            <p>
              It also removes a whole class of defect: a listbox that unmounts while focus is inside
              it drops a keyboard reader to <code>&lt;body&gt;</code>. Focus that never moved cannot
              be stranded.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-space">
            <h2 id="cdp-space" className="cdp__h2">
              Enter Chooses; Space Does Not
            </h2>
            <p>
              In most listboxes Space selects. Here it must not: this is a field someone is typing
              into, and a space is a printable character. Stealing it would make the space bar
              unusable whenever the list happened to be open — a defect the reader would experience
              as the keyboard intermittently breaking.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-two-states">
            <h2 id="cdp-two-states" className="cdp__h2">
              Active and Selected Are Different
            </h2>
            <p>
              The <strong>active</strong> option is where the arrow keys are; the{" "}
              <strong>selected</strong> option is the field&apos;s current value. They are drawn
              differently — a fill for one, a tick and heavier ink for the other — because a list
              that marks only one of them leaves a keyboard reader unable to tell what pressing
              Enter would do.
            </p>
          </section>
        </>
      }
    />
  );
}
