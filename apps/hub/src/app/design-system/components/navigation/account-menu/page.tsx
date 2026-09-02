import type { Metadata } from "next";
import * as React from "react";

import {
  Callout,
  CodeBlock,
  ComponentDocPage,
  MatrixTable,
  PropsTable,
  type A11yItem,
  type PropDef,
} from "@/components/design-system/docs-kit";

import { AccountMenuSpecimen } from "./account-menu-specimen";

export const metadata: Metadata = {
  title: "Account Menu — Design System",
  description:
    "The signed-in account control in the portal masthead. Two modes: a static identity block, or a full APG menu button.",
};


/*
 * The extractor reads exported `*Props` interfaces from the type checker.
 * `HeaderAccount` and `AccountMenuItem` are data shapes rather than component
 * props, so they are documented here by hand — they are the half of this
 * component's API a caller actually writes.
 */
const ACCOUNT_SHAPE: PropDef[] = [
  {
    name: "HeaderAccount · name",
    type: "string",
    required: true,
    description:
      "Display name. It is inside the trigger's accessible name, so voice control can say it. The derived initials use toUpperCase(), which is a no-op on Devanagari, so a Hindi name yields Hindi initials rather than mangled Latin ones.",
  },
  {
    name: "HeaderAccount · email",
    type: "string",
    description: "Shown under the name, and carried as a title so a truncated address is recoverable.",
  },
  {
    name: "HeaderAccount · role",
    type: "string",
    description:
      "Human-readable role label — “State Nodal Officer”. It appears in the menu's header, not in the trigger: it is context for the session rather than part of the control.",
  },
  {
    name: "HeaderAccount · avatarSrc",
    type: "string",
    description: "Avatar image URL. When absent, initials are derived from name.",
  },
  {
    name: "AccountMenuItem · label",
    type: "string",
    required: true,
    description: "The item's visible text, and its accessible name.",
  },
  {
    name: "AccountMenuItem · onSelect",
    type: "() => void",
    required: true,
    description:
      "Called when the item is chosen. The menu closes first, without restoring focus to the trigger — the reader is already on their way somewhere else.",
  },
  {
    name: "AccountMenuItem · icon",
    type: "React.ReactNode",
    description: "Optional leading icon node, rendered aria-hidden so the label alone names the item.",
  },
  {
    name: "AccountMenuItem · danger",
    type: "boolean",
    default: "false",
    description: "Renders the destructive treatment — Sign out.",
  },
];

const A11Y: A11yItem[] = [
  {
    criterion: "4.1.2 Name, Role, Value",
    level: "A",
    description:
      "The trigger is a real `<button>` with `aria-haspopup=\"menu\"`, `aria-expanded` and `aria-controls` pointing at the open menu. The menu is `role=\"menu\"` holding `role=\"menuitem\"` buttons.",
    status: "verified",
  },
  {
    criterion: "2.1.1 Keyboard",
    level: "A",
    description:
      "The full APG menu-button pattern: Enter, Space and ArrowDown open and focus the first item; ArrowUp opens and focuses the last; arrows cycle; Home and End jump; Escape closes and returns focus to the trigger; Tab closes and lets focus move on.",
    status: "verified",
  },
  {
    criterion: "2.4.3 Focus Order",
    level: "A",
    description:
      "Focus is roving — `tabindex` 0 on the active item, −1 on the rest — and real, not `aria-activedescendant`. Escape returns it to the trigger; an outside click dismisses without stealing it back.",
    status: "verified",
  },
  {
    criterion: "2.5.3 Label in Name",
    level: "A",
    description:
      'The trigger\'s `aria-label` is "<name>, account menu", so the visible name is contained in the accessible name and voice control can still say it.',
    status: "verified",
  },
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    description:
      "The name-and-role header sits OUTSIDE `role=\"menu\"`. A `menu` only admits `menuitem`, `group` and `separator` children; a header inside it was invalid and made screen readers announce an item count one too high.",
    status: "verified",
  },
  {
    criterion: "1.1.1 Non-text Content",
    level: "A",
    description:
      "The avatar is `alt=\"\"` — it is decoration beside a name that is already text. Initials return `undefined` rather than “?” when there is nothing to derive from, because a question mark inside an avatar reads as an error.",
    status: "verified",
  },
];

