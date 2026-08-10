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
            color: "var(--ds-ink)",
          }}
        >
          {matches.length === 0 ? (
            <li style={{ color: "var(--ds-ink-muted)" }}>No districts match “{value}”.</li>
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
