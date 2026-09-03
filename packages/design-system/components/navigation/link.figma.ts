// url=<SAMAVESH>?node-id=2723-1598
// source=packages/design-system/components/navigation/link.tsx
// component=Link
import figma from "figma";

const instance = figma.selectedInstance;

const label = instance.getString("Label");

const size = instance.getEnum("Size", {
  Large: "lg",
  Default: "md",
  Small: "sm",
});

/**
 * Figma `Variant` → `LinkVariant`.
 *
 * `Inline` is always underlined and `Standalone` underlines on hover. That is not a
 * style choice: WCAG 2.2 §1.4.1 says a link inside a block of text must not be
 * distinguished from the surrounding text by colour alone, and colour is the only other
 * signal a text link has. The Figma set had NO underline at rest on any variant until
 * 2026-09-03, which is the same defect drawn.
 */
const variant = instance.getEnum("Variant", {
  Inline: "inline",
  Standalone: "standalone",
});

/**
 * Figma `State` is a presentation variant, not a prop — hover, pressed, focused and
 * visited are states the browser owns. Only `Disabled` has a real counterpart.
 */
const disabled = instance.getEnum("State", {
  Default: false,
  Hover: false,
  Pressed: false,
  Focused: false,
  Visited: false,
  Disabled: true,
});

/**
 * Figma `External` → the `external` prop, 1:1.
 *
 * IT WAS LEFT OUT OF THE FIRST CUT AND THAT WAS WRONG. The reasoning — that `external`
 * changes the rendered anchor rather than its resting appearance — ignored the fact that
 * the open-in-new glyph IS a visible affordance a designer has to be able to place, and
 * on an estate that links out to other ministries constantly it is the commonest link on
 * the page. Caught in review, not by a gate.
 *
 * One boolean here drives four things in code: `target`, `rel="noopener noreferrer"`, the
 * trailing glyph, and the visually hidden "(opens in a new tab)" that GIGW 3.0 requires.
 */
const external = instance.getBoolean("External");

/*
 * `download`, `tone` and the two icon slots remain props in code with no variant here.
 * They are declared omitted in the fixture rather than silently dropped.
 */

export default {
  example: figma.code`
    <Link
      href="#"
      variant="${variant}"
      size="${size}"
      ${external ? "external" : ""}
      ${disabled ? "disabled" : ""}
    >
      ${label}
    </Link>
  `,
  imports: ['import { Link } from "@mosje/design-system"'],
  id: "link",
  metadata: { nestable: true },
};
