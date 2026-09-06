// url=<SAMAVESH>?node-id=56046-4113
// source=packages/design-system/components/navigation/header/account-menu.tsx
// component=AccountMenu
//
// The signed-in account block in the Portal masthead: name over role beside a 48px
// avatar, optionally a dropdown whose head carries name, role and email. `SiteHeader`
// renders it when you pass `account`; import it directly only for chrome that needs
// the block without a masthead.
//
// STATIC IS A REAL CONFIGURATION, NOT AN EMPTY STATE. With no `items` the block is
// display-only and drops its caret, because nothing opens — that is Figma's
// State=Static. Closed and Open are the same control at runtime and there is no
// prop for them: the component owns whether its menu is open.
//
// PROPERTY COVERAGE
//   Name       -> account.name
//   Role       -> account.role   (under the name in the trigger, and in the menu head)
//   Email      -> account.email  (menu head only — never in the trigger)
//   Show role  -> omit account.role. The code then shows the email under the name
//                 as a fallback, so the second line is never empty; Figma cannot
//                 express that fallback and simply hides the line.
//   Show email -> omit account.email
//   State      -> deliberatelyOmitted. Static is the only one a caller chooses, and
//                 it is expressed by passing no `items`. Closed · Hover · Focused ·
//                 Open are runtime and CSS states of one control.
//
// Until 2026-09-06 the trigger's role line was wired to the Figma property named
// "Email" and its visibility to "Show email" — so a designer typing an address into
// Email changed the officer's ROLE. The property was renamed in place ("Show role"
// keeps its id, so instances keep their overrides), Email drives the menu head's
// address, and "Show email" is new.
//
// THE CARET IS THE AFFORDANCE, AND IT IS CONDITIONAL. Static drops it because
// nothing opens; the menu button keeps it and turns it over when open. Do not make
// it unconditional "for consistency" — it is the only thing separating an identity
// badge from a control, and this component ships both.
//
// The avatar is the DS `Avatar` at size 48, shape="rounded" — a rounded SQUARE, as
// the Figma master's Avatar Shape=Rectangular. This masthead's people are rounded
// squares, its institutions square, its controls outlined squares. Do not hand-roll
// it — this used to be a bare <img> inside the design system that exports Avatar.
//
// The avatar falls back to up-to-two-letter initials derived from `name` when
// `avatarSrc` is absent — do not pass a placeholder image to fake it.
import figma from "figma";

const instance = figma.selectedInstance;
const showRole = instance.getBoolean("Show role#56049:12");
const showEmail = instance.getBoolean("Show email#57553:0");
const name = instance.getString("Name#56049:0");
const email = instance.getString("Email#56049:4");
const role = instance.getString("Role#56049:8");

export default {
  example: figma.code`<AccountMenu
  account={{
    name: "${name}",${showRole ? figma.code`
    role: "${role}",` : ""}${showEmail ? figma.code`
    email: "${email}",` : ""}
  }}
  items={[
    { label: "Profile", onSelect: () => router.push("/profile") },
    { label: "Sign out", onSelect: signOut, danger: true },
  ]}
/>`,
  imports: ['import { AccountMenu } from "@mosje/design-system"'],
  id: "navbar-account-menu",
  metadata: { nestable: true },
};
