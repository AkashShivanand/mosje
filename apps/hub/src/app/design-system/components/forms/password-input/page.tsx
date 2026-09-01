import type { Metadata } from "next";
import * as React from "react";

import {
  CodeBlock,
  ComponentDocPage,
  type A11yItem,
  type PropDef,
} from "@/components/design-system/docs-kit";

import { PasswordInputPlayground } from "./password-input-playground";

export const metadata: Metadata = {
  title: "Password Input — Design System",
  description:
    "A password field with a reveal toggle that is a real button, names the action rather than the state, and suppresses the browser's competing control.",
};

/*
 * Read off `PasswordInputProps` in
 * packages/design-system/components/forms/password-input.tsx. The interface
 * extends `InputProps` minus `type`, so every Input prop — `invalid`,
 * `leftIcon`, `rightIcon` — and every native input attribute passes through.
 */
const PROPS: PropDef[] = [
  {
    name: "showLabel",
    type: "string",
    default: '"Show password"',
    description:
      "Accessible name for the reveal button while the password is hidden. It states the action, not the state, so a screen-reader user hears what pressing it will do.",
  },
  {
    name: "hideLabel",
    type: "string",
    default: '"Hide password"',
    description: "Accessible name for the reveal button while the password is visible.",
  },
  {
    name: "hideToggle",
    type: "boolean",
    default: "false",
    description:
      "Removes the reveal button entirely and renders a plain password field. Reach for it only where a recorded policy forbids revealing.",
  },
  {
    name: "invalid",
    type: "boolean",
    default: "false",
    description: "Inherited from Input. Renders the error state and sets `aria-invalid`.",
  },
  {
    name: "className",
    type: "string",
    default: "undefined",
    description:
      "Merged onto the wrapper that holds the field and the toggle — or onto the input itself when `hideToggle` is set, because there is then no wrapper.",
  },
  {
    name: "...native",
    type: "Omit<InputProps, \"type\">",
    default: "—",
    description:
      "Every Input prop and every native input attribute is forwarded, including `value`, `onChange`, `name`, `required`, `autoComplete` and `ref`. `type` is owned by the component, which flips it between password and text.",
  },
];

const A11Y: A11yItem[] = [
  {
    criterion: "1.3.5 Identify Input Purpose",
    level: "AA",
    description:
      "The field stays a real `<input>` whose `type` flips, which is what password managers key on. Always pass `autoComplete` — \"current-password\" to sign in, \"new-password\" to set one.",
  },
  {
    criterion: "2.1.1 Keyboard",
    level: "A",
    description:
      "The toggle sits after the field in DOM order, so tabbing goes field, toggle, submit. It is not a tab trap.",
  },
  {
    criterion: "2.4.7 Focus Visible",
    level: "AA",
    description: "Focus is drawn on the field and on the toggle separately.",
  },
  {
    criterion: "2.5.8 Target Size (Minimum)",
    level: "AA",
    description: "The field inherits the 44px minimum height of Input, and the toggle is sized within it past 24×24.",
  },
  {
    criterion: "3.3.8 Accessible Authentication (Minimum)",
    level: "AA",
    description:
      "Revealing the password is the alternative to typing it blind, and the field accepts a paste from a password manager. Neither is blocked.",
  },
  {
    criterion: "4.1.2 Name, Role, Value",
    level: "A",
    description:
      "The toggle is a real `<button type=\"button\">` carrying `aria-pressed` for the current state alongside an action-shaped name.",
  },
];

