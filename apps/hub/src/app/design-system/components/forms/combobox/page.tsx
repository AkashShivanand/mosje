import type { Metadata } from "next";
import * as React from "react";

import { CodeBlock, ComponentDocPage, type A11yItem } from "@/components/design-system/docs-kit";

import { ComboboxSpecimens } from "./specimen";

export const metadata: Metadata = {
  title: "Combobox — Design System",
  description:
    "A text field that filters a long list as the reader types, then commits one of its options — or, with `multiple`, several.",
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
  {
    criterion: "4.1.2 Name, Role, Value — multiple",
    level: "A",
    status: "verified",
    evidence:
      "With `multiple`, the listbox carries `aria-multiselectable=\"true\"` and every chosen row `aria-selected=\"true\"`; the tick beside a chosen row is `aria-hidden`, so an option is named “Ranchi Jharkhand”, not “check Ranchi”. Verified in a browser 2026-09-18.",
    description: "A screen reader says which rows are already chosen without the reader having to compare them.",
  },
  {
    criterion: "4.1.3 Status Messages — multiple",
    level: "AA",
    status: "verified",
    evidence:
      "A polite live region, mounted before it is needed, announces each change: “Nalanda added. 3 selected.”, “Nalanda removed. 2 selected.”, “All removed. 0 selected.” The input's description reads “2 selected: Bankura, Ranchi”. Verified 2026-09-18.",
    description: "Focus stays in the text box, so without an announcement a reader pressing Enter hears nothing at all.",
  },
  {
    criterion: "2.1.1 Keyboard — multiple",
    level: "A",
    status: "verified",
    evidence:
      "Enter adds the highlighted option and a second Enter removes it; Backspace in an empty box removes the last chip; the first Escape closes and the second clears the query while every chip is kept; each chip's remove button is in the tab order and returns focus to the input. A disabled option is refused. Verified 2026-09-18.",
    description: "Escape never clears the chosen options, because that would discard several decisions with one keystroke.",
  },
  {
    criterion: "1.3.1 Info and Relationships — field parts",
    level: "A",
    status: "verified",
    evidence:
      "The label, hint and status message are FormField's own parts, so the label is a real `<label for>` and the hint and message are joined into `aria-describedby` by the same expression every field uses. Measured in a mixed form row beside Input and Select on 2026-09-18: label 14/20, box top 28px, box 44px, radius 8px, hint at 80px and error at 108px, identical in all four states and at sizes sm, md, lg and xl.",
    description: "A combobox in a form reads, and lines up, like every other field in it.",
  },
  {
    criterion: "4.1.3 Status Messages — list states",
    level: "AA",
    status: "verified",
    evidence:
      "The count region announces “Searching” while `loading`, the `loadError` text on failure, “Type at least 2 characters to search” before `minQueryLength`, and the empty and no-match wording otherwise. At `maxSelected` a refused choice is announced: “You can choose up to 3. Remove one to choose Bhagalpur.” Verified 2026-09-18.",
    description: "Every state the list can be in is said, not only drawn.",
  },
  {
    criterion: "3.3.1 Error Identification — required multiple",
    level: "A",
    status: "verified",
    evidence:
      "A required multiple field with nothing chosen stops a native form submission, and the browser's focus is handed to the field's own text box. With `name`, the form posts one entry per chosen value. Verified by submitting a form on 2026-09-18.",
    description: "An empty text box is not an empty answer in this mode, so validation cannot rest on the text box.",
  },
];

export default function ComboboxPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Combobox"
      status="Beta"
      summary="A text field that narrows a long list as the reader types, then commits one of its options — or, with multiple, several, shown as removable chips inside the field. Reach for it when the list is longer than a person will scroll — seven hundred districts, every scheme in the estate, a beneficiary by name."
      figma={{ node: "combobox" }}
      specimen={<ComboboxSpecimens />}
      propsFrom="ComboboxProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "More options than a reader will scroll — roughly twenty and up.",
          "A list the reader already knows the answer in, and can type faster than they can find.",
          "Options that need a second line of context, such as a district's state.",
          "Several answers from one long list, such as every district an organisation works in — set multiple.",
          "A list too long to send to the page, such as villages or beneficiaries — search the server with onQueryChange.",
        ],
        avoid: [
          "Fewer than about twenty options — a Select needs no typing and every assistive technology knows it.",
          "A dashboard filter rather than a form answer — that is Filter Select.",
          "A value not in the list: this component deliberately refuses free text.",
          "Several answers from a short list — a Checkbox Group shows every option without typing.",
        ],
      }}
      related={[
        { label: "Select", href: "/design-system/components/forms/select", reason: "a short list in a form" },
        { label: "Filter Select", href: "/design-system/components/forms/filter-select", reason: "a dashboard filter, not a form answer" },
        { label: "Input", href: "/design-system/components/forms/input", reason: "free text with no list behind it" },
        { label: "Checkbox", href: "/design-system/components/forms/checkbox", reason: "several answers from a short list" },
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
          <h2 className="cdp__h2">Several Answers</h2>
          <p>
            Set <code>multiple</code>, and <code>value</code> becomes an array. TypeScript refuses a
            string array on a single field and a string on a multiple one.
          </p>
          <CodeBlock>{`const [chosen, setChosen] = React.useState<string[]>([]);

<Combobox
  multiple
  label="Districts of Operation"
  options={districts}
  value={chosen}                  // string[], in the order chosen
  onChange={setChosen}
  maxSelected={3}                 // the rest of the list is disabled at three
  maxVisibleChips={5}             // then "+N more"
  name="districts"                // posts one entry per chosen value
/>`}</CodeBlock>
          <h2 className="cdp__h2">Searching the Server</h2>
          <p>
            Where the list is too long to send to the page, search on each query and pass the
            results back as <code>options</code>. Chosen options keep their labels after the results
            change.
          </p>
          <CodeBlock>{`<Combobox
  multiple
  label="Beneficiaries"
  options={results}
  value={chosen}
  onChange={setChosen}
  filterOptions={false}           // the results already match the query
  minQueryLength={2}              // ask before searching
  onQueryChange={search}          // debounce in the caller
  loading={isSearching}
  loadError={failed ? "The list could not be loaded." : undefined}
  onRetry={retry}
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
          <h2 className="cdp__h2">Choosing Several</h2>
          <p>
            With <code>multiple</code>, chosen options become chips inside the field and the text
            box holds only the query. The list stays open after each choice. Enter adds the
            highlighted option, or removes it if it is already chosen; Backspace in an empty box
            removes the last chip; Escape closes the list, then clears the query. Escape never
            clears the chosen options, because that would discard several decisions with one
            keystroke.
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
