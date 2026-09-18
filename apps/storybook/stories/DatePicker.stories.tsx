import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

import { Combobox, DatePicker } from "@mosje/design-system";

/**
 * @covers DatePicker, Combobox
 *
 * **DatePicker's text input is the primary control, and that ordering is the
 * design.** A calendar-first picker asks a pensioner to page back four hundred
 * and eighty months to reach a date of birth; typing `14/08/1962` takes seconds.
 * The calendar is there for "next Tuesday", which is what it is good at.
 *
 * `<input type="date">` was rejected: its rendering, keyboard model and date
 * ORDER belong to the browser and the OS, so one government form would show
 * `mm/dd/yyyy` to one citizen and `dd/mm/yyyy` to the next. A form that cannot
 * state its own date order will collect wrong dates. `min` and `max` bound both
 * the typing and the grid; `required`, `disabled`, `hint` and `error` behave as
 * they do on every other field, and `id` and `className` are passed through.
 *
 * **Combobox is for a list longer than a person will scroll** — seven hundred
 * districts, every scheme, a beneficiary by name. Below roughly twenty options a
 * `Select` is better. It differs from `FilterSelect` in a way that is not
 * cosmetic: `FilterSelect` is a button that opens a listbox and moves focus into
 * it, while this is a real text input whose focus never leaves, with
 * `aria-activedescendant` pointing at the highlighted row. A screen reader
 * announces it as editable and reads the remaining match count after each
 * keystroke, which is the entire point of typing.
 *
 * It never silently accepts unmatched text: on blur a query matching nothing
 * reverts to the last chosen value, because a box reading "Bankuraa" over a form
 * value of "" is how a district goes missing between the screen and the
 * database. `noMatchLabel` words the filtered-to-nothing case, `placeholder` the
 * empty one.
 *
 * **`invalid`** is a legacy alias that sets the error state without a message. It exists only
 * so that spreading `FormField`'s render-prop object onto this component degrades instead of
 * breaking — `FormField` hands over `invalid`, this component asks for `error`. Prefer `error`:
 * a field marked wrong with nothing said about it tells the reader only that they are stuck.
 */
const meta = {
  title: "Forms/DatePicker",
  component: DatePicker,
  parameters: { layout: "padded" },
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { label: "Date of Birth", value: "", onChange: () => {} },
  render: function Controlled(args) {
    const [v, setV] = React.useState("1962-08-14");
    return <DatePicker {...args} value={v} onChange={setV} hint="As printed on your Aadhaar." />;
  },
};

/** Bounded: an application window that closed, and one that has not opened. */
export const WithBounds: Story = {
  args: { label: "Date of Application", value: "", onChange: () => {} },
  render: function Bounded(args) {
    const [v, setV] = React.useState("2026-09-10");
    return (
      <DatePicker
        {...args}
        value={v}
        onChange={setV}
        min="2026-09-01"
        max="2026-09-30"
        hint="Applications are accepted through September 2026 only."
      />
    );
  },
};

export const Required: Story = {
  args: { label: "Date of Birth", value: "", onChange: () => {}, required: true },
};

export const WithError: Story = {
  args: {
    label: "Date of Birth",
    value: "",
    onChange: () => {},
    error: "Enter the date as dd/mm/yyyy.",
  },
};

/**
 * What a reader types. `20092026`, `20-09-2026` and `20.09.2026` are all read as 20 September
 * 2026 and rewritten as `20/09/2026` on blur. Something that is not a date — `2092026`, which is
 * 2 or 20 September — stays in the field with "Enter the date as DD/MM/YYYY." It is never
 * cleared: that was usability audit UX-09, where an officer's typed date vanished without a word.
 */
export const TypedEntry: Story = {
  args: { label: "Visit Date", value: "", onChange: () => {} },
  render: function Typed(args) {
    const [v, setV] = React.useState("");
    return (
      <div style={{ display: "grid", gap: "var(--sa-stack-8)", maxWidth: "22rem" }}>
        <DatePicker {...args} value={v} onChange={setV} required />
        <output style={{ fontVariantNumeric: "tabular-nums" }}>value: {JSON.stringify(v)}</output>
      </div>
    );
  },
};

export const Disabled: Story = {
  args: { label: "Date of Birth", value: "1962-08-14", onChange: () => {}, disabled: true },
};

const DISTRICTS = [
  { value: "ba", label: "Bankura", hint: "West Bengal" },
  { value: "bh", label: "Bhagalpur", hint: "Bihar" },
  { value: "na", label: "Nalanda", hint: "Bihar" },
  { value: "nd", label: "Nadia", hint: "West Bengal" },
  { value: "pu", label: "Purulia", hint: "West Bengal" },
  { value: "ra", label: "Ranchi", hint: "Jharkhand" },
  { value: "so", label: "Sonbhadra", hint: "Uttar Pradesh", disabled: true },
];

