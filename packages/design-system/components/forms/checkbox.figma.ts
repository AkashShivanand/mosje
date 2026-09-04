// url=<SAMAVESH>?node-id=15-664
// source=packages/design-system/components/forms/checkbox.tsx
// component=Checkbox
import figma from "figma";

const instance = figma.selectedInstance;

/**
 * Figma `Size` → `SelectionSize`. Exhaustive: all 3 options mapped. Medium is the
 * default on both sides — 20px box in a 44px hit area.
 */
const size = instance.getEnum("Size", {
  Small: "sm",
  Medium: "md",
  Large: "lg",
});

/**
 * Figma `Checked` → `checked` / `indeterminate`. One VARIANT axis with three values
 * rather than two booleans, because "checked AND indeterminate" is a state the native
 * control cannot draw; a designer must not be able to ask for it. `indeterminate` is a
 * separate prop in code (Carbon, Spectrum, Polaris shape), so `On` and `Indeterminate`
 * emit different props rather than one union value.
 */
const checked = instance.getEnum("Checked", {
  Off: "off",
  On: "on",
  Indeterminate: "indeterminate",
});

/**
 * Figma `State` is a presentation variant, not a prop. Hover / Focused / Pressed are
 * CSS states the browser owns — emitting them as props would invent an API the
 * component does not have. Only `Disabled` has a real counterpart, the native attribute.
 */
const disabled = instance.getEnum("State", {
  Enabled: false,
  Hover: false,
  Focused: false,
  Pressed: false,
  Disabled: true,
});

const label = instance.getString("Label");
const showLabel = instance.getBoolean("Show Label");
const description = instance.getString("Description");
const showDescription = instance.getBoolean("Show Description");
/** `Invalid` paints the error edge; the message itself is `error`, which has no Figma text (a group owns it). */
const invalid = instance.getBoolean("Invalid");
const required = instance.getBoolean("Required");

/*
 * Deliberately NOT modelled in Figma, and therefore not read here:
 *   readOnly       — visually identical to Enabled minus the pointer cursor; a state, not a look.
 *   labelPlacement — as an axis it would double the set to 90 for a mirror image.
 *   hideLabel      — `Show Label` off is the same picture; code keeps the name for AT.
 *   variant="card" — a separate `Selection Card` set on the Radio page, mapped by its own template.
 */

export default {
  example: figma.code`
    <Checkbox
      ${showLabel ? figma.code`label="${label}"` : figma.code`label="${label}" hideLabel`}
      ${showDescription ? figma.code`description="${description}"` : ""}
      ${size !== "md" ? figma.code`size="${size}"` : ""}
      ${checked === "on" ? "defaultChecked" : ""}
      ${checked === "indeterminate" ? "indeterminate" : ""}
      ${invalid ? "invalid" : ""}
      ${required ? "required" : ""}
      ${disabled ? "disabled" : ""}
    />
  `,
  imports: ['import { Checkbox } from "@mosje/design-system"'],
  id: "checkbox",
  metadata: { nestable: true },
};
