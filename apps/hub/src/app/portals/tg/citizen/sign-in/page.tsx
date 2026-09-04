"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Divider, Icon, type DemoFillDetail } from "@mosje/design-system";
import { Button, Field, TextInput } from "@/components/tg/ui";
import { useTg } from "@/lib/tg/store/store";

/**
 * Citizen sign-in (mock). Email → Send OTP → Verify (dev OTP 123456; the live
 * flow also offers DigiLocker/Aadhaar — represented here as a mock option). Any
 * email + any 6-digit OTP signs in as the demo citizen. Fillable from the
 * DemoDock's Sign in tab.
 */
export default function CitizenSignInPage() {
  const router = useRouter();
  const { login } = useTg();
  const [email, setEmail] = React.useState("");
  const [otp, setOtp] = React.useState("");
  const [otpSent, setOtpSent] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const handler = (e: Event) => {
      const { id, password } = (e as CustomEvent<DemoFillDetail>).detail;
      setEmail(id);
      setOtp(password);
      setOtpSent(true);
      setError(null);
    };
    window.addEventListener("demo:fill", handler);
    return () => window.removeEventListener("demo:fill", handler);
  }, []);

  function signIn() {
    login("citizen");
    router.push("/portals/tg/citizen/dashboard");
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!otpSent) {
      if (!email.includes("@")) {
        setError("Enter a valid email address.");
        return;
      }
      setError(null);
      setOtpSent(true);
      return;
    }
    if (otp.replace(/\D/g, "").length < 6) {
      setError("Enter the 6-digit OTP (dev OTP is 123456).");
      return;
    }
    signIn();
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <a
        href="#signin-main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-navy focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to sign-in form
      </a>
      <aside className="relative hidden flex-col justify-center bg-navy p-12 text-white md:flex md:w-1/2">
        <Image src="/portals/tg/brand/national-emblem-white.svg" alt="National Emblem" width={40} height={65} className="h-16 w-auto" />
        <h1 className="mt-6 text-4xl font-bold tracking-tight">National Portal for Transgender Persons</h1>
        <p className="mt-3 text-xl text-white/85">Apply for and track your Certificate of Identity</p>
        <div className="my-6 h-1 w-64 rounded bg-saffron" />
        <p className="max-w-md text-base leading-relaxed text-white/75">
          Recognised under the Transgender Persons (Protection of Rights) Act, 2019. One application —
          certificate, ID card, and access to welfare.
        </p>
      </aside>

      <main id="signin-main" className="flex flex-1 items-center justify-center bg-surface-muted px-4 py-12 sm:px-6">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold text-ink">Citizen Sign In</h2>
          <p className="mt-1 mb-6 text-sm text-ink-muted">Sign in to apply for or track your certificate.</p>

          <form className="space-y-5" onSubmit={onSubmit}>
            <Field label="Email Address" required>
              <TextInput
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setOtpSent(false);
                }}
                autoComplete="email"
              />
            </Field>

            {otpSent && (
              <Field label="One-Time Password" required>
                <TextInput
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  autoFocus
                />
                <span className="mt-1.5 block text-xs text-ink-hint">Dev OTP: 123456</span>
              </Field>
            )}

            {error && <p className="text-sm font-medium text-reject-fg">{error}</p>}

            <Button type="submit" className="w-full">
              {otpSent ? "Verify & Sign In" : "Send OTP"}
              <Icon name="arrow_forward" size={16} />
            </Button>
          </form>

          <div className="my-6 flex items-center gap-3 text-xs text-ink-hint">
            <Divider className="flex-1" /> OR <Divider className="flex-1" />
          </div>
          <Button type="button" variant="outline" className="w-full" onClick={signIn}>
            Continue with DigiLocker
          </Button>

          <p className="mt-8 text-center text-xs text-ink-hint">
            Ministry of Social Justice &amp; Empowerment, Government of India
          </p>
        </div>
      </main>
    </div>
  );
}
