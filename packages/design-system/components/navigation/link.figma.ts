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

/*
 * `external`, `download`, `tone` and the two icon slots have NO variant here, and are
 * declared omitted in the fixture rather than silently dropped.
 *
 * Each changes the rendered anchor rather than its resting appearance — `external` adds
 * a target, a rel, a trailing glyph and a hidden new-tab notice — and modelling four
 * booleans as variants would take a 36-variant set past 500 for choices a designer makes
 * on the instance. They are documented on the set instead.
 */

export default {
  example: figma.code`
    <Link
      href="#"
      variant="${variant}"
      size="${size}"
      ${disabled ? "disabled" : ""}
    >
      ${label}
    </Link>
  `,
  imports: ['import { Link } from "@mosje/design-system"'],
  id: "link",
  metadata: { nestable: true },
};
