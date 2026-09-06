import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import {
  AccountPrompt,
  AuthDivider,
  AuthFormCard,
  Button,
  ConsentLine,
  DarpanFields,
  OtpRequestFields,
  OtpVerifyFields,
  PasswordFields,
  PinFields,
  SSOButton,
  Tabs,
} from "@mosje/design-system";

/**
 * @covers AuthFormCard, PasswordFields, PinFields, DarpanFields, OtpRequestFields, OtpVerifyFields
 *
 * The card is drawn once and the stack in its slot changes. Every story below
 * shares the same `Frame`, so what differs between them is exactly what differs
 * in the component: one prop.
 */
const meta: Meta<typeof AuthFormCard> = {
  title: "Auth/AuthFormCard",
  component: AuthFormCard,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "The login form column. Seven regions are fixed; the eighth — `credentialFields` — is a slot. It replaced a four-value `Auth Method` variant axis in which three of the four drawings were structurally the same drawing.",
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof AuthFormCard>;

/** The chrome every story shares, so only the slot differs between them. */
function Frame({
  credentialFields,
  action = "Log In",
  methodTabs = true,
  error,
  footer,
}: {
  credentialFields: React.ReactNode;
  action?: string;
  methodTabs?: boolean;
  error?: React.ReactNode;
  footer?: React.ReactNode;
}): React.JSX.Element {
  const tabsId = React.useId();
  return (
    <div style={{ width: 390 }}>
      <AuthFormCard
        headingLevel={2}
        error={error}
        onSubmit={(e) => e.preventDefault()}
        sso={
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--sa-stack-16)" }}>
            <SSOButton href="#digilocker" />
            <AuthDivider />
          </div>
        }
        methodTabs={
          methodTabs ? (
            <Tabs
              tabs={[
                { id: "password", label: "Password" },
                { id: "otp", label: "OTP" },
              ]}
              active={0}
              onChange={() => undefined}
              idBase={tabsId}
              ariaLabel="How you want to sign in"
              track="none"
              indicator="underline"
              overflow
            />
          ) : null
        }
        credentialFields={credentialFields}
        primaryAction={
          <Button type="submit" fullWidth>
            {action}
          </Button>
        }
        consent={<ConsentLine termsHref="#terms" privacyHref="#privacy" />}
        accountPrompt={<AccountPrompt options={[{ label: "Create Account", href: "#register" }]} />}
        footer={footer}
      />
    </div>
  );
}

function Controlled({ children }: { children: (v: Record<string, string>, set: (k: string, v: string) => void) => React.ReactNode }) {
  const [state, setState] = React.useState<Record<string, string>>({});
  return <>{children(state, (k, v) => setState((s) => ({ ...s, [k]: v })))}</>;
}

export const Password: Story = {
  render: () => (
    <Controlled>
      {(s, set) => (
        <Frame
          credentialFields={
            <PasswordFields
              identifier={s.id ?? ""}
              onIdentifierChange={(v) => set("id", v)}
              password={s.secret ?? ""}
              onPasswordChange={(v) => set("secret", v)}
              forgotHref="#forgot"
            />
          }
        />
      )}
    </Controlled>
  ),
};

/**
 * The security check belongs to the STACK, not the card — it guards a typed
 * secret. It defaults to off because WCAG 2.2 3.3.8 forbids a cognitive
 * function test without an alternative.
 */
export const PasswordWithBotCheck: Story = {
  name: "Password — with security check",
  render: () => (
    <Controlled>
      {(s, set) => (
        <Frame
          credentialFields={
            <PasswordFields
              identifier={s.id ?? ""}
              onIdentifierChange={(v) => set("id", v)}
              password={s.secret ?? ""}
              onPasswordChange={(v) => set("secret", v)}
              forgotHref="#forgot"
              botCheck={
                <p style={{ fontSize: "var(--sa-type-body-3-size)", color: "var(--sa-text-neutral-subtle)" }}>
                  BotCheck renders here — pass the node, so the token reaches the submit payload.
                </p>
              }
            />
          }
        />
      )}
    </Controlled>
  ),
};

/** NOS is PIN-only, so it draws no method tabs at all. */
export const Pin: Story = {
  render: () => (
    <Controlled>
      {(s, set) => (
        <Frame
          methodTabs={false}
          credentialFields={
            <PinFields
              identifier={s.id ?? ""}
              onIdentifierChange={(v) => set("id", v)}
              pin={s.secret ?? ""}
              onPinChange={(v) => set("secret", v)}
              forgotHref="#forgot"
            />
          }
        />
      )}
    </Controlled>
  ),
};

/**
 * Two registry identifiers, no password, no security check — and a button that
 * says what the department's own screen says.
 */
