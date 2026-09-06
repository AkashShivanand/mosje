// url=<SAMAVESH>?node-id=57547-48771
// source=packages/design-system/components/forms/slider.tsx
// component=RangeSlider
import figma from "figma";

const instance = figma.selectedInstance;

const state = instance.getEnum("State", {
  Default: "default",
  Disabled: "disabled",
});

/**
 * Two range inputs, one above the other, each separately focusable and separately
 * announced. The lower thumb CLAMPS at the upper rather than swapping with it: a
 * reader dragging one thumb past the other expects it to stop, not to find they are
 * now dragging the other one.
 *
 * `label` is required, and `fromLabel` / `toLabel` name the two ends — without them a
 * screen reader announces two sliders with the same name and no way to tell which end
 * is which.
 */
export default {
  example: figma.code`
    <RangeSlider
      label="Monthly pension amount"
      fromLabel="Lowest"
      toLabel="Highest"
      value={range}
      onValueChange={setRange}
      min={0}
      max={10000}
      step={500}
      showValue
      ${state === "disabled" ? "disabled" : ""}
    />
  `,
  imports: ['import { RangeSlider } from "@mosje/design-system"'],
  id: "range-slider",
  metadata: { nestable: false },
};
