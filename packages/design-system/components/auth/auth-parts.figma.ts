// url=<SAMAVESH>?node-id=55439-731
// source=packages/design-system/components/auth/auth-parts.tsx
// component=SigningIntoBar
//
// Code Connect template for `Auth / SigningIntoBar` — the strip at the foot of
// the login hero telling the user which portal they are about to sign into.
// This file IS what the Figma MCP server hands an agent in Dev Mode, so it
// carries the rules as well as the snippet.
// See .claude/rules/component-authoring.md §12.
//
// PROPERTY COVERAGE — the one Figma property is accounted for:
//   Portal name  -> `portalName`
//
// TONE HAS NO FIGMA PROPERTY SINCE 2026-09-04. The component set with a Tone axis
// (55439:749, "On hero" | "On surface") was dissolved in the library; what remains is
// the single component 55439:731, drawn on the hero scrim. So the snippet emits
// tone="hero" as a constant — that is what the Figma master IS — and a developer
// placing the bar on an ordinary surface changes it to "surface" in code. When the
// library regains a Tone axis, restore the getEnum mapping here.
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
//
// `logoSrc` is DELIBERATELY NOT EMITTED, and this is the interesting one.
//
// The snippet used to hardcode `logoSrc="/portals/scw/logo.svg"`. That file does
// not exist and never has: `apps/hub/public/portals/scw/` contains only
// `brand/`, and every portal's `brand/` holds the same four shared marks
// (national emblem, Digital India, SAMAVESH) rather than a logo of its own. So
// the estate has no per-portal logo asset for this prop to point at, and Dev
// Mode was handing developers a path that 404s.
//
// Pointing it at one of the shared marks instead would be worse — it would put
// the National Emblem in a decorative `alt=""` slot on every portal's login bar,
// which is not what that mark is for. The prop is optional (`logoSrc?`), it is
// decorative when set, and the only real use of this component in the repo —
// `AuthParts.stories.tsx` — omits it too. So the snippet omits it, per
// `.claude/rules/component-authoring.md` §12a: never invent a code prop; if none
// fits, omit it and say why.
//
// CAVEAT, stated rather than glossed: this template has no Figma fixture
// (`check:code-connect` reports it as unverified), so whether the Figma
// component carries a logo layer could not be confirmed from the recorded
// snapshot. If capturing the fixture later shows a logo property, map it to a
// real asset then — do not restore the dead path.
import figma from "figma";

const instance = figma.selectedInstance;

const portalName = instance.getString("Portal name");

export default {
  example: figma.code`<SigningIntoBar
  portalName="${portalName}"
  tone="hero"
  onChange={openPortalPicker}
/>`,
  imports: ['import { SigningIntoBar } from "@mosje/design-system"'],
  id: "auth-signing-into-bar",
  metadata: { nestable: true },
};
