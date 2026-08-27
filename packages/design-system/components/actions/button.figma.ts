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
 * Figma `Sub-type` → `ButtonAppearance`. Exhaustive, and now 1:1 with code.
 *
 * `Tonal` was REMOVED from the Figma set on 2026-08-27, in the same migration that
 * removed it from code: its fill and border were the same pale wash, so it had no
 * findable edge (1.21–1.52:1 against a 3:1 requirement). UX4G 3.0 still publishes a
 * Tonal button; theirs measures 1.41:1 against a white page, so this is a deliberate,
 * measured divergence from the standard rather than an oversight — quality-first, per
 * `.claude/rules/standards-precedence.md`.
 */
const appearance = instance.getEnum("Sub-type", {
  Filled: "filled",
  Outlined: "outlined",
  Text: "text",
});

/**
 * Figma `Tone` → `ButtonTone`. Added 2026-08-27; the axis crosses `Sub-type`, which is
 * what lets each intent keep its own border on a brand surface.
 */
const tone = instance.getEnum("Tone", {
  Default: "default",
  Inverse: "inverse",
});

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

/**
 * The `Icon` VARIANT axis is gone. It was three options multiplying all 720 variants for
 * something that is two independent yes/no choices — the exact case
 * `.claude/rules/component-authoring.md` §4 says to push to properties. Removing it took
 * the set from 720 to 240 and paid for the `Tone` axis twice over.
 */
const showLeft = instance.getBoolean("Show Left Icon");
const showRight = instance.getBoolean("Show Right Icon");

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
      ${tone === "inverse" ? figma.code`tone="inverse"` : ""}
      size="${size}"
      ${disabled ? "disabled" : ""}
      ${iconCode && showLeft ? figma.code`iconLeft={${iconCode}}` : ""}
      ${iconCode && showRight ? figma.code`iconRight={${iconCode}}` : ""}
    >
      ${label}
    </Button>
  `,
  imports: ['import { Button } from "@mosje/design-system"'],
  id: "button",
  metadata: { nestable: true },
};
