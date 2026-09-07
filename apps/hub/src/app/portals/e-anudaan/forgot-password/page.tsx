"use client";

import * as React from "react";
// DS Audit: PortalLoginShell ✅ existing · AuthFormCard ✅ existing ·
// IdentifierFields ➕ added to the DS in this change (three portals had each
// hand-rolled it) · Button ✅ · ConsentLine ✅.
import {
  AuthFormCard,
  Button,
  ConsentLine,
  IdentifierFields,
  PortalLoginShell,
} from "@mosje/design-system";

const BASE = "/portals/e-anudaan";

/**
 * The destination of the "Forgot Password?" link on E-Anudaan's login form.
 *
 * **It was a 404 for one commit.** The link was added on 2026-09-06 to match the
 * Handoff, which draws "Forgot Password?" beside every password field — but
 * nothing was mounted at the path, so the one recovery route out of a failed
 * sign-in answered with a page-not-found. The SCW page's own docstring records
 * the identical defect happening there, which is what makes it worth writing
 * down twice: **adding the link and mounting the page are one change, not two.**
 *
 * **Built on the login page's own shell**, not a fourth bespoke card. `scw`,
 * `nhapoa` and `pm-ajay` each drew their recovery step as a standalone Tailwind
 * panel, so a citizen who followed the link left the page they were on and
 * arrived somewhere that looked like a different department. Here the masthead,
 * hero, Signing Into strip and card are the ones they were already looking at;
 * only the question changes.
 *
 * The field accepts a username OR a mobile number, because E-Anudaan's two roles
 * sign in with different identifiers — the NGO with a username, the officer with
 * a mobile number — and asking a citizen to remember which tab they were on
 * before they can recover their password is a worse question than accepting
 * both.
 *
 * The confirmation deliberately does not disclose whether the account exists —
 * "if that is a registered account" — because a recovery form that answers "no
 * such user" is an account-enumeration oracle.
 *
 * **This is the REQUEST step.** Set New Password and its confirmation are the
 * other two, at `./reset-password`, built on 7 Sep 2026. In production they sit
 * behind a single-use token in the emailed link; here the confirmation below
 * carries the reader on to them, because a screen nothing can reach is a screen
 * nobody has reviewed.
 */
export default function EAnudaanForgotPasswordPage(): React.JSX.Element {
  const [identifier, setIdentifier] = React.useState("");
  const [sent, setSent] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!identifier.trim()) {
      setError("This field cannot be left blank.");
      return;
    }
    setError(null);
    setSent(true);
  };

  return (
    <PortalLoginShell
      emblemSrc={`${BASE}/brand/national-emblem.svg`}
      digitalIndiaSrc={`${BASE}/brand/digital-india.svg`}
      // org-logo-exempt(portal-local): E-Anudaan serves its own copies of the
      // three chrome marks from `public/portals/e-anudaan/brand/`, and the login
      // page beside this one writes the identical three paths. It is one
      // migration, not two: when that portal's chrome moves to the registry both
      // pages move together, and splitting it would leave a portal whose sign-in
      // and password recovery load their emblem from different roots.
      samaveshLogoSrc={`${BASE}/brand/samavesh-logo.svg`}
      /* The same photograph as the login page this is reached from. A recovery
         step that drops the hero would read as a different site at the exact
         moment a citizen is already unsure. */
      heroImageSrc="/portals/login-hero/e-anudaan.jpg"
      signingInto="E-Anudaan"
      changeHref="/portals"
      /* No role tabs. Recovery is one route whichever tab the citizen came from,
         and a tablist here would ask them to re-answer a question that has no
         bearing on sending a reset link. */
      tabs={[]}
    >
      {sent ? (
        <AuthFormCard
          headingLevel={1}
          heading="Reset Link Sent"
          description="If that is a registered account, a password reset link has been sent to the mobile number and email address recorded against it."
          credentialFields={
            <p className="ds-authfields__note">
              The link is valid for 30 minutes. If it does not arrive, check the
              details entered and try again.
            </p>
          }
          primaryAction={
            /* The reset step is behind the emailed link, which nothing here
               sends — so the prototype walks the reader onward instead. Same
               device as smile-admin's forget-password screen, and the only
               honest way to make a link-gated screen reachable without
               pretending mail was delivered. */
            <Button href={`${BASE}/reset-password`} fullWidth>
              Continue to Set New Password
            </Button>
          }
          footer={
            <p className="ds-plogin__help">
              <a href={`${BASE}/login`}>Back to Login</a>
            </p>
          }
        />
      ) : (
        <AuthFormCard
          headingLevel={1}
          heading="Forgot Password"
          description="Enter the username or registered mobile number for your account and a password reset link will be sent to you."
          onSubmit={handleSubmit}
          credentialFields={
            <IdentifierFields
              label="Username or Mobile Number"
              /* Short enough to fit the 390 column. "…or registered mobile
                 number" clipped mid-word at "numb", and the label above already
                 says which two it accepts. */
              placeholder="Enter your username or mobile number"
              identifier={identifier}
              /* Clear the error as they type. A message that stays put while
                 the citizen fixes the thing it complains about reads as a
                 second, unrelated failure. */
              onIdentifierChange={(value) => {
                setIdentifier(value);
                if (error) setError(null);
              }}
              /* Against the FIELD, not the card's Alert: the card-level
                 message would have restated the description word for word. */
              error={error}
            />
          }
          primaryAction={
            <Button type="submit" fullWidth>
              Send Reset Link
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