export default function PasswordInputPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Password Input"
      status="Stable"
      summary="A password field with a reveal toggle. Typing a password blind is the single biggest cause of failed sign-ins, and every login in the estate needs the same affordance — which is why this is a design-system control rather than a per-portal one-off."
      figma={{ absent: "Not yet published in the Figma library." }}
      specimen={<PasswordInputPlayground />}
      props={PROPS}
      a11y={A11Y}
      whenToUse={{
        use: [
          "A reader signs in to a portal.",
          "A reader creates or resets a password, where the meter belongs beside it.",
          "Any field whose value must be hidden from someone looking over the reader's shoulder.",
        ],
        avoid: [
          "The field is an ordinary text field — use Input, which does not obscure what is typed.",
          "You were about to use Input with `type=\"password\"`. That loses the toggle, its accessible name, and the suppression of the browser's own competing control.",
          "The field holds a one-time password — use OTP Input, which is not secret and benefits from being visible.",
        ],
      }}
      related={[
        {
          label: "Password Strength Meter",
          href: "/design-system/components/forms/password-strength-meter",
          reason: "beside a password being created, never one being entered",
        },
        {
          label: "Input",
          href: "/design-system/components/forms/input",
          reason: "the control this one is built on",
        },
        {
          label: "Portal Login Shell",
          href: "/design-system/components/auth/portal-login-shell",
          reason: "the surface this control most often appears on",
        },
        {
          label: "Form Field",
          href: "/design-system/components/forms/form-field",
          reason: "the label and error wiring this control expects",
        },
      ]}
      design={
        <section className="cdp__section" aria-labelledby="cdp-details">
          <h2 id="cdp-details" className="cdp__h2">
            The Details That Matter
          </h2>
          <ul>
            <li>
              <strong>It is a real <code>type=&quot;button&quot;</code>.</strong> Inside a form a bare{" "}
              <code>&lt;button&gt;</code> defaults to submit, so revealing the password would submit
              the form. This is the commonest bug in hand-rolled versions.
            </li>
            <li>
              <strong>The name states the action, not the state</strong> — &quot;Show password&quot;,
              &quot;Hide password&quot; — so a screen-reader user hears what pressing it will do.{" "}
              <code>aria-pressed</code> carries the current state alongside it.
            </li>
            <li>
              <strong>The browser&apos;s own reveal control is suppressed.</strong> Chromium, Edge and
              Safari each inject one; left alone the reader gets two competing buttons.
            </li>
            <li>
              <strong>The caret stays put.</strong> The toggle prevents the default on pointer-down,
              so the field does not lose focus and the reader does not have to click back into it.
            </li>
          </ul>
          <p>
            Revealing resets to hidden on unmount only. A password left visible is the reader&apos;s
            explicit choice, and re-hiding it mid-typing would be worse than leaving it.
          </p>
        </section>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            Example
          </h2>
          <CodeBlock>{`import { FormField, PasswordInput } from "@mosje/design-system";

<FormField label="Password" required>
  {(control) => (
    <PasswordInput {...control} name="password" autoComplete="current-password" required />
  )}
</FormField>`}</CodeBlock>
          <p>
            When a password is being created rather than entered, pass{" "}
            <code>autoComplete=&quot;new-password&quot;</code> and put the strength meter below the
            field, linked to it.
          </p>
          <CodeBlock>{`<FormField label="Create a Password" required hint="At least 12 characters.">
  {(control) => (
    <PasswordInput
      {...control}
      autoComplete="new-password"
      aria-describedby="pw-meter"
      value={password}
      onChange={(event) => setPassword(event.target.value)}
    />
  )}
</FormField>
<PasswordStrengthMeter id="pw-meter" score={score} />`}</CodeBlock>
        </section>
      }
      accessibility={
        <section className="cdp__section" aria-labelledby="cdp-keys">
          <h2 id="cdp-keys" className="cdp__h2">
            Keyboard
          </h2>
          <ul>
            <li>
              <strong>Tab</strong> — field, then the reveal toggle, then the next control. The toggle
              is deliberately after the field, which is the order people expect.
            </li>
            <li>
              <strong>Enter or Space</strong> on the toggle — reveal or hide. Enter in the FIELD still
              submits the form, because the toggle is a separate element with{" "}
              <code>type=&quot;button&quot;</code>.
            </li>
          </ul>
          <p>
            Always pass <code>autoComplete</code>. Without it a password manager cannot tell a sign-in
            field from a registration field, which is a usability failure for exactly the readers who
            most need one.
          </p>
        </section>
      }
    />
  );
}
