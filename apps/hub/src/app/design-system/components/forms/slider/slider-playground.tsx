"use client";
import * as React from "react";
import { RangeSlider, Slider } from "@mosje/design-system";

const PANEL: React.CSSProperties = {
  padding: "var(--sa-padding-40)",
  background: "var(--sa-bg-neutral-base)",
  border: "var(--sa-cmp-divider-width) solid var(--sa-border-neutral-subtle)",
  borderRadius: "var(--sa-shape-8)",
  display: "flex",
  flexDirection: "column",
  gap: "var(--sa-stack-40)",
  maxWidth: "34rem",
};

const LABEL: React.CSSProperties = {
  display: "block",
  marginBlockEnd: "var(--sa-stack-8)",
  color: "var(--sa-text-neutral-bolder)",
  fontSize: "var(--sa-type-label-1-size)",
  lineHeight: "var(--sa-type-label-1-lh)",
  fontWeight: "var(--sa-font-weight-medium)",
};

const RUPEES = (v: number) => `₹ ${v.toLocaleString("en-IN")}`;
const LAKH = (v: number) => `₹ ${(v / 100000).toFixed(1)}L`;
const MARKS = [
  { value: 0, label: "₹ 0" },
  { value: 500000, label: "₹ 5L" },
  { value: 1000000, label: "₹ 10L" },
];

/** Every arrangement: a plain slider, a slider with a unit and marks, a range, the compact size, and disabled. */
export function SliderPlayground(): React.JSX.Element {
  const [distance, setDistance] = React.useState(40);
  const [amount, setAmount] = React.useState(450000);
  const [band, setBand] = React.useState<[number, number]>([200000, 700000]);
  const [compact, setCompact] = React.useState(60);

  return (
    <div style={PANEL}>
      <div>
        <span style={LABEL} id="sl-distance">
          Distance from the district headquarters
        </span>
        <Slider
          aria-labelledby="sl-distance"
          value={distance}
          onValueChange={setDistance}
          min={0}
          max={100}
          formatValue={(v) => `${v} km`}
        />
      </div>

      <div>
        <span style={LABEL} id="sl-amount">
          Grant amount sought
        </span>
        <Slider
          aria-labelledby="sl-amount"
          value={amount}
          onValueChange={setAmount}
          min={0}
          max={1000000}
          step={50000}
          formatValue={RUPEES}
          marks={MARKS}
        />
      </div>

      <div>
        <span style={LABEL}>Grant amount band</span>
        <RangeSlider
          label="Grant amount"
          value={band}
          onValueChange={setBand}
          min={0}
          max={1000000}
          step={50000}
          formatValue={LAKH}
          marks={MARKS}
        />
      </div>

      <div>
        <span style={LABEL} id="sl-compact">
          Compact, for a filter rail
        </span>
        <Slider
          aria-labelledby="sl-compact"
          size="sm"
          value={compact}
          onValueChange={setCompact}
        />
      </div>

      <div>
        <span style={LABEL} id="sl-disabled">
          Unavailable
        </span>
        <Slider aria-labelledby="sl-disabled" disabled value={25} onValueChange={() => {}} />
      </div>
    </div>
  );
}
