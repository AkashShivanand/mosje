import type { Metadata } from "next";
import * as React from "react";
import { CodeBlock, ComponentDocPage, type A11yItem } from "@/components/design-system/docs-kit";
import { RangePlayground } from "./range-playground";

export const metadata: Metadata = {
  title: "Date Range Picker — Design System",
  description:
    "A period — the two dates a report, a filter or a sanction window runs between. Two Date Pickers in a named group, with the presets a dashboard actually uses.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    status: "verified",
    evidence:
      "Read from the rendered DOM on this page: the control is a <fieldset> with a <legend> carrying the group's name, and the presets sit in their own role=\"group\" named after it.",
    description: "The two fields are grouped, and the group is named in the markup.",
  },
  {
    criterion: "4.1.2 Name, Role, Value",
    level: "A",
    status: "verified",
    evidence:
      'Read from the accessibility tree: each field is named "From — Period" / "To — Period" rather than "From" and "To", and each preset is a button carrying aria-pressed reflecting whether it matches the current range.',
    description: "Both ends and every preset carry a name that is unique on the page.",
  },
  {
    criterion: "4.1.3 Status Messages",
    level: "AA",
    status: "verified",
    evidence:
      'Read from the DOM: the ordering message renders with role="alert" and the group\'s aria-describedby points at it, so an inverted range is announced without the reader having to look for it.',
    description: "An inverted period is announced, not just tinted.",
  },
  {
    criterion: "3.3.1 Error Identification",
    level: "A",
    status: "verified",
    evidence:
      "With from=2026-09-30 and to=2026-09-01 the message reads \"The end of the period is before its start. Check both dates.\" and both fields carry aria-invalid. Neither date is altered.",
    description: "The problem is described in words, and nothing is silently corrected.",
  },
];

export default function DateRangePickerPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Date Range Picker"
      status="Stable"
      summary="A period — the two dates a report, a filter or a sanction window runs between. It is two Date Pickers in a named group plus the presets a dashboard actually uses, never a second calendar implementation."
      figma={{ absent: "No master in the SAMAVESH library yet — the gap, and the order the seventeen are being closed in, are recorded in docs/audit/design-system-completeness-2026-09-06.md." }}
      specimen={<RangePlayground />}
      propsFrom="DateRangePickerProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "A dashboard or report is filtered by period.",
          "A record has a start and an end — a sanction window, a scheme's application window.",
        ],
        avoid: [
          "There is only one date. That is Date Picker, which this is built from.",
          "The period is one of a fixed handful and never typed — then a set of Chips or a Select is smaller and quicker.",
        ],
      }}
      related={[
        { label: "Date Picker", href: "/design-system/components/forms/date-picker", reason: "the single date this is built from" },
        { label: "Time Picker", href: "/design-system/components/forms/time-picker", reason: "for a time rather than a date" },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-swap">
            <h2 id="cdp-swap" className="cdp__h2">An Inverted Period Is Reported, Never Swapped</h2>
            <p>
              If a reader types 30 September to 1 September, the component says so and leaves both
              dates alone. Swapping them quietly is the usual behaviour and it is wrong here: the
              report then runs over a period nobody asked for, and the reader has no way to know
              that what they typed is not what was used.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-bound">
            <h2 id="cdp-bound" className="cdp__h2">Each End Bounds the Other</h2>
            <p>
              Once the start is set, the end&rsquo;s calendar cannot offer a date before it, and the
              other way round. So the inverted state is reachable only by typing — which is exactly
              when a message is the right answer, and a calendar restriction is not available.
            </p>
            <CodeBlock>{`import { DateRangePicker } from "@mosje/design-system";

<DateRangePicker
  label="Period"
  value={range}                 // { from: "2026-07-01", to: "2026-09-30" }
  onChange={setRange}
  presets={[
    { id: "fy", label: "This financial year", from: "2026-04-01", to: "2027-03-31" },
  ]}
/>`}</CodeBlock>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-preset">
            <h2 id="cdp-preset" className="cdp__h2">A Preset Is a Button, Not a Dropdown</h2>
            <p>
              &ldquo;Last 30 days&rdquo; is one press. Behind a select it is three, on the control a
              dashboard&rsquo;s reader touches most often. The preset that matches the current range
              carries <code>aria-pressed</code>, so it is marked by more than a tint.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-name">
            <h2 id="cdp-name" className="cdp__h2">Both Ends Carry the Group&rsquo;s Name</h2>
            <p>
              The fields are named &ldquo;From — Period&rdquo; and &ldquo;To — Period&rdquo;, not
              &ldquo;From&rdquo; and &ldquo;To&rdquo;. A dashboard with a period filter and a
              sanction window on one screen otherwise offers four fields with two names between
              them, which is unusable for anyone navigating by name.
            </p>
          </section>
        </>
      }
    />
  );
}
