// url=<SAMAVESH>?node-id=609-283111
// source=packages/design-system/components/actions/button.tsx
// component=Button
import figma from "figma";

const instance = figma.selectedInstance;

const label = instance.getString("Text");

/**
 * Figma `Type` → `ButtonVariant`. Exhaustive: all 4 options mapped.
 *
 * `Neutral` WAS MISSING UNTIL 2026-09-03, and the comment here said "all 3 options
 * mapped" — an assertion that stopped being true the moment the axis grew. Figma
 * publishes 360 variants; a quarter of them are Neutral, and every one of those
 * handed a designer a snippet with no usable `variant` in Dev Mode. It is the one
 * intent the set's own description most wants people to reach for, because its
 * absence is why a routine chat reset once shipped in the estate's rejection red.
 *
 * A count in a comment is a claim that rots. This one is now gated: the set has a
 * fixture in `tools/code-connect-parity/figma-properties.json`, so
 * `npm run check:code-connect` fails when an axis option here has no counterpart
 * there. It had no fixture until 2026-09-03, which is why the gate reported Button
 * as unverified for months and nobody read the note.
 */
const variant = instance.getEnum("Type", {
  Primary: "primary",
  Success: "success",
  Danger: "danger",
  Neutral: "neutral",
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
 * the set from 1,080 to 360 — Size 3 x Type 4 x Sub-type 3 x State 5 x Tone 2 — and paid
 * for the `Tone` axis twice over.
 */
const showLeft = instance.getBoolean("Show Left Icon");
const showRight = instance.getBoolean("Show Right Icon");

/**
 * TWO swaps, one per side. Until 2026-08-27 a single `Change Icon` drove both, so a
 * designer could not put different glyphs on the two ends of a button — "Back ←" and
 * "→ Next" had to be the same arrow. Code has always had separate `iconLeft` and
 * `iconRight`; this is the Figma side catching up, and it matches UX4G 3.0's own
 * leading/trailing pair.
 */
/**
 * Figma `Loading` → the `loading` prop. Modelled as a BOOLEAN, not as UX4G's variant
 * axis: as a variant it would have doubled a set we had just halved, 360 back to 720, for
 * something that is a plain on/off. Same capability, a tenth of the surface.
 */
const loading = instance.getBoolean("Loading");

const leftIcon = instance.getInstanceSwap("Left Icon");
const rightIcon = instance.getInstanceSwap("Right Icon");
const leftCode = leftIcon && leftIcon.type === "INSTANCE" ? leftIcon.executeTemplate().example : undefined;
const rightCode = rightIcon && rightIcon.type === "INSTANCE" ? rightIcon.executeTemplate().example : undefined;

export default {
  example: figma.code`
    <Button
      variant="${variant}"
      appearance="${appearance}"
      ${tone === "inverse" ? figma.code`tone="inverse"` : ""}
      size="${size}"
      ${loading ? "loading" : ""}
      ${disabled && !loading ? "disabled" : ""}
      ${leftCode && showLeft ? figma.code`iconLeft={${leftCode}}` : ""}
      ${rightCode && showRight ? figma.code`iconRight={${rightCode}}` : ""}
    >
      ${label}
    </Button>
  `,
  imports: ['import { Button } from "@mosje/design-system"'],
  id: "button",
  metadata: { nestable: true },
};
