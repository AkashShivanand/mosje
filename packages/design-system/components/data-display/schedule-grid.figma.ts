// url=<SAMAVESH>?node-id=57618-798
// source=packages/design-system/components/data-display/schedule-grid.tsx
// component=ScheduleGrid
import figma from "figma";

const instance = figma.selectedInstance;

/**
 * The axis is whether there is anything to show, which is `entries.length` — not
 * a prop. An empty schedule renders `emptyText` in place of the table; an empty
 * CELL renders nothing at all, deliberately.
 *
 * The semantics that make this component worth using — the caption, scope="col",
 * scope="row" — are code. Figma has no table primitive to carry them.
 */
const state = instance.getEnum("State", {
  Populated: "populated",
  Empty: "empty",
});

const entries =
  state === "empty"
    ? "[]"
    : `[
        { id: "e1", columnId: "mon", rowId: "s1", title: "Literacy class", detail: "Common room · 14 residents" },
        { id: "e2", columnId: "wed", rowId: "s3", title: "Fire drill", detail: "All residents", tone: "warning" },
      ]`;

export default {
  example: figma.code`
    <ScheduleGrid
      caption="Daily programme, week of 1 September 2026"
      emptyText="No programme has been recorded for this week."
      columns={[{ id: "mon", label: "Monday", sublabel: "1 September" }]}
      rows={[{ id: "s1", label: "09:00", sublabel: "to 10:30" }]}
      entries={${entries}}
    />
  `,
  imports: ['import { ScheduleGrid } from "@mosje/design-system"'],
  id: "schedule-grid",
  metadata: { nestable: false },
};
