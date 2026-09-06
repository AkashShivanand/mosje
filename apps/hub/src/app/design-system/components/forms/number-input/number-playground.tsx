"use client";
import * as React from "react";
import { NumberInput } from "@mosje/design-system";

const GRID: React.CSSProperties = {
  padding: "var(--sa-padding-32)",
  background: "var(--sa-bg-neutral-base)",
  border: "var(--sa-cmp-divider-width) solid var(--sa-border-neutral-subtle)",
  borderRadius: "var(--sa-shape-8)",
  display: "grid",
  gap: "var(--sa-inline-24)",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(16rem, 100%), 1fr))",
};

/** Every arrangement: a count, an amount with a prefix, a percentage, empty, in error, and disabled. */
export function NumberPlayground(): React.JSX.Element {
  const [count, setCount] = React.useState<number | null>(120);
  const [amount, setAmount] = React.useState<number | null>(450000);
  const [pct, setPct] = React.useState<number | null>(62.5);
  const [blank, setBlank] = React.useState<number | null>(null);

  return (
    <div style={GRID}>
      <NumberInput label="Number of beneficiaries" value={count} onValueChange={setCount} min={0} />
      <NumberInput
        label="Grant amount sought"
        prefix="₹"
        hint="Whole rupees. Commas and spaces are accepted."
        value={amount}
        onValueChange={setAmount}
        min={0}
        step={50000}
        hideSteppers
      />
      <NumberInput
        label="Utilisation"
        suffix="%"
        value={pct}
        onValueChange={setPct}
        min={0}
        max={100}
        step={0.5}
        precision={1}
      />
      <NumberInput
        label="Hostels sanctioned"
        hint="Leave blank if not applicable."
        value={blank}
        onValueChange={setBlank}
        min={0}
      />
      <NumberInput
        label="Number of beneficiaries"
        required
        value={null}
        onValueChange={() => {}}
        error="Enter the number of beneficiaries."
      />
      <NumberInput label="Sanctioned strength" disabled value={40} onValueChange={() => {}} />
    </div>
  );
}
