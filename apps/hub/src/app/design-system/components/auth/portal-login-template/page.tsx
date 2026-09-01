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
      "The captcha is a cognitive function test. Where it is enabled, the OTP mode is the alternative that satisfies this criterion — so a role offering captcha must also offer another way in.",
  },
  {
    criterion: "2.4.7 Focus Visible",
    level: "AA",
    description: "Fields, buttons and tabs all draw the estate's focus ring, inherited from the DS controls rather than restyled here.",
  },
  {
    criterion: "GIGW 3.0 — One h1 per page",
    level: "GIGW",
    status: "partial",
    description:
      "The component renders “Sign In to <portal>” as the page's `<h1>`, which is correct on a real login page and means it must be the only one there. It also means the template cannot be embedded inside a page that already has an `<h1>` — this documentation page is exactly that case, and carries two.",
  },
];

export default function PortalLoginTemplatePage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Portal Login Template"
      status="Stable"
      summary="A whole portal login page built from one configuration object. It declares the role tabs, each role's authentication modes and the credential fields, and renders them inside Portal Login Shell — so a portal describes who signs in rather than building a login page."
      figma={{ node: "portalLoginTemplate" }}
      specimen={<PortalLoginTemplateSpecimen />}
      propsFrom="PortalLoginTemplateProps"
      props={HELPER_PROPS}
      a11y={A11Y}
      whenToUse={{
        use: [
          "A portal signs in more than one kind of user and each kind has its own way in.",
          "The authentication modes are the estate's own — a password form, a mobile OTP, or a DigiLocker handoff.",
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
        { label: "Captcha Field", href: "/design-system/components/forms/captcha-field", reason: "the challenge the password mode can carry" },
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
              no way to write a rule &mdash; such as &ldquo;hide DigiLocker for officers&rdquo;
              &mdash; that held in more than one of them. A portal that seems to need a fourth
              audience is renaming, not adding.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-modes">
            <h2 id="cdp-modes" className="cdp__h2">
              Two Form Modes, and One Handoff
            </h2>
            <MatrixTable
              caption="PortalAuthMode — what each one draws"
              columns={["Mode", "What the form shows", "Where it sits"]}
              rows={[
                ["password", "Username, email or mobile, plus a password and an optional captcha.", "In the credential form"],
                ["otp", "Mobile or email, a send control, and a six-digit code with a resend timer.", "In the credential form"],
                ["digilocker", "A single call to action that leaves for a government identity provider.", "Above the credentials divider — it is a handoff, not a form mode"],
              ]}
            />
            <Callout type="warning" title="Two modes that were invented and are gone">
              This union carried <code>darpan</code> (NGO DARPAN ID) and <code>aadhaar</code>{" "}
              (Aadhaar e-KYC) until 2026-08-17. Neither exists: a full read of the MoSJE portal
              handoff &mdash; 69 authentication screens across 10 pages &mdash; found no DARPAN and
              no Aadhaar screen in any portal. They were written from a brief before the design
              file was available, and the matching Figma variant axis was retired with them.
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
                { name: "brandAssets", type: "PortalBrandAssets", description: "Overrides for the emblem, Digital India, SAMAVESH and portal marks." },
                { name: "extraFields", type: "React.ReactNode", description: "Extra controls injected into the credential form." },
                { name: "extraContent", type: "React.ReactNode", description: "A block below the form — a portal switcher grid, for instance." },
                { name: "links", type: "{ forgotPasswordHref?; registerHref?; helpFaqHref? }", description: "The help links beneath the form." },
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
