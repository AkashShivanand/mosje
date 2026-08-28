// url=<SAMAVESH>?node-id=4235-3652
// source=packages/design-system/components/navigation/header/brand-lockup.tsx
// component=BrandLockup
//
// The National Emblem plus the government text stack. `SiteHeader` renders it for
// you — reach for it directly only where there is no header (a login shell, an
// error page, a print header), never to rebuild a masthead beside one.
//
// ESTATE RULE, NOT A PREFERENCE: the mark is the National Emblem, never an invented
// or abstract logo, and the lines run Government of India → Ministry → Department
// with the department bold. Get the order wrong and the lockup misstates the
// hierarchy of the institution.
//
// PROPERTY COVERAGE
//   Show beta     -> beta
//   Show org      -> omit lines.org
//   Show ministry -> omit lines.ministry
//   Size          -> compact
//   Device        -> deliberatelyOmitted. Figma-only: a breakpoint, not a prop.
//                    Pinning one would freeze the lockup at a single width.
//
// THE ROWS STACK FLUSH — gap 0 — and the masthead's height is derived from that:
// BETA 20 + org 16 + ministry 16 + department 24 = 76, plus the brand row's 12px
// padding = the 100px "Logo and CTAs" tier. A gap here silently retunes the whole
// masthead, which is how it once sat at 88 (Figma's ON SCROLL height) at rest.
//
// Size=Compact is `compact`: a 44px emblem with the type a rung down, for chrome
// that is NOT a government masthead (Navbar/Compact). Turn Show org and Show
// ministry off there too — those surfaces are estate index pages, and the full
// three-line identity belongs to the public site and the portals.
//
// `emblemSrc` is a URL, not an import: each zone is mounted under its own basePath
// and the design system cannot resolve one. Do not "upgrade" this to next/image —
// that couples the design system to Next and breaks the zones.
import figma from "figma";

const instance = figma.selectedInstance;
const beta = instance.getBoolean("Show beta#4512:0");
const showOrg = instance.getBoolean("Show org#56059:0");
const showMinistry = instance.getBoolean("Show ministry#56059:7");
const compact = instance.getEnum("Size", { Default: "", Compact: "\n  compact" });

export default {
  example: figma.code`<BrandLockup
  emblemSrc={\`\${basePath}/images/National-Emblem-logo.svg\`}
  lines={{${showOrg ? figma.code` org: "Government of India",` : ""}${showMinistry ? figma.code` ministry: "…",` : ""} department: "…" }}
  href="/website"
  beta={${beta}}${compact}
/>`,
  imports: ['import { BrandLockup } from "@mosje/design-system"'],
  id: "navbar-brand-lockup",
  metadata: { nestable: true },
};
