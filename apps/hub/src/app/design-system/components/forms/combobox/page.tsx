import type { Metadata } from "next";
import * as React from "react";

import { CodeBlock, ComponentDocPage, type A11yItem } from "@/components/design-system/docs-kit";

import { ComboboxSpecimen } from "./specimen";

export const metadata: Metadata = {
  title: "Combobox — Design System",
  description:
    "A text field that filters a long list as the reader types, then commits one of its options.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "4.1.2 Name, Role, Value",
    level: "A",
    status: "verified",
    evidence:
      "The input carries `role=\"combobox\"`, `aria-expanded`, `aria-controls` and `aria-autocomplete=\"list\"`; the highlighted row is named by `aria-activedescendant`. Verified in a browser 2026-09-02.",
    description: "A screen reader announces the field as editable, which is what tells a reader typing will do something.",
  },
  {
    criterion: "4.1.3 Status Messages",
    level: "AA",
    status: "verified",
    evidence:
      "A visually hidden `role=\"status\"` announces the remaining match count after each keystroke — measured as “2 matches” when typing “na” against seven districts.",
    description:
      "This is the reason to prefer a combobox over a plain text field: without it a reader who cannot see the list shrink is typing blind.",
  },
  {
    criterion: "2.1.1 Keyboard",
    level: "A",
    status: "verified",
    evidence:
      "Down/Up move the highlight and open the list, Home and End jump to the first and last SELECTABLE option, Enter chooses, Escape closes then clears, Tab closes and moves on. Verified including that End skips a disabled last entry.",
    description: "Focus never leaves the input, which is what separates a combobox from a listbox.",
  },
  {
    criterion: "3.3.1 Error Identification",
    level: "A",
    status: "verified",
    evidence:
      "On blur, a query matching no option reverts to the last chosen value rather than being kept. Verified: “Bankuraa” reverts to “Nadia”.",
    description:
      "A box reading “Bankuraa” over a form value of \"\" is how a district goes missing between the screen and the database.",
  },
  {
    criterion: "1.4.11 Non-text Contrast",
    level: "AA",
    status: "verified",
    evidence:
      "Field and popup boundaries are 3.06:1. The highlighted row carries an inset rule at 4.64:1 as well as a tint, because every tint in the estate measures 1.1–1.4 against the popup.",
    description: "The active row is the one thing a keyboard reader follows, so it cannot rest on a tint alone.",
  },
];

export default function ComboboxPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Combobox"
      status="Beta"
      summary="A text field that narrows a long list as the reader types, then commits one of its options. Reach for it when the list is longer than a person will scroll — seven hundred districts, every scheme in the estate, a beneficiary by name."
      figma={{ absent: "Not yet drawn in the Figma library. Authored in code first; the Figma counterpart is outstanding." }}
      specimen={<ComboboxSpecimen />}
      propsFrom="ComboboxProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "More options than a reader will scroll — roughly twenty and up.",
          "A list the reader already knows the answer in, and can type faster than they can find.",
          "Options that need a second line of context, such as a district's state.",
        ],
        avoid: [
          "Fewer than about twenty options — a Select needs no typing and every assistive technology knows it.",
          "A dashboard filter rather than a form answer — that is Filter Select.",
          "A value not in the list: this component deliberately refuses free text.",
        ],
      }}
      related={[
        { label: "Select", href: "/design-system/components/forms/select", reason: "a short list in a form" },
        { label: "Filter Select", href: "/design-system/components/forms/filter-select", reason: "a dashboard filter, not a form answer" },
        { label: "Input", href: "/design-system/components/forms/input", reason: "free text with no list behind it" },
      ]}
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            Example
          </h2>
          <CodeBlock>{`import { Combobox } from "@mosje/design-system";

const [district, setDistrict] = React.useState("");

<Combobox
  label="District"
  options={districts}          // { value, label, hint?, disabled? }
  value={district}
  onChange={setDistrict}
  hint="Type any part of the district or state name."
/>`}</CodeBlock>
        </section>
      }
      accessibility={
        <section className="cdp__section" aria-labelledby="cdp-vs">
          <h2 id="cdp-vs" className="cdp__h2">
            How It Differs From Filter Select
          </h2>
          <p>
            They look almost identical and are not the same control.{" "}
            <a href="/design-system/components/forms/filter-select">Filter Select</a> is a{" "}
            <strong>button</strong> that opens a listbox: focus moves into the list, and the button
            shows the current value. This is a real <strong>text input</strong> that filters — focus
            never leaves it, and <code>aria-activedescendant</code> points at the highlighted row.
          </p>
          <p>
            The distinction is not cosmetic. A screen reader announces a combobox as editable and
            reads the remaining match count after each keystroke, which is the entire point of
            typing. Use Filter Select for a dashboard filter with a handful of options; use this
            when the reader has to search.
          </p>
          <h2 className="cdp__h2">It Refuses Unmatched Text</h2>
          <p>
            On blur, a query matching no option reverts to the last chosen value. This is
            deliberate: a combobox that keeps <code>Bankuraa</code> in the box while the form holds{" "}
            <code>&quot;&quot;</code> is how a district goes missing between the screen and the
            database — and nothing on screen says anything is wrong.
          </p>
        </section>
      }
    />
  );
}
