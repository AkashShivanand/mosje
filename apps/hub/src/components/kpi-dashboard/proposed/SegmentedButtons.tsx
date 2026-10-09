"use client";

import { Button, ButtonGroup } from "@mosje/design-system";

/**
 * A chart's view switch as the design system's SEGMENTED BUTTON — `ButtonGroup attached`, the
 * selected segment Filled and the others Outlined, each saying `aria-pressed` (SAMAVESH
 * ButtonGroup, rules 3–5). It replaced the pill-in-a-track control, which read as tabs
 * (instruction, 7 Oct 2026): tabs move between places; this changes what one chart shows.
 *
 * DS Audit: ButtonGroup ✅ · Button ✅.
 */
export function SegmentedButtons<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  /** Names the group for a screen reader: "Students shown". */
  label: string;
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <ButtonGroup aria-label={label} attached className="pd-segmented">
      {options.map((o) => {
        const on = o.value === value;
        return (
          <Button key={o.value} size="sm" appearance={on ? "filled" : "outlined"} aria-pressed={on} onClick={() => onChange(o.value)}>
            {o.label}
          </Button>
        );
      })}
    </ButtonGroup>
  );
}
