"use client";
import * as React from "react";
import { DateRangePicker, type DateRange, type DateRangePreset } from "@mosje/design-system";

const PRESETS: DateRangePreset[] = [
  { id: "30d", label: "Last 30 days", from: "2026-08-07", to: "2026-09-06" },
  { id: "quarter", label: "This quarter", from: "2026-07-01", to: "2026-09-30" },
  { id: "fy", label: "This financial year", from: "2026-04-01", to: "2027-03-31" },
];

const CELL: React.CSSProperties = { display: "flex", flexDirection: "column", gap: "var(--sa-stack-8)" };
const CAPTION: React.CSSProperties = {
  fontSize: "var(--sa-type-label-2-size)", lineHeight: "var(--sa-type-label-2-lh)",
  color: "var(--sa-text-neutral-subtle)", margin: 0,
};

function One(props: { initial: DateRange } & Partial<React.ComponentProps<typeof DateRangePicker>>) {
  const { initial, ...rest } = props;
  const [range, setRange] = React.useState<DateRange>(initial);
  return <DateRangePicker label="Period" value={range} onChange={setRange} {...rest} />;
}

/** Every arrangement: presets, a chosen preset, out of order, bounded, disabled. */
export function RangePlayground(): React.JSX.Element {
  return (
    <div style={{ padding: "var(--sa-padding-40)", background: "var(--sa-bg-neutral-subtle)",
      borderRadius: "var(--sa-shape-8)", display: "grid", gap: "var(--sa-stack-24)" }}>
      <div style={CELL}>
        <One initial={{ from: "", to: "" }} presets={PRESETS} hint="Both dates are included in the report." />
        <p style={CAPTION}>Presets are real buttons. Behind a dropdown, &ldquo;Last 30 days&rdquo; costs three presses instead of one.</p>
      </div>
      <div style={CELL}>
        <One initial={{ from: "2026-07-01", to: "2026-09-30" }} presets={PRESETS} />
        <p style={CAPTION}>The matching preset shows as pressed — <code>aria-pressed</code>, not a tint alone.</p>
      </div>
      <div style={CELL}>
        <One initial={{ from: "2026-09-30", to: "2026-09-01" }} />
        <p style={CAPTION}>The end before the start. It says so and leaves both dates alone rather than swapping them.</p>
      </div>
      <div style={CELL}>
        <One initial={{ from: "2026-04-01", to: "" }} label="Sanction window" fromLabel="Sanctioned on"
          toLabel="Valid until" min="2026-04-01" max="2027-03-31" required />
        <p style={CAPTION}>Bounded and required, with both ends renamed for a sanction window.</p>
      </div>
      <div style={CELL}>
        <One initial={{ from: "2026-04-01", to: "2027-03-31" }} presets={PRESETS} disabled />
        <p style={CAPTION}>Disabled — a period fixed by the scheme rather than chosen by the officer.</p>
      </div>
    </div>
  );
}
