// url=<SAMAVESH>?node-id=56640-4103
// source=packages/design-system/components/auth/portal-recovery-template.tsx
// component=PortalRecoveryTemplate
//
// Code Connect template for `Auth / CredentialRecovery` — a portal's password
// recovery as one page on the login page's own chrome. This file IS what the
// Figma MCP server hands an agent in Dev Mode, so it carries the rules as well
// as the snippet. See .claude/rules/component-authoring.md §12.
//
// PROPERTY COVERAGE — both of the set's properties are accounted for:
//   Step    -> `config.flow`, and `startAt` for Reset. The seven values span
//              three flows, so the axis maps to the FLOW, not to a step prop:
//                Request · Verify · Reset · Success  -> flow "otp"
//                Link Request · Link Sent            -> flow "link"
//                Contact                             -> flow "contact"
//              The step is the component's own state — the reader moves it —
//              and only "request" and "reset" can be forced, with `startAt`.
//              Reset is emitted as `startAt="reset"`: it is also the page an
//              emailed reset link opens.
//   Device  -> DELIBERATELY OMITTED. There is no `device` prop; the template is
//              responsive in CSS, like PortalLoginTemplate.
//
// RULES
// 1. Recovery is its own page, never a mode of PortalLoginTemplate. Pass the
//    SAME brand fields both pages get (portalId, portalName, portalTagline,
//    changeHref, brandAssets) so they cannot drift.
// 2. Every step keeps Back to Login (`loginHref`). Never drop it.
// 3. On the link flow `onRequest` must never answer that an account does not
//    exist — refuse a malformed value, nothing more. The confirmation is worded
//    so it does not disclose.
// 4. `continueHref` is PROTOTYPE ONLY — nothing sends the email in a prototype.
//    Leave it unset in production.
// 5. `contact` is the department's own sentence: who resets passwords and how to
//    reach them. Do not invent a helpdesk.
//
// TONE IS NOT A PROPERTY. Brand and colour mode resolve through `data-brand`
// and `data-color-mode`. Never generate a `tone` or `theme` prop.
import figma from "figma";

const instance = figma.selectedInstance;

const flow = instance.getEnum("Step", {
  Request: "otp",
  Verify: "otp",
  Reset: "otp",
  Success: "otp",
  "Link Request": "link",
  "Link Sent": "link",
  Contact: "contact",
});

const startAtReset = instance.getEnum("Step", {
  Request: false,
  Verify: false,
  Reset: true,
  Success: false,
  "Link Request": false,
  "Link Sent": false,
  Contact: false,
});

const flowFields =
  flow === "contact"
    ? figma.code`
    // The page says who resets passwords; there is no form.
    contact: "Passwords for this portal are reset by …",`
    : flow === "link"
      ? figma.code`
    // Username by default for the link flow.
    identifierKind: "text",`
      : figma.code`
    // Where the code goes — "mobile" by default, or "email".
    identifierKind: "mobile",`;

export default {
  example: figma.code`<PortalRecoveryTemplate
  config={{
    portalId: "portal-slug",
    // The SCHEME name, never the acronym.
    portalName: "Senior Citizens Welfare",
    changeHref: "/portals",
    flow: "${flow}",
    // Where Back to Login goes, on every step.
    loginHref: "/portals/portal-slug/login",${flowFields}
  }}${startAtReset ? figma.code`
  // The page an emailed reset link opens.
  startAt="reset"` : ""}
  onRequest={handleRequest}${flow === "otp" ? figma.code`
  onVerify={handleVerify}` : ""}${flow !== "contact" ? figma.code`
  onReset={handleReset}` : ""}
/>`,
  imports: [
    'import { PortalRecoveryTemplate, type PortalRecoveryConfig } from "@mosje/design-system"',
  ],
  id: "portal-recovery-template",
  metadata: { nestable: false },
};
