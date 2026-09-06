import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { TransferList, type TransferItem } from "@mosje/design-system";

/**
 * Two lists and the traffic between them — Surveyor Mappings, Roles &
 * Permissions.
 *
 * **Use it** where a reader assigns some of a known set to something: districts
 * to a surveyor, permissions to a role.
 *
 * **Do not use it** for a handful of options — three checkboxes are three
 * checkboxes. And not where order matters, because this control has no way to
 * express one.
 *
 * **Each side is a list of checkboxes, deliberately.** There is no WAI-ARIA
 * pattern for a transfer list, so the usual implementation invents a keyboard
 * model — a multi-select listbox with shift-ranges — that a reader has to learn
 * on the spot and that almost nobody implements completely. A checkbox needs no
 * new keys and reports its own state without help.
 *
 * `items` is every item on either side and `selectedIds` says which are on the
 * right; the component splits them, so the caller keeps one array rather than
 * two in sync. `onChange` receives the new right-hand ids. `label` names the
 * pair. `availableLabel` and `selectedLabel` name the two sides and appear in
 * their legends together with a count — "Available (14)" — so the count is part
 * of the group's name rather than a number floating beside it.
 * `emptyAvailableText` and `emptySelectedText` are the two empty answers, and
 * `disabled` withdraws the whole control.
 *
 * The move buttons say how many will move — "Add 3", not "Add" — and are
 * disabled when nothing is ticked. What moved is announced in a polite live
 * region, because on a two-panel control the thing that changed is exactly what
 * a screen-reader user cannot see.
 */
const meta = {
  title: "Data Display/TransferList",
  component: TransferList,
  parameters: { layout: "padded" },
} satisfies Meta<typeof TransferList>;

export default meta;
type Story = StoryObj<typeof meta>;

const DISTRICTS: TransferItem[] = [
  { id: "bankura", label: "Bankura", meta: "22 blocks" },
  { id: "purulia", label: "Purulia", meta: "20 blocks" },
  { id: "nadia", label: "Nadia", meta: "17 blocks" },
  { id: "gaya", label: "Gaya", meta: "24 blocks" },
  { id: "nalanda", label: "Nalanda", meta: "20 blocks" },
  { id: "patna", label: "Patna", meta: "23 blocks", disabled: true },
];

function Controlled(props: Partial<React.ComponentProps<typeof TransferList>> & { initial?: string[] }) {
  const { initial = [], ...rest } = props;
  const [ids, setIds] = React.useState<string[]>(initial);
  return (
    <TransferList
      label="Districts mapped to this surveyor"
      items={DISTRICTS}
      selectedIds={ids}
      onChange={setIds}
      availableLabel="Available districts"
      selectedLabel="Mapped districts"
      {...rest}
    />
  );
}

export const Playground: Story = {
  args: { items: DISTRICTS, selectedIds: [], onChange: () => {}, label: "Districts mapped to this surveyor" },
  render: () => <Controlled />,
};

/** Some already mapped. Patna is fixed by the scheme and cannot be ticked. */
export const PartlyMapped: Story = {
  args: { items: DISTRICTS, selectedIds: [], onChange: () => {}, label: "Districts mapped to this surveyor" },
  render: () => <Controlled initial={["bankura", "nadia"]} />,
};

/** Everything mapped — the left panel gives its own answer rather than sitting blank. */
export const NothingLeft: Story = {
  args: { items: DISTRICTS, selectedIds: [], onChange: () => {}, label: "Districts mapped to this surveyor" },
  render: () => (
    <Controlled
      initial={DISTRICTS.map((district) => district.id)}
      emptyAvailableText="Every district is already mapped to this surveyor."
      emptySelectedText="Nothing mapped yet."
    />
  ),
};

/** Withdrawn — the officer's role does not permit remapping. */
export const Disabled: Story = {
  args: { items: DISTRICTS, selectedIds: [], onChange: () => {}, label: "Districts mapped to this surveyor" },
  render: () => <Controlled initial={["bankura"]} disabled />,
};
