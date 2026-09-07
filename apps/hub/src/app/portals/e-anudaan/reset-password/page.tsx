"use client";

import * as React from "react";
// DS Audit: PortalLoginShell ✅ · AuthFormCard ✅ · Button ✅ · ConsentLine ✅ ·
// Icon ✅ · PasswordStrengthMeter ✅ (existed, unused by anything until now) ·
// NewPasswordFields ➕ added to the DS in this change ·
// AuthResult ➕ added to the DS in this change ·
// estimatePasswordScore ➕ added beside the meter, labelled as not zxcvbn.
import {
  AuthFormCard,
  AuthResult,
  Button,
  ConsentLine,
  estimatePasswordScore,
  Icon,
  NewPasswordFields,
  PortalLoginShell,
} from "@mosje/design-system";

const BASE = "/portals/e-anudaan";

/** The department's floor. Advisory strength is separate — see the meter's docstring. */
const MIN_LENGTH = 8;

/**
 * Set New Password, and the confirmation that follows it.
 *
 * The two steps the Figma `Auth / CredentialRecovery` (56640:4103) has drawn
 * since 2 September and no portal could reach: `Step=Reset` and `Step=Success`.
 * They were recorded as an open item on the login template's component record
 * for five days, which is the right place for a gap but not a place to leave one.
 *
 * **One route, two states**, because Success is what Reset becomes — the same
 * shape as the forgot-password page, and the same shape the master uses (a Step
 * property on one card, not two cards).
 *
 * **Reached from the emailed link.** In production that link carries a
 * single-use token and this page would refuse without one. It has none here, so
 * the recovery page walks the reader onward instead — the same thing
 * `smile-admin`'s forget-password screen does, and the only honest way to make
 * a link-gated screen reachable in a prototype.
 *
 * **The two fields are validated differently on purpose.** Length is checked
 * against the department's floor and reported on the first field, because that
 * is the field that has to change. A mismatch is reported on the SECOND field,
 * because the first one is not wrong — it is the one being copied.
 *
 * **Strength never blocks submission.** The meter is advisory, as its own
 * docstring insists: a colour bar cannot say what to change, so a policy is
 * enforced in a field's error message where it can.
 */
export default function EAnudaanResetPasswordPage(): React.JSX.Element {
  const [password, setPassword] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [passwordError, setPasswordError] = React.useState<React.ReactNode>(null);
  const [confirmError, setConfirmError] = React.useState<React.ReactNode>(null);
  const [done, setDone] = React.useState(false);

  const score = React.useMemo(() => estimatePasswordScore(password), [password]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const tooShort = password.length < MIN_LENGTH;
    const mismatch = confirm !== password;

    setPasswordError(
      tooShort ? `Use at least ${MIN_LENGTH} characters.` : null,
    );
    setConfirmError(
      !confirm ? "Re-enter the new password." : mismatch ? "The two passwords do not match." : null,
    );

    if (tooShort || mismatch || !confirm) return;
    setDone(true);
  };

  return (
    <PortalLoginShell
      emblemSrc={`${BASE}/brand/national-emblem.svg`}
      digitalIndiaSrc={`${BASE}/brand/digital-india.svg`}
      // org-logo-exempt(portal-local): E-Anudaan serves its own copies of the
      // three chrome marks from `public/portals/e-anudaan/brand/`, and both the
      // login and forgot-password pages beside this one write the identical
      // paths. One migration, not three — when that portal's chrome moves to the
      // registry all of them move together.
      samaveshLogoSrc={`${BASE}/brand/samavesh-logo.svg`}
      heroImageSrc="/portals/login-hero/e-anudaan.jpg"
      signingInto="E-Anudaan"
      changeHref="/portals"
      /* No role tabs: recovery is one route whichever role began it. */
      tabs={[]}
    >
      {done ? (
        <AuthResult
          headingLevel={1}
          /* It REPLACES the form on the same route, so nothing navigates and
             nothing else tells a screen-reader user the outcome. */
          announce
          heading="Password Reset Successful!"
          description="Your password has been reset successfully. You can now log in with your new password."
          action={
            <Button
              href={`${BASE}/login`}
              appearance="outlined"
              fullWidth
              iconLeft={<Icon name="arrow_back" size={16} aria-hidden="true" />}
            >
              Back to Login
            </Button>
          }
        />
      ) : (
        <AuthFormCard
          headingLevel={1}
          heading="Set New Password"
          onSubmit={handleSubmit}
          credentialFields={
            <NewPasswordFields
              password={password}
              /* Clear a field's own error as it is corrected — a message that
                 stays put while the citizen fixes what it complains about reads
                 as a second, unrelated failure. */
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
            <Button type="submit" fullWidth>
              Reset Password
            </Button>
          }
          consent={
            <ConsentLine
              termsHref="/website/terms-conditions"
              privacyHref="/website/privacy-policy"
            />
          }
          footer={
            <p className="ds-plogin__help">
              <a href={`${BASE}/login`}>Back to Login</a>
            </p>
          }
        />
      )}
    </PortalLoginShell>
  );
}
