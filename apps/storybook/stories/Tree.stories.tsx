import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { Tree, type TreeNode } from "@mosje/design-system";

/**
 * A hierarchy a reader walks — Master Data, Map Ministry & Schemes, Roles &
 * Permissions.
 *
 * **Use it** only for a real hierarchy whose shape the reader has to see. A
 * two-level list is a list with headings, and it is easier to use.
 *
 * **Do not use it** as navigation for a portal — that is `SidebarNav`, which
 * knows about the current route.
 *
 * Built to the WAI-ARIA tree pattern rather than approximated. One tab stop, not
 * one per node: a roving `tabIndex` puts the tree in the sequence once and the
 * arrow keys move inside it. Right expands then descends; Left collapses then
 * ascends; Home and End jump to the ends; `*` expands every sibling. Type-ahead
 * moves to the first label that starts with what was typed, and the buffer
 * clears after a pause so "ba" finds Bankura and a later "n" starts afresh.
 * Every node carries `aria-level`, `aria-setsize` and `aria-posinset`, without
 * which a tree is announced as a flat list and its shape — the entire point — is
 * lost.
 *
 * `nodes` is the hierarchy; a node with a `children` array is a branch, even an
 * empty one. `label` names the tree and is required. `selectedId` and `onSelect`
 * control selection; `expandedIds` and `onExpandedChange` control expansion, and
 * `defaultExpandedIds` seeds it when you would rather the tree managed its own.
 * `meta` prints a code or a count after a label, and `emptyText` is what an empty
 * hierarchy says.
 *
 * A `disabled` node keeps `aria-disabled` and stays reachable — never the native
 * attribute — because a reader has to be able to learn that a branch exists and
 * is not theirs to open.
 */
const meta = {
  title: "Data Display/Tree",
  component: Tree,
  parameters: { layout: "padded" },
} satisfies Meta<typeof Tree>;

export default meta;
type Story = StoryObj<typeof meta>;

const NODES: TreeNode[] = [
  {
    id: "wb",
    label: "West Bengal",
    meta: "3 districts",
    children: [
      { id: "wb-bankura", label: "Bankura", meta: "22 blocks" },
      { id: "wb-purulia", label: "Purulia", meta: "20 blocks" },
      {
        id: "wb-nadia",
        label: "Nadia",
        meta: "17 blocks",
        children: [
          { id: "wb-nadia-krishnanagar", label: "Krishnanagar" },
          { id: "wb-nadia-ranaghat", label: "Ranaghat" },
        ],
      },
    ],
  },
  {
    id: "br",
    label: "Bihar",
    meta: "2 districts",
    children: [
      { id: "br-gaya", label: "Gaya", meta: "24 blocks" },
      { id: "br-nalanda", label: "Nalanda", meta: "20 blocks", disabled: true },
    ],
  },
  { id: "dl", label: "Delhi", meta: "no districts recorded", children: [] },
];

function Controlled(props: Partial<React.ComponentProps<typeof Tree>>) {
  const [selected, setSelected] = React.useState<string | undefined>(undefined);
  return (
    <Tree
      label="States and districts"
      nodes={NODES}
      selectedId={selected}
      onSelect={setSelected}
      defaultExpandedIds={["wb"]}
      {...props}
    />
  );
}

export const Playground: Story = {
  args: { nodes: NODES, label: "States and districts" },
  render: () => <Controlled />,
};

/** Fully open, including the empty branch — a branch with nothing in it is still a branch. */
export const Expanded: Story = {
  args: { nodes: NODES, label: "States and districts" },
  render: () => <Controlled defaultExpandedIds={["wb", "wb-nadia", "br", "dl"]} />,
};

/** A disabled node stays reachable with the arrow keys and says it is unavailable. */
export const WithDisabledNode: Story = {
  args: { nodes: NODES, label: "States and districts" },
  render: () => <Controlled defaultExpandedIds={["br"]} />,
};

/** Nothing recorded yet. The answer is written rather than left blank. */
export const Empty: Story = {
  args: { nodes: [], label: "States and districts" },
  render: () => (
    <Tree nodes={[]} label="States and districts" emptyText="No states have been mapped to this scheme yet." />
  ),
};
