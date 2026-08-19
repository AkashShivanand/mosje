// url=<SAMAVESH>?node-id=55061-700
// source=packages/design-system/components/layout/divider.tsx
// component=Divider
//
// Code Connect template for the SAMAVESH Divider — the estate's thin rule. This file IS
// the instruction the Figma MCP server hands an agent that opens the component in Dev
// Mode, so it carries the usage rules as well as the snippet. See
// .claude/rules/component-authoring.md §12.
//
// PROPERTY COVERAGE — both Figma properties are mapped; none are omitted:
//   Orientation -> orientation (Vertical | Horizontal)
//   Tone        -> tone        (Default | Inverse | Inverse subtle)
//
// TWO PROPS HAVE NO FIGMA COUNTERPART, deliberately, and they are NOT emitted here:
//   `length`     — the master draws a 20px specimen because that is the height of the
//                  glyph beside it in the AccessibilityBar. It is a specimen, not a
//                  default. Omitting it makes the rule STRETCH, which is what a
//                  consumer wants almost every time.
//   `decorative` — an accessibility decision Figma cannot express. It defaults to true
//                  (aria-hidden), which is correct for a rule between controls in a
//                  row. A rule that is a genuine thematic break passes false and gets
//                  a real <hr>.
import figma from "figma";

const instance = figma.selectedInstance;

const orientation = instance.getEnum("Orientation", {
  Vertical: "vertical",
  Horizontal: "horizontal",
});

// Figma spells the third tone with a space; the code prop is kebab-case.
const tone = instance.getEnum("Tone", {
  Default: "default",
  Inverse: "inverse",
  "Inverse subtle": "inverse-subtle",
});

export default {
  example: figma.code`<Divider orientation="${orientation}" tone="${tone}" />`,
  imports: ['import { Divider } from "@mosje/design-system"'],
  id: "divider",
  metadata: { nestable: true },
};