/** Type "na" and the list narrows to Nalanda and Nadia, and says so out loud. */
export const ComboboxPlayground: StoryObj = {
  render: function ComboboxStory() {
    const [v, setV] = React.useState("");
    return (
      <Combobox
        label="District"
        options={DISTRICTS}
        value={v}
        onChange={setV}
        hint="Type any part of the district or state name."
      />
    );
  },
};

/** The filtered-to-nothing state, which is not the same sentence as "empty". */
export const ComboboxNoMatch: StoryObj = {
  render: function ComboboxEmptyStory() {
    const [v, setV] = React.useState("");
    return (
      <Combobox
        label="District"
        options={DISTRICTS}
        value={v}
        onChange={setV}
        noMatchLabel="No district matches. Check the spelling, or clear the box to see all seven."
      />
    );
  },
};

/**
 * `multiple`: several districts, each a removable chip. Enter adds or removes
 * the highlighted option, Backspace in an empty box removes the last chip, and
 * Escape clears the query but never the choices.
 */
export const ComboboxMultiple: StoryObj = {
  render: function ComboboxMultipleStory() {
    const [v, setV] = React.useState<string[]>(["ba", "ra"]);
    return (
      <div style={{ maxWidth: "22rem" }}>
        <Combobox
          multiple
          label="Districts of Operation"
          options={DISTRICTS}
          value={v}
          onChange={setV}
          hint="Choose every district the organisation works in."
        />
      </div>
    );
  },
};

/**
 * Limits: `maxSelected` disables the rest of the list at three and says why;
 * `maxVisibleChips` folds a long answer into "+N more"; `name` posts one entry
 * per chosen value; `size` follows the field scale.
 */
export const ComboboxLimits: StoryObj = {
  render: function ComboboxLimitsStory() {
    const [v, setV] = React.useState<string[]>(["ba", "ra"]);
    return (
      <div style={{ maxWidth: "22rem" }}>
        <Combobox
          multiple
          label="Preferred Districts"
          options={DISTRICTS}
          value={v}
          onChange={setV}
          maxSelected={3}
          maxVisibleChips={2}
          name="districts"
          size="lg"
          hint="Up to three."
        />
      </div>
    );
  },
};

/**
 * A server search: `onQueryChange` runs it, `filterOptions={false}` trusts the
 * results, `minQueryLength` asks before searching, `maxResults` caps the rows,
 * and `loading`, `loadError` and `onRetry` draw its three other states.
 */
export const ComboboxServerSearch: StoryObj = {
  render: function ComboboxServerSearchStory() {
    const [v, setV] = React.useState<string[]>([]);
    const [results, setResults] = React.useState(DISTRICTS);
    const [loading, setLoading] = React.useState(false);
    const search = (q: string) => {
      setLoading(true);
      window.setTimeout(() => {
        setResults(DISTRICTS.filter((d) => d.label.toLowerCase().includes(q.toLowerCase())));
        setLoading(false);
      }, 500);
    };
    return (
      <div style={{ maxWidth: "22rem" }}>
        <Combobox
          multiple
          label="Districts"
          options={results}
          value={v}
          onChange={setV}
          filterOptions={false}
          minQueryLength={2}
          maxResults={50}
          onQueryChange={search}
          loading={loading}
          loadError={undefined}
          onRetry={() => search("")}
        />
      </div>
    );
  },
};

/**
 * Field states, from FormField: `warning`, `success`, `labelHelp`, `optional`,
 * `readOnly`, `labelHidden` and `describedBy`; `emptyLabel` is the wording for
 * a list with nothing in it at all.
 */
export const ComboboxFieldStates: StoryObj = {
  render: function ComboboxFieldStatesStory() {
    const [v, setV] = React.useState("nd");
    return (
      <div style={{ display: "grid", gap: "var(--sa-stack-24)", maxWidth: "22rem" }}>
        <Combobox label="Head Office District" options={DISTRICTS} value={v} onChange={setV} warning="This district is outside the state." labelHelp="Districts come from the LGD register." />
        <Combobox multiple label="Verified Districts" options={DISTRICTS} value={["ba", "nd"]} onChange={() => undefined} success="All districts verified." readOnly />
        <Combobox label="Scheme" options={[]} value="" onChange={() => undefined} emptyLabel="No schemes are open for applications." optional />
        <Combobox label="Search Districts" labelHidden options={DISTRICTS} value="" onChange={() => undefined} describedBy="district-note" />
      </div>
    );
  },
};
