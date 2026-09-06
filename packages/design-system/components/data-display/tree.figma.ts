// url=<SAMAVESH>?node-id=57614-783
// source=packages/design-system/components/data-display/tree.tsx
// component=Tree
import figma from "figma";

const instance = figma.selectedInstance;

/**
 * Figma publishes the NODE; code publishes the tree. Kind is the SHAPE of the
 * node — a `children` array makes it a branch, an empty array makes it a branch
 * with nothing in it — and open/closed is `expandedIds`, which belongs to the
 * tree rather than to the node.
 *
 * Level is drawn as indent in Figma and derived in code, so it maps to nothing.
 */
const kind = instance.getEnum("Kind", {
  "Branch closed": "branch-closed",
  "Branch open": "branch-open",
  Leaf: "leaf",
});

const state = instance.getEnum("State", {
  Default: "default",
  Selected: "selected",
  Disabled: "disabled",
});

const children =
  kind === "leaf" ? "" : `, children: [{ id: "wb-bankura", label: "Bankura", meta: "22 blocks" }]`;
const disabled = state === "disabled" ? ", disabled: true" : "";
const expanded = kind === "branch-open" ? figma.code`defaultExpandedIds={["wb"]}` : "";
const selected = state === "selected" ? figma.code`selectedId="wb"` : "";

export default {
  example: figma.code`
    <Tree
      label="States and districts"
      ${selected}
      onSelect={setSelected}
      ${expanded}
      nodes={[
        { id: "wb", label: "West Bengal", meta: "3 districts"${children}${disabled} },
      ]}
    />
  `,
  imports: ['import { Tree } from "@mosje/design-system"'],
  id: "tree",
  metadata: { nestable: false },
};
