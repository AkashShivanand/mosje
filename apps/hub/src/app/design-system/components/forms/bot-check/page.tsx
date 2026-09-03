import type { Metadata } from "next";
import * as React from "react";

import {
  Callout,
  CodeBlock,
  ComponentDocPage,
  MatrixTable,
  type A11yItem,
} from "@/components/design-system/docs-kit";

import { BotCheckPlayground } from "./bot-check-playground";

export const metadata: Metadata = {
  title: "Bot Check — Design System",
  description:
    "The estate's replacement for a captcha: an invisible, server-verified check by default, a deliberate gesture where one is needed, and always a route out for a citizen it will not pass.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "3.3.8 Accessible Authentication (Minimum)",
    level: "AA",
    status: "partial",
    description:
      "The default `invisible` mode presents no cognitive function test, which is what the criterion asks for. `checkbox` presents a gesture, not a test. `challenge` DOES present one and is deprecated for exactly that reason — a portal using it does not meet 3.3.8 on this field.",
    evidence:
      "Verified by reading the rendered output: `invisible` returns null unless status is `failed`, so there is nothing for a citizen to solve.",
  },
  {
    criterion: "3.3.1 Error Identification",
    level: "A",
    status: "verified",
    description:
      "A failed check always renders its message, in every mode including `invisible`, with `role=\"alert\"` and `aria-describedby` on the control. A form that will not submit and will not say why is the failure this component exists to prevent.",
    evidence: "The `failed` branch is unconditional across all three modes.",
  },
  {
    criterion: "2.4.4 Link Purpose (In Context)",
    level: "A",
    status: "verified",
    description:
      "The escape hatch is a real link whose text states its purpose — \"Cannot complete this check? Contact support\" — not a bare \"help\".",
    evidence: "Default `helpLabel`; overridable, and required either way.",
  },
  {
    criterion: "4.1.2 Name, Role, Value",
    level: "A",
    status: "verified",
    description:
      "`checkbox` mode is a real checkbox in a real label. `challenge` mode reuses the DS `Input`. Neither invents a widget role.",
  },
  {
    criterion: "1.1.1 Non-text Content",
    level: "A",
    status: "partial",
    description:
      "In `challenge` mode the image carries an `alt` and the text challenge carries `role=\"img\"` with a label, so neither is silently skipped — but neither gives a non-sighted citizen a way to answer. That is the mode's defect, and the escape hatch is the answer to it.",
  },
];

