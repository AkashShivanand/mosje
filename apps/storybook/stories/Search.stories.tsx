import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Search } from "@mosje/design-system";

/**
 * **Search** — a real `<input type="search">` with a leading glyph and an
 * optional clear button.
 *
 * It is a *controlled* control: `value` and `onChange` are required, because a
 * search box that filters a list has to be the single source of truth for what
 * is shown. The clear button only appears when `onClear` is supplied **and**
 * there is something to clear — a permanently visible × on an empty field is
 * noise.
 *
 * Use it to filter a list already on screen. Do **not** use it as a submit-and-
 * navigate site search unless you wrap it in a `<form>` and handle Enter; the
 * component itself does nothing on Enter by design.
 *
 * Sizes map to context: `sm` (40px) in a dense portal toolbar, `md` (44px) as
 * the default, `lg` (56px) for a page-level search hero.
 *
 * Lifecycle: **Stable**.
 *
 * `onSubmit` fires on Enter and on the submit glyph, with the current value. Wire
 * it when the search leaves the page — a results route, a server query. Leave it
 * off when the box filters a list in place, because a submit that reloads what is
 * already filtered is a step the reader did not need.
 */
const meta = {
  title: "Components/Forms/Search",
  component: Search,
  args: {
    value: "",
    onChange: () => {},
    size: "md",
    placeholder: "Search beneficiaries by name or application ID",
    disabled: false,
  },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    disabled: { control: "boolean" },
    placeholder: { control: "text" },
    value: { control: false },
    onChange: { control: false },
    onClear: { control: false },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 480 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Search>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: function Render(args) {
    const [value, setValue] = React.useState("");
    return (
      <Search
        {...args}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onClear={() => setValue("")}
      />
    );
  },
};

/** Type something — the clear button only appears once there is a value. */
export const Clearable: Story = {
  render: function Render(args) {
    const [value, setValue] = React.useState("Pune");
    return (
      <Search
        {...args}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onClear={() => setValue("")}
      />
    );
  },
};

export const Sizes: Story = {
  render: function Render(args) {
    const [value, setValue] = React.useState("Nasha Mukt");
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {(["sm", "md", "lg"] as const).map((size) => (
          <Search
            {...args}
            key={size}
            size={size}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onClear={() => setValue("")}
            aria-label={`Search (${size})`}
          />
        ))}
      </div>
    );
  },
};

/** Filtering a real list — what the component is actually for. */
export const FilteringAList: Story = {
  render: function Render(args) {
    const districts = [
      "Pune",
      "Nashik",
      "Nagpur",
      "Chhatrapati Sambhajinagar",
      "Kolhapur",
      "Solapur",
    ];
    const [value, setValue] = React.useState("");
    const matches = districts.filter((d) =>
      d.toLowerCase().includes(value.trim().toLowerCase()),
    );
    return (
      <div style={{ display: "grid", gap: 12 }}>
        <Search
          {...args}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onClear={() => setValue("")}
          placeholder="Filter districts"
          aria-label="Filter districts"
        />
        <ul
          style={{
            margin: 0,
            padding: 0,
            listStyle: "none",
            display: "grid",
            gap: 4,
            color: "var(--sa-text-neutral-base)",
          }}
        >
          {matches.length === 0 ? (
            <li style={{ color: "var(--sa-text-neutral-subtle)" }}>No districts match “{value}”.</li>
          ) : (
            matches.map((d) => <li key={d}>{d}</li>)
          )}
        </ul>
      </div>
    );
  },
};

export const Disabled: Story = {
  args: { disabled: true, value: "Locked while the report is generating" },
};

/**
 * **Autocomplete.** Pass `suggestions` and the field becomes an ARIA 1.2
 * combobox: `↓` / `↑` move the highlight **without moving focus out of the
 * input**, `Esc` closes the list and keeps the text, `Enter` opens the
 * highlighted row — and `Enter` on raw text still submits, so the list is a
 * shortcut and never the only route.
 *
 * `onSuggestionSelect` fires for a click or an `Enter` on the highlight;
 * `suggestionsLabel` names the listbox for a screen reader (default "Search
 * suggestions"). Omit `suggestions` entirely — do not pass `[]` — for a field
 * with no autocomplete: an empty array still announces the field as a combobox.
 *
 * The component neither fetches nor debounces. That belongs to the owner, because
 * an in-memory list and a network route want different intervals; the website's
 * masthead debounces 150ms and aborts in-flight lookups.
 */
export const Autocomplete: Story = {
  render: function Render(args) {
    const catalogue = [
      { id: "/pre-matric", label: "Pre-Matric Scholarship for SC Students", group: "Schemes", iconName: "volunteer_activism", description: "Class 9–10 support for Scheduled Caste students." },
      { id: "/post-matric", label: "Post-Matric Scholarship for OBC Students", group: "Schemes", iconName: "volunteer_activism", description: "Fees and maintenance beyond class 10." },
      { id: "/nos", label: "National Overseas Scholarship", group: "Schemes", iconName: "volunteer_activism", description: "Postgraduate study abroad for SC candidates." },
      { id: "/nsfdc", label: "National Scheduled Castes Finance and Development Corporation", group: "Organisations", iconName: "corporate_fare", description: "Concessional credit through State Channelising Agencies." },
      { id: "/nskfdc", label: "National Safai Karamcharis Finance and Development Corporation", group: "Organisations", iconName: "corporate_fare", description: "Livelihood finance for sanitation workers." },
    ];
    const [value, setValue] = React.useState("scholar");
    const [chosen, setChosen] = React.useState<string | null>(null);
    const matches = value.trim()
      ? catalogue.filter((row) => row.label.toLowerCase().includes(value.trim().toLowerCase()))
      : [];

    return (
      <div style={{ display: "grid", gap: 12 }}>
        <Search
          {...args}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onClear={() => setValue("")}
          onSubmit={(v) => setChosen(`Searched for “${v}”`)}
          suggestions={matches}
          suggestionsLabel="Scheme and organisation suggestions"
          onSuggestionSelect={(s) => setChosen(`Opened ${s.label}`)}
          placeholder="Search schemes, organisations, documents…"
          aria-label="Search this website"
        />
        <p style={{ margin: 0, color: "var(--sa-text-neutral-subtle)" }}>
          {chosen ?? "Type, then use ↓ ↑ and Enter — or press Enter on the raw text."}
        </p>
      </div>
    );
  },
};
