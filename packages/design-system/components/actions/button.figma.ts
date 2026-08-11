// url=<SAMAVESH>?node-id=609-283111
// source=packages/design-system/components/actions/button.tsx
// component=Button
import figma from "figma";

const instance = figma.selectedInstance;

const label = instance.getString("Text");

/** Figma `Type` → `ButtonVariant`. Exhaustive: all 3 options mapped. */
const variant = instance.getEnum("Type", {
  Primary: "primary",
  Success: "success",
  Danger: "danger",
});

/**
 * Figma `Sub-type` → `ButtonAppearance`. Exhaustive over what Figma HAS.
 *
 * DIVERGENCE: the code type also carries `inverse` and `inverseOutlined` (for a
 * button on a solid brand surface, e.g. a navy page header). The Figma component
 * set has no variant for either, so a designer cannot specify them and this
 * mapping cannot emit them. Logged in the parity ledger — resolve by adding the
 * two variants in Figma, not by removing them from code.
 */
const appearance = instance.getEnum("Sub-type", {
  Filled: "filled",
  Outlined: "outlined",
  Text: "text",
  Tonal: "tonal",
});

/** Figma `Size` → `ButtonSize`. Figma's "Default" is the code default `md`. */
const size = instance.getEnum("Size", {
  Large: "lg",
  Default: "md",
  Small: "sm",
});

/**
 * Figma `State` is a presentation variant, not a prop. Hover / Pressed / Focused
 * are CSS states the browser owns — emitting them as props would invent an API
 * the component does not have. Only `Disabled` has a real counterpart, and it is
 * the native attribute.
 */
const disabled = instance.getEnum("State", {
  Default: false,
  Hover: false,
  Pressed: false,
  Focused: false,
  Disabled: true,
});

/** Figma `Icon` places the swapped icon before or after the label. */
const iconSide = instance.getEnum("Icon", {
  None: "none",
  Left: "left",
  Right: "right",
});

const icon = instance.getInstanceSwap("Change Icon");
let iconCode;
if (icon && icon.type === "INSTANCE") {
  iconCode = icon.executeTemplate().example;
}

export default {
  example: figma.code`
    <Button
      variant="${variant}"
      appearance="${appearance}"
      size="${size}"
      ${disabled ? "disabled" : ""}
      ${iconCode && iconSide === "left" ? figma.code`iconLeft={${iconCode}}` : ""}
      ${iconCode && iconSide === "right" ? figma.code`iconRight={${iconCode}}` : ""}
    >
      ${label}
    </Button>
  `,
  imports: ['import { Button } from "@mosje/design-system"'],
  id: "button",
  metadata: { nestable: true },
};
