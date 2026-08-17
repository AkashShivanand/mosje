// url=<SAMAVESH>?node-id=55489-870
// source=packages/design-system/components/navigation/tabs.tsx
// component=Tabs
//
// Code Connect template for the SAMAVESH `Tabs` container — the tablist itself.
// This file IS what the Figma MCP server hands an agent in Dev Mode, so it
// carries the usage rules as well as the snippet.
// See .claude/rules/component-authoring.md §12.
//
// PROPERTY COVERAGE — all 5 Figma properties are accounted for:
//   Orientation   (variant)                -> orientation
//   Track         (variant)                -> track
//   Show divider  (Show divider#55489:0)   -> divider
//   Tabs          (Tabs#55511:10, SLOT)    -> the `tabs` ARRAY, built from the
//                                             connected `Tabs / Tab` children.
//                                             NOT `getSlot()`: a slot emits JSX
//                                             children, and `<Tabs>` takes data,
//                                             not children.
//   Show overflow (Show overflow#55514:10) -> DELIBERATELY OMITTED. It reveals
//                                             the `Tabs / More` menu trigger,
//                                             which has NO code counterpart yet.
//                                             There is no `overflow` prop to map
//                                             it to, and inventing one would
//                                             emit an API that does not exist.
//                                             See the note below.
//
// PROPERTY NAMES: `getString`/`getBoolean`/`getEnum` take the DESIGNER-FACING
// name ("Show divider"), which is what every worked example in the Code Connect
// reference uses. The full internal keys are recorded above so a future session
// can identify each property unambiguously — and, if name resolution ever
// fails, try the suffixed key instead.
//
// ─────────────────────────────────────────────────────────────────────────────
// RULES — the things an agent gets wrong from the geometry alone
//
// 1. NEVER write a `<Tab>` element. A tab is DATA (`TabDef`), passed as the
//    `tabs` array. `<Tabs>` renders the buttons itself because it owns the
//    roving `tabindex`, the arrow-key routing and the live region.
// 2. `indicator` and `size` are LIST props, even though Figma carries them on
//    each tab. A list whose tabs disagree about size is a defect. They are read
//    here off the first connected child, through its `metadata.props`.
// 3. INDICATOR AND TRACK PAIR — only two of the six combinations are correct.
//    `track="enclosed"` takes `indicator="pill"`. `track="none"` takes
//    `"underline"` when horizontal and `"rail"` when vertical. A pill on an
//    open list has nothing to sit in; an underline inside a filled track draws
//    a second edge a few pixels inside the first.
// 4. `divider` is MEANINGLESS when `track="enclosed"` — the track already has
//    its own border, and the code ignores the prop there. Do not emit it as a
//    way to "turn off" the track edge.
// 5. THE PARENT OWNS `active` AND RENDERS ONE PANEL AT A TIME. Never render
//    every `TabPanel` and hide the inactive ones with CSS: they stay in the
//    accessibility tree and in the tab order, so a keyboard user walks through
//    controls they cannot see.
// 6. `idBase` MUST BE UNIQUE PER TABLIST — pass `React.useId()`. Two tab sets
//    sharing one `idBase` emit duplicate ids and silently mislink
//    `aria-controls` to the wrong panel.
// 7. NEVER SWAP `aria-disabled` FOR THE NATIVE `disabled` ATTRIBUTE on a
//    disabled tab. Native `disabled` drops the button out of the accessibility
//    tree, so a screen-reader user loses the fact that the section exists at
//    all. The component marks it `aria-disabled` and skips it with the arrow
//    keys instead — that is deliberate, and removing it is a WCAG regression.
// 8. THERE IS NO OVERFLOW TRIGGER IN CODE. `Tabs / More` (55514:848 — Size
//    S/M/L × State Default/Hover/Open, plus `Focused#55514:0`) is built in
//    Figma and has no React counterpart; a horizontal list that outgrows its
//    container simply scrolls. It is deliberately UNMAPPED rather than mapped
//    to a guess. When it is built it is a MENU BUTTON, not a tab:
//    `role="button"`, `aria-haspopup="menu"`, `aria-expanded` — never
//    `role="tab"`, which would promise a panel that does not exist.
//
// TOKENS — the track is `bg/neutral/subtler` with a 1px `border/neutral/subtle`
// at `shape/lg`, inset by `layout/tab/track` (4). The indicator is
// `layout/tab/indicator` (2) thick in `border/brand/primary/base`, or a filled
// `bg/brand/primary/bolder` pill. Heights (36 / 44 / 48) are HUGS of padding
// plus line-height — never set a fixed tab height.
import figma from "figma";

const instance = figma.selectedInstance;

/** Figma `Orientation`. Exhaustive: both options. */
const orientation = instance.getEnum("Orientation", {
  Horizontal: "horizontal",
  Vertical: "vertical",
});

/** Figma `Track`. Exhaustive: both options. */
const track = instance.getEnum("Track", {
  None: "none",
  Enclosed: "enclosed",
});

const divider = instance.getBoolean("Show divider");

/**
 * Every connected `Tabs / Tab` child, in document order. Resolved by Code
 * Connect id rather than by layer name: the master names them "Tab 1".."Tab 3",
 * but a real instance carries however many tabs the designer added, renamed
 * freely. `findConnectedInstances` already enforces `type === "INSTANCE"` and
 * `hasCodeConnect()`.
 */
const tabNodes = instance.findConnectedInstances((node) => node.codeConnectId() === "tabs-tab");

/**
 * The `tabs` array, and the two list-level props that Figma stores per tab.
 *
 * These are STRINGS from `metadata.props`, which is the one thing a child may
 * pass upward — an `example` is a ResultSection[] and joining those renders
 * "[object Object]". Joining strings is fine and is what the reference does.
 */
const defs = tabNodes.map((node) => node.executeTemplate().metadata?.props?.def).filter(Boolean);
const first = tabNodes[0]?.executeTemplate().metadata?.props;
const indicator = first?.indicator ?? (track === "enclosed" ? "pill" : "underline");
const size = first?.size ?? "m";

/**
 * Which tab is selected. Figma marks it with `State=Selected` on the tab; code
 * holds it as an index in the PARENT's state, so the snippet seeds
 * `React.useState` with it rather than passing it as a literal.
 */
const activeIndex = Math.max(
  0,
  tabNodes.findIndex((node) => node.executeTemplate().metadata?.props?.selected === "true"),
);

const tabsArray = defs.join(",\n  ");

export default {
  example: figma.code`function ApplicationSections() {
  const idBase = React.useId();
  const [active, setActive] = React.useState(${activeIndex});

  const tabs: TabDef[] = [
  ${tabsArray}
  ];

  return (
    <>
      <Tabs
        tabs={tabs}
        active={active}
        onChange={setActive}
        idBase={idBase}
        ariaLabel="Application sections"
        orientation="${orientation}"
        track="${track}"
        indicator="${indicator}"
        size="${size}"
        ${track === "none" && !divider ? "divider={false}" : ""}
      />
      {/* One panel at a time — never render them all and hide with CSS. */}
      <TabPanel idBase={idBase} tabId={tabs[active].id}>
        {/* section content */}
      </TabPanel>
    </>
  );
}`,
  imports: ['import { TabPanel, Tabs, type TabDef } from "@mosje/design-system"'],
  id: "tabs",
  metadata: { nestable: false },
};
