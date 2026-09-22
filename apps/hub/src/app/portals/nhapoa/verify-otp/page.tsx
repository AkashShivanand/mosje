"use client";

// DS Audit: PortalLoginShell ✅ · AuthFormCard ✅ · OtpVerifyFields ✅ · AuthResult ✅
// · AuthHelpLine ✅ · Button ✅ — all existing. Not the login template: this page
// signs nobody in, it confirms a code before an action.

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  AuthFormCard,
  AuthHelpLine,
  AuthResult,
  Button,
  OtpVerifyFields,
  PortalLoginShell,
} from "@mosje/design-system";
import Link from "next/link";

const BASE = "/portals/nhapoa";
const LOGIN_HREF = `${BASE}/login`;

/** The same chrome the SAMBAL login and recovery pages pass the template. */
const CHROME = {
  emblemSrc: `${BASE}/brand/national-emblem.svg`,
  digitalIndiaSrc: `${BASE}/brand/digital-india.svg`,
  // org-logo-exempt(portal-local): SAMBAL serves its own copy of the chrome
  // marks from its brand folder, byte-identical to the estate's.
  samaveshLogoSrc: `${BASE}/brand/samavesh-logo.svg`,
  signingInto: "SAMBAL",
  portalTagline: "Smart Access for Mainstreaming of Beneficiaries through Augmented Linkages",
  changeHref: "/portals",
};

/**
 * Mock OTP verification. Any 6-digit code verifies (demo). Stands where the live
 * portal gates a citizen action behind a code; nothing links here yet.
 *
 * Drawn in the login page's own chrome so the step does not look like a
 * different department.
 */
export default function VerifyOtpPage() {
  const router = useRouter();
  const [otp, setOtp] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [verified, setVerified] = React.useState(false);
  const [timer, setTimer] = React.useState(30);

  React.useEffect(() => {
    if (verified || timer <= 0) return;
    const t = setInterval(() => setTimer((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [verified, timer]);

  return (
    <PortalLoginShell {...CHROME} tabs={[]}>
      {verified ? (
        <AuthResult
          headingLevel={1}
          announce
          heading="OTP Verified"
          description="The code has been verified."
          action={
            <Button linkAs={Link} href={LOGIN_HREF} fullWidth>
              Back to Login
            </Button>
          }
        />
      ) : (
        <AuthFormCard
          headingLevel={1}
          heading="Verify OTP"
          onSubmit={(e) => {
            e.preventDefault();
            if (/^\d{6}$/.test(otp)) {
              setVerified(true);
            } else {
              setError("Enter the 6-digit OTP.");
              setTimer(0);
            }
          }}
          credentialFields={
            <OtpVerifyFields
              maskedValue="your registered mobile number"
              channel="phone"
              /* There is no identifier step on this page; "Edit" returns the
                 reader to wherever they came from. */
              onEdit={() => router.back()}
              otp={otp}
              onOtpChange={(value) => {
                setOtp(value);
                if (error) setError(null);
              }}
              secondsRemaining={timer}
              onResend={() => {
                setOtp("");
                setError(null);
                setTimer(30);
              }}
              error={error}
            />
          }
          primaryAction={
            <Button type="submit" fullWidth>
              Verify OTP
            </Button>
          }
          footer={<AuthHelpLine href={LOGIN_HREF}>Back to Login</AuthHelpLine>}
        />
      )}
    </PortalLoginShell>
  );
}
