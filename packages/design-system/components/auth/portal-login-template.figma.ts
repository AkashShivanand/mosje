// url=<SAMAVESH>?node-id=55397-1364
// source=packages/design-system/components/auth/portal-login-template.tsx
// component=PortalLoginTemplate
//
// Code Connect template for the SAMAVESH PortalLoginTemplate — the full-page
// authentication screen every MoSJE portal renders. This file IS the instruction
// the Figma MCP server hands an agent that opens the component in Dev Mode, so it
// carries the usage rules as well as the snippet.
// See .claude/rules/component-authoring.md §12.
//
// REBUILT 2026-08-17. The component set was re-cut IN PLACE (node id and key
// preserved, every instance link intact) from `Device × Auth Method (5)` = 10
// variants to `Device × Step` = 8.
//
// THE OLD AUTH METHOD AXIS WAS INVENTED. `Password + Captcha`, `Mobile OTP`,
// `DigiLocker SSO`, `NGO DARPAN ID` and `Aadhaar OTP` came from a written brief
// written before the design file was available. A full read of the MoSJE Portal
// handoff — 69 auth screens across 10 of its 12 pages — found exactly two
// credential modes, and NO DARPAN screen and NO Aadhaar screen in any portal.
// `darpan` and `aadhaar` are gone from `PortalAuthMode` too. Do not reinstate
// either axis or either mode.
//
// PROPERTY COVERAGE — both Figma properties are accounted for:
//   Step    -> which part of the journey is on screen. In code this is not one
//              prop: `Credentials` is the resting render, `OTP` is reached when
//              the user submits an OTP-mode form, and `Reset` / `Success` belong
//              to the recovery flow. The variant exists so a designer can pin a
//              step on the canvas; the component derives it from its own state.
//   Device  -> DELIBERATELY OMITTED. There is no `device` prop: the React
//              component is responsive in CSS, and the Figma axis exists only so
//              a designer can pin a breakpoint. Desktop is ref/viewport/desktop
//              (1440), Mobile is ref/viewport/mobile (412) — note 412, not the
//              375 some specs quote. TABLET (768–1024) uses the Mobile variant
//              by decision, not by omission: the 922/518 split does not survive
//              below 1024 and the handoff never designed one.
//
// EVERYTHING A PORTAL VARIES IS A PROPERTY ON A NESTED PART, NOT A VARIANT.
// Role tabs, the DigiLocker toggle, the credential-method tabs, the identifier
// label and the account prompt all live on `Auth / *` components inside the
// shell. If you find yourself wanting a new Step for a portal, you want a
// property.
//
// HIDE DIGILOCKER FOR OFFICERS. Key it off `PortalRoleTab.audience === "officer"`,
// never off the tab's label or the portal — SCW calls that tab "Admin", NMBA
// calls it "Patient Monitoring", and a label test breaks on both.
//
// TONE IS NOT A PROPERTY. Light/dark and high contrast resolve through the
// `data-color-mode` axis and brand through `data-brand`. Never generate a `tone`,
// `theme` or `contrast` prop.
import figma from "figma";

const instance = figma.selectedInstance;

// The journey position. `Reset` and `Success` are recovery-flow screens: they
// render through the same component, driven by its own state rather than a prop,
// so the snippet shows the entry point and notes where the rest comes from.
const step = instance.getEnum("Step", {
  Credentials: "credentials",
  OTP: "otp",
  Reset: "reset",
  Success: "success",
});

export default {
  example: figma.code`{/* Figma Step = ${step}. Steps are internal state, not a prop:
    Credentials is the resting render, OTP follows an otp-mode submit, and
    Reset / Success belong to the credential-recovery flow. */}
<PortalLoginTemplate
  config={{
    portalId: "portal-slug",
    // The SCHEME name, never the acronym — "Senior Citizens Welfare", not "SCW".
    portalName: "Senior Citizens Welfare",
    roles: [
      {
        id: "citizen",
        label: "Citizen / Beneficiary",
        audience: "citizen",
        authModes: ["password", "otp"],
        defaultMode: "password",
      },
      {
        id: "officer",
        label: "Officer / Admin",
        // audience drives the rules — this is what hides DigiLocker.
        audience: "officer",
        authModes: ["password"],
        defaultMode: "password",
      },
    ],
  }}
  onSubmit={handleLogin}
/>`,
  imports: [
    'import { PortalLoginTemplate, type PortalLoginConfig } from "@mosje/design-system"',
  ],
  id: "portal-login-template",
  metadata: { nestable: false },
};
