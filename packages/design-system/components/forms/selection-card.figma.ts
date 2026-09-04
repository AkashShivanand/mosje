// url=<SAMAVESH>?node-id=55530-2932
// source=packages/design-system/components/forms/radio.tsx
// component=Radio
import figma from "figma";

const instance = figma.selectedInstance;

/**
 * ONE Figma set serves BOTH atoms' card variant: `Control` decides which component the
 * snippet names. It was `radio-card` — kebab-case, dependent on a radio set from another
 * file, seeded with live TG-portal copy — until 2026-09-04.
 */
const control = instance.getEnum("Control", {
  Radio: "Radio",
  Checkbox: "Checkbox",
});

const checked = instance.getEnum("Checked", { Off: false, On: true });

/** Presentation variant — only `Disabled` is a prop. See checkbox.figma.ts. */
const disabled = instance.getEnum("State", {
  Enabled: false,
  Hover: false,
  Focused: false,
  Pressed: false,
  Disabled: true,
});

const title = instance.getString("Title");
const description = instance.getString("Description");
const showDescription = instance.getBoolean("Show Description");
const showIcon = instance.getBoolean("Show Icon");
const icon = instance.getInstanceSwap("Icon");
const iconCode = icon && icon.type === "INSTANCE" ? icon.executeTemplate().example : undefined;
const invalid = instance.getBoolean("Invalid");

/*
 * The nested Radio / Checkbox instance is exposed for its Size and the description toggle
 * only; its Label is switched off because the card's Title IS the label. Not read here.
 * `name` / `value` (radio) have no Figma property — form decisions, placeholders below.
 */

export default {
  example:
    control === "Checkbox"
      ? figma.code`
    <Checkbox
      variant="card"
      label="${title}"
      ${showDescription ? figma.code`description="${description}"` : ""}
      ${showIcon && iconCode ? figma.code`icon={${iconCode}}` : ""}
      ${checked ? "defaultChecked" : ""}
      ${invalid ? "invalid" : ""}
      ${disabled ? "disabled" : ""}
    />
  `
      : figma.code`
    <Radio
      variant="card"
      name="group-name"
      value="option-value"
      label="${title}"
      ${showDescription ? figma.code`description="${description}"` : ""}
      ${showIcon && iconCode ? figma.code`icon={${iconCode}}` : ""}
      ${checked ? "defaultChecked" : ""}
      ${invalid ? "invalid" : ""}
      ${disabled ? "disabled" : ""}
    />
  `,
  imports: ['import { Checkbox, Radio } from "@mosje/design-system"'],
  id: "selection-card",
  metadata: { nestable: true },
};
