// url=<SAMAVESH>?node-id=57613-797
// source=packages/design-system/components/forms/date-range-picker.tsx
// component=DateRangePicker
import figma from "figma";

const instance = figma.selectedInstance;

/**
 * The axis is the shape of the VALUE, not a prop. Inverted is what the component
 * says when `from` is after `to`; it never swaps them, so there is no state to
 * pass in. Preset is simply a value that matches one of `presets`.
 */
const state = instance.getEnum("State", {
  Default: "default",
  Preset: "preset",
  Inverted: "inverted",
});

const value =
  state === "inverted"
    ? '{ from: "2026-09-30", to: "2026-09-01" }'
    : '{ from: "2026-07-01", to: "2026-09-30" }';

export default {
  example: figma.code`
    <DateRangePicker
      label="Period"
      value={${value}}
      onChange={setRange}
      hint="Both dates are included in the report."
      presets={[
        { id: "30d", label: "Last 30 days", from: "2026-08-07", to: "2026-09-06" },
        { id: "quarter", label: "This quarter", from: "2026-07-01", to: "2026-09-30" },
        { id: "fy", label: "This financial year", from: "2026-04-01", to: "2027-03-31" },
      ]}
    />
  `,
  imports: ['import { DateRangePicker } from "@mosje/design-system"'],
  id: "date-range-picker",
  metadata: { nestable: false },
};
