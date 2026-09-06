"use client";
import * as React from "react";
import { TimePicker } from "@mosje/design-system";

/** Every arrangement: free entry, bounded to office hours, in error, and disabled. */
export function TimePickerPlayground(): React.JSX.Element {
  const [free, setFree] = React.useState("14:30");
  const [office, setOffice] = React.useState("");

  return (
    <div
      style={{
        padding: "var(--sa-padding-32)",
        background: "var(--sa-bg-neutral-base)",
        border: "var(--sa-cmp-divider-width) solid var(--sa-border-neutral-subtle)",
        borderRadius: "var(--sa-shape-8)",
        display: "grid",
        gap: "var(--sa-inline-24)",
        gridTemplateColumns: "repeat(auto-fit, minmax(min(16rem, 100%), 1fr))",
      }}
    >
      <TimePicker
        label="Appointment time"
        hint="24-hour clock, as hh:mm — for example 14:30."
        value={free}
        onChange={setFree}
      />
      <TimePicker
        label="Visit time"
        hint="Between 09:30 and 17:30."
        min="09:30"
        max="17:30"
        step={15}
        value={office}
        onChange={setOffice}
      />
      <TimePicker
        label="Time the incident occurred"
        required
        value=""
        onChange={() => {}}
        error="Enter a time in 24-hour form, for example 14:30."
      />
      <TimePicker label="Closing time" disabled value="17:30" onChange={() => {}} />
    </div>
  );
}
