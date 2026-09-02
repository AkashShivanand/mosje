import type { Metadata } from "next";
import * as React from "react";

import {
  Callout,
  CodeBlock,
  ComponentDocPage,
  type A11yItem,
} from "@/components/design-system/docs-kit";

import { PasswordStrengthMeterPlayground } from "./password-strength-meter-playground";

export const metadata: Metadata = {
  title: "Password Strength Meter — Design System",
  description:
    "Four segments and a word, shown under a password the reader is creating. Advisory, never a gate, and never beside a password being entered.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "1.4.1 Use of Colour",
    level: "A",
    description:
      "The strength word carries the meaning, not the colour. A red bar and an amber bar are the same bar to a colour-blind reader, so the word is always rendered.",
  },
  {
    criterion: "4.1.3 Status Messages",
    level: "AA",
    description:
      "The strength word is a polite live region, so a change is announced without interrupting a screen-reader user mid-word.",
  },
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    description:
      "The segments are `aria-hidden`, so the bar is not read segment by segment. Only the caption and the word reach assistive technology.",
  },
  {
    criterion: "3.3.2 Labels or Instructions",
    level: "A",
    description:
      "Passing `id` and referencing it from the password field's `aria-describedby` connects the meter to the field it describes, rather than leaving it as loose text below.",
  },
  {
    criterion: "3.3.8 Accessible Authentication (Minimum)",
    level: "AA",
    description:
      "The meter is advisory and blocks nothing, so it never becomes an obstacle to a reader using a password manager or a passphrase.",
  },
];

export default function PasswordStrengthMeterPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Password Strength Meter"
      status="Stable"
      summary="Four segments and a word, shown under a password the reader is creating. The word carries the meaning rather than the colour, and changes are announced politely so a screen-reader user is not interrupted mid-word."
      figma={{ absent: "Not yet published in the Figma library." }}
      specimen={<PasswordStrengthMeterPlayground />}
      propsFrom="PasswordStrengthMeterProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "A reader is creating a password during registration.",
          "A reader is setting a new password during a reset.",
        ],
        avoid: [
          "The reader is signing in. On a sign-in screen the meter tells an attacker how close a guess is, and tells a legitimate reader something they cannot act on.",
          "A policy minimum must be enforced — put it in the field's own error message, where it can say what to change. A colour bar cannot.",
          "No zxcvbn score is available. Do not substitute a count of capitals and symbols; that measures the wrong thing.",
        ],
      }}
      related={[
        {
          label: "Password Input",
          href: "/design-system/components/forms/password-input",
          reason: "the field this meter sits under",
        },
        {
          label: "Form Field",
          href: "/design-system/components/forms/form-field",
          reason: "where a policy minimum is stated and enforced",
        },
        {
          label: "Progress",
          href: "/design-system/components/data-display/progress",
          reason: "for a bar that measures completion rather than quality",
        },
      ]}
      design={
        <section className="cdp__section" aria-labelledby="cdp-advisory">
          <h2 id="cdp-advisory" className="cdp__h2">
            Advisory, Not a Gate
          </h2>
          <Callout type="warning" title="Do Not Block Submission on a Score">
            The meter encourages a stronger password; it does not decide whether one is acceptable. If
            a policy minimum exists, enforce it in the field&apos;s error message, which can say what
            to change. Blocking on &quot;Fair&quot; with only a coloured bar to explain why leaves the
            reader guessing.
          </Callout>
          <p>
            The zxcvbn score runs 0 to 4 and collapses to four named buckets, with 0 and 1 both
            reading as Weak. <code>null</code> is the resting state before anything is typed, and
            renders an em dash rather than a Weak reading of an empty field.
          </p>
        </section>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            Example
          </h2>
          <CodeBlock>{`import zxcvbn from "zxcvbn";
import { PasswordInput, PasswordStrengthMeter } from "@mosje/design-system";

const [password, setPassword] = React.useState("");
const score = password ? zxcvbn(password).score : null;

<PasswordInput
  value={password}
  onChange={(event) => setPassword(event.target.value)}
  autoComplete="new-password"
  aria-describedby="pw-meter"
/>
<PasswordStrengthMeter id="pw-meter" score={score} />`}</CodeBlock>
          <p>
            <code>strengthFromScore</code> is exported alongside the component where the same bucket
            is needed elsewhere — in a submit guard, or in a message that names the strength.
          </p>
          <CodeBlock>{`import { strengthFromScore } from "@mosje/design-system";

const strength = strengthFromScore(score); // "none" | "weak" | "fair" | "good" | "strong"`}</CodeBlock>
        </section>
      }
      accessibility={
        <section className="cdp__section" aria-labelledby="cdp-a11y-notes">
          <h2 id="cdp-a11y-notes" className="cdp__h2">
            Notes
          </h2>
          <p>
            The bar itself is <code>aria-hidden</code>. A screen reader hears &quot;Password strength,
            Good&quot;, not four unnamed segments — which is the whole reason the word is rendered
            beside the bar rather than in a tooltip.
          </p>
          <p>
            The live region is polite, so it waits for a pause in typing. Do not raise it to assertive:
            announcing on every keystroke makes the field impossible to use with a screen reader.
          </p>
        </section>
      }
    />
  );
}
