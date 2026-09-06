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
// REBUILT 2026-09-02, RE-CUT AGAIN 2026-09-06. The set went `Device × Step` = 8
// to `Device × Auth Method` = 6, to 8 when DARPAN was reinstated — and is now
// **`Device` alone, TWO variants**. Node id and key preserved throughout.
//
// WHY THE `Auth Method` AXIS WENT TOO. Read layer by layer, seven of the form
// card's eight regions were identical across all four of its drawings: PIN
// differed from Password by a field label and a link's wording, DARPAN by one
// control being visible instead of hidden — and the DARPAN variant bound none of
// the five booleans its siblings bound, so every one of them silently did
// nothing there. The axis was also asking two questions at once, *what
// identifies you* and *how you prove it*, so it grew multiplicatively: five
// identifiers against four secrets is twenty clones of an eight-region card.
// The credential mode is now the `Credential fields` INSTANCE_SWAP slot on the
// nested `Auth / AuthFormCard`, with five `Auth / CredentialFields` masters as
// its preferred values.
//
// WHY THE `Step` AXIS WENT. It conflated two unlike things: `Credentials` and
// `OTP` are ways of proving identity, while `Reset` and `Success` are stages of
// credential recovery. One axis cannot mean both, and pinning a recovery screen
// on the login master made recovery look like a login mode. Reset and Success
// now live in `Auth / CredentialRecovery` (56640:4103) with their own `Step`
// axis, and their card in `Auth / RecoveryFormCard` (56640:4104). The component
// nodes were MOVED, so their keys survive — do not re-create them here.
//
// THE AXIS IS FOUR METHODS, AND ONE OF THEM CAME BACK. An earlier version of
// this file carried `Password + Captcha`, `Mobile OTP`, `DigiLocker SSO`,
// `NGO DARPAN ID` and `Aadhaar OTP`, written from a brief before the design file
// existed. Those were retired on 2026-08-17 after a full read of the handoff.
//
// `NGO DARPAN ID` was reinstated on 2026-09-03, because that removal was
// unsound. Its reasoning was "a full read found no DARPAN screen in any portal"
// — but DARPAN belongs to E-Anudaan, and E-Anudaan has NO login screen in the
// handoff at all, so the audit could not have found one either way. E-Anudaan's
// wizard says the organisation record is "Pre-filled from your login /
// NGO-Darpan", and carries `NGO-Darpan Unique ID` as a required field.
//
// `Aadhaar OTP` stays gone. Nothing has been produced for it, and reinstating
// one mode is not a reason to reinstate the other. Do not add it back without a
// screen. On 2026-09-06 the DARPAN stack was rebuilt from the department's own
// live screen — DARPAN ID + PAN Number, no password and no security check — so
// it is no longer a copy of the password form wearing a different label.

// PROPERTY COVERAGE — the set's only Figma property is accounted for:
//   Credential mode -> NOT a property of this set any more. It is the
//                  `Credential fields` slot on the nested `Auth / AuthFormCard`.
//                  In code it is `defaultMode` on the active role plus that
//                  role's `authModes`; the React component owns the live value
//                  in its own state, because the citizen switches it with the
//                  method tabs.
//   Device      -> DELIBERATELY OMITTED. There is no `device` prop: the React
//                  component is responsive in CSS, and the Figma axis exists
//                  only so a designer can pin a breakpoint. Desktop is 1440×960,
//                  Mobile 375×1138 — and 1138 is the SCROLL height, not a
//                  viewport, so do not clip it to 812. TABLET (768–1024) uses
//                  the Mobile variant by decision, not by omission: the 922/518
//                  split does not survive below 1024 and the handoff never
//                  designed one.
//
// DIGILOCKER IS NOT AN AUTH METHOD. It is a handoff CTA sitting ABOVE the
// credentials divider, switched by `Show DigiLocker` on the nested
// `Auth / AuthFormCard`. In code it is `PortalRoleTab.digilocker`, a per-role
// boolean; `PortalAuthMode` does NOT carry it, and never give it a variant.
//
// DIGILOCKER IS PER ROLE, AND THE DIVIDER GOES WITH IT. The handoff
// (`10767:71293`) carries the card on SMILE-Transgender's Citizen frames and on
// neither Admin nor Garima Greh — so it is narrower than "not an officer", and
// an audience-keyed default would wrongly put it on the organisation tab. Set
// `digilocker: true` on the roles the portal has actually agreed it for, and set
// `links.digilockerHref` or nothing renders. The "or sign in with credentials"
// divider belongs to the card: no card, no divider.
//
// CAPTCHA IS PER ROLE, AND OFF UNLESS A ROLE ASKS. It resolves `role.captcha` ??
// `config.captcha` ?? false, and mirrors `Show captcha` on the password and PIN
// credential stacks — it moved off the form card on 2026-09-06, because it
// guards a typed secret and the DARPAN stack has none. The
// handoff asks a Garima Greh organisation for one and asks the same portal's
// citizen for none, so it belongs to the tab; `??` and not `||`, so a role can
// set `captcha: false` to opt OUT of a portal-wide default. The default stays
// false because a captcha is a cognitive function test, and WCAG 2.2 3.3.8
// Accessible Authentication (AA) forbids one without an alternative. Switch it
// on only where that alternative exists, and say which in the same change.
//
// EVERYTHING ELSE A PORTAL VARIES IS A PROPERTY ON A NESTED PART, NOT A VARIANT.
// Role tabs, the DigiLocker toggle, the credential-method tabs, the consent line
// and the account prompt are all booleans on `Auth / *` components inside the
// shell, and the credential mode is a slot. If you find yourself wanting a new
// Auth Method variant for a portal, you want a `CredentialFields` master.
//
// TONE IS NOT A PROPERTY. Light/dark and high contrast resolve through the
// `data-color-mode` axis and brand through `data-brand`. Never generate a `tone`,
// `theme` or `contrast` prop.
import figma from "figma";

const instance = figma.selectedInstance;

// There is no `Auth Method` enum to read: it stopped being a variant axis on
// 2026-09-06. The mode a designer pinned on the canvas is the nested form card's
// `Credential fields` slot, which Code Connect cannot reach from this instance —
// so the snippet names the modes in config and says where the live value lives.

export default {
  example: figma.code`{/* The credential mode is the nested Auth Form Card's
    Credential fields slot in Figma, and the active role's defaultMode here. The
    live value is the component's own state — the citizen switches it with the
    method tabs — so it is never a prop. */}
<PortalLoginTemplate
  config={{
    portalId: "portal-slug",
    // The SCHEME name, never the acronym — "Senior Citizens Welfare", not "SCW".
    portalName: "Senior Citizens Welfare",
    // The DigiLocker card renders only when a role asks for it AND this is set.
    links: { digilockerHref: "https://digilocker.gov.in/" },
    roles: [
      {
        id: "citizen",
        label: "Citizen / Beneficiary",
        audience: "citizen",
        authModes: ["password", "otp"],
        defaultMode: "password",
        // Per ROLE. The handoff carries the card on Citizen and on neither
        // Admin nor Garima Greh, so it is not an audience rule.
        digilocker: true,
        // Per role too. Off unless this role has a non-cognitive alternative
        // (WCAG 2.2 3.3.8).
        captcha: false,
      },
      {
        id: "officer",
        label: "Officer / Admin",
        // audience is the estate taxonomy a portal's own label maps onto.
        // It does NOT decide DigiLocker — omitting \`digilocker\` does.
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
