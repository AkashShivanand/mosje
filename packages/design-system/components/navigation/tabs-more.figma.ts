// url=<SAMAVESH>?node-id=55514-848
// source=packages/design-system/components/navigation/tabs.tsx
// component=Tabs
//
// Code Connect template for `Tabs / More` — the overflow trigger.
//
// THIS COMPONENT HAS NO REACT COUNTERPART, AND THE TEMPLATE SAYS SO RATHER THAN
// PRETENDING OTHERWISE. It is mapped because an UNMAPPED master is worse than an
// honestly-mapped one: in Dev Mode an unmapped node hands an agent nothing, and
// "nothing" is indistinguishable from "not looked into" — so the agent invents a
// component. What it emits instead is the truth plus the two prohibitions that
// stop the invention.
//
// It deliberately does NOT emit JSX. There is no `<TabsMore>`, no `overflow`
// prop, and no `<Tabs overflow>` — emitting any of them would be a mapping to an
// API that does not exist, which §12a of component-authoring.md forbids in the
// same breath as "never invent a code prop".
//
// PROPERTY COVERAGE — all 3 Figma properties are accounted for:
//   Size    (variant)          -> the LIST's `size`, which the trigger matches so
//                                 the row keeps one baseline (36 / 44 / 48). It is
//                                 not a prop OF the trigger.
//   State   (variant)          -> Default / Hover are CSS. `Open` describes the
//                                 MENU, not a selection: this control is never the
//                                 selected item, and nothing in code models it yet.
//   Focused (Focused#55514:0)  -> `:focus-visible`, which the browser owns. Same
//                                 reasoning as Tabs / Tab: it is a BOOLEAN rather
//                                 than a State value because it COMPOSES with every
//                                 state.
import figma from "figma";

const instance = figma.selectedInstance;

/**
 * Figma `Size`. Exhaustive: all 3 options. Surfaced in the emitted note so a
 * reader knows which tab height this trigger was drawn against — the trigger
 * always matches the list, and a mismatched pair breaks the row's baseline.
 */
const size = instance.getEnum("Size", {
  S: "s",
  M: "m",
  L: "l",
});

/** Figma `State`. Exhaustive: all 3 options. `Open` is the MENU's state. */
const state = instance.getEnum("State", {
  Default: "closed",
  Hover: "closed",
  Open: "open",
});

export default {
  example: figma.code`// Tabs / More has NO React counterpart. Do not hand-roll one from this node.
//
// What ships today: a horizontal <Tabs> list that outgrows its container
// SCROLLS (overflow-x: auto). There is no \`overflow\` prop to turn on, and
// no <TabsMore> export. This master is the DESIGN for work that has not
// been built.
//
// Drawn against size="${size}"; the trigger always matches the list's own
// size so the row keeps one baseline. Menu state here is "${state}".
//
// IF YOU BUILD IT, TWO THINGS ARE NOT NEGOTIABLE:
//   1. It is a MENU BUTTON, not a tab: role="button", aria-haspopup="menu",
//      aria-expanded. NEVER role="tab" — that promises a panel that does not
//      exist, and a screen-reader user is told there are more sections than
//      there are.
//   2. It is never the selected item. State=Open means its MENU is open, not
//      that it is the active section.
//
// AND IT IS NOT THE FIRST ANSWER TO A CROWDED TAB ROW. The label-overflow
// escalation is: shorten the label -> move to track="none" and let the row
// scroll -> only then reach for this.`,
  id: "tabs-more",
  metadata: { nestable: false },
};
