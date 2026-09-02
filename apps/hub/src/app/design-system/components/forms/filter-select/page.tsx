import type { Metadata } from "next";
import * as React from "react";

import { CodeBlock, ComponentDocPage, type A11yItem } from "@/components/design-system/docs-kit";

import { FilterSelectSpecimen } from "./specimen";

export const metadata: Metadata = {
  title: "Filter Select — Design System",
  description:
    "The compact dashboard filter, as a real listbox. Select remains the answer for a form field; this is for a filter row.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "2.1.1 Keyboard",
    level: "A",
    status: "verified",
    evidence: "filter-select.tsx — onKeyDown covers Down, Up, Home, End, Enter, Space, Escape, Tab and type-ahead.",
    description:
      "Down or Up opens the list and moves the active option, wrapping. Home and End jump. Enter or Space selects. Typing letters jumps to a label, resetting after a second.",
  },
  {
    criterion: "4.1.2 Name, Role, Value",
    level: "A",
    status: "verified",
    evidence:
      "filter-select.tsx — the trigger carries aria-haspopup=\"listbox\", aria-expanded and aria-controls; the popup is role=\"listbox\" and each option role=\"option\" with aria-selected.",
    description:
      "Focus moves to the LISTBOX and the active option is named by `aria-activedescendant`. Moving DOM focus onto each option instead announces a focus change rather than a selection.",
  },
  {
    criterion: "2.4.3 Focus Order",
    level: "A",
    status: "verified",
    evidence: "filter-select.tsx — close(true) on Escape returns focus to the trigger.",
    description:
      "Escape closes without selecting and returns focus to the trigger. A popup that unmounts while focus is inside it drops the reader to the document body.",
  },
  {
    criterion: "2.1.2 No Keyboard Trap",
    level: "A",
    status: "verified",
    evidence: "filter-select.tsx — Tab closes and is not prevented.",
    description: "Tab closes the list and moves on. A filter that traps is worse than one that closes.",
  },
  {
    criterion: "1.4.1 Use of Colour",
    level: "A",
    status: "verified",
    evidence: "filter-select.css — `.is-selected` sets font-weight; `aria-selected` carries it programmatically.",
    description:
      "The selected option is marked by weight as well as by ground, and by `aria-selected` for assistive technology. Active and selected are rendered differently, because they are different things.",
  },
  {
    criterion: "2.5.8 Target Size (Minimum)",
    level: "AA",
    status: "verified",
    evidence: "filter-select.css — trigger min-height 40px, option min-height 36px.",
    description: "Both clear 24×24 with room for a coarse pointer.",
  },
  {
    criterion: "1.4.11 Non-text Contrast",
    level: "AA",
    status: "verified",
    evidence:
      "Measured in a browser 2026-09-02: trigger and popup boundaries 3.06:1 against the page; the active row's left rule 4.64:1 against the popup. A forced-colors block gives the active row Highlight/HighlightText.",
    description:
      "The control's boundary clears 3:1. The ACTIVE row is marked by a rule as well as a tint, because every tint in the estate measures 1.1–1.4 against the popup and cannot carry the indicator alone — and the active row is the one thing a keyboard reader is following.",
  },
];

export default function FilterSelectPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Filter Select"
      status="New"
      summary="The compact dashboard filter, as a real listbox. It exists beside Select rather than replacing it: Select is a native control and remains the right answer for a field a citizen submits."
      figma={{ absent: "Not yet published in the Figma library." }}
      specimen={<FilterSelectSpecimen />}
      propsFrom="FilterSelectProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "A dashboard filter row, where the control narrows a view rather than answering a question.",
          "An option needs a hint beside it — a count, a code, a unit — which a native select cannot render.",
          "The control has to hold the same height and skin on iOS, where a native select cannot be styled.",
        ],
        avoid: [
          "It is a form field the citizen submits — use Select. A native control is the one every assistive technology and every mobile keyboard already knows, and that is worth more than a hint column.",
          "There are two or three mutually exclusive choices always visible — use the Segmented Control in Filter Bar.",
          "The reader needs to type to narrow a long list — that is a combobox, which this deliberately is not, and the estate does not have one yet.",
        ],
      }}
      related={[
        { label: "Select", href: "/design-system/components/forms/select", reason: "the native control, and the right one in a form" },
        { label: "Filter Bar", href: "/design-system/components/dashboard/filter-bar", reason: "the row these sit in" },
        { label: "Chip", href: "/design-system/components/forms/chip", reason: "for a filter that toggles rather than chooses" },
      ]}
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            Example
          </h2>
          <p>
            Always controlled — a filter&rsquo;s value belongs to the page that is being filtered,
            not to the control.
          </p>
          <CodeBlock>{`import { FilterSelect } from "@mosje/design-system";

const [district, setDistrict] = React.useState("all");

<FilterSelect
  label="District"
  value={district}
  onChange={setDistrict}
  options={[
    { value: "all", label: "All Districts", hint: "38" },
    { value: "patna", label: "Patna", hint: "1,204" },
    { value: "araria", label: "Araria", hint: "Not reported", disabled: true },
  ]}
/>`}</CodeBlock>
          <p>
            A district with nothing published stays in the list, disabled, with the reason in its
            hint. Removing it would leave a reader from Araria unable to tell whether their district
            is outside the scheme or simply unreported.
          </p>
        </section>
      }
      accessibility={
        <section className="cdp__section" aria-labelledby="cdp-keys">
          <h2 id="cdp-keys" className="cdp__h2">
            Keyboard
          </h2>
          <ul>
            <li><strong>Down / Up</strong> — open, then move the active option, wrapping.</li>
            <li><strong>Home / End</strong> — first and last.</li>
            <li><strong>Enter / Space</strong> — select the active option and close.</li>
            <li><strong>Escape</strong> — close without selecting, and return focus to the trigger.</li>
            <li><strong>Tab</strong> — close and move on.</li>
            <li><strong>a–z</strong> — jump to a label, resetting after a second&rsquo;s pause.</li>
          </ul>
          <p>
            Focus stays on the listbox and the active option is named by{" "}
            <code>aria-activedescendant</code>. Moving focus onto each option is the common mistake:
            it works with a mouse, and makes the list unreadable to a screen reader, which then
            announces a focus change where the reader expects a selection.
          </p>
        </section>
      }
    />
  );
}
