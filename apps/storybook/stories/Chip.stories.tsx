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
          <span style={{ color: "var(--sa-text-neutral-subtle)" }}>No filters applied.</span>
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

/**
 * **`tone` changes the SELECTED state only.**
 *
 * `brand` is the default and is right almost everywhere — it is the estate's
 * blue selection colour. Reach for `success` only when the chip sits on a
 * surface with no blue in it: the SAMAVESH banner's saffron-and-green drawer is
 * the case that asked for this, where a blue pill was a third colour family on
 * a two-family panel. An UNSELECTED chip is identical in both tones, so this is
 * not a way to colour-code categories.
 */
export const Tones: Story = {
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
      <Chip selected onSelectedChange={() => {}}>
        Selected · brand
      </Chip>
      <Chip tone="success" selected onSelectedChange={() => {}}>
        Selected · success
      </Chip>
      <Chip onSelectedChange={() => {}}>Unselected (identical in both)</Chip>
    </div>
  ),
};


/**
 * **`count` and `size` — the dense filter row.**
 *
 * A filter chip almost always wants to say how many things it selects, and two
 * callers were already doing it by hand and disagreeing: `DocumentLibrary`
 * wrote `{group} ({count})` into the children, PM-AJAY's coverage map appended
 * a muted `<span>`. Same idea, two typographic answers, one of them inside the
 * design system. `count` gives it one rendering — muted, tabular-figured, and
 * OUTSIDE the label, so a screen reader hears "Guidelines, 2 documents" rather
 * than "Guidelines open bracket two close bracket". Say what a unit is with
 * `countLabel`.
 *
 * Pass a **string** when the figure needs the estate's Indian grouping
 * (`formatIndian(n)`), a number otherwise.
 *
 * `size="sm"` is for a row of chips sharing a line with other controls, where
 * `md`'s 32px pushes it onto a second line. It stays past the 24px minimum
 * target (WCAG 2.2 SC 2.5.8). It is not a licence to fit more chips into a
 * space that is simply too small.
 */
export const CountsAndDensity: Story = {
  render: () => {
    const groups = [
      { label: "All", n: 19 },
      { label: "Guidelines", n: 2 },
      { label: "Circulars", n: 4 },
      { label: "Formats", n: 6 },
    ];
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div>
          <p style={{ margin: "0 0 8px", fontSize: 12, opacity: 0.7 }}>
            size=&quot;md&quot; (default) — a filter row with room to breathe
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {groups.map((g, i) => (
              <Chip
                key={g.label}
                selected={i === 0}
                onSelectedChange={() => {}}
                count={g.n}
                countLabel="documents"
              >
                {g.label}
              </Chip>
            ))}
          </div>
        </div>
        <div>
          <p style={{ margin: "0 0 8px", fontSize: 12, opacity: 0.7 }}>
            size=&quot;sm&quot; — the same row sharing a line with a legend and a search field
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {groups.map((g, i) => (
              <Chip
                key={g.label}
                size="sm"
                selected={i === 0}
                onSelectedChange={() => {}}
                count={g.n}
                countLabel="documents"
              >
                {g.label}
              </Chip>
            ))}
          </div>
        </div>
      </div>
    );
  },
};

/**
 * A `leadingIcon` carrying a **colour key** rather than a glyph — the shape
 * PM-AJAY's coverage map uses, where each chip filters a class of mark on a map
 * and the dot is that mark's colour.
 *
 * The dot stays filled whether the chip is on or off: the chip's own selected
 * treatment carries the state, and the dot is the KEY. A key that changes with
 * selection is a key that stops matching the thing it keys.
 */
export const ColourKeyChips: Story = {
  render: () => {
    const kinds = [
      { label: "Girls", n: 34, color: "var(--sa-chart-cat-3)" },
      { label: "Boys", n: 32, color: "var(--sa-chart-cat-2)" },
      { label: "Not recorded", n: 137, color: "var(--sa-chart-axis)" },
    ];
    return (
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {kinds.map((k) => (
          <Chip
            key={k.label}
            size="sm"
            selected
            onSelectedChange={() => {}}
            count={k.n}
            countLabel="hostels"
            leadingIcon={
              <span
                style={{
                  display: "block",
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: k.color,
                }}
              />
            }
          >
            {k.label}
          </Chip>
        ))}
      </div>
    );
  },
};
