"use client";
import * as React from "react";
import { ScheduleGrid, type ScheduleAxis, type ScheduleEntry } from "@mosje/design-system";

const DAYS: ScheduleAxis[] = [
  { id: "mon", label: "Monday", sublabel: "1 September" },
  { id: "tue", label: "Tuesday", sublabel: "2 September" },
  { id: "wed", label: "Wednesday", sublabel: "3 September" },
];
const SLOTS: ScheduleAxis[] = [
  { id: "s1", label: "09:00", sublabel: "to 10:30" },
  { id: "s2", label: "11:00", sublabel: "to 12:30" },
  { id: "s3", label: "15:00", sublabel: "to 16:30" },
];
const ENTRIES: ScheduleEntry[] = [
  { id: "e1", columnId: "mon", rowId: "s1", title: "Literacy class", detail: "Common room · 14 residents" },
  { id: "e6", columnId: "mon", rowId: "s1", title: "Visitors' hour", detail: "Reception", tone: "info" },
  { id: "e2", columnId: "mon", rowId: "s3", title: "Medical check", detail: "Dr Sanyal", tone: "info" },
  { id: "e3", columnId: "tue", rowId: "s2", title: "Tailoring training", detail: "Skill room · 9 residents", href: "#tailoring" },
  { id: "e4", columnId: "wed", rowId: "s1", title: "Counselling", detail: "Warden's office", tone: "success" },
  { id: "e5", columnId: "wed", rowId: "s3", title: "Fire drill", detail: "All residents", tone: "warning" },
];

const CELL: React.CSSProperties = { display: "flex", flexDirection: "column", gap: "var(--sa-stack-8)" };
const CAPTION: React.CSSProperties = {
  fontSize: "var(--sa-type-label-2-size)", lineHeight: "var(--sa-type-label-2-lh)",
  color: "var(--sa-text-neutral-subtle)", margin: 0,
};

/** Every arrangement: a full week including a crowded cell and a linked entry, and an empty week. */
export function SchedulePlayground(): React.JSX.Element {
  return (
    <div style={{ padding: "var(--sa-padding-40)", background: "var(--sa-bg-neutral-subtle)",
      borderRadius: "var(--sa-shape-8)", display: "grid", gap: "var(--sa-stack-24)" }}>
      <div style={CELL}>
        <ScheduleGrid columns={DAYS} rows={SLOTS} entries={ENTRIES}
          caption="Daily programme, week of 1 September 2026" />
        <p style={CAPTION}>
          Monday 09:00 holds two entries, which is what a real week looks like. Tailoring training
          is a link; everything else is a record. Tone colours the leading rule only.
        </p>
      </div>
      <div style={CELL}>
        <ScheduleGrid columns={DAYS} rows={SLOTS} entries={[]}
          caption="Daily programme, week of 8 September 2026"
          emptyText="No programme has been recorded for this week." />
        <p style={CAPTION}>Nothing scheduled: the table gives way to a sentence rather than drawing an empty grid.</p>
      </div>
    </div>
  );
}
