// url=<SAMAVESH>?node-id=57547-2631
// source=packages/design-system/components/forms/time-picker.tsx
// component=TimePicker
import figma from "figma";

const instance = figma.selectedInstance;

/**
 * `Open` and `Closed` are not props — the field opens its own list when a reader asks
 * for it. `Error` is: the field reports an entry it could not read, and keeps the
 * typed text so the reader can correct it instead of retyping it.
 *
 * 9:05, 09.05 and 0905 all normalise to 09:05. `9:5` is REFUSED, because it could
 * mean 09:05 or 09:50 and there is no honest way to choose between them.
 */
const state = instance.getEnum("State", {
  Closed: "closed",
  Open: "open",
  Error: "error",
  Disabled: "disabled",
});

export default {
  example: figma.code`
    <TimePicker
      label="Hearing time"
      value={time}
      onChange={setTime}
      min="10:00"
      max="17:00"
      step={30}
      hint="24-hour clock, for example 14:30"
      ${state === "error" ? figma.code`invalid error="Enter a time as hours and minutes, for example 09:05."` : ""}
      ${state === "disabled" ? "disabled" : ""}
    />
  `,
  imports: ['import { TimePicker } from "@mosje/design-system"'],
  id: "time-picker",
  metadata: { nestable: false },
};
