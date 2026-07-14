"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { DemoFab, type DemoFillDetail } from "@mosje/design-system";
import { Button, Field, TextInput } from "@/components/ui";
import { ADMIN_ROLES, roleByEmail } from "@/lib/roles";
import { useTg } from "@/lib/store/store";

/**
 * TG officer/admin login (mock). Email → Send OTP → Verify (dev OTP 123456; the
 * mock accepts any 6-digit OTP). The email resolves the role, stored in the mock
 * session, which drives routing. All 4 roles are one-click fillable via the
 * DemoFab (demo OTP 123456).
 */
const DEMO_ACCOUNTS = ADMIN_ROLES.map((r) => ({
  role: r.label,
  id: r.email,
  password: "123456",
}));

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
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-navy focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to login form
      </a>
      {/* Left hero panel */}
      <aside className="relative hidden flex-col justify-center bg-navy p-12 text-white md:flex md:w-1/2">
        <img src="/portals/tg/brand/samavesh-logo.svg" alt="SAMAVESH" className="h-16 w-16" />
        <h1 className="mt-6 text-4xl font-bold tracking-tight">National Portal for Transgender Persons</h1>
        <p className="mt-3 text-xl text-white/85">Officer &amp; Administration Console</p>
        <div className="my-6 h-1 w-64 rounded bg-saffron" />
        <p className="text-2xl font-bold leading-tight">Review. Verify. Certify.</p>
        <p className="mt-5 max-w-md text-base leading-relaxed text-white/75">
          Certificate-of-Identity applications flow through a maker → checker → District Magistrate
          approval chain, with SLA tracking end to end.
        </p>
        <div className="absolute inset-x-12 bottom-12 border-t border-white/15 pt-6">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-white/55">Signing Into</p>
          <p className="text-sm font-bold">TG Administration</p>
        </div>
      </aside>

      {/* Right form panel */}
      <main id="login-main" className="flex flex-1 items-center justify-center bg-surface-muted px-4 py-12 sm:px-6">
        <div className="w-full max-w-md">
          <div className="mb-6 flex items-center gap-2 text-navy">
            <ShieldCheck className="h-6 w-6" />
            <span className="rounded-full bg-navy/10 px-2.5 py-1 text-xs font-bold uppercase tracking-wide">
              Admin
            </span>
          </div>
          <h2 className="text-2xl font-bold text-ink">Officer / Admin Login</h2>
          <p className="mt-1 mb-6 text-sm text-ink-muted">
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
                <span className="mt-1.5 block text-xs text-ink-hint">Dev OTP: 123456</span>
              </Field>
            )}

            {error && <p className="text-sm font-medium text-reject-fg">{error}</p>}

            <Button type="submit" className="w-full">
              {otpSent ? "Verify OTP" : "Send OTP"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <p className="mt-8 text-center text-xs text-ink-hint">
            Ministry of Social Justice &amp; Empowerment, Government of India
          </p>
        </div>
      </main>

      <DemoFab accounts={DEMO_ACCOUNTS} devMode={process.env.NODE_ENV === "development"} />
    </div>
  );
}
