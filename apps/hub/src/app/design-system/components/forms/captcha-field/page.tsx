import type { Metadata } from "next";
import * as React from "react";

import {
  Callout,
  CodeBlock,
  ComponentDocPage,
  type A11yItem,
  type PropDef,
} from "@/components/design-system/docs-kit";

import { CaptchaFieldPlayground } from "./captcha-field-playground";

export const metadata: Metadata = {
  title: "Captcha Field — Design System",
  description:
    "The legacy security-check field: a challenge, a refresh control and an answer. Retained for one existing portal, and an accessibility risk on any new one.",
};

/*
 * Read off `CaptchaFieldProps` in
 * packages/design-system/components/forms/captcha-field.tsx. The interface is a
 * CLOSED list — it extends nothing, so no native attributes pass through, and
 * `challenge` is a discriminated union rather than two separate props.
 */
const PROPS: PropDef[] = [
  {
    name: "challenge",
    type: '{ type: "image"; src: string; alt?: string } | { type: "text"; characters: string }',
    required: true,
    description:
      "The challenge the server issued: an image URL, or the characters for a text fallback. The text variant is rendered with `role=\"img\"` so it is announced as a picture of characters, not as readable text.",
  },
  {
    name: "value",
    type: "string",
    required: true,
    description: "The reader's answer. Controlled.",
  },
  {
    name: "onValueChange",
    type: "(next: string) => void",
    required: true,
    description: "Called with the typed string. This is not `onChange` — the component exposes no native change handler.",
  },
  {
    name: "onRefresh",
    type: "() => void",
    required: true,
    description:
      "Asks the server for a new challenge. It MUST also clear `value` — the component does not do it for you, and a stale answer against a fresh challenge always fails.",
  },
  {
    name: "error",
    type: "string",
    default: "undefined",
    description:
      "Message shown under the field. Its presence also renders the error state on the input and links the message through `aria-describedby`.",
  },
  {
    name: "label",
    type: "string",
    default: '"Security check"',
    description: "Accessible name for the answer input, applied as `aria-label`. There is no visible label.",
  },
  {
    name: "placeholder",
    type: "string",
    default: '"Enter the characters"',
    description: "Placeholder inside the answer input.",
  },
  {
    name: "disabled",
    type: "boolean",
    default: "false",
    description: "Disables the answer input and the refresh button.",
  },
  {
    name: "id",
    type: "string",
    default: "auto",
    description: "Answer-input id, falling back to a generated `useId()`. The error id is derived from it.",
  },
  {
    name: "className",
    type: "string",
    default: "undefined",
    description: "Merged onto the outer wrapper.",
  },
];

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
      status="Stable"
      summary="The security-check field: a challenge, a refresh control and an answer. It is retained for one existing portal. On a new portal a visual challenge with no alternative is a WCAG 2.2 AA conformance failure, not a hardening measure."
      figma={{ absent: "Not yet published in the Figma library." }}
      specimen={<CaptchaFieldPlayground />}
      props={PROPS}
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
            server-side signal, or nothing at all. If one must ship, ship an audio alternative
            alongside it.
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
