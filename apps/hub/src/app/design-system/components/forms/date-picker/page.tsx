import type { Metadata } from "next";
import * as React from "react";

import { CodeBlock, ComponentDocPage, type A11yItem } from "@/components/design-system/docs-kit";

import { DatePickerSpecimen } from "./specimen";

export const metadata: Metadata = {
  title: "Date Picker — Design System",
  description:
    "A typed date field in dd/mm/yyyy, with a calendar as the second way in. The text input is the primary control.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "1.3.5 Identify Input Purpose",
    level: "AA",
    status: "verified",
    evidence:
      "The expected order is stated in the field itself as the placeholder `dd/mm/yyyy`, not only in a hint that can be scrolled past.",
    description: "A citizen must know the order before typing, not after being told the date was wrong.",
  },
  {
    criterion: "2.1.1 Keyboard",
    level: "A",
    status: "verified",
    evidence:
      "Verified in a browser 2026-09-02: ArrowDown opens the grid with focus on the selected day, ArrowRight moves a day, PageDown moves a month, Enter chooses and closes, Escape closes and returns focus to the field.",
    description: "The calendar is a roving grid — exactly one day is tabbable, so Tab leaves rather than walking 42 buttons.",
  },
  {
    criterion: "2.4.3 Focus Order",
    level: "A",
    status: "verified",
    evidence:
      "Escape and Enter both restore focus to the text input. A dialog that unmounts with focus inside it drops the reader to `<body>`.",
    description: "Measured, not assumed — the return path is the half that is usually skipped.",
  },
  {
    criterion: "2.5.8 Target Size (Minimum)",
    level: "AA",
    status: "verified",
    evidence: "Each day is 32×32 and the calendar and month buttons are 32×32, all clearing the 24×24 floor.",
    description: "A calendar grid is the densest control on any government form.",
  },
  {
    criterion: "1.4.11 Non-text Contrast",
    level: "AA",
    status: "verified",
    evidence:
      "The field boundary is `border-neutral-bolder-default` at 3.06:1. The subtle rung measures 1.66:1 and fails — the same correction Filter Select needed.",
    description: "A control whose edge cannot be seen is a control that has not been offered.",
  },
  {
    criterion: "1.4.1 Use of Colour",
    level: "A",
    status: "verified",
    evidence:
      "An unavailable day is struck through as well as dimmed, so “cannot be chosen” does not rely on a contrast difference that reads as “less important”.",
    description: "Dimming alone says the wrong thing.",
  },
];

export default function DatePickerPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Date Picker"
      status="Beta"
      summary="A date field a citizen types into, in dd/mm/yyyy, with a calendar as the second way in. The text input is the primary control — a calendar-first picker asks a pensioner to page back four hundred and eighty months to reach a date of birth."
      figma={{ absent: "Not yet drawn in the Figma library. Authored in code first; the Figma counterpart is outstanding." }}
      specimen={<DatePickerSpecimen />}
      propsFrom="DatePickerProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "Any date a citizen knows and can type — a date of birth, a date of marriage, the date on a certificate.",
          "A date inside a published window, bounded with `min` and `max`.",
          "A date an officer picks relative to today, where the calendar earns its place.",
        ],
        avoid: [
          "A month or a year on its own — that is two Selects, and a calendar is the wrong shape for it.",
          "A range — render two fields and validate the pair, so each end can be typed.",
          "`<input type=\"date\">` as a substitute: see below.",
        ],
      }}
      related={[
        { label: "Input", href: "/design-system/components/forms/input", reason: "any other single-line value" },
        { label: "Form Field", href: "/design-system/components/forms/form-field", reason: "label, hint and error around a control" },
        { label: "Combobox", href: "/design-system/components/forms/combobox", reason: "choosing from a long list rather than a date" },
      ]}
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            Example
          </h2>
          <CodeBlock>{`import { DatePicker } from "@mosje/design-system";

const [dob, setDob] = React.useState("");   // ISO yyyy-mm-dd

<DatePicker
  label="Date of Birth"
  value={dob}
  onChange={setDob}
  hint="As printed on your Aadhaar."
  required
/>`}</CodeBlock>
          <p>
            <code>value</code> is always ISO <code>yyyy-mm-dd</code> — the canonical form a form
            submits and a database stores. <code>dd/mm/yyyy</code> is only what the citizen reads
            and types.
          </p>
        </section>
      }
      accessibility={
        <section className="cdp__section" aria-labelledby="cdp-why">
          <h2 id="cdp-why" className="cdp__h2">
            Why Not <code>&lt;input type=&quot;date&quot;&gt;</code>
          </h2>
          <p>
            The native control is tempting and is rejected deliberately. Its rendering, its
            keyboard model and — decisively — its date <strong>order</strong> belong to the browser
            and the operating system. The same government form shows <code>mm/dd/yyyy</code> to one
            citizen and <code>dd/mm/yyyy</code> to the next, with no way to correct it.
          </p>
          <p>
            A form that cannot state its own date order will collect wrong dates, and on this estate
            a wrong date of birth is an eligibility decision.
          </p>
          <h2 className="cdp__h2">Why Typing Comes First</h2>
          <p>
            A date of birth is roughly four hundred and eighty months in the past. Every
            calendar-first picker asks the citizen to page there. Typing{" "}
            <code>14/08/1962</code> takes seconds, so the field accepts it directly and the calendar
            is kept for the case it is genuinely good at — a date near today.
          </p>
          <p>
            The value commits on blur rather than on each keystroke, so a half-typed date is never
            read as a wrong one. An impossible date is rejected by round-trip:{" "}
            <code>31/02/2026</code> passes every field-by-field bounds check and is not a date, so
            the component builds it and asks whether the month survived.
          </p>
        </section>
      }
    />
  );
}
