"use client";

// DS Audit:
//   Button           ✅ @mosje/design-system
//   Input            ✅ @mosje/design-system
//   FormField        ✅ @mosje/design-system
//   Alert            ✅ @mosje/design-system
//   PortalLoginShell ✅ @mosje/design-system (added this session)

import * as React from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/nmba/toast";
import { Alert, Button, FormField, Icon, Input, PortalLoginShell, type DemoFillDetail } from "@mosje/design-system";
import { accountFromMobile } from "@/lib/nmba/committee/masters";
import { massPledgeAccountFromMobile } from "@/lib/nmba/mass-pledge/masters";
import { PORTAL_SESSION_COOKIE, encodeSession } from "@/lib/nmba/committee/session";

const BASE = "/portals/nmba";

/** Landing route per role after sign-in. */
const LANDING: Record<string, string> = {
  ADMIN: `${BASE}/admin/dashboard`,
  STATE: `${BASE}/admin/napddr/state`,
  DISTRICT: `${BASE}/admin/napddr/district`,
  // Block and organisation logins exist for Mass Pledge only, so they land there.
  BLOCK: `${BASE}/admin/mass-pledge`,
  ENTITY: `${BASE}/admin/mass-pledge`,
};

const TABS = [
  { label: "Admin", href: `${BASE}/admin/login`, active: true },
  { label: "Patient Monitoring", href: `${BASE}/treatment-centre/login-otp`, active: false },
];

export default function AdminLoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [mobile, setMobile] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPw, setShowPw] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  // DemoDock prefill via the design-system CustomEvent.
  React.useEffect(() => {
    const handler = (e: Event) => {
      const { id, password: pw } = (e as CustomEvent<DemoFillDetail>).detail;
      setMobile(id);
      setPassword(pw);
    };
    window.addEventListener("demo:fill", handler);
    return () => window.removeEventListener("demo:fill", handler);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      const account = accountFromMobile(mobile) ?? massPledgeAccountFromMobile(mobile);
      if (account && password.length > 0) {
        document.cookie = `${PORTAL_SESSION_COOKIE}=${encodeSession(account.session)}; path=/; max-age=${60 * 60 * 8}`;
        toast("Logged in successfully.", "success");
        router.push(LANDING[account.session.role] ?? `${BASE}/admin/dashboard`);
      } else if (mobile.length === 10 && password.length > 0) {
        // Unknown-but-valid-looking number → default Admin (prototype convenience).
        document.cookie = `${PORTAL_SESSION_COOKIE}=mock-session-token; path=/; max-age=${60 * 60 * 8}`;
        toast("Logged in successfully.", "success");
        router.push(`${BASE}/admin/dashboard`);
      } else {
        setError("Invalid credentials. Please check your mobile number and password.");
      }
    }, 600);
  };

  return (
    <>
      <PortalLoginShell
        emblemSrc={`${BASE}/brand/national-emblem.svg`}
        digitalIndiaSrc={`${BASE}/brand/digital-india.svg`}
        samaveshLogoSrc={`${BASE}/brand/samavesh-logo.svg`}
        signingInto="Nasha Mukt Bharat Abhiyaan"
        tabs={TABS}
        onFooterLinkClick={() => toast("This page is coming soon.", "info")}
      >
        <h1 className="mb-1 text-headline-3 text-ink">Log in to your account</h1>
        <p className="mb-6 text-body-2 text-ink-muted">
          Enter your registered mobile number and password
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <FormField label="Mobile Number" id="mobile">
            {(control) => (
              <Input
                {...control}
                type="tel"
                inputMode="numeric"
                pattern="[0-9]{10}"
                maxLength={10}
                required
                placeholder="10-digit mobile number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                aria-describedby={error ? "login-error" : undefined}
                invalid={!!error}
              />
            )}
          </FormField>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label htmlFor="password" className="text-label-1 text-ink">
                Password
              </label>
              <button
                type="button"
                onClick={() => toast("This page is coming soon.", "info")}
                className="text-label-2 text-navy hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPw ? "text" : "password"}
                required
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                invalid={!!error}
                style={{ paddingRight: "var(--sa-padding-40)" }}
              />
              <button
                type="button"
                onClick={() => setShowPw((s) => !s)}
                aria-label={showPw ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-hint hover:text-ink"
              >
                {showPw ? <Icon name="visibility_off" size={16} /> : <Icon name="visibility" size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <Alert id="login-error" status="error">
              {error}
            </Alert>
          )}

          <Button
            type="submit"
            disabled={loading}
            iconLeft={loading ? undefined : <Icon name="login" size={16} />}
            style={{ marginTop: "var(--sa-stack-4)" }}
          >
            {loading ? "Signing in…" : "Sign In"}
          </Button>
        </form>

        <p className="mt-6 text-center text-body-3 text-ink-hint">
          For access issues, contact your State Nodal Officer or the NMBA helpdesk.
        </p>
      </PortalLoginShell>
    </>
  );
}
