// url=<SAMAVESH>?node-id=57547-48756
// source=packages/design-system/components/forms/slider.tsx
// component=Slider
import figma from "figma";

const instance = figma.selectedInstance;

const size = instance.getEnum("Size", {
  Md: "md",
  Sm: "sm",
});

const state = instance.getEnum("State", {
  Default: "default",
  Disabled: "disabled",
});

/**
 * Built on a real `<input type="range">`, which is where the arrow keys, Home, End,
 * Page Up, Page Down, the announced value and the announced bounds come from. None
 * of that is drawn in Figma and none of it should be re-implemented in code.
 *
 * `marks` — the labelled ticks under a track — is a code prop with no Figma property.
 * Compose them beneath the instance where a design needs them.
 */
export default {
  example: figma.code`
    <Slider
      size="${size}"
      value={value}
      onValueChange={setValue}
      min={0}
      max={50}
      step={5}
      showValue
      ${state === "disabled" ? "disabled" : ""}
    />
  `,
  imports: ['import { Slider } from "@mosje/design-system"'],
  id: "slider",
  metadata: { nestable: false },
};
