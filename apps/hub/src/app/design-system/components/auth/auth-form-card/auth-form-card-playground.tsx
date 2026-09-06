"use client";

import * as React from "react";
// DS Audit: AuthFormCard ✅ · PasswordFields ✅ · PinFields ✅ · DarpanFields ✅ ·
// OtpRequestFields ✅ · OtpVerifyFields ✅ · SSOButton ✅ · AuthDivider ✅ ·
// ConsentLine ✅ · AccountPrompt ✅ · Button ✅ · Tabs ✅ · RadioGroup ✅ ·
// Checkbox ✅ — every control on this page is already in the barrel.
import {
  AccountPrompt,
  AuthDivider,
  AuthFormCard,
  Button,
  Checkbox,
  ConsentLine,
  DarpanFields,
  OtpRequestFields,
  OtpVerifyFields,
  PasswordFields,
  PinFields,
  RadioGroup,
  SSOButton,
  Tabs,
} from "@mosje/design-system";

/**
 * Every stack the slot ships with, switched live.
 *
 * The point this has to make is that the CARD does not change. The heading, the
 * DigiLocker handoff, the method tabs, the button, the consent line and the
 * account prompt are written once, outside the switch; only `credentialFields`
 * moves. A reader who watches the chrome stay still while the middle changes has
 * understood why this stopped being a variant axis.
 */
const STACKS = [
  { value: "password", label: "Identifier + Password", description: "The mode most portals sign in with." },
  { value: "pin", label: "Identifier + PIN", description: "NOS signs in this way and only this way." },
  { value: "darpan", label: "DARPAN", description: "Two registry identifiers, no password and no security check." },
  { value: "otp-request", label: "OTP request", description: "Step one — the destination, alone." },
  { value: "otp-verify", label: "OTP verify", description: "Step two — where it went, the boxes, the way to try again." },
] as const;

type StackId = (typeof STACKS)[number]["value"];

/** One primary action per step, and its label belongs to the mode. */
const ACTION: Record<StackId, string> = {
  password: "Log In",
  pin: "Log In",
  darpan: "Continue with DARPAN",
  "otp-request": "Send OTP",
  "otp-verify": "Verify and Log In",
};

const controls: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "var(--sa-inline-24)",
  alignItems: "flex-start",
};

/*
 * The card gets EXACTLY 390 — `layout/login/content/width`, the width the form
 * column really has. The stage adds its own padding on top rather than eating
 * into it: at maxWidth 390 the padding left the card 342, and the OTP verify
 * stack's six 48px boxes overflowed it by 8px. A specimen narrower than the real
 * surface reports defects the surface does not have, and hides the ones it does.
 */
const stage: React.CSSProperties = {
  width: "100%",
  maxWidth: "calc(390px + var(--sa-padding-24) * 2)",
  padding: "var(--sa-padding-24)",
  background: "var(--sa-bg-neutral-base)",
  borderRadius: "var(--sa-shape-8)",
  border: "1px solid var(--sa-border-neutral-subtle)",
};

export function AuthFormCardPlayground(): React.JSX.Element {
  const [stack, setStack] = React.useState<StackId>("password");
  const [identifier, setIdentifier] = React.useState("");
  const [secret, setSecret] = React.useState("");
  const [pan, setPan] = React.useState("");
  const [mobile, setMobile] = React.useState("");
  const [otp, setOtp] = React.useState("");
  const [showSso, setShowSso] = React.useState(true);
  const [showTabs, setShowTabs] = React.useState(true);
  const tabsId = React.useId();
  const radioName = React.useId();

  const fields: Record<StackId, React.ReactNode> = {
    password: (
      <PasswordFields
        identifier={identifier}
        onIdentifierChange={setIdentifier}
        password={secret}
        onPasswordChange={setSecret}
        forgotHref="#forgot"
      />
    ),
    pin: (
      <PinFields
        identifier={identifier}
        onIdentifierChange={setIdentifier}
        pin={secret}
        onPinChange={setSecret}
        forgotHref="#forgot"
      />
    ),
    darpan: (
      <DarpanFields
        darpanId={identifier}
        onDarpanIdChange={setIdentifier}
        pan={pan}
        onPanChange={setPan}
        note="Other login roles (DWO, State, Ministry, Finance, PMU) use Ministry-issued credentials — separate login flow"
      />
    ),
    "otp-request": <OtpRequestFields mobile={mobile} onMobileChange={setMobile} />,
    "otp-verify": (
      <OtpVerifyFields
        maskedValue="+91 98••••1234"
        onEdit={() => setStack("otp-request")}
        otp={otp}
        onOtpChange={setOtp}
        secondsRemaining={0}
        onResend={() => undefined}
      />
    ),
  };

  return (
    <div
      style={{
        padding: "var(--sa-padding-40)",
        background: "var(--sa-bg-neutral-subtle)",
        borderRadius: "var(--sa-shape-8)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--sa-stack-32)",
      }}
    >
      <div style={controls}>
        <RadioGroup
          name={radioName}
          legend="Stack in the slot"
          value={stack}
          onChange={(v: string) => setStack(v as StackId)}
          options={STACKS.map((s) => ({ value: s.value, label: s.label, description: s.description }))}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--sa-stack-8)" }}>
          <Checkbox label="Show DigiLocker" size="sm" checked={showSso} onCheckedChange={setShowSso} />
          <Checkbox label="Show method tabs" size="sm" checked={showTabs} onCheckedChange={setShowTabs} />
        </div>
      </div>

      <div style={stage}>
        <AuthFormCard
          headingLevel={3}
          description="Everything outside the slot is drawn once. Only the middle changes."
          onSubmit={(event) => event.preventDefault()}
          sso={
            showSso ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--sa-stack-16)" }}>
                <SSOButton href="#digilocker" />
                <AuthDivider />
              </div>
            ) : null
          }
          methodTabs={
            showTabs ? (
              <Tabs
                tabs={[
                  { id: "credentials", label: "Credentials" },
                  { id: "darpan", label: "DARPAN ID" },
                ]}
                active={stack === "darpan" ? 1 : 0}
                onChange={(i) => setStack(i === 1 ? "darpan" : "password")}
                idBase={tabsId}
                ariaLabel="How you want to sign in"
                track="none"
                indicator="underline"
                overflow
              />
            ) : null
          }
          credentialFields={fields[stack]}
          primaryAction={
            <Button type="submit" fullWidth>
              {ACTION[stack]}
            </Button>
          }
          consent={<ConsentLine termsHref="#terms" privacyHref="#privacy" />}
          accountPrompt={<AccountPrompt options={[{ label: "Create Account", href: "#register" }]} />}
        />
      </div>
    </div>
  );
}
