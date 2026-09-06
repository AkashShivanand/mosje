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
| Rail | `Sidebar` — Mode, Show Identity, Menu slot, Footer slot, Show Footer | `SidebarNav` root `<aside>` with one `<nav aria-label>` |
| Portal identity | `Sidebar/PortalIdentity` — Mode, Mark (org-logo swap), Name, Expansion, Show Expansion, Show Control, Show Divider | `identity` prop `{ name, expansion, mark, href }`; names the nav landmark |
| Level-1 item | `Sidebar/Item · Level 1` — Mode × Type (Leaf/Group) × Open × State, Focused, Show Badge, Icon swap, Label, Show Child 2–5 | `groups[].items[]` — `<a>` for a page, `<button aria-expanded>` for a group |
| Level-2 entry | `Sidebar/Item · Level 2` — Placement (Inline/Flyout) × Type × Open × Position (Middle/Last) × State, Focused, Active Path, Label, Show Child 2–4 | `items[].children[]` |
| Level-3 leaf | `Sidebar/Item · Level 3` — Position × State, Focused, Active Path, Label | `children[].children[]` |
| Group label | `Sidebar/GroupLabel` — Mode × Show Divider, Label | `groups[].label` → `role="group" aria-labelledby` |
| Collapse control | `Sidebar/CollapseControl` — Mode, nested IconButton exposed; lives in `Sidebar/PortalIdentity` behind its `Show Control` (off by default) | rendered in the identity row, or a 48px top row without one, when `showCollapseControl && onCollapsedChange` |
| Flyout | `Sidebar/Flyout` — Title, Item 1–5 (Level 2, Placement=Flyout) | rendered for a collapsed group on click |

## Token map

