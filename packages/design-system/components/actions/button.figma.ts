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
 * DIVERGENCE 1 — `Tonal` maps to `outlined`, because `tonal` NO LONGER EXISTS in code.
 * It was retired on 2026-08-27: its fill and border were the same pale wash, so the
 * control had no edge against the page (1.21:1 to 1.52:1 against a 3:1 requirement) and
 * darkening the border would have made it `outlined` anyway. Figma still has the variant,
 * so a designer can still pick it; this mapping emits the nearest honest thing rather
 * than a prop the component would reject. Remove the Figma variant to close this.
 *
 * DIVERGENCE 2 — the `inverse` TONE (a button on a solid brand surface) has no Figma
 * variant at all, so a designer cannot specify it and this mapping cannot emit it.
 * Resolve by adding a Tone property in Figma, not by removing it from code.
 *
 * Both are logged in the parity ledger.
 */
const appearance = instance.getEnum("Sub-type", {
  Filled: "filled",
  Outlined: "outlined",
  Text: "text",
  Tonal: "outlined",
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
