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

import { PortalLoginTemplateSpecimen } from "./portal-login-template-specimen";
import { PortalLoginTemplateArrangements } from "./portal-login-template-arrangements";

export const metadata: Metadata = {
  title: "Portal Login Template — Design System",
  description:
    "A whole portal login page built from one config object — the role tabs, the authentication mode selector, the credential form and the deep-linked URL.",
};

const HELPER_PROPS: PropDef[] = [
  {
    name: "portalLoginUrl(path, roleId?)",
    type: "(path: string, roleId?: string) => string",
    description:
      "Build a link to a login page with a role preselected. An existing `role` is replaced rather than appended, because `?role=a&role=b` is ambiguous and different parsers disagree about which one wins.",
  },
  {
    name: "roleFromUrl(href)",
    type: "(href: string) => string | null",
    description:
      "Read a role id out of a URL — query first, then the legacy hash. It returns null rather than guessing, and the caller checks the id against its own roles.",
  },
  { name: "ROLE_PARAM", type: '"role"', description: "The query parameter's name. The one place it is written, so renaming it cannot leave a caller behind." },
];

const A11Y: A11yItem[] = [
  {
    criterion: "3.3.1 Error Identification",
    level: "A",
    status: "verified",
    evidence:
      "Read in code, both halves. `Alert` renders `role=\"alert\"` (feedback/alert.tsx:107), and the template renders `<Alert status=\"error\">{error}</Alert>` unconditionally whenever `error` is set (portal-login-template.tsx:377). A submission failure is therefore announced when it appears, not only when focus returns to it.",
    description:
      "A submission failure renders in a `role=\"alert\"` banner above the fields, so it is announced the moment it appears rather than only when a reader happens to move focus back up.",
  },
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    description:
      "Every credential field has a real `<label htmlFor>`. The radio presentation of the mode selector uses native radio inputs inside their labels, so the group is announced as a group.",
  },
  {
    criterion: "4.1.2 Name, Role, Value",
    level: "A",
    description:
      "The password reveal control and the captcha refresh control are icon-only buttons carrying their own `aria-label`, and the reveal's label changes with its state.",
  },
  {
    criterion: "2.1.1 Keyboard",
    level: "A",
    description:
      "The role tabs are anchors, not an ARIA tablist: Tab moves between them and Enter follows. Arrow keys do not switch them, and documenting otherwise would send a keyboard user hunting for a behaviour that is not there.",
  },
  {
    criterion: "3.3.8 Accessible Authentication (Minimum)",
    level: "AA",
    status: "partial",
    description:
      "The captcha is a cognitive function test, so it resolves `role.captcha` ?? `config.captcha` ?? false and the field is not drawn at all unless a role asks for it. Where it is switched on, the OTP mode is the alternative that satisfies this criterion — a role offering captcha must also offer another way in.",
  },
  {
    criterion: "2.4.7 Focus Visible",
    level: "AA",
    status: "verified",
    evidence:
      "portal-login-template.css contains no `outline: none` and no `outline: 0` anywhere, so nothing inherited from the DS controls is suppressed; and the two controls it styles itself draw the ring explicitly — `.ds-plogin__labelrow a`, `.ds-plogin__help a` (:47) and `.ds-plogin__roletab` (:96) each set `outline: var(--sa-focus-width) solid var(--sa-focus-ring)` with `--sa-focus-offset`.",
    description: "Fields, buttons and tabs all draw the estate's focus ring, inherited from the DS controls rather than restyled here.",
  },
];

