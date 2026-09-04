import type { Metadata } from "next";
import * as React from "react";

import {
  Callout,
  CodeBlock,
  ComponentDocPage,
  type A11yItem,
} from "@/components/design-system/docs-kit";

import { CaptchaFieldPlayground } from "./captcha-field-playground";

export const metadata: Metadata = {
  title: "Captcha Field — Design System",
  description:
    "The legacy security-check field: a challenge, a refresh control and an answer. Retained for one existing portal, and an accessibility risk on any new one.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "1.1.1 Non-text Content",
    level: "A",
    description:
      "The image challenge carries an `alt`, and the text challenge carries `role=\"img\"` with a label — so neither is silently skipped. Neither, however, gives a non-sighted reader a way to answer.",
  },
  {
    criterion: "3.3.2 Labels or Instructions",
    level: "A",
    description:
      "The refresh button's accessible name states its full effect — that it also clears anything the reader has typed — rather than saying only \"Refresh\".",
  },
  {
    criterion: "3.3.1 Error Identification",
    level: "A",
    description:
      "An `error` renders the message and links it through `aria-describedby`. A red border alone is never an error.",
  },
  {
    criterion: "4.1.2 Name, Role, Value",
    level: "A",
    description: "The answer field is a real Input with an accessible name; the refresh control is a real button.",
  },
];

export default function CaptchaFieldPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Captcha Field"
      status="Deprecated"
      summary="DEPRECATED — use Bot Check. The legacy security-check field: a challenge, a refresh control and an answer. A visual challenge with no alternative is a WCAG 2.2 AA conformance failure, not a hardening measure, and the audio alternative it would ship with is easier for bots than for people."
      figma={{ absent: "Not yet published in the Figma library." }}
      specimen={<CaptchaFieldPlayground />}
      propsFrom="CaptchaFieldProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "An existing portal already presents this challenge and the server still issues one. SMILE-Transgender and Garima Greh are the only surfaces in this position today.",
          "An audio or non-visual alternative ships alongside it, so a non-sighted reader has a way through.",
        ],
        avoid: [
          "A new portal needs protection from automated submissions — use rate limiting, or a server-side signal that asks the reader for nothing.",
          "The form is a citizen service journey. WCAG 2.2 SC 3.3.8 Accessible Authentication (Minimum) is Level AA, and a cognitive function test with no alternative fails it.",
          "You were about to add one to a login screen alongside a one-time password. Two challenges is not twice the security; it is twice the abandonment.",
        ],
      }}
      related={[
        {
          label: "OTP Input",
          href: "/design-system/components/forms/otp-input",
          reason: "the verification step that does not test the reader",
        },
        {
          label: "Password Input",
          href: "/design-system/components/forms/password-input",
          reason: "the field this one usually sits beneath",
        },
        {
          label: "Portal Login Shell",
          href: "/design-system/components/auth/portal-login-shell",
          reason: "the surface this control appears on",
        },
      ]}
      design={
        <section className="cdp__section" aria-labelledby="cdp-discouraged">
          <h2 id="cdp-discouraged" className="cdp__h2">
            Read This Before Adding One
          </h2>
          <Callout title="A Captcha Is an Accessibility Risk, Not a Feature" type="warning">
            WCAG 2.2 SC 3.3.8 <em>Accessible Authentication (Minimum)</em> is Level AA, and this estate
            targets AA — so a cognitive function test with no alternative is a conformance failure.
            GIGW 3.0 binds government properties to the same expectation. Prefer rate limiting, a
            server-side signal, or nothing at all. Do <strong>not</strong> reach for an audio
            alternative: bots solve audio challenges over 85% of the time while only 31.2% of them
            get three-person agreement among people, so it weakens the check and excludes the
            readers it was meant to serve. Use <a href="/design-system/components/forms/bot-check">Bot
            Check</a> instead.
          </Callout>
          <p>
            Only one surface in the estate uses this today. Adding it to another portal is a decision
            somebody should be able to justify, and the justification belongs in the change that adds
            it.
          </p>
          <p>
            Refreshing replaces the challenge <strong>and</strong> clears the answer. Say so rather
            than wiping the field silently — which is why the refresh button&apos;s accessible name
            names both effects.
          </p>
        </section>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            Example
          </h2>
          <CodeBlock>{`import { CaptchaField } from "@mosje/design-system";

const [answer, setAnswer] = React.useState("");
const [challenge, setChallenge] = React.useState(initialChallenge);

<CaptchaField
  challenge={challenge}
  value={answer}
  onValueChange={setAnswer}
  onRefresh={() => {
    setAnswer("");            // the component does NOT clear it for you
    void fetchChallenge().then(setChallenge);
  }}
  error={rejected ? "Those characters did not match. Try the new image." : undefined}
/>`}</CodeBlock>
          <p>
            The image variant needs an <code>alt</code> only where the alt text does not defeat the
            challenge. The default is a generic description, which is honest: the image is not
            readable, and pretending otherwise would be worse.
          </p>
        </section>
      }
      accessibility={
        <section className="cdp__section" aria-labelledby="cdp-a11y-notes">
          <h2 id="cdp-a11y-notes" className="cdp__h2">
            Notes
          </h2>
          <p>
            The component does what it can — a named refresh control, a labelled answer field, a
            linked error message — but no amount of wiring makes a visual challenge answerable by a
            non-sighted reader. The remedy is an alternative route, supplied by the service, not a
            better label here.
          </p>
          <p>
            The answer field is named by <code>aria-label</code> rather than a visible label. That is
            a divergence from the estate&apos;s own rule that every control carries a visible label,
            and it is recorded here rather than hidden: the challenge image above the field is doing
            the labelling visually.
          </p>
        </section>
      }
    />
  );
}
