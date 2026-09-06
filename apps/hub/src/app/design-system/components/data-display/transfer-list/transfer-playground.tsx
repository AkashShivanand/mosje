"use client";
import * as React from "react";
import { TransferList, type TransferItem } from "@mosje/design-system";

const DISTRICTS: TransferItem[] = [
  { id: "bankura", label: "Bankura", meta: "22 blocks" },
  { id: "purulia", label: "Purulia", meta: "20 blocks" },
  { id: "nadia", label: "Nadia", meta: "17 blocks" },
  { id: "gaya", label: "Gaya", meta: "24 blocks" },
  { id: "nalanda", label: "Nalanda", meta: "20 blocks" },
  { id: "patna", label: "Patna", meta: "23 blocks", disabled: true },
];

const CELL: React.CSSProperties = { display: "flex", flexDirection: "column", gap: "var(--sa-stack-8)" };
const CAPTION: React.CSSProperties = {
  fontSize: "var(--sa-type-label-2-size)", lineHeight: "var(--sa-type-label-2-lh)",
  color: "var(--sa-text-neutral-subtle)", margin: 0,
};

function One(props: Partial<React.ComponentProps<typeof TransferList>> & { initial?: string[] }) {
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

/** Every arrangement: empty, partly mapped, nothing left, and withdrawn. */
export function TransferPlayground(): React.JSX.Element {
  return (
    <div style={{ padding: "var(--sa-padding-40)", background: "var(--sa-bg-neutral-subtle)",
      borderRadius: "var(--sa-shape-8)", display: "grid", gap: "var(--sa-stack-24)" }}>
      <div style={CELL}>
        <One initial={["bankura", "nadia"]} />
        <p style={CAPTION}>
          Tick some and the button says how many will move. Patna is fixed by the scheme and cannot
          be ticked.
        </p>
      </div>
      <div style={CELL}>
        <One initial={DISTRICTS.map((d) => d.id)}
          emptyAvailableText="Every district is already mapped to this surveyor."
          emptySelectedText="Nothing mapped yet." />
        <p style={CAPTION}>Nothing left to add — the empty panel gives its own answer rather than sitting blank.</p>
      </div>
      <div style={CELL}>
        <One initial={["bankura"]} disabled />
        <p style={CAPTION}>Withdrawn — the officer&rsquo;s role does not permit remapping.</p>
      </div>
    </div>
  );
}