export default function PortalLoginTemplatePage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Portal Login Template"
      status="Stable"
      summary="A whole portal login page built from one configuration object. It declares the role tabs, each role's authentication modes and the credential fields, and renders them inside Portal Login Shell — so a portal describes who signs in rather than building a login page."
      figma={{ node: "portalLoginTemplate" }}
      specimen={
        <div className="cdp-stack">
          <PortalLoginTemplateSpecimen />
          <PortalLoginTemplateArrangements />
        </div>
      }
      propsFrom="PortalLoginTemplateProps"
      props={HELPER_PROPS}
      a11y={A11Y}
      whenToUse={{
        use: [
          "A portal signs in more than one kind of user and each kind has its own way in.",
          "The authentication modes are the estate's own — a password form, a mobile OTP or a numeric PIN, with or without the DigiLocker handoff above them.",
          "A link from elsewhere should open the login page on a particular role's tab.",
        ],
        avoid: [
          "The form is genuinely bespoke — use Portal Login Shell and build the form yourself; the chrome is what you actually needed.",
          "There is one role and one way in — a shell with a form is simpler than a config object describing a single case.",
          "The page is a registration or a grievance form — use Wizard or Form Section, which carry validation and progress.",
        ],
      }}
      related={[
        { label: "Portal Login Shell", href: "/design-system/components/auth/portal-login-shell", reason: "the layout this template fills; use it directly for a bespoke form" },
        { label: "OTP Input", href: "/design-system/components/forms/otp-input", reason: "the field the OTP mode draws" },
        { label: "Captcha Field", href: "/design-system/components/forms/captcha-field", reason: "the challenge the password and PIN modes can carry, off unless a role asks for it" },
        { label: "Password Input", href: "/design-system/components/forms/password-input", reason: "the reveal-capable field used on its own outside a login page" },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-audiences">
            <h2 id="cdp-audiences" className="cdp__h2">
              Three Audiences, Whatever They Are Called
            </h2>
            <p>
              A role tab carries an <code>audience</code> of <code>citizen</code>,{" "}
              <code>officer</code> or <code>organisation</code>, and rules key off that rather
              than off the label. NMBA&rsquo;s &ldquo;Patient Monitoring&rdquo;,
              SMILE-Transgender&rsquo;s &ldquo;Garima Greh&rdquo; and SCW&rsquo;s &ldquo;SAGE
              Organisation&rdquo; are all <code>organisation</code>, renamed through{" "}
              <code>label</code>.
            </p>
            <p>
              Before this taxonomy existed there were five bespoke ones across nine portals, and
              no way to write a rule about who is signing in that held in more than one of them.
              A portal that seems to need a fourth audience is renaming, not adding.
            </p>
            <p>
              <strong>The DigiLocker handoff is not one of those rules.</strong> It was keyed off{" "}
              <code>audience</code> until 2026-09-02, on the reading that officers hold no
              DigiLocker account. The handoff disproves it: SMILE-Transgender offers the card on
              Citizen and on neither Admin nor Garima Greh, so an audience rule would have put it
              on the organisation tab. It is <code>digilocker</code> on the role, a boolean the
              portal sets for the roles it has actually agreed it for.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-per-role">
            <h2 id="cdp-per-role" className="cdp__h2">
              What the Role Decides, and What the Portal Decides
            </h2>
            <p>
              Two things on this page are switched on the <strong>role tab</strong> rather than on
              the portal, because the handoff switches them that way: the DigiLocker card, and the
              security captcha. SMILE-Transgender asks a Garima Greh organisation for a captcha and
              asks the same portal&rsquo;s citizen for none; a portal-wide boolean can express
              neither of those without imposing it on the other.
            </p>
            <MatrixTable
              caption="Where each switch lives"
              columns={["Switch", "Set on", "Resolves as"]}
              rows={[
                [
                  "DigiLocker card",
                  "the role",
                  "role.digilocker && config.links.digilockerHref — both, because a CTA with nowhere to go is worse than no CTA",
                ],
                [
                  "Security captcha",
                  "the role, then the portal",
                  "role.captcha ?? config.captcha ?? false",
                ],
              ]}
            />
            <p>
              The captcha fallback is <code>??</code> and not <code>||</code> on purpose. A role
              setting <code>captcha: false</code> is opting <em>out</em> of a portal-wide default;
              with <code>||</code> that explicit false would read as &ldquo;unset&rdquo; and the
              portal would overrule it.
            </p>
            <Callout type="warning" title="Switching a captcha on is a commitment">
              A captcha is a cognitive function test, and{" "}
              <strong>WCAG 2.2 3.3.8 Accessible Authentication (AA)</strong> forbids one without an
              alternative. Both switches default to off. Turning the captcha on for a role commits
              the portal to offering that role another way in &mdash; the OTP mode is the usual one
              &mdash; and the change that turns it on should say which.
            </Callout>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-modes">
            <h2 id="cdp-modes" className="cdp__h2">
              Three Form Modes, and One Handoff
            </h2>
            <MatrixTable
              caption="PortalAuthMode — what each one draws"
              columns={["Mode", "What the form shows"]}
              rows={[
                ["password", "Username, email or mobile, plus a password and, where the role asks for it, a captcha."],
                ["otp", "Mobile or email, a send control, and a six-digit code with a resend timer."],
                ["pin", "A registered identifier and a six-digit numeric PIN, masked, with its own Forgot PIN link."],
              ]}
            />
            <p>
              A PIN reaches <code>onSubmit</code> as <code>credentials.pin</code>. The form
              reuses the password field&rsquo;s own state internally, but a consumer must never
              receive a PIN under the name <code>password</code>.
            </p>
            <Callout type="info" title="The handoff is the fourth thing, and it is not a mode">
              DigiLocker is a card above the credentials divider &mdash; a route away from the
              form rather than a way of filling it in. It carried a{" "}
              <code>PortalAuthMode</code> of its own until 2026-09-02, which made it a fourth
              selectable method and suppressed the submit button while it was chosen, leaving the
              form with no way to be completed. It is now{" "}
              <code>PortalRoleTab.digilocker</code>, a boolean per role, and it renders only when{" "}
              <code>config.links.digilockerHref</code> is also set. The &ldquo;or sign in with
              credentials&rdquo; divider belongs to the card: no card, no divider.
            </Callout>
            <Callout type="warning" title="Two modes that were invented and are gone">
              This union carried <code>darpan</code> (NGO DARPAN ID) and <code>aadhaar</code>{" "}
              (Aadhaar e-KYC) until 2026-08-17. Neither exists: a full read of the MoSJE portal
              handoff &mdash; 69 authentication screens across 10 pages &mdash; found no DARPAN and
              no Aadhaar screen in any portal. They were written from a brief before the design
              file was available, and the matching Figma variant axis was retired with them.
            </Callout>
            <Callout type="info" title="pin is not a reinstatement of those two">
              It was added on 2026-09-02 on the evidence the retired pair never had: the National
              Overseas Scholarship signs in on a PIN only, and both its screens in the handoff are{" "}
              <code>Sign In Pin</code>. The Figma master&rsquo;s variant axis is{" "}
              <code>Device &times; Auth Method</code> &mdash; Password, OTP, PIN &mdash; to match.
            </Callout>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-selector">
            <h2 id="cdp-selector" className="cdp__h2">
              How the Mode Selector Presents Itself
            </h2>
            <p>
              A role with one mode gets no selector at all. With more than one, the presentation
              comes from <code>authSelectorType</code>, defaulting to segmented pills for two
              options and a radio list for three or more &mdash; long labels do not fit in a pill,
              and a description under an option only has room in a list. A dropdown is available
              where the selector must take one line.
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
            <CodeBlock>{`import { PortalLoginTemplate, type PortalLoginConfig } from "@mosje/design-system";

const config: PortalLoginConfig = {
  portalId: "nmba",
  portalName: "Nasha Mukt Bharat Abhiyaan",
  brandAssets: { emblemSrc: "/portals/nmba/brand/national-emblem.svg" },
  roles: [
    { id: "citizen", audience: "citizen", label: "Citizen", authModes: ["password", "otp"] },
    { id: "officer", audience: "officer", label: "Officer", authModes: ["password"] },
  ],
  links: { forgotPasswordHref: "/portals/nmba/forgot", helpFaqHref: "/portals/nmba/help" },
};

<PortalLoginTemplate
  config={config}
  loading={submitting}
  error={error}
  onSubmit={async (payload) => signIn(payload)}
/>`}</CodeBlock>
          </section>

          <section className="cdp__section" aria-labelledby="cdp-deeplink">
            <h2 id="cdp-deeplink" className="cdp__h2">
              Linking Straight to a Role Tab
            </h2>
            <p>
              A login page opened from a citizen-facing surface should land on the citizen tab; one
              opened from an officer directory should land on the officer tab. Build the link with{" "}
              <code>portalLoginUrl</code> rather than concatenating &mdash; it is the single place
              that knows the parameter is called <code>role</code>, so a rename cannot leave callers
              behind.
            </p>
            <CodeBlock>{`import { portalLoginUrl } from "@mosje/design-system";

portalLoginUrl("/portals/scw/login", "officer");
// "/portals/scw/login?role=officer"

// An existing role is REPLACED, never appended — ?role=a&role=b is
// ambiguous and different parsers disagree about which one wins.
portalLoginUrl("/portals/scw/login?role=citizen", "officer");
// "/portals/scw/login?role=officer"`}</CodeBlock>
            <p>
              Three behaviours worth knowing. An id matching no role is <strong>ignored</strong>, so
              a stale link opens the default tab rather than breaking the page. Switching tabs
              rewrites the URL with <code>replaceState</code>, not <code>pushState</code> &mdash; a
              tab is a view of one page, not a place you travelled to, so Back should leave the page
              rather than undo a tab switch. And the selection happens in an effect{" "}
              <strong>after</strong> mount, which costs one frame of the default tab: reading{" "}
              <code>window</code> during render would make the server and the client disagree, and a
              hydration mismatch is worse than a flicker.
            </p>
          </section>

          <section className="cdp__section" aria-labelledby="cdp-config">
            <h2 id="cdp-config" className="cdp__h2">
              PortalLoginConfig
            </h2>
            <PropsTable
              props={[
                { name: "portalId", type: "string", required: true, description: "The portal's slug — \"nmba\", \"pm-ajay\", \"scw\"." },
                { name: "portalName", type: "string", required: true, description: "The portal's full name. It titles the form and names the “Signing Into” strip." },
                { name: "portalTagline", type: "string", description: "An optional mission line for the hero." },
                { name: "portalDescription", type: "string", description: "An optional supporting sentence." },
                { name: "changeHref", type: "string", default: '"/"', description: "Where the “Change” control leads." },
                { name: "roles", type: "PortalRoleTab[]", required: true, description: "The role tabs, each with an id, a label, an optional audience, and its authentication modes." },
                { name: "defaultRoleId", type: "string", default: "the first role", description: "Which tab opens when the URL says nothing." },
                { name: "captcha", type: "boolean", default: "false", description: "The portal's default for the security captcha. A role's own `captcha` wins over it, and off is the default because WCAG 2.2 3.3.8 forbids a cognitive test without an alternative." },
                { name: "brandAssets", type: "PortalBrandAssets", description: "Overrides for the emblem, Digital India, SAMAVESH and portal marks, plus `digilockerLogoSrc` for the handoff card's logo slot. That one has no default: every portal mounts under its own basePath, so the path has to come from the caller." },
                { name: "extraFields", type: "React.ReactNode", description: "Extra controls injected into the credential form." },
                { name: "extraContent", type: "React.ReactNode", description: "A block below the form — a portal switcher grid, for instance." },
                { name: "links", type: "{ forgotPasswordHref?; registerHref?; helpFaqHref?; digilockerHref? }", description: "The help links beneath the form, plus where the DigiLocker card hands off to. Without `digilockerHref` the card does not render, whatever the role asks for." },
              ]}
            />
          </section>
        </>
      }
      accessibility={
        <section className="cdp__section" aria-labelledby="cdp-keys">
          <h2 id="cdp-keys" className="cdp__h2">
            Keyboard
          </h2>
          <ul>
            <li>
              <strong>Tab</strong> &mdash; moves through the role tabs, then the mode selector, then
              the credential fields, then the submit control, in that order.
            </li>
            <li>
              <strong>Enter</strong> on a role tab &mdash; follows it. The tabs are links, not an
              ARIA tablist, so left and right arrows do <em>not</em> move between them.
            </li>
            <li>
              <strong>Arrow keys</strong> in the radio presentation of the mode selector &mdash;
              move between modes, because those are native radio inputs.
            </li>
            <li>
              <strong>Enter</strong> in a field &mdash; submits the form, as it would in any form.
            </li>
          </ul>
          <p>
            The role tabs being links rather than a tablist is deliberate: they are shareable
            destinations, so middle-click and &ldquo;copy link address&rdquo; both work. It does
            mean the ARIA tab pattern&rsquo;s arrow-key behaviour is absent, and a page must not
            claim otherwise.
          </p>
        </section>
      }
    />
  );
}
