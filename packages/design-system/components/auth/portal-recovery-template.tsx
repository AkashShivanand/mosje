"use client";

// DS Audit: PortalLoginShell ✅ · AuthFormCard ✅ · AuthResult ✅ · AuthHelpLine ✅
// · IdentifierFields ✅ · OtpVerifyFields ✅ · NewPasswordFields ✅ · Button ✅
// · estimatePasswordScore ✅. Nothing new is drawn here: this is the step machine
// that five portals were writing by hand around parts that already existed.

import * as React from "react";
import { Button } from "../actions/button";
import { estimatePasswordScore } from "../forms/password-strength-meter";
import { AuthFormCard } from "./auth-form-card";
import { AuthHelpLine } from "./auth-parts";
import { AuthResult } from "./auth-result";
import { IdentifierFields, NewPasswordFields, OtpVerifyFields } from "./credential-fields";
import { loginShellChrome } from "./login-shell-chrome";
import { maskOtpDestination } from "./portal-login-template";
import { PortalLoginShell } from "./portal-login-shell";
import type {
  AuthStepResult,
  PortalIdentifierKind,
  PortalRecoveryConfig,
  PortalRecoveryStep,
} from "./types";

export interface PortalRecoveryTemplateProps {
  config: PortalRecoveryConfig;
  /**
   * Where the flow opens. @default "request"
   *
   * `"reset"` is the page an emailed reset link lands on — the second half of the
   * `link` flow, which is a separate route because the link is.
   */
  startAt?: "request" | "reset";
  /**
   * Step one. Return `{ ok: false, error }` to keep the reader on the field.
   *
   * **On the `link` flow, never return an error that says the account does not
   * exist.** A recovery form that answers "no such user" tells anyone who asks
   * which accounts are real; the confirmation is worded so it does not. Refuse a
   * malformed value, nothing more.
   */
  onRequest?: (identifier: string) => AuthStepResult | void | Promise<AuthStepResult | void>;
  /** The `otp` flow's code. Return `{ ok: false, error }` for a wrong code. */
  onVerify?: (otp: string) => AuthStepResult | void | Promise<AuthStepResult | void>;
  /** The new password, already checked for length and match. */
  onReset?: (password: string) => AuthStepResult | void | Promise<AuthStepResult | void>;
  /** Called with each step as the reader reaches it — for analytics, or a URL. */
  onStepChange?: (step: PortalRecoveryStep) => void;
  /** @default 1 — the recovery step is the whole page. */
  headingLevel?: 1 | 2 | 3;
}

const DEFAULT_LABEL: Record<PortalIdentifierKind, string> = {
  mobile: "Registered Mobile Number",
  email: "Email Address",
  text: "Username",
};

const DEFAULT_PLACEHOLDER: Record<PortalIdentifierKind, string> = {
  mobile: "Enter your registered mobile number",
  email: "Enter your registered email address",
  text: "Enter your username",
};

async function run<T>(
  handler: ((value: T) => AuthStepResult | void | Promise<AuthStepResult | void>) | undefined,
  value: T
): Promise<AuthStepResult> {
  if (!handler) return { ok: true };
  try {
    return (await handler(value)) ?? { ok: true };
  } catch {
    return { ok: false, error: "Something went wrong. Try again." };
  }
}

/**
 * A portal's password recovery, as one page with the login page's own chrome.
 *
 * The code counterpart of the Figma `Auth / CredentialRecovery` (56640:4103),
 * which had none. Three flows — see `PortalRecoveryFlow` — over the same five
 * parts, with the step machine held here so a portal cannot, for instance, send
 * a citizen to a new-password form without a verified code.
 *
 * **Every step keeps "Back to Login".** A citizen who remembers their password
 * halfway through must not have to finish a reset to get out.
 *
 * **The copy is the handoff's** (`9465:35397` → `:36977`, SCW) in Title Case,
 * and the link flow's confirmation is E-Anudaan's, which does not disclose
 * whether the account exists.
 */