export default function AccountMenuPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Account Menu"
      status="Stable"
      summary="The signed-in account control in the portal masthead. With items it is a menu button carrying profile and sign-out actions; without them it is a static identity block, and the caret is the only thing that separates the two on screen."
      figma={{ node: "accountMenu" }}
      specimen={<AccountMenuSpecimen />}
      propsFrom="AccountMenuProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "The portal masthead, where an officer needs their profile and a way to sign out.",
          "Showing who is signed in without offering any action — pass no items and it renders as identity, not a control.",
          "A menu of three to five session actions. Longer than that and it stops being an account menu.",
        ],
        avoid: [
          "Navigation between portals — that is the demo dock's Apps tab and the App Switcher Panel.",
          "Application settings — a settings page is a destination, not a dropdown.",
          "A general-purpose dropdown anywhere else — this component is bound to the masthead's account treatment.",
        ],
      }}
      related={[
        {
          label: "Navbar (Header)",
          href: "/design-system/components/section-templates/site-header",
          reason: "the masthead that renders this control",
        },
        {
          label: "Brand Lockup",
          href: "/design-system/components/navigation/brand-lockup",
          reason: "the identity at the other end of the same row",
        },
        {
          label: "Avatar",
          href: "/design-system/components/data-display/avatar",
          reason: "the mark this component renders, and its own fallbacks",
        },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-modes">
            <h2 id="cdp-modes" className="cdp__h2">
              Two Modes, and the Difference Must Be Visible
            </h2>
            <MatrixTable
              caption="What each mode renders"
              columns={["", "No items", "With items"]}
              rows={[
                ["Element", "A div", "A button"],
                ["Caret", "None", "keyboard_arrow_down"],
                ["Focusable", "No", "Yes"],
                ["Hover treatment", "None", "Yes"],
                ["Role", "None — it is identity", "Menu button"],
              ]}
            />
            <p>
              The caret is the only thing that separates the two on screen, which is why it is
              conditional and why it must not become decoration on both.
            </p>
            <Callout type="info" title="Why a caret at all">
              For a consumer product used daily — a mail client, a photo library — a bare avatar
              is over-learned and needs no disclosure icon. This is a government portal a citizen
              may open twice a year, and it ships both modes from one component. Explicit wins.
            </Callout>
          </section>

          <section className="cdp__section" aria-labelledby="cdp-avatar">
            <h2 id="cdp-avatar" className="cdp__h2">
              The One Round Thing in the Masthead Is the Person
            </h2>
            <p>
              The avatar is the design system&apos;s own <code>Avatar</code>, circular. It used to
              be a hand-rolled image and span pair styled to a rounded square, inside the design
              system that exports the component. Circular is the component&apos;s own default, and
              here it carries information: everything else square in the masthead is an
              institution — the National Emblem, the co-brand marks, the organisation chips in the
              mega-menu.
            </p>
          </section>

          <section className="cdp__section" aria-labelledby="cdp-copy">
            <h2 id="cdp-copy" className="cdp__h2">
              Writing the Items
            </h2>
            <p>
              Three to five items. Label them as the actions they are — &ldquo;Profile&rdquo;,
              &ldquo;Change Password&rdquo;, &ldquo;Sign Out&rdquo; — in Title Case, and mark only
              the sign-out as <code>danger</code>. A menu with a second destructive item is a menu
              that needs a confirmation step somewhere else.
            </p>
          </section>
        </>
      }
      code={
        <>
          <section className="cdp__section" aria-labelledby="cdp-shapes">
            <h2 id="cdp-shapes" className="cdp__h2">
              HeaderAccount and AccountMenuItem
            </h2>
            <PropsTable props={ACCOUNT_SHAPE} />
          </section>

          <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            Example
          </h2>
          <CodeBlock>{`import { AccountMenu } from "@mosje/design-system";

<AccountMenu
  account={{
    name: "Asha Ramesh",
    email: "asha.ramesh@gov.in",
    role: "State Nodal Officer",
  }}
  items={[
    { label: "Profile", onSelect: openProfile },
    { label: "Sign Out", danger: true, onSelect: signOut },
  ]}
/>`}</CodeBlock>
          <p>
            Omitting <code>items</code> renders the same identity, with nothing to press. Use it
            where the session is shown but not managed from the masthead.
          </p>
          <CodeBlock>{`<AccountMenu account={{ name: "Asha Ramesh", role: "State Nodal Officer" }} />`}</CodeBlock>
          <p>
            <code>onSelect</code> is a function, so a page that exports <code>metadata</code>{" "}
            cannot render this component directly — the handlers cannot cross the server boundary.
            Put the instance in a client component, as this page&apos;s specimen does.
          </p>
          </section>
        </>
      }
      accessibility={
        <section className="cdp__section" aria-labelledby="cdp-keys">
          <h2 id="cdp-keys" className="cdp__h2">
            Keyboard
          </h2>
          <MatrixTable
            caption="The APG menu-button keys, as implemented"
            columns={["Key", "On the trigger", "In the menu"]}
            rows={[
              ["Enter / Space", "Opens and focuses the first item", "Activates the item"],
              ["ArrowDown", "Opens and focuses the first item", "Moves to the next item, wrapping"],
              ["ArrowUp", "Opens and focuses the last item", "Moves to the previous item, wrapping"],
              ["Home / End", "—", "Jumps to the first / last item"],
              ["Escape", "—", "Closes and returns focus to the trigger"],
              ["Tab", "Moves on", "Closes and lets focus continue past the trigger"],
            ]}
          />
          <p>
            First-character type-ahead is the one APG option deliberately not implemented. These
            menus run three to five items, where it earns nothing.
          </p>
          <Callout type="info" title="Focus never scrolls the page">
            Every `focus()` call passes <code>preventScroll</code>. This control lives in a
            masthead pinned to the top of the viewport, and any scrolling on focus&apos;s behalf
            moves the page toward the threshold that un-condenses the header out from under the
            open menu.
          </Callout>
        </section>
      }
    />
  );
}
