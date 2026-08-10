import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Chip, Icon } from "@mosje/design-system";

/**
 * **Chip** — a compact pill for a filter, a selection, or a removable tag.
 *
 * What it is depends entirely on which handler you give it, and the three are
 * not interchangeable:
 *
 * - `onSelectedChange` makes it a **toggle** — it gains `role="button"`,
 *   `aria-pressed`, a tab stop, and Enter/Space. This is the filter chip.
 * - `onDismiss` adds a **trailing × button** — the applied-filter or tag chip
 *   the user removes.
 * - Neither makes it a **static label**, with no interaction and no tab stop.
 *
 * Do not use a chip as a button for an action (use `Button`), and do not use it
 * to show a status you cannot change — that is `Badge`.
 *
 * Lifecycle: **Stable**.
 */
const meta = {
  title: "Components/Forms/Chip",
  component: Chip,
  args: {
    children: "Maharashtra",
    selected: false,
    disabled: false,
    trailingDropdown: false,
  },
  argTypes: {
    selected: { control: "boolean" },
    disabled: { control: "boolean" },
    trailingDropdown: { control: "boolean" },
    dismissLabel: { control: "text" },
    children: { control: "text" },
    leadingIcon: { control: false },
    onSelectedChange: { control: false },
    onDismiss: { control: false },
  },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: function Render(args) {
    const [selected, setSelected] = React.useState(false);
    return <Chip {...args} selected={selected} onSelectedChange={setSelected} />;
  },
};

/** Multi-select filters — the commonest use across the portals. */
export const FilterToggles: Story = {
  render: function Render(args) {
    const categories = ["Scheduled Caste", "Other Backward Class", "De-notified tribe", "Senior citizen"];
    const [picked, setPicked] = React.useState<string[]>(["Scheduled Caste"]);
    return (
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {categories.map((c) => (
          <Chip
            {...args}
            key={c}
            selected={picked.includes(c)}
            onSelectedChange={(next) =>
              setPicked((prev) => (next ? [...prev, c] : prev.filter((p) => p !== c)))
            }
          >
            {c}
          </Chip>
        ))}
      </div>
    );
  },
};

/** Applied filters the user can take off again. */
export const Dismissible: Story = {
  render: function Render(args) {
    const [applied, setApplied] = React.useState(["Pune", "Nashik", "2026–27", "Pending approval"]);
    return (
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
        {applied.map((a) => (
          <Chip
            {...args}
            key={a}
            onDismiss={() => setApplied((prev) => prev.filter((p) => p !== a))}
            dismissLabel={`Remove filter ${a}`}
          >
            {a}
          </Chip>
        ))}
        {applied.length === 0 && (
          <span style={{ color: "var(--ds-ink-muted)" }}>No filters applied.</span>
        )}
      </div>
    );
  },
};

/** A leading glyph, a dropdown trigger, a static label, and the disabled state. */
export const Variants: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      <Chip {...args} leadingIcon={<Icon name="location_on" size={16} aria-hidden />}>
        Pune district
      </Chip>
      <Chip {...args} trailingDropdown onSelectedChange={() => {}}>
        Financial year
      </Chip>
      <Chip {...args} selected onSelectedChange={() => {}}>
        Selected
      </Chip>
      <Chip {...args}>Static label</Chip>
      <Chip {...args} disabled onSelectedChange={() => {}}>
        Locked after approval
      </Chip>
    </div>
  ),
};
