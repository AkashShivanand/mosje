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
// PROPERTY COVERAGE — all 5 Figma properties are accounted for:
//   Auth Method    -> config.roles[].defaultMode  (password | otp | digilocker |
//                     darpan | aadhaar)
//   Signing into   -> config.portalName
//   Device         -> DELIBERATELY OMITTED. There is no `device` prop: the React
//                     component is responsive in CSS, and the Figma axis exists
//                     only so a designer can pin a breakpoint on the canvas.
//                     Desktop is ref/viewport/desktop (1440), Mobile is
//                     ref/viewport/mobile (412) — note 412, not the 375 some
//                     specs quote; 412 is this library's mobile breakpoint.
//   Role tabs      -> DELIBERATELY OMITTED as a direct prop. The instance swap
//                     selects which ❖ RoleTabs variant is shown, i.e. which role
//                     is active; in code that is derived from the `config.roles`
//                     array plus `config.defaultRoleId`. A single swap cannot
//                     express an array, so emitting one prop for it would be
//                     inventing an API that does not exist.
//   Auth selector  -> DELIBERATELY OMITTED as a direct prop, for the same reason.
//                     ❖ AuthSelector's Style maps to `authSelectorType`, which in
//                     code is set PER ROLE inside `config.roles[]`, not once on
//                     the component.
//
// ROLE AND SELECTOR STYLE ARE NOT VARIANT AXES. They are nested component sets on
// purpose: as variants, Device (2) × Role (3) × Auth Method (5) × Selector Style
// (3) is 90 permutations, ~40 of them combinations that can never ship (a
// Department Officer cannot hold an NGO DARPAN ID). Do not add them.
//
// TONE IS NOT A PROPERTY. Light/dark and high contrast resolve through the
// `data-color-mode` axis and brand through `data-brand`. Never generate a `tone`,
// `theme` or `contrast` prop.
import figma from "figma";

const instance = figma.selectedInstance;

const portalName = instance.getString("Signing into");

const defaultMode = instance.getEnum("Auth Method", {
  "Password + Captcha": "password",
  "Mobile OTP": "otp",
  "DigiLocker SSO": "digilocker",
  "NGO DARPAN ID": "darpan",
  "Aadhaar OTP": "aadhaar",
});

export default {
  example: figma.code`<PortalLoginTemplate
  config={{
    portalId: "portal-slug",
    portalName: "${portalName}",
    roles: [
      {
        id: "citizen",
        label: "Citizen / Applicant",
        authModes: ["${defaultMode}"],
        defaultMode: "${defaultMode}",
        authSelectorType: "segmented",
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
