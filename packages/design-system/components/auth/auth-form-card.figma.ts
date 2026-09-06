// url=<SAMAVESH>?node-id=55445-778
// source=packages/design-system/components/auth/auth-form-card.tsx
// component=AuthFormCard
//
// Code Connect template for the SAMAVESH form card — the login column every
// portal renders. This file IS the instruction the Figma MCP server hands an
// agent that opens the component in Dev Mode, so it carries the rules as well as
// the snippet. See .claude/rules/component-authoring.md §12.
//
// THIS IS NOT A COMPONENT SET, AND THAT IS THE POINT. Until 2026-09-06 it was
// `Auth Method` = Password · OTP · PIN · DARPAN. Read layer by layer, seven of
// the card's eight regions were identical across all four drawings: PIN differed
// from Password by a field label and a link's wording, DARPAN by one control
// being visible instead of hidden. The DARPAN variant also bound none of the
// five booleans its siblings bound, so every one of them silently did nothing
// there — which is what a variant axis costs, because each new variant has to
// re-wire every property by hand.
//
// The axis was asking two questions at once — WHAT IDENTIFIES YOU (a username,
// an NGO-DARPAN ID) and HOW YOU PROVE IT (a password, a PIN, a code) — so it
// grew multiplicatively rather than additively. Five identifiers against four
// secrets is twenty clones of an eight-region card.
//
// ONE SLOT, NOT TWO. Identifier and secret are deliberately not separate slots.
// That would model the taxonomy more purely and would offer combinations that
// cannot ship — this estate has no DARPAN-ID-plus-OTP route, and a design system
// that draws one is lying about the department. Name the pairs that exist.
//
// PROPERTY COVERAGE — every Figma property is accounted for:
//   Credential fields    -> the `credentialFields` slot. INSTANCE_SWAP, with the
//                           five `Auth / CredentialFields` masters as preferred
//                           values, so a designer picks from a menu rather than
//                           an open hole.
//   Show DigiLocker      -> `sso`. Pass the node or pass nothing.
//   Show method tabs     -> `methodTabs`. Omit for a single-mode portal; a
//                           tablist with one tab is chrome pretending to be a
//                           choice.
//   Show consent         -> `consent`. GIGW requires the disclosure — never drop
//                           it to save vertical space.
//   Show account prompt  -> `accountPrompt`.
//   Show role tabs       -> NOT A PROP HERE. The role tabs belong to
//                           `PortalLoginShell` in code, which pins them at a
//                           breakpoint this card cannot see. The Figma master
//                           draws them inside the card's bounds because there
//                           they are simply the top of the column. A deliberate,
//                           recorded divergence — do not "fix" it by giving the
//                           estate two places to draw a tablist.
//
// LABEL WIDTH OVERFLOWS, NOT TAB COUNT. Measured in a 390px column on
// 2026-09-06: "Login with Credentials" (185px) + "Login with DARPAN ID" (183px)
// = 368px of labels in 340px of room, so TWO tabs already clip. Keep labels
// short — the mode, not a sentence about it — pass `overflow` so the row offers
// the More menu instead of cutting a tab in half, and past three modes use a
// Select or a RadioGroup (`PortalLoginTemplate.authSelectorType`).
//
// THE CHECK BELONGS TO THE STACK, NOT THIS CARD. It guards a typed secret, so
// `PasswordFields` and `PinFields` take a `botCheck` node and `DarpanFields`
// takes none at all. Default off: WCAG 2.2 3.3.8 Accessible Authentication (AA)
// forbids a cognitive function test without an alternative.
//
// PREFER `PortalLoginTemplate`. Compose this directly only when a portal needs
// anatomy the config object does not describe.
//
// TONE IS NOT A PROPERTY. Light/dark and high contrast resolve through the
// `data-color-mode` axis and brand through `data-brand`. Never generate a `tone`,
// `theme` or `contrast` prop.
import figma from "figma";

const instance = figma.selectedInstance;

const showSso = instance.getBoolean("Show DigiLocker");
const showMethodTabs = instance.getBoolean("Show method tabs");
const showConsent = instance.getBoolean("Show consent");
const showAccountPrompt = instance.getBoolean("Show account prompt");

export default {
  example: figma.code`<AuthFormCard
  // 1 on a real login page — the page IS the form, and GIGW 3.0 wants the h1
  // there. 2 or 3 anywhere this is embedded under an existing heading.
  headingLevel={1}
  error={error}
  onSubmit={handleSubmit}${showSso.and(figma.code`
  // ABOVE the divider and OUTSIDE the fields: a way past the form, not a mode of
  // it. Per role, and nothing renders without links.digilockerHref.
  sso={<><SSOButton href={digilockerHref} /><AuthDivider /></>}`)}${showMethodTabs.and(figma.code`
  // Up to three modes. Past three the switch is a Select or a RadioGroup.
  methodTabs={methodTabs}`)}
  // THE SLOT. A new credential mode is a new stack — one of PasswordFields,
  // PinFields, DarpanFields, OtpRequestFields, OtpVerifyFields, or a portal's
  // own. Never a prop on this card, and never a variant in Figma.
  credentialFields={<PasswordFields {...credentials} />}
  primaryAction={<Button type="submit" fullWidth>Log In</Button>}${showConsent.and(figma.code`
  consent={<ConsentLine termsHref={termsHref} privacyHref={privacyHref} />}`)}${showAccountPrompt.and(figma.code`
  accountPrompt={<AccountPrompt options={registerOptions} />}`)}
/>`,
  imports: [
    'import { AuthFormCard, PasswordFields, ConsentLine, Button } from "@mosje/design-system"',
  ],
  id: "auth-form-card",
  metadata: { nestable: true },
};