export default function BotCheckPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Bot Check"
      status="Stable"
      summary="Confirms a request came from a person without asking the person to prove it. Invisible and server-verified by default; a deliberate gesture where one is wanted; a distorted-characters challenge only where a legacy backend can issue nothing else — and always a route out for a citizen it will not pass."
      figma={{ absent: "Not yet published in the Figma library." }}
      specimen={<BotCheckPlayground />}
      propsFrom="BotCheckProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "A form is genuinely under automated abuse and server-side rate limiting alone has not held it.",
          "The server can issue and verify a proof-of-work token, so the check costs the citizen nothing.",
          "You can name where a blocked citizen goes instead. If you cannot, do not add the check.",
        ],
        avoid: [
          "The form is not under attack. Nothing is the correct default, and it is also the position of the UK Government Digital Service.",
          "You want a second factor. This is not one — it says \"probably a person\", never \"this person\".",
          "You are about to put it beside a one-time password. Two challenges is not twice the security; it is twice the abandonment.",
          "You were going to add an audio alternative. Do not — see the measurements below.",
        ],
      }}
      related={[
        {
          label: "Captcha Field",
          href: "/design-system/components/forms/captcha-field",
          reason: "the deprecated component this replaces",
        },
        {
          label: "OTP Input",
          href: "/design-system/components/forms/otp-input",
          reason: "a verification step that does not test the citizen",
        },
        {
          label: "Portal Login Template",
          href: "/design-system/components/auth/portal-login-template",
          reason: "the surface that renders this, per role",
        },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-why">
            <h2 id="cdp-why" className="cdp__h2">
              Why This Is Not a Captcha
            </h2>
            <p>
              The distorted-characters test fails at both of the jobs it is given, and the numbers
              are not close.
            </p>
            <MatrixTable
              caption="Measured performance of the audio alternative a text captcha ships with"
              columns={["Measure", "Figure"]}
              rows={[
                ["Audio challenges where three people agree on the answer", "31.2%"],
                ["Audio challenges bots solve correctly", "over 85%"],
                ["Time for a blind citizen to complete an audio challenge", "65s (visual: 9.8s)"],
                ["Blind users who disagree audio alternatives are accessible to them", "29.5%"],
              ]}
            />
            <p>
              So the &ldquo;accessible alternative&rdquo; is harder for the people it is for and
              easier for the software it exists to stop. That is why this component has no audio
              mode, and why adding one would make it worse on both axes at once.
            </p>
            <Callout title="A Bot Check Cannot Be Enforced in the Browser" type="warning">
              This component renders the presentation and the escape hatch. Whether a request is
              actually refused is entirely server-side, and a bot never runs this code. Do not read a
              passing check in the browser as a security guarantee.
            </Callout>
          </section>

          <section className="cdp__section" aria-labelledby="cdp-order">
            <h2 id="cdp-order" className="cdp__h2">
              What to Reach For, in Order
            </h2>
            <MatrixTable
              caption="Escalation order"
              columns={["Reach for", "What it is", "Cost to the citizen"]}
              rows={[
                [
                  "Nothing",
                  "Server-side rate limiting plus a honeypot. The right default for a form that is not under attack.",
                  "None",
                ],
                [
                  "invisible",
                  "A self-hosted proof-of-work token (ALTCHA / Cap, SHA-256) issued and verified by our own server.",
                  "None unless it fails",
                ],
                [
                  "checkbox",
                  "One deliberate gesture, where the server wants a human act as well. Not a cognitive test, so 3.3.8 permits it.",
                  "One click",
                ],
                [
                  "challenge",
                  "The legacy distorted-characters test. Deprecated. Only where a backend can issue nothing else.",
                  "A cognitive function test",
                ],
              ]}
            />
            <Callout title="Self-Hosted, Not Hosted" type="info">
              A hosted service such as Cloudflare Turnstile solves the same problem, but sends every
              visitor&apos;s signals to another company&apos;s infrastructure. On a Government of
              India property that is a decision to take deliberately, with a data-residency answer
              behind it — not one to acquire by importing a script tag. Self-hosted proof-of-work
              keeps it inside the estate, which also means no cookie and no consent banner.
            </Callout>
          </section>

          <section className="cdp__section" aria-labelledby="cdp-states">
            <h2 id="cdp-states" className="cdp__h2">
              The States, and the One That Draws Nothing
            </h2>
            <MatrixTable
              caption="What each mode renders for each server state"
              columns={["Status", "invisible", "checkbox", "challenge"]}
              rows={[
                ["idle", "nothing", "the gesture", "the challenge"],
                ["verifying", "nothing", "the gesture, disabled, with a status line", "the challenge"],
                ["verified", "nothing", "the gesture, ticked", "the challenge"],
                ["failed", "the message + the way out", "the message + the way out", "the message + the way out"],
              ]}
            />
            <p>
              <code>idle</code> and <code>verifying</code> are different states and the component
              does not conflate them. A &ldquo;verified&rdquo; tick in invisible mode would be the
              interface narrating its own construction, so there is not one.
            </p>
          </section>

          <section className="cdp__section" aria-labelledby="cdp-escape">
            <h2 id="cdp-escape" className="cdp__h2">
              The Escape Hatch Is Required, on Purpose
            </h2>
            <p>
              <code>helpHref</code> is not optional. A proof-of-work or reputation check has no
              accessible workaround of its own: a citizen on a shared connection, an older device
              that fails the work factor, or a screen reader that cannot complete the gesture is
              simply stuck, with no way to identify themselves as a person. The link is the
              alternative the criterion asks for, and making it optional is how it goes missing from
              the one portal that needed it.
            </p>
            <p>
              <code>PortalLoginTemplate</code> enforces the same rule one level up: a role can ask
              for a check, but if neither <code>botCheck.helpHref</code> nor the portal&apos;s help
              route is set, <strong>no check renders at all</strong>. A dead end is worse than no
              check.
            </p>
          </section>
        </>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            Example
          </h2>
          <CodeBlock>{`import { BotCheck } from "@mosje/design-system";

// The ordinary case: the server verifies a proof-of-work token and the
// citizen is never asked for anything.
<BotCheck status={check.status} helpHref="/help/contact" />

// A legacy backend that can only issue characters. Deprecated — record why.
<BotCheck
  mode="challenge"
  status={check.status}
  helpHref="/help/contact"
  challenge={{ type: "image", src: check.imageUrl }}
  value={answer}
  onValueChange={setAnswer}
  onRefresh={() => {
    setAnswer("");           // the component does NOT clear it for you
    void issueChallenge();
  }}
/>`}</CodeBlock>
          <p>
            In a portal config, prefer the template&apos;s own switch — it applies the
            both-halves-required rule for you:
          </p>
          <CodeBlock>{`const config: PortalLoginConfig = {
  botCheck: { mode: "invisible", helpHref: "/help/contact" },
  roles: [
    { id: "organisation", audience: "organisation", label: "Implementing Agency",
      authModes: ["password"], captcha: true },   // this role asks for the check
    { id: "citizen", audience: "citizen", label: "Citizen",
      authModes: ["password"], captcha: false },  // this one opts out
  ],
};`}</CodeBlock>
        </section>
      }
      accessibility={
        <section className="cdp__section" aria-labelledby="cdp-a11y-notes">
          <h2 id="cdp-a11y-notes" className="cdp__h2">
            Notes
          </h2>
          <p>
            The honest position: <code>invisible</code> and <code>checkbox</code> meet WCAG 2.2
            3.3.8. <code>challenge</code> does not, and no amount of alternative text changes that —
            it is a cognitive function test by construction. It is kept only so a legacy backend is
            not a blocker, and a portal that selects it should record the reason in the change that
            selects it.
          </p>
          <p>
            The failure message and the escape hatch are the two things that are never conditional.
            Everything else about this component can be switched off.
          </p>
        </section>
      }
    />
  );
}
