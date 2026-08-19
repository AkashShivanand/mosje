// url=<SAMAVESH>?node-id=2316-353
// source=packages/design-system/components/navigation/tabs.tsx
// component=TabDef
//
// Code Connect template for `Tabs / Tab` — ONE tab inside a tablist.
// This file IS what the Figma MCP server hands an agent in Dev Mode, so it
// carries the rules as well as the snippet.
// See .claude/rules/component-authoring.md §12.
//
// THERE IS NO `<Tab>` COMPONENT, AND THERE MUST NOT BE. In code a tab is DATA,
// not an element: `<Tabs>` takes `tabs: TabDef[]` and renders the buttons
// itself, because it owns the roving `tabindex`, the arrow-key routing and the
// live region — all of which are properties of the LIST, not of one item. So
// this template emits a `TabDef` object literal, not JSX. An agent that writes
// `<Tab label="…" />` has invented an API.
//
// PROPERTY COVERAGE — all 7 Figma properties are accounted for:
//   Label      (Label#55481:108)      -> TabDef.label
//   Show icon  (Show icon#55481:145)  -> TabDef.icon, resolved from the nested
//                                        Icon instance's own `icon` glyph name
//   Show badge (Show badge#55481:182) -> TabDef.badge
//   Focused    (Focused#55481:219)    -> DELIBERATELY OMITTED. Focus is
//                                        `:focus-visible`, which the browser
//                                        owns. It is a BOOLEAN in Figma rather
//                                        than a State value precisely because it
//                                        COMPOSES with every state: activation
//                                        is automatic, so a keyboard user's tab
//                                        is Selected *and* Focused at once. A
//                                        `focused` prop would be a lie.
//   Indicator  (variant)              -> surfaced upward via metadata.props;
//                                        it is a prop of `<Tabs>`, not of a tab
//   Size       (variant)              -> same — surfaced upward, never per tab
//   State      (variant)              -> Selected drives the list's `active`
//                                        index; Disabled drives TabDef.disabled;
//                                        Default and Hover are CSS
//
// INDICATOR AND SIZE ARE LIST-LEVEL. Figma puts them on the tab because that is
// where they are drawn; code puts them on `<Tabs>` because a list with two
// different tab sizes is a defect, not a feature. Never emit them per tab —
// tabs.figma.ts reads them off the first child through `metadata.props`.
//
// TOKENS — geometry: padding/{xs,s,m,l}, type label-1 (S, M) or body-1 (L),
// layout/tab/indicator (2) and layout/tab/track (4). Colour: text and icon
// neutral/subtle at rest, brand/primary/BOLDER when selected — never
// brand/primary/base, which measures 4.07:1 on the track and fails AA.
import figma from "figma";

const instance = figma.selectedInstance;

const label = instance.getString("Label");
const badge = instance.getBoolean("Show badge");
const showIcon = instance.getBoolean("Show icon");

/**
 * Figma `Indicator`. Exhaustive: all 3 options. Not emitted here — passed up.
 * Rail is the vertical counterpart of Underline and belongs with
 * `orientation="vertical"`.
 */
const indicator = instance.getEnum("Indicator", {
  Underline: "underline",
  Rail: "rail",
  Pill: "pill",
});

/** Figma `Size`. Exhaustive: all 3 options. Not emitted here — passed up. */
const size = instance.getEnum("Size", {
  S: "s",
  M: "m",
  L: "l",
});

/**
 * Figma `State`. Exhaustive over all 4 options, and it splits three ways rather
 * than mapping to one prop: `Selected` is the LIST's `active` index, `Disabled`
 * is the tab's own flag, and `Default`/`Hover` are CSS the browser drives.
 */
const disabled = instance.getEnum("State", {
  Default: false,
  Hover: false,
  Selected: false,
  Disabled: true,
});

const selected = instance.getEnum("State", {
  Default: false,
  Hover: false,
  Selected: true,
  Disabled: false,
});

/**
 * The glyph name, read from the Icon instance's own text node so that swapping
 * the icon in Figma changes the emitted code. `TabDef.icon` is a Material
 * Symbols Rounded NAME (a string), not an element — `<Tabs>` renders the
 * `<Icon>` itself, which is what lets it drive the `opsz` optical-size axis
 * from the list's `size` (16 / 20 / 24). An agent that emits `icon={<Icon …/>}`
 * has broken that.
 *
 * `traverseInstances` is required: the glyph lives inside the nested Icon
 * instance, and `findText` stops at instance boundaries without it.
 */
let glyph = "";
if (showIcon) {
  const glyphNode = instance.findText("icon glyph (Material Symbols, no role style)", {
    traverseInstances: true,
  });
  if (glyphNode && glyphNode.type === "TEXT") {
    glyph = glyphNode.textContent;
  }
}

/**
 * One `TabDef` literal, built as a STRING so `tabs.figma.ts` can join several of
 * them into an array. Only `metadata.props` may travel upward like this — an
 * `example` is a ResultSection[] and joining those yields "[object Object]".
 *
 * `id` is derived from the label because Figma has no id property. It is a
 * placeholder a developer is expected to replace with something stable: an id
 * that tracks the label breaks every `aria-controls` the moment the copy is
 * edited.
 */
const id = label
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-|-$/g, "");

const def =
  `{ id: "${id}", label: "${label}"` +
  (glyph ? `, icon: "${glyph}"` : "") +
  (badge ? ", badge: true" : "") +
  (disabled ? ", disabled: true" : "") +
  " }";

export default {
  example: figma.code`${def}`,
  imports: ['import type { TabDef } from "@mosje/design-system"'],
  id: "tabs-tab",
  metadata: {
    nestable: true,
    props: {
      def,
      indicator,
      size,
      selected: selected ? "true" : "false",
    },
  },
};
