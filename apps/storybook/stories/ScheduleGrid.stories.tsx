import type { Meta, StoryObj } from "@storybook/react";
import { ScheduleGrid, type ScheduleAxis, type ScheduleEntry } from "@mosje/design-system";

/**
 * A timetable — Garima Greh's daily programme, an attendance week, a district's
 * camp calendar.
 *
 * **Use it** where entries mean something only in relation to a day and a time.
 *
 * **Do not use it** for a list of dated events with no time structure — that is a
 * List, or an Event List. And not for a single day's agenda, which is a list.
 *
 * **It is a real `<table>`, and that is the whole design.** Built from divs, a
 * screen reader reads a stream of session titles with no way to say which day or
 * hour any of them is in; as a table with row and column headers the same entry
 * is announced as "Monday, 10:00 to 11:00, Literacy class".
 *
 * `columns` and `rows` are the two axes, each `{ id, label, sublabel? }` — the
 * sublabel carries a date under a day name. `entries` place themselves by
 * `columnId` and `rowId`, and carry `title`, an optional `detail`, a `tone` that
 * colours the leading rule only, and an `href` when the entry leads somewhere.
 * An entry with no `href` is a record, not a control.
 *
 * `caption` is required and visible: "Daily programme" and "Attendance, week of
 * 1 September" are different tables that look identical. `emptyText` is what an
 * empty schedule says — an empty CELL says nothing at all, because there is
 * genuinely nothing scheduled and a screen reader reading a dash forty times is
 * noise.
 *
 * It scrolls horizontally in its own labelled region with a tab stop, which is
 * what makes a wide table operable rather than merely visible.
 */
const meta = {
  title: "Data Display/ScheduleGrid",
  component: ScheduleGrid,
  parameters: { layout: "padded" },
} satisfies Meta<typeof ScheduleGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

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
  { id: "e2", columnId: "mon", rowId: "s3", title: "Medical check", detail: "Dr Sanyal", tone: "info" },
  { id: "e3", columnId: "tue", rowId: "s2", title: "Tailoring training", detail: "Skill room · 9 residents", href: "#tailoring" },
  { id: "e4", columnId: "wed", rowId: "s1", title: "Counselling", detail: "Warden's office", tone: "success" },
  { id: "e5", columnId: "wed", rowId: "s3", title: "Fire drill", detail: "All residents", tone: "warning" },
];

export const Playground: Story = {
  args: { columns: DAYS, rows: SLOTS, entries: ENTRIES, caption: "Daily programme, week of 1 September 2026" },
};

/** Two entries in one cell, which is what a real week looks like. */
export const CrowdedCell: Story = {
  args: {
    columns: DAYS,
    rows: SLOTS,
    caption: "Daily programme, week of 1 September 2026",
    entries: [
      ...ENTRIES,
      { id: "e6", columnId: "mon", rowId: "s1", title: "Visitors' hour", detail: "Reception", tone: "info" },
    ],
  },
};

/** Nothing scheduled. The table gives way to a sentence rather than drawing an empty grid. */
export const Empty: Story = {
  args: {
    columns: DAYS,
    rows: SLOTS,
    entries: [],
    caption: "Daily programme, week of 8 September 2026",
    emptyText: "No programme has been recorded for this week.",
  },
};
