import type { Metadata } from "next";
import * as React from "react";

import {
  Callout,
  CodeBlock,
  ComponentDocPage,
  type A11yItem,
} from "@/components/design-system/docs-kit";

import { AuthFormCardPlayground } from "./auth-form-card-playground";

export const metadata: Metadata = {
  title: "Auth Form Card — Design System",
  description:
    "The login form column: seven fixed regions and one slot. The credential mode is a swapped stack, not a variant of the card.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    status: "verified",
    description:
      "The card is a real `<form>`, so the fields, the submit and the consent line are one programmatic group rather than a visual arrangement.",
    evidence:
      "`auth-form-card.tsx` renders `<form>` directly; the playground's submit fires the form's own `onSubmit` with no click handler on the button.",
  },
  {
    criterion: "2.4.6 Headings and Labels",
    level: "AA",
    status: "verified",
    description:
      "`headingLevel` is the caller's, defaulting to 2 for an embedded card and set to 1 by `PortalLoginTemplate` on a real login page, so a page never ships two first-level headings.",
    evidence:
      "This page passes `headingLevel={3}` beneath its own h1/h2; `PortalLoginTemplate` defaults to 1.",
  },
  {
    criterion: "3.3.1 Error Identification",
    level: "A",
    status: "verified",
    description:
      "A failed attempt renders as an `Alert` with `status=\"error\"` between the heading and the fields, rather than as red text beside the button.",
    evidence: "`error` is passed straight to `Alert`, which owns the role and the icon.",
  },
  {
    criterion: "3.3.8 Accessible Authentication (Minimum)",
    level: "AA",
    status: "verified",
    description:
      "The card imposes no cognitive function test of its own. The bot check belongs to the stacks with a typed secret to guard and defaults to off, and the DARPAN stack exposes no way to add one — the department's own screen has none. A portal that switches it on must supply an alternative route; that obligation is the portal's and is enforced in `PortalLoginTemplate`, which renders nothing without `botCheck.helpHref`.",
    evidence:
      "Read in the browser on /portals/e-anudaan/login, 2026-09-06: the DARPAN stack renders zero captcha elements and zero `input[type=password]`. `DarpanFields` declares no `botCheck` prop; `PasswordFields`/`PinFields` default it to `null`.",
  },
  {
    criterion: "4.1.2 Name, Role, Value",
    level: "A",
    status: "verified",
    description:
      "Where `methodTabs` is a `Tabs` instance, each tab's `aria-controls` names the panel that is actually rendered. `PortalLoginTemplate` wraps the slot in a `TabPanel` for exactly this reason — naming an id that did not exist was a critical axe finding (`aria-valid-attr-value`) caught by the production build and not by the dev server.",
    evidence:
      "Measured in the browser on /portals/e-anudaan/login, 2026-09-06: with the DARPAN tab selected the rendered panel id is `…-method-panel-darpan`, and the two tabs' `aria-controls` read `…-method-panel-password` and `…-method-panel-darpan` — the selected tab's target exists in the DOM.",
  },
];

