"use client";
import * as React from "react";
import { InlineEdit } from "@mosje/design-system";

const CELL: React.CSSProperties = {
  display: "flex", flexDirection: "column", gap: "var(--sa-stack-8)",
  padding: "var(--sa-padding-20)", background: "var(--sa-bg-neutral-base)", borderRadius: "var(--sa-shape-8)",
};
const CAPTION: React.CSSProperties = {
  fontSize: "var(--sa-type-label-2-size)", lineHeight: "var(--sa-type-label-2-lh)",
  color: "var(--sa-text-neutral-subtle)", margin: 0,
};

function One(props: Partial<React.ComponentProps<typeof InlineEdit>> & { initial?: string; fail?: boolean }) {
  const { initial = "", fail, ...rest } = props;
  const [value, setValue] = React.useState(initial);
  return (
    <InlineEdit
      label="District"
      value={value}
      onSave={async (next) => {
        await new Promise((resolve) => setTimeout(resolve, 400));
        if (fail) throw new Error("write failed");
        setValue(next);
      }}
      {...rest}
    />
  );
}

/** Every arrangement: recorded, unrecorded, a failing write, read-only, disabled. */
export function EditPlayground(): React.JSX.Element {
  return (
    <div style={{ padding: "var(--sa-padding-40)", background: "var(--sa-bg-neutral-subtle)",
      borderRadius: "var(--sa-shape-8)", display: "grid", gap: "var(--sa-stack-16)" }}>
      <div style={CELL}>
        <One initial="Bankura" hint="The district recorded on the application." />
        <p style={CAPTION}>The value changes only after the save resolves — never the instant it is typed.</p>
      </div>
      <div style={CELL}>
        <One label="Alternate telephone" initial="" maxLength={10} />
        <p style={CAPTION}>Unrecorded says so in words, not as a dash.</p>
      </div>
      <div style={CELL}>
        <One label="Bank branch" initial="Bankura Main Branch" fail />
        <p style={CAPTION}>Edit this one and save: the write fails, the message is announced, and the typed text stays in the field.</p>
      </div>
      <div style={CELL}>
        <One label="Sanctioned amount" initial="₹ 12,000" readOnlyReason="This application was approved on 4 September 2026." />
        <p style={CAPTION}>A decided record says why it cannot be changed, rather than hiding the control.</p>
      </div>
      <div style={CELL}>
        <One label="Beneficiary category" initial="Scheduled Caste" disabled />
        <p style={CAPTION}>Withdrawn — the officer&rsquo;s role does not permit the change.</p>
      </div>
    </div>
  );
}