| Property | Token |
|---|---|
| Rail width | `layout/sidebar/width` 300 · `layout/sidebar/collapsedWidth` 88 (added 2026-09-05) |
| Flyout width | `layout/sidebar/flyoutWidth` 240 (added 2026-09-05) |
| Rail padding · region gap · item gap | `padding/16` · `stack/12` · `stack/4`; control row `padding/4` (48) |
| Level-1 row | `padding/12` × `padding/16`, gap `inline/8`, radius `shape/16`, min-height `target/spacious` (48) |
| Level-2 / 3 row | `padding/12` × `padding/8`, radius `shape/8`, min-height `target/comfortable` (44) |
| Indent | level 2 `inline/40` · level 3 `inline/64` (its trunk under the first letter of the parent's label) · flyout `inline/0` |
| Connector | one straight trunk 16px left of the pill (24 for level 2, 48 for level 3), `cmp/divider/width`; every entry branches off it with a `shape/6` elbow leaving the trunk at 16 into the pill at the row centre, 16px arm; the last entry ends the trunk at its elbow; all `border/neutral/subtle`; the path to the current page in `border/brand/primary/base`, drawn with `motion/reveal` |
| Type | level 1 `Label/label-1` · levels 2–3 `Body/body-2` · group label `Label/label-3` · flyout title `Title/title-3` |
| Rest | `text/neutral/base`, `icon/neutral/base` (stroke glyph), chevron `icon/neutral/subtle` |
| Hover | `bg/neutral/subtler` |
| Current | `bg/brand/primary/base` with `text/brand/primary/bolder`, `icon/brand/primary/bolder`, filled glyph |
| Level-2 group on the way to the current page | the same tint and `text/brand/primary/bolder` as the current page (Figma `State=Ancestor`, Level 2 Group only), so the route from the level-1 holder to the page reads as tinted rows joined by the drawn line |
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
4. **Levels 2 and 3 indent under the parent's text with the handoff's elbow connector on every
   entry, branching off one straight trunk.** The elbow is the handoff's own mark and the
   decision was to keep it, so the work went into the trunk: it never bends (bending it into the
   arm left a notch at every branch) and it never stops beneath an arc (stopping it at 16 and
   resuming at 22 left a hole beside every curve — the gap three rounds of review kept finding).
   The trunk runs straight through each row and the `stack/4` gap into the next entry, the arc
   overlays it, and only the last entry ends it, at 16, where its elbow takes over. In Figma that
   end is `Position=Last` on Level 2 and Level 3 (`Middle` on the rest; the flag moves when a child
   is shown or hidden — it replaced the `Continues` boolean); in code it is `:last-child`. An open
   level-2 group in the middle carries the trunk past its level-3 children.
15. **The rail names its portal.** The masthead carries the Ministry and the SAMAVESH mark;
    nothing else said which of twenty portals a signed-in user was in, and SAMBAL solved it with
    a loose 300×96 frame above the rail on every screen. `Sidebar/PortalIdentity` makes that a
    master: an org-logo mark at 40, the short name (`Title/title-3`), the department's full
    name (`Body/body-3`, two lines), a link home, the rail's collapse control as its trailing
    slot; collapsed keeps the mark and moves the name to a tooltip. GOV.UK's service name and
    Atlassian's product header are the precedents. Off on login screens, which name the portal
    already.
14. **Every row on the route is tinted: the level-1 holder, the level-2 group on the way, the
    page.** Ink-only on the level-2 group was tried first (bolder ink, no tint) and reviewed at
    zoom: with the ancestor untinted, the level-3 page read as cut off from its parents — the
    drawn line arrives at the ancestor's edge and restarts under its label, and nothing bridged
    the jump. Two fixes were mocked side by side: threading the route through the ancestor's
    edge into level 3, or tinting the ancestor. Tint was chosen (2026-09-05): the surface bridges
    the gap and the three rows read as one route. In Figma this is `State=Ancestor` (Group items
    only) carrying `bg/brand/primary/base`; level 1 uses Active. The level-3 list indents by
    `inline/64` — 24 more than its parent, not 16 — so its trunk falls at 48, under the first
    letter of the parent's label, and the level-3 tree visibly hangs from the word it belongs to.
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
- Give every portal shell an `identity` (name, expansion, org-logo, home) — the block is built; the twenty configs are not.
- Storybook and Playwright coverage of the flyout and the three-level tree.

16. **A group may have no page of its own.** `href` is optional on a level-1 item and a level-2
    entry that carries `children`. The row then only opens and closes; it is highlighted when a
    page inside it is current; in the collapsed rail its flyout lists the pages, and for a
    level-2 group without a page the flyout lists them beneath its name — the one case the
    flyout goes a level deeper, because otherwise those pages would be unreachable from the
    collapsed rail. Giving such a group its first child's href, as Eutthan's data did, lit two
    rows for one page. Needed by NMBA's committee group and the treatment-centre registers.

17. **Every portal rail is this component, and a gate says so.** On 2026-09-05 six shells drew
    their own rail (NMBA admin, public and treatment centre, Eutthan, PM-AJAY, SMILE's mobile
    drawer), each drifted from the others and from Figma. All six now render `SidebarNav` from
    the nav data they had; drawers host it inside `SideSheet`. `npm run check:sidebar-adoption`
    fails a portal file that renders a navigating `<aside>` or a `<nav>` named "navigation"
    without it; an allowlist names the files that are neither, with a reason each. Given up in
    the migration: PM-AJAY's per-item sub-labels and the treatment centre's icons below level 1.

18. **Every shell passes an identity, and the rail's control is off wherever the masthead
    toggles.** On 2026-09-05 a reviewer put e-Anudaan's rail beside the Figma master and saw
    two differences: no identity block, and a second collapse control under a masthead that
    already had one. Both were usage, not the component — the Figma `Sidebar` shows
    PortalIdentity by default and leaves the control to the masthead. Every shell now passes
    `identity` (name, the department's full name from the portal's own metadata title, the
    registry mark, the portal's home), four shells dropped `showCollapseControl`, and
    `check:sidebar-adoption` fails a rendered SidebarNav without an identity.

19. **The rail is sticky by construction, pinned under the masthead, and has no ground of its
    own.** Shells had been adding `sticky top-0 h-[…]` utilities, which win the cascade over the
    component and pinned the rail at 0 — under a 134px sticky masthead, hiding its first rows.
    `.ds-sidebar` now pins to `--sa-header-stuck`, the offset SiteHeader publishes, and caps its
    height to what is left of the viewport, so a long menu scrolls inside the rail. And it carries
    no fill: every handoff rail sits on the page canvas, and the Figma master had drifted to
    `bg/neutral/base`, which read as a white panel on the portals' muted page. Master and code
    both dropped it on 2026-09-05; the flyout and the mobile drawer keep their grounds because
    they float.

20. **The identity block carries the SAMAVESH wash, and the mark sits bare on it.** The handoff's
    original identity (MoSJE Portal — Handoff, node 11184:102857) is a 300×96 block with padding 16,
    a saffron fade — `bg/brand/secondary/base`, the handoff's saffron at 8% over white, to nothing, top to bottom — and the mark bare
    at 56 with the name and the department's full name beside it. The library master and the code
    now draw exactly that: the block bleeds to the rail's edges (negative margins in code, the
    identity outside the rail's padding in Figma), the mark is the registry OrgLogo with its new
    `tile` off (`Tile` boolean in Figma; the wash is its ground), 56 expanded and 40 collapsed, and
    the expansion may run to three lines because SAMBAL's name needs them. Hairline, radius and
    ground on OrgLogo are properties now, so a surface with its own ground can switch them off
    instead of drawing a mark by hand.

21. **The masthead collapses the rail; the identity never hosts a control.** A collapse control
    beside the brand competed with the portal's name for the same 268px and, for SAMBAL's three-line
    name, had no room at all. Every portal masthead already has `onToggleNav`, so the five shells
    that still drew the rail's own control (SCW admin and user, NHAPOA citizen, NMBA admin and
    public) now wire the masthead instead, and `check:sidebar-adoption` fails any portal shell that
    passes `showCollapseControl`. The prop survives only for a shell with neither a masthead toggle
    nor an identity, where it draws a 48px row above the first item. In Figma, `Show Control` is
    removed from PortalIdentity.
