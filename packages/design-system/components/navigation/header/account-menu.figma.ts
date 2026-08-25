// url=<SAMAVESH>?node-id=56046-4113
// source=packages/design-system/components/navigation/header/account-menu.tsx
// component=AccountMenu
//
// The signed-in account block in the Portal masthead: name / email beside a 48px
// avatar, optionally a dropdown. `SiteHeader` renders it when you pass `account`;
// import it directly only for chrome that needs the block without a masthead.
//
// STATIC IS A REAL CONFIGURATION, NOT AN EMPTY STATE. With no `items` the block is
// display-only and drops its caret, because nothing opens — that is Figma's
// State=Static. Closed and Open are the same control at runtime and there is no
// prop for them: the component owns whether its menu is open.
//
// PROPERTY COVERAGE
//   Name       -> account.name
//   Email      -> account.email
//   Role       -> account.role   (header of the popover only)
//   Show email -> omit account.email
//   State      -> deliberatelyOmitted. Static is the only one a caller chooses, and
//                 it is expressed by passing no `items`. Closed · Hover · Focused ·
//                 Open are runtime and CSS states of one control.
//
// THE CARET IS THE AFFORDANCE, AND IT IS CONDITIONAL. Static drops it because
// nothing opens; the menu button keeps it and turns it over when open. Do not make
// it unconditional "for consistency" — it is the only thing separating an identity
// badge from a control, and this component ships both.
//
// The avatar is the DS `Avatar` at size 48, CIRCULAR. Everything else square in
// this masthead is an institution (the emblem, the co-brand marks, the org chips);
// the person is the one round thing. Do not hand-roll it — this used to be a bare
// <img> styled to a rounded square inside the design system that exports Avatar.
//
// The avatar falls back to up-to-two-letter initials derived from `name` when
// `avatarSrc` is absent — do not pass a placeholder image to fake it.
import figma from "figma";

const instance = figma.selectedInstance;
const showEmail = instance.getBoolean("Show email#56049:12");
const name = instance.getString("Name#56049:0");
const email = instance.getString("Email#56049:4");
const role = instance.getString("Role#56049:8");

export default {
  example: figma.code`<AccountMenu
  account={{
    name: "${name}",${showEmail ? figma.code`
    email: "${email}",` : ""}
    role: "${role}",
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