export const Darpan: Story = {
  render: () => (
    <Controlled>
      {(s, set) => (
        <Frame
          action="Continue with DARPAN"
          credentialFields={
            <DarpanFields
              darpanId={s.id ?? ""}
              onDarpanIdChange={(v) => set("id", v)}
              pan={s.pan ?? ""}
              onPanChange={(v) => set("pan", v)}
              note="Other login roles (DWO, State, Ministry, Finance, PMU) use Ministry-issued credentials — separate login flow"
            />
          }
        />
      )}
    </Controlled>
  ),
};

/** Step one of two. The primary action IS the step. */
export const OtpRequest: Story = {
  name: "OTP — request",
  render: () => (
    <Controlled>
      {(s, set) => (
        <Frame
          action="Send OTP"
          credentialFields={
            <OtpRequestFields mobile={s.mobile ?? ""} onMobileChange={(v) => set("mobile", v)} />
          }
        />
      )}
    </Controlled>
  ),
};

/** Step two, with the cooldown already spent — the state an incorrect code lands in. */
export const OtpVerify: Story = {
  name: "OTP — verify",
  render: () => (
    <Controlled>
      {(s, set) => (
        <Frame
          action="Verify and Log In"
          credentialFields={
            <OtpVerifyFields
              maskedValue="+91 98••••1234"
              onEdit={() => undefined}
              otp={s.otp ?? ""}
              onOtpChange={(v) => set("otp", v)}
              secondsRemaining={0}
              onResend={() => undefined}
            />
          }
        />
      )}
    </Controlled>
  ),
};

/** A failed attempt, in the department's words, between the heading and the fields. */
export const WithError: Story = {
  render: () => (
    <Controlled>
      {(s, set) => (
        <Frame
          error="The user ID or password does not match our records. Check both and try again."
          credentialFields={
            <PasswordFields
              identifier={s.id ?? ""}
              onIdentifierChange={(v) => set("id", v)}
              password={s.secret ?? ""}
              onPasswordChange={(v) => set("secret", v)}
              forgotHref="#forgot"
            />
          }
        />
      )}
    </Controlled>
  ),
};

/**
 * A portal renaming the fields it asks for.
 *
 * `identifierLabel`, `identifierPlaceholder`, `passwordLabel` and
 * `passwordPlaceholder` exist so a portal can say "Employee Code" where the
 * estate's default says "Username / Email / Mobile" — WITHOUT a new stack. Reach
 * for a new stack only when the FIELDS differ, not when their wording does.
 *
 * `footer` is the card's last region, after the account prompt. It is where the
 * help route goes; anything larger belongs on the page, not in the card.
 */
export const RelabelledForAPortal: Story = {
  name: "Password — a portal's own wording",
  render: () => (
    <Controlled>
      {(s, set) => (
        <Frame
          methodTabs={false}
          footer={
            <p style={{ textAlign: "center", fontSize: "var(--sa-type-body-3-size)" }}>
              <a href="#help">Need Help?</a>
            </p>
          }
          credentialFields={
            <PasswordFields
              identifier={s.id ?? ""}
              onIdentifierChange={(v) => set("id", v)}
              password={s.secret ?? ""}
              onPasswordChange={(v) => set("secret", v)}
              identifierLabel="Employee Code"
              identifierPlaceholder="Enter the code on your identity card"
              passwordLabel="Ministry Password"
              passwordPlaceholder="Enter your Ministry password"
              forgotHref="#forgot"
            />
          }
        />
      )}
    </Controlled>
  ),
};

/**
 * A four-digit PIN.
 *
 * `length` drives the field's `maxLength` AND its placeholder, so the two cannot
 * drift apart — a placeholder promising six digits over a field that accepts
 * four is a defect a citizen discovers by being rejected.
 */
export const PinFourDigit: Story = {
  name: "PIN — four digits",
  render: () => (
    <Controlled>
      {(s, set) => (
        <Frame
          methodTabs={false}
          credentialFields={
            <PinFields
              identifier={s.id ?? ""}
              onIdentifierChange={(v) => set("id", v)}
              pin={s.secret ?? ""}
              onPinChange={(v) => set("secret", v)}
              identifierLabel="Registered Mobile Number"
              identifierPlaceholder="10-digit mobile number"
              length={4}
              forgotHref="#forgot"
            />
          }
        />
      )}
    </Controlled>
  ),
};

/**
 * The code sent to an email rather than a phone.
 *
 * `channel` changes nothing visually — it documents intent, and it is what a
 * reviewer reads to check the masking rule was applied to the right kind of
 * value. An email masks its local part (`a•••••••s@gmail.com`); a phone keeps
 * the last four.
 */
export const OtpVerifyEmail: Story = {
  name: "OTP — verify, sent to email",
  render: () => (
    <Controlled>
      {(s, set) => (
        <Frame
          action="Verify and Log In"
          credentialFields={
            <OtpVerifyFields
              channel="email"
              maskedValue="a•••••••s@gmail.com"
              onEdit={() => undefined}
              otp={s.otp ?? ""}
              onOtpChange={(v) => set("otp", v)}
              secondsRemaining={23}
              onResend={() => undefined}
            />
          }
        />
      )}
    </Controlled>
  ),
};