export default function AuthFormCardPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Auth Form Card"
      status="Stable"
      summary="The login form column. Seven regions are fixed — heading, error, the DigiLocker handoff, the method tabs, the submit, the consent line, the account prompt — and the eighth is a slot. How a portal signs people in is the stack you put in that slot, not a variant of the card."
      since="2.4"
      figma={{ node: "authFormCard" }}
      specimen={<AuthFormCardPlayground />}
      propsFrom="AuthFormCardProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "Building a portal login page — normally through `PortalLoginTemplate`, which composes this card with the shell, the hero and the role tabs.",
          "A portal needs a credential mode the estate does not ship. Write one stack; the card is unchanged.",
          "An authenticated surface needs a re-authentication card with the same anatomy as the login page.",
        ],
        avoid: [
          "A general-purpose form. This card carries a consent line, an account prompt and an identity-provider handoff, none of which belong on a grant application.",
          "Credential recovery. Reset and Success are stages of recovery, not ways of proving identity — they live in `Auth / CredentialRecovery`, and pinning them here once made recovery look like a login mode.",
          "Putting the role tabs inside it. Citizen / Officer / Organisation belong to `PortalLoginShell`, which pins them at a breakpoint this card cannot see.",
        ],
      }}
      related={[
        {
          label: "Portal Login Template",
          href: "/design-system/components/auth/portal-login-template",
          reason: "composes this card from one config object, and owns the auth state machine",
        },
        {
          label: "Portal Login Shell",
          href: "/design-system/components/auth/portal-login-shell",
          reason: "the chrome, the hero and the role tabs around it",
        },
        {
          label: "SSO Button",
          href: "/design-system/components/auth/sso-button",
          reason: "what goes in the `sso` slot, above the divider",
        },
        {
          label: "Consent Line",
          href: "/design-system/components/auth/consent-line",
          reason: "the disclosure GIGW requires under the button",
        },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-slot">
            <h2 id="cdp-slot" className="cdp__h2">
              Why the Credential Mode Is a Slot
            </h2>
            <p>
              Until 6 September 2026 this was a Figma variant axis — <code>Auth Method</code> with
              the values Password, OTP, PIN and DARPAN — and a four-armed conditional in the
              template. Read layer by layer, three of the four drawings were the same drawing:
              PIN differed from Password by a field label and the wording of a link, and DARPAN
              differed by one control being visible instead of hidden. Seven of the card&apos;s
              eight regions were identical across all four.
            </p>
            <p>
              The axis was also asking two questions at once — <em>what identifies you</em> (a
              username, a DARPAN ID) and <em>how you prove it</em> (a password, a PIN, a code) —
              so it grew multiplicatively rather than additively. Five identifiers against four
              secrets is twenty clones of an eight-region card.
            </p>
            <Callout type="info" title="One Slot, Not Two">
              Splitting identifier from secret would model the taxonomy more purely and would offer
              combinations that cannot ship — this estate has no DARPAN-ID-plus-OTP route. The pairs
              that exist are named; the rest are not generated.
            </Callout>
          </section>

          <section className="cdp__section" aria-labelledby="cdp-stacks">
            <h2 id="cdp-stacks" className="cdp__h2">
              The Stacks That Ship
            </h2>
            <p>
              Five, each exported from the barrel and each a master in Figma under{" "}
              <code>Auth / CredentialFields /</code>. The card&apos;s Figma property lists all five
              as preferred values, so a designer picks from a menu rather than an open slot.
            </p>
            <ul className="cdp__list">
              <li>
                <code>PasswordFields</code> — identifier + password, with the security check beneath.
              </li>
              <li>
                <code>PinFields</code> — identifier + a six-digit numeric PIN. NOS is PIN-only.
              </li>
              <li>
                <code>DarpanFields</code> — NGO-DARPAN Unique ID + PAN. No password and no security
                check: the department&apos;s own screen asks for neither.
              </li>
              <li>
                <code>OtpRequestFields</code> and <code>OtpVerifyFields</code> — the OTP route is two
                stacks, which is the case a variant axis could not express without pretending a
                two-screen journey was one drawing.
              </li>
            </ul>
          </section>

          <section className="cdp__section" aria-labelledby="cdp-tabs-limit">
            <h2 id="cdp-tabs-limit" className="cdp__h2">
              What Overflows Is the Label Width, Not the Tab Count
            </h2>
            <Callout type="warning" title="Two Tabs Already Clip at 390px">
              Measured in the specimen above on 6 September 2026: &quot;Login with
              Credentials&quot; is 185px and &quot;Login with DARPAN ID&quot; is 183px — 368px of
              labels in 340px of room. An earlier version of this page said &quot;up to three modes
              are tabs&quot;. That was reasoned rather than measured, and it was wrong.
            </Callout>
            <p>
              So keep the labels short — the mode, not a sentence about it. &quot;Password&quot;,
              &quot;OTP&quot;, &quot;DARPAN ID&quot; fit; &quot;Login with NGO-DARPAN ID&quot; does
              not. Pass <code>overflow</code> on the <code>Tabs</code> instance so the row offers
              the More menu instead of cutting a tab in half — every tab stays focusable and
              arrow-reachable either way — and past three modes use a <code>Select</code> or a{" "}
              <code>RadioGroup</code>, which is what <code>PortalLoginTemplate</code> already
              resolves through <code>authSelectorType</code>.
            </p>
            <p>
              Measure at <strong>390px</strong>. That is <code>layout/login/content/width</code>,
              the width the form column actually has on a phone.
            </p>
            <p>
              A portal with exactly one mode passes no <code>methodTabs</code> at all. A tablist
              with one tab is chrome pretending to be a choice.
            </p>
          </section>
        </>
      }
      code={
        <>
          <section className="cdp__section" aria-labelledby="cdp-example">
            <h2 id="cdp-example" className="cdp__h2">
              Example
            </h2>
            <p>
              Most consumers should reach for <code>PortalLoginTemplate</code>, which builds this from
              a config object and owns the state. Compose the card directly only when a portal needs
              anatomy the template does not offer.
            </p>
            <CodeBlock>{`import {
  AuthFormCard,
  PasswordFields,
  ConsentLine,
  Button,
} from "@mosje/design-system";

<AuthFormCard
  headingLevel={1}
  error={error}
  onSubmit={handleSubmit}
  credentialFields={
    <PasswordFields
      identifier={username}
      onIdentifierChange={setUsername}
      password={password}
      onPasswordChange={setPassword}
      forgotHref="/forgot-password"
    />
  }
  primaryAction={<Button type="submit" fullWidth>Log In</Button>}
  consent={<ConsentLine termsHref="/terms" privacyHref="/privacy" />}
/>`}</CodeBlock>
          </section>

          <section className="cdp__section" aria-labelledby="cdp-newmode">
            <h2 id="cdp-newmode" className="cdp__h2">
              Adding a Credential Mode
            </h2>
            <p>
              Write a stack. Do not add a prop to this card, and do not add a variant in Figma.
            </p>
            <CodeBlock>{`// 1. a stack — controlled, stateless, and the same rhythm as its siblings
export function EmployeeIdFields({ employeeId, onEmployeeIdChange, ... }) {
  return (
    <div className="ds-authfields">
      <FormField label="Employee ID" required>{...}</FormField>
      <FormField label="Password" required>{...}</FormField>
    </div>
  );
}

// 2. a label for the submit — the Record fails to compile until it has one
const PRIMARY_ACTION_LABELS: Record<PortalAuthMode, { initial: string }> = {
  ...,
  employee: { initial: "Log In" },
};

// 3. in Figma, one master under Auth / CredentialFields, added to the
//    Credential fields property's preferred values.`}</CodeBlock>
            <Callout type="warning" title="The Payload Names the Secret Honestly">
              A PIN never arrives as <code>password</code> and a PAN never arrives as{" "}
              <code>password</code>. While the DARPAN form was a clone of the password form, the PAN
              did arrive under that name — so a consumer doing the obvious thing hashed a public tax
              identifier into a credentials table. Give a new secret its own field on{" "}
              <code>LoginSubmitPayload</code>.
            </Callout>
          </section>
        </>
      }
      accessibility={
        <section className="cdp__section" aria-labelledby="cdp-a11y-notes">
          <h2 id="cdp-a11y-notes" className="cdp__h2">
            Notes
          </h2>
          <p>
            <strong>Switching mode must not silently discard typed input.</strong> The identifier is
            usually the same value in every mode — keep it, and clear only the secret.{" "}
            <code>PortalLoginTemplate</code> holds one <code>username</code> state across the
            password, PIN and DARPAN stacks for this reason.
          </p>
          <p>
            <strong>Unmount the inactive stack; do not hide it.</strong> A hidden panel containing a{" "}
            <code>type=&quot;password&quot;</code> input confuses password managers, which offer to
            fill a field the reader cannot see. The card renders one stack at a time.
          </p>
          <p>
            <strong>Where the tabs swap the form, they must be a real tablist.</strong> Each tab&apos;s{" "}
            <code>aria-controls</code> has to name a panel that exists. Naming an id that did not
            exist was a critical axe finding (<code>aria-valid-attr-value</code>) caught by the
            production build and not by the dev server, which is why the template wraps the slot in a{" "}
            <code>TabPanel</code> whenever the selector is a segmented control.
          </p>
        </section>
      }
    />
  );
}
