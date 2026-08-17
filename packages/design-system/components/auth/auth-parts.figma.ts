// url=<SAMAVESH>?node-id=55439-749
// source=packages/design-system/components/auth/auth-parts.tsx
// component=SigningIntoBar
//
// Code Connect template for `Auth / SigningIntoBar` — the strip at the foot of
// the login hero telling the user which portal they are about to sign into.
// This file IS what the Figma MCP server hands an agent in Dev Mode, so it
// carries the rules as well as the snippet.
// See .claude/rules/component-authoring.md §12.
//
// PROPERTY COVERAGE — both Figma properties are accounted for:
//   Tone         -> `tone` ("On hero" -> "hero", "On surface" -> "surface")
//   Portal name  -> `portalName`
//
// TONE FOLLOWS THE SURFACE, NOT THE BRAND. `hero` sits over the photograph
// scrim, `surface` over any ordinary background. Getting it backwards is the
// fastest way to fail contrast on this component, and it is not something the
// geometry can tell you.
//
// PORTAL NAME IS THE SCHEME NAME, NEVER THE ACRONYM. "Senior Citizens Welfare",
// not "SCW"; NHAPOA signs into "SAMBAL (NHAA 2.0)".
//
// KNOWN FIGMA↔CODE DIVERGENCE, deliberate: in Figma the Change control is built
// inline because the Figma `Button` has no Inverse tone and inheriting brand
// blue on a navy scrim would fail contrast. The CODE `Button` does have
// `inverse` / `inverseOutlined`, so this component instances it. Fix the Figma
// Button, then replace the inline part — do not hand-roll the control in code to
// match Figma.
//
// `onChange` OPENS THE PORTAL PICKER. It never submits, and anything the user
// has already typed must survive the round trip. Omit it and no Change control
// renders — which is correct for a portal reached by a fixed URL.
import figma from "figma";

const instance = figma.selectedInstance;

const tone = instance.getEnum("Tone", {
  "On hero": "hero",
  "On surface": "surface",
});

const portalName = instance.getString("Portal name");

export default {
  example: figma.code`<SigningIntoBar
  portalName="${portalName}"
  tone="${tone}"
  logoSrc="/portals/scw/logo.svg"
  onChange={openPortalPicker}
/>`,
  imports: ['import { SigningIntoBar } from "@mosje/design-system"'],
  id: "auth-signing-into-bar",
  metadata: { nestable: true },
};
