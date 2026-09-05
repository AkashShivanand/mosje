// url=<SAMAVESH>?node-id=4235-3169
// source=packages/design-system/components/navigation/header/site-header.tsx
// component=SiteHeader
//
// Code Connect template for the SAMAVESH Navbar. This file IS the instruction the
// Figma MCP server hands an agent that opens the masthead in Dev Mode, so it
// carries the rules as well as the snippet. See .claude/rules/component-authoring.md §12.
//
// ONE COMPONENT, THREE PLACEMENTS. Figma models them as three masters —
// Navbar/Website, Navbar/Portal and Navbar/Compact — because a Figma component
// cannot switch its own anatomy. Code does it with one `variant` prop. Do not
// generate three components.
//
//   Navbar/Website -> variant="website"   three tiers, sticky (since 2026-08-27)
//   Navbar/Portal  -> variant="portal"    three tiers, sticky, sidebar toggle
//   Navbar/Compact -> variant="compact"   ONE 68px tier, nav inline, no a11y bar
//
// `compact` had no master until 2026-08-24, which is why its burger drifted to a
// bare 40px icon while every other trigger in the estate was a 48px outlined
// IconButton. If you add a fourth placement, add its master in the same change.
//
// PROPERTY COVERAGE
//   Device            -> deliberatelyOmitted. Figma-only: in code these are CSS
//                        breakpoints, not a prop. Pinning one would freeze the
//                        masthead at a width and break the drawer below 1024px.
//   State             -> deliberatelyOmitted. A scroll state, not a prop. Since
//                        2026-09-05 the Figma `On Scroll` variants draw what the code
//                        renders: `collapseOnScroll` swaps the three tiers for ONE
//                        64px bar (56 on a phone) — emblem, controls, a 40px search
//                        IconButton, the CTA — with the accessibility bar scrolled
//                        away above it. (Until then Figma drew the retired lockup
//                        shrink, 146 -> 134, that code dropped on 2026-08-27.) It
//                        defaults ON wherever the header is sticky, and `sticky`
//                        defaults ON for every variant.
//   Menu              -> onToggleNav present. The property was published as
//                        "Show Menu" and READ as "Show Menu" here until 2026-09-05,
//                        while the master had long since called it "Menu" — the
//                        parity fixture carried the stale name, so the gate agreed
//                        with the template and both disagreed with Figma.
//   Profile           -> `account` present (the name / email block and avatar).
import figma from "figma";

const instance = figma.selectedInstance;

const showMenu = instance.getBoolean("Menu#55783:0");
const search = instance.getBoolean("Search#2210:0");
const login = instance.getBoolean("Login Signup#2198:4");
const profile = instance.getBoolean("Profile#56716:0");

export default {
  example: figma.code`<SiteHeader
  variant="portal"
  homeHref="/portals/<slug>"
  emblemSrc={\`\${basePath}/images/National-Emblem-logo.svg\`}
  brandLines={{ org: "Government of India", ministry: "…", department: "…" }}
  brandDivider
  ${showMenu ? figma.code`onToggleNav={toggleSidebar}
  navExpanded={!sidebarCollapsed}
  navControlsId="portal-sidebar"` : "/* no sidebar here — omit onToggleNav (login screens) */"}
  ${search ? figma.code`search={{ placeholder: "Search…", onSearch: (q) => router.push(\`/search?q=\${q}\`) }}` : ""}
  ${login ? figma.code`actions={<a href="/login">Login</a>}` : ""}
  cobranding={[{ src: digitalIndia, alt: "Digital India", height: 40 }]}
  ${profile ? figma.code`account={{ name: "…", email: "…" }}` : "/* Profile off — no account block */"}
  nav={NAV}
/>`,
  imports: ['import { SiteHeader } from "@mosje/design-system"'],
  id: "site-header",
  metadata: { nestable: false },
};