export function PortalRecoveryTemplate({
  config,
  startAt = "request",
  onRequest,
  onVerify,
  onReset,
  onStepChange,
  headingLevel = 1,
}: PortalRecoveryTemplateProps): React.JSX.Element {
  const kind: PortalIdentifierKind = config.identifierKind ?? (config.flow === "otp" ? "mobile" : "text");
  const minLength = config.minPasswordLength ?? 8;

  const [step, setStepState] = React.useState<PortalRecoveryStep>(startAt);
  const [busy, setBusy] = React.useState(false);
  const [identifier, setIdentifier] = React.useState("");
  const [identifierError, setIdentifierError] = React.useState<string | null>(null);
  const [masked, setMasked] = React.useState("");
  const [otp, setOtp] = React.useState("");
  const [otpError, setOtpError] = React.useState<string | null>(null);
  const [timer, setTimer] = React.useState(30);
  const [password, setPassword] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [passwordError, setPasswordError] = React.useState<string | null>(null);
  const [confirmError, setConfirmError] = React.useState<string | null>(null);

  const setStep = (next: PortalRecoveryStep) => {
    setStepState(next);
    onStepChange?.(next);
  };

  React.useEffect(() => {
    if (step !== "verify" || timer <= 0) return;
    const t = setInterval(() => setTimer((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [step, timer]);

  const score = React.useMemo(() => estimatePasswordScore(password), [password]);
  const back = <AuthHelpLine href={config.loginHref}>Back to Login</AuthHelpLine>;

  const sendRequest = async (resend: boolean) => {
    if (!identifier.trim()) {
      setIdentifierError("This field cannot be left blank.");
      return;
    }
    setBusy(true);
    const result = await run(onRequest, identifier.trim());
    setBusy(false);
    if (!result.ok) {
      if (resend) setOtpError(result.error);
      else setIdentifierError(result.error);
      return;
    }
    if (config.flow === "link") {
      setStep("sent");
      return;
    }
    setMasked(result.maskedDestination ?? maskOtpDestination(identifier.trim(), kind));
    setTimer(30);
    setOtp("");
    setOtpError(null);
    if (!resend) setStep("verify");
  };

  const verify = async () => {
    if (otp.length < 6) {
      setOtpError("Enter the 6-digit OTP.");
      return;
    }
    setBusy(true);
    const result = await run(onVerify, otp);
    setBusy(false);
    if (!result.ok) {
      setOtpError(result.error);
      // A code known to be wrong must not also make the reader wait (ResendTimer).
      setTimer(0);
      return;
    }
    setStep("reset");
  };

  const reset = async () => {
    const tooShort = password.length < minLength;
    const mismatch = !confirm ? "Re-enter the new password." : confirm !== password ? "The two passwords do not match." : null;
    setPasswordError(tooShort ? `Use at least ${minLength} characters.` : null);
    setConfirmError(mismatch);
    if (tooShort || mismatch) return;
    setBusy(true);
    const result = await run(onReset, password);
    setBusy(false);
    if (!result.ok) {
      setPasswordError(result.error);
      return;
    }
    setStep("success");
  };

  const body = (() => {
    if (config.flow === "contact") {
      return (
        <AuthResult
          headingLevel={headingLevel}
          status="notice"
          icon="support_agent"
          heading="Reset Your Password"
          description={config.contact}
          action={
            <Button href={config.loginHref} fullWidth>
              Back to Login
            </Button>
          }
        />
      );
    }

    switch (step) {
      case "request":
        return (
          <AuthFormCard
            headingLevel={headingLevel}
            heading="Forgot Password"
            description={
              config.flow === "otp"
                ? `Enter your ${DEFAULT_LABEL[kind].replace(/^Registered /, "registered ").toLowerCase()} to receive an OTP.`
                : "Enter the details for your account and a password reset link will be sent to you."
            }
            onSubmit={(e) => {
              e.preventDefault();
              void sendRequest(false);
            }}
            credentialFields={
              <IdentifierFields
                kind={kind}
                label={config.identifierLabel ?? DEFAULT_LABEL[kind]}
                placeholder={config.identifierPlaceholder ?? DEFAULT_PLACEHOLDER[kind]}
                identifier={identifier}
                onIdentifierChange={(value) => {
                  setIdentifier(value);
                  if (identifierError) setIdentifierError(null);
                }}
                error={identifierError}
              />
            }
            primaryAction={
              <Button type="submit" loading={busy} fullWidth>
                {config.flow === "otp" ? "Send OTP" : "Send Reset Link"}
              </Button>
            }
            footer={back}
          />
        );
      case "verify":
        return (
          <AuthFormCard
            headingLevel={headingLevel}
            heading="Verify OTP"
            /* No description: the row beneath already says where the code went,
               and a lede repeating it is the same sentence twice. */
            onSubmit={(e) => {
              e.preventDefault();
              void verify();
            }}
            credentialFields={
              <OtpVerifyFields
                maskedValue={masked}
                channel={kind === "email" ? "email" : "phone"}
                onEdit={() => {
                  setStep("request");
                  setOtp("");
                  setOtpError(null);
                }}
                otp={otp}
                onOtpChange={(value) => {
                  setOtp(value);
                  if (otpError) setOtpError(null);
                }}
                secondsRemaining={timer}
                onResend={() => void sendRequest(true)}
                error={otpError}
              />
            }
            primaryAction={
              <Button type="submit" loading={busy} disabled={otp.length < 6} fullWidth>
                Verify OTP
              </Button>
            }
            footer={back}
          />
        );
      case "reset":
        return (
          <AuthFormCard
            headingLevel={headingLevel}
            heading="Set New Password"
            description="Create a strong password for your account."
            onSubmit={(e) => {
              e.preventDefault();
              void reset();
            }}
            credentialFields={
              <NewPasswordFields
                password={password}
                onPasswordChange={(value) => {
                  setPassword(value);
                  if (passwordError) setPasswordError(null);
                }}
                confirm={confirm}
                onConfirmChange={(value) => {
                  setConfirm(value);
                  if (confirmError) setConfirmError(null);
                }}
                score={score}
                passwordError={passwordError}
                confirmError={confirmError}
              />
            }
            primaryAction={
              <Button type="submit" loading={busy} fullWidth>
                Reset Password
              </Button>
            }
            footer={back}
          />
        );
      case "sent":
        return (
          <AuthResult
            headingLevel={headingLevel}
            announce
            icon="mark_email_read"
            heading="Reset Link Sent"
            description="If that is a registered account, a password reset link has been sent to the contact details recorded against it."
            action={
              config.continueHref ? (
                <>
                  <Button href={config.continueHref} fullWidth>
                    Continue to Set New Password
                  </Button>
                  {back}
                </>
              ) : (
                <Button href={config.loginHref} fullWidth>
                  Back to Login
                </Button>
              )
            }
          />
        );
      case "success":
        return (
          <AuthResult
            headingLevel={headingLevel}
            announce
            heading="Password Reset Successful"
            description="Your password has been reset. You can now log in with your new password."
            action={
              <Button href={config.loginHref} fullWidth>
                Back to Login
              </Button>
            }
          />
        );
    }
  })();

  return (
    <PortalLoginShell
      {...loginShellChrome(config)}
      /* No role tabs: recovery is one route whichever tab the citizen came from. */
      tabs={[]}
    >
      {body}
    </PortalLoginShell>
  );
}
