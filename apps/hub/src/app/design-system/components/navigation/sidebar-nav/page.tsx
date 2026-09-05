import type { Metadata } from "next";
import * as React from "react";

import {
  ComponentDocPage,
  type A11yItem,
  type PropDef,
} from "@/components/design-system/docs-kit";

import { Specimen } from "./specimen";

export const metadata: Metadata = {
  title: "Sidebar Nav — Design System",
  description: "The portal app-shell left navigation, three levels deep.",
};

/**
 * The item shapes are data the extractor cannot see through `groups`, so they
 * are written here and kept in step with `sidebar/types.ts`.
 */
const ITEM_PROPS: PropDef[] = [
  {
    name: "groups[].label",
    type: "string",
    description:
      "Section label. The accessible name of the group's role=\"group\" in both modes; visually hidden when collapsed, where a divider carries the break.",
  },
  {
    name: "items[].icon",
    type: "string",
    required: true,
    description: "Material Symbols name, rendered through <Icon>. In the collapsed rail the icon is all that is left.",
  },
  {
    name: "items[].badge",
    type: "number | string",
    description: "A count in the expanded rail; a dot on the icon when collapsed, so the signal survives the collapse.",
  },
  {
    name: "items[].children",
    type: "SidebarNavChild[]",
    description: "Level-2 entries. The item becomes a disclosure group; in the collapsed rail it opens a flyout listing these.",
  },
  {
    name: "children[].children",
    type: "SidebarNavLeaf[]",
    description: "Level-3 leaves under a level-2 group. A leaf has no icon, no badge and no children — level 3 is the floor.",
  },
  {
    name: "*.disabled",
    type: "boolean",
    description: "Named, not operable: the page stays in the list so a reader learns it exists, but the link loses its href.",
  },
];

const A11Y: A11yItem[] = [
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    status: "verified",
    evidence:
      "Each level is a real nested <ul>; a labelled section is role=\"group\" with aria-labelledby, and the label is only visually hidden when collapsed.",
    description: "The three-level hierarchy and the section grouping are structural, not visual.",
  },
  {
    criterion: "1.4.3 Contrast (Minimum)",
    level: "AA",
    status: "verified",
    evidence:
      "Current text and icon bind text|icon/brand/primary/bolder on bg/brand/primary/base: 7.75:1 in Blue mode and 15.15:1 in Navy, measured from the library on 2026-09-05. Every other ink on the rail clears 10:1; disabled is 3.06:1 by design.",
    description: "The current page is readable in both brand modes.",
  },
  {
    criterion: "2.1.1 Keyboard",
    level: "A",
    status: "verified",
    evidence:
      "Groups are <button aria-expanded>; a collapsed group is <button aria-haspopup> whose flyout focuses its first link on open and returns focus on Escape. The collapse control is an IconButton.",
    description: "Every row, at every level and in both modes, is reachable and operable without a pointer.",
  },
  {
    criterion: "2.4.7 Focus Visible",
    level: "AA",
    status: "verified",
    evidence: "Every row draws focus/ring at focus/width and focus/offset on :focus-visible; the Figma master carries the same ring as a Focused boolean.",
    description: "Focus is drawn, not implied.",
  },
  {
    criterion: "2.4.8 Location",
    level: "AAA",
    status: "verified",
    evidence: "`pathname` is required, so the rail always knows and marks which page is current, and opens its ancestors.",
    description: "A portal rail that cannot say where you are is a list of links.",
  },
  {
    criterion: "2.5.8 Target Size (Minimum)",
    level: "AA",
    status: "verified",
    evidence: "Level-1 rows are target/spacious (48); level-2 and level-3 rows are target/comfortable (44); the optional collapse control is a 40px IconButton in a 48px row; rows are stack/4 apart.",
    description: "Every target clears the 24px floor with room; the estate's 44px preference holds at every level.",
  },
  {
    criterion: "4.1.2 Name, Role, Value",
    level: "A",
    status: "verified",
    evidence:
      "A collapsed item's accessible name carries its label and badge count; a group exposes aria-expanded; the flyout is role=\"group\" named by the group; the control exposes aria-expanded and aria-controls.",
    description: "What the collapsed rail hides visually it still says.",
  },
];

export default function Page(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Sidebar Nav"
      status="Stable"
      summary="The portal app-shell left navigation: three levels of pages under icon-led items, an expanded 300px mode and a collapsed 88px rail that keeps every signal, and the current page derived from the pathname you pass it."
      figma={{ node: "portalSidebar" }}
      specimen={<Specimen />}
      propsFrom="SidebarNavProps"
      props={ITEM_PROPS}
      a11y={A11Y}
      whenToUse={{
        use: [
          "The left rail of a portal application shell — every signed-in page.",
          "Up to three levels: a level-1 page or group, level-2 pages, level-3 leaves.",
        ],
        avoid: [
          "A content page's section index — that is ContentNav, which needs no icons and no client bundle.",
          "A fourth level. If a role needs one, the information architecture needs the work, not the component.",
          "More than seven children in a group. Five is the design limit; past seven, development warns — split the group or move the list onto the section's own page.",
          "`showCollapseControl` in a shell whose masthead already has the toggle. Two controls for one action; the masthead's is the default.",
          "Omitting `pathname`: without it nothing is marked current.",
          "Hard-coding the rail's width or height in a shell. It binds layout/sidebar/width; the height is the shell's, via AppShell.",
        ],
      }}
      related={[
        { label: "App Shell", href: "/design-system/components/layout/app-shell", reason: "the shell it is the rail of, and the drawer it becomes below tablet" },
        { label: "Content Nav", href: "/design-system/components/navigation/content-nav", reason: "for a document, not an application" },
        { label: "Tooltip", href: "/design-system/components/feedback/tooltip", reason: "names a collapsed item on hover and focus" },
        { label: "Icon Button", href: "/design-system/components/actions/icon-button", reason: "the collapse control" },
      ]}
    />
  );
}
