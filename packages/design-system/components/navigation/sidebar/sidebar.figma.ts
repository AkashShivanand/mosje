// url=<SAMAVESH>?node-id=4286-428
// source=packages/design-system/components/navigation/sidebar/types.ts
// component=SidebarNav
//
// Code Connect template for the SAMAVESH `Sidebar` — the portal app-shell left rail. This
// file IS the instruction the Figma MCP server hands an agent that opens the component in
// Dev Mode, so it carries the usage rules as well as the snippet. See
// .claude/rules/component-authoring.md §12.
//
// PROPERTY COVERAGE — three Figma properties are mapped; one is declared omitted:
//   Mode          -> collapsed   (Expanded = false | Collapsed = true)
//   Show Identity -> identity    (Sidebar/PortalIdentity at the head; its Name, Expansion
//                                 and Mark become the identity object's fields. No control
//                                 lives there: the masthead's toggle collapses the rail.)
//   Show Footer   -> footer      (a slot in Figma, a ReactNode in code)
//   Menu         -> OMITTED, deliberately. The Menu slot holds Sidebar/Item · Level 1 and
//                   Sidebar/GroupLabel instances. In code that whole tree is the `groups`
//                   prop — plain data: groups[].items[], each item with children (level 2),
//                   each child with children (level 3). There is no <SidebarItem> component
//                   and there must not be; an item is data, exactly as a Tab is on Tabs.
//
// TWO PROPS HAVE NO FIGMA COUNTERPART and are emitted as placeholders the developer fills:
//   `pathname` — the ONLY source of the current state at every level. Figma marks a variant
//                Active by hand; code derives it from the route, so the snippet passes the
//                router's pathname rather than inventing an `active` flag.
//   `onCollapsedChange` — the controlled-state handler. The Figma control swaps Mode on
//                click; in code the shell owns the state so the masthead toggle can drive
//                the same value.
import figma from "figma";

const instance = figma.selectedInstance;

const collapsed = instance.getEnum("Mode", {
  Expanded: "false",
  Collapsed: "true",
});

const showIdentity = instance.getBoolean("Show Identity");
const showFooter = instance.getBoolean("Show Footer");

const identityLine = showIdentity
  ? '\n  identity={{ name: "NOS", expansion: "National Overseas Scholarship", mark: <OrgLogo org="nos" size="md" />, href: "/portals/nos" }}'
  : "";
const footerLine = showFooter ? "\n  footer={<StatusFooter />}" : "";
// The collapse control is a property of the nested Sidebar/PortalIdentity; the
// masthead's Navbar/MenuToggle is the default control, so it is off unless a
// shell has no masthead toggle.
const controlLine = "";

export default {
  example: figma.code`<SidebarNav
  groups={navGroups}
  pathname={pathname}
  collapsed={${collapsed}}${identityLine}${controlLine}${footerLine}
/>`,
  imports: ['import { SidebarNav, OrgLogo } from "@mosje/design-system"'],
  id: "sidebar-nav",
  metadata: { nestable: false },
};
