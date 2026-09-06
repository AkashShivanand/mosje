"use client";
import * as React from "react";
import { Tree, type TreeNode } from "@mosje/design-system";

const NODES: TreeNode[] = [
  { id: "wb", label: "West Bengal", meta: "3 districts", children: [
    { id: "wb-bankura", label: "Bankura", meta: "22 blocks" },
    { id: "wb-purulia", label: "Purulia", meta: "20 blocks" },
    { id: "wb-nadia", label: "Nadia", meta: "17 blocks", children: [
      { id: "wb-nadia-krishnanagar", label: "Krishnanagar" },
      { id: "wb-nadia-ranaghat", label: "Ranaghat" },
    ] },
  ] },
  { id: "br", label: "Bihar", meta: "2 districts", children: [
    { id: "br-gaya", label: "Gaya", meta: "24 blocks" },
    { id: "br-nalanda", label: "Nalanda", meta: "20 blocks", disabled: true },
  ] },
  { id: "dl", label: "Delhi", meta: "no districts recorded", children: [] },
];

const CELL: React.CSSProperties = { display: "flex", flexDirection: "column", gap: "var(--sa-stack-8)" };
const CAPTION: React.CSSProperties = {
  fontSize: "var(--sa-type-label-2-size)", lineHeight: "var(--sa-type-label-2-lh)",
  color: "var(--sa-text-neutral-subtle)", margin: 0,
};

function One(props: Partial<React.ComponentProps<typeof Tree>>) {
  const [selected, setSelected] = React.useState<string | undefined>(undefined);
  return (
    <Tree label="States and districts" nodes={NODES} selectedId={selected} onSelect={setSelected}
      defaultExpandedIds={["wb"]} {...props} />
  );
}

/** Every arrangement: partly open, fully open with a disabled branch, and empty. */
export function TreePlayground(): React.JSX.Element {
  return (
    <div style={{ padding: "var(--sa-padding-40)", background: "var(--sa-bg-neutral-subtle)",
      borderRadius: "var(--sa-shape-8)", display: "grid", gap: "var(--sa-stack-24)" }}>
      <div style={CELL}>
        <One />
        <p style={CAPTION}>
          One tab stop for the whole tree. Arrow keys move inside it; Right expands then descends,
          Left collapses then ascends, and typing jumps to a label.
        </p>
      </div>
      <div style={CELL}>
        <One defaultExpandedIds={["wb", "wb-nadia", "br", "dl"]} />
        <p style={CAPTION}>
          Fully open. Nalanda is disabled and stays reachable; Delhi is a branch with nothing in it,
          which is still a branch.
        </p>
      </div>
      <div style={CELL}>
        <Tree nodes={[]} label="Unmapped states" emptyText="No states have been mapped to this scheme yet." />
        <p style={CAPTION}>Empty is the answer, written out.</p>
      </div>
    </div>
  );
}
