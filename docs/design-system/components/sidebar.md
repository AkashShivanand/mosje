# Sidebar — component spec

> Figma: SAMAVESH DS › Sidebar page, section `1 · Sidebar`. Masters: `Sidebar` (4286:428),
> `Sidebar/Item · Level 1` (4286:285), `Sidebar/Item · Level 2` (4286:361),
> `Sidebar/Item · Level 3` (57129:1097), `Sidebar/GroupLabel` (57137:1189),
> `Sidebar/CollapseControl` (57137:1199), `Sidebar/Flyout` (57137:1200).
> Code: `packages/design-system/components/navigation/sidebar/`. Rebuilt 2026-09-05 from the
> audit in the Portal Sidebar Audit; the three pre-existing sets were mutated in place so their
> keys and every existing instance link survive.

## What it is

The portal app-shell left rail. Three levels: a level-1 item with an icon; level-2 entries under
a group; level-3 leaves under a level-2 group. Two modes: expanded (`layout/sidebar/width`, 300)
and collapsed (`layout/sidebar/collapsedWidth`, 88). Below the tablet breakpoint it is a drawer
(`AppShell` renders the same `SidebarNav` in `SideSheet side="left"`), never a narrower column.

## Anatomy

| Part | Figma | Code |
|---|---|---|
| Rail | `Sidebar` — Mode, Menu slot, Footer slot, Show Control, Show Footer | `SidebarNav` root `<aside>` with one `<nav aria-label>` |
| Level-1 item | `Sidebar/Item · Level 1` — Mode × Type (Leaf/Group) × Open × State, Focused, Show Badge, Icon swap, Label, Show Child 2–5 | `groups[].items[]` — `<a>` for a page, `<button aria-expanded>` for a group |
| Level-2 entry | `Sidebar/Item · Level 2` — Placement (Inline/Flyout) × Type × Open × State, Focused, Label, Show Child 2–4 | `items[].children[]` |
| Level-3 leaf | `Sidebar/Item · Level 3` — State, Focused, Label | `children[].children[]` |
| Group label | `Sidebar/GroupLabel` — Mode × Show Divider, Label | `groups[].label` → `role="group" aria-labelledby` |
| Collapse control | `Sidebar/CollapseControl` — Mode, nested IconButton exposed; shown by `Show Control` (off by default) at the top | rendered at the top when `showCollapseControl && onCollapsedChange` |
| Flyout | `Sidebar/Flyout` — Title, Item 1–5 (Level 2, Placement=Flyout) | rendered for a collapsed group on click |

## Token map

| Property | Token |
|---|---|
| Rail width | `layout/sidebar/width` 300 · `layout/sidebar/collapsedWidth` 88 (added 2026-09-05) |
| Flyout width | `layout/sidebar/flyoutWidth` 240 (added 2026-09-05) |
| Rail padding · region gap · item gap | `padding/16` · `stack/12` · `stack/4`; control row `padding/4` (48) |
| Level-1 row | `padding/12` × `padding/16`, gap `inline/8`, radius `shape/16`, min-height `target/spacious` (48) |
| Level-2 / 3 row | `padding/12` × `padding/8`, radius `shape/8`, min-height `target/comfortable` (44) |
| Indent | level 2 `inline/40` · level 3 `inline/56` · flyout `inline/0` |
| Connector | trunk 16px left of the pill (24 for level 2, 40 for level 3), 16px arm, elbow `shape/6`, `stroke/1`, tail `cmp/divider/width`, `border/neutral/subtle` at rest; the path to the current page in `border/brand/primary/base`, drawn with `motion/reveal` |
| Type | level 1 `Label/label-1` · levels 2–3 `Body/body-2` · group label `Label/label-3` · flyout title `Title/title-3` |
| Rest | `text/neutral/base`, `icon/neutral/base` (stroke glyph), chevron `icon/neutral/subtle` |
| Hover | `bg/neutral/subtler` |
| Current | `bg/brand/primary/base` with `text/brand/primary/bolder`, `icon/brand/primary/bolder`, filled glyph |
| Level-2 group on the way to the current page | `text/brand/primary/bolder`, no tint (Figma `State=Ancestor`, Level 2 Group only); the level-1 holder is tinted like the page |
| Disabled | `text/neutral/disabled`, `icon/neutral/disabled` |
| Focus | `focus/ring` at `focus/width`, offset `focus/offset`; ring radius `shape/20` (L1) / `shape/12` (L2, L3) |
| Badge | count: the library Badge (primary, solid) · dot: `cmp/badge/dotSizeLg` in the Badge's fill `cmp/button/primary/bg` |
| Flyout | `shape/12`, `stroke/1` `border/neutral/subtle`, `elevation/dropdown`, `z/popover` |
| Motion | hover `motion/hover/*` · rail width `motion/collapse/*` |

## Decisions recorded (with the reason)

1. **Active ink is `bolder`, not `base`.** Measured from the library on 2026-09-05: `bolder` on
   `bg/brand/primary/base` is 7.75:1 in Blue and 15.15:1 in Navy; `base` is 5.74:1 / 12.05:1.
   Both pass AA today. The audit's "4.19:1" came from the code comment written when
   `text/brand/primary/base` was still `#0373DF`; the colour-system redesign had since moved it
   to `#005EB9`, and the old masters bound a remote `Text/Primary` from the Portal DS library
   rather than either. Bolder is kept because the code already used it and the current row
   should be the darkest ink on the rail, not because base fails.
2. **Hover is neutral.** The previous master painted hover in the same brand tint as Active, so
   moving the mouse over the rail made every row look like the current page.
3. **Item gap is `stack/4`, down from `stack/12`.** Material 3, Carbon and USWDS all list
   navigation items with 0–4px between rows; 12px on a ten-item rail cost 108px and read as
   a list of cards rather than one navigation.
