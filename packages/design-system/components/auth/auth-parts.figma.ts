// url=<SAMAVESH>?node-id=57464-12739
// source=packages/design-system/components/auth/auth-parts.tsx
// component=SigningIntoBar
//
// Code Connect template for `Auth / SigningIntoBar` — the strip at the foot of
// the login hero telling the user which portal they are about to sign into.
// This file IS what the Figma MCP server hands an agent in Dev Mode, so it
// carries the rules as well as the snippet.
// See .claude/rules/component-authoring.md §12.
//
// PROPERTY COVERAGE — the set's properties are accounted for:
//   Portal name  -> `portalName`
//   Device       -> not a prop. On 2026-09-05 the master became a Device set
//                   (Desktop | Mobile) so the LoginHero's Mobile variant could
//                   nest the 44px-mark, small-button strip the handoff draws.
//                   The code component is the desktop bar; the phone strip is
//                   drawn by PortalLoginShell's `ds-plogin-hero-mobile__bar`,
//                   which is why the Device axis maps to nothing here.
//
// TONE IS FIXED TO `hero`, AND THAT IS WHAT FIGMA DRAWS. The master used to be a
// two-variant set (`Tone = On hero | On surface`, node 55439-749). On 2026-09-04
// the login-template Figma pass dissolved it to the single hero-tone component
// this file now points at, because the bar has only ever been placed at the foot
// of the hero. So the snippet states `tone="hero"` — the surface the drawing was
// made for — and `tone="surface"` is CODE-ONLY: use it when the bar sits on an
// ordinary page background, and know that Figma has no drawing of that state.
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
// The fixture (tools/code-connect-parity/figma-properties.json, captured
// 2026-09-04) confirms the master exposes ONE property, `Portal name`; the
// `org-logo` layer is not a property, so there is nothing to map `logoSrc` to.
// If a logo property is added later, map it to a real asset — do not restore
// the dead path.
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
