// url=<SAMAVESH>?node-id=55514-848
// source=packages/design-system/components/navigation/tabs.tsx
// component=Tabs
//
// Code Connect template for `Tabs / More` — the overflow trigger.
//
// IT IS NOT PLACED DIRECTLY. There is no `<TabsMore>` export and there must not
// be: the trigger is rendered by `<Tabs>` when `overflow` is on and the row
// cannot show every tab, and it needs the tablist beside it to have anything to
// talk about. So this template emits the TABS call that produces it, not a
// component of its own. An agent that writes `<TabsMore />` has invented an API.
//
// (Until 2026-08-18 this master had no counterpart at all and the template said
// so, emitting only prose. It now has one.)
//
// PROPERTY COVERAGE — all 3 Figma properties are accounted for:
//   Size    (variant)          -> the LIST's `size`. The trigger always matches
//                                 the tabs so the row keeps one baseline; it is
//                                 not a prop OF the trigger.
//   State   (variant)          -> Default / Hover are CSS. `Open` describes the
//                                 MENU, and the menu's open state is internal —
//                                 there is no prop to force it, deliberately: a
//                                 menu opened by anything other than the user is
//                                 a menu that appears unbidden.
//   Focused (Focused#55514:0)  -> `:focus-visible`, which the browser owns. Same
//                                 reasoning as Tabs / Tab: it is a BOOLEAN
//                                 rather than a State value because it COMPOSES
//                                 with every state.
import figma from "figma";

const instance = figma.selectedInstance;

/** Figma `Size`. Exhaustive: all 3 options. Emitted on `<Tabs>`, not here. */
const size = instance.getEnum("Size", {
  S: "s",
  M: "m",
  L: "l",
});

/** Figma `State`. Exhaustive: all 3. `Open` is the MENU's state, not a selection. */
const state = instance.getEnum("State", {
  Default: "closed",
  Hover: "closed",
  Open: "open",
});

export default {
  example: figma.code`// Tabs / More is rendered BY <Tabs>, never placed on its own.
// Set \`overflow\` and the trigger appears only when tabs are actually hidden.
<Tabs
  tabs={tabs}
  active={active}
  onChange={setActive}
  idBase={idBase}
  ariaLabel="Application sections"
  size="${size}"
  overflow
/>

// Drawn against size="${size}"; the trigger always matches the list. The menu
// state here is "${state}" — internal, and there is no prop to force it open.
//
// TWO THINGS THAT ARE NOT NEGOTIABLE, and neither is visible in the geometry:
//   1. It is a MENU BUTTON, not a tab: role="button", aria-haspopup="menu",
//      aria-expanded. NEVER role="tab" — that promises a panel that does not
//      exist, and a screen-reader user is told there are more sections than
//      there are. It renders OUTSIDE the role="tablist" for the same reason,
//      which is also what keeps it pinned while the tabs scroll.
//   2. It does NOT remove tabs from the tablist. Every tab stays rendered,
//      focusable and arrow-reachable; the menu is a POINTER shortcut to the ones
//      scrolled out of view. Moving tabs into it would cost them their
//      role="tab", their aria-controls and their place in the roving tabindex.
//
// \`overflow\` also stops the tabs sharing the track equally, because equal-width
// tabs never overflow — they just truncate harder, and the trigger would never
// appear. It is still not the first answer to a crowded row: shorten the label,
// then move to track="none", then reach for this.`,
  imports: ['import { Tabs } from "@mosje/design-system"'],
  id: "tabs-more",
  metadata: { nestable: false },
};
