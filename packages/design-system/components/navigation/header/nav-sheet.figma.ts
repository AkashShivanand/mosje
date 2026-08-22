// url=<SAMAVESH>?node-id=55327-3503
// source=packages/design-system/components/navigation/header/nav-sheet.tsx
// component=NavSheet
//
// The mobile navigation overlay. `SiteHeader` renders it below 1024px; import it
// directly only for a surface that needs mobile navigation without a masthead.
//
// NOT A MODAL. It is a disclosure region with its own close control, so it does not
// trap focus — the same rule the Chatbot panel carries. Escape closes it.
//
// PROPERTY COVERAGE
//   State -> deliberatelyOmitted. Default / Expanded / Mega are RUNTIME STATES of one
//            component (nothing open · one row open · a flattened organisation list
//            open), not variants a caller picks. There is no `state` prop and there
//            must not be one: the sheet owns which row is expanded.
import figma from "figma";

export default {
  example: figma.code`<NavSheet
  open={sheetOpen}
  onClose={() => setSheetOpen(false)}
  nav={NAV}
  emblemSrc={\`\${basePath}/images/National-Emblem-logo.svg\`}
  brandLines={{ org: "Government of India", ministry: "…", department: "…" }}
  homeHref="/website"
  actions={<a href="/login">Login</a>}
/>`,
  imports: ['import { NavSheet } from "@mosje/design-system"'],
  id: "navbar-nav-sheet",
  metadata: { nestable: true },
};
