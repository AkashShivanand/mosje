import type { Metadata } from "next";
import * as React from "react";

import { ComponentDocPage, type A11yItem } from "@/components/design-system/docs-kit";

import { Specimen } from "./specimen";

export const metadata: Metadata = {
  title: "Segmented Control — Design System",
  description: "A single-select toggle for a dashboard period or view.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "4.1.2 Name, Role, Value",
    level: "A",
    status: "verified",
    evidence: "It renders an ARIA radiogroup, so a screen reader announces the set, the selected member and the count — not a row of unrelated buttons.",
    description: "A segmented control is a radio group wearing different clothes.",
  },
  {
    criterion: "2.1.1 Keyboard",
    level: "A",
    status: "verified",
    evidence:
      "Measured with Playwright on this page's specimen, 16 Sep 2026: the group holds ONE tab stop (tabIndex 0 on the selected option, −1 on the rest); ArrowRight moved selection and focus to the next option, End to the last, Home to the first, and ArrowLeft from the first wrapped to the last. aria-checked followed focus each time.",
    description: "The WAI-ARIA radio-group keyboard pattern: one tab stop, arrows to move, Home and End for the ends, selection following focus.",
  },
];

export default function Page(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Segmented Control"
      status="Stable"
      summary="A single-select toggle, commonly a dashboard period switch — financial year, quarter, month. It renders an ARIA radiogroup rather than a row of buttons, because that is what it actually is."
      figma={{ absent: "Part of the filter-bar set; no separate node." }}
      specimen={<Specimen />}
      propsFrom="SegmentedControlProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "Two to about five mutually exclusive views of the same data.",
          "A period switch above a chart.",
        ],
        avoid: [
          "More than about five options — that is a Select or a Filter Select.",
          "Options that are not mutually exclusive: those are checkboxes or chips.",
          "Actions rather than views — a segmented control selects, it does not do.",
        ],
      }}
      accessibility={
        <section className="cdp__section" aria-labelledby="cdp-keys">
          <h2 id="cdp-keys" className="cdp__h2">
            Keys
          </h2>
          <ul>
            <li>
              <strong>Tab</strong> — into the group and out again. The group is one tab stop: the
              selected option holds it, and where nothing is selected yet the first option does.
            </li>
            <li>
              <strong>Left / Up</strong> and <strong>Right / Down</strong> — move to the previous or
              next option and select it. The ends wrap.
            </li>
            <li>
              <strong>Home</strong> / <strong>End</strong> — the first and the last option.
            </li>
          </ul>
          <p>
            Selection follows focus, as the pattern prescribes for a radio group: the reader is
            choosing rather than browsing. It matters most where the control is a decision — an
            officer giving twenty document verdicts should never have to reach for the mouse, and
            before this each option was its own tab stop.
          </p>
        </section>
      }
      related={[
        { label: "Radio", href: "/design-system/components/forms/radio", reason: "the same semantics in a form" },
        { label: "Filter Select", href: "/design-system/components/forms/filter-select", reason: "more options than fit on a row" },
      ]}
    />
  );
}
