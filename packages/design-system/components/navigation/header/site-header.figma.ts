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
//   Navbar/Website -> variant="website"   three tiers, static
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
//   State             -> deliberatelyOmitted. Figma-only. `collapseOnScroll` opts
//                        out of it; it defaults ON wherever the header is sticky,
//                        because On Scroll is a state of both mastheads, not an
//                        extra. It shrinks the BRAND ROW 100 -> 88 by dropping the
//                        lockup's ministry line. It does NOT collapse the
//                        accessibility bar — that is 46px in every Figma variant,
//                        and the prop's own docstring claimed otherwise for months.
//   Show Menu         -> onToggleNav present / absent
//   Search            -> search
//   Login Signup      -> actions
//
// ALWAYS EMIT `homeHref`. It defaults to "/", the hub root, so a masthead that
// omits it sends every logo click out of the zone it is on. There is no Figma
// property for it — the design cannot express a destination — which is exactly why
// it must be written into the snippet rather than left to the developer.
import figma from "figma";

const instance = figma.selectedInstance;

const showMenu = instance.getBoolean("Show Menu#55783:0");
const search = instance.getBoolean("Search#2210:0");
const login = instance.getBoolean("Login Signup#2198:4");

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
  account={{ name: "…", email: "…" }}
  nav={NAV}
/>`,
  imports: ['import { SiteHeader } from "@mosje/design-system"'],
  id: "site-header",
  metadata: { nestable: false },
};
