"use client";
import * as React from "react";
import { TimeSlot, type TimeSlotGroup } from "@mosje/design-system";

const GROUPS: TimeSlotGroup[] = [
  {
    label: "Morning",
    slots: [
      { id: "0930", label: "09:30 – 10:00", remaining: 4 },
      { id: "1000", label: "10:00 – 10:30", remaining: 1 },
      { id: "1030", label: "10:30 – 11:00", remaining: 0 },
      { id: "1100", label: "11:00 – 11:30", remaining: 6 },
      { id: "1130", label: "11:30 – 12:00", remaining: 2 },
    ],
  },
  {
    label: "Afternoon",
    slots: [
      { id: "1400", label: "14:00 – 14:30", remaining: 8 },
      { id: "1430", label: "14:30 – 15:00", remaining: 0 },
      { id: "1500", label: "15:00 – 15:30", remaining: 5 },
      { id: "1530", label: "15:30 – 16:00", disabled: true, unavailableReason: "Centre closed" },
    ],
  },
];

const UNTRACKED: TimeSlotGroup[] = [
  {
    label: "Wednesday, 10 September",
    slots: [
      { id: "a", label: "10:00 – 11:00" },
      { id: "b", label: "11:00 – 12:00" },
      { id: "c", label: "12:00 – 13:00", disabled: true, unavailableReason: "Lunch" },
      { id: "d", label: "14:00 – 15:00" },
    ],
  },
];

/** Every arrangement: capacity shown, a full slot, a closed slot, nothing chosen, and capacity untracked. */
export function TimeSlotPlayground(): React.JSX.Element {
  const [chosen, setChosen] = React.useState<string | null>("1000");
  const [untracked, setUntracked] = React.useState<string | null>(null);

  return (
    <div
      style={{
        padding: "var(--sa-padding-32)",
        background: "var(--sa-bg-neutral-base)",
        border: "var(--sa-cmp-divider-width) solid var(--sa-border-neutral-subtle)",
        borderRadius: "var(--sa-shape-8)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--sa-stack-40)",
      }}
    >
      <TimeSlot
        label="Appointment time"
        description="Choose a window. You may reschedule once, up to 24 hours before."
        groups={GROUPS}
        value={chosen}
        onChange={setChosen}
      />
      <TimeSlot
        label="Visiting hour"
        groups={UNTRACKED}
        value={untracked}
        onChange={setUntracked}
      />
    </div>
  );
}
