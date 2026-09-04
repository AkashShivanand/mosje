"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Icon, type DemoFillDetail } from "@mosje/design-system";
import { Button, Field, TextInput } from "@/components/tg/ui";
import { roleByEmail } from "@/lib/tg/roles";
import { useTg } from "@/lib/tg/store/store";

/**
 * TG officer/admin login (mock). Email → Send OTP → Verify (dev OTP 123456; the
 * mock accepts any 6-digit OTP). The email resolves the role, stored in the mock
 * session, which drives routing. All 4 roles are one-click fillable from the
 * DemoDock's Sign in tab (demo OTP 123456).
 */
export default function AdminLoginPage() {
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

  function sendOtp(e: React.FormEvent) {
    e.preventDefault();
    if (!roleByEmail(email)) {
      setError("Unknown email. Use the Demo credentials panel to pick a role.");
      return;
    }
    setError(null);
    setOtpSent(true);
  }

  function verify(e: React.FormEvent) {
    e.preventDefault();
    const role = roleByEmail(email);
    if (!role) {
      setError("Unknown email.");
      return;
    }
    if (otp.replace(/\D/g, "").length < 6) {
      setError("Enter the 6-digit OTP (dev OTP is 123456).");
      return;
    }
    login(role.id);
    router.push(role.home);
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <a
        href="#login-main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-navy focus:px-4 focus:py-2 focus:text-label-1 focus:font-semibold focus:text-white"
      >
        Skip to login form
      </a>
      {/* Left hero panel */}
      <aside className="relative hidden flex-col justify-center bg-navy p-12 text-white md:flex md:w-1/2">
        <Image src="/portals/tg/brand/samavesh-logo.svg" alt="SAMAVESH" width={40} height={40} className="h-16 w-16" />
        <h1 className="mt-6 text-headline-3">National Portal for Transgender Persons</h1>
        <p className="mt-3 text-body-1 text-white/85">Officer &amp; Administration Console</p>
        <div className="my-6 h-1 w-64 rounded bg-saffron" />
        <p className="text-headline-4">Review. Verify. Certify.</p>
        <p className="mt-5 max-w-md text-body-1 text-white/75">
          Certificate-of-Identity applications flow through a maker → checker → District Magistrate
          approval chain, with SLA tracking end to end.
        </p>
        {/* bottom offset clears the fixed AppSwitcher FAB (bottom-left) */}
        <div className="absolute inset-x-12 bottom-[var(--cmp-appsw-safe-area)] border-t border-white/15 pt-6">
          <p className="text-label-3 uppercase text-white/55">Signing Into</p>
          <p className="text-body-2 font-bold">TG Administration</p>
        </div>
      </aside>

      {/* Right form panel */}
      <main id="login-main" className="flex flex-1 items-center justify-center bg-surface-muted px-4 py-12 sm:px-6">
        <div className="w-full max-w-md">
          <div className="mb-6 flex items-center gap-2 text-navy">
            <Icon name="verified_user" />
            <span className="rounded-full bg-navy/10 px-2.5 py-1 text-label-3 uppercase">
              Admin
            </span>
          </div>
          <h2 className="text-headline-4 text-ink">Officer / Admin Login</h2>
          <p className="mt-1 mb-6 text-body-2 text-ink-muted">
            Sign in with your official email and one-time password.
          </p>

          <form className="space-y-5" onSubmit={otpSent ? verify : sendOtp}>
            <Field label="Email Address" required>
              <TextInput
                type="email"
                placeholder="name@mosje.in"
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
                <span className="mt-1.5 block text-body-3 text-ink-hint">Dev OTP: 123456</span>
              </Field>
            )}

            {error && <p className="text-body-2 font-medium text-reject-fg">{error}</p>}

            <Button type="submit" className="w-full">
              {otpSent ? "Verify OTP" : "Send OTP"}
              <Icon name="arrow_forward" size={16} />
            </Button>
          </form>

          <p className="mt-8 text-center text-body-3 text-ink-hint">
            Ministry of Social Justice &amp; Empowerment, Government of India
          </p>
        </div>
      </main>
    </div>
  );
}
