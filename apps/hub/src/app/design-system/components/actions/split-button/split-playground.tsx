"use client";
import * as React from "react";
import { SplitButton, type MenuEntry } from "@mosje/design-system";

const APPROVE: MenuEntry[] = [
  { id: "remarks", label: "Approve with remarks", icon: "edit_note",
    description: "The applicant sees your note alongside the decision." },
  { id: "notify", label: "Approve and notify the applicant", icon: "mail" },
  { kind: "separator" },
  { id: "delegate", label: "Delegate to another officer", icon: "person_add" },
];
const REJECT: MenuEntry[] = [
  { id: "reasons", label: "Reject with reasons", icon: "edit_note" },
  { id: "return", label: "Return for correction instead", icon: "undo", tone: "warning",
    description: "The applicant can amend and resubmit." },
];

/** Every arrangement: the default action, a destructive default, and disabled. */
export function SplitPlayground(): React.JSX.Element {
  const [last, setLast] = React.useState<string | null>(null);
  return (
    <div
      style={{
        padding: "var(--sa-padding-40)",
        background: "var(--sa-bg-neutral-subtle)",
        borderRadius: "var(--sa-shape-8)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--sa-stack-24)",
        alignItems: "flex-start",
      }}
    >
      <div style={{ display: "flex", gap: "var(--sa-inline-16)", flexWrap: "wrap" }}>
        <SplitButton
          label="Approve this application"
          items={APPROVE}
          onClick={() => setLast("approve")}
          onSelect={setLast}
        >
          Approve
        </SplitButton>
        <SplitButton
          label="Reject this application"
          variant="danger"
          items={REJECT}
          onClick={() => setLast("reject")}
          onSelect={setLast}
        >
          Reject
        </SplitButton>
        <SplitButton
          label="Approve this application"
          disabled
          items={APPROVE}
          onClick={() => {}}
          onSelect={() => {}}
        >
          Approve
        </SplitButton>
      </div>
      <p
        style={{
          margin: 0,
          color: "var(--sa-text-neutral-subtle)",
          fontSize: "var(--sa-type-label-2-size)",
          lineHeight: "var(--sa-type-label-2-lh)",
        }}
      >
        {last ? `Last chosen: ${last}` : "Nothing chosen yet."}
      </p>
    </div>
  );
}