4. **Levels 2 and 3 indent under the parent's text and keep the handoff's elbow connector.**
   The first rebuild tried a plain guide line per level; the owner preferred the original
   elbow, and it was right — the elbow says "this belongs to that" where a bare line only says
   "there is depth". The elbow no longer needs first/middle/last variants: each entry draws its
   own elbow and a tail, and a `Continues` boolean (off on the last entry) removes the tail.
   An open level-2 group extends its tail past its level-3 children so the trunk is unbroken.
   The trunk runs straight through every entry from the parent's edge; the elbow is a 6px arc
   and 16px arm that branch off it. Bending the trunk into the arm had left a 6px notch at every
   branch, visible at 4×.
14. **The level-1 holder is tinted; a level-2 group on the way is ink only.** The rail reads "you
    are in Applications, at Under Review": the level-1 item that holds the current page and the
    page itself are tinted, a level-2 group between them takes `text/brand/primary/bolder`
    without the tint, and the drawn connector carries the route. In Figma the level-2 case is
    `State=Ancestor` (Group items only); level 1 uses Active.
13. **Connectors are neutral; the path to the current page is drawn.** A brand tint on every
    connector made the tree noisy before anything was active. At rest the tree is
    `border/neutral/subtle` — structure, not signal. The connector from a group down to the
    current page is `border/brand/primary/base`, and in code it draws itself on navigation
    (`stroke-dashoffset` over `motion/reveal`, 400ms with the strong ease-out; instant under
    reduced motion) so the eye is led to the page rather than shown it. In Figma the same
    path is `Active Path=Yes` on the entries above the current page — it paints their trunk
    segments only, never their arm, because the route passes them without branching in — and
    the Active variant's own trunk-top and elbow are brand. References: Linear's project tree and Mintlify's docs nav both keep the tree
    neutral and move one brand indicator to the current item; the drawn line is the
    tree-shaped version of that indicator.
5. **Focused is a boolean, not a State value.** It composes with every state (a keyboard user's
   current item is Active and Focused), the same decision `Tabs / Tab` made.
6. **Group children are exposed nested instances, not a slot.** The Plugin API in this runtime
   has no `createSlot`, and a cloned slot becomes a plain frame inside a variant set. Five
   exposed children (four at level 2) with `Show Child N` booleans cover every handoff group
   counted (max five), and further Level 2 instances can be placed after the group in the Menu
   slot when a role needs more.
7. **Collapsed groups open a flyout that lists one level.** Atlassian and Material's expanded
   rail both stop at one level in a flyout; a second flyout beside a 88px rail is unreachable
   on touch.
8. **The rail's own collapse control is optional, off by default, and sits at the top.** The
   masthead's `Navbar/MenuToggle` already drives the same state; two controls for one action is
   what a system exists to remove. Where a shell has no masthead toggle, `Show Control` turns on
   a visible 40px IconButton in a 48px row above the first item — never at the foot, which is
   below the fold on a laptop. It replaced a hover-only 16px strip with a `col-resize` cursor
   that toggled instead of resizing. Glyphs match `Navbar/MenuToggle`.
9. **A badge count becomes a dot when collapsed** rather than disappearing.
10. **Level-2 and level-3 rows are 44px** (`target/comfortable`), matching Figma; code had
    drifted to 40.
12. **Five children per group is the design limit, seven the ceiling.** Material caps a rail at
    seven; every group in the handoff has five or fewer. Figma exposes five (`Show Child 2–5`),
    with the overflow route of placing further Level 2 instances after the group in the Menu
    slot. Code never truncates — a role's data must not break navigation — but
    `warnOversizedGroups` reports any group past seven in development and is unit-tested.
11. **The current page's icon is filled.** Code passes `fill` to `Icon` (the Material Symbols
    FILL axis). In Figma the nested glyph carries the library text style `Icon/24/Filled` on
    every Active variant and `Icon/24/Outline` elsewhere — the two styles the Iconography page
    already publishes. Never switch the font family to fake a fill; the style holds the axis.

## Benchmark

| System | Levels | Current indicator | Collapsed form | What we took |
|---|---|---|---|---|
| USWDS side navigation | 1–3 | left border bar + bold | none (in-page nav) | three levels, indentation, "show the current page, keep labels short" |
| Material 3 navigation rail (expressive) | 1 + sections | tinted pill (secondary container) | 96dp rail, 3–7 destinations, expands to drawer | tinted pill, collapsed ↔ expanded as one component, badge on icon |
| IBM Carbon UI shell left panel | 2 (one nested) | 4px interactive bar | 48px rail with flyout on hover | flyout for a collapsed group, `aria-expanded` on a submenu header |
| Shopify Polaris navigation | 2 | tinted row | none | icon on level 1 only, quieter type on children |
| Atlassian side navigation | 3 via nested flyouts | tinted row | collapsed with flyouts | one flyout level only; nested flyouts rejected for touch |
| UX4G 3.0 | 1 | tinted row | none | 300 rail width, 48 item height, 24 icon |

## Handoff migration (deferred, per instruction)

The `MoSJE Portal — Handoff` file still instances the deprecated Portal DS sets (24 rails, 260
items, 20 child items). They are to be migrated screen by screen, one at a time, to the SAMAVESH
`Sidebar`, resetting the four hand-resized rails (260/268/280 → bound 300), naming the twenty
"Label" children, and leaving one current item per rail.

## Open items

- Publish the SAMAVESH library after this pass (a script cannot publish).
- `AppShell` adoption by the eight portal shells, one per PR, so the drawer below tablet is real.
- Storybook and Playwright coverage of the flyout and the three-level tree.
