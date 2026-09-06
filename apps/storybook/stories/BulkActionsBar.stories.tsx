import type { Meta, StoryObj } from "@storybook/react";
import { BulkActionsBar } from "@mosje/design-system";

/**
 * **Bulk Actions Bar** — the strip that appears when rows are selected.
 * *Withdrawn Applications*, *Pending Approvals*, *Beneficiary List*.
 *
 * **The count is announced, not just drawn.** Selecting rows changes nothing a
 * screen reader would notice on its own: the checkbox says "checked" and the
 * page says nothing about how many are now selected or what can be done with
 * them. The bar is a polite live region, so the count and the appearance of
 * actions are read out as the selection grows. Polite rather than assertive —
 * the reader is selecting deliberately, and an assertive announcement would
 * interrupt them on every click.
 *
 * **Clearing is always offered.** A reader who has selected forty rows by
 * accident — and on a long table with a shift-click that is easy — needs one
 * control to undo it, not forty.
 *
 * **It does not float.** A bar pinned over the bottom of the viewport covers the
 * last row of the table, which on a phone is the row the reader was about to act
 * on. This sits in the flow above the table, where the selection is.
 *
 * `noun` is singular and the bar pluralises it, because "3 applications
 * selected" and "3 records selected" are different sentences and only the page
 * knows which is true. Pass `pluralNoun` where adding "s" is wrong.
 *
 * Lifecycle: **Stable**.
 */
const meta = {
  title: "Components/Data Display/Bulk Actions Bar",
  component: BulkActionsBar,
  args: {
    count: 3,
    noun: "application",
    onAction: () => {},
    onClear: () => {},
    actions: [
      { id: "assign", label: "Assign to an officer" },
      { id: "export", label: "Export as CSV" },
      { id: "return", label: "Return for correction", tone: "warning" as const },
      { id: "reject", label: "Reject", tone: "danger" as const },
    ],
  },
  argTypes: {
    count: { control: { type: "number", min: 0, max: 50 } },
    noun: { control: "text" },
    pluralNoun: { control: "text" },
    total: { control: "number" },
    actions: { control: false },
    onAction: { control: false },
    onClear: { control: false },
    onSelectAll: { control: false },
  },
  decorators: [(Story) => <div style={{ padding: 24, maxWidth: 860 }}><Story /></div>],
} satisfies Meta<typeof BulkActionsBar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Three selected. The destructive action sits at the far end from "Clear selection". */
export const Playground: Story = {};

/** One selected — the noun is singular, because "1 applications" is not a sentence. */
export const Singular: Story = { args: { count: 1 } };

/**
 * With a total, the bar offers to extend the selection to everything that
 * matched — the case a reader hits after filtering to 240 rows and selecting the
 * 20 on screen.
 */
export const ExtendToAll: Story = {
  args: { count: 20, total: 240, onSelectAll: () => {} },
};

/**
 * A noun that does not pluralise with "s". Passing `pluralNoun` is the only way
 * to get "3 entries" instead of "3 entrys".
 */
export const AnIrregularPlural: Story = {
  args: { count: 3, noun: "entry", pluralNoun: "entries" },
};

/** Nothing selected. The bar renders nothing at all — not an empty strip. */
export const NothingSelected: Story = { args: { count: 0 } };
