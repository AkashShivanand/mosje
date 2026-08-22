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
//   Show beta -> beta
//   Device    -> deliberatelyOmitted. Figma-only: the only per-device dimension is
//                the emblem height (45 / 52 / 58), which CSS resolves at the
//                breakpoint. A prop would pin it to one width.
//
// `emblemSrc` is a URL, not an import: each zone is mounted under its own basePath
// and the design system cannot resolve one. Do not "upgrade" this to next/image —
// that couples the design system to Next and breaks the zones.
import figma from "figma";

const instance = figma.selectedInstance;
const beta = instance.getBoolean("Show beta#4512:0");

export default {
  example: figma.code`<BrandLockup
  emblemSrc={\`\${basePath}/images/National-Emblem-logo.svg\`}
  lines={{ org: "Government of India", ministry: "…", department: "…" }}
  href="/website"
  beta={${beta}}
/>`,
  imports: ['import { BrandLockup } from "@mosje/design-system"'],
  id: "navbar-brand-lockup",
  metadata: { nestable: true },
};
